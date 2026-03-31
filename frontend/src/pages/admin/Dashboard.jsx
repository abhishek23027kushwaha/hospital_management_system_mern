import { useState, useEffect } from 'react';
import { Users, UserCheck, CalendarCheck, IndianRupee, CheckCircle2, XCircle, Search, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export default function Dashboard() {
  const [stats, setStats] = useState([
    { label: 'Total Doctors',          value: 0,     icon: Users,          border: '#d1fae5', iconBg: '#f0fdf4', iconColor: '#16a34a', key: 'totalDoctors' },
    { label: 'Total Registered Users', value: 0,     icon: UserCheck,       border: '#dbeafe', iconBg: '#eff6ff', iconColor: '#2563eb', key: 'totalUsers' },
    { label: 'Total Appointments',     value: 0,     icon: CalendarCheck,  border: '#fce7f3', iconBg: '#fdf2f8', iconColor: '#db2777', key: 'totalAppointments' },
    { label: 'Total Earnings',         value: '₹ 0', icon: IndianRupee,  border: '#fef9c3', iconBg: '#fefce8', iconColor: '#ca8a04', key: 'totalEarnings' },
    { label: 'Completed',              value: 0,     icon: CheckCircle2,   border: '#d1fae5', iconBg: '#f0fdf4', iconColor: '#16a34a', key: 'completedCount' },
    { label: 'Canceled',               value: 0,     icon: XCircle,        border: '#fee2e2', iconBg: '#fef2f2', iconColor: '#dc2626', key: 'cancelledCount' },
  ]);

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, doctorsRes] = await Promise.all([
        axios.get(`${API_BASE}/admin/dashboard`, { withCredentials: true }),
        axios.get(`${API_BASE}/admin/doctors`,   { withCredentials: true })
      ]);

      if (statsRes.data.success) {
        const s = statsRes.data.stats;
        setStats(prev => prev.map(item => ({
          ...item,
          value: item.key === 'totalEarnings' ? `₹ ${s[item.key] || 0}` : (s[item.key] || 0)
        })));
      }

      if (doctorsRes.data.success) {
        setDoctors(doctorsRes.data.doctors);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      {/* Heading */}
      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#111827', textTransform: 'uppercase', letterSpacing: '-0.5px', marginBottom: 4 }}>
        DASHBOARD
      </h1>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 28 }}>Overview of doctors &amp; appointments</p>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 36 }}>
        {stats.map(({ label, value, icon: Icon, border, iconBg, iconColor }) => (
          <div key={label} style={{
            background: '#fff', border: `1.5px solid ${border}`,
            borderRadius: 16, padding: '18px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: iconBg, border: `1.5px solid ${border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={20} color={iconColor} />
            </div>
            <div>
              <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 2 }}>{label}</p>
              <p style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: 0 }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <h2 style={{ fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 10 }}>Search doctors</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', border: '1.5px solid #d1fae5', borderRadius: 30,
          padding: '9px 16px', width: 280,
        }}>
          <Search size={15} color="#9ca3af" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name / specialization / fee"
            style={{ border: 'none', outline: 'none', fontSize: 13, color: '#374151', background: 'transparent', width: '100%' }}
          />
        </div>
        <button
          onClick={() => setSearch('')}
          style={{
            background: '#16a34a', color: '#fff', border: 'none',
            borderRadius: 30, padding: '9px 20px', fontWeight: 700,
            fontSize: 13, cursor: 'pointer',
          }}
        >
          Clear
        </button>
      </div>

      {/* Doctors Table */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#111827' }}>Doctors</span>
          <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>Showing {filtered.length} of {doctors.length}</span>
        </div>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <Loader2 className="animate-spin" size={24} color="#16a34a" />
              <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Fetching dashboard data...</span>
            </div>
          </div>
        ) : error ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#dc2626', fontSize: 14 }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
            No doctors found. Add doctors from the "Add Doctor" page.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['#', 'Name', 'Specialization', 'Fee', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) => (
                <tr key={doc._id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#6b7280' }}>{i + 1}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{doc.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>{doc.specialization}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>₹{doc.fee}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: doc.available ? '#d1fae5' : '#fee2e2',
                      color: doc.available ? '#16a34a' : '#dc2626',
                      borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700
                    }}>
                      {doc.available ? 'Available' : 'Not Available'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
