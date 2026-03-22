import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ShoppingBag, Utensils, Smartphone, Film, Home, Car, GraduationCap, Heart, Plus, DollarSign, Briefcase, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function CategoryManagementScreen() {
  const navigate = useNavigate();
  const [categoryType, setCategoryType] = useState<'expense' | 'income'>('expense');
  const [selectedCategory, setSelectedCategory] = useState('Shopping');

  const expenseCategories = [
    { name: 'Shopping', icon: ShoppingBag },
    { name: 'Food', icon: Utensils },
    { name: 'Phone', icon: Smartphone },
    { name: 'Entertainment', icon: Film },
    { name: 'Home', icon: Home },
    { name: 'Transport', icon: Car },
    { name: 'Education', icon: GraduationCap },
    { name: 'Health', icon: Heart },
  ];

  const incomeCategories = [
    { name: 'Salary', icon: DollarSign },
    { name: 'Freelance', icon: Briefcase },
    { name: 'Investment', icon: TrendingUp },
  ];

  const categories = categoryType === 'expense' ? expenseCategories : incomeCategories;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button onClick={() => navigate('/add')} className="mr-3">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Category Management</h1>
        </div>
      </div>

      {/* Toggle Tabs */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setCategoryType('expense')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              categoryType === 'expense'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => setCategoryType('income')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              categoryType === 'income'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {/* Category List */}
      <div className="px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-700" />
                </div>
                <span className="flex-1 text-left font-medium text-gray-900">{category.name}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-[#009688]' : 'border-gray-300'
                }`}>
                  {isSelected && <div className="w-3 h-3 rounded-full bg-[#009688]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Category Button */}
      <div className="px-4 mt-6">
        <Button className="w-full h-14 bg-white hover:bg-gray-50 text-[#009688] border-2 border-[#009688] rounded-xl font-semibold">
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </Button>
      </div>
    </div>
  );
}
