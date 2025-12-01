from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

from ..database import get_db
from ..sql_models import User, Transaction, Subscription, Category

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

# --- Pydantic Models ---
class UserListItem(BaseModel):
    id: int
    email: str
    full_name: str
    is_premium_member: bool
    created_at: str
    total_transactions: int
    total_spent: float

class DashboardStats(BaseModel):
    total_users: int
    premium_users: int
    total_transactions: int
    total_revenue: float
    active_subscriptions: int

# --- Endpoints ---
@router.get("/users", response_model=List[UserListItem])
def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db)
):
    """
    Get all users for admin panel
    """
    users = db.query(User).offset(skip).limit(limit).all()
    
    result = []
    for user in users:
        # Get transaction count and total spent
        tx_count = db.query(func.count(Transaction.id)).filter(
            Transaction.user_id == user.id
        ).scalar() or 0
        
        total_spent = db.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == user.id,
            Transaction.type == 'expense'
        ).scalar() or 0.0
        
        result.append(UserListItem(
            id=user.id,
            email=user.email,
            full_name=user.full_name or "Unknown",
            is_premium_member=user.is_premium_member or False,
            created_at=user.created_at.isoformat() if user.created_at else datetime.now().isoformat(),
            total_transactions=tx_count,
            total_spent=total_spent
        ))
    
    return result

@router.get("/transactions")
def get_all_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db)
):
    """
    Get all transactions for admin panel
    """
    transactions = db.query(Transaction).order_by(desc(Transaction.date)).offset(skip).limit(limit).all()
    
    result = []
    for tx in transactions:
        result.append({
            "id": tx.id,
            "user_id": tx.user_id,
            "amount": tx.amount,
            "merchant": tx.merchant_name,
            "category": tx.category.name if tx.category else "Uncategorized",
            "type": tx.type,
            "date": tx.date.isoformat() if tx.date else None,
            "created_at": tx.created_at.isoformat() if tx.created_at else None
        })
    
    return result

@router.get("/subscriptions")
def get_all_subscriptions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db)
):
    """
    Get all subscriptions for admin panel
    """
    subscriptions = db.query(Subscription).offset(skip).limit(limit).all()
    
    result = []
    for sub in subscriptions:
        result.append({
            "id": sub.id,
            "user_id": sub.user_id,
            "name": sub.name,
            "amount": sub.amount,
            "billing_cycle": sub.billing_cycle,
            "status": sub.status,
            "next_billing_date": sub.next_billing_date.isoformat() if sub.next_billing_date else None,
            "created_at": sub.created_at.isoformat() if sub.created_at else None
        })
    
    return result

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Get overall dashboard statistics
    """
    # Total users
    total_users = db.query(func.count(User.id)).scalar() or 0
    
    # Premium users
    premium_users = db.query(func.count(User.id)).filter(
        User.is_premium_member == True
    ).scalar() or 0
    
    # Total transactions
    total_transactions = db.query(func.count(Transaction.id)).scalar() or 0
    
    # Total revenue (sum of all expense transactions)
    total_revenue = db.query(func.sum(Transaction.amount)).filter(
        Transaction.type == 'expense'
    ).scalar() or 0.0
    
    # Active subscriptions
    active_subs = db.query(func.count(Subscription.id)).filter(
        Subscription.status == 'active'
    ).scalar() or 0
    
    return DashboardStats(
        total_users=total_users,
        premium_users=premium_users,
        total_transactions=total_transactions,
        total_revenue=total_revenue,
        active_subscriptions=active_subs
    )
