from sqlmodel import create_engine, SQLModel, Session
import pymysql

DATABASE_URL = "mysql+pymysql://root:root@localhost:3306/sdc_portal"

def check_conn():
    print(f"[*] Attempting to connect to: {DATABASE_URL}")
    try:
        # Check if DB exists first
        conn = pymysql.connect(host='localhost', user='root', password='root')
        with conn.cursor() as cursor:
            cursor.execute("SHOW DATABASES;")
            dbs = [db[0] for db in cursor.fetchall()]
            if 'sdc_portal' not in dbs:
                print("[!] Database 'sdc_portal' missing. Creating...")
                cursor.execute("CREATE DATABASE sdc_portal;")
                print("[+] Database created.")
            else:
                print("[+] Database 'sdc_portal' exists.")
        conn.close()

        # Check SQLModel engine
        engine = create_engine(DATABASE_URL)
        with Session(engine) as session:
            print("[+] SQLAlchemy/SQLModel Connection: SUCCESS")
            
    except Exception as e:
        print(f"[FAIL] Connection error: {e}")

if __name__ == "__main__":
    check_conn()
