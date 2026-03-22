import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Save } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function BudgetSettingsScreen() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(
    localStorage.getItem('monthly_budget') || ''
  );

  const handleSave = () => {
    if (!budget || parseFloat(budget) <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }
    localStorage.setItem('monthly_budget', budget);
    alert('Budget saved!');
    navigate('/budget');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button onClick={() => navigate('/budget')} className="mr-3">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Budget Settings</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Monthly Budget Input */}
        <div>
          <label className="text-gray-700 font-medium block mb-2">Monthly Budget (₹)</label>
          <p className="text-gray-400 text-sm mb-3">Set how much you want to spend per month</p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-500">₹</span>
            <Input
              type="number"
              placeholder="e.g. 10000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="pl-10 h-14 text-xl rounded-xl border-gray-200"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="w-full h-14 bg-[#009688] hover:bg-[#00796B] text-white rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Budget
        </Button>
      </div>
    </div>
  );
}
