import time
import threading
from datetime import datetime
from sqlmodel import Session, select
from ..db.session import engine
from ..models.models import Member, HallOfEchoes, User

def sync_clock_loop():
    """
    Background engine that checks for operative retirements every minute.
    If Server_Time >= User_Retire_Date:
    1. Status -> Retired
    2. Access -> Revoked (User record deleted)
    3. Archive -> Hall of Echoes
    """
    print("[SYNC_CLOCK] Engine Initialized.")
    while True:
        try:
            with Session(engine) as db:
                current_date = datetime.utcnow().date()
                # Only check ACTIVE members
                statement = select(Member).where(Member.status == "ACTIVE")
                members = db.exec(statement).all()
                
                for member in members:
                    if member.retirementDate:
                        try:
                            r_date = datetime.strptime(member.retirementDate, "%Y-%m-%d").date()
                            if current_date >= r_date:
                                # 1. Archive to Hall of Echoes
                                echo = HallOfEchoes(
                                    id=member.id,
                                    name=member.name,
                                    email=member.email,
                                    spec=member.spec,
                                    joinDate=member.joinDate,
                                    retirementDate=member.retirementDate,
                                    techStack=member.techStack
                                )
                                db.add(echo)
                                
                                # 2. Mark as RETIRED in active registry
                                member.status = "RETIRED"
                                db.add(member)
                                
                                # 3. Revoke Access (Delete login credentials)
                                user = db.get(User, member.id)
                                if user:
                                    db.delete(user)
                                
                                db.commit()
                                print(f"[SYNC_CLOCK] Mission Expired for {member.name} ({member.id}). Archived to Hall of Echoes.")
                        except ValueError:
                            # Log invalid date format but continue
                            continue
        except Exception as e:
            print(f"[SYNC_CLOCK] Critical Engine Error: {e}")
        
        # Throttle check frequency
        time.sleep(60)

def start_sync_clock():
    """
    Start the engine in a background daemon thread.
    """
    thread = threading.Thread(target=sync_clock_loop, daemon=True)
    thread.start()
