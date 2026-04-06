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
    techStack: list[str] = Field(default=["N/A"], sa_column=Column(JSON))
    
    # Relationships
    teams: list[Team] = Relationship(sa_relationship=relationship("Team", back_populates="members", secondary="teammemberlink"))

class Team(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    name: str
    leaderId: str = Field(foreign_key="member.id")
    
    # Relationships
    members: list[Member] = Relationship(sa_relationship=relationship("Member", back_populates="teams", secondary="teammemberlink"))
    projects: list[Project] = Relationship(sa_relationship=relationship("Project", back_populates="team"))
    announcements: list[Announcement] = Relationship(sa_relationship=relationship("Announcement", back_populates="teams", secondary="announcementteamlink"))

class Project(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    name: str
    description: str | None = None
    type: str # Cybersecurity, Web_App etc
    status: str # LIVE, PENDING, COMPLETED
    deadline: str
    progress: int = Field(default=0)
    teamId: str | None = Field(default=None, foreign_key="team.id")
    
    # Relationships
    team: Team | None = Relationship(sa_relationship=relationship("Team", back_populates="projects"))
    tasks: list[Task] = Relationship(sa_relationship=relationship("Task", back_populates="project"))

class Task(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    moduleName: str # "UI_LAYER", "CORE_API" etc
    title: str
    assignedTo: str | None = Field(default=None, foreign_key="member.id")
    status: str # TODO, IN_PROGRESS, DONE, REVIEW_PENDING
    project_id: str = Field(foreign_key="project.id")
    
    # Relationship
    project: Project | None = Relationship(sa_relationship=relationship("Project", back_populates="tasks"))
    reviewFeedback: str | None = Field(default=None)

class Application(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str
    contact: str
    class_name: str # e.g. B.Tech 3rd
    interested: str
    status: str = Field(default="PENDING")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Announcement(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    body: str
    priority: str # Normal, Important, Urgent
    is_global: bool = Field(default=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    teams: list[Team] = Relationship(sa_relationship=relationship("Team", back_populates="announcements", secondary="announcementteamlink"))
