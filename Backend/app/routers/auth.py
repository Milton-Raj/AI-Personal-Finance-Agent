from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from typing import Optional
import hashlib

from ..database import get_db
from ..sql_models import User, AuthSession

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

# --- Pydantic Models ---
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    user_id: int
    email: str
    full_name: str
    is_premium_member: bool
    session_token: str
    message: str

# --- Helper Functions ---
def hash_password(password: str) -> str:
    """Simple password hashing (use bcrypt in production)"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_session_token(user_id: int) -> str:
    """Generate a simple session token"""
    import secrets
    return f"{user_id}_{secrets.token_urlsafe(32)}"

# --- Endpoints ---
@router.post("/register", response_model=AuthResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = User(
        email=request.email,
        password_hash=hash_password(request.password),
        full_name=request.full_name,
        phone=request.phone,
        is_premium_member=False,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create session
    session_token = create_session_token(new_user.id)
    auth_session = AuthSession(
        user_id=new_user.id,
        session_token=session_token,
        is_active=True,
        created_at=datetime.now(),
        expires_at=datetime.now() + timedelta(days=30)
    )
    
    db.add(auth_session)
    db.commit()
    
    return AuthResponse(
        user_id=new_user.id,
        email=new_user.email,
        full_name=new_user.full_name,
        is_premium_member=new_user.is_premium_member,
        session_token=session_token,
        message="Registration successful"
    )

@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Login user with email and password
    """
    # Find user
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if user.password_hash != hash_password(request.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create new session
    session_token = create_session_token(user.id)
    auth_session = AuthSession(
        user_id=user.id,
        session_token=session_token,
        is_active=True,
        created_at=datetime.now(),
        expires_at=datetime.now() + timedelta(days=30)
    )
    
    db.add(auth_session)
    db.commit()
    
    return AuthResponse(
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_premium_member=user.is_premium_member,
        session_token=session_token,
        message="Login successful"
    )

@router.get("/validate")
def validate_session(session_token: str, db: Session = Depends(get_db)):
    """
    Validate a session token
    """
    session = db.query(AuthSession).filter(
        AuthSession.session_token == session_token,
        AuthSession.is_active == True
    ).first()
    
    if not session or session.expires_at < datetime.now():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session"
        )
    
    user = db.query(User).filter(User.id == session.user_id).first()
    
    return {
        "valid": True,
        "user_id": user.id,
        "email": user.email,
        "full_name": user.full_name
    }
