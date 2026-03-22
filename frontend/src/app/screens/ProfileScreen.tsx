import { useNavigate } from 'react-router';
import { ArrowLeft, User, Hash, Settings, ChevronRight } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('Loading...');

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) { navigate('/'); return; }
    api.getProfile(userId)
      .then((data: any) => setUsername(data.username))
      .catch(() => setUsername('Unknown'));
  }, [navigate]);

  const profileItems = [
    { icon: Hash, label: 'User ID', value: localStorage.getItem('user_id') || '-' },
    { icon: User, label: 'Username', value: username },
  ];

  const menuItems = [
    { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    localStorage.removeItem('file_id');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button onClick={() => navigate('/dashboard')} className="mr-3">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
        </div>
      </div>

      {/* Profile Avatar */}
      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="w-24 h-24 rounded-full bg-[#009688] flex items-center justify-center mb-4">
          <User className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{username}</h2>
      </div>

      <div className="px-4 space-y-4">
        {/* Profile Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {profileItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-3 p-4">
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="flex-1 text-gray-600 text-sm">{item.label}</span>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            );
          })}
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
              >
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="flex-1 text-left font-medium text-gray-900">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full h-14 bg-white hover:bg-red-50 text-red-500 border border-gray-200 rounded-xl font-semibold transition-colors"
        >
          Logout
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
}
