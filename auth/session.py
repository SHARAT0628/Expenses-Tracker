import streamlit as st

def init_session():
    if "logged_in" not in st.session_state:
        st.session_state.logged_in = False

    if "user_id" not in st.session_state:
        st.session_state.user_id = None

    if "username" not in st.session_state:
        st.session_state.username = None

    # ✅ REQUIRED FOR FILE CONTEXT
    if "active_file_id" not in st.session_state:
        st.session_state.active_file_id = None

    if "active_file_name" not in st.session_state:
        st.session_state.active_file_name = None
