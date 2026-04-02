import { useState, useEffect, useCallback } from 'react';
import { CalendarRange, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/admin';

const sc = {
  Completed: { bg: '#d1fae5', color: '#16a34a' },
  Pending:   { bg: '#fef9c3', color: '#ca8a04' },
  Cancelled: { bg: '#fee2e2', color: '#dc2626' },
};

export default function ServiceAppointments() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/appointments`, { withCredentials: true });
      if (data.success) {
        // Filter only service appointments
        const svcOnly = data.appointments.filter(a => a.type === 'service');
        setAppts(svcOnly);
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

  const changeStatus = async (id, status) => {
    try {
      const { data } = await axios.put(`${API_BASE}/appointments/service/${id}/status`, { status }, { withCredentials: true });
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: '#111827', textTransform: 'uppercase', marginBottom: 4 }}>SERVICE APPOINTMENTS</h1>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 24 }}>Manage service-based patient appointments</p>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total', val: appts.length, bg: '#f0fdf4', color: '#16a34a' },
          { label: 'Completed', val: appts.filter(a => a.status === 'Completed').length, bg: '#d1fae5', color: '#16a34a' },
          { label: 'Pending',   val: appts.filter(a => a.status === 'Pending').length,   bg: '#fef9c3', color: '#ca8a04' },
          { label: 'Cancelled', val: appts.filter(a => a.status === 'Cancelled').length, bg: '#fee2e2', color: '#dc2626' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '12px 20px', textAlign: 'center', minWidth: 90 }}>
            <p style={{ fontSize: 22, fontWeight: 900, color: s.color, margin: 0 }}>{s.val}</p>
            <p style={{ fontSize: 11, color: s.color, fontWeight: 600, margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['#', 'Patient', 'Service', 'Date', 'Time', 'Fee', 'Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 12, color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #f3f4f6' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: 60, textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <Loader2 className="animate-spin" size={24} color="#0d9488" />
                  <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Fetching Service Appointments...</span>
                </div>
              </td></tr>
            ) : error ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#dc2626' }}>{error}</td></tr>
            ) : appts.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>No service appointments found</td></tr>
            ) : appts.map((a, i) => {
              const status = a.status || 'Pending';
              const sColor = sc[status] || sc.Pending;
              return (
                <tr key={a._id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#9ca3af' }}>{i + 1}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{a.patient?.name || 'User'}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{a.service?.name}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{a.date}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{a.time}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600 }}>₹{a.fee}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: sColor.bg, color: sColor.color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{status}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {status === 'Pending' ? (
                        <>
                          <button onClick={() => changeStatus(a._id, 'Completed')} style={{ background: '#d1fae5', border: 'none', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', color: '#16a34a', display: 'flex', alignItems: 'center' }}>
                            <CheckCircle2 size={14} />
                          </button>
                          <button onClick={() => changeStatus(a._id, 'Cancelled')} style={{ background: '#fee2e2', border: 'none', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}>
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
