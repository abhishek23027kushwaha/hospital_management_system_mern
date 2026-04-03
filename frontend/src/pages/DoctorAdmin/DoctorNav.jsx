import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, UserPen, LogOut, Stethoscope } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearDoctor } from '../../redux/doctor.slice.js';

const navLinks = [
  { label: 'Dashboard',    to: '/doctor-admin',             icon: LayoutDashboard },
  { label: 'Appointments', to: '/doctor-admin/appointments', icon: CalendarCheck },
  { label: 'Edit Profile', to: '/doctor-admin/profile',      icon: UserPen },
];

const DoctorNav = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (to) => location.pathname === to;

  const handleLogout = () => {
    dispatch(clearDoctor());
    navigate('/doctor/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <nav
        className="max-w-5xl mx-auto flex items-center justify-between px-5 py-2.5 rounded-2xl border border-gray-100 shadow-md"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)' }}
      >
        {/* ── Logo ── */}
        <Link to="/doctor-admin" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-full border-2 border-[#0d9488] flex items-center justify-center bg-[#f0fdfa]">
            <Stethoscope size={18} className="text-[#0d9488]" />
          </div>
          <div className="leading-tight">
            <p className="text-[#0d9488] font-black text-base leading-none">Medtek</p>
            <p className="text-gray-400 text-[10px] font-medium">HealthCare Solutions</p>
          </div>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                isActive(to)
                  ? 'bg-[#0d9488] text-white shadow-md shadow-teal-200'
                  : 'text-gray-500 hover:text-[#0d9488] hover:bg-teal-50'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 border border-gray-100"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-5 h-0.5 bg-gray-500 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-500 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-500 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden max-w-5xl mx-auto mt-2 bg-white rounded-2xl border border-gray-100 shadow-lg p-4 flex flex-col gap-1">
          {navLinks.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive(to)
                  ? 'bg-[#0d9488] text-white'
                  : 'text-gray-600 hover:bg-teal-50 hover:text-[#0d9488]'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all mt-1 border-t border-gray-100 pt-3"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default DoctorNav;
