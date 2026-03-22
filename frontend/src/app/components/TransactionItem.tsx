import { ShoppingBag, Utensils, Smartphone, Home, Car, GraduationCap, Heart, Film } from 'lucide-react';

interface TransactionItemProps {
  category: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
}

const categoryIcons: Record<string, any> = {
  Shopping: ShoppingBag,
  Food: Utensils,
  Phone: Smartphone,
  Home: Home,
  Transport: Car,
  Education: GraduationCap,
  Health: Heart,
  Entertainment: Film,
};

export function TransactionItem({ category, date, amount, type }: TransactionItemProps) {
  const Icon = categoryIcons[category] || ShoppingBag;
  const amountColor = type === 'income' ? 'text-[#4CAF50]' : 'text-[#F44336]';
  const iconBg = type === 'income' ? 'bg-green-50' : 'bg-red-50';
  const iconColor = type === 'income' ? 'text-[#4CAF50]' : 'text-[#F44336]';

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-gray-900 font-medium text-sm">{category}</p>
          <p className="text-gray-500 text-xs">{date}</p>
        </div>
      </div>
      <p className={`font-semibold ${amountColor}`}>
        {type === 'income' ? '+' : '-'}${Math.abs(amount).toFixed(2)}
      </p>
    </div>
  );
}
