from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import uuid
from datetime import datetime, timedelta
import random
import hashlib
import secrets

from . import models as schemas # Pydantic models
from . import sql_models as models # SQLAlchemy models
from .database import engine, get_db
from .services import SMSParser, LeakDetector, AlternativeSuggester

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, users, transactions, budgets, goals, categories, analytics, admin, mobile, coins, notifications

app = FastAPI(title="AI Personal Finance API")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(transactions.router)
app.include_router(budgets.router)
app.include_router(goals.router)
app.include_router(categories.router)
app.include_router(analytics.router)
app.include_router(admin.router)
app.include_router(mobile.router)
app.include_router(coins.router)
app.include_router(notifications.router)

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

# ==========================================
# ADMIN PANEL ENDPOINTS
# ==========================================

@app.get("/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    try:
        total_users = db.query(models.User).count()
        premium_users = db.query(models.User).filter(models.User.is_premium_member == True).count()
        total_transactions = db.query(models.Transaction).count()
        
        # Calculate total revenue (assuming $5 per premium user)
        total_revenue = premium_users * 5.0
        
        # Active sessions (mocked for now)
        active_sessions = db.query(models.AuthSession).filter(models.AuthSession.expires_at > datetime.utcnow()).count()

        return {
            "total_users": total_users,
            "premium_users": premium_users,
            "total_transactions": total_transactions,
            "total_revenue": total_revenue,
            "active_sessions": active_sessions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/users")
def get_admin_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@app.get("/admin/transactions")
def get_admin_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transactions = db.query(models.Transaction).order_by(models.Transaction.date.desc()).offset(skip).limit(limit).all()
    return transactions

@app.get("/admin/revenue-chart")
def get_revenue_chart(db: Session = Depends(get_db)):
    # Mock data for the chart
    return [
        {"name": "Mon", "value": 120},
        {"name": "Tue", "value": 200},
        {"name": "Wed", "value": 150},
        {"name": "Thu", "value": 300},
        {"name": "Fri", "value": 250},
        {"name": "Sat", "value": 400},
        {"name": "Sun", "value": 380},
    ]

# ==========================================
# PREMIUM DASHBOARD ENDPOINTS
# ==========================================

@app.get("/admin/activity-feed")
def get_activity_feed(limit: int = 50, db: Session = Depends(get_db)):
    """Get recent activity feed for dashboard"""
    try:
        activities = db.query(models.ActivityLog).order_by(
            models.ActivityLog.created_at.desc()
        ).limit(limit).all()
        
        # If no activities, generate some mock data
        if not activities:
            return [
                {"id": 1, "user_id": 1, "action_type": "signup", "description": "New user registered", "created_at": datetime.utcnow().isoformat()},
                {"id": 2, "user_id": 2, "action_type": "purchase", "description": "Premium theme purchased", "created_at": datetime.utcnow().isoformat()},
                {"id": 3, "user_id": 3, "action_type": "transaction", "description": "Added $500 expense", "created_at": datetime.utcnow().isoformat()},
            ]
        
        return activities
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/top-performers")
def get_top_performers(db: Session = Depends(get_db)):
    """Get top users and products"""
    try:
        # Top users by transaction count
        top_users = db.query(
            models.User.id,
            models.User.full_name,
            models.User.email,
            models.User.profile_image,
            models.User.is_premium_member
        ).join(models.Transaction).group_by(models.User.id).order_by(
            func.count(models.Transaction.id).desc()
        ).limit(5).all()
        
        # Mock data if no users
        if not top_users:
            top_users = [
                {"id": 1, "full_name": "John Doe", "email": "john@example.com", "total_spent": 5000, "rank": 1},
                {"id": 2, "full_name": "Jane Smith", "email": "jane@example.com", "total_spent": 4500, "rank": 2},
                {"id": 3, "full_name": "Bob Johnson", "email": "bob@example.com", "total_spent": 3800, "rank": 3},
            ]
        
        return {
            "top_users": top_users,
            "top_products": [
                {"id": 1, "name": "Premium Theme Pack", "sales": 234, "revenue": 117000},
                {"id": 2, "name": "Ad-Free Experience", "sales": 189, "revenue": 56700},
                {"id": 3, "name": "Export to CSV", "sales": 156, "revenue": 15600},
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/alerts")
def get_alerts(db: Session = Depends(get_db)):
    """Get active alerts and insights"""
    try:
        alerts = db.query(models.Alert).filter(
            models.Alert.is_dismissed == False
        ).order_by(models.Alert.created_at.desc()).limit(10).all()
        
        # Generate smart alerts if none exist
        if not alerts:
            return [
                {
                    "id": 1,
                    "type": "success",
                    "title": "Revenue Milestone",
                    "message": "Congratulations! You've crossed $50,000 in revenue this month.",
                    "severity": "low",
                    "created_at": datetime.utcnow().isoformat()
                },
                {
                    "id": 2,
                    "type": "warning",
                    "title": "User Churn Alert",
                    "message": "5 premium users downgraded in the last 24 hours. Review retention strategy.",
                    "severity": "medium",
                    "created_at": datetime.utcnow().isoformat()
                },
                {
                    "id": 3,
                    "type": "info",
                    "title": "New Feature Suggestion",
                    "message": "Based on user feedback, consider adding dark mode to the mobile app.",
                    "severity": "low",
                    "created_at": datetime.utcnow().isoformat()
                }
            ]
        
        return alerts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/alerts/{alert_id}/dismiss")
def dismiss_alert(alert_id: int, db: Session = Depends(get_db)):
    """Dismiss an alert"""
    try:
        alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        alert.is_dismissed = True
        db.commit()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/revenue-breakdown")
def get_revenue_breakdown(db: Session = Depends(get_db)):
    """Get revenue breakdown by source"""
    try:
        # Calculate actual revenue from premium users
        premium_count = db.query(models.User).filter(models.User.is_premium_member == True).count()
        premium_revenue = premium_count * 5.0  # $5 per premium user
        
        return {
            "sources": [
                {"name": "Premium Subscriptions", "value": premium_revenue, "percentage": 65, "color": "#60a5fa"},
                {"name": "Product Sales", "value": 15000, "percentage": 25, "color": "#34d399"},
                {"name": "Advertisements", "value": 6000, "percentage": 10, "color": "#fbbf24"}
            ],
            "total": premium_revenue + 15000 + 6000
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/quick-stats")
def get_quick_stats(db: Session = Depends(get_db)):
    """Get quick stats for ticker"""
    try:
        total_users = db.query(models.User).count()
        premium_users = db.query(models.User).filter(models.User.is_premium_member == True).count()
        total_transactions = db.query(models.Transaction).count()
        
        return {
            "stats": [
                {"label": "Total Users", "value": total_users, "icon": "users"},
                {"label": "Premium Members", "value": premium_users, "icon": "star"},
                {"label": "Transactions Today", "value": total_transactions, "icon": "activity"},
                {"label": "Revenue This Month", "value": "$45,231", "icon": "dollar"},
                {"label": "Active Sessions", "value": "1,234", "icon": "zap"},
                {"label": "Conversion Rate", "value": "12.5%", "icon": "trending-up"}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# ANALYTICS PAGE ENDPOINTS
# ==========================================

@app.get("/admin/analytics/forecast")
def get_analytics_forecast(db: Session = Depends(get_db)):
    """Get predictive analytics and forecasts"""
    try:
        # Generate 30-day revenue forecast
        base_revenue = 45000
        revenue_forecast = []
        for i in range(30):
            trend = base_revenue * (1 + (i * 0.02))  # 2% daily growth
            variance = trend * 0.1  # 10% variance
            revenue_forecast.append({
                "day": i + 1,
                "predicted": round(trend + (random.random() - 0.5) * variance, 2),
                "lower_bound": round(trend - variance, 2),
                "upper_bound": round(trend + variance, 2)
            })
        
        # User growth projection
        current_users = db.query(models.User).count()
        user_forecast = []
        for i in range(30):
            growth = current_users * (1 + (i * 0.015))  # 1.5% daily growth
            user_forecast.append({
                "day": i + 1,
                "predicted": int(growth),
                "confidence": round(95 - (i * 0.5), 1)  # Decreasing confidence
            })
        
        return {
            "revenue_forecast": revenue_forecast,
            "user_growth": user_forecast,
            "insights": [
                {"type": "positive", "message": "Revenue trending upward with 95% confidence"},
                {"type": "info", "message": "Expected to reach $60K by end of month"},
                {"type": "warning", "message": "User growth may slow down in week 3"}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/analytics/cohorts")
def get_cohort_analysis(db: Session = Depends(get_db)):
    """Get cohort analysis data"""
    try:
        # Generate cohort retention data
        cohorts = []
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        
        for i, month in enumerate(months):
            retention = []
            for week in range(12):
                # Simulate retention decay
                base_retention = 100 - (week * 8)
                retention.append(max(10, base_retention + random.randint(-10, 10)))
            
            cohorts.append({
                "cohort": month,
                "size": random.randint(100, 500),
                "retention": retention,
                "premium_conversion": round(random.uniform(10, 25), 1),
                "ltv": round(random.uniform(50, 150), 2)
            })
        
        return {
            "cohorts": cohorts,
            "summary": {
                "avg_retention_week_1": 92,
                "avg_retention_week_4": 68,
                "avg_retention_week_12": 45,
                "best_cohort": "March",
                "avg_premium_conversion": 17.5
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/analytics/goals")
def get_goals(db: Session = Depends(get_db)):
    """Get business goals and progress"""
    try:
        total_users = db.query(models.User).count()
        premium_users = db.query(models.User).filter(models.User.is_premium_member == True).count()
        
        return {
            "goals": [
                {
                    "id": 1,
                    "name": "Monthly Revenue",
                    "target": 50000,
                    "current": 45231,
                    "unit": "$",
                    "progress": 90.5,
                    "status": "on_track",
                    "deadline": "2025-11-30"
                },
                {
                    "id": 2,
                    "name": "New Users",
                    "target": 1000,
                    "current": total_users,
                    "unit": "users",
                    "progress": (total_users / 1000) * 100,
                    "status": "on_track",
                    "deadline": "2025-11-30"
                },
                {
                    "id": 3,
                    "name": "Premium Conversions",
                    "target": 200,
                    "current": premium_users,
                    "unit": "users",
                    "progress": (premium_users / 200) * 100,
                    "status": "ahead",
                    "deadline": "2025-11-30"
                },
                {
                    "id": 4,
                    "name": "User Engagement",
                    "target": 75,
                    "current": 68,
                    "unit": "%",
                    "progress": 90.7,
                    "status": "at_risk",
                    "deadline": "2025-11-30"
                }
            ],
            "achievements": [
                {"name": "First 1000 Users", "unlocked": True, "date": "2025-10-15"},
                {"name": "$10K Revenue", "unlocked": True, "date": "2025-10-20"},
                {"name": "100 Premium Users", "unlocked": True, "date": "2025-11-01"},
                {"name": "$50K Revenue", "unlocked": False, "date": None}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/analytics/goals")
def create_goal(goal_data: dict, db: Session = Depends(get_db)):
    """Create or update a goal"""
    try:
        # In a real implementation, save to database
        return {"status": "success", "message": "Goal created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

