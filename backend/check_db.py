import sqlite3
import os

db_path = 'sdc_portal.db'
print(f"File exists: {os.path.exists(db_path)}")
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    print("Tables:", conn.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall())
    
    try:
        users = conn.execute("SELECT email, password_hash FROM users").fetchall()
        print("Users:", users)
    except Exception as e:
        print("Error fetching users:", e)
    
    conn.close()
