import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useEffect } from 'react';

export default function App() {
  // Apply saved theme on first load
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="size-full">
      {/* Mobile container - 360x800px optimized */}
      <div className="min-h-screen max-w-[360px] mx-auto bg-white dark:bg-gray-900 shadow-2xl">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
