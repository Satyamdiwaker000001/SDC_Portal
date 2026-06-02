from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Any, List

from ...api import deps
from ...models.models import Team, User, MentorTeamLink

router = APIRouter()

class AssignMentorRequest(BaseModel):
    mentorId: str

@router.post("/admin/teams/{teamId}/mentors")
def assign_mentor(
    teamId: str,
    request: AssignMentorRequest,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Assign a Mentor to a Team (Admin only)
    """
    team = db.get(Team, teamId)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    mentor = db.get(User, request.mentorId)
    if not mentor or mentor.role != "mentor":
        raise HTTPException(status_code=404, detail="Mentor user not found or not in mentor role")
        
    # Check if link exists
    existing = db.exec(select(MentorTeamLink).where(MentorTeamLink.team_id == teamId, MentorTeamLink.mentor_id == request.mentorId)).first()
    if existing:
        return {"status": "SUCCESS", "message": "Mentor already assigned to team"}
        
    link = MentorTeamLink(team_id=teamId, mentor_id=request.mentorId)
    db.add(link)
    db.commit()
    return {"status": "SUCCESS", "message": "Mentor assigned to team"}

@router.delete("/admin/teams/{teamId}/mentors/{mentorId}")
def remove_mentor(
    teamId: str,
    mentorId: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Remove mentor mapping from team (Admin only)
    """
    link = db.exec(select(MentorTeamLink).where(MentorTeamLink.team_id == teamId, MentorTeamLink.mentor_id == mentorId)).first()
    if not link:
        raise HTTPException(status_code=404, detail="Mentor team assignment not found")
        
    db.delete(link)
    db.commit()
    return {"status": "SUCCESS", "message": "Mentor mapping removed"}

@router.get("/mentor/teams")
def mentor_teams(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve teams assigned to the currently logged-in mentor
    """
    if current_user.role != "mentor" and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized. Mentors and Admins only.")
        
    if current_user.role == "admin":
        # Admins see all teams
        teams = db.exec(select(Team)).all()
        return teams
        
    # Query teams mapped to this mentor
    statement = select(Team).join(MentorTeamLink).where(MentorTeamLink.mentor_id == current_user.id)
    teams = db.exec(statement).all()
    return teams
