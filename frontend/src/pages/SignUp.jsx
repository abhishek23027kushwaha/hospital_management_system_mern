import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const Blob = ({ style, duration, delay }) => (
  <motion.div
    style={style}
    className="absolute rounded-full opacity-40 blur-3xl pointer-events-none"
    animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${API_BASE}/auth/register`, form, { withCredentials: true });
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
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
      <Blob style={{ width: 280, height: 280, background: '#4caf50', top: '-80px', right: '-60px' }} duration={7} delay={0} />
      <Blob style={{ width: 200, height: 200, background: '#81c784', bottom: '-50px', left: '-50px' }} duration={9} delay={1} />
      <Blob style={{ width: 140, height: 140, background: '#66bb6a', top: '50%', left: '6%' }} duration={6} delay={2} />
      <Blob style={{ width: 100, height: 100, background: '#a5d6a7', bottom: '25%', right: '4%' }} duration={8} delay={0.5} />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-green-500 opacity-20 pointer-events-none"
          style={{
            width: 6 + (i % 4) * 5,
            height: 6 + (i % 4) * 5,
            top: `${8 + i * 12}%`,
            left: `${8 + (i * 11) % 84}%`,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 2.5 + i * 0.4, delay: i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden relative z-10"
      >
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)' }} className="px-7 py-5 text-center relative overflow-hidden">
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
          <h1 className="text-lg font-bold text-white">Create Account</h1>
          <p className="text-green-100 text-xs mt-0.5">Join MediCare today</p>
        </div>

        {/* Form */}
        <div className="px-7 py-5">
          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2 mb-3">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder="John Doe"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all placeholder-gray-400" />
              </div>
            </div>

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
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                  placeholder="Min. 6 characters"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all placeholder-gray-400" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              type="submit" disabled={loading}
              style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)' }}
              className="w-full text-white font-semibold py-2.5 rounded-lg shadow-md hover:opacity-90 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account…
                </span>
              ) : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-green-700 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
