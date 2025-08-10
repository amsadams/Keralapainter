
import React, { useState } from 'react';
import { Shield, Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Authenticate with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        setSuccess(true);
        
        // Store admin session in localStorage
        localStorage.setItem('adminSession', JSON.stringify({
          user: data.user,
          session: data.session,
          loginTime: new Date().toISOString()
        }));

        // Call success callback
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1000);
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-black flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Login Form Container */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 sm:p-12 shadow-2xl">
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-500/10 rounded-3xl"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 backdrop-blur-sm rounded-2xl border border-blue-500/30 mb-4">
                <Shield className="w-8 h-8 text-blue-300" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2">Admin Login</h1>
              <p className="text-white/70 text-lg">Kerala Painters Protection Policy</p>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                <span className="text-red-100 text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-green-100 text-sm">Login successful! Redirecting...</span>
              </div>
            )}

            {/* Login Form */}
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                  placeholder="admin@keralapainters.com"
                  autoComplete="email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/50 hover:text-white/80 transition-colors duration-300"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/30 transform transition-all duration-500 hover:scale-105 hover:-translate-y-1 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-6 h-6" />
                    <span>Sign In</span>
                  </>
                )}
                
                {/* Hover Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </button>
            </div>

            {/* Footer Info */}
            <div className="mt-8 text-center">
              <p className="text-white/50 text-sm">
                Secure admin access for Kerala Painters Protection Policy
              </p>
              <div className="flex items-center justify-center space-x-4 mt-4 text-white/40 text-xs">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>System Online</span>
                </span>
                <span>v1.0</span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;