import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Moon, Lock, Info, MessageSquare, Key, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function SettingsScreen() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  const toggleTheme = () => {
    const newDark = !isDarkMode;
    setIsDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const settingsItems = [
    { icon: Lock, label: 'Privacy & Security', action: () => {} },
    { icon: Info, label: 'About Us', action: () => {} },
    { icon: MessageSquare, label: 'Feedback', action: () => {} },
    { icon: Key, label: 'Change Password', action: () => {} },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    localStorage.removeItem('file_id');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center">
          <button onClick={() => navigate('/profile')} className="mr-3">
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Theme Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="font-medium text-gray-900 dark:text-white">Dark Mode</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {isDarkMode ? 'On' : 'Off'}
              </span>
              <button
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isDarkMode ? 'bg-[#009688]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="flex-1 text-left font-medium text-gray-900 dark:text-white">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="w-full h-14 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-[#F44336] border border-gray-200 dark:border-gray-700 rounded-xl font-semibold"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
