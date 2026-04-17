from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Request
from sqlmodel import Session, select, or_
import csv
import io

from ....api import deps
from ....core import security
from ....models.models import Member, User
from ....core.config import settings
from ....schemas.members import MemberCreate, MemberUpdate, MemberOut
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
    # Create static/uploads if not exists [STORAGE_PROTOCOL]
    # Go exactly 4 levels up to reach "app/" where main.py mounts static: app -> api -> v1 -> endpoints -> users.py
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    upload_dir = os.path.join(base_dir, "static", "uploads")
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    # Sanitize and unique name
    extension = file.filename.split(".")[-1]
    filename = f"{current_user.id}_{int(datetime.utcnow().timestamp())}.{extension}"
    file_path = os.path.join(upload_dir, filename)

    # Save to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return Adaptive Relative URL via Request metadata [UPLINK_PATH]
    base_url = str(request.base_url).rstrip("/")
    return {"url": f"{base_url}/static/uploads/{filename}"}

@router.get("/", response_model=List[MemberOut])
def read_members(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    role: Optional[str] = None,
    status: Optional[str] = None,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve members.
    """
    statement = select(Member)
    if search:
        statement = statement.where(or_(Member.name.contains(search), Member.email.contains(search)))
    if role:
        statement = statement.where(Member.spec == role)
    if status:
        statement = statement.where(Member.status == status)
    
    members = db.exec(statement.offset(skip).limit(limit)).all()
    return members

@router.post("/", response_model=MemberOut)
def create_member(
    *,
    db: Session = Depends(deps.get_db),
    member_in: MemberCreate,
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create new member (Admin only).
    """
    # Deterministic ID if not provided
    member_id = f"MEM-{int(datetime.utcnow().timestamp())}"
    
    # Status Logic
    status = "ACTIVE"
    if member_in.retirementDate:
        try:
            r_date = datetime.strptime(member_in.retirementDate, "%Y-%m-%d").date()
            if r_date < datetime.utcnow().date():
                status = "PASSOUT"
        except ValueError:
            pass

    member = Member(
        id=member_id,
        name=member_in.name,
        email=member_in.email,
        spec=member_in.spec,
        joinDate=member_in.joinDate,
        retirementDate=member_in.retirementDate,
        status=status,
        image=member_in.image,
        techStack=member_in.techStack,
        githubUrl=member_in.githubUrl,
        linkedinUrl=member_in.linkedinUrl,
        isFounder=member_in.isFounder
    )
    db.add(member)
    
    # Also create a User record for login
    password = member_in.password or "SDC@2026"
    user = User(
        id=member.id,
        email=member.email,
        name=member.name,
        role="developer",
        hashed_password=security.get_password_hash(password)
    )
    db.add(user)
    
    db.commit()
    db.refresh(member)
    return member

@router.post("/bulk")
async def bulk_data_forge(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Bulk operate: Inject operatives via CSV.
    Headers: name, email, spec, joinDate, retirementDate, techStack
    """
    content = await file.read()
    decoded = content.decode('utf-8')
    reader = csv.DictReader(io.StringIO(decoded))
    
    results = {"success": 0, "errors": []}
    current_date = datetime.utcnow().date()
    
    for i, row in enumerate(reader):
        try:
            # Validation: Mandatory fields
            mandatory = ['name', 'email', 'spec', 'joinDate']
            for field in mandatory:
                if not row.get(field):
                    raise ValueError(f"Missing mandatory field: {field}")

            member_id = f"MEM-{int(datetime.utcnow().timestamp())}-{i}"
            
            # Status Logic [SYNC_BUCKET]
            retirement_date_str = row.get('retirementDate')
            status = "ACTIVE"
            if retirement_date_str:
                try:
                    r_date = datetime.strptime(retirement_date_str, "%Y-%m-%d").date()
                    if r_date < current_date:
                        status = "RETIRED"
                except ValueError:
                    raise ValueError(f"Invalid date format for retirementDate: {retirement_date_str}")

            # Tech Stack parsing (semi-colon separated)
            tech_stack = []
            if row.get('techStack'):
                tech_stack = [s.strip() for s in row['techStack'].split(';') if s.strip()]

            member = Member(
                id=member_id,
                name=row['name'],
                email=row['email'],
                spec=row['spec'],
                joinDate=row['joinDate'],
                retirementDate=retirement_date_str,
                status=status,
                techStack=tech_stack
            )
            db.add(member)
            
            user = User(
                id=member.id,
                email=member.email,
                name=member.name,
                role="developer",
                hashed_password=security.get_password_hash("SDC@2026")
            )
            db.add(user)
            results["success"] += 1
            
        except Exception as e:
            results["errors"].append({"row": i + 1, "error": str(e), "data": row})
        
    db.commit()
    return results

@router.get("/{id}", response_model=MemberOut)
def read_member_by_id(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get member profile by ID.
    """
    member = db.get(Member, id)
    if not member:
        # Fallback for ROOT-ADMIN or Admin Users without a Member record
        user_record = db.get(User, id)
        if user_record and user_record.role == "admin":
            return Member(
                id=user_record.id,
                name=user_record.name,
                email=user_record.email,
                spec="Command Overseer",
                joinDate="2024-01-01",
                status="ACTIVE",
                image=user_record.image,
                techStack=["System Admin", "Command Base"],
                isFounder=True,
            )
        raise HTTPException(status_code=404, detail="Member not found")
    return member

@router.patch("/{id}", response_model=MemberOut)
def update_member(
    id: str,
    member_update: MemberUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update member details.
    Admin can update anyone. Members can update themselves.
    """
    member = db.get(Member, id)
    if not member:
        # Fallback for updating ROOT-ADMIN or Admin Users without a Member record
        user_record = db.get(User, id)
        if user_record and user_record.role == "admin":
            # Admin only updates their Name and Image
            update_data = member_update.dict(exclude_unset=True)
            if "name" in update_data:
                user_record.name = update_data["name"]
            if "image" in update_data:
                user_record.image = update_data["image"]
            db.add(user_record)
            db.commit()
            db.refresh(user_record)
            return Member(
                id=user_record.id,
                name=user_record.name,
                email=user_record.email,
                spec="Command Overseer",
                joinDate="2024-01-01",
                status="ACTIVE",
                image=user_record.image,
                techStack=["System Admin", "Command Base"],
                isFounder=True,
            )
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Authorization: Admin or Self
    if current_user.role != "admin" and current_user.id != id:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")

    update_data = member_update.dict(exclude_unset=True)
    
    # RBAC: Field-level Protection [SECURITY_V5]
    restricted_fields = ["spec", "isFounder", "joinDate", "email"]
    if current_user.role != "admin":
        for field in restricted_fields:
            if field in update_data:
                del update_data[field]
    
    # Recalculate status if retirementDate is updated
    if "retirementDate" in update_data:
        r_date_str = update_data["retirementDate"]
        if r_date_str:
            try:
                r_date = datetime.strptime(r_date_str, "%Y-%m-%d").date()
                if r_date < datetime.utcnow().date():
                    update_data["status"] = "PASSOUT"
                else:
                    update_data["status"] = "ACTIVE"
            except ValueError:
                pass
        else:
            update_data["status"] = "ACTIVE"

    for key, value in update_data.items():
        setattr(member, key, value)
    
    # Synchronize Image, Name, and Email with User record for Dashboard UI consistency
    user = db.get(User, id)
    if user:
        if "image" in update_data:
            user.image = update_data["image"]
        if "name" in update_data:
            user.name = update_data["name"]
        if "email" in update_data:
            user.email = update_data["email"]
        db.add(user)

    db.add(member)
    db.commit()
    db.refresh(member)
    return member

@router.delete("/{id}")
def delete_member(
    id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Delete member (Admin only).
    """
    member = db.get(Member, id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(member)
    
    user = db.get(User, id)
    if user:
        db.delete(user)
        
    db.commit()
    return {"status": "DELETED"}

@router.post("/{id}/reset-password")
def reset_password_protocol(
    id: str,
    new_pass: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Identity override protocol.
    """
    user = db.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = security.get_password_hash(new_pass)
    db.add(user)
    db.commit()
    return {"status": "PASS_OVERRIDE_ACTIVE"}

@router.get("/lookup/{query}")
def lookup_member(
    query: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Search member by ID or Email for auto-filling forms.
    """
    member = db.exec(select(Member).where(or_(Member.id == query, Member.email == query))).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not detected in registry")
    return member
