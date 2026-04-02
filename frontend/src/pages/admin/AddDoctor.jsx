import { useState } from 'react';
import { UserPlus, Upload, CheckCircle, AlertCircle, Loader, Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:8000/api';

const specializations = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist',
  'Orthopedic', 'Pediatrician', 'Psychiatrist', 'Gynecologist',
  'Oncologist', 'ENT Specialist', 'Ophthalmologist', 'Urologist',
];

export default function AddDoctor() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    specialization: '', experience: '', fee: '', about: '', available: 'true',
    qualifications: '', location: '', patients: '', success: '', rating: '5',
  });
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Slots state
  const [slots, setSlots] = useState([]);
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
    setError(''); setSuccess('');
  };

  const addSlot = () => {
    if (!slotDate) {
      alert('Please select a date');
      return;
    }
    const time = `${slotHour}:${slotMin} ${slotPeriod}`;
    
    // Format date nicely (e.g., "2 Apr 2026")
    const d = new Date(slotDate);
    const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    // Check if slot already exists
    if (slots.some(s => s.date === dateStr && s.time === time)) {
      alert('Slot already added');
      return;
    }

    setSlots(prev => [...prev, { date: dateStr, time, isBooked: false }]);
  };

  const removeSlot = (index) => {
    setSlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (img) fd.append('image', img);
      
      // Add slots as JSON string
      fd.append('slots', JSON.stringify(slots));

      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API}/admin/doctors`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setSuccess(`✅ Dr. ${data.doctor.name} added successfully!`);
        setForm({ name: '', email: '', password: '', phone: '', specialization: '', experience: '', fee: '', about: '', available: 'true' });
        setImg(null); setPreview(null);
        setSlots([]); // Clear slots
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1.5px solid #d1fae5', fontSize: 14, outline: 'none',
    fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box', color: '#111827',
  };

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Inter','Segoe UI',sans-serif", maxWidth: 780, margin: '0 auto' }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: '#111827', textTransform: 'uppercase', marginBottom: 4 }}>ADD DOCTOR</h1>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 28 }}>Fill in the details below to register a new doctor</p>

      {/* Alerts */}
      {success && (
        <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, color: '#15803d', fontSize: 14, fontWeight: 600 }}>
          <CheckCircle size={18} /> {success}
        </div>
      )}
      {error && (
        <div style={{ background: '#fff1f2', border: '1.5px solid #fca5a5', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, color: '#dc2626', fontSize: 14, fontWeight: 600 }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e5e7eb', padding: 28, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>

          {/* Image Upload */}
          <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
            <label htmlFor="doc-img" style={{ cursor: 'pointer' }}>
              <div style={{
                width: 100, height: 100, borderRadius: 16, border: '2px dashed #bbf7d0',
                background: '#f0fdf4', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}>
                {preview
                  ? <img src={preview} alt="Doctor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <><Upload size={24} color="#16a34a" /><span style={{ fontSize: 10, color: '#16a34a', marginTop: 5, fontWeight: 600 }}>Upload Photo</span></>
                }
              </div>
            </label>
            <input id="doc-img" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImg} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#374151', margin: 0 }}>Doctor Profile Photo</p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0' }}>Click to upload · JPG, PNG, WEBP · Max 5 MB</p>
              {preview && <p style={{ fontSize: 11, color: '#16a34a', marginTop: 4 }}>✓ Image selected — will be uploaded to Cloudinary</p>}
            </div>
          </div>

          {/* Form Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Dr. John Smith" style={inp} required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="doctor@medicare.com" style={inp} required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Password *</label>
              <input name="password" type="text" value={form.password} onChange={handleChange} placeholder="Assign a password" style={inp} required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Specialization *</label>
              <select name="specialization" value={form.specialization} onChange={handleChange} style={inp} required>
                <option value="">Select Specialization</option>
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Experience (years) *</label>
              <input name="experience" type="number" value={form.experience} onChange={handleChange} placeholder="5" style={inp} min="0" required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Consultation Fee (₹) *</label>
              <input name="fee" type="number" value={form.fee} onChange={handleChange} placeholder="500" style={inp} min="0" required />
            </div>
             <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Qualifications</label>
              <input name="qualifications" value={form.qualifications} onChange={handleChange} placeholder="MBBS, MD" style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="Mumbai, India" style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Success Rate (%)</label>
              <input name="success" type="number" value={form.success} onChange={handleChange} placeholder="95" style={inp} min="0" max="100" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Patients Count</label>
              <input name="patients" value={form.patients} onChange={handleChange} placeholder="500+" style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Rating (1-5)</label>
              <input name="rating" type="number" value={form.rating} onChange={handleChange} placeholder="5" style={inp} min="1" max="5" step="0.1" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Availability</label>
              <select name="available" value={form.available} onChange={handleChange} style={inp}>
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>
          </div>

          {/* About */}
          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>About the Doctor *</label>
            <textarea name="about" value={form.about} onChange={handleChange}
              placeholder="Brief description about the doctor's expertise and background..."
              rows={4} required
              style={{ ...inp, resize: 'vertical' }}
            />
          </div>

          {/* Add Schedule Slots */}
          <div style={{ marginTop: 24, background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Calendar size={20} color="#16a34a" />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#16a34a', margin: 0 }}>Add Schedule Slots</h3>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: 150 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Date</label>
                <input type="date" value={slotDate} onChange={e => setSlotDate(e.target.value)} style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Hour</label>
                <select value={slotHour} onChange={e => setSlotHour(e.target.value)} style={{ ...inp, width: 70 }}>
                  {[...Array(12)].map((_, i) => <option key={i} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Min</label>
                <select value={slotMin} onChange={e => setSlotMin(e.target.value)} style={{ ...inp, width: 70 }}>
                  {['00', '15', '30', '45'].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Period</label>
                <select value={slotPeriod} onChange={e => setSlotPeriod(e.target.value)} style={{ ...inp, width: 70 }}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              <button type="button" onClick={addSlot} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 30, padding: '10px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, height: 42 }}>
                <Plus size={16} /> Add Slot
              </button>
            </div>

            {/* List of Added Slots */}
            {slots.length > 0 && (
              <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {slots.map((s, idx) => (
                  <div key={idx} style={{ background: '#fff', border: '1px solid #d1fae5', borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{s.date} — {s.time}</span>
                    <button type="button" onClick={() => removeSlot(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', padding: 2, display: 'flex' }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = '#fca5a5'}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} style={{
            marginTop: 24, background: loading ? '#86efac' : '#16a34a', color: '#fff',
            border: 'none', borderRadius: 12, padding: '12px 32px',
            fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 2px 8px rgba(22,163,74,0.3)', transition: 'background 0.2s',
          }}>
            {loading
              ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Adding Doctor…</>
              : <><UserPlus size={16} /> Add Doctor to Team</>
            }
          </button>
        </div>
      </form>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
