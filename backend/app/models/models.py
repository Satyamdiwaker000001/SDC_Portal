from __future__ import annotations
from typing import List, Optional
from datetime import datetime, date
from sqlmodel import Field, SQLModel, Relationship, Column, JSON, String, Text
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

# --- 1. Files Table ---
class File(SQLModel, table=True):
    __tablename__ = "files"
    id: str = Field(primary_key=True)
    original_name: str
    stored_name: str
    mime_type: str
    size: int

# --- 2. Users Table ---
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
    disabled: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @property
    def hashed_password(self) -> str:
        return self.password_hash
    @hashed_password.setter
    def hashed_password(self, value: str):
        self.password_hash = value

    # Compatibility properties for Member
    @property
    def spec(self) -> str:
        return self.branch or "N/A"
    @spec.setter
    def spec(self, value: str):
        self.branch = value

    @property
    def joinDate(self) -> str:
        return self.created_at.strftime("%Y-%m-%d") if self.created_at else "2024-01-01"
    
    @property
    def retirementDate(self) -> Optional[str]:
        return None

    @property
    def status(self) -> str:
        return "ACTIVE" if self.is_active else "PASSOUT"

    @property
    def techStack(self) -> List[str]:
        return ["N/A"]

    @property
    def githubUrl(self) -> Optional[str]:
        return self.github_url
    @githubUrl.setter
    def githubUrl(self, value: Optional[str]):
        self.github_url = value

    @property
    def linkedinUrl(self) -> Optional[str]:
        return self.linkedin_url
    @linkedinUrl.setter
    def linkedinUrl(self, value: Optional[str]):
        self.linkedin_url = value

    @property
    def isFounder(self) -> bool:
        return False

# Compatibility Alias: Member maps directly to User
Member = User

# --- 3. Teams Table ---
class Team(SQLModel, table=True):
    __tablename__ = "teams"
    id: str = Field(primary_key=True)
    name: str
    description: Optional[str] = None
    created_by: str = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @property
    def leaderId(self) -> str:
        return self.created_by
    @leaderId.setter
    def leaderId(self, value: str):
        self.created_by = value

# --- 4. Team Members Table ---
class TeamMember(SQLModel, table=True):
    __tablename__ = "team_members"
    id: str = Field(primary_key=True)
    team_id: str = Field(foreign_key="teams.id")
    user_id: str = Field(foreign_key="users.id")
    designation: str = Field(default="member") # 'lead', 'co-lead', 'member'
    joined_at: datetime = Field(default_factory=datetime.utcnow)

    @property
    def member_id(self) -> str:
        return self.user_id
    @member_id.setter
    def member_id(self, value: str):
        self.user_id = value

# Compatibility Alias: TeamMemberLink is now TeamMember
TeamMemberLink = TeamMember

# --- 5. Team Mentors Table ---
class TeamMentor(SQLModel, table=True):
    __tablename__ = "team_mentors"
    id: str = Field(primary_key=True)
    team_id: str = Field(foreign_key="teams.id")
    mentor_id: str = Field(foreign_key="users.id")
    assigned_at: datetime = Field(default_factory=datetime.utcnow)

# Compatibility Alias: MentorTeamLink is now TeamMentor
MentorTeamLink = TeamMentor

# --- 6. Projects Table ---
class Project(SQLModel, table=True):
    __tablename__ = "projects"
    id: str = Field(primary_key=True)
    name: str
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    status: str = Field(default="DRAFT") # 'DRAFT', 'LIVE', 'PENDING_ADMIN', 'COMPLETED'
    created_by: str = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Restored columns from old model to prevent endpoint crash
    type: str = Field(default="Web_App")
    deadline: str = Field(default="2026-12-31")
    academicYear: str = Field(default="2025-26", sa_column=Column("academic_year", String(50)))
    gitHubRepo: Optional[str] = Field(default=None, sa_column=Column("github_repo", String(255)))
    teamId: Optional[str] = Field(default=None, sa_column=Column("team_id", String(36), ForeignKey("teams.id")))

# --- 7. Project Teams Table ---
class ProjectTeam(SQLModel, table=True):
    __tablename__ = "project_teams"
    id: str = Field(primary_key=True)
    project_id: str = Field(foreign_key="projects.id")
    team_id: str = Field(foreign_key="teams.id")

# --- 8. Project SRS Table ---
class ProjectSRS(SQLModel, table=True):
    __tablename__ = "project_srs"
    id: str = Field(primary_key=True)
    project_id: str = Field(foreign_key="projects.id")
    version: int = Field(default=1)
    file_id: str = Field(foreign_key="files.id")
    status: str = Field(default="PENDING") # 'PENDING', 'APPROVED', 'REJECTED'
    submitted_by: str = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Compatibility properties for old SRS code
    content: Optional[str] = Field(default="N/A")
    remarks: Optional[str] = None

    @property
    def timestamp(self) -> datetime:
        return self.created_at
    @timestamp.setter
    def timestamp(self, value: datetime):
        self.created_at = value

# Compatibility Alias: SRS is ProjectSRS
SRS = ProjectSRS

# --- 9. SRS Reviews Table ---
class SRSReview(SQLModel, table=True):
    __tablename__ = "srs_reviews"
    id: str = Field(primary_key=True)
    srs_id: str = Field(foreign_key="project_srs.id")
    reviewed_by: str = Field(foreign_key="users.id")
    decision: str # 'APPROVED', 'REJECTED'
    remarks: Optional[str] = None

# --- 10. Modules Table ---
class Module(SQLModel, table=True):
    __tablename__ = "modules"
    id: str = Field(primary_key=True)
    project_id: str = Field(foreign_key="projects.id")
    owner_id: str = Field(foreign_key="users.id")
    name: str
    description: Optional[str] = None
    status: str = Field(default="PLANNING") # 'PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'

# --- 11. Tasks Table ---
class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    id: str = Field(primary_key=True)
    module_id: str = Field(foreign_key="modules.id")
    assigned_to: Optional[str] = Field(default=None, foreign_key="users.id")
    created_by: str = Field(foreign_key="users.id")
    title: str
    description: Optional[str] = None
    status: str = Field(default="TODO") # 'TODO', 'IN_PROGRESS', 'AWAITING_SEAL', 'DONE'
    
    # Restored columns from old model to prevent endpoint crash
    progress: int = Field(default=0)
    whatsDone: List[str] = Field(default=[], sa_column=Column("whats_done", JSON))
    whatsGoingOn: Optional[str] = None
    remarks: Optional[str] = None
    workLog: Optional[str] = None
    reviewFeedback: Optional[str] = None

# --- 12. Task Comments Table ---
class TaskComment(SQLModel, table=True):
    __tablename__ = "task_comments"
    id: str = Field(primary_key=True)
    task_id: str = Field(foreign_key="tasks.id")
    user_id: str = Field(foreign_key="users.id")
    comment: str

# --- 13. Submissions Table ---
class Submission(SQLModel, table=True):
    __tablename__ = "submissions"
    id: str = Field(primary_key=True)
    task_id: str = Field(foreign_key="tasks.id")
    submitted_by: str = Field(foreign_key="users.id")
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    remarks: Optional[str] = None

# --- 14. Project Reviews Table ---
class ProjectReview(SQLModel, table=True):
    __tablename__ = "project_reviews"
    id: str = Field(primary_key=True)
    project_id: str = Field(foreign_key="projects.id")
    mentor_id: str = Field(foreign_key="users.id")
    rating: int
    review_text: Optional[str] = None

# --- 29. Submission Reviews Table ---
class SubmissionReview(SQLModel, table=True):
    __tablename__ = "submission_reviews"
    id: str = Field(primary_key=True)
    submission_id: str = Field(foreign_key="submissions.id")
    reviewed_by: str = Field(foreign_key="users.id")
    status: str = Field(default="APPROVED") # 'APPROVED', 'REJECTED'
    comments: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @property
    def timestamp(self) -> datetime:
        return self.created_at
    @timestamp.setter
    def timestamp(self, value: datetime):
        self.created_at = value

# Compatibility Alias: Review is SubmissionReview
Review = SubmissionReview

# --- 15. Progress Reports Table ---
class ProgressReport(SQLModel, table=True):
    __tablename__ = "progress_reports"
    id: str = Field(primary_key=True)
    project_id: str = Field(foreign_key="projects.id")
    team_id: str = Field(foreign_key="teams.id")
    submitted_by: str = Field(foreign_key="users.id")
    current_progress: int
    blockers: Optional[str] = None
    next_goal: Optional[str] = None

# --- 16. Notices Table ---
class Notice(SQLModel, table=True):
    __tablename__ = "notices"
    id: str = Field(primary_key=True)
    title: str
    content: str
    audience_type: str = Field(default="GLOBAL") # 'GLOBAL', 'TEAM', 'MENTOR'
    created_by: str = Field(foreign_key="users.id")

    @property
    def body(self) -> str:
        return self.content
    @body.setter
    def body(self, value: str):
        self.content = value
        
    @property
    def is_global(self) -> bool:
        return self.audience_type == "GLOBAL"
    @is_global.setter
    def is_global(self, value: bool):
        self.audience_type = "GLOBAL" if value else "TEAM"
        
    @property
    def priority(self) -> str:
        return "Normal"

# Compatibility Alias: Announcement is Notice
Announcement = Notice

# --- 17. Notice Targets Table ---
class NoticeTarget(SQLModel, table=True):
    __tablename__ = "notice_targets"
    id: str = Field(primary_key=True)
    notice_id: str = Field(foreign_key="notices.id")
    target_type: str = Field(default="TEAM") # 'USER', 'TEAM', 'ROLE'
    target_id: str

    @property
    def announcement_id(self) -> str:
        return self.notice_id
    @announcement_id.setter
    def announcement_id(self, value: str):
        self.notice_id = value

    @property
    def team_id(self) -> str:
        return self.target_id
    @team_id.setter
    def team_id(self, value: str):
        self.target_id = value

# Compatibility Alias: AnnouncementTeamLink is NoticeTarget
AnnouncementTeamLink = NoticeTarget

# --- 18. Notice Replies Table ---
class NoticeReply(SQLModel, table=True):
    __tablename__ = "notice_replies"
    id: str = Field(primary_key=True)
    notice_id: str = Field(foreign_key="notices.id")
    user_id: str = Field(foreign_key="users.id")
    message: str

# --- 19. Notice Reactions Table ---
class NoticeReaction(SQLModel, table=True):
    __tablename__ = "notice_reactions"
    id: str = Field(primary_key=True)
    notice_id: str = Field(foreign_key="notices.id")
    user_id: str = Field(foreign_key="users.id")
    reaction: str # 'LIKE', 'LOVE', 'LAUGH', 'SAD', 'ANGRY', 'THUMBS_UP', 'THUMBS_DOWN'

# --- 20. Recruitment Drives Table ---
class RecruitmentDrive(SQLModel, table=True):
    __tablename__ = "recruitment_drives"
    id: str = Field(primary_key=True)
    title: str
    start_date: date
    end_date: date
    status: str = Field(default="UPCOMING") # 'UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'

# --- 21. Applications Table ---
class Application(SQLModel, table=True):
    __tablename__ = "applications"
    id: str = Field(primary_key=True)
    drive_id: str = Field(foreign_key="recruitment_drives.id")
    name: str
    email: str
    branch: str
    admission_year: int
    passout_year: int
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    resume_file_id: Optional[str] = Field(default=None, foreign_key="files.id")
    status: str = Field(default="PENDING") # 'PENDING', 'ACCEPTED', 'REJECTED'

# --- 22. Application Notes Table ---
class ApplicationNote(SQLModel, table=True):
    __tablename__ = "application_notes"
    id: str = Field(primary_key=True)
    application_id: str = Field(foreign_key="applications.id")
    admin_id: str = Field(foreign_key="users.id")
    note: str

# --- 23. Interviews Table ---
class Interview(SQLModel, table=True):
    __tablename__ = "interviews"
    id: str = Field(primary_key=True)
    application_id: str = Field(foreign_key="applications.id")
    interviewer_id: str = Field(foreign_key="users.id")
    scheduled_at: datetime

# --- 24. Interview Feedback Table ---
class InterviewFeedback(SQLModel, table=True):
    __tablename__ = "interview_feedback"
    id: str = Field(primary_key=True)
    interview_id: str = Field(foreign_key="interviews.id")
    decision: str # 'HIRED', 'REJECTED', 'NEXT_ROUND'
    feedback: str

# --- 25. Project Showcase Table ---
class ProjectShowcase(SQLModel, table=True):
    __tablename__ = "project_showcase"
    id: str = Field(primary_key=True)
    project_id: str = Field(foreign_key="projects.id")
    thumbnail_file_id: Optional[str] = Field(default=None, foreign_key="files.id")
    banner_file_id: Optional[str] = Field(default=None, foreign_key="files.id")
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    documentation_url: Optional[str] = None
    is_featured: bool = Field(default=False)

# --- 26. Notifications Table ---
class Notification(SQLModel, table=True):
    __tablename__ = "notifications"
    id: str = Field(primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    title: str
    message: str
    is_read: bool = Field(default=False)

# --- 27. Activities Table ---
class Activity(SQLModel, table=True):
    __tablename__ = "activities"
    id: str = Field(primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    entity_type: str
    entity_id: str
    action: str

# --- 28. Audit Logs Table ---
class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_logs"
    id: str = Field(primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    entity_type: str
    entity_id: str
    action: str

# --- 30. Progress Feedback Table ---
class ProgressFeedback(SQLModel, table=True):
    __tablename__ = "progress_feedback"
    id: str = Field(primary_key=True)
    report_id: str = Field(foreign_key="progress_reports.id")
    feedback_by: str = Field(foreign_key="users.id")
    feedback_text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# --- 31. Notice Acknowledgements Table ---
class NoticeAcknowledgement(SQLModel, table=True):
    __tablename__ = "notice_acknowledgements"
    id: str = Field(primary_key=True)
    notice_id: str = Field(foreign_key="notices.id")
    user_id: str = Field(foreign_key="users.id")
    acknowledged_at: datetime = Field(default_factory=datetime.utcnow)

# --- Core Settings Table (for system_settings support) ---
class Setting(SQLModel, table=True):
    __tablename__ = "system_settings"
    key: str = Field(primary_key=True)
    value: str
    description: Optional[str] = None

# --- Hall of Echoes Table (Archived Members) ---
class HallOfEchoes(SQLModel, table=True):
    __tablename__ = "hall_of_echoes"
    id: str = Field(primary_key=True)
    name: str
    email: str
    spec: str
    joinDate: str
    retirementDate: str
    techStack: List[str] = Field(default=[], sa_column=Column(JSON))
    archivedAt: datetime = Field(default_factory=datetime.utcnow)

# Compatibility Alias for Spelling
NoticeAcknowledgment = NoticeAcknowledgement
