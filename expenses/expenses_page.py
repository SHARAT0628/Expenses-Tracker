import streamlit as st

from database.queries import (
    get_user_files,
    create_file,
    get_file_expenses,
    add_expense,
    delete_expense,
    update_expense,
    duplicate_expense
)

from database.queries import get_file_total
from expenses.entries import fetch_categories, add_category


def expenses_page():
    st.title("📁 Expenses")

    user_id = st.session_state.user_id
    files = get_user_files(user_id)

    # ---------- FILE MANAGEMENT ----------
    st.subheader("Expense Files")

    with st.expander("➕ Create New File"):
        name = st.text_input("File Name")
        desc = st.text_input("Description")
        if st.button("Create File"):
            if name.strip():
                create_file(user_id, name, desc)
                st.success("File created")
                st.rerun()
            else:
                st.error("File name required")

    if not files:
        st.info("No expense files yet.")
        return

    file_map = {f"{f[1]}": f[0] for f in files}
    selected_file = st.selectbox("Select File", list(file_map.keys()))
    file_id = file_map[selected_file]

    # ✅ GLOBAL ACTIVE FILE (CRITICAL)
    st.session_state.active_file_id = file_id
    st.session_state.active_file_name = selected_file

    total = get_file_total(user_id, file_id)
    st.markdown(f"### 💰 Total Amount (File): ₹ {total}")

    st.markdown("---")

    # ---------- CATEGORIES ----------
    categories = fetch_categories(user_id)
    cat_map = {c[1]: c[0] for c in categories}

    with st.expander("➕ Manage Categories"):
        new_cat = st.text_input("New Category")
        if st.button("Add Category"):
            if new_cat.strip():
                add_category(user_id, new_cat)
                st.success("Category added")
                st.rerun()

    # ---------- ADD EXPENSE ----------
    st.subheader("➕ Add Expense")

    with st.form("add_expense_form"):
        col1, col2 = st.columns(2)

        with col1:
            title = st.text_input("Title")
            amount = st.number_input("Amount", min_value=0.0, step=1.0)

        with col2:
            category = st.selectbox(
                "Category",
                list(cat_map.keys()) if cat_map else ["Uncategorized"]
            )
            payment_mode = st.selectbox(
                "Payment Mode",
                ["Cash", "UPI", "Card", "Bank Transfer"]
            )

        expense_date = st.date_input("Date")
        description = st.text_area("Description")

        submitted = st.form_submit_button("Add Expense")

        if submitted:
            if not title or amount <= 0:
                st.error("Title and valid amount required")
            else:
                add_expense(
                    user_id=user_id,
                    file_id=file_id,
                    category_id=cat_map.get(category),
                    title=title,
                    description=description,
                    amount=amount,
                    payment_mode=payment_mode,
                    expense_date=expense_date
                )
                st.success("Expense added")
                st.rerun()

    st.markdown("---")

    # ---------- EXPENSES TABLE ----------
    st.subheader("Expenses in File")

    expenses = get_file_expenses(user_id, file_id)
    if not expenses:
        st.info("No expenses in this file yet.")
        return

    exp_map = {f"{e[2]} | ₹{e[4]} | {e[1]}": e for e in expenses}
    selected_exp = st.selectbox("Select Expense", list(exp_map.keys()))
    e = exp_map[selected_exp]

    # ---------- EDIT / DUPLICATE ----------
    with st.expander("✏️ Edit / Duplicate Expense"):
        title = st.text_input("Title", value=e[2])
        description = st.text_area("Description", value=e[3])
        amount = st.number_input("Amount", value=float(e[4]), step=1.0)
        payment_mode = st.selectbox(
            "Payment Mode",
            ["Cash", "UPI", "Card", "Bank Transfer"],
            index=["Cash", "UPI", "Card", "Bank Transfer"].index(e[5])
        )
        expense_date = st.date_input("Date", value=e[1])

        col1, col2 = st.columns(2)

        with col1:
            if st.button("Update Expense"):
                update_expense(
                    expense_id=e[0],
                    user_id=user_id,
                    title=title,
                    description=description,
                    amount=amount,
                    payment_mode=payment_mode,
                    expense_date=expense_date,
                    category_id=None
                )
                st.success("Expense updated")
                st.rerun()

        with col2:
            if st.button("Duplicate Expense"):
                duplicate_expense(e[0], user_id)
                st.success("Expense duplicated")
                st.rerun()

    # ---------- BULK DELETE ----------
    st.subheader("🗑 Bulk Delete")

    bulk_map = {f"{e[2]} | ₹{e[4]}": e[0] for e in expenses}
    to_delete = st.multiselect("Select expenses to delete", list(bulk_map.keys()))

    if st.button("Delete Selected"):
        for label in to_delete:
            delete_expense(bulk_map[label], user_id)
        st.warning("Selected expenses deleted")
        st.rerun()
