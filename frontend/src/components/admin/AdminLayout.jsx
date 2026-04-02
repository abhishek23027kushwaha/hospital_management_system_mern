import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, clearUser } from '../../redux/user.slice';
import {
  LayoutDashboard, UserPlus, Users, CalendarCheck,
  LayoutGrid, PlusSquare, List, CalendarRange, Stethoscope, LogOut, Menu, X as CloseIcon
} from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { label: 'Dashboard',            to: '/admin',                    icon: LayoutDashboard, end: true },
  { label: 'Add Doctor',           to: '/admin/add-doctor',         icon: UserPlus },
  { label: 'List Doctors',         to: '/admin/list-doctors',       icon: Users },
  { label: 'Appointments',         to: '/admin/appointments',       icon: CalendarCheck },
  { label: 'Service Dashboard',    to: '/admin/service-dashboard',  icon: LayoutGrid },
  { label: 'Add Service',          to: '/admin/add-service',        icon: PlusSquare },
  { label: 'List Services',        to: '/admin/list-services',      icon: List },
  { label: 'Service Appointments', to: '/admin/service-appointments', icon: CalendarRange },
];

const AdminLayout = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ── Protection: Only admin can access ──
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <style>{`
        @media (max-width: 1024px) {
          .admin-nav {
            display: none !important;
          }
          .mobile-menu {
            display: flex !important;
          }
        }
        @media (min-width: 1025px) {
          .mobile-menu-overlay {
            display: none !important;
          }
        }
      `}</style>

      {/* ── Fixed Top Navbar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Left: Logo & Burger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button 
            className="mobile-menu"
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <Menu size={24} color="#16a34a" />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              border: '2px solid #16a34a', background: '#f0fdf4',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Stethoscope size={18} color="#16a34a" />
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ color: '#16a34a', fontWeight: 900, fontSize: 15 }}>MediCare</div>
              <div style={{ color: '#9ca3af', fontSize: 10, fontWeight: 500 }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="admin-nav" style={{
          background: '#f0fdf4', border: '1.5px solid #bbf7d0',
          borderRadius: 50, padding: '6px 12px',
          display: 'flex', alignItems: 'center', gap: 2,
        }}>
          {navLinks.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                padding: '6px 10px', borderRadius: 30, textDecoration: 'none',
                fontSize: 11, fontWeight: 600, transition: 'all 0.2s',
                color: isActive ? '#16a34a' : '#6b7280',
                background: isActive ? 'rgba(22,163,74,0.08)' : 'transparent',
                minWidth: 60,
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} color={isActive ? '#16a34a' : '#6b7280'} />
                  <span style={{ display: 'block' }}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right: Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={handleLogout}
            style={{
              background: '#f59e0b', color: '#fff', border: 'none',
              borderRadius: 50, padding: '9px 18px',
              fontWeight: 700, fontSize: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
              transition: 'all 0.2s',
            }}
          >
            <LogOut size={14} />
            <span style={{ display: 'inline' }}>Sign Out</span>
          </button>
        </div>
      </header>

      {/* ── Mobile Side Menu ── */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'flex-start'
        }} onClick={() => setIsMobileMenuOpen(false)}>
          <div style={{
            width: '280px', height: '100%', background: '#fff',
            boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
            padding: '24px 20px', display: 'flex', flexDirection: 'column',
            animation: 'slideIn 0.3s ease-out'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <div style={{ color: '#16a34a', fontWeight: 900, fontSize: 18 }}>MediCare Admin</div>
              <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <CloseIcon size={24} color="#6b7280" />
              </button>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {navLinks.map(({ label, to, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', borderRadius: 12, textDecoration: 'none',
                    fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
                    color: isActive ? '#16a34a' : '#4b5563',
                    background: isActive ? '#f0fdf4' : 'transparent',
                    border: isActive ? '1px solid #bbf7d0' : '1px solid transparent',
                  })}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid #f3f4f6' }}>
              <button 
                onClick={handleLogout}
                style={{
                  width: '100%', padding: '12px', borderRadius: 12, border: 'none',
                  background: '#fef2f2', color: '#dc2626', fontWeight: 700, fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer'
                }}
              >
                <LogOut size={16} /> Sign Out from Panel
              </button>
            </div>
          </div>
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(-100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </div>
      )}

      {/* ── Page Content ── */}
      <main style={{ paddingTop: 80, minHeight: '100vh', background: '#f0fdf4' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
