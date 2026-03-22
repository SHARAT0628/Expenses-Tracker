import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { api } from '../../lib/api';

export default function SignUpScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await api.register(formData.fullName, formData.password);
      const res = await api.login(formData.fullName, formData.password);
      localStorage.setItem('user_id', res.user_id);
      localStorage.setItem('token', res.token);
      navigate('/dashboard');
    } catch (err: any) {
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4">
      {/* Header Section */}
      <div className="pt-8 pb-6">
        <button onClick={() => navigate('/')} className="inline-flex items-center text-gray-600 mb-6">
          <ArrowLeft className="w-5 h-5 mr-1" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
        <p className="text-gray-500 text-sm">Start managing your expenses today</p>
      </div>

      {/* Sign Up Form */}
      <div className="flex-1 pb-8">
        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Full Name Input */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Username"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="pl-12 h-14 rounded-xl border-gray-200 focus:border-[#009688] focus:ring-[#009688]"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="pl-12 h-14 rounded-xl border-gray-200 focus:border-[#009688] focus:ring-[#009688]"
            />
          </div>

          {/* Phone Number Input */}
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="pl-12 h-14 rounded-xl border-gray-200 focus:border-[#009688] focus:ring-[#009688]"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="pl-12 pr-12 h-14 rounded-xl border-gray-200 focus:border-[#009688] focus:ring-[#009688]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className="pl-12 pr-12 h-14 rounded-xl border-gray-200 focus:border-[#009688] focus:ring-[#009688]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Register Button */}
          <Button
            type="submit"
            className="w-full h-14 bg-[#009688] hover:bg-[#00796B] text-white rounded-xl font-semibold text-base shadow-sm mt-6"
          >
            Register
          </Button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/" className="text-[#009688] font-semibold">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
