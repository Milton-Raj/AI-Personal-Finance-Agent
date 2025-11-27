from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TransactionBase(BaseModel):
    amount: float
    merchant: str
    category: str
    date: datetime
    type: str  # 'debit' or 'credit'
    is_leak: bool = False
    leak_severity: Optional[str] = None
    leak_reason: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True

class SubscriptionBase(BaseModel):
    name: str
    amount: float
    frequency: str  # 'monthly', 'yearly'
    next_billing: datetime
    status: str = 'active'

class Subscription(SubscriptionBase):
    id: str
    user_id: str
    
class SMSData(BaseModel):
    sender: str
    body: str
    timestamp: int

class UserBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    dob: Optional[str] = None
    monthly_income: Optional[float] = None
    is_premium_member: bool = False

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    member_since: datetime
    
    class Config:
        from_attributes = True

class PaymentMethodBase(BaseModel):
    type: str # 'upi', 'card'
    identifier: str # upi_id or card_last_4
    name: Optional[str] = None # 'GPay', 'HDFC'

class PaymentMethod(PaymentMethodBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True

# Payment Gateway Models
class PaymentOrder(BaseModel):
    order_id: str
    amount: float
    currency: str = "INR"
    receipt: str
    status: str = "created"

class PaymentVerification(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class PremiumUpgradeResponse(BaseModel):
    success: bool
    message: str
    is_premium: bool

    class Config:
        from_attributes = True
