import { useState, useEffect, useCallback } from 'react';
import {
  LayoutGrid, CalendarCheck, IndianRupee,
  CheckCircle2, XCircle, Search, RefreshCw, Loader2
} from 'lucide-react';
import axios from '../../utils/axiosInstance';



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
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({ 
    totalServices: 0, totalAppointments: 0, totalEarnings: 0, totalCompleted: 0, totalCanceled: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get(`/services/dashboard`);
      if (data.success) {
        setServices(data.services);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('fetchData error:', err);
      setError(err?.response?.data?.message || 'Failed to load service dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const refresh = () => fetchData();

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Inter','Segoe UI',sans-serif", minHeight: '100vh', background: '#f0fdf4' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0d9488', margin: 0 }}>Service Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Overview of services, appointments and earnings</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 4 }}>
          <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{stats.totalServices} service{stats.totalServices !== 1 ? 's' : ''}</span>
          <button
            onClick={refresh}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', borderRadius: 20,
              border: '1.5px solid #0d9488', background: '#fff',
              color: '#0d9488', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
        <StatCard icon={LayoutGrid}    label="Total Services"     value={stats.totalServices} />
        <StatCard icon={CalendarCheck} label="Total Appointments" value={stats.totalAppointments} />
        <StatCard icon={IndianRupee}   label="Total Earning"      value={`₹${stats.totalEarnings}`} />
        <StatCard icon={CheckCircle2}  label="Completed"          value={stats.totalCompleted} />
        <StatCard icon={XCircle}       label="Canceled"           value={stats.totalCanceled} />
      </div>

      {/* ── Search ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#fff', border: '1.5px solid #d1fae5',
        borderRadius: 30, padding: '9px 16px',
        width: 260, marginBottom: 20,
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
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 60, textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <Loader2 className="animate-spin" size={24} color="#0d9488" />
                    <span style={{ fontSize: 13, color: '#6b7280' }}>Loading Dashboard Data...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#dc2626' }}>{error}</td></tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
                  No services found
                </td>
              </tr>
            ) : filteredData.map(s => {
              return (
                <tr key={s._id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <ServiceImg src={s.image} name={s.name} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#0d9488' }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#111827' }}>
                    ₹{s.price}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 14, color: '#374151' }}>
                    {s.appointments}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#16a34a' }}>
                    {s.completed}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#dc2626' }}>
                    {s.canceled}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#111827' }}>
                    ₹{s.earnings}
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
