import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/UserContext';
import { Eye, EyeOff, LogIn, Key, Lock, Mail, CreditCard, Shield, Building2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [keys, setKeys] = useState([]);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const generateKeys = () => {
      const newKeys = [];
      for (let i = 0; i < 15; i++) {
        newKeys.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          delay: Math.random() * 5,
          duration: 8 + Math.random() * 4,
          size: 0.5 + Math.random() * 0.5,
          rotation: Math.random() * 360
        });
      }
      setKeys(newKeys);
    };

    generateKeys();
    const interval = setInterval(generateKeys, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData);
      if (response.user?.role === 'borrower') {
        navigate('/user-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        {keys.map((key) => (
          <div
            key={key.id}
            className="absolute animate-float"
            style={{
              left: `${key.x}%`,
              top: `${key.y}%`,
              animationDelay: `${key.delay}s`,
              animationDuration: `${key.duration}s`,
              transform: `scale(${key.size}) rotate(${key.rotation}deg)`
            }}
          >
            <Key className="h-8 w-8 text-green-400 opacity-30" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 animate-pulse">
          <Lock className="h-6 w-6 text-green-300 opacity-20" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce">
          <Mail className="h-5 w-5 text-green-400 opacity-20" />
        </div>
        <div className="absolute bottom-40 left-20 animate-pulse">
          <CreditCard className="h-7 w-7 text-green-500 opacity-20" />
        </div>
        <div className="absolute bottom-20 right-10 animate-bounce">
          <Key className="h-6 w-6 text-green-600 opacity-20" />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-300 text-sm">
                  Sign in to your CreditSea account
                </p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-300">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-green-400 hover:text-green-300 transition-colors"
                >
                  Register here
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
