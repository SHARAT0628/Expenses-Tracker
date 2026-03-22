import os
import mysql.connector
from dotenv import load_dotenv

# Load credentials from .env
load_dotenv()

DB_CONFIG = {
    "host": os.environ.get("DB_HOST"),
    "user": os.environ.get("DB_USER"),
    "password": os.environ.get("DB_PASSWORD"),
    "database": os.environ.get("DB_NAME"),
    "port": int(os.environ.get("DB_PORT", 3306)),
    "ssl_disabled": False
}

def list_users():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, username, created_at FROM users")
        users = cursor.fetchall()
        
        print("\n" + "="*50)
        print(f"{'ID':<5} | {'Username':<20} | {'Joined Date'}")
        print("-" * 50)
        
        for user in users:
            print(f"{user[0]:<5} | {user[1]:<20} | {user[2]}")
            
        print("-" * 50)
        print(f"Total Users: {len(users)}")
        print("="*50 + "\n")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error connecting to database: {e}")

if __name__ == "__main__":
    list_users()
