const API_URL = 'http://localhost:8000/api';

export const api = {
  getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async login(username: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async register(username: string, password: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getDashboard(userId: string | number, fileId: string | number, year: number, month: number) {
    const res = await fetch(`${API_URL}/dashboard?user_id=${userId}&file_id=${fileId}&year=${year}&month=${month}`);
    if (!res.ok) throw new Error('Failed to fetch dashboard');
    return res.json();
  },

  async getFiles(userId: string | number) {
    const res = await fetch(`${API_URL}/files?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch files');
    return res.json();
  },

  async getExpenses(userId: string | number, fileId: string | number) {
    const res = await fetch(`${API_URL}/expenses?user_id=${userId}&file_id=${fileId}`);
    if (!res.ok) throw new Error('Failed to fetch expenses');
    return res.json();
  },

  async addExpense(data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add expense');
    return res.json();
  },

  async updateExpense(expenseId: number, data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/expenses/${expenseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update expense');
    return res.json();
  },

  async deleteExpense(expenseId: number, userId: string | number) {
    const res = await fetch(`${API_URL}/expenses/${expenseId}?user_id=${userId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete expense');
    return res.json();
  },

  async getProfile(userId: string | number) {
    const res = await fetch(`${API_URL}/profile?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async createFile(userId: string | number, name: string) {
    const res = await fetch(`${API_URL}/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, name })
    });
    if (!res.ok) throw new Error('Failed to create file');
    return res.json();
  },

  async getCategories(userId: string | number) {
    const res = await fetch(`${API_URL}/categories?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async createCategory(userId: string | number, name: string) {
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, name })
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  }
};
