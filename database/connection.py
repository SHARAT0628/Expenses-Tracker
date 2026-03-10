import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "user": os.environ.get("DB_USER", "root"),
    "password": os.environ.get("DB_PASSWORD", ""),
    "database": os.environ.get("DB_NAME", "expense_tracker"),
    "port": int(os.environ.get("DB_PORT", 3306))
}

def get_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except Error as e:
        raise RuntimeError(f"Database connection failed: {e}")

def execute_query(query, params=None, fetchone=False, fetchall=False):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, params or ())
        result = None
        if fetchone:
            result = cursor.fetchone()
        elif fetchall:
            result = cursor.fetchall()
        conn.commit()
        return result
    finally:
        cursor.close()
        conn.close()
