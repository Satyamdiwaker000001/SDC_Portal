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

@router.post("/bulk-upload")
async def bulk_upload_users(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Bulk upload users from a CSV file.
    Required columns: Name, Email, Password, Role, Branch, Admission Year
    Optional: Passout Year
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    content = await file.read()
    try:
        csv_text = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="Invalid file encoding. Please use UTF-8.")
    
    csv_reader = csv.DictReader(io.StringIO(csv_text))
    
    # Check headers
    headers = [h.strip().lower() for h in (csv_reader.fieldnames or [])]
    required_headers = ["name", "email", "password", "role", "branch", "admission year"]
    missing_headers = [req for req in required_headers if req not in headers]
    if missing_headers:
        raise HTTPException(status_code=400, detail=f"Missing required columns: {', '.join(missing_headers)}")
    
    users_to_add = []
    skipped_count = 0
    added_count = 0
    max_limit = 500
    row_count = 0
    
    # Retrieve existing emails to avoid dupes in bulk
    existing_emails_set = {u.email for u in db.exec(select(User)).all()}
    
    import uuid
    for row in csv_reader:
        row_count += 1
        if row_count > max_limit:
            break
            
        # Clean row keys based on stripped lowercase headers
        cleaned_row = {k.strip().lower(): v.strip() if v else "" for k, v in row.items() if k}
        
        name = cleaned_row.get("name", "")
        email = cleaned_row.get("email", "").lower()
        password = cleaned_row.get("password", "")
        role = cleaned_row.get("role", "developer").lower()
        branch = cleaned_row.get("branch", "N/A")
        admission_year = cleaned_row.get("admission year", "0")
        passout_year = cleaned_row.get("passout year", "0")
        
        if not email or not name or not password:
            skipped_count += 1
            continue
            
        if email in existing_emails_set:
            skipped_count += 1
            continue
            
        try:
            adm_yr = int(admission_year)
        except ValueError:
            adm_yr = 0
            
        try:
            pass_yr = int(passout_year)
        except ValueError:
            pass_yr = 0
            
        new_user = User(
            id=f"USR-{uuid.uuid4().hex[:8].upper()}",
            name=name,
            email=email,
            password_hash=security.get_password_hash(password),
            role=role if role in ["admin", "developer", "mentor"] else "developer",
            branch=branch,
            admission_year=adm_yr,
            passout_year=pass_yr
        )
        users_to_add.append(new_user)
        existing_emails_set.add(email) # To prevent dupes within the same CSV
        added_count += 1

    if users_to_add:
        db.add_all(users_to_add)
        db.commit()
        
    return {
        "status": "success",
        "message": f"Successfully added {added_count} members. Skipped {skipped_count} invalid or duplicate entries.",
        "added": added_count,
        "skipped": skipped_count,
        "limit_reached": row_count > max_limit
    }

@router.patch("/{id}/membership", response_model=UserOut)
def toggle_user_membership(
    id: str,
    is_retired: bool,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    user = db.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.is_retired = is_retired
    if is_retired:
        from ....models.models import TeamMember
        team_members = db.exec(select(TeamMember).where(TeamMember.user_id == id)).all()
        for tm in team_members:
            db.delete(tm)
            
    db.add(user)
    
    from ....models.models import ActivityLog
    import uuid
    db.add(ActivityLog(
        id=str(uuid.uuid4()),
        user_id=current_admin.id,
        entity_type="user",
        entity_id=id,
        action=f"ALUMNI_CONVERSION_MANUAL: is_retired={is_retired}",
        is_audit=True,
        created_at=datetime.utcnow()
    ))
    
    db.commit()
    db.refresh(user)
    return user

@router.post("/alumni/auto-convert")
def run_automatic_alumni_conversion(
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin)
) -> Any:
    current_year = datetime.utcnow().year
    developers = db.exec(
        select(User)
        .where(User.role == "developer")
        .where(User.is_retired == False)
        .where(User.passout_year <= current_year)
    ).all()
    
    converted_count = 0
    from ....models.models import TeamMember, ActivityLog
    import uuid
    
    for dev in developers:
        dev.is_retired = True
        db.add(dev)
        team_members = db.exec(select(TeamMember).where(TeamMember.user_id == dev.id)).all()
        for tm in team_members:
            db.delete(tm)
        converted_count += 1
        
        db.add(ActivityLog(
            id=str(uuid.uuid4()),
            user_id="SYSTEM",
            entity_type="user",
            entity_id=dev.id,
            action="ALUMNI_CONVERSION_AUTO: transitioned to alumni",
            is_audit=True,
            created_at=datetime.utcnow()
        ))
        
    db.commit()
    return {"status": "SUCCESS", "converted_count": converted_count}

