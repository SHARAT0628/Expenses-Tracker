import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { User, Lock, Eye, EyeOff, Wallet } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { api } from '../../lib/api';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.login(username, password);
      localStorage.setItem('user_id', res.user_id);
      localStorage.setItem('token', res.token);
      navigate('/dashboard');
    } catch (err: any) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4">
      {/* Header Section */}
      <div className="pt-20 pb-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#009688] rounded-full flex items-center justify-center shadow-md">
            <Wallet className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
        <p className="text-gray-500 text-sm">Track and manage your expenses easily</p>
      </div>

      {/* Login Form */}
      <div className="flex-1">
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-12 h-14 rounded-xl border-gray-200 focus:border-[#009688] focus:ring-[#009688]"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 pr-12 h-14 rounded-xl border-gray-200 focus:border-[#009688] focus:ring-[#009688]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full h-14 bg-[#009688] hover:bg-[#00796B] text-white rounded-xl font-semibold text-base shadow-sm mt-6"
          >
            Login
          </Button>

          {/* Forgot Password Link */}
          <div className="text-center pt-2">
            <Link to="/forgot-password" className="text-[#009688] text-sm font-medium">
              Forgot password?
            </Link>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#009688] font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
