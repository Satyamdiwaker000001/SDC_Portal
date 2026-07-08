from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel import Session, select

from ....core import security
from ....core.config import settings
from ....api import deps
from ....models.models import User
from ....schemas.token import Token
from ....schemas.user import UserOut

router = APIRouter()

@router.post("/login", response_model=Token)
async def login_access_token(
    request: Request,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Hands-free compatibility login. Accepts:
    - JSON: {"user_id": "...", "password": "..."}
    - Form-data: username="..." & password="..."
    """
    email = None
    password = None
    
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = await request.json()
            email = body.get("user_id") or body.get("username") or body.get("email")
            password = body.get("password")
        except Exception:
            pass
            
    if not email or not password:
        try:
            form = await request.form()
            email = form.get("username")
            password = form.get("password")
        except Exception:
            pass
            
    if not email or not password:
        raise HTTPException(
            status_code=400,
            detail="Incorrect credentials format. Provide user_id/username and password."
        )
        
    # Check by email or ID
    user = db.exec(select(User).where((User.email == email) | (User.id == email))).first()
    if not user or not security.verify_password(password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email/user_id or password")
        
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

@router.get("/me", response_model=UserOut)
def read_user_me(
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user
