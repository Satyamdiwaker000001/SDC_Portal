from __future__ import annotations
from typing import List, Optional
from datetime import datetime
from sqlmodel import Field, SQLModel, Column, JSON, String

# --- 1. System Settings ---
class SystemSetting(SQLModel, table=True):
    __tablename__ = "system_settings"
    key: str = Field(primary_key=True)
    value: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# --- 2. Files Table ---
class File(SQLModel, table=True):
    __tablename__ = "files"
    id: str = Field(primary_key=True)
    original_name: str
    stored_name: str
    mime_type: str
    size: int

# --- 3. Users & Core Identity ---
class User(SQLModel, table=True):
    __tablename__ = "users"
    id: str = Field(primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    password_hash: str
    role: str # 'admin', 'developer', 'mentor'
    branch: str
    admission_year: int
    passout_year: int
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    profile_image: Optional[str] = None
    is_active: bool = Field(default=True)
    is_retired: bool = Field(default=False) # Replaces HallOfEchoes (alumni state)
    tech_stack: List[str] = Field(default=[], sa_column=Column(JSON))
    performance_score: float = Field(default=0.0) # Added: Developer/Mentor performance tracking
    created_at: datetime = Field(default_factory=datetime.utcnow)

Member = User

# --- 4. Teams ---
class Team(SQLModel, table=True):
    __tablename__ = "teams"
    id: str = Field(primary_key=True)
    name: str
    description: Optional[str] = None
    performance_score: float = Field(default=0.0) # Added: Team performance tracking
    created_by: str = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TeamMember(SQLModel, table=True):
    __tablename__ = "team_members"
    id: str = Field(primary_key=True)
    team_id: str = Field(foreign_key="teams.id")
    user_id: str = Field(foreign_key="users.id")
    designation: str = Field(default="member") # 'lead', 'co-lead', 'member', 'mentor'
    joined_at: datetime = Field(default_factory=datetime.utcnow)

TeamMemberLink = TeamMember

# --- 5. Work & Execution (Projects & Tasks) ---
class Project(SQLModel, table=True):
    __tablename__ = "projects"
    id: str = Field(primary_key=True)
    name: str
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    status: str = Field(default="DRAFT") 
    created_by: str = Field(foreign_key="users.id")
    type: str = Field(default="Web_App")
    deadline: str = Field(default="2026-12-31")
    academic_year: str = Field(default="2025-26")
    team_id: Optional[str] = Field(default=None, foreign_key="teams.id")
    
    # Consolidates Showcase and SRS
    github_repo: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    banner_file_id: Optional[str] = Field(default=None, foreign_key="files.id")
    srs_file_id: Optional[str] = Field(default=None, foreign_key="files.id")
    is_featured: bool = Field(default=False)
    progress: int = Field(default=0)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

# --- Predefined SDLC Phases Table ---
class ProjectPhase(SQLModel, table=True):
    __tablename__ = "project_phases"
    id: str = Field(primary_key=True)
    project_id: str = Field(foreign_key="projects.id")
    name: str # Planning, Analysis, Design, Development, Testing, Deployment, Maintenance
    sequence: int # 1 to 7
    is_unlocked: bool = Field(default=False)
    is_completed: bool = Field(default=False)
    progress: int = Field(default=0)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# --- Mandatory SE Documentation Repository Table ---
class ProjectDocument(SQLModel, table=True):
    __tablename__ = "project_documents"
    id: str = Field(primary_key=True)
    project_id: str = Field(foreign_key="projects.id")
    document_type: str # PRD, BRD, SRS, Use Case Document, etc.
    file_id: Optional[str] = Field(default=None, foreign_key="files.id")
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    id: str = Field(primary_key=True)
    project_id: str = Field(foreign_key="projects.id")
    parent_task_id: Optional[str] = Field(default=None, foreign_key="tasks.id")
    assigned_to: Optional[str] = Field(default=None, foreign_key="users.id")
    created_by: str = Field(foreign_key="users.id")
    title: str
    description: Optional[str] = None
    status: str = Field(default="PENDING") # 'PENDING', 'IN_PROGRESS', 'PENDING_VERIFICATION', 'COMPLETED'
    
    # Task phase context
    phase_id: Optional[str] = Field(default=None, foreign_key="project_phases.id")
    phase_name: Optional[str] = None # Planning, Analysis, etc.
    
    # Consolidates Submissions
    submission_url: Optional[str] = None
    submission_demo_url: Optional[str] = None
    
    # Dates and verification details
    due_date: Optional[str] = None
    submitted_at: Optional[datetime] = None
    verified_at: Optional[datetime] = None
    verified_by: Optional[str] = Field(default=None, foreign_key="users.id")
    rejection_remarks: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

# --- 6. Polymorphic Feedback & Interactions ---
class Interaction(SQLModel, table=True):
    __tablename__ = "interactions"
    id: str = Field(primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    entity_type: str # 'project', 'task', 'notice', 'application', 'user'
    entity_id: str
    interaction_type: str # 'comment', 'review', 'reaction', 'note'
    content: Optional[str] = None # Text for comments/notes, or emoji for reactions
    rating: Optional[int] = None # For reviews (e.g. 1-5)
    decision: Optional[str] = None # 'APPROVED', 'REJECTED' for reviews
    created_at: datetime = Field(default_factory=datetime.utcnow)

# --- 7. Communication & Tracking ---
class Notice(SQLModel, table=True):
    __tablename__ = "notices"
    id: str = Field(primary_key=True)
    title: str
    content: str
    audience_type: str = Field(default="GLOBAL") # 'GLOBAL', 'TEAM', 'MENTOR'
    target_team_ids: List[str] = Field(default=[], sa_column=Column(JSON))
    created_by: str = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

Announcement = Notice

class Notification(SQLModel, table=True):
    __tablename__ = "notifications"
    id: str = Field(primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    title: str
    message: str
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ActivityLog(SQLModel, table=True):
    __tablename__ = "activity_logs"
    id: str = Field(primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    entity_type: str
    entity_id: str
    action: str
    is_audit: bool = Field(default=False) # True if admin action
    created_at: datetime = Field(default_factory=datetime.utcnow)

# --- 8. Recruitment ---
class Application(SQLModel, table=True):
    __tablename__ = "applications"
    id: str = Field(primary_key=True)
    batch_year: str
    name: str
    email: str
    branch: str
    admission_year: int
    passout_year: int
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    resume_file_id: Optional[str] = Field(default=None, foreign_key="files.id")
    status: str = Field(default="PENDING") # 'PENDING', 'ACCEPTED', 'REJECTED'
    generated_user_id: Optional[str] = None
    generated_password: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Interview(SQLModel, table=True):
    __tablename__ = "interviews"
    id: str = Field(primary_key=True)
    application_id: str = Field(foreign_key="applications.id")
    interviewer_id: str = Field(foreign_key="users.id")
    scheduled_at: datetime
