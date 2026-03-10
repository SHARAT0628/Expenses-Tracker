from database.queries import get_user_categories, create_category

def fetch_categories(user_id):
    return get_user_categories(user_id)

def add_category(user_id, name):
    create_category(user_id, name)
