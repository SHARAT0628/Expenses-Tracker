from auth.register import register_user
from auth.login import authenticate_user

status, msg = register_user("phase2_user", "password123")
print("REGISTER:", status, msg)

success, user_id = authenticate_user("phase2_user", "password123")
print("LOGIN SUCCESS:", success, "USER ID:", user_id)
