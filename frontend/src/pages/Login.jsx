import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/user.slice.js';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

/* Floating animated blob */
const Blob = ({ style, duration, delay }) => (
  <motion.div
    style={style}
    className="absolute rounded-full opacity-40 blur-3xl pointer-events-none"
    animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, form, { withCredentials: true });
      if (data.success) {
        dispatch(setUser({ user: data.user, token: data.token }));
        navigate('/');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 40%, #a5d6a7 100%)' }}
      className="h-screen w-screen flex items-center justify-center overflow-hidden relative"
    >
      {/* Animated background blobs */}
      <Blob style={{ width: 260, height: 260, background: '#66bb6a', top: '-60px', left: '-60px' }} duration={7} delay={0} />
      <Blob style={{ width: 200, height: 200, background: '#81c784', bottom: '-40px', right: '-40px' }} duration={8} delay={1} />
      <Blob style={{ width: 150, height: 150, background: '#a5d6a7', top: '40%', right: '8%' }} duration={6} delay={2} />
      <Blob style={{ width: 120, height: 120, background: '#4caf50', bottom: '20%', left: '5%' }} duration={9} delay={0.5} />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-green-400 opacity-20 pointer-events-none"
          style={{
            width: 8 + (i % 3) * 6,
            height: 8 + (i % 3) * 6,
            top: `${10 + i * 11}%`,
            left: `${5 + (i * 13) % 90}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 3 + i * 0.5, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden relative z-10"
      >
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #2e7d32, #43a047)' }} className="px-7 py-6 text-center relative overflow-hidden">
          {/* header shimmer */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{ background: 'linear-gradient(90deg, transparent, #fff, transparent)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
          />
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow"
          >
            <span className="text-xl">🏥</span>
          </motion.div>
          <h1 className="text-lg font-bold text-white">Welcome Back</h1>
          <p className="text-green-100 text-xs mt-0.5">Sign in to MediCare</p>
        </div>

        {/* Form */}
        <div className="px-7 py-6">
          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2 mb-4">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all placeholder-gray-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-600">Password</label>
                <a href="#" className="text-xs text-green-600 hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all placeholder-gray-400" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              type="submit" disabled={loading}
              style={{ background: 'linear-gradient(135deg, #2e7d32, #43a047)' }}
              className="w-full text-white font-semibold py-2.5 rounded-lg shadow-md hover:opacity-90 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            No account?{' '}
            <Link to="/signup" className="text-green-600 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
