import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard, UserPlus, Users, CalendarCheck,
  LayoutGrid, PlusSquare, List, CalendarRange, Stethoscope, LogOut
} from 'lucide-react';

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
  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
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
        {/* Logo */}
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
            <div style={{ color: '#9ca3af', fontSize: 10, fontWeight: 500 }}>Healthcare Solutions</div>
          </div>
        </div>

        {/* Nav Links pill container */}
        <nav style={{
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
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sign Out */}
        <button style={{
          background: '#f59e0b', color: '#fff', border: 'none',
          borderRadius: 50, padding: '9px 22px',
          fontWeight: 700, fontSize: 13, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#d97706'}
          onMouseLeave={e => e.currentTarget.style.background = '#f59e0b'}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </header>

      {/* ── Page Content ── */}
      <main style={{ paddingTop: 80, minHeight: '100vh', background: '#f0fdf4' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
