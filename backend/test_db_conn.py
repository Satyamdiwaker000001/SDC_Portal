from sqlmodel import Session, create_engine, select
from app.models.models import Team
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)

def test_db():
    try:
        with Session(engine) as session:
            result = session.exec(select(Team)).first()
            print(f"Database connection successful! Found team: {result.name if result else 'None'}")
    except Exception as e:
        print(f"Database connection failed: {e}")

if __name__ == "__main__":
    test_db()
