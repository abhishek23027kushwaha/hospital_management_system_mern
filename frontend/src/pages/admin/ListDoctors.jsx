import { useState } from 'react';
import { Search, Trash2, Edit2, Users } from 'lucide-react';

const SAMPLE = [
  { id: 1, name: 'Dr. Aisha Patel',    specialization: 'Cardiologist',   fee: 1200, experience: 8,  available: true },
  { id: 2, name: 'Dr. Rahul Verma',    specialization: 'Neurologist',    fee: 1500, experience: 12, available: true },
  { id: 3, name: 'Dr. Priya Sharma',   specialization: 'Dermatologist',  fee: 800,  experience: 5,  available: false },
  { id: 4, name: 'Dr. Suresh Kumar',   specialization: 'Orthopedic',     fee: 1000, experience: 10, available: true },
];

export default function ListDoctors() {
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState(SAMPLE);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const remove = (id) => {
    if (window.confirm('Remove this doctor?')) setDoctors(d => d.filter(x => x.id !== id));
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
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>No doctors found</td></tr>
            ) : filtered.map((doc, i) => (
              <tr key={doc.id} style={{ borderTop: '1px solid #f3f4f6', transition: 'background 0.15s' }}
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
                    <button onClick={() => remove(doc.id)} style={{ background: '#fef2f2', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
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
