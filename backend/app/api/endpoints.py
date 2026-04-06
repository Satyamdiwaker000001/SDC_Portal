from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from ..db.session import get_session
from ..models.models import Member, Team, Project, User

router = APIRouter()

# --- MEMBERS ---
@router.get("/members", response_model=List[Member])
def get_members(session: Session = Depends(get_session)):
    return session.exec(select(Member)).all()

@router.post("/members", response_model=Member)
def create_member(member: Member, session: Session = Depends(get_session)):
    session.add(member)
    session.commit()
    session.refresh(member)
    return member

# --- TEAMS ---
@router.get("/teams", response_model=List[Team])
def get_teams(session: Session = Depends(get_session)):
    return session.exec(select(Team)).all()

@router.post("/teams", response_model=Team)
def create_team(team: Team, session: Session = Depends(get_session)):
    session.add(team)
    session.commit()
    session.refresh(team)
    return team

# --- PROJECTS ---
@router.get("/projects", response_model=List[Project])
def get_projects(session: Session = Depends(get_session)):
    return session.exec(select(Project)).all()

@router.post("/projects", response_model=Project)
def create_project(project: Project, session: Session = Depends(get_session)):
    session.add(project)
    session.commit()
    session.refresh(project)
    return project

@router.patch("/projects/{project_id}", response_model=Project)
def update_project_progress(project_id: str, progress: int, session: Session = Depends(get_session)):
    db_project = session.get(Project, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    db_project.progress = progress
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project
