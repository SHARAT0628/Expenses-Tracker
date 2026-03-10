"""
This script was used once to initialize the remote database schema.
Credentials are loaded from environment variables for security.
Run this script only once locally if you need to re-initialize the schema.

Usage:
  Set environment variables DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
  Then run: python init_remote_db.py
"""
import mysql.connector
import os

DB_CONFIG = {
    "host": os.environ.get("DB_HOST"),
    "user": os.environ.get("DB_USER"),
    "password": os.environ.get("DB_PASSWORD"),
    "database": os.environ.get("DB_NAME"),
    "port": int(os.environ.get("DB_PORT", 3306))
}

def init_db():
    print("Connecting to database...")
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    with open('database/schema.sql', 'r') as f:
        sql_file = f.read()
        
    sql_commands = sql_file.split(';')
    
    for command in sql_commands:
        if command.strip() != "":
            try:
                cursor.execute(command)
                conn.commit()
            except Exception as e:
                print(f"Error: {e}")
                
    cursor.close()
    conn.close()
    print("Database initialization complete.")

if __name__ == "__main__":
    init_db()
