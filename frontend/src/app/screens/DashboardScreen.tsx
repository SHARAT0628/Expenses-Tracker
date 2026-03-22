import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { TransactionItem } from '../components/TransactionItem';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../../lib/api';

export default function DashboardScreen() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          navigate('/');
          return;
        }

        const files = await api.getFiles(userId);
        if (files.length === 0) {
          setLoading(false);
          return;
        }
        const fileId = files[0].id;
        localStorage.setItem('file_id', fileId);

        const now = new Date();
        const dashboard = await api.getDashboard(userId, fileId, now.getFullYear(), now.getMonth() + 1);
        setData(dashboard);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const summaryData = data ? [
    { label: 'Total Spend', value: `₹${data.monthly_summary.total_spend}`, icon: TrendingDown, color: 'text-[#F44336]', bgColor: 'bg-red-50' },
    { label: 'Budget', value: `₹${data.budget.total}`, icon: TrendingUp, color: 'text-[#4CAF50]', bgColor: 'bg-green-50' },
    { label: 'Remaining', value: `₹${data.budget.remaining}`, icon: DollarSign, color: 'text-[#009688]', bgColor: 'bg-teal-50', highlight: true },
    { label: 'Top Category', value: data.monthly_summary.top_category, icon: DollarSign, color: 'text-gray-700', bgColor: 'bg-gray-50' },
  ] : [];

  const transactions = data ? data.recent_expenses.map((e: any) => ({
    category: e.category || 'Uncategorized',
    date: e.date,
    amount: -e.amount,
    type: 'expense' as const
  })) : [];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Top App Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <h1 className="text-lg font-semibold text-gray-900 absolute left-1/2 -translate-x-1/2">Expense Tracker</h1>
          <div className="w-5" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {summaryData.map((item: any, index: number) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`bg-white rounded-xl p-4 shadow-sm border ${
                  item.highlight ? 'border-[#009688]' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full ${item.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                </div>
                <p className="text-gray-600 text-xs mb-1">{item.label}</p>
                <p className={`text-xl font-bold ${item.highlight ? 'text-[#009688]' : 'text-gray-900'}`}>
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 mt-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Transactions</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 divide-y divide-gray-100">
          {transactions.map((transaction: any, index: number) => (
            <TransactionItem
              key={index}
              category={transaction.category}
              date={transaction.date}
              amount={transaction.amount}
              type={transaction.type}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
