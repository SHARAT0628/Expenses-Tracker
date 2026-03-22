import { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BottomNavigation } from '../components/BottomNavigation';
import { Button } from '../components/ui/button';
import { api } from '../../lib/api';

export default function BudgetScreen() {
  const navigate = useNavigate();
  const [totalSpend, setTotalSpend] = useState(0);
  const [categorySpend, setCategorySpend] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const monthlyBudget = parseFloat(localStorage.getItem('monthly_budget') || '0');
  const remaining = Math.max(monthlyBudget - totalSpend, 0);
  const now = new Date();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const fileId = localStorage.getItem('file_id');
        if (!userId || !fileId || fileId === '0') { setLoading(false); return; }

        const expenses = await api.getExpenses(userId, fileId);
        // Only current month
        const monthlyExpenses = expenses.filter((e: any) => {
          const d = new Date(e.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });

        const total = monthlyExpenses.reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0);
        setTotalSpend(total);

        const byCategory: Record<string, number> = {};
        monthlyExpenses.forEach((e: any) => {
          const key = e.title || 'Other';
          byCategory[key] = (byCategory[key] || 0) + parseFloat(e.amount);
        });
        setCategorySpend(byCategory);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#FF9800', '#F44336', '#2196F3', '#4CAF50', '#9C27B0', '#009688'];

  const getProgress = (spend: number, budget: number) =>
    budget > 0 ? Math.min((spend / budget) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">
            {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => navigate('/budget-settings')}>
            <Edit className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Monthly Budget Card */}
        <div className="bg-gradient-to-br from-[#009688] to-[#00796B] rounded-xl shadow-md p-6 text-white">
          <h2 className="text-sm font-medium opacity-90 mb-2">Monthly Budget</h2>
          {monthlyBudget === 0 ? (
            <div className="text-center py-2">
              <p className="opacity-80 mb-3">No budget set yet</p>
              <button
                onClick={() => navigate('/budget-settings')}
                className="bg-white/20 rounded-lg px-4 py-2 text-sm font-medium"
              >
                Set Budget
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs opacity-75">Remaining</span>
                  <span className="text-2xl font-bold">₹{remaining.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-xs opacity-75">
                  <span>Budget: ₹{monthlyBudget.toLocaleString()}</span>
                  <span>Spent: ₹{totalSpend.toFixed(0)}</span>
                </div>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${getProgress(totalSpend, monthlyBudget)}%` }}
                />
              </div>
            </>
          )}
        </div>

        {/* Category Breakdown */}
        {!loading && Object.keys(categorySpend).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900">This Month's Spending</h3>
            {Object.entries(categorySpend).map(([category, spend], i) => (
              <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{category}</h4>
                  <span className="text-sm font-semibold" style={{ color: COLORS[i % COLORS.length] }}>
                    ₹{spend.toFixed(0)}
                  </span>
                </div>
                {monthlyBudget > 0 && (
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${getProgress(spend, monthlyBudget)}%`, backgroundColor: COLORS[i % COLORS.length] }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && Object.keys(categorySpend).length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-3">💰</p>
            <p className="font-medium text-gray-600">No expenses this month</p>
            <p className="text-sm">Add transactions to see your budget breakdown</p>
          </div>
        )}

        <Button
          onClick={() => navigate('/budget-settings')}
          className="w-full h-14 bg-white hover:bg-gray-50 text-[#009688] border-2 border-[#009688] rounded-xl font-semibold"
        >
          ✏️ Edit Budget
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
}
