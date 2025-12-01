from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import hashlib

from ..database import get_db
from ..sql_models import User, Transaction, Subscription, Category

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

# --- Pydantic Models ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    monthly_income: Optional[float] = None
    is_premium_member: bool = False

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    monthly_income: Optional[float] = None
    is_premium_member: Optional[bool] = None

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
def get_dashboard_stats(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    """
    Get overall dashboard statistics with optional date filtering
    """
    # Base queries
    user_query = db.query(func.count(User.id))
    premium_query = db.query(func.count(User.id)).filter(User.is_premium_member == True)
    tx_query = db.query(func.count(Transaction.id))
    revenue_query = db.query(func.sum(Transaction.amount)).filter(Transaction.type == 'expense')
    sub_query = db.query(func.count(Subscription.id)).filter(Subscription.status == 'active')

    # Apply date filters if provided
    if start_date:
        user_query = user_query.filter(User.created_at >= start_date)
        premium_query = premium_query.filter(User.created_at >= start_date)
        tx_query = tx_query.filter(Transaction.date >= start_date)
        revenue_query = revenue_query.filter(Transaction.date >= start_date)
        sub_query = sub_query.filter(Subscription.created_at >= start_date)
    
    if end_date:
        user_query = user_query.filter(User.created_at <= end_date)
        premium_query = premium_query.filter(User.created_at <= end_date)
        tx_query = tx_query.filter(Transaction.date <= end_date)
        revenue_query = revenue_query.filter(Transaction.date <= end_date)
        sub_query = sub_query.filter(Subscription.created_at <= end_date)

    # Execute queries
    total_users = user_query.scalar() or 0
    premium_users = premium_query.scalar() or 0
    total_transactions = tx_query.scalar() or 0
    total_revenue = revenue_query.scalar() or 0.0
    active_subs = sub_query.scalar() or 0
    
    return DashboardStats(
        total_users=total_users,
        premium_users=premium_users,
        total_transactions=total_transactions,
        total_revenue=total_revenue,
        active_subscriptions=active_subs
    )

# --- User CRUD Endpoints ---
def hash_password(password: str) -> str:
    """Simple password hashing"""
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/users")
def create_user(request: UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    new_user = User(
        email=request.email,
        password_hash=hash_password(request.password),
        full_name=request.full_name,
        phone=request.phone,
        monthly_income=request.monthly_income,
        is_premium_member=request.is_premium_member,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User created successfully", "user_id": new_user.id}

@router.get("/users/{user_id}")
def get_user_detail(user_id: int, db: Session = Depends(get_db)):
    """Get user details"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "phone": user.phone,
        "monthly_income": user.monthly_income,
        "is_premium_member": user.is_premium_member,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }

@router.put("/users/{user_id}")
def update_user(user_id: int, request: UserUpdate, db: Session = Depends(get_db)):
    """Update user"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if request.email is not None:
        user.email = request.email
    if request.full_name is not None:
        user.full_name = request.full_name
    if request.phone is not None:
        user.phone = request.phone
    if request.monthly_income is not None:
        user.monthly_income = request.monthly_income
    if request.is_premium_member is not None:
        user.is_premium_member = request.is_premium_member
    
    user.updated_at = datetime.now()
    db.commit()
    
    return {"message": "User updated successfully"}

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete user"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}
