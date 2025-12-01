from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..sql_models import Notification, User

router = APIRouter(
    prefix="/notifications",
    tags=["notifications"]
)

# --- Pydantic Models ---
class NotificationCreate(BaseModel):
    user_id: Optional[int] = None
    title: str
    message: str
    notification_type: str  # info, warning, success, error
    link: Optional[str] = None

class NotificationResponse(BaseModel):
    id: int
    user_id: Optional[int]
    title: str
    message: str
    notification_type: str
    is_read: bool
    link: Optional[str]
    created_at: str

# --- Endpoints ---
@router.get("/", response_model=List[NotificationResponse])
def get_notifications(
    user_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all notifications, optionally filtered by user"""
    query = db.query(Notification)
    
    if user_id:
        query = query.filter(Notification.user_id == user_id)
    
    notifications = query.order_by(desc(Notification.created_at)).offset(skip).limit(limit).all()
    
    return [
        NotificationResponse(
            id=notif.id,
            user_id=notif.user_id,
            title=notif.title,
            message=notif.message,
            notification_type=notif.notification_type,
            is_read=notif.is_read,
            link=notif.link,
            created_at=notif.created_at.isoformat() if notif.created_at else datetime.now().isoformat()
        )
        for notif in notifications
    ]

@router.get("/{notification_id}", response_model=NotificationResponse)
def get_notification_detail(notification_id: int, db: Session = Depends(get_db)):
    """Get notification details"""
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return NotificationResponse(
        id=notification.id,
        user_id=notification.user_id,
        title=notification.title,
        message=notification.message,
        notification_type=notification.notification_type,
        is_read=notification.is_read,
        link=notification.link,
        created_at=notification.created_at.isoformat()
    )

@router.post("/", response_model=NotificationResponse)
def create_notification(request: NotificationCreate, db: Session = Depends(get_db)):
    """Create a new notification"""
    # If user_id provided, verify user exists
    if request.user_id:
        user = db.query(User).filter(User.id == request.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
    
    new_notification = Notification(
        user_id=request.user_id,
        title=request.title,
        message=request.message,
        notification_type=request.notification_type,
        link=request.link,
        is_read=False,
        created_at=datetime.now()
    )
    
    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)
    
    return NotificationResponse(
        id=new_notification.id,
        user_id=new_notification.user_id,
        title=new_notification.title,
        message=new_notification.message,
        notification_type=new_notification.notification_type,
        is_read=new_notification.is_read,
        link=new_notification.link,
        created_at=new_notification.created_at.isoformat()
    )

@router.put("/{notification_id}/read")
def mark_notification_as_read(notification_id: int, db: Session = Depends(get_db)):
    """Mark notification as read"""
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    db.commit()
    
    return {"message": "Notification marked as read"}

@router.delete("/{notification_id}")
def delete_notification(notification_id: int, db: Session = Depends(get_db)):
    """Delete a notification"""
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    db.delete(notification)
    db.commit()
    
    return {"message": "Notification deleted successfully"}
