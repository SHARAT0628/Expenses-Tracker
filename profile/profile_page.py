import streamlit as st
import datetime

from database.queries import (
    get_user_profile,
    get_user_budget,
    upsert_budget,
    get_usage_stats
)
from auth.login import authenticate_user
import profile


def profile_page():
    st.title("👤 Profile")

    user_id = st.session_state.user_id
    username = st.session_state.username

    # ===============================
    # ACCOUNT INFORMATION
    # ===============================
    st.subheader("Account Information")

    profile = get_user_profile(user_id)
    if profile:
        uname, created_at = profile
    else:
        uname, created_at = username, "-"

    col1, col2, col3 = st.columns(3)
    col1.metric("Username", uname)
    col2.metric("Account Created", str(created_at).split(" ")[0])
    st.markdown("---")

    # ===============================
    # BUDGET DETAILS (OWNED HERE)
    # ===============================
    st.subheader("💰 Monthly Budget")

    current_budget = get_user_budget(user_id)

    total_spent_this_month = 0
    today = datetime.date.today()

    from database.queries import get_file_total
    if st.session_state.get("active_file_id"):
        total_spent_this_month = get_file_total(
            user_id, st.session_state.active_file_id
        )

    remaining = current_budget - total_spent_this_month

    c1, c2, c3 = st.columns(3)
    c1.metric("Budget", f"₹ {current_budget}")
    c2.metric("Used", f"₹ {total_spent_this_month}")
    c3.metric("Remaining", f"₹ {remaining}")

    with st.expander("✏️ Update Monthly Budget"):
        new_budget = st.number_input(
            "Monthly Budget Amount",
            min_value=0,
            step=500,
            value=int(current_budget)
        )
        if st.button("Update Budget"):
            upsert_budget(user_id, new_budget)
            st.success("Budget updated")
            st.rerun()

    st.markdown("---")

    # ===============================
    # USAGE STATISTICS
    # ===============================
    st.subheader("📊 Usage Statistics")

    stats = get_usage_stats(user_id)
    if stats:
        total_files, total_expenses, active_days = stats
    else:
        total_files, total_expenses, active_days = 0, 0, 0

    s1, s2, s3 = st.columns(3)
    s1.metric("Total Files", total_files)
    s2.metric("Total Expenses", total_expenses)
    s3.metric("Active Days", active_days)

    st.markdown("---")

    # ===============================
    # SECURITY
    # ===============================
    st.subheader("🔐 Security")

    with st.expander("Change Password"):
        old_pwd = st.text_input("Current Password", type="password")
        new_pwd = st.text_input("New Password", type="password")
        confirm_pwd = st.text_input("Confirm New Password", type="password")

        if st.button("Change Password"):
            if new_pwd != confirm_pwd:
                st.error("Passwords do not match")
            else:
                ok, _ = authenticate_user(username, old_pwd)
                if not ok:
                    st.error("Current password incorrect")
                else:
                    from database.queries import execute_query
                    execute_query(
                        "UPDATE users SET password = %s WHERE id = %s",
                        (new_pwd, user_id)
                    )
                    st.success("Password changed successfully")

    if st.button("Logout"):
        for k in list(st.session_state.keys()):
            del st.session_state[k]
        st.rerun()
