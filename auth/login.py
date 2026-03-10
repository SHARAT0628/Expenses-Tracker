from database.queries import get_user_by_username
from utils.hashing import verify_password

def authenticate_user(username: str, password: str):
    user = get_user_by_username(username)
    if not user:
        return False, None

    user_id, _, password_hash = user
    if not verify_password(password, password_hash):
        return False, None

    return True, user_id
