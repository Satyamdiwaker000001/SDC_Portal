from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session
from typing import Any, Optional
from ...api import deps
from ...models.models import User

router = APIRouter()

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    profile_image: Optional[str] = None

@router.get("", response_model=User)
def get_profile(
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user profile
    """
    return current_user

@router.patch("", response_model=User)
def update_profile(
    profile_in: ProfileUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update current user profile
    """
    user = db.get(User, current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    data = profile_in.dict(exclude_unset=True)
    for key, val in data.items():
        setattr(user, key, val)
        
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
