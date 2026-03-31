import { useState, useEffect } from 'react';
import { Trash2, Edit2, List, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export default function ListServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/services`, { withCredentials: true });
      if (data.success) {
        setServices(data.services);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const remove = async (id) => {
    if (window.confirm('Delete this service?')) {
      try {
        const { data } = await axios.delete(`${API_BASE}/services/${id}`, { withCredentials: true });
        if (data.success) {
          setServices(prev => prev.filter(x => x._id !== id));
        }
      } catch (err) {
        alert(err?.response?.data?.message || 'Failed to delete service');
      }
    }
  };

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#111827', textTransform: 'uppercase', marginBottom: 4 }}>LIST SERVICES</h1>
          <p style={{ color: '#6b7280', fontSize: 13 }}>Manage all medical services</p>
        </div>
        <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 30, padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <List size={14} color="#16a34a" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>{services.length} Services</span>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['#', 'Service Name', 'About', 'Price', 'Slots', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #f3f4f6' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: 60, textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <Loader2 className="animate-spin" size={24} color="#16a34a" />
                  <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Fetching services...</span>
                </div>
              </td></tr>
            ) : error ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#dc2626', fontSize: 14 }}>{error}</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>No services registered</td></tr>
            ) : services.map((s, i) => (
              <tr key={s._id} style={{ borderTop: '1px solid #f3f4f6' }}>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#9ca3af' }}>{i + 1}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#111827' }}>{s.name}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{s.about || 'General'}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#111827' }}>₹{s.price}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{s.slots?.length || 0} slots</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: s.available ? '#d1fae5' : '#fee2e2', color: s.available ? '#16a34a' : '#dc2626', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                    {s.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ background: '#eff6ff', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
                      <Edit2 size={13} /> Edit
                    </button>
                    <button onClick={() => remove(s._id)} style={{ background: '#fef2f2', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
