from fastapi import FastAPI, HTTPException
from .models import SMSData, Transaction, TransactionCreate
from .services import SMSParser, LeakDetector, AlternativeSuggester
from .database import supabase
from typing import List

app = FastAPI(title="AI Personal Finance Fixer API")

parser = SMSParser()
detector = LeakDetector()
suggester = AlternativeSuggester()

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Personal Finance Fixer API"}

@app.post("/parse-sms", response_model=TransactionCreate)
def parse_sms(sms: SMSData):
    try:
        # 1. Parse SMS
        parsed_data = parser.parse(sms.sender, sms.body)
        
        # 2. Mock History (In real app, fetch from DB)
        mock_history = [
            {"merchant": "Netflix", "amount": 199, "category": "Subscriptions"},
            {"merchant": "Starbucks", "amount": 350, "category": "Food & Dining"},
        ]
        
        # 3. Detect Leaks
        leak_info = detector.detect(parsed_data, mock_history)
        parsed_data.update(leak_info)
        
        return parsed_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/transactions", response_model=dict)
def create_transaction(transaction: TransactionCreate):
    # Save to Supabase
    data = transaction.dict()
    data["date"] = data["date"].isoformat()
    
    # response = supabase.table("transactions").insert(data).execute()
    # return response.data[0]
    
    # Mock response for now since we don't have real DB connection
    return {"status": "success", "data": data}

@app.get("/suggestions/{category}")
def get_suggestion(category: str):
    return {"suggestion": suggester.suggest({"category": category})}

# --- Profile APIs ---

from .models import User, UserBase, PaymentMethod, PaymentMethodBase
import uuid

# Mock Data Storage
mock_user_db = {
    "id": "user_123",
    "name": "Milton Raj",
    "email": "milton.raj@example.com",
    "phone": "+91 98765 43210",
    "profile_image": None,
    "member_since": "2024-01-01T00:00:00",
    "dob": "1995-08-15",
    "monthly_income": 50000.0,
    "is_premium_member": False
}

mock_payment_methods_db = [
    {"id": "pm_1", "user_id": "user_123", "type": "upi", "identifier": "milton@okhdfcbank", "name": "Google Pay"},
    {"id": "pm_2", "user_id": "user_123", "type": "card", "identifier": "4242", "name": "HDFC Credit Card"}
]

@app.get("/profile", response_model=User)
def get_profile():
    return mock_user_db

@app.put("/profile", response_model=User)
def update_profile(user_update: UserBase):
    mock_user_db.update(user_update.dict(exclude_unset=True))
    return mock_user_db

@app.post("/profile/upgrade-membership")
def upgrade_membership():
    # In real app, verify payment here
    mock_user_db["is_premium_member"] = True
    return {"status": "success", "message": "Membership upgraded"}

# Payment Gateway Endpoints
@app.post("/payment/initiate")
def initiate_payment():
    """Create a Razorpay order for premium membership"""
    import uuid
    import hashlib
    
    # In production, use actual Razorpay API
    order_id = f"order_{uuid.uuid4().hex[:12]}"
    amount = 500  # $5 = approx ₹500 (in paise for Razorpay = 50000)
    
    # Mock Razorpay order response
    order_data = {
        "order_id": order_id,
        "amount": amount * 100,  # Convert to paise
        "currency": "INR",
        "receipt": f"receipt_{uuid.uuid4().hex[:8]}",
        "status": "created"
    }
    
    return order_data

@app.post("/payment/verify")
def verify_payment(verification: models.PaymentVerification):
    """Verify Razorpay payment signature"""
    import hmac
    import hashlib
    
    # In production, use actual Razorpay secret key
    # For now, we'll just mock the verification
    
    # Mock verification - in real app, verify signature
    # generated_signature = hmac.new(
    #     key=RAZORPAY_SECRET.encode(),
    #     msg=f"{verification.razorpay_order_id}|{verification.razorpay_payment_id}".encode(),
    #     digestmod=hashlib.sha256
    # ).hexdigest()
    
    # For demo, always return success
    mock_user_db["is_premium_member"] = True
    
    return {
        "success": True,
        "message": "Payment verified successfully",
        "is_premium": True
    }

@app.get("/profile/premium-status")
def get_premium_status():
    """Check if user has premium membership"""
    return {
        "is_premium": mock_user_db.get("is_premium_member", False),
        "membership_type": "lifetime" if mock_user_db.get("is_premium_member") else "free"
    }

@app.post("/profile/image")
def upload_profile_image(image_url: str): # In real app, handle file upload
    mock_user_db["profile_image"] = image_url
    return {"status": "success", "image_url": image_url}

@app.get("/payment-methods", response_model=List[PaymentMethod])
def get_payment_methods():
    return mock_payment_methods_db

@app.post("/payment-methods", response_model=PaymentMethod)
def add_payment_method(pm: PaymentMethodBase):
    new_pm = pm.dict()
    new_pm["id"] = str(uuid.uuid4())
    new_pm["user_id"] = "user_123"
    mock_payment_methods_db.append(new_pm)
    return new_pm

@app.delete("/payment-methods/{pm_id}")
def delete_payment_method(pm_id: str):
    global mock_payment_methods_db
    mock_payment_methods_db = [pm for pm in mock_payment_methods_db if pm["id"] != pm_id]
    return {"status": "success"}

