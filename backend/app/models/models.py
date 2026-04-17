from __future__ import annotations
from typing import List, Optional
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, Column, JSON
from sqlalchemy.orm import relationship

# --- LINK_TABLES ---

class TeamMemberLink(SQLModel, table=True):
    team_id: str | None = Field(default=None, foreign_key="team.id", primary_key=True)
    member_id: str | None = Field(default=None, foreign_key="member.id", primary_key=True)

class AnnouncementTeamLink(SQLModel, table=True):
    announcement_id: int | None = Field(default=None, foreign_key="announcement.id", primary_key=True)
    team_id: str | None = Field(default=None, foreign_key="team.id", primary_key=True)

# Status Constants
# Member: ACTIVE, PASSOUT, RETIRED
# Project: DRAFT, LIVE, PENDING_ADMIN, COMPLETED
# Task: TODO, IN_PROGRESS, AWAITING_SEAL, DONE
# Application: PENDING, ACCEPTED, REJECTED

# --- CORE_MODELS ---

class User(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    name: str
    role: str # admin, developer
    image: str | None = Field(default="N/A")
    hashed_password: str

class Member(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True)
    spec: str # "Frontend Developer", "Backend Lead" etc
    joinDate: str
    retirementDate: str | None = None
    status: str # ACTIVE, PASSOUT, RETIRED
    image: str | None = Field(default="N/A")
    techStack: List[str] = Field(default=["N/A"], sa_column=Column(JSON))
    githubUrl: str | None = None
    linkedinUrl: str | None = None
    isFounder: bool = Field(default=False)
    
    # Relationships
    teams: List[Team] = Relationship(back_populates="members", link_model=TeamMemberLink)

class Team(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    name: str
    leaderId: str = Field(foreign_key="member.id")
    
    # Relationships
    members: List[Member] = Relationship(back_populates="teams", link_model=TeamMemberLink)
    projects: List[Project] = Relationship(back_populates="team")
    announcements: List[Announcement] = Relationship(back_populates="teams", link_model=AnnouncementTeamLink)

class Project(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    name: str
    description: str | None = None
    type: str # Cybersecurity, Web_App etc
    status: str # DRAFT, LIVE, COMPLETED, PENDING_ADMIN
    deadline: str
    srsLink: str | None = None
    progress: int = Field(default=0)
    academicYear: str = Field(default="2024-25")
    gitHubRepo: str | None = None
    teamId: str | None = Field(default=None, foreign_key="team.id")
    
    # Relationships
    team: Optional[Team] = Relationship(back_populates="projects")
    tasks: List[Task] = Relationship(back_populates="project")

class Task(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    moduleName: str # "UI_LAYER", "CORE_API" etc
    title: str
    assignedTo: str | None = Field(default=None, foreign_key="member.id")
    status: str # TODO, IN_PROGRESS, AWAITING_SEAL, DONE
    progress: int = Field(default=0)
    whatsDone: List[str] = Field(default=[], sa_column=Column(JSON))
    whatsGoingOn: str | None = None
    remarks: str | None = None
    workLog: str | None = None
    project_id: str = Field(foreign_key="project.id")
    
    # Relationship
    project: Optional[Project] = Relationship(back_populates="tasks")
    reviewFeedback: str | None = Field(default=None)

class Application(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str
    contact: str
    class_name: str # e.g. B.Tech 3rd
    interested: str
    status: str = Field(default="PENDING")
    photo_url: str | None = Field(default=None)
    resume_url: str | None = Field(default=None)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Announcement(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    body: str
    priority: str # Normal, Important, Urgent
    is_global: bool = Field(default=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    teams: List[Team] = Relationship(back_populates="announcements", link_model=AnnouncementTeamLink)

class Setting(SQLModel, table=True):
    key: str = Field(primary_key=True)
    value: str
    description: str | None = None

class HallOfEchoes(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True) # Preserve original MEM-ID
    name: str
    email: str
    spec: str
    joinDate: str
    retirementDate: str
    techStack: List[str] = Field(default=[], sa_column=Column(JSON))
    archivedAt: datetime = Field(default_factory=datetime.utcnow)
