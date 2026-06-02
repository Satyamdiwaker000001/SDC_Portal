from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Any, List, Optional

from ...api import deps
from ...models.models import Team, Member, TeamMemberLink, User

router = APIRouter()

class TeamCreate(BaseModel):
    id: str
    name: str
    leaderId: str

class TeamLeaderUpdate(BaseModel):
    leaderId: str

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
    leader = db.get(Member, team_in.leaderId)
    if not leader:
        raise HTTPException(status_code=404, detail="Leader member profile not found")

    team = Team(
        id=team_in.id,
        name=team_in.name,
        leaderId=team_in.leaderId,
    )
    db.add(team)
    
    # Auto link leader as member of team
    link = TeamMemberLink(team_id=team.id, member_id=team.leaderId)
    db.add(link)
    
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
        
    # Check if link exists
    existing_link = db.exec(select(TeamMemberLink).where(TeamMemberLink.team_id == teamId, TeamMemberLink.member_id == request.userId)).first()
    if existing_link:
        return {"status": "SUCCESS", "message": "Member already in team"}
        
    link = TeamMemberLink(team_id=teamId, member_id=request.userId)
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
        
    link = db.exec(select(TeamMemberLink).where(TeamMemberLink.team_id == teamId, TeamMemberLink.member_id == userId)).first()
    if not link:
        raise HTTPException(status_code=404, detail="Membership mapping not found")
        
    db.delete(link)
    db.commit()
    return {"status": "SUCCESS", "message": "Member removed from team"}

@router.patch("/admin/teams/{teamId}/leader")
def promote_team_leader(
    teamId: str,
    update: TeamLeaderUpdate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Assign a new Team Leader for the team (Admin only)
    """
    team = db.get(Team, teamId)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    member = db.get(Member, update.leaderId)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
        
    team.leaderId = update.leaderId
    db.add(team)
    
    # Ensure leader is also a member of the team
    link = db.exec(select(TeamMemberLink).where(TeamMemberLink.team_id == teamId, TeamMemberLink.member_id == update.leaderId)).first()
    if not link:
        new_link = TeamMemberLink(team_id=teamId, member_id=update.leaderId)
        db.add(new_link)
        
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
    return team.members
