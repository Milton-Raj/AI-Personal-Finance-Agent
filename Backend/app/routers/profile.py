from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

from ..database import get_db
from ..sql_models import User

router = APIRouter(
    prefix="/profile",
    tags=["profile"]
)

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[str] = None
    monthly_income: Optional[float] = None
    currency: Optional[str] = None

# Helper
def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

@router.get("/")
def get_profile(user_id: int = 1, db: Session = Depends(get_db)):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": str(user.id),
        "name": user.full_name,
        "email": user.email,
        "phone": user.phone or "+91 98765 43210",
        "profile_image": user.profile_image,
        "member_since": user.created_at,
        "dob": str(user.dob) if user.dob else None,
        "monthly_income": user.monthly_income,
        "is_premium_member": user.is_premium_member
    }

@router.put("/")
def update_profile(
    payload: ProfileUpdate,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if payload.name is not None:
        user.full_name = payload.name
    if payload.email is not None:
        user.email = payload.email
    if payload.phone is not None:
        user.phone = payload.phone
    if payload.dob is not None:
        try:
            user.dob = datetime.strptime(payload.dob, "%Y-%m-%d").date()
        except ValueError:
            pass # Ignore invalid date format for now
    if payload.monthly_income is not None:
        user.monthly_income = payload.monthly_income
    if payload.currency is not None:
        user.currency = payload.currency
    
    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    
    return {
        "id": str(user.id),
        "name": user.full_name,
        "email": user.email,
        "phone": user.phone,
        "profile_image": user.profile_image,
        "member_since": user.created_at,
        "dob": str(user.dob) if user.dob else None,
        "monthly_income": user.monthly_income,
        "is_premium_member": user.is_premium_member
    }

@router.post("/image")
def upload_profile_image(image_url: str, user_id: int = 1, db: Session = Depends(get_db)):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.profile_image = image_url
    db.commit()
    
    return {"status": "success", "image_url": image_url}

@router.post("/upgrade-membership")
def upgrade_membership(user_id: int = 1, db: Session = Depends(get_db)):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_premium_member = True
    db.commit()
    
    return {"status": "success", "message": "Membership upgraded"}

@router.get("/premium-status")
def get_premium_status(user_id: int = 1, db: Session = Depends(get_db)):
    user = get_user_by_id(db, user_id)
    if not user:
        return {"is_premium": False, "membership_type": "free"}
    
    return {
        "is_premium": user.is_premium_member,
        "membership_type": "premium" if user.is_premium_member else "free"
    }

@router.post("/payment/initiate")
def initiate_payment():
    order_id = f"order_{uuid.uuid4().hex[:12]}"
    amount = 500
    
    return {
        "order_id": order_id,
        "amount": amount * 100,
        "currency": "INR",
        "receipt": f"receipt_{uuid.uuid4().hex[:8]}",
        "status": "created"
    }

@router.post("/payment/verify")
def verify_payment(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    # Mock verification - in production, verify signature with Razorpay secret
    user = get_user_by_id(db, user_id)
    if user:
        user.is_premium_member = True
        db.commit()
    
    return {
        "success": True,
        "message": "Payment verified successfully",
        "is_premium": True
    }
