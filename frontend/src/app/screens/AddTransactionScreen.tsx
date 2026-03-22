import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ShoppingBag, Utensils, Smartphone, Film, Home, Car, GraduationCap, Heart, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { api } from '../../lib/api';

const CATEGORY_ICONS: Record<string, any> = {
  Shopping: ShoppingBag, Food: Utensils, Phone: Smartphone,
  Entertainment: Film, Home, Transport: Car, Education: GraduationCap, Health: Heart,
};
const DEFAULT_CATEGORIES = ['Shopping', 'Food', 'Phone', 'Entertainment', 'Home', 'Transport', 'Education', 'Health'];

export default function AddTransactionScreen() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setup = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) { navigate('/'); return; }

        // Ensure a file exists
        let fileId = localStorage.getItem('file_id');
        if (!fileId || fileId === '0') {
          const files = await api.getFiles(userId);
          if (files.length === 0) {
            await api.createFile(userId, 'My Expenses');
            const newFiles = await api.getFiles(userId);
            fileId = String(newFiles[0].id);
          } else {
            fileId = String(files[0].id);
          }
          localStorage.setItem('file_id', fileId);
        }

        // Ensure categories exist
        let cats = await api.getCategories(userId);
        if (cats.length === 0) {
          for (const name of DEFAULT_CATEGORIES) {
            await api.createCategory(userId, name);
          }
          cats = await api.getCategories(userId);
        }
        setCategories(cats);
        setSelectedCategory(String(cats[0]?.id));
      } catch (err) {
        console.error(err);
        alert('Setup failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    setup();
  }, [navigate]);

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    try {
      const userId = parseInt(localStorage.getItem('user_id') || '0', 10);
      const fileId = parseInt(localStorage.getItem('file_id') || '0', 10);
      await api.addExpense({
        user_id: userId,
        file_id: fileId,
        category_id: parseInt(selectedCategory),
        title: categories.find(c => String(c.id) === selectedCategory)?.name || 'Expense',
        description: notes,
        amount: parseFloat(amount),
        payment_mode: 'Cash',
        expense_date: date
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to save transaction. Please try again.');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Setting up...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button onClick={() => navigate('/dashboard')} className="mr-3">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Add Transaction</h1>
        </div>
      </div>

      {/* Amount Input */}
      <div className="px-4 pt-6 pb-4">
        <label className="text-gray-600 text-sm mb-2 block">Amount (₹)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-900">₹</span>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-12 h-16 text-3xl font-bold rounded-xl border-gray-200"
          />
        </div>
      </div>

      {/* Category Grid */}
      <div className="px-4 pb-6">
        <label className="text-gray-600 text-sm mb-3 block">Category</label>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.name] || ShoppingBag;
            const isSelected = selectedCategory === String(category.id);
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(String(category.id))}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors ${
                  isSelected ? 'border-[#009688] bg-teal-50' : 'border-gray-200 bg-white'
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-[#009688]' : 'text-gray-600'}`} />
                <span className={`text-xs ${isSelected ? 'text-[#009688] font-medium' : 'text-gray-600'}`}>
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Picker */}
      <div className="px-4 pb-6">
        <label className="text-gray-600 text-sm mb-2 block">Date</label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="pl-12 h-14 rounded-xl border-gray-200"
          />
        </div>
      </div>

      {/* Notes Field */}
      <div className="px-4 pb-6">
        <label className="text-gray-600 text-sm mb-2 block">Notes</label>
        <Textarea
          placeholder="Add notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="rounded-xl border-gray-200 min-h-[100px]"
        />
      </div>

      {/* Save Button */}
      <div className="px-4 pb-6">
        <Button
          onClick={handleSave}
          className="w-full h-14 bg-[#009688] hover:bg-[#00796B] text-white rounded-xl font-semibold shadow-sm"
        >
          Save Transaction
        </Button>
      </div>
    </div>
  );
}
