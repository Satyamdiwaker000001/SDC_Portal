import os
from dotenv import load_dotenv
from sqlmodel import create_engine, Session, text

load_dotenv("a:/New project/SDC_Portal/backend/.env")

connect_args = {}
import certifi
ca_path = certifi.where()
connect_args = {"ssl": {"ca": ca_path}}

engine = create_engine(os.getenv("DATABASE_URL"), connect_args=connect_args)

with engine.begin() as conn:
    try:
        conn.execute(text("ALTER TABLE files ADD COLUMN file_data LONGBLOB"))
        print("Column file_data added successfully.")
    except Exception as e:
        print(f"Error (may already exist): {e}")
