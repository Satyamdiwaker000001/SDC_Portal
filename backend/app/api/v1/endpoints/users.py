from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlmodel import Session, select, or_
import csv
import io

from ....api import deps
from ....core import security
from ....models.models import Member, User
from ....core.config import settings
from ....schemas.members import MemberCreate, MemberUpdate, MemberOut
from datetime import datetime

router = APIRouter()

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
        techStack=member_in.techStack
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
    Bulk inject members via CSV.
    Headers: name, email, spec, joinDate, retirementDate, techStack
    """
    content = await file.read()
    decoded = content.decode('utf-8')
    reader = csv.DictReader(io.StringIO(decoded))
    
    added_count = 0
    current_date = datetime.utcnow().date()
    
    for row in reader:
        member_id = f"MEM-{int(datetime.utcnow().timestamp())}-{added_count}"
        
        # Status Logic
        retirement_date_str = row.get('retirementDate')
        status = "ACTIVE"
        if retirement_date_str:
            try:
                r_date = datetime.strptime(retirement_date_str, "%Y-%m-%d").date()
                if r_date < current_date:
                    status = "PASSOUT"
            except ValueError:
                pass

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
        added_count += 1
        
    db.commit()
    return {"status": "FORGE_SUCCESS", "count": added_count}

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
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Authorization: Admin or Self
    if current_user.role != "admin" and current_user.id != id:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")

    update_data = member_update.dict(exclude_unset=True)
    
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
