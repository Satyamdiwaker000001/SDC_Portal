from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, EmailStr
from sqlmodel import Session, select, or_
from typing import Any, List, Optional
from datetime import datetime

from ...api import deps
from ...core import security
from ...models.models import User, Member

router = APIRouter()

class DeveloperCreate(BaseModel):
    id: str
    name: str
    email: EmailStr
    spec: str
    joinDate: str
    password: Optional[str] = "SDC@2026"

class MentorCreate(BaseModel):
    id: str
    name: str
    email: EmailStr
    password: Optional[str] = "SDC@2026"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    image: Optional[str] = None
    is_active: Optional[bool] = None

@router.post("/developers", status_code=status.HTTP_210_CREATED if hasattr(status, "HTTP_210_CREATED") else 201)
def create_developer(
    member_in: DeveloperCreate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create a new Developer User & Member (Admin only)
    """
    # Check if ID or Email already exists
    existing_user = db.exec(select(User).where(or_(User.id == member_in.id, User.email == member_in.email))).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User ID or Email already registered")

    created_at = datetime.utcnow()
    if member_in.joinDate:
        try:
            created_at = datetime.strptime(member_in.joinDate, "%Y-%m-%d")
        except ValueError:
            pass

    # Create User for authentication & member info
    user = User(
        id=member_in.id,
        email=member_in.email,
        name=member_in.name,
        role="developer",
        branch=member_in.spec,
        admission_year=0,
        passout_year=0,
        password_hash=security.get_password_hash(member_in.password),
        is_active=True,
        created_at=created_at
    )
    db.add(user)
    
    db.commit()
    db.refresh(user)
    return {"status": "SUCCESS", "message": "Developer created", "user": user}

@router.post("/mentors", status_code=201)
def create_mentor(
    mentor_in: MentorCreate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create a new Mentor User (Admin only)
    """
    existing_user = db.exec(select(User).where(or_(User.id == mentor_in.id, User.email == mentor_in.email))).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User ID or Email already registered")

    user = User(
        id=mentor_in.id,
        email=mentor_in.email,
        name=mentor_in.name,
        role="mentor",
        branch="N/A",
        admission_year=0,
        passout_year=0,
        password_hash=security.get_password_hash(mentor_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"status": "SUCCESS", "message": "Mentor created", "user": user}

@router.get("/")
def get_all_users(
    role: Optional[str] = Query(None, description="Filter users by role: developer, mentor, admin"),
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    List all active/inactive users with role filtering (Admin only)
    """
    statement = select(User)
    if role:
        statement = statement.where(User.role == role.lower())
    users = db.exec(statement).all()
    return users

@router.get("/{userId}")
def get_user_details(
    userId: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Get user metadata details by ID (Admin only)
    """
    user = db.get(User, userId)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/{userId}")
def update_user(
    userId: str,
    update_data: UserUpdate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Update user credentials & attributes (Admin only)
    """
    user = db.get(User, userId)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    data = update_data.dict(exclude_unset=True)
    for key, val in data.items():
        setattr(user, key, val)
        
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"status": "SUCCESS", "user": user}

@router.delete("/{userId}")
def disable_user(
    userId: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Soft-delete/disable user account (Admin only)
    """
    user = db.get(User, userId)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = False
    db.add(user)
    
    # Also disable associated Member if it exists
    member = db.get(Member, userId)
    if member:
        member.is_active = False
        db.add(member)
        
    db.commit()
    return {"status": "SUCCESS", "message": "User soft-deleted / disabled successfully"}

@router.patch("/{userId}/passout")
def mark_user_passout(
    userId: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Mark developer as passout / alumnus (Admin only)
    """
    user = db.get(User, userId)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.passout_year = datetime.utcnow().year
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"status": "SUCCESS", "message": "User marked as passout", "user": user}
