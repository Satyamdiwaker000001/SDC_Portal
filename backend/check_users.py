import sqlite3

conn = sqlite3.connect("sdc_portal.db")
cursor = conn.cursor()
cursor.execute("SELECT id, name, email, role, membership_status, is_active FROM user")
rows = cursor.fetchall()
print(f"TOTAL USERS IN DB: {len(rows)}")
for r in rows:
    print(r)
conn.close()
