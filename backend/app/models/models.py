from __future__ import annotations
from typing import List, Optional
from datetime import datetime
from sqlmodel import Field, SQLModel, Column, JSON

# =============================================================================
# SDC Portal — SQLModel Database Models
# Strictly conforming to IEEE 830 SRS v1.0 (July 2026)
# =============================================================================

# --- 1. System Settings (FR-032: recruitment toggle, academic year config) ---
class SystemSetting(SQLModel, table=True):
    __tablename__ = "system_settings"
    key: str = Field(primary_key=True)
    value: str
    description: Optional[str] = None
    updated_by: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# --- 2. Files (centralised registry for all uploaded files) ---
class File(SQLModel, table=True):
    __tablename__ = "files"
    id: str = Field(primary_key=True)
    original_name: str
    stored_name: str
    mime_type: str
    size_bytes: int = Field(default=0)
    uploaded_by: Optional[str] = None          # user id who uploaded
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)


# --- 3. Users (FR-022–FR-031, SRS 3.3) ---
# role: exactly admin | mentor | developer   (BR-001)
# Team Leader is a DESIGNATION inside team_members, NOT a role (BR-001, SRS 2.3.4)
# membership_status: active | alumni         (SRS 3.15)
class User(SQLModel, table=True):
    __tablename__ = "users"
    id: str = Field(primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    password_hash: str
    role: str                                   # 'admin' | 'mentor' | 'developer'
    branch: str
    admission_year: int
    passout_year: int
    membership_status: str = Field(default="active")  # 'active' | 'alumni'  (SRS 3.15)
    tech_stack: List[str] = Field(default=[], sa_column=Column(JSON))
    profile_image: Optional[str] = None        # URL (legacy; use files table for new uploads)
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    performance_score: float = Field(default=0.0)     # FR-087, FR-088
    is_active: bool = Field(default=True)             # FR-027 activate / deactivate
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

Member = User  # backward-compat alias used on landing page


# --- 4. Teams (FR-042–FR-050) ---
class Team(SQLModel, table=True):
    __tablename__ = "teams"
    id: str = Field(primary_key=True)
    name: str
    description: Optional[str] = None
    performance_score: float = Field(default=0.0)     # FR-088
    created_by: str = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# designation: lead | mentor | member    (BR-003, BR-004, BR-005)
# BR-003: Developer belongs to only one active team  (unique constraint)
class TeamMember(SQLModel, table=True):
    __tablename__ = "team_members"
    id: str = Field(primary_key=True)
    team_id: str = Field(foreign_key="teams.id")
    user_id: str = Field(foreign_key="users.id")
    designation: str = Field(default="member")   # 'lead' | 'mentor' | 'member'
    joined_at: datetime = Field(default_factory=datetime.utcnow)

TeamMemberLink = TeamMember  # backward-compat alias


# --- 5. Projects (FR-051–FR-057, SRS 3.6.1) ---
# SRS 3.6.1 fields: Name, Description, Assigned Team, Status, Current SDLC Phase,
#   Overall Progress, GitHub Repository, Created Date/Time, Last Updated Date/Time
class Project(SQLModel, table=True):
    __tablename__ = "projects"
    id: str = Field(primary_key=True)
    name: str
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    status: str = Field(default="DRAFT")        # DRAFT | LIVE | PENDING_SRS | COMPLETED | ARCHIVED
    type: str = Field(default="Web_App")
    deadline: Optional[str] = None
    academic_year: str = Field(default="2025-26")
    team_id: Optional[str] = Field(default=None, foreign_key="teams.id")
    github_repo: Optional[str] = None           # FR-116
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    banner_file_id: Optional[str] = Field(default=None, foreign_key="files.id")
    is_featured: bool = Field(default=False)
    progress: int = Field(default=0)            # FR-084 auto-calculated overall progress
    created_by: str = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# --- 6. SDLC Phases (SRS 3.7.1 — 7 fixed phases, auto-created per project) ---
# FR-058: auto-created; FR-059: fixed sequence; FR-060–063: cannot create/rename/delete/reorder
# SRS 3.7.2: Planning starts unlocked; subsequent phase unlocks after preceding completed
class ProjectPhase(SQLModel, table=True):
    __tablename__ = "project_phases"
    id: str = Field(primary_key=True)
    project_id: str = Field(foreign_key="projects.id")
    name: str        # Planning | Analysis | Design | Development | Testing | Deployment | Maintenance
    sequence: int    # 1–7 fixed
    is_unlocked: bool = Field(default=False)
    is_completed: bool = Field(default=False)
    progress: int = Field(default=0)            # FR-083 auto-calculated
    unlocked_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# --- 7. Project Documents (SRS 3.14 — 16 mandatory document types) ---
# FR-114: Only Team Leader uploads documents
class ProjectDocument(SQLModel, table=True):
    __tablename__ = "project_documents"
    id: str = Field(primary_key=True)
    project_id: str = Field(foreign_key="projects.id")
    document_type: str   # one of the 16 SRS-mandated types
    file_id: Optional[str] = Field(default=None, foreign_key="files.id")
    uploaded_by: Optional[str] = Field(default=None, foreign_key="users.id")  # FR-114
    uploaded_at: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# --- 8. Tasks (SRS 3.8.1, 3.9.1) ---
# Status lifecycle (SRS 3.9.1):
#   PENDING → IN_PROGRESS → PENDING_VERIFICATION → COMPLETED (verified) | REJECTED (→ IN_PROGRESS)
# BR-008: Only Team Leader creates tasks
# BR-009: phase_id and assigned_to are REQUIRED (not nullable)
# FR-070: created_at auto-recorded; FR-071: completed_at auto-recorded
class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    id: str = Field(primary_key=True)
    project_id: str = Field(foreign_key="projects.id")
    phase_id: str = Field(foreign_key="project_phases.id")      # NOT NULL (BR-009)
    assigned_to: str = Field(foreign_key="users.id")             # NOT NULL (BR-009)
    created_by: str = Field(foreign_key="users.id")
    title: str
    description: Optional[str] = None
    # SRS 3.8.2 & 3.9.1 status values:
    status: str = Field(default="PENDING")  # PENDING | IN_PROGRESS | PENDING_VERIFICATION | COMPLETED | REJECTED
    due_date: Optional[str] = None                               # FR-069: Team Leader sets
    submission_url: Optional[str] = None
    submission_demo_url: Optional[str] = None
    submitted_at: Optional[datetime] = None                      # when developer submits
    verified_at: Optional[datetime] = None                       # FR-079
    verified_by: Optional[str] = Field(default=None, foreign_key="users.id")  # FR-080
    rejection_remarks: Optional[str] = None                      # FR-075
    completed_at: Optional[datetime] = None                      # FR-071: auto-recorded on official COMPLETED
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# --- 9. Notices (Admin-only official notices — SRS 3.13.1) ---
# FR-096–FR-100
# SRS 3.13.1 fields: Title, Description, Category, Target Audience, Published By,
#   Publish Date/Time, Expiry Date (optional), Attachment (optional)
class Notice(SQLModel, table=True):
    __tablename__ = "notices"
    id: str = Field(primary_key=True)
    title: str
    description: str                                              # SRS 3.13.1 uses "Description"
    category: str = Field(default="General")                     # SRS 3.13.1
    # audience_type per SRS 3.13.1:
    audience_type: str = Field(default="ALL_USERS")  # ALL_USERS | ALL_DEVELOPERS | ALL_MENTORS | SPECIFIC_TEAMS | ALL_TEAMS | INDIVIDUAL_USERS
    target_team_ids: List[str] = Field(default=[], sa_column=Column(JSON))  # for SPECIFIC_TEAMS
    expiry_date: Optional[datetime] = None                       # SRS 3.13.1 optional
    attachment_file_id: Optional[str] = Field(default=None, foreign_key="files.id")  # optional
    published_by: str = Field(foreign_key="users.id")            # Admin only
    is_pinned: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# --- 10. Announcements (Admin + Mentor operational comms — SRS 3.13.2) ---
# FR-101–FR-104
# Admin: can target any audience; Mentor: can only target assigned teams (BR 3.13.2)
class Announcement(SQLModel, table=True):
    __tablename__ = "announcements"
    id: str = Field(primary_key=True)
    title: str
    content: str
    # audience_type per SRS 3.13.2:
    audience_type: str = Field(default="ALL_USERS")  # ALL_USERS | ALL_DEVELOPERS | ALL_MENTORS | SPECIFIC_TEAMS | ALL_TEAMS | INDIVIDUAL_DEVELOPERS | INDIVIDUAL_MENTORS | PROJECT_MEMBERS
    target_team_ids: List[str] = Field(default=[], sa_column=Column(JSON))  # for SPECIFIC_TEAMS
    attachment_file_id: Optional[str] = Field(default=None, foreign_key="files.id")
    published_by: str = Field(foreign_key="users.id")            # Admin or Mentor
    created_at: datetime = Field(default_factory=datetime.utcnow)


# --- 11. Notifications (system-generated, user-specific — SRS 3.13.3) ---
# FR-105–FR-108
# 13 system-defined event types (SRS 3.13.3)
class Notification(SQLModel, table=True):
    __tablename__ = "notifications"
    id: str = Field(primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    title: str
    message: str
    event_type: str = Field(default="TASK_ASSIGNED")  # one of 13 SRS-defined types
    related_entity_type: Optional[str] = None          # 'task' | 'project' | 'team' | etc.
    related_entity_id: Optional[str] = None
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)


# --- 12. Audit Logs (SRS 3.16 — FR-125–FR-129) ---
# SRS 3.16 fields: Event Type, Description, Performed By, User Role,
#   Date, Time, Related Module, Additional Remarks
class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_logs"
    id: str = Field(primary_key=True)
    event_type: str          # e.g. USER_LOGIN | TASK_CREATED | RECRUITMENT_APPROVED | ...
    description: str         # human-readable description of the event
    performed_by: str        # user id (or 'SYSTEM' for auto events)
    user_role: Optional[str] = None          # role at time of action
    related_module: Optional[str] = None     # 'task' | 'project' | 'team' | 'user' | ...
    related_entity_id: Optional[str] = None  # id of the affected entity
    remarks: Optional[str] = None            # Additional Remarks (SRS 3.16)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Backward-compat alias — existing code that imports ActivityLog still works
ActivityLog = AuditLog


# --- 13. Recruitment Applications (SRS 3.4.1) ---
# SRS 3.4.1 mandatory fields:
#   Full Name, Email Address, Mobile Number, Branch, Academic Year,
#   Semester, Technical Specialization, Resume, Additional Information (optional)
class Application(SQLModel, table=True):
    __tablename__ = "applications"
    id: str = Field(primary_key=True)
    batch_year: str
    name: str
    email: str
    mobile_number: str = Field(default="")            # SRS 3.4.1 (required)
    branch: str
    admission_year: int
    passout_year: int
    current_semester: Optional[str] = None            # SRS 3.4.1
    technical_specialization: Optional[str] = None    # SRS 3.4.1
    additional_information: Optional[str] = None      # SRS 3.4.1 optional
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    resume_file_id: Optional[str] = Field(default=None, foreign_key="files.id")
    status: str = Field(default="PENDING")            # PENDING | ACCEPTED | REJECTED
    generated_user_id: Optional[str] = None           # FR-037, FR-038
    generated_password: Optional[str] = None          # FR-039 (plain for CSV export)
    reviewed_by: Optional[str] = Field(default=None, foreign_key="users.id")
    reviewed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


# --- 14. Interviews (SRS 3.4, implied) ---
class Interview(SQLModel, table=True):
    __tablename__ = "interviews"
    id: str = Field(primary_key=True)
    application_id: str = Field(foreign_key="applications.id")
    interviewer_id: str = Field(foreign_key="users.id")
    scheduled_at: datetime
    interview_type: str = Field(default="Technical")  # Technical | HR | Combined
    outcome: str = Field(default="PENDING")            # PASS | FAIL | PENDING
    feedback: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


# --- 15. Interactions (polymorphic comments/reactions — not in SRS but in use) ---
class Interaction(SQLModel, table=True):
    __tablename__ = "interactions"
    id: str = Field(primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    entity_type: str     # 'project' | 'task' | 'notice' | 'application' | 'user'
    entity_id: str
    interaction_type: str   # 'comment' | 'review' | 'reaction' | 'note'
    content: Optional[str] = None
    rating: Optional[int] = None
    decision: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
