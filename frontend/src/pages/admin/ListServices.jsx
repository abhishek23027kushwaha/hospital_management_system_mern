import { useState } from 'react';
import { Trash2, Edit2, List } from 'lucide-react';

const SAMPLE = [
  { id: 1, name: 'Blood Test',   category: 'Lab',       price: 300, duration: 20, active: true },
  { id: 2, name: 'X-Ray',        category: 'Radiology', price: 500, duration: 30, active: true },
  { id: 3, name: 'ECG',          category: 'Cardiology', price: 400, duration: 25, active: false },
  { id: 4, name: 'MRI Scan',     category: 'Radiology', price: 3000, duration: 60, active: true },
  { id: 5, name: 'Dental Check', category: 'Dental',    price: 600, duration: 40, active: true },
];

export default function ListServices() {
  const [services, setServices] = useState(SAMPLE);
  const remove = id => { if (window.confirm('Delete this service?')) setServices(s => s.filter(x => x.id !== id)); };

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
              {['#', 'Service Name', 'Category', 'Price', 'Duration', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #f3f4f6' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              <tr key={s.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#9ca3af' }}>{i + 1}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#111827' }}>{s.name}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{s.category}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#111827' }}>₹{s.price}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{s.duration} min</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: s.active ? '#d1fae5' : '#fee2e2', color: s.active ? '#16a34a' : '#dc2626', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                    {s.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ background: '#eff6ff', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
                      <Edit2 size={13} /> Edit
                    </button>
                    <button onClick={() => remove(s.id)} style={{ background: '#fef2f2', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
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
