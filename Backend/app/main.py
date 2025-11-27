from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime, timedelta
import hashlib
import secrets

from . import models as schemas # Pydantic models
from . import sql_models as models # SQLAlchemy models
from .database import engine, get_db
from .services import SMSParser, LeakDetector, AlternativeSuggester

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Spend API")

parser = SMSParser()
detector = LeakDetector()
suggester = AlternativeSuggester()

# --- Helper Functions ---
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_session_token() -> str:
    return secrets.token_urlsafe(32)

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

@app.on_event("startup")
def startup_event():
    # Ensure default user exists for demo purposes
    db = next(get_db())
    user = get_user_by_email(db, "milton.raj@example.com")
    if not user:
        user = models.User(
            email="milton.raj@example.com",
            full_name="Milton Raj",
            monthly_income=50000.0,
            currency="USD",
            password_hash=hash_password("password123")
        )
        db.add(user)
        db.commit()

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Spend API"}

# --- Authentication Endpoints ---

@app.post("/auth/register")
def register(name: str, email: str, password: str, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = get_user_by_email(db, email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = models.User(
        email=email,
        full_name=name,
        password_hash=hash_password(password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create session
    session_token = create_session_token()
    session = models.AuthSession(
        user_id=user.id,
        session_token=session_token,
        expires_at=datetime.utcnow() + timedelta(days=30)
    )
    db.add(session)
    db.commit()
    
    return {
        "session_token": session_token,
        "user": {
            "id": user.id,
            "name": user.full_name,
            "email": user.email
        }
    }

@app.post("/auth/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email)
    if not user or user.password_hash != hash_password(password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create session
    session_token = create_session_token()
    session = models.AuthSession(
        user_id=user.id,
        session_token=session_token,
        expires_at=datetime.utcnow() + timedelta(days=30)
    )
    db.add(session)
    db.commit()
    
    return {
        "session_token": session_token,
        "user": {
            "id": user.id,
            "name": user.full_name,
            "email": user.email,
            "is_premium": user.is_premium_member
        }
    }

@app.post("/auth/logout")
def logout(session_token: str, db: Session = Depends(get_db)):
    session = db.query(models.AuthSession).filter(
        models.AuthSession.session_token == session_token
    ).first()
    
    if session:
        session.is_active = False
        db.commit()
    
    return {"message": "Logged out successfully"}

# --- Profile Endpoints ---

@app.get("/profile")
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

@app.put("/profile")
def update_profile(
    name: str = None,
    email: str = None,
    phone: str = None,
    dob: str = None,
    monthly_income: float = None,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if name:
        user.full_name = name
    if email:
        user.email = email
    if phone:
        user.phone = phone
    if dob:
        user.dob = datetime.strptime(dob, "%Y-%m-%d").date()
    if monthly_income:
        user.monthly_income = monthly_income
    
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

@app.post("/profile/image")
def upload_profile_image(image_url: str, user_id: int = 1, db: Session = Depends(get_db)):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.profile_image = image_url
    db.commit()
    
    return {"status": "success", "image_url": image_url}

# --- Payment Methods Endpoints ---

@app.get("/payment-methods")
def get_payment_methods(user_id: int = 1, db: Session = Depends(get_db)):
    methods = db.query(models.PaymentMethod).filter(
        models.PaymentMethod.user_id == user_id
    ).all()
    
    return [{
        "id": str(pm.id),
        "user_id": str(pm.user_id),
        "type": pm.type,
        "identifier": pm.identifier,
        "name": pm.name
    } for pm in methods]

@app.post("/payment-methods")
def add_payment_method(
    type: str,
    identifier: str,
    name: str = None,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    pm = models.PaymentMethod(
        user_id=user_id,
        type=type,
        identifier=identifier,
        name=name or type.upper()
    )
    db.add(pm)
    db.commit()
    db.refresh(pm)
    
    return {
        "id": str(pm.id),
        "user_id": str(pm.user_id),
        "type": pm.type,
        "identifier": pm.identifier,
        "name": pm.name
    }

@app.delete("/payment-methods/{pm_id}")
def delete_payment_method(pm_id: int, db: Session = Depends(get_db)):
    pm = db.query(models.PaymentMethod).filter(models.PaymentMethod.id == pm_id).first()
    if pm:
        db.delete(pm)
        db.commit()
    return {"status": "success"}

# --- Premium/Payment Endpoints ---

@app.post("/profile/upgrade-membership")
def upgrade_membership(user_id: int = 1, db: Session = Depends(get_db)):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_premium_member = True
    db.commit()
    
    return {"status": "success", "message": "Membership upgraded"}

@app.get("/profile/premium-status")
def get_premium_status(user_id: int = 1, db: Session = Depends(get_db)):
    user = get_user_by_id(db, user_id)
    if not user:
        return {"is_premium": False, "membership_type": "free"}
    
    return {
        "is_premium": user.is_premium_member,
        "membership_type": "lifetime" if user.is_premium_member else "free"
    }

@app.post("/payment/initiate")
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

@app.post("/payment/verify")
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

# --- Transaction Endpoints ---

@app.post("/parse-sms")
def parse_sms(sender: str, body: str, timestamp: int, db: Session = Depends(get_db)):
    try:
        parsed_data = parser.parse(sender, body)
        
        # Fetch history from DB
        history = db.query(models.Transaction).filter(models.Transaction.user_id == 1).limit(10).all()
        mock_history = [{"merchant": t.note, "amount": t.amount, "category": t.category.name if t.category else "Uncategorized"} for t in history]
        
        leak_info = detector.detect(parsed_data, mock_history)
        parsed_data.update(leak_info)
        
        return parsed_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/transactions")
def create_transaction(
    amount: float,
    merchant: str,
    category: str,
    date: str,
    type: str = "expense",
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    # Find or create category
    cat = db.query(models.Category).filter(models.Category.name == category).first()
    if not cat:
        cat = models.Category(name=category, type=type)
        db.add(cat)
        db.commit()
        db.refresh(cat)

    transaction = models.Transaction(
        user_id=user_id,
        amount=amount,
        category_id=cat.id,
        note=merchant,
        date=datetime.fromisoformat(date),
        type=type
    )
    db.add(transaction)
    db.commit()
    
    return {"status": "success", "data": {"amount": amount, "merchant": merchant}}

@app.get("/suggestions/{category}")
def get_suggestion(category: str):
    return {"suggestion": suggester.suggest({"category": category})}
