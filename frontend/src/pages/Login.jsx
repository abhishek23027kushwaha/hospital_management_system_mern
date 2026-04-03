import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/user.slice.js';
import axios from '../utils/axiosInstance.js';



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
      const { data } = await axios.post(`/auth/login`, form);
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
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-[340px] mx-4 overflow-hidden relative z-10 border border-white/50"
      >
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #166534, #15803d)' }} className="px-6 py-8 text-center relative overflow-hidden">
          {/* header shimmer */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{ background: 'linear-gradient(90deg, transparent, #fff, transparent)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
          />
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner backdrop-blur-sm"
          >
            <span className="text-2xl">🏥</span>
          </motion.div>
          <h1 className="text-xl font-black text-white tracking-tight uppercase">User Login</h1>
          <p className="text-green-100/70 text-[10px] mt-1 font-bold tracking-widest uppercase">MediCare Patient Portal</p>
        </div>

        {/* Form Body */}
        <div className="px-7 py-8 bg-white">
          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold rounded-xl px-3 py-2.5 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" size={16} />
                <input type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/5 transition-all font-bold placeholder:text-gray-300" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-[10px] text-green-600 font-black hover:underline uppercase tracking-widest">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" size={16} />
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/5 transition-all font-bold placeholder:text-gray-300" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-green-600 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-green-900/10 transition-all text-xs uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Authenticating…
                </span>
              ) : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center text-[11px] text-gray-400 font-bold mt-6 uppercase tracking-wider">
            New here?{' '}
            <Link to="/signup" className="text-green-600 hover:underline">Create Account</Link>
          </p>

          <div className="mt-6 pt-5 border-t border-gray-50 text-center">
            <Link to="/doctor/login" className="text-[10px] font-black text-gray-300 hover:text-green-600 transition-colors uppercase tracking-widest flex items-center justify-center gap-1.5 px-4 py-2 hover:bg-gray-50 rounded-xl">
              Are you a doctor? <span className="text-green-600 underline">Login here</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
