import { useState, useEffect } from 'react';
import { Search, Trash2, Edit2, Users, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export default function ListDoctors() {
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/admin/doctors`, { withCredentials: true });
      if (data.success) {
        setDoctors(data.doctors);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const remove = async (id) => {
    if (window.confirm('Remove this doctor?')) {
      try {
        const { data } = await axios.delete(`${API_BASE}/admin/doctors/${id}`, { withCredentials: true });
        if (data.success) {
          setDoctors(prev => prev.filter(x => x._id !== id));
        }
      } catch (err) {
        alert(err?.response?.data?.message || 'Failed to delete doctor');
      }
    }
  };

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#111827', textTransform: 'uppercase', marginBottom: 4 }}>LIST DOCTORS</h1>
          <p style={{ color: '#6b7280', fontSize: 13 }}>Manage all registered doctors</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 30, padding: '4px 8px 4px 14px' }}>
          <Users size={14} color="#16a34a" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>{doctors.length} Doctors</span>
        </div>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1.5px solid #d1fae5', borderRadius: 30, padding: '9px 16px', flex: 1, maxWidth: 320 }}>
          <Search size={14} color="#9ca3af" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or specialization"
            style={{ border: 'none', outline: 'none', fontSize: 13, color: '#374151', background: 'transparent', width: '100%' }} />
        </div>
        {search && <button onClick={() => setSearch('')} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 30, padding: '9px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Clear</button>}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['#', 'Doctor', 'Specialization', 'Experience', 'Fee', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #f3f4f6' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: 60, textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <Loader2 className="animate-spin" size={24} color="#16a34a" />
                  <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Initializing system...</span>
                </div>
              </td></tr>
            ) : error ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#dc2626', fontSize: 14 }}>{error}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>No doctors found</td></tr>
            ) : filtered.map((doc, i) => (
              <tr key={doc._id} style={{ borderTop: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#9ca3af' }}>{i + 1}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0fdf4', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#16a34a' }}>
                      {doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{doc.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{doc.specialization}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{doc.experience} yrs</td>
                <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#111827' }}>₹{doc.fee}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: doc.available ? '#d1fae5' : '#fee2e2', color: doc.available ? '#16a34a' : '#dc2626', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                    {doc.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ background: '#eff6ff', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
                      <Edit2 size={13} /> Edit
                    </button>
                    <button onClick={() => remove(doc._id)} style={{ background: '#fef2f2', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
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
