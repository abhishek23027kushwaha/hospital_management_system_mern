import { useState } from 'react';
import { CalendarCheck, Search, CheckCircle2, XCircle } from 'lucide-react';

const SAMPLE = [
  { id: 1, patient: 'Harshit Jaiswal',    doctor: 'Dr. Aisha Patel',  date: '22 Jan 2026', time: '10:00 AM', fee: 1200, status: 'Completed' },
  { id: 2, patient: 'Priya Singh',         doctor: 'Dr. Rahul Verma', date: '22 Jan 2026', time: '11:30 AM', fee: 1500, status: 'Pending'   },
  { id: 3, patient: 'Mohit Sharma',        doctor: 'Dr. Priya Sharma', date: '21 Jan 2026', time: '3:00 PM',  fee: 800,  status: 'Cancelled' },
  { id: 4, patient: 'Suman Yadav',         doctor: 'Dr. Suresh Kumar', date: '20 Jan 2026', time: '9:00 AM',  fee: 1000, status: 'Pending'   },
];

const statusColor = {
  Completed: { bg: '#d1fae5', color: '#16a34a' },
  Pending:   { bg: '#fef9c3', color: '#ca8a04' },
  Cancelled: { bg: '#fee2e2', color: '#dc2626' },
};

export default function Appointments() {
  const [appointments, setAppointments] = useState(SAMPLE);
  const [search, setSearch] = useState('');

  const filtered = appointments.filter(a =>
    a.patient.toLowerCase().includes(search.toLowerCase()) ||
    a.doctor.toLowerCase().includes(search.toLowerCase())
  );

  const changeStatus = (id, status) =>
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: '#111827', textTransform: 'uppercase', marginBottom: 4 }}>APPOINTMENTS</h1>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 24 }}>Manage all patient appointments</p>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total', val: appointments.length, bg: '#f0fdf4', color: '#16a34a' },
          { label: 'Completed', val: appointments.filter(a => a.status === 'Completed').length, bg: '#d1fae5', color: '#16a34a' },
          { label: 'Pending',   val: appointments.filter(a => a.status === 'Pending').length,   bg: '#fef9c3', color: '#ca8a04' },
          { label: 'Cancelled', val: appointments.filter(a => a.status === 'Cancelled').length, bg: '#fee2e2', color: '#dc2626' },
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
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>No appointments found</td></tr>
            ) : filtered.map((a, i) => {
              const sc = statusColor[a.status];
              return (
                <tr key={a.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#9ca3af' }}>{i + 1}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{a.patient}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{a.doctor}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{a.date}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{a.time}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600 }}>₹{a.fee}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: sc.bg, color: sc.color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{a.status}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => changeStatus(a.id, 'Completed')} style={{ background: '#d1fae5', border: 'none', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', color: '#16a34a', display: 'flex', alignItems: 'center' }}>
                        <CheckCircle2 size={14} />
                      </button>
                      <button onClick={() => changeStatus(a.id, 'Cancelled')} style={{ background: '#fee2e2', border: 'none', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}>
                        <XCircle size={14} />
                      </button>
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
