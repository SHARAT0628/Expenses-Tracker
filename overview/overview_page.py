import streamlit as st
import datetime

from database.queries import (
    get_user_files,
    get_period_spending,
    get_highest_expense_day,
    get_monthly_total,
    get_user_budget
)


def overview_page():
    st.title("📊 Overview")

    user_id = st.session_state.user_id
    files = get_user_files(user_id)

    if not files:
        st.info("No expense files available.")
        return

    file_map = {f[1]: f[0] for f in files}
    selected_file = st.selectbox("Select File", list(file_map.keys()))
    file_id = file_map[selected_file]

    # ---------- DATE RANGE ----------
    col1, col2 = st.columns(2)
    with col1:
        start_date = st.date_input("Start Date", datetime.date.today().replace(day=1))
    with col2:
        end_date = st.date_input("End Date", datetime.date.today())

    # ---------- SPENDING SUMMARY ----------
    total_spend, active_days = get_period_spending(
        user_id, file_id, start_date, end_date
    )

    avg_daily_spend = round(total_spend / active_days, 2) if active_days else 0

    highest_day = get_highest_expense_day(
        user_id, file_id, start_date, end_date
    )

    st.markdown("### 📌 Spending Summary")
    colA, colB, colC = st.columns(3)

    colA.metric("Total Spend", f"₹ {total_spend}")
    colB.metric("Average Daily Spend", f"₹ {avg_daily_spend}")
    colC.metric(
        "Highest Expense Day",
        f"{highest_day[0]} (₹ {highest_day[1]})" if highest_day else "—"
    )

    st.markdown("---")

    # ---------- BUDGET MONITORING ----------
    budget = get_user_budget(user_id)
    usage_pct = round((total_spend / budget) * 100, 2) if budget else 0
    status = "Exceeded" if total_spend > budget else "Within Budget"

    st.markdown("### 💰 Budget Monitoring")

    col1, col2, col3 = st.columns(3)
    col1.metric("Monthly Budget", f"₹ {budget}")
    col2.metric("Budget Used (%)", f"{usage_pct}%")
    col3.metric("Status", status)

    st.markdown("---")

    # ---------- MONTH-OVER-MONTH ----------
    today = datetime.date.today()
    current_month_total = get_monthly_total(
        user_id, file_id, today.year, today.month
    )

    prev_month = today.replace(day=1) - datetime.timedelta(days=1)
    prev_month_total = get_monthly_total(
        user_id, file_id, prev_month.year, prev_month.month
    )

    if prev_month_total > 0:
        mom_change = round(
            ((current_month_total - prev_month_total) / prev_month_total) * 100, 2
        )
    else:
        mom_change = 0

    st.markdown("### 📈 Month-over-Month Comparison")
    st.metric(
        "Change",
        f"{mom_change}%",
        delta=f"{mom_change}%",
    )
