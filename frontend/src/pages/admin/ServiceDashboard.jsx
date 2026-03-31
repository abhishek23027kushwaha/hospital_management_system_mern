import { useState } from 'react';
import {
  LayoutGrid, CalendarCheck, IndianRupee,
  CheckCircle2, XCircle, Search, RefreshCw
} from 'lucide-react';

/* ─── Sample Data ─── */
const SAMPLE_SERVICES = [
  {
    id: 1,
    name: 'Full Body service',
    image: null,
    price: 1,
    appointments: 2,
    completed: 1,
    canceled: 1,
  },
];

/* ─── Stat Card ─── */
const StatCard = ({ icon: Icon, label, value }) => (
  <div style={{
    background: '#fff',
    border: '1.5px solid #bbf7d0',
    borderRadius: 14,
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 140,
  }}>
    <div style={{
      width: 42, height: 42, borderRadius: '50%',
      background: '#e6fff5', border: '1.5px solid #bbf7d0',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon size={19} color="#0d9488" />
    </div>
    <div>
      <p style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, margin: 0 }}>{label}</p>
      <p style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '2px 0 0' }}>{value}</p>
    </div>
  </div>
);

/* ─── Service Avatar ─── */
const ServiceImg = ({ src, name }) => (
  <div style={{
    width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
    background: '#1e293b', border: '1px solid #e5e7eb',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    {src
      ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      : <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textAlign: 'center', padding: 4 }}>{name[0]}</span>
    }
  </div>
);

export default function ServiceDashboard() {
  const [services, setServices] = useState(SAMPLE_SERVICES);
  const [search, setSearch] = useState('');

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalServices     = services.length;
  const totalAppointments = services.reduce((a, s) => a + s.appointments, 0);
  const totalEarning      = services.reduce((a, s) => a + s.price * s.completed, 0);
  const totalCompleted    = services.reduce((a, s) => a + s.completed, 0);
  const totalCanceled     = services.reduce((a, s) => a + s.canceled, 0);

  const refresh = () => setServices(SAMPLE_SERVICES);

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Inter','Segoe UI',sans-serif", minHeight: '100vh', background: '#f0fdf4' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0d9488', margin: 0 }}>Service Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Overview of services, appointments and earnings</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 4 }}>
          <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{totalServices} service{totalServices !== 1 ? 's' : ''}</span>
          <button
            onClick={refresh}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', borderRadius: 20,
              border: '1.5px solid #0d9488', background: 'transparent',
              color: '#0d9488', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
        <StatCard icon={LayoutGrid}    label="Total Services"     value={totalServices} />
        <StatCard icon={CalendarCheck} label="Total Appointments" value={totalAppointments} />
        <StatCard icon={IndianRupee}   label="Total Earning"      value={`₹${totalEarning}`} />
        <StatCard icon={CheckCircle2}  label="Completed"          value={totalCompleted} />
        <StatCard icon={XCircle}       label="Canceled"           value={totalCanceled} />
      </div>

      {/* ── Search ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#fff', border: '1.5px solid #d1fae5',
        borderRadius: 30, padding: '9px 16px',
        width: 220, marginBottom: 20,
      }}>
        <Search size={14} color="#9ca3af" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search service..."
          style={{ border: 'none', outline: 'none', fontSize: 13, color: '#374151', background: 'transparent', width: '100%' }}
        />
      </div>

      {/* ── Services Table ── */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Service', 'Price', 'Appointments', 'Completed', 'Canceled', 'Earning'].map((h, i) => (
                <th key={h} style={{
                  padding: '12px 18px', textAlign: i === 0 ? 'left' : 'center',
                  fontSize: 12, color: '#6b7280', fontWeight: 600,
                  borderBottom: '1px solid #f3f4f6',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
                  No services found
                </td>
              </tr>
            ) : filtered.map(s => {
              const earning = s.price * s.completed;
              return (
                <tr key={s.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  {/* Service Name + Image */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <ServiceImg src={s.image} name={s.name} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#0d9488' }}>{s.name}</span>
                    </div>
                  </td>
                  {/* Price */}
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#111827' }}>
                    ₹{s.price}
                  </td>
                  {/* Appointments */}
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 14, color: '#374151' }}>
                    {s.appointments}
                  </td>
                  {/* Completed - green */}
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#16a34a' }}>
                    {s.completed}
                  </td>
                  {/* Canceled - red */}
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#dc2626' }}>
                    {s.canceled}
                  </td>
                  {/* Earning */}
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#111827' }}>
                    ₹{earning}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
