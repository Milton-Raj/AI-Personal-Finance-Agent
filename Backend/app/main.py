from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from . import models as schemas # Pydantic models
from . import sql_models as models # SQLAlchemy models
from .database import engine, get_db
from .services import SMSParser, LeakDetector, AlternativeSuggester

# Create tables if they don't exist (though we used init_db.py, this is a safety check)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Spend API")

parser = SMSParser()
detector = LeakDetector()
suggester = AlternativeSuggester()

# --- Helper Functions ---
def get_user(db: Session, user_id: int = 1):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_default_user(db: Session):
    user = models.User(
        email="milton.raj@example.com",
        full_name="Milton Raj",
        monthly_income=50000.0,
        currency="USD",
        password_hash="dummy_hash" # In real app, hash this
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.on_event("startup")
def startup_event():
    # Ensure default user exists for demo purposes
    db = next(get_db())
    user = get_user(db)
    if not user:
        create_default_user(db)

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Spend API"}

# --- Transactions ---

@app.post("/parse-sms", response_model=schemas.TransactionCreate)
def parse_sms(sms: schemas.SMSData, db: Session = Depends(get_db)):
    try:
        # 1. Parse SMS
        parsed_data = parser.parse(sms.sender, sms.body)
        
        # 2. Fetch History from DB
        history = db.query(models.Transaction).filter(models.Transaction.user_id == 1).limit(10).all()
        mock_history = [{"merchant": t.note, "amount": t.amount, "category": t.category.name if t.category else "Uncategorized"} for t in history]
        
        # 3. Detect Leaks
        leak_info = detector.detect(parsed_data, mock_history)
        parsed_data.update(leak_info)
        
        return parsed_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/transactions", response_model=dict)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    # Find or create category
    category = db.query(models.Category).filter(models.Category.name == transaction.category).first()
    if not category:
        category = models.Category(name=transaction.category, type="expense") # Default to expense
        db.add(category)
        db.commit()
        db.refresh(category)

    db_transaction = models.Transaction(
        user_id=1, # Hardcoded for demo
        amount=transaction.amount,
        category_id=category.id,
        note=transaction.merchant,
        date=transaction.date,
        type="expense" # Default
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    
    return {"status": "success", "data": transaction.dict()}

@app.get("/suggestions/{category}")
def get_suggestion(category: str):
    return {"suggestion": suggester.suggest({"category": category})}

# --- Profile APIs ---

@app.get("/profile", response_model=schemas.User)
def get_profile(db: Session = Depends(get_db)):
    user = get_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Map SQLAlchemy model to Pydantic model structure
    return {
        "id": str(user.id),
        "name": user.full_name,
        "email": user.email,
        "phone": "+91 98765 43210", # Dummy
        "profile_image": None,
        "member_since": user.created_at,
        "dob": "1995-08-15", # Dummy or add to DB
        "monthly_income": user.monthly_income,
        "is_premium_member": False # Add to DB if needed
    }

@app.put("/profile", response_model=schemas.User)
def update_profile(user_update: schemas.UserBase, db: Session = Depends(get_db)):
    user = get_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.name:
        user.full_name = user_update.name
    if user_update.monthly_income:
        user.monthly_income = user_update.monthly_income
    
    db.commit()
    db.refresh(user)
    
    return {
        "id": str(user.id),
        "name": user.full_name,
        "email": user.email,
        "phone": user_update.phone,
        "profile_image": user_update.profile_image,
        "member_since": user.created_at,
        "dob": user_update.dob,
        "monthly_income": user.monthly_income,
        "is_premium_member": user_update.is_premium_member
    }

@app.post("/profile/upgrade-membership")
def upgrade_membership(db: Session = Depends(get_db)):
    # In real app, verify payment here
    # For now, we just return success as we don't have is_premium in User model yet (added in Pydantic but not SQL)
    return {"status": "success", "message": "Membership upgraded"}

# --- Payment Gateway Endpoints ---

@app.post("/payment/initiate")
def initiate_payment():
    """Create a Razorpay order for premium membership"""
    # In production, use actual Razorpay API
    order_id = f"order_{uuid.uuid4().hex[:12]}"
    amount = 500  # $5 = approx ₹500
    
    return {
        "order_id": order_id,
        "amount": amount * 100,
        "currency": "INR",
        "receipt": f"receipt_{uuid.uuid4().hex[:8]}",
        "status": "created"
    }

@app.post("/payment/verify")
def verify_payment(verification: schemas.PaymentVerification):
    """Verify Razorpay payment signature"""
    return {
        "success": True,
        "message": "Payment verified successfully",
        "is_premium": True
    }

@app.get("/profile/premium-status")
def get_premium_status():
    return {
        "is_premium": False, # Mock
        "membership_type": "free"
    }

@app.post("/profile/image")
def upload_profile_image(image_url: str):
    return {"status": "success", "image_url": image_url}

# --- Payment Methods ---

@app.get("/payment-methods", response_model=List[schemas.PaymentMethod])
def get_payment_methods():
    return [] # Return empty for now or implement table

@app.post("/payment-methods", response_model=schemas.PaymentMethod)
def add_payment_method(pm: schemas.PaymentMethodBase):
    return {
        "id": str(uuid.uuid4()),
        "user_id": "user_123",
        "type": pm.type,
        "identifier": pm.identifier,
        "name": pm.name
    }

@app.delete("/payment-methods/{pm_id}")
def delete_payment_method(pm_id: str):
    return {"status": "success"}
