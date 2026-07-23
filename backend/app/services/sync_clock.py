import time
import threading
from datetime import datetime
from sqlmodel import Session, select
from ..db.session import engine
from ..models.models import User

def sync_clock_loop():
    """
    Background engine that checks for user deactivation based on passout year.
    If the current year >= User.passout_year and passout_year > 0:
    1. membership_status -> alumni
    2. is_active -> False (revoke access)
    """
    print("[SYNC_CLOCK] Engine Initialized.")
    while True:
        try:
            with Session(engine) as db:
                current_year = datetime.utcnow().year
                # Only check active developers with a passout year set
                statement = select(User).where(
                    User.role == "developer",
                    User.is_active == True,
                    User.passout_year > 0
                )
                users = db.exec(statement).all()
                
                for user in users:
                    if current_year >= user.passout_year:
                        # 1. Mark as alumni
                        user.membership_status = "alumni"
                        user.is_active = False
                        db.add(user)
                        print(f"[SYNC_CLOCK] User {user.name} ({user.id}) marked as alumni (passout year {user.passout_year}).")
                
                db.commit()
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
