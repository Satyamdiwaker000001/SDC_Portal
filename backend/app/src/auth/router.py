from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from datetime import timedelta
from typing import Any

from ...core import security
from ...core.config import settings
from ...api import deps
from ...models.models import User

router = APIRouter()

class LoginRequest(BaseModel):
    user_id: str
    password: str

class LoginResponse(BaseModel):
    token: str
    role: str
    name: str
    id: str

@router.post("/login", response_model=LoginResponse)
def login(request_data: LoginRequest, db: Session = Depends(deps.get_db)) -> Any:
    """
    Standard user authentication endpoint
    """
    user = db.exec(
        select(User).where(
            (User.id == request_data.user_id) | (User.email == request_data.user_id)
        )
    ).first()
    if not user or user.disabled or not security.verify_password(request_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect user ID or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = security.create_access_token(user.id, expires_delta=access_token_expires)
    
    return {
        "token": token,
        "role": user.role.upper(), # DEVELOPER, MENTOR, ADMIN
        "name": user.name,
        "id": user.id
    }

@router.post("/logout")
def logout() -> Any:
    """
    Invalidate token session
    """
    return {"status": "SUCCESS", "message": "Logged out successfully"}

@router.get("/me")
def read_user_me(current_user: User = Depends(deps.get_current_user)) -> Any:
    """
    Retrieve logged-in user profile
    """
    return current_user
