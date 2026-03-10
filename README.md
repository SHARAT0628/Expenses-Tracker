# Expense Tracker Web Application

## Overview
This project is a full-stack, session-based expense tracking web application that allows users to manage personal finances across multiple expense files (ledgers). Each user can create, manage, and analyze expenses in isolated files, ensuring complete data ownership and clarity.

The application emphasizes correctness, usability, and analytical clarity rather than unnecessary complexity.

---

## Key Features

### Authentication & User Isolation
- Secure user registration and login
- Session-based access control
- Complete isolation of user data

### Expense Management
- Multiple expense files (ledgers) per user
- Add, edit, duplicate, and delete expenses
- File-level total calculation as the single source of truth

### Dashboard (Home)
- Snapshot view of financial status
- Total spend, number of expenses, remaining budget
- Active file context reflected globally

### Visual Analysis
- Spending over time (line chart)
- Payment mode analysis (bar chart)
- Date-range filtering
- Clean matplotlib-based visualizations
- Category-based graphs intentionally excluded to avoid misleading insights

### Profile & Budget Ownership
- User profile with account details
- Monthly budget management
- Budget usage tracking
- Usage statistics (files created, expenses logged, active days)

### Settings
- Application behavior controls
- Default payment mode and category
- Auto-open last file on login
- Confirm-before-delete toggle
- No financial logic in settings (by design)

### Reports
- CSV export of expenses
- File-scoped and date-range based reporting
- Excel/Google Sheets compatible

---

## Tech Stack

- **Frontend**: Streamlit
- **Backend**: Python
- **Database**: MySQL
- **Visualization**: Matplotlib
- **Data Handling**: Pandas

---

## Architecture Highlights

- Database-first schema design
- Clear separation of concerns:
  - Database logic
  - Business logic
  - UI components
- Session state as a single source of truth
- File-scoped analytics and reporting

---

## How to Run Locally

1. Clone the repository
2. Create and activate a virtual environment
3. Install dependencies:
4. Configure MySQL database and tables
5. Run the application:
