from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..sql_models import CoinRule, CoinTransaction, User

router = APIRouter(
    prefix="/coins",
    tags=["coins"]
)

# --- Pydantic Models ---
class CoinRuleCreate(BaseModel):
    name: str
    description: str
    action_type: str
    coins_awarded: int

class CoinRuleResponse(BaseModel):
    id: int
    name: str
    description: str
    action_type: str
    coins_awarded: int
    is_active: bool
    created_at: str

class CoinTransactionCreate(BaseModel):
    user_id: int
    amount: int
    transaction_type: str
    description: str
    rule_id: Optional[int] = None

class CoinTransactionResponse(BaseModel):
    id: int
    user_id: int
    amount: int
    transaction_type: str
    description: str
    created_at: str

# --- Coin Rules Endpoints ---
@router.get("/rules", response_model=List[CoinRuleResponse])
def get_coin_rules(db: Session = Depends(get_db)):
    """Get all coin rules"""
    rules = db.query(CoinRule).all()
    return [
        CoinRuleResponse(
            id=rule.id,
            name=rule.name,
            description=rule.description,
            action_type=rule.action_type,
            coins_awarded=rule.coins_awarded,
            is_active=rule.is_active,
            created_at=rule.created_at.isoformat() if rule.created_at else datetime.now().isoformat()
        )
        for rule in rules
    ]

@router.post("/rules", response_model=CoinRuleResponse)
def create_coin_rule(request: CoinRuleCreate, db: Session = Depends(get_db)):
    """Create a new coin rule"""
    new_rule = CoinRule(
        name=request.name,
        description=request.description,
        action_type=request.action_type,
        coins_awarded=request.coins_awarded,
        is_active=True,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    
    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)
    
    return CoinRuleResponse(
        id=new_rule.id,
        name=new_rule.name,
        description=new_rule.description,
        action_type=new_rule.action_type,
        coins_awarded=new_rule.coins_awarded,
        is_active=new_rule.is_active,
        created_at=new_rule.created_at.isoformat()
    )

@router.put("/rules/{rule_id}")
def update_coin_rule(rule_id: int, request: CoinRuleCreate, db: Session = Depends(get_db)):
    """Update a coin rule"""
    rule = db.query(CoinRule).filter(CoinRule.id == rule_id).first()
    
    if not rule:
        raise HTTPException(status_code=404, detail="Coin rule not found")
    
    rule.name = request.name
    rule.description = request.description
    rule.action_type = request.action_type
    rule.coins_awarded = request.coins_awarded
    rule.updated_at = datetime.now()
    
    db.commit()
    
    return {"message": "Coin rule updated successfully"}

@router.delete("/rules/{rule_id}")
def delete_coin_rule(rule_id: int, db: Session = Depends(get_db)):
    """Delete a coin rule"""
    rule = db.query(CoinRule).filter(CoinRule.id == rule_id).first()
    
    if not rule:
        raise HTTPException(status_code=404, detail="Coin rule not found")
    
    db.delete(rule)
    db.commit()
    
    return {"message": "Coin rule deleted successfully"}

# --- Coin Transactions Endpoints ---
@router.get("/transactions", response_model=List[CoinTransactionResponse])
def get_coin_transactions(
    user_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get coin transactions with optional user filter"""
    query = db.query(CoinTransaction)
    
    if user_id:
        query = query.filter(CoinTransaction.user_id == user_id)
    
    transactions = query.order_by(desc(CoinTransaction.created_at)).offset(skip).limit(limit).all()
    
    return [
        CoinTransactionResponse(
            id=tx.id,
            user_id=tx.user_id,
            amount=tx.amount,
            transaction_type=tx.transaction_type,
            description=tx.description,
            created_at=tx.created_at.isoformat() if tx.created_at else datetime.now().isoformat()
        )
        for tx in transactions
    ]

@router.post("/transactions", response_model=CoinTransactionResponse)
def create_coin_transaction(request: CoinTransactionCreate, db: Session = Depends(get_db)):
    """Create a new coin transaction"""
    # Verify user exists
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_transaction = CoinTransaction(
        user_id=request.user_id,
        amount=request.amount,
        transaction_type=request.transaction_type,
        description=request.description,
        rule_id=request.rule_id,
        created_at=datetime.now()
    )
    
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    
    return CoinTransactionResponse(
        id=new_transaction.id,
        user_id=new_transaction.user_id,
        amount=new_transaction.amount,
        transaction_type=new_transaction.transaction_type,
        description=new_transaction.description,
        created_at=new_transaction.created_at.isoformat()
    )

@router.get("/balance/{user_id}")
def get_user_coin_balance(user_id: int, db: Session = Depends(get_db)):
    """Get total coin balance for a user"""
    from sqlalchemy import func
    
    balance = db.query(func.sum(CoinTransaction.amount)).filter(
        CoinTransaction.user_id == user_id
    ).scalar() or 0
    
    return {"user_id": user_id, "balance": balance}
