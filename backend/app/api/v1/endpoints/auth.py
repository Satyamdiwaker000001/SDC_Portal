from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from ....core import security
from ....core.config import settings
from ....api import deps
from ....models.models import User
from ....schemas.token import Token

router = APIRouter()

@router.post("/login", response_model=Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, retrieve an access token for future requests
    """
    user = db.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
        "role": user.role,
        "name": user.name,
        "id": user.id
    }

@router.post("/logout")
def logout() -> Any:
    """
    Log out.
    """
    return {"status": "SUCCESS", "message": "Logged out successfully"}

@router.get("/me")
def read_user_me(
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user
