from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta

from ..database import get_db
from ..models import Transaction, Category, Subscription, PaymentMethod, User
from ..services.sms_parser import SMSParser

router = APIRouter(
    prefix="/mobile",
    tags=["mobile"]
)

sms_parser = SMSParser()

# --- Pydantic Models ---
class SMSRequest(BaseModel):
    sms_text: str
    user_id: int

class SMSResponse(BaseModel):
    status: str
    message: str
    data: Optional[dict] = None

class HomeDataResponse(BaseModel):
    total_monthly_expense: float
    top_categories: List[dict]
    recent_transactions: List[dict]
    recent_subscriptions: List[dict]

# --- Endpoints ---

@POST("/sms/process", response_model=SMSResponse)
def process_sms(request: SMSRequest, db: Session = Depends(get_db)):
    """
    Receives an SMS text, parses it, and stores the transaction/subscription.
    """
    try:
        # 1. Parse SMS
        parsed_data = sms_parser.parse(request.sms_text)
        
        if parsed_data['amount'] == 0:
             return SMSResponse(status="ignored", message="Could not extract valid amount")

        # 2. Find or Create Category
        category_name = parsed_data['category']
        category = db.query(Category).filter(
            Category.name == category_name, 
            (Category.user_id == request.user_id) | (Category.is_default == True)
        ).first()
        
        if not category:
            # Create a new custom category if not found
            # Assign a default color/icon for now
            category = Category(
                name=category_name,
                type='expense',
                user_id=request.user_id,
                icon='pricetag-outline', 
                color='#CCCCCC'
            )
            db.add(category)
            db.commit()
            db.refresh(category)

        # 3. Find or Create Payment Method
        payment_method_name = parsed_data['payment_method']
        payment_method = db.query(PaymentMethod).filter(
            PaymentMethod.user_id == request.user_id,
            PaymentMethod.type == payment_method_name.lower() if payment_method_name != 'Unknown' else None
        ).first()
        
        if not payment_method and payment_method_name != 'Unknown':
             payment_method = PaymentMethod(
                 user_id=request.user_id,
                 type=payment_method_name.lower(), # upi, card, wallet
                 identifier="Default", # Placeholder
                 name=payment_method_name
             )
             db.add(payment_method)
             db.commit()
             db.refresh(payment_method)
        
        payment_method_id = payment_method.id if payment_method else None

        # 4. Handle Subscription
        if parsed_data['is_subscription']:
            # Check if subscription already exists to avoid duplicates (simple check by name)
            existing_sub = db.query(Subscription).filter(
                Subscription.user_id == request.user_id,
                Subscription.name == parsed_data['merchant']
            ).first()
            
            if not existing_sub:
                new_subscription = Subscription(
                    user_id=request.user_id,
                    name=parsed_data['merchant'],
                    amount=parsed_data['amount'],
                    category_id=category.id,
                    payment_method_id=payment_method_id,
                    status='active',
                    next_billing_date=datetime.now() + timedelta(days=30) # Default to monthly
                )
                db.add(new_subscription)
                # Also record the transaction for this payment
        
        # 5. Create Transaction Record
        new_transaction = Transaction(
            user_id=request.user_id,
            amount=parsed_data['amount'],
            category_id=category.id,
            merchant_name=parsed_data['merchant'],
            payment_method_id=payment_method_id,
            date=parsed_data['date'],
            type='expense',
            note=f"Auto-detected via SMS from {parsed_data['merchant']}"
        )
        db.add(new_transaction)
        db.commit()
        
        return SMSResponse(
            status="success", 
            message="Transaction processed successfully",
            data=parsed_data
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@GET("/home", response_model=HomeDataResponse)
def get_home_data(user_id: int, db: Session = Depends(get_db)):
    """
    Aggregates data for the Mobile Home Page.
    """
    # 1. Total Monthly Expense
    today = datetime.now()
    start_of_month = datetime(today.year, today.month, 1)
    
    total_expense = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == user_id,
        Transaction.type == 'expense',
        Transaction.date >= start_of_month
    ).scalar() or 0.0

    # 2. Spending by Category (Top 3)
    # Group by category, sum amount, order by sum desc, limit 3
    top_categories_query = db.query(
        Category.name, 
        Category.color,
        func.sum(Transaction.amount).label('total')
    ).join(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.type == 'expense',
        Transaction.date >= start_of_month
    ).group_by(Category.id).order_by(desc('total')).limit(3).all()
    
    top_categories = [
        {"name": cat.name, "color": cat.color, "amount": cat.total} 
        for cat in top_categories_query
    ]

    # 3. Recent Transactions (Limit 2, Filter for 'Scan & Pay' / 'Wallet' context)
    # Note: The user asked for "camera scan and pay or wallet". 
    # In our schema, we can filter by payment_method type if available, or just show recent 2 expenses.
    # For now, showing recent 2 expenses.
    recent_transactions_query = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.type == 'expense'
    ).order_by(Transaction.date.desc()).limit(2).all()
    
    recent_transactions = [
        {
            "id": tx.id,
            "merchant": tx.merchant_name or "Unknown",
            "amount": tx.amount,
            "date": tx.date.isoformat(),
            "category": tx.category.name if tx.category else "Uncategorized"
        }
        for tx in recent_transactions_query
    ]

    # 4. Recent Subscriptions (Limit 2)
    recent_subs_query = db.query(Subscription).filter(
        Subscription.user_id == user_id,
        Subscription.status == 'active'
    ).order_by(Subscription.created_at.desc()).limit(2).all()
    
    recent_subscriptions = [
        {
            "id": sub.id,
            "name": sub.name,
            "amount": sub.amount,
            "billing_cycle": sub.billing_cycle
        }
        for sub in recent_subs_query
    ]

    return HomeDataResponse(
        total_monthly_expense=total_expense,
        top_categories=top_categories,
        recent_transactions=recent_transactions,
        recent_subscriptions=recent_subscriptions
    )
