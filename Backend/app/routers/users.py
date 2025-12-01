from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from ..database import get_db
from ..sql_models import User, Transaction, Subscription

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

# --- Pydantic Models ---
class UserProfileResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str]
    profile_image: Optional[str]
    dob: Optional[str]
    monthly_income: Optional[float]
    currency: str
    is_premium_member: bool
    created_at: str

class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    dob: Optional[str] = None
    monthly_income: Optional[float] = None
    currency: Optional[str] = None

class UserStatsResponse(BaseModel):
    total_transactions: int
    total_spent: float
    active_subscriptions: int
    total_subscription_cost: float

# --- Endpoints ---
@router.get("/{user_id}", response_model=UserProfileResponse)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    """
    Get user profile by ID
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserProfileResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name or "",
        phone=user.phone,
        profile_image=user.profile_image,
        dob=str(user.dob) if user.dob else None,
        monthly_income=user.monthly_income,
        currency=user.currency or "USD",
        is_premium_member=user.is_premium_member or False,
        created_at=user.created_at.isoformat() if user.created_at else datetime.now().isoformat()
    )

@router.put("/{user_id}")
def update_user_profile(user_id: int, request: UpdateProfileRequest, db: Session = Depends(get_db)):
    """
    Update user profile
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields if provided
    if request.full_name is not None:
        user.full_name = request.full_name
    if request.phone is not None:
        user.phone = request.phone
    if request.profile_image is not None:
        user.profile_image = request.profile_image
    if request.dob is not None:
        user.dob = request.dob
    if request.monthly_income is not None:
        user.monthly_income = request.monthly_income
    if request.currency is not None:
        user.currency = request.currency
    
    user.updated_at = datetime.now()
    
    db.commit()
    db.refresh(user)
    
    return {"message": "Profile updated successfully", "user_id": user.id}

@router.get("/{user_id}/stats", response_model=UserStatsResponse)
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    """
    Get user statistics for admin panel
    """
    # Total transactions
    total_transactions = db.query(func.count(Transaction.id)).filter(
        Transaction.user_id == user_id
    ).scalar() or 0
    
    # Total spent
    total_spent = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == user_id,
        Transaction.type == 'expense'
    ).scalar() or 0.0
    
    # Active subscriptions
    active_subs = db.query(func.count(Subscription.id)).filter(
        Subscription.user_id == user_id,
        Subscription.status == 'active'
    ).scalar() or 0
    
    # Total subscription cost
    sub_cost = db.query(func.sum(Subscription.amount)).filter(
        Subscription.user_id == user_id,
        Subscription.status == 'active'
    ).scalar() or 0.0
    
    return UserStatsResponse(
        total_transactions=total_transactions,
        total_spent=total_spent,
        active_subscriptions=active_subs,
        total_subscription_cost=sub_cost
    )
