from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from ..database import get_db
from ..sql_models import PaymentMethod, User

router = APIRouter(
    prefix="/payment-methods",
    tags=["payment-methods"]
)

class PaymentMethodCreate(BaseModel):
    type: str  # e.g., 'upi', 'card', 'bank'
    identifier: str  # e.g., UPI ID, card number (masked), bank account
    name: Optional[str] = None
    is_default: Optional[bool] = False

class PaymentMethodResponse(BaseModel):
    id: int
    type: str
    identifier: str
    name: Optional[str]
    is_default: bool

    class Config:
        orm_mode = True

# Helper to get user (placeholder: using user_id=1 for demo)
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/", response_model=List[PaymentMethodResponse])
def list_payment_methods(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(PaymentMethod).filter(PaymentMethod.user_id == user.id).all()

@router.post("/", response_model=PaymentMethodResponse, status_code=status.HTTP_201_CREATED)
def create_payment_method(payload: PaymentMethodCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pm = PaymentMethod(
        user_id=user.id,
        type=payload.type,
        identifier=payload.identifier,
        name=payload.name,
        is_default=payload.is_default or False,
    )
    db.add(pm)
    db.commit()
    db.refresh(pm)
    return pm

@router.delete("/{pm_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payment_method(pm_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pm = db.query(PaymentMethod).filter(PaymentMethod.id == pm_id, PaymentMethod.user_id == user.id).first()
    if not pm:
        raise HTTPException(status_code=404, detail="Payment method not found")
    db.delete(pm)
    db.commit()
    return None
