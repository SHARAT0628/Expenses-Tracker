from database.queries import create_user, get_user_by_username
from utils.hashing import hash_password

def register_user(username: str, password: str):
    existing = get_user_by_username(username)
    if existing:
        return False, "Username already exists"

    password_hash = hash_password(password)
    create_user(username, password_hash)
    return True, "User registered successfully"
