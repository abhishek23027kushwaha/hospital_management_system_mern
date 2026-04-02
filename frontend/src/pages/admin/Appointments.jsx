import { useState, useEffect, useCallback } from 'react';
import { Search, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/admin';

const statusColor = {
  Completed: { bg: '#d1fae5', color: '#16a34a' },
  Pending:   { bg: '#fef9c3', color: '#ca8a04' },
  Cancelled: { bg: '#fee2e2', color: '#dc2626' },
};

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/appointments`, { withCredentials: true });
      if (data.success) {
        setAppointments(data.appointments);
        setStats(data.stats);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const changeStatus = async (id, type, status) => {
    try {
      const { data } = await axios.put(`${API_BASE}/appointments/${type}/${id}/status`, { status }, { withCredentials: true });
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update status');
    }
  };

  const filtered = appointments.filter(a => {
    const pName = a.patient?.name || '';
    const dName = a.doctor?.name || a.service?.name || '';
    return pName.toLowerCase().includes(search.toLowerCase()) || 
           dName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: '#111827', textTransform: 'uppercase', marginBottom: 4 }}>APPOINTMENTS</h1>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 24 }}>Manage all patient appointments</p>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total', val: stats.total, bg: '#f0fdf4', color: '#16a34a' },
          { label: 'Completed', val: stats.completed, bg: '#d1fae5', color: '#16a34a' },
          { label: 'Pending',   val: stats.pending,   bg: '#fef9c3', color: '#ca8a04' },
          { label: 'Cancelled', val: stats.cancelled, bg: '#fee2e2', color: '#dc2626' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '12px 20px', textAlign: 'center', minWidth: 90 }}>
            <p style={{ fontSize: 22, fontWeight: 900, color: s.color, margin: 0 }}>{s.val}</p>
            <p style={{ fontSize: 11, color: s.color, fontWeight: 600, margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1.5px solid #d1fae5', borderRadius: 30, padding: '9px 16px', maxWidth: 320 }}>
          <Search size={14} color="#9ca3af" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient or doctor"
            style={{ border: 'none', outline: 'none', fontSize: 13, color: '#374151', background: 'transparent', width: '100%' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['#', 'Patient', 'Doctor', 'Date', 'Time', 'Fee', 'Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 12, color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #f3f4f6' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: 60, textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <Loader2 className="animate-spin" size={24} color="#0d9488" />
                  <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Fetching appointments...</span>
                </div>
              </td></tr>
            ) : error ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#dc2626' }}>{error}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>No appointments found</td></tr>
            ) : filtered.map((a, i) => {
              const sc = statusColor[a.status] || statusColor.Pending;
              return (
                <tr key={a._id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#9ca3af' }}>{i + 1}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{a.patient?.name || 'User'}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{a.doctor?.name || a.service?.name}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{a.date}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{a.time}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600 }}>₹{a.fee}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: sc.bg, color: sc.color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{a.status}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {a.status === 'Pending' ? (
                        <>
                          <button onClick={() => changeStatus(a._id, a.type, 'Completed')} style={{ background: '#d1fae5', border: 'none', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', color: '#16a34a', display: 'flex', alignItems: 'center' }}>
                            <CheckCircle2 size={14} />
                          </button>
                          <button onClick={() => changeStatus(a._id, a.type, 'Cancelled')} style={{ background: '#fee2e2', border: 'none', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}>
                            <XCircle size={14} />
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: 11, color: '#9ca3af', fontStyle: 'italic' }}>No actions</span>
                      )}
                    </div>
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
