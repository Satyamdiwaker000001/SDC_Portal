from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Any, List, Optional

from ...api import deps
from ...models.models import Team, Member, TeamMemberLink, User, TeamMember

router = APIRouter()

class TeamCreate(BaseModel):
    id: str
    name: str

class MemberAddRequest(BaseModel):
    userId: str

@router.post("/admin/teams", status_code=status.HTTP_201_CREATED)
def create_team(
    team_in: TeamCreate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create a new development team (Admin only)
    """
    existing_team = db.get(Team, team_in.id)
    if existing_team:
        raise HTTPException(status_code=400, detail="Team ID already exists")
    
    # Check if leader exists
    leader = db.get(Member, team_in.id)

    team = Team(
        id=team_in.id,
        name=team_in.name,
    )
    db.add(team)
    
    db.commit()
    db.refresh(team)
    return {"status": "SUCCESS", "team": team}

@router.get("/teams")
def list_teams(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    List all teams in SDC
    """
    teams = db.exec(select(Team)).all()
    return teams

@router.get("/teams/{teamId}")
def team_details(
    teamId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get metadata & description of a specific team by ID
    """
    team = db.get(Team, teamId)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

@router.delete("/admin/teams/{teamId}")
def delete_team(
    teamId: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Delete team (Admin only)
    """
    team = db.get(Team, teamId)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    # Delete links
    links = db.exec(select(TeamMemberLink).where(TeamMemberLink.team_id == teamId)).all()
    for link in links:
        db.delete(link)
        
    db.delete(team)
    db.commit()
    return {"status": "SUCCESS", "message": "Team deleted"}

@router.post("/admin/teams/{teamId}/members")
def add_member(
    teamId: str,
    request: MemberAddRequest,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Add a developer member to the team (Admin only)
    """
    team = db.get(Team, teamId)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    member = db.get(Member, request.userId)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
        
    import uuid
    link = TeamMemberLink(id=str(uuid.uuid4()), team_id=teamId, user_id=request.userId)
    db.add(link)
    db.commit()
    return {"status": "SUCCESS", "message": "Member added to team"}

@router.delete("/admin/teams/{teamId}/members/{userId}")
def remove_member(
    teamId: str,
    userId: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Remove a member from the team (Admin only)
    """
    team = db.get(Team, teamId)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    link = db.exec(select(TeamMemberLink).where(TeamMemberLink.team_id == teamId, TeamMemberLink.user_id == userId)).first()
    if not link:
        raise HTTPException(status_code=404, detail="Membership mapping not found")
        
    db.delete(link)
    db.commit()
    return {"status": "SUCCESS", "message": "Member removed from team"}

@router.patch("/admin/teams/{teamId}/leader")
def promote_team_leader(
    teamId: str,
    update: MemberAddRequest,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Assign a new Team Leader for the team (Admin only)
    """
    team = db.get(Team, teamId)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    member = db.get(Member, update.userId)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
        
    # Set existing leader to member
    existing_lead = db.exec(select(TeamMember).where(
        TeamMember.team_id == teamId,
        TeamMember.designation == "lead"
    )).first()
    if existing_lead:
        existing_lead.designation = "member"
        db.add(existing_lead)
    
    # Ensure user is a member of the team, then promote to lead
    link = db.exec(select(TeamMemberLink).where(TeamMemberLink.team_id == teamId, TeamMemberLink.user_id == update.userId)).first()
    if not link:
        import uuid
        new_link = TeamMemberLink(id=str(uuid.uuid4()), team_id=teamId, user_id=update.userId, designation="lead")
        db.add(new_link)
    else:
        link.designation = "lead"
        db.add(link)
        
    db.commit()
    db.refresh(team)
    return {"status": "SUCCESS", "message": "Team leader promoted successfully", "team": team}

@router.get("/teams/{teamId}/members")
def get_team_members(
    teamId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve all members belonging to a team
    """
    team = db.get(Team, teamId)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    links = db.exec(select(TeamMemberLink).where(TeamMemberLink.team_id == teamId)).all()
    user_ids = [link.user_id for link in links]
    if not user_ids:
        return []
    
    users = db.exec(select(User).where(User.id.in_(user_ids))).all()
    return users
