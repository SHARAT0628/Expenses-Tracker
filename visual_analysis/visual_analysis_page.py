import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

from database.queries import execute_query
from visual_analysis.reports import get_expense_report


def visual_analysis_page():
    st.title("📈 Visual Analysis")

    # ---------- ACTIVE FILE CHECK ----------
    if not st.session_state.get("active_file_id"):
        st.info("Select a file from Expenses to view analysis.")
        return

    user_id = st.session_state.user_id
    file_id = st.session_state.active_file_id

    # ---------- DATE FILTER ----------
    col1, col2 = st.columns(2)
    with col1:
        start_date = st.date_input("Start Date")
    with col2:
        end_date = st.date_input("End Date")

    st.markdown("---")

    # =========================================================
    # 1️⃣ SPENDING OVER TIME (LINE CHART)
    # =========================================================
    time_data = execute_query(
        """
        SELECT expense_date, SUM(amount)
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

    if time_data:
        df_time = pd.DataFrame(time_data, columns=["Date", "Amount"])

        fig, ax = plt.subplots()
        ax.plot(df_time["Date"], df_time["Amount"], marker="o")
        ax.set_title("Spending Over Time")
        ax.set_xlabel("Date")
        ax.set_ylabel("Amount")
        ax.grid(True)

        st.pyplot(fig)
    else:
        st.info("No spending data for the selected period.")

    st.markdown("---")

    # =========================================================
    # 2️⃣ PAYMENT MODE ANALYSIS (BAR CHART)
    # =========================================================
    payment_data = execute_query(
        """
        SELECT payment_mode, SUM(amount)
        FROM expenses
        WHERE user_id = %s AND file_id = %s
        GROUP BY payment_mode
        ORDER BY SUM(amount) DESC
        """,
        (user_id, file_id),
        fetchall=True
    )

    if payment_data:
        df_pay = pd.DataFrame(payment_data, columns=["Payment Mode", "Amount"])

        fig2, ax2 = plt.subplots()
        ax2.bar(df_pay["Payment Mode"], df_pay["Amount"])
        ax2.set_title("Spending by Payment Mode")
        ax2.set_xlabel("Payment Mode")
        ax2.set_ylabel("Amount")

        st.pyplot(fig2)
    else:
        st.info("No payment mode data available.")
    # =========================================================
    # 📄 EXPORT REPORT (CSV)
    # =========================================================
    st.markdown("---")
    st.subheader("📄 Export Report")

    df_report = get_expense_report(
        user_id=user_id,
        file_id=file_id,
        start_date=start_date,
        end_date=end_date
    )

    if not df_report.empty:
        csv = df_report.to_csv(index=False).encode("utf-8")
        st.download_button(
            label="⬇️ Download CSV Report",
            data=csv,
            file_name=f"expense_report_{start_date}_to_{end_date}.csv",
            mime="text/csv"
        )
    else:
        st.info("No data available to export for the selected range.")