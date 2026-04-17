import sqlite3
import os

def migrate():
    db_path = 'backend/sdc_portal.db'
    if not os.path.exists(db_path):
        db_path = './sdc_portal.db'
    
    print(f"Connecting to {db_path}...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Add columns one by one
    alterations = [
        ("member", "retirementDate", "TEXT"),
        ("project", "srsLink", "TEXT"),
        ("task", "workLog", "TEXT"),
        ("task", "progress", "INTEGER DEFAULT 0"),
    ]
    
    for table, col, col_type in alterations:
        try:
            cursor.execute(f"ALTER TABLE {table} ADD COLUMN {col} {col_type}")
            print(f"Added {col} to {table}")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e):
                print(f"Column {col} already exists in {table}")
            else:
                print(f"Error adding {col} to {table}: {e}")
                
    conn.commit()
    conn.close()
    print("Migration sequence completed.")

if __name__ == "__main__":
    migrate()
