import streamlit as st
from auth.session import init_session
from auth.login import authenticate_user
from auth.register import register_user
from database.queries import (
    get_user_files,
    get_monthly_summary,
    get_top_category,
    get_recent_expenses,
    get_recent_files,
    get_user_budget,
    get_file_total,
    create_file,
    rename_file,
    soft_delete_file,
    get_file_expenses,
    delete_expense,
    add_expense
)
from expenses.expenses_page import expenses_page
from visual_analysis.visual_analysis_page import visual_analysis_page
from overview.overview_page import overview_page
from profile.profile_page import profile_page
from settings.settings_page import settings_page
from expenses.entries import fetch_categories, add_category
import datetime

# -------------------- PAGE CONFIG --------------------
st.set_page_config(
    page_title="Expense Tracker",
    layout="wide"
)

# -------------------- GLOBAL STYLES --------------------
st.markdown("""
<style>
.sidebar-section {
    font-size: 13px;
    letter-spacing: 1px;
    color: #9ca3af;
    margin-top: 20px;
    margin-bottom: 8px;
}
.metric-card {
    background: linear-gradient(135deg, #6a11cb, #2575fc);
    padding: 20px;
    border-radius: 16px;
    color: white;
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}
.metric-title {
    font-size: 14px;
    opacity: 0.85;
}
.metric-value {
    font-size: 28px;
    font-weight: 700;
}
.section-box {
    background-color: #111827;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}
</style>
""", unsafe_allow_html=True)

# -------------------- AUTH (COMPACT) --------------------
def login_page():
    st.subheader("Login")
    username = st.text_input("Username", key="login_user")
    password = st.text_input("Password", type="password", key="login_pass")

    if st.button("Login"):
        success, user_id = authenticate_user(username, password)
        if success:
            st.session_state.logged_in = True
            st.session_state.user_id = user_id
            st.session_state.username = username
            st.rerun()
        else:
            st.error("Invalid credentials")

def register_page():
    st.subheader("Register")
    username = st.text_input("Username", key="reg_user")
    password = st.text_input("Password", type="password", key="reg_pass")

    if st.button("Register"):
        success, msg = register_user(username, password)
        if success:
            st.success(msg)
        else:
            st.error(msg)

def unauthenticated_view():
    col = st.columns([2, 3, 2])[1]
    with col:
        tab1, tab2 = st.tabs(["Login", "Register"])
        with tab1:
            login_page()
        with tab2:
            register_page()

# -------------------- HOME PAGE --------------------
def home_page():
    user_id = st.session_state.user_id
    files = get_user_files(user_id)

    if not files:
        st.title("📊 Expense Tracker")
        st.info("No expense file available. Create one from the Expenses section.")
        return

    # ✅ FIX: prefer active file from session
    if st.session_state.active_file_id:
        active_file_id = st.session_state.active_file_id
        active_file_name = st.session_state.active_file_name
    else:
        active_file_id = files[0][0]
        active_file_name = files[0][1]
        st.session_state.active_file_id = active_file_id
        st.session_state.active_file_name = active_file_name

    today = datetime.date.today()
    year, month = today.year, today.month

    total_spend, expense_count = get_monthly_summary(
        user_id, active_file_id, year, month
    )

    top_category = get_top_category(
        user_id, active_file_id, year, month
    )

    budget = get_user_budget(user_id)
    file_total = get_file_total(user_id, active_file_id)
    remaining_budget = budget - file_total

    recent_expenses = get_recent_expenses(user_id)
    recent_files = get_recent_files(user_id)

    # ---- UI ----
    st.title("📊 Expense Tracker")

    col1, col2 = st.columns([2, 1])
    with col1:
        st.markdown(f"**Active File:** _{active_file_name}_")

    with col2:
        st.selectbox(
            "Month",
            ["January", "February", "March", "April", "May", "June",
             "July", "August", "September", "October", "November", "December"]
        )

    st.markdown("###")

    m1, m2, m3, m4 = st.columns(4)

    with m1:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-title">Total Spend</div>
            <div class="metric-value">₹ {total_spend}</div>
        </div>
        """, unsafe_allow_html=True)

    with m2:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-title">Number of Expenses</div>
            <div class="metric-value">{expense_count}</div>
        </div>
        """, unsafe_allow_html=True)

    with m3:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-title">Top Category</div>
            <div class="metric-value">{top_category}</div>
        </div>
        """, unsafe_allow_html=True)

    with m4:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-title">Remaining Budget</div>
            <div class="metric-value">₹ {remaining_budget}</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("###")

    left, right = st.columns(2)

    with left:
        st.markdown("<div class='section-box'><h4>Recent Expenses</h4>", unsafe_allow_html=True)
        st.table({
            "Date": [row[0] for row in recent_expenses],
            "Category": [row[1] for row in recent_expenses],
            "Amount": [row[2] for row in recent_expenses],
        })
        st.markdown("</div>", unsafe_allow_html=True)

    with right:
        st.markdown("<div class='section-box'><h4>Recent Files</h4>", unsafe_allow_html=True)
        st.table({
            "File Name": [row[0] for row in recent_files],
            "Last Modified": [row[1] for row in recent_files],
        })
        st.markdown("</div>", unsafe_allow_html=True)

# -------------------- AUTHENTICATED VIEW --------------------
def authenticated_view():
    with st.sidebar:
        st.markdown("## 💰 Expense Tracker")
        st.caption(f"Logged in as **{st.session_state.username}**")

        st.markdown("<div class='sidebar-section'>NAVIGATION</div>", unsafe_allow_html=True)

        page = st.radio(
            "",
            [
                "🏠 Home",
                "📁 Expenses",
                "📊 Overview",
                "📈 Visual Analysis",
                "👤 Profile",
                "⚙️ Settings"
            ],
            label_visibility="collapsed"
        )

        st.markdown("---")

        if st.button("Logout", key="logout_btn"):
            for k in list(st.session_state.keys()):
                del st.session_state[k]
            st.rerun()

    selected = (
        page.replace("🏠 ", "")
            .replace("📁 ", "")
            .replace("📊 ", "")
            .replace("📈 ", "")
            .replace("👤 ", "")
            .replace("⚙️ ", "")
    )

    if selected == "Home":
        home_page()
    elif selected == "Expenses":
        expenses_page()
    elif selected == "Overview":
        overview_page()
    elif selected == "Visual Analysis":
        visual_analysis_page()
    elif selected == "Profile":
        profile_page()
    elif selected == "Settings":
        settings_page()
    else:
        st.title(selected)
        st.info("This section will be implemented next.")

# -------------------- MAIN --------------------
def main():
    init_session()
    if not st.session_state.logged_in:
        unauthenticated_view()
    else:
        authenticated_view()

if __name__ == "__main__":
    main()
