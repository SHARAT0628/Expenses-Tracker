import streamlit as st
from database.queries import get_user_settings, upsert_user_settings
from expenses.entries import fetch_categories


def settings_page():
    st.title("⚙️ Settings")

    user_id = st.session_state.user_id

    settings = get_user_settings(user_id)
    if settings:
        (
            default_payment,
            default_category,
            date_format,
            auto_open,
            read_only,
            confirm_delete
        ) = settings
    else:
        default_payment = "Cash"
        default_category = None
        date_format = "YYYY-MM-DD"
        auto_open = True
        read_only = False
        confirm_delete = True

    # ===============================
    # EXPENSE DEFAULTS
    # ===============================
    st.subheader("Expense Defaults")

    categories = fetch_categories(user_id)
    cat_names = [c[1] for c in categories]

    col1, col2, col3 = st.columns(3)

    with col1:
        default_payment = st.selectbox(
            "Default Payment Mode",
            ["Cash", "UPI", "Card", "Bank Transfer"],
            index=["Cash", "UPI", "Card", "Bank Transfer"].index(default_payment)
        )

    with col2:
        default_category = st.selectbox(
            "Default Category",
            cat_names if cat_names else ["None"],
            index=cat_names.index(default_category) if default_category in cat_names else 0
        )

    with col3:
        date_format = st.selectbox(
            "Date Format",
            ["YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY"]
        )

    st.markdown("---")

    # ===============================
    # APPLICATION BEHAVIOR
    # ===============================
    st.subheader("Application Behavior")

    auto_open = st.checkbox("Auto-open last file on login", value=auto_open)
    read_only = st.checkbox("Enable read-only mode for closed files", value=read_only)
    confirm_delete = st.checkbox("Confirm before delete", value=confirm_delete)

    st.markdown("---")

    if st.button("Save Settings"):
        upsert_user_settings(
            user_id=user_id,
            default_payment_mode=default_payment,
            default_category=default_category,
            date_format=date_format,
            auto_open_last_file=auto_open,
            read_only_closed_files=read_only,
            confirm_before_delete=confirm_delete
        )
        st.success("Settings updated successfully")
