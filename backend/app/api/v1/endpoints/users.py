from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Request
from sqlmodel import Session, select, or_
import csv
import io
import uuid
import os
import cloudinary
import cloudinary.uploader

from ....api import deps
from ....core import security
from ....models.models import User, AuditLog
from ....core.config import settings
from ....schemas.user import UserCreate, UserUpdate, UserOut
from datetime import datetime

router = APIRouter()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


@router.post("/upload-avatar")
async def upload_avatar(
    request: Request,
    file: UploadFile = File(...),
    user_id: Optional[str] = None,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Upload profile avatar image. Admin can pass user_id to upload for another user."""
    # Determine target user
    target_id = user_id if (user_id and current_user.role == "admin") else current_user.id

    if not all(
        [
            os.getenv("CLOUDINARY_CLOUD_NAME"),
            os.getenv("CLOUDINARY_API_KEY"),
            os.getenv("CLOUDINARY_API_SECRET"),
        ]
    ):
        raise HTTPException(status_code=500, detail="Cloudinary is not configured")

    extension = (file.filename or "").split(".")[-1].lower()
    if extension not in {"jpg", "jpeg", "png", "gif", "webp"}:
        raise HTTPException(status_code=400, detail="Only image files allowed (jpg, png, gif, webp)")

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File size exceeds 5 MB limit")

    try:
        upload_result = cloudinary.uploader.upload(
            io.BytesIO(contents),
            folder="sdc/users",
            public_id=f"{target_id}_{int(datetime.utcnow().timestamp())}",
            resource_type="image",
            allowed_formats=["jpg", "jpeg", "png", "gif", "webp"],
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Image upload failed") from exc

    secure_url = upload_result.get("secure_url")
    if not secure_url:
        raise HTTPException(status_code=500, detail="Image upload failed")

    # Save URL to user record in DB
    target_user = db.get(User, target_id)
    if target_user:
        target_user.profile_image = secure_url
        target_user.updated_at = datetime.utcnow()
        db.add(target_user)
        db.commit()

    return {"url": secure_url}


@router.get("/", response_model=List[UserOut])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    role: Optional[str] = None,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Retrieve users."""
    statement = select(User)
    if search:
        statement = statement.where(or_(User.name.contains(search), User.email.contains(search)))
    if role:
        statement = statement.where(User.role == role)
    return db.exec(statement.offset(skip).limit(limit)).all()


@router.post("/", response_model=UserOut)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """Create a new user (Admin only — FR-022, FR-023)."""
    user_id = f"USR-{uuid.uuid4().hex[:8].upper()}"
    user = User(
        id=user_id,
        name=user_in.name,
        email=user_in.email,
        password_hash=security.get_password_hash(user_in.password),
        role=user_in.role or "developer",
        branch=user_in.branch or "N/A",
        admission_year=user_in.admission_year or 0,
        passout_year=user_in.passout_year or 0,
        profile_image=user_in.image,
        membership_status="active",         # SRS 3.15
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(user)

    db.add(AuditLog(
        id=str(uuid.uuid4()),
        event_type="USER_CREATED",
        description=f"User '{user_in.name}' ({user_in.role}) created by admin.",
        performed_by=current_admin.id,
        user_role="admin",
        related_module="user",
        related_entity_id=user_id,
    ))

    db.commit()
    db.refresh(user)
    return user


@router.get("/{id}", response_model=UserOut)
def read_user_by_id(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
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
    Developer/Mentor can only edit: profile_image, github_url, linkedin_url (self only).
    Admin can edit developer/mentor profiles and reset their passwords.
    No user can change their own password or edit admin profiles.
    """
    user = db.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Rule: Admin cannot update their own profile.
    if current_user.role == "admin" and current_user.id == id:
        raise HTTPException(status_code=403, detail="Admin cannot update their own profile.")

    # Rule: Admin can only update other developers and mentors, not other admins.
    if current_user.role == "admin" and user.role == "admin":
        raise HTTPException(status_code=403, detail="Admin cannot update other administrators.")

    # Rule: Non-admin can only update themselves.
    if current_user.role != "admin" and current_user.id != id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    update_data = user_in.model_dump(exclude_unset=True)

    # Rule: Non-admin (Developer/Mentor) can only update: profile_image, github_url, linkedin_url.
    if current_user.role != "admin":
        allowed_fields = {"profile_image", "image", "github_url", "linkedin_url"}
        disallowed = set(update_data.keys()) - allowed_fields
        if disallowed:
            raise HTTPException(
                status_code=403,
                detail=f"Developers and Mentors can only update profile photo, github URL, and linkedin URL."
            )

    # Rule: Only admin can reset passwords of other developers/mentors. No one can change their own password.
    if "password" in update_data and update_data["password"]:
        if current_user.role != "admin":
            raise HTTPException(status_code=403, detail="Only administrators can reset passwords.")
        if current_user.id == id:
            raise HTTPException(status_code=403, detail="Administrators cannot reset their own password.")
        update_data["password_hash"] = security.get_password_hash(update_data.pop("password"))

    # Map 'image' field from schema to 'profile_image' column on the model
    if "image" in update_data:
        update_data["profile_image"] = update_data.pop("image")

    # Update attributes
    for field, value in update_data.items():
        if hasattr(user, field):
            setattr(user, field, value)

    user.updated_at = datetime.utcnow()
    db.add(user)

    db.add(AuditLog(
        id=str(uuid.uuid4()),
        event_type="USER_UPDATED",
        description=f"User '{user.name}' profile updated.",
        performed_by=current_user.id,
        user_role=current_user.role,
        related_module="user",
        related_entity_id=id,
    ))

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
    from sqlalchemy.exc import IntegrityError
    from ....models.models import TeamMember, Task, Notification, Interaction, Interview, Team, Project, ProjectDocument, Notice, Announcement, Application
    user = db.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        # 1. Delete notifications targeting this user
        notifications = db.exec(select(Notification).where(Notification.user_id == id)).all()
        for n in notifications:
            db.delete(n)

        # 2. Delete team memberships
        team_memberships = db.exec(select(TeamMember).where(TeamMember.user_id == id)).all()
        for tm in team_memberships:
            db.delete(tm)
        
        # 3. Delete tasks assigned to or created by this user
        tasks = db.exec(select(Task).where((Task.assigned_to == id) | (Task.created_by == id) | (Task.verified_by == id))).all()
        for task in tasks:
            db.delete(task)
            
        # 4. Delete interactions (comments/reviews) made by this user
        interactions = db.exec(select(Interaction).where(Interaction.user_id == id)).all()
        for inter in interactions:
            db.delete(inter)

        # 5. Delete interviews conducted by this user
        interviews = db.exec(select(Interview).where(Interview.interviewer_id == id)).all()
        for iv in interviews:
            db.delete(iv)
            
        # 6. Reassign teams created by this user to current admin
        teams = db.exec(select(Team).where(Team.created_by == id)).all()
        for t in teams:
            t.created_by = current_admin.id
            db.add(t)
            
        # 7. Reassign projects created by this user to current admin
        projects = db.exec(select(Project).where(Project.created_by == id)).all()
        for p in projects:
            p.created_by = current_admin.id
            db.add(p)

        # 8. Reassign uploaded documents by this user
        documents = db.exec(select(ProjectDocument).where(ProjectDocument.uploaded_by == id)).all()
        for doc in documents:
            doc.uploaded_by = None
            db.add(doc)

        # 9. Reassign notices published by this user to current admin
        notices = db.exec(select(Notice).where(Notice.published_by == id)).all()
        for notice in notices:
            notice.published_by = current_admin.id
            db.add(notice)

        # 10. Reassign announcements published by this user to current admin
        announcements = db.exec(select(Announcement).where(Announcement.published_by == id)).all()
        for ann in announcements:
            ann.published_by = current_admin.id
            db.add(ann)

        # 11. Clear application reviews by this user
        applications = db.exec(select(Application).where(Application.reviewed_by == id)).all()
        for app in applications:
            app.reviewed_by = None
            db.add(app)

        db.flush()
        db.delete(user)
        db.commit()
        return {"message": "User deleted successfully"}
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete user due to deep foreign key constraints: {str(e)}"
        )


@router.get("/lookup/{query}")
def lookup_users(
    query: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Quick lookup for task/project assignment."""
    statement = select(User).where(
        or_(User.name.contains(query), User.email.contains(query))
    ).limit(5)
    users = db.exec(statement).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role} for u in users]


@router.post("/bulk-upload")
async def bulk_upload_users(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """Bulk upload users from CSV. Required columns: Name, Email, Password, Role, Branch, Admission Year."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")

    content = await file.read()
    try:
        csv_text = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="Invalid file encoding. Use UTF-8.")

    csv_reader = csv.DictReader(io.StringIO(csv_text))
    headers = [h.strip().lower() for h in (csv_reader.fieldnames or [])]
    required = ["name", "email", "password", "role", "branch", "admission year"]
    missing = [r for r in required if r not in headers]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing columns: {', '.join(missing)}")

    existing_emails = {u.email for u in db.exec(select(User)).all()}
    users_to_add = []
    added = skipped = 0

    for row in csv_reader:
        if added + skipped >= 500:
            break
        cleaned = {k.strip().lower(): (v.strip() if v else "") for k, v in row.items() if k}
        name = cleaned.get("name", "")
        email = cleaned.get("email", "").lower()
        password = cleaned.get("password", "")
        role = cleaned.get("role", "developer").lower()
        branch = cleaned.get("branch", "N/A")
        admission_year = cleaned.get("admission year", "0")
        passout_year = cleaned.get("passout year", "0")

        if not email or not name or not password or email in existing_emails:
            skipped += 1
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
            passout_year=pass_yr,
            membership_status="active",
        )
        users_to_add.append(new_user)
        existing_emails.add(email)
        added += 1

    if users_to_add:
        db.add_all(users_to_add)
        db.commit()

    return {
        "status": "success",
        "message": f"Added {added} users. Skipped {skipped} invalid/duplicate.",
        "added": added,
        "skipped": skipped,
    }


@router.patch("/{id}/membership", response_model=UserOut)
def toggle_user_membership(
    id: str,
    membership_status: Optional[str] = None,  # 'active' or 'alumni'
    is_retired: Optional[bool] = None,       # backward compatibility
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Manually set a Developer's membership status to 'active' or 'alumni' (FR-029, SRS 3.15).
    Converting to alumni automatically removes them from teams.
    """
    user = db.get(User, id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    status_val = "active"
    if membership_status is not None:
        status_val = membership_status.lower()
    elif is_retired is not None:
        status_val = "alumni" if is_retired else "active"

    if status_val not in ["active", "alumni"]:
        raise HTTPException(status_code=400, detail="membership_status must be 'active' or 'alumni'")

    user.membership_status = status_val
    user.updated_at = datetime.utcnow()

    if status_val == "alumni":
        from ....models.models import TeamMember
        team_members = db.exec(select(TeamMember).where(TeamMember.user_id == id)).all()
        for tm in team_members:
            db.delete(tm)

    db.add(user)
    db.add(AuditLog(
        id=str(uuid.uuid4()),
        event_type="ALUMNI_CONVERSION",
        description=f"User '{user.name}' membership_status set to '{status_val}'.",
        performed_by=current_admin.id,
        user_role="admin",
        related_module="user",
        related_entity_id=id,
    ))

    db.commit()
    db.refresh(user)
    return user


@router.post("/alumni/auto-convert")
def run_automatic_alumni_conversion(
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Auto-convert Developers who have passed their passout_year to Alumni status (FR-030).
    """
    current_year = datetime.utcnow().year
    developers = db.exec(
        select(User)
        .where(User.role == "developer")
        .where(User.membership_status == "active")
        .where(User.passout_year <= current_year)
    ).all()

    from ....models.models import TeamMember
    converted = 0
    for dev in developers:
        dev.membership_status = "alumni"
        dev.updated_at = datetime.utcnow()
        db.add(dev)

        # Remove from teams
        team_members = db.exec(select(TeamMember).where(TeamMember.user_id == dev.id)).all()
        for tm in team_members:
            db.delete(tm)

        converted += 1
        db.add(AuditLog(
            id=str(uuid.uuid4()),
            event_type="ALUMNI_CONVERSION",
            description=f"Developer '{dev.name}' auto-converted to alumni (passout_year {dev.passout_year} <= {current_year}).",
            performed_by="SYSTEM",
            user_role="system",
            related_module="user",
            related_entity_id=dev.id,
        ))

    db.commit()
    return {"status": "SUCCESS", "converted_count": converted}
