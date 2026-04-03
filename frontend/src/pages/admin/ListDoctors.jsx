import { useState, useEffect } from 'react';
import { Search, Trash2, Edit2, Users, Loader2, Eye, EyeOff, X, Upload, Calendar, Plus, Clock, UserPlus } from 'lucide-react';
import axios from '../../utils/axiosInstance';



export default function ListDoctors() {
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/admin/doctors`);
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
        const { data } = await axios.delete(`/admin/doctors/${id}`);
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
              {['#', 'Doctor', 'Specialization', 'Experience', 'Fee', 'Email', 'Password', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #f3f4f6' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ padding: 60, textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <Loader2 className="animate-spin" size={24} color="#16a34a" />
                  <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Initializing system...</span>
                </div>
              </td></tr>
            ) : error ? (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: '#dc2626', fontSize: 14 }}>{error}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>No doctors found</td></tr>
            ) : (
              filtered.map((doc, i) => <DoctorRow key={doc._id} doc={doc} index={i} remove={remove} onEdit={() => { setEditingDoctor(doc); setShowEditModal(true); }} />)
            )}
          </tbody>
        </table>
      </div>

      {showEditModal && editingDoctor && (
        <EditDoctorModal 
          doctor={editingDoctor} 
          onClose={() => { setShowEditModal(false); setEditingDoctor(null); }} 
          onUpdate={fetchDoctors}
        />
      )}
    </div>
  );
}

const specializations = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist',
  'Orthopedic', 'Pediatrician', 'Psychiatrist', 'Gynecologist',
  'Oncologist', 'ENT Specialist', 'Ophthalmologist', 'Urologist',
];

function EditDoctorModal({ doctor, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: doctor.name || '',
    email: doctor.email || '',
    phone: doctor.phone || '',
    specialization: doctor.specialization || '',
    experience: doctor.experience || '',
    fee: doctor.fee || '',
    about: doctor.about || '',
    available: doctor.available ? 'true' : 'false',
    qualifications: doctor.qualifications || '',
    location: doctor.location || '',
    patients: doctor.patients || '',
    success: doctor.success || '',
    rating: doctor.rating || '5',
    password: doctor.plainPassword || '',
  });
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(doctor.image || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [slots, setSlots] = useState(doctor.slots || []);
  const [slotDate, setSlotDate] = useState('');
  const [slotHour, setSlotHour] = useState('10');
  const [slotMin, setSlotMin] = useState('00');
  const [slotPeriod, setSlotPeriod] = useState('AM');

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) { setImg(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const addSlot = () => {
    if (!slotDate) return alert('Select date');
    const time = `${slotHour}:${slotMin} ${slotPeriod}`;
    const d = new Date(slotDate);
    const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (slots.some(s => s.date === dateStr && s.time === time)) return alert('Slot exists');
    setSlots(prev => [...prev, { date: dateStr, time, isBooked: false }]);
  };

  const removeSlot = (idx) => setSlots(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (img) fd.append('image', img);
      fd.append('slots', JSON.stringify(slots));

      const { data } = await axios.put(`/admin/doctors/${doctor._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        onUpdate();
        onClose();
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update doctor');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1.5px solid #d1fae5', fontSize: 13, outline: 'none',
    background: '#fff', boxSizing: 'border-box', color: '#111827',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: 800, maxHeight: '90vh', borderRadius: 20, overflowY: 'auto', position: 'relative', padding: 32 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, border: 'none', background: '#f3f4f6', borderRadius: '50%', p: 8, cursor: 'pointer', display: 'flex' }}>
          <X size={20} color="#6b7280" />
        </button>

        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111827', marginBottom: 4 }}>EDIT DOCTOR</h2>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 24 }}>Update information for Dr. {doctor.name}</p>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 20, border: '1px solid #fee2e2' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <label htmlFor="edit-img" style={{ cursor: 'pointer' }}>
              <div style={{ width: 80, height: 80, borderRadius: 12, border: '2px dashed #bbf7d0', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {preview ? <img src={preview} alt="Doc" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Upload size={20} color="#16a34a" />}
              </div>
            </label>
            <input id="edit-img" type="file" onChange={handleImg} style={{ display: 'none' }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#374151', margin: 0 }}>Doctor Profile Photo</p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>Click to change photo</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 5, display: 'block' }}>Name</label><input name="name" value={form.name} onChange={handleChange} style={inp} required /></div>
            <div><label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 5, display: 'block' }}>Email</label><input name="email" value={form.email} onChange={handleChange} style={inp} required /></div>
            <div><label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 5, display: 'block' }}>Password</label><input name="password" value={form.password} onChange={handleChange} style={inp} placeholder="Set new password" /></div>
            <div><label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 5, display: 'block' }}>Phone</label><input name="phone" value={form.phone} onChange={handleChange} style={inp} /></div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 5, display: 'block' }}>Specialization</label>
              <select name="specialization" value={form.specialization} onChange={handleChange} style={inp} required>
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 5, display: 'block' }}>Experience (yrs)</label><input name="experience" type="number" value={form.experience} onChange={handleChange} style={inp} required /></div>
            <div><label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 5, display: 'block' }}>Fee (₹)</label><input name="fee" type="number" value={form.fee} onChange={handleChange} style={inp} required /></div>
            <div><label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 5, display: 'block' }}>Qualifications</label><input name="qualifications" value={form.qualifications} onChange={handleChange} style={inp} /></div>
            <div><label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 5, display: 'block' }}>Location</label><input name="location" value={form.location} onChange={handleChange} style={inp} /></div>
            <div><label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 5, display: 'block' }}>Success Rate (%)</label><input name="success" type="number" value={form.success} onChange={handleChange} style={inp} /></div>
            <div><label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 5, display: 'block' }}>Patients Count</label><input name="patients" value={form.patients} onChange={handleChange} style={inp} /></div>
            <div><label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 5, display: 'block' }}>Rating</label><input name="rating" type="number" step="0.1" value={form.rating} onChange={handleChange} style={inp} /></div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 5, display: 'block' }}>Availability</label>
              <select name="available" value={form.available} onChange={handleChange} style={inp}>
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>
          </div>
          
          <div style={{ marginTop: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 5, display: 'block' }}>About</label>
            <textarea name="about" value={form.about} onChange={handleChange} style={{ ...inp, height: 80, resize: 'none' }} required />
          </div>

          <div style={{ marginTop: 24, background: '#f9fafb', borderRadius: 16, padding: 20, border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Calendar size={18} color="#16a34a" />
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#111827', margin: 0 }}>Schedule Slots</h3>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}><label style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', marginBottom: 4, display: 'block' }}>Date</label><input type="date" value={slotDate} onChange={e => setSlotDate(e.target.value)} style={inp} /></div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', marginBottom: 4, display: 'block' }}>Time</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  <select value={slotHour} onChange={e => setSlotHour(e.target.value)} style={{ ...inp, width: 60 }}>{[...Array(12)].map((_, i) => <option key={i} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>)}</select>
                  <select value={slotMin} onChange={e => setSlotMin(e.target.value)} style={{ ...inp, width: 60 }}>{['00', '15', '30', '45'].map(m => <option key={m} value={m}>{m}</option>)}</select>
                  <select value={slotPeriod} onChange={e => setSlotPeriod(e.target.value)} style={{ ...inp, width: 60 }}><option>AM</option><option>PM</option></select>
                </div>
              </div>
              <button type="button" onClick={addSlot} style={{ background: '#111827', color: '#fff', border: 'none', borderRadius: 10, height: 40, padding: '0 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {slots.map((s, idx) => (
                <div key={idx} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{s.date} {s.time}</span>
                  <X size={12} style={{ cursor: 'pointer', color: '#9ca3af' }} onClick={() => removeSlot(idx)} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <button type="submit" disabled={loading} style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 800, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} style={{ background: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: 12, padding: '14px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DoctorRow({ doc, index, remove, onEdit }) {
  const [showPass, setShowPass] = useState(false);

  return (
    <tr style={{ borderTop: '1px solid #f3f4f6', transition: 'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <td style={{ padding: '14px 16px', fontSize: 13, color: '#9ca3af' }}>{index + 1}</td>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0fdf4', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#16a34a', overflow: 'hidden' }}>
            {doc.image ? <img src={doc.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{doc.name}</span>
        </div>
      </td>
      <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{doc.specialization}</td>
      <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{doc.experience} yrs</td>
      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#111827' }}>₹{doc.fee}</td>
      <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{doc.email}</td>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
          <div style={{ minWidth: 80, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
              {showPass ? (doc.plainPassword || '******') : "••••••••"}
            </span>
            <button onClick={(e) => { e.stopPropagation(); setShowPass(!showPass); }} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 2, display: 'flex', alignItems: 'center' }}>
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
      </td>
      <td style={{ padding: '14px 16px' }}>
        <span style={{ background: doc.available ? '#d1fae5' : '#fee2e2', color: doc.available ? '#16a34a' : '#dc2626', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
          {doc.available ? 'Available' : 'Unavailable'}
        </span>
      </td>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onEdit} style={{ background: '#eff6ff', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
            <Edit2 size={13} /> Edit
          </button>
          <button onClick={() => remove(doc._id)} style={{ background: '#fef2f2', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

