import pandas as pd
from database.queries import execute_query


def get_expense_report(user_id, file_id, start_date, end_date):
    data = execute_query(
        """
        SELECT
            expense_date AS Date,
            title AS Title,
            description AS Description,
            COALESCE(c.name, 'Uncategorized') AS Category,
            amount AS Amount,
            payment_mode AS Payment_Mode
        FROM expenses e
        LEFT JOIN categories c ON e.category_id = c.id
        WHERE e.user_id = %s
          AND e.file_id = %s
          AND e.expense_date BETWEEN %s AND %s
        ORDER BY e.expense_date
        """,
        (user_id, file_id, start_date, end_date),
        fetchall=True
    )

    columns = ["Date", "Title", "Description", "Category", "Amount", "Payment_Mode"]
    return pd.DataFrame(data, columns=columns)
