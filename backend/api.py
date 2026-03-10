from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import date
from auth.login import authenticate_user
from auth.register import register_user
from database.queries import (
    get_user_files, get_monthly_summary, get_top_category,
    get_recent_expenses, get_recent_files, get_user_budget,
    get_file_total, create_file, rename_file, soft_delete_file,
    get_file_expenses, delete_expense, add_expense, get_user_categories,
    create_category, update_expense, get_user_profile, get_usage_stats, get_user_settings
)

app = FastAPI(title="Expense Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str

class ExpenseRequest(BaseModel):
    user_id: int
    file_id: int
    category_id: int
    title: str
    description: Optional[str] = None
    amount: float
    payment_mode: str
    expense_date: date

class FileRequest(BaseModel):
    user_id: int
    name: str
    description: Optional[str] = None

class CategoryRequest(BaseModel):
    user_id: int
    name: str

@app.post("/api/auth/register")
def register(req: RegisterRequest):
    success, msg = register_user(req.username, req.password)
    if not success:
        raise HTTPException(status_code=400, detail=msg)
    return {"message": msg}

@app.post("/api/auth/login")
def login(req: LoginRequest):
    success, user_id = authenticate_user(req.username, req.password)
    if not success:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"user_id": user_id, "username": req.username, "token": "dummy-jwt-token"}

@app.get("/api/dashboard")
def get_dashboard(user_id: int, file_id: int, year: int, month: int):
    total_spend, expense_count = get_monthly_summary(user_id, file_id, year, month)
    top_category = get_top_category(user_id, file_id, year, month)
    budget = get_user_budget(user_id)
    file_total = get_file_total(user_id, file_id)
    remaining_budget = budget - file_total
    recent_expenses = get_recent_expenses(user_id)
    recent_files = get_recent_files(user_id)
    
    return {
        "monthly_summary": {
            "total_spend": total_spend,
            "expense_count": expense_count,
            "top_category": top_category,
        },
        "budget": {
            "total": budget,
            "used": file_total,
            "remaining": remaining_budget
        },
        "recent_expenses": [{"date": row[0], "category": row[1], "amount": float(row[2])} for row in recent_expenses],
        "recent_files": [{"name": row[0], "last_modified": row[1]} for row in recent_files]
    }

@app.get("/api/files")
def get_files(user_id: int):
    files = get_user_files(user_id)
    return [{"id": f[0], "name": f[1], "description": f[2], "is_favorite": f[3], "created_at": f[4], "updated_at": f[5]} for f in files]

@app.post("/api/files")
def add_file(req: FileRequest):
    create_file(req.user_id, req.name, req.description)
    return {"message": "File created"}

@app.get("/api/expenses")
def get_expenses(user_id: int, file_id: int):
    expenses = get_file_expenses(user_id, file_id)
    return [{"id": e[0], "date": e[1], "title": e[2], "description": e[3], "amount": float(e[4]), "payment_mode": e[5]} for e in expenses]

@app.post("/api/expenses")
def create_expense(req: ExpenseRequest):
    add_expense(req.user_id, req.file_id, req.category_id, req.title, req.description, req.amount, req.payment_mode, req.expense_date)
    return {"message": "Expense added successfully"}

@app.delete("/api/expenses/{expense_id}")
def delete_expense_api(expense_id: int, user_id: int):
    delete_expense(expense_id, user_id)
    return {"message": "Expense deleted"}

@app.get("/api/categories")
def get_categories(user_id: int):
    categories = get_user_categories(user_id)
    return [{"id": c[0], "name": c[1]} for c in categories]

@app.post("/api/categories")
def add_category(req: CategoryRequest):
    create_category(req.user_id, req.name)
    return {"message": "Category added"}

@app.get("/api/profile")
def profile(user_id: int):
    prof = get_user_profile(user_id)
    stats = get_usage_stats(user_id)
    return {
        "username": prof[0],
        "created_at": prof[1],
        "stats": {
            "total_files": stats[0],
            "total_expenses": stats[1],
            "active_days": stats[2]
        }
    }

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.api:app", host="0.0.0.0", port=port, reload=True)
