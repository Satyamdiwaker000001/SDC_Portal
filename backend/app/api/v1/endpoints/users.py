from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Request
from sqlmodel import Session, select, or_
import csv
import io

from ....api import deps
from ....core import security
from ....models.models import User
from ....core.config import settings
from ....schemas.user import UserCreate, UserUpdate, UserOut
from datetime import datetime
import shutil
import os

router = APIRouter()

@router.post("/upload-avatar")
async def upload_avatar(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Upload profile image to secure cloud/local storage.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    upload_dir = os.path.join(base_dir, "static", "uploads")
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    extension = file.filename.split(".")[-1]
    filename = f"{current_user.id}_{int(datetime.utcnow().timestamp())}.{extension}"
    file_path = os.path.join(upload_dir, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    base_url = str(request.base_url).rstrip("/")
    return {"url": f"{base_url}/static/uploads/{filename}"}

@router.get("/", response_model=List[UserOut])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    role: Optional[str] = None,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve users.
    """
    statement = select(User)
    if search:
        statement = statement.where(or_(User.name.contains(search), User.email.contains(search)))
    if role:
        statement = statement.where(User.role == role)
    
    users = db.exec(statement.offset(skip).limit(limit)).all()
    return users

@router.post("/", response_model=UserOut)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create new user (Admin only).
    """
    user_id = f"USR-{int(datetime.utcnow().timestamp())}"
    
    user = User(
        id=user_id,
        name=user_in.name,
        email=user_in.email,
        password_hash=security.get_password_hash(user_in.password),
        role=user_in.role or "developer",
        branch="N/A", # Default since it's not in UserCreate
        admission_year=0,
        passout_year=0,
        profile_image=user_in.image,
        is_active=True,
        is_retired=False,
        created_at=datetime.utcnow()
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/{id}", response_model=UserOut)
def read_user_by_id(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get a specific user by id.
    """
    user = db.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/{id}", response_model=UserOut)
def update_user(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update a user.
    """
    user = db.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if current_user.id != user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    update_data = user_in.model_dump(exclude_unset=True)
    if "password" in update_data and update_data["password"]:
        hashed_password = security.get_password_hash(update_data["password"])
        del update_data["password"]
        update_data["password_hash"] = hashed_password
        
    for field, value in update_data.items():
        setattr(user, field, value)
        
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{id}")
def delete_user(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Delete a user.
    """
    user = db.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.get("/lookup/{query}")
def lookup_users(
    query: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Quick lookup for assigning tasks/projects.
    """
    statement = select(User).where(or_(User.name.contains(query), User.email.contains(query))).limit(5)
    users = db.exec(statement).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role} for u in users]
