import pymysql
from app.core.config import settings

def reset():
    # Connect directly to MySQL without selecting a DB
    connection = pymysql.connect(
        host="localhost",
        user="root",
        password="root",
    )
    
    with connection.cursor() as cursor:
        cursor.execute("DROP DATABASE IF EXISTS sdc_portal")
        cursor.execute("CREATE DATABASE sdc_portal")
    
    connection.commit()
    connection.close()
    print("Database dropped and cleanly recreated.")

if __name__ == "__main__":
    reset()
