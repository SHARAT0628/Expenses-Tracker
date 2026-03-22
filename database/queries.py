from database.connection import execute_query

def create_user(username, password_hash):
    execute_query(
        "INSERT INTO users (username, password_hash) VALUES (%s, %s)",
        (username, password_hash)
    )

def get_user_by_username(username):
    return execute_query(
        "SELECT id, username, password_hash FROM users WHERE username = %s",
        (username,),
        fetchone=True
    )

def create_file(user_id, name, description=None):
    execute_query(
        "INSERT INTO files (user_id, name, description) VALUES (%s, %s, %s)",
        (user_id, name, description)
    )

def get_user_files(user_id):
    return execute_query(
        """
        SELECT id, name, description, is_favorite, created_at, updated_at
        FROM files
        WHERE user_id = %s AND is_active = 1
        ORDER BY updated_at DESC
        """,
        (user_id,),
        fetchall=True
    )

def add_expense(user_id, file_id, category_id, title, description, amount, payment_mode, expense_date):
    execute_query(
        """
        INSERT INTO expenses
        (user_id, file_id, category_id, title, description, amount, payment_mode, expense_date)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (user_id, file_id, category_id, title, description, amount, payment_mode, expense_date)
    )

def update_expense(expense_id, user_id, title, description, amount, category_id, payment_mode, expense_date):
    execute_query(
        """
        UPDATE expenses
        SET title = %s, description = %s, amount = %s, category_id = %s,
            payment_mode = %s, expense_date = %s
        WHERE id = %s AND user_id = %s
        """,
        (title, description, amount, category_id, payment_mode, expense_date, expense_id, user_id)
    )

def delete_expense(expense_id, user_id):
    execute_query(
        "DELETE FROM expenses WHERE id = %s AND user_id = %s",
        (expense_id, user_id)
    )

def get_file_total(user_id, file_id):
    result = execute_query(
        """
        SELECT COALESCE(SUM(amount), 0)
        FROM expenses
        WHERE user_id = %s AND file_id = %s
        """,
        (user_id, file_id),
        fetchone=True
    )
    return result[0]
def get_monthly_summary(user_id, file_id, year, month):
    return execute_query(
        """
        SELECT
            COALESCE(SUM(amount), 0) AS total_spend,
            COUNT(*) AS expense_count
        FROM expenses
        WHERE user_id = %s
          AND file_id = %s
          AND YEAR(expense_date) = %s
          AND MONTH(expense_date) = %s
        """,
        (user_id, file_id, year, month),
        fetchone=True
    )


def get_top_category(user_id, file_id, year, month):
    result = execute_query(
        """
        SELECT c.name, SUM(e.amount) AS total
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
        WHERE e.user_id = %s
          AND e.file_id = %s
          AND YEAR(e.expense_date) = %s
          AND MONTH(e.expense_date) = %s
        GROUP BY c.name
        ORDER BY total DESC
        LIMIT 1
        """,
        (user_id, file_id, year, month),
        fetchone=True
    )
    return result[0] if result else "—"


def get_recent_expenses(user_id, limit=5):
    return execute_query(
        """
        SELECT expense_date, c.name, amount
        FROM expenses e
        LEFT JOIN categories c ON e.category_id = c.id
        WHERE e.user_id = %s
        ORDER BY expense_date DESC
        LIMIT %s
        """,
        (user_id, limit),
        fetchall=True
    )


def get_recent_files(user_id, limit=3):
    return execute_query(
        """
        SELECT name, updated_at
        FROM files
        WHERE user_id = %s AND is_active = 1
        ORDER BY updated_at DESC
        LIMIT %s
        """,
        (user_id, limit),
        fetchall=True
    )


def get_user_budget(user_id):
    result = execute_query(
        "SELECT monthly_budget FROM budgets WHERE user_id = %s",
        (user_id,),
        fetchone=True
    )
    return result[0] if result else 0
def create_file(user_id, name, description=None):
    execute_query(
        "INSERT INTO files (user_id, name, description) VALUES (%s, %s, %s)",
        (user_id, name, description)
    )

def rename_file(file_id, user_id, new_name, new_desc):
    execute_query(
        """
        UPDATE files
        SET name = %s, description = %s, updated_at = CURRENT_TIMESTAMP
        WHERE id = %s AND user_id = %s
        """,
        (new_name, new_desc, file_id, user_id)
    )

def soft_delete_file(file_id, user_id):
    execute_query(
        "UPDATE files SET is_active = 0 WHERE id = %s AND user_id = %s",
        (file_id, user_id)
    )

def get_file_expenses(user_id, file_id):
    return execute_query(
        """
        SELECT id, expense_date, title, description, amount, payment_mode
        FROM expenses
        WHERE user_id = %s AND file_id = %s
        ORDER BY expense_date DESC
        """,
        (user_id, file_id),
        fetchall=True
    )

def delete_expense(expense_id, user_id):
    execute_query(
        "DELETE FROM expenses WHERE id = %s AND user_id = %s",
        (expense_id, user_id)
    )
def get_user_categories(user_id):
    return execute_query(
        "SELECT id, name FROM categories WHERE user_id = %s",
        (user_id,),
        fetchall=True
    )

def create_category(user_id, name):
    execute_query(
        "INSERT INTO categories (user_id, name) VALUES (%s, %s)",
        (user_id, name)
    )
def update_expense(expense_id, user_id, title, description, amount, payment_mode, expense_date, category_id):
    execute_query(
        """
        UPDATE expenses
        SET title = %s,
            description = %s,
            amount = %s,
            payment_mode = %s,
            expense_date = %s,
            category_id = %s,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = %s AND user_id = %s
        """,
        (title, description, amount, payment_mode, expense_date, category_id, expense_id, user_id)
    )
def duplicate_expense(expense_id, user_id):
    execute_query(
        """
        INSERT INTO expenses (user_id, file_id, category_id, title, description, amount, payment_mode, expense_date)
        SELECT user_id, file_id, category_id, title, description, amount, payment_mode, expense_date
        FROM expenses
        WHERE id = %s AND user_id = %s
        """,
        (expense_id, user_id)
    )
def get_period_spending(user_id, file_id, start_date, end_date):
    return execute_query(
        """
        SELECT
            COALESCE(SUM(amount), 0) AS total_spend,
            COUNT(DISTINCT expense_date) AS active_days
        FROM expenses
        WHERE user_id = %s
          AND file_id = %s
          AND expense_date BETWEEN %s AND %s
        """,
        (user_id, file_id, start_date, end_date),
        fetchone=True
    )


def get_highest_expense_day(user_id, file_id, start_date, end_date):
    result = execute_query(
        """
        SELECT expense_date, SUM(amount) AS total
        FROM expenses
        WHERE user_id = %s
          AND file_id = %s
          AND expense_date BETWEEN %s AND %s
        GROUP BY expense_date
        ORDER BY total DESC
        LIMIT 1
        """,
        (user_id, file_id, start_date, end_date),
        fetchone=True
    )
    return result


def get_monthly_total(user_id, file_id, year, month):
    result = execute_query(
        """
        SELECT COALESCE(SUM(amount), 0)
        FROM expenses
        WHERE user_id = %s
          AND file_id = %s
          AND YEAR(expense_date) = %s
          AND MONTH(expense_date) = %s
        """,
        (user_id, file_id, year, month),
        fetchone=True
    )
    return result[0]
def get_spending_over_time(user_id, file_id, start_date, end_date):
    return execute_query(
        """
        SELECT expense_date, SUM(amount) AS total
        FROM expenses
        WHERE user_id = %s
          AND file_id = %s
          AND expense_date BETWEEN %s AND %s
        GROUP BY expense_date
        ORDER BY expense_date
        """,
        (user_id, file_id, start_date, end_date),
        fetchall=True
    )


def get_category_totals(user_id, file_id, start_date, end_date):
    return execute_query(
        """
        SELECT c.name, SUM(e.amount) AS total
        FROM expenses e
        LEFT JOIN categories c ON e.category_id = c.id
        WHERE e.user_id = %s
          AND e.file_id = %s
          AND e.expense_date BETWEEN %s AND %s
        GROUP BY c.name
        ORDER BY total DESC
        """,
        (user_id, file_id, start_date, end_date),
        fetchall=True
    )
def get_user_profile(user_id):
    return execute_query(
        """
        SELECT username, created_at
        FROM users
        WHERE id = %s
        """,
        (user_id,),
        fetchone=True
    )



def upsert_budget(user_id, amount):
    execute_query(
        """
        INSERT INTO budgets (user_id, monthly_budget, updated_at)
        VALUES (%s, %s, CURRENT_TIMESTAMP)
        ON DUPLICATE KEY UPDATE
        monthly_budget = VALUES(monthly_budget),
        updated_at = CURRENT_TIMESTAMP
        """,
        (user_id, amount)
    )


def get_usage_stats(user_id):
    return execute_query(
        """
        SELECT
            (SELECT COUNT(*) FROM files WHERE user_id = %s) AS total_files,
            (SELECT COUNT(*) FROM expenses WHERE user_id = %s) AS total_expenses,
            (SELECT COUNT(DISTINCT DATE(expense_date)) FROM expenses WHERE user_id = %s) AS active_days
        """,
        (user_id, user_id, user_id),
        fetchone=True
    )
def get_user_settings(user_id):
    return execute_query(
        """
        SELECT
            default_payment_mode,
            default_category,
            date_format,
            auto_open_last_file,
            read_only_closed_files,
            confirm_before_delete
        FROM settings
        WHERE user_id = %s
        """,
        (user_id,),
        fetchone=True
    )


def upsert_user_settings(
    user_id,
    default_payment_mode,
    default_category,
    date_format,
    auto_open_last_file,
    read_only_closed_files,
    confirm_before_delete
):
    execute_query(
        """
        INSERT INTO settings
        (
            user_id,
            default_payment_mode,
            default_category,
            date_format,
            auto_open_last_file,
            read_only_closed_files,
            confirm_before_delete,
            updated_at
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,CURRENT_TIMESTAMP)
        ON DUPLICATE KEY UPDATE
            default_payment_mode = VALUES(default_payment_mode),
            default_category = VALUES(default_category),
            date_format = VALUES(date_format),
            auto_open_last_file = VALUES(auto_open_last_file),
            read_only_closed_files = VALUES(read_only_closed_files),
            confirm_before_delete = VALUES(confirm_before_delete),
            updated_at = CURRENT_TIMESTAMP
        """,
        (
            user_id,
            default_payment_mode,
            default_category,
            date_format,
            auto_open_last_file,
            read_only_closed_files,
            confirm_before_delete
        )
    )
