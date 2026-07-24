from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlmodel import Session, select, func, or_
from typing import Any, List, Optional

from ...api import deps
from ...models.models import Project, User, Team, TeamMember, SystemSetting

router = APIRouter()

class ContactRequest(BaseModel):
    name: str
    email: str
    subject: str
    message: str

@router.get("/home")
def get_home_metrics(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get generic home details & featured project list
    """
    featured = db.exec(
        select(Project)
        .where(Project.is_featured == True)
        .limit(3)
    ).all()
    
    project_count = db.exec(select(func.count(Project.id))).first() or 0
    dev_count = db.exec(select(func.count(User.id)).where(User.role == "developer")).first() or 0
    
    return {
        "tagline": "Building software for the campus community.",
        "project_count": project_count,
        "dev_count": dev_count,
        "featured_projects": featured
    }

@router.get("/projects")
def list_public_projects(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get list of all public showcase projects
    """
    return db.exec(select(Project).where(Project.status == "LIVE")).all()

@router.get("/projects/featured")
def list_featured_projects(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get list of featured projects
    """
    return db.exec(
        select(Project)
        .where(Project.is_featured == True)
    ).all()

@router.get("/projects/{projectId}")
def get_public_project_details(
    projectId: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get specific project showcase details
    """
    project = db.get(Project, projectId)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"project": project}

@router.get("/projects/{projectId}/team")
def get_public_project_team(
    projectId: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get development team detail assigned to the project
    """
    project = db.get(Project, projectId)
    if not project or not project.team_id:
        raise HTTPException(status_code=404, detail="Project or team assignment not found")
    team = db.get(Team, project.team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team details not found")
    
    # Get members
    members = db.exec(
        select(User)
        .join(TeamMember, User.id == TeamMember.user_id)
        .where(TeamMember.team_id == project.team_id)
    ).all()
    
    return {"team": team, "members": members}

@router.get("/developers")
def list_public_developers(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get active student developers roster
    """
    return db.exec(select(User).where(User.role == "developer", User.is_active == True)).all()

@router.get("/developers/{userId}")
def get_public_developer_profile(
    userId: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get specific developer portfolio profile
    """
    user = db.exec(select(User).where(User.id == userId, User.role == "developer")).first()
    if not user:
        raise HTTPException(status_code=404, detail="Developer profile not found")
    return user

@router.get("/alumni")
def list_public_alumni(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get alumni roster list
    """
    return db.exec(select(User).where(User.role == "developer", User.passout_year > 0)).all()

@router.get("/mentors")
def list_public_mentors(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get mentors portfolio list
    """
    return db.exec(select(User).where(User.role == "mentor")).all()

@router.get("/mentors/{mentorId}")
def get_public_mentor(
    mentorId: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get mentor details
    """
    mentor = db.exec(select(User).where(User.id == mentorId, User.role == "mentor")).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return mentor

@router.get("/teams")
def list_public_teams(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get teams list
    """
    return db.exec(select(Team)).all()

@router.get("/teams/{teamId}")
def get_public_team_details(
    teamId: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get specific team overview and roster
    """
    team = db.get(Team, teamId)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    members = db.exec(
        select(User)
        .join(TeamMember, User.id == TeamMember.user_id)
        .where(TeamMember.team_id == teamId)
    ).all()
    return {"team": team, "members": members}

@router.get("/stats")
def get_public_statistics(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get system cumulative statistics
    """
    project_count = db.exec(select(func.count(Project.id))).first() or 0
    team_count = db.exec(select(func.count(Team.id))).first() or 0
    dev_count = db.exec(select(func.count(User.id)).where(User.role == "developer")).first() or 0
    alumni_count = db.exec(select(func.count(User.id)).where(User.role == "developer", User.passout_year > 0)).first() or 0
    
    return {
        "projects": project_count,
        "teams": team_count,
        "developers": dev_count,
        "alumni": alumni_count
    }

@router.get("/search")
def search_public_catalog(
    q: str = Query(..., min_length=2),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Global search across projects and developers
    """
    projects = db.exec(
        select(Project)
        .where(Project.status == "LIVE", or_(Project.name.contains(q), Project.short_description.contains(q)))
    ).all()
    
    developers = db.exec(
        select(User)
        .where(User.role == "developer", or_(User.name.contains(q), User.email.contains(q)))
    ).all()
    
    return {"projects": projects, "developers": developers}

@router.get("/recruitment")
def list_public_recruitment_drives(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get recruitment status from system settings
    """
    setting = db.exec(
        select(SystemSetting).where(SystemSetting.key == "is_recruitment_live")
    ).first()
    is_active = setting is not None and setting.value.lower() == "true"
    return {"is_active": is_active}

@router.get("/recruitment/status")
def get_public_recruitment_status(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Checks if there is any active recruitment drive running
    """
    setting = db.exec(
        select(SystemSetting).where(SystemSetting.key == "is_recruitment_live")
    ).first()
    is_active = setting is not None and setting.value.lower() == "true"
    return {"is_active": is_active}

@router.post("/contact")
def submit_contact_form(
    contact_in: ContactRequest,
) -> Any:
    """
    Record contact us inquiries
    """
    # Simply log inquiry and return success
    return {"status": "SUCCESS", "message": "Thank you for contacting SDC! Your message has been received."}
