import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, ChevronDown } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/user.slice.js';
import axios from '../utils/axiosInstance';



const Blob = ({ style, duration, delay }) => (
  <motion.div
    style={style}
    className="absolute rounded-full opacity-40 blur-3xl pointer-events-none"
    animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const InputField = ({ icon: Icon, label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />}
      {children}
    </div>
  </div>
);

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', gender: '', age: '' });
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
      const { data } = await axios.post(`/auth/register`, form);
      if (data.success) {
        dispatch(setUser({ user: data.user, token: data.token }));
        navigate('/');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all placeholder-gray-400 bg-white";

  return (
    <div
      style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 40%, #a5d6a7 100%)' }}
      className="min-h-screen w-screen flex items-center justify-center overflow-auto py-6 relative"
    >
      {/* Animated blobs */}
      <Blob style={{ width: 260, height: 260, background: '#4caf50', top: '-60px', right: '-50px' }} duration={7} delay={0} />
      <Blob style={{ width: 200, height: 200, background: '#81c784', bottom: '-40px', left: '-50px' }} duration={9} delay={1} />
      <Blob style={{ width: 130, height: 130, background: '#66bb6a', top: '45%', left: '5%' }} duration={6} delay={2} />
      <Blob style={{ width: 100, height: 100, background: '#a5d6a7', bottom: '20%', right: '4%' }} duration={8} delay={0.5} />

      {/* Particles */}
      {[...Array(7)].map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full bg-green-500 opacity-20 pointer-events-none"
          style={{ width: 6 + (i % 3) * 5, height: 6 + (i % 3) * 5, top: `${8 + i * 12}%`, left: `${6 + (i * 14) % 86}%` }}
          animate={{ y: [0, -18, 0], opacity: [0.12, 0.3, 0.12] }}
          transition={{ duration: 2.5 + i * 0.4, delay: i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45 }}
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
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-1.5 shadow">
            <span className="text-xl">🏥</span>
          </motion.div>
          <h1 className="text-base font-bold text-white">Create Account</h1>
          <p className="text-green-100 text-xs mt-0.5">Join MediCare today</p>
        </div>

        {/* Form */}
        <div className="px-7 py-5">
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2 mb-3">
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Row: Name */}
            <InputField icon={User} label="Full Name">
              <input type="text" name="name" value={form.name} onChange={handleChange} required
                placeholder="John Doe" className={inputCls} />
            </InputField>

            {/* Row: Email */}
            <InputField icon={Mail} label="Email">
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="you@example.com" className={inputCls} />
            </InputField>

            {/* Row: Password */}
            <InputField icon={Lock} label="Password">
              <input type={showPass ? 'text' : 'password'} name="password" value={form.password}
                onChange={handleChange} required placeholder="Min. 6 characters"
                className={`${inputCls} pr-9`} />
              <button type="button" onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600">
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </InputField>

            {/* Row: Phone */}
            <InputField icon={Phone} label="Phone Number">
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                placeholder="9876543210" className={inputCls} />
            </InputField>

            {/* Row: Gender + Age side by side */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Gender</label>
                <div className="relative">
                  <select name="gender" value={form.gender} onChange={handleChange}
                    className="w-full pl-3 pr-7 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-gray-600 appearance-none bg-white">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                  <input type="number" name="age" value={form.age} onChange={handleChange}
                    placeholder="25" min="1" max="120"
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all placeholder-gray-400 bg-white" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              type="submit" disabled={loading}
              style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)' }}
              className="w-full text-white font-semibold py-2.5 rounded-lg shadow-md text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-1"
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

          <p className="text-center text-xs text-gray-500 mt-3">
            Already have an account?{' '}
            <Link to="/login" className="text-green-700 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
