import { useNavigate, useLocation } from 'react-router';
import { FileText, PieChart, Plus, Wallet, User } from 'lucide-react';

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: FileText, label: 'Records' },
    { path: '/reports', icon: PieChart, label: 'Reports' },
    { path: '/add', icon: Plus, label: 'Add', isCenter: true },
    { path: '/budget', icon: Wallet, label: 'Budget' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-[360px] mx-auto">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center -mt-8"
              >
                <div className="w-14 h-14 rounded-full bg-[#009688] shadow-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-full"
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? 'text-[#009688]' : 'text-gray-400'
                }`}
              />
              <span
                className={`text-xs mt-1 ${
                  isActive ? 'text-[#009688] font-medium' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
