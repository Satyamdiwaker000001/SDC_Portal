from __future__ import annotations
from typing import List, Optional
from datetime import datetime
from sqlmodel import Field, SQLModel, Column, JSON, String

# --- 1. Files Table ---
class File(SQLModel, table=True):
    __tablename__ = "files"
    id: str = Field(primary_key=True)
    original_name: str
    stored_name: str
    mime_type: str
    size: int

# --- 2. Users & Core Identity ---
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
    is_retired: bool = Field(default=False) # Replaces HallOfEchoes
    tech_stack: List[str] = Field(default=[], sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

Member = User

# --- 3. Teams ---
class Team(SQLModel, table=True):
    __tablename__ = "teams"
    id: str = Field(primary_key=True)
    name: str
    description: Optional[str] = None
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

# --- 4. Work & Execution (Projects & Tasks) ---
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
    banner_file_id: Optional[str] = Field(default=None, foreign_key="files.id")
    srs_file_id: Optional[str] = Field(default=None, foreign_key="files.id")
    is_featured: bool = Field(default=False)
    progress: int = Field(default=0)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    id: str = Field(primary_key=True)
    project_id: str = Field(foreign_key="projects.id")
    parent_task_id: Optional[str] = Field(default=None, foreign_key="tasks.id") # Eliminates Modules table
    assigned_to: Optional[str] = Field(default=None, foreign_key="users.id")
    created_by: str = Field(foreign_key="users.id")
    title: str
    description: Optional[str] = None
    status: str = Field(default="TODO") # 'TODO', 'IN_PROGRESS', 'DONE', 'SUBMITTED'
    
    # Consolidates Submissions
    submission_url: Optional[str] = None
    submission_demo_url: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

# --- 5. Polymorphic Feedback & Interactions ---
class Interaction(SQLModel, table=True):
    """
    Generic table replacing: task_comments, srs_reviews, project_reviews, 
    progress_feedback, submission_reviews, notice_replies, notice_reactions, application_notes
    """
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

# --- 6. Communication & Tracking ---
class Notice(SQLModel, table=True):
    __tablename__ = "notices"
    id: str = Field(primary_key=True)
    title: str
    content: str
    audience_type: str = Field(default="GLOBAL") # 'GLOBAL', 'TEAM', 'MENTOR'
    target_team_ids: List[str] = Field(default=[], sa_column=Column(JSON)) # Eliminates NoticeTargets
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
    __tablename__ = "activity_logs" # Consolidates Activities & AuditLogs
    id: str = Field(primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    entity_type: str
    entity_id: str
    action: str
    is_audit: bool = Field(default=False) # True if admin action
    created_at: datetime = Field(default_factory=datetime.utcnow)

# --- 7. Recruitment ---
class Application(SQLModel, table=True):
    __tablename__ = "applications"
    id: str = Field(primary_key=True)
    batch_year: str # Replaces recruitment_drives
    name: str
    email: str
    branch: str
    admission_year: int
    passout_year: int
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    resume_file_id: Optional[str] = Field(default=None, foreign_key="files.id")
    status: str = Field(default="PENDING") # 'PENDING', 'ACCEPTED', 'REJECTED'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Interview(SQLModel, table=True):
    __tablename__ = "interviews"
    id: str = Field(primary_key=True)
    application_id: str = Field(foreign_key="applications.id")
    interviewer_id: str = Field(foreign_key="users.id")
    scheduled_at: datetime
    # Interview feedback is handled by the Interaction table (entity_type='interview')
