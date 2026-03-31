import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/user.slice.js';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

/* Floating animated blob for admin (darker green/slate) */
const AdminBlob = ({ style, duration, delay }) => (
  <motion.div
    style={style}
    className="absolute rounded-full opacity-30 blur-3xl pointer-events-none"
    animate={{ y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.15, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const AdminLogin = () => {
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
      // Calling the specific admin login endpoint
      const { data } = await axios.post(`${API_BASE}/admin/login`, form, { withCredentials: true });
      if (data.success) {
        dispatch(setUser({ user: data.admin, token: data.token }));
        navigate('/admin');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Admin login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ background: 'linear-gradient(135deg, #1e293b 0%, #064e3b 100%)' }}
      className="h-screen w-screen flex items-center justify-center overflow-hidden relative"
    >
      {/* Background Blobs (Admin specific theme) */}
      <AdminBlob style={{ width: 300, height: 300, background: '#10b981', top: '-80px', left: '-80px' }} duration={10} delay={0} />
      <AdminBlob style={{ width: 250, height: 250, background: '#334155', bottom: '-60px', right: '-60px' }} duration={12} delay={1} />
      <AdminBlob style={{ width: 180, height: 180, background: '#059669', top: '30%', right: '10%' }} duration={8} delay={2} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden relative z-10"
      >
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)' }} className="px-8 py-8 text-center relative">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 backdrop-blur-sm"
          >
            <ShieldCheck size={28} className="text-white" />
          </motion.div>
          <h1 className="text-xl font-black text-white tracking-tight uppercase">Admin Access</h1>
          <p className="text-emerald-100/70 text-xs mt-1 font-medium italic">MediCare Central Control</p>
        </div>

        {/* Form Body */}
        <div className="px-8 py-8 bg-white">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 text-xs p-3 mb-6 rounded shadow-sm"
            >
              <p className="font-bold">Access Denied</p>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1 tracking-wider">Admin Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={16} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="enter the valid email"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1 tracking-wider">Passcode</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                'Secure Login'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[10px] text-center text-slate-400 font-medium">
              SYSTEM SECURITY NOTICE:<br />
              All login attempts are logged and monitored.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
