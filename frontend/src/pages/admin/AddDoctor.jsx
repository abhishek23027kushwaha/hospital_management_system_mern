import { useState } from 'react';
import { UserPlus, Upload } from 'lucide-react';

const specializations = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist',
  'Orthopedic', 'Pediatrician', 'Psychiatrist', 'Gynecologist',
  'Oncologist', 'ENT Specialist', 'Ophthalmologist', 'Urologist',
];

export default function AddDoctor() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', specialization: '',
    experience: '', fee: '', about: '', available: true,
  });
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) { setImg(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Doctor added successfully! (Connect with backend API)');
  };

  const inp = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1.5px solid #d1fae5', fontSize: 14, outline: 'none',
    fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box',
    color: '#111827',
  };

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Inter','Segoe UI',sans-serif", maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: '#111827', textTransform: 'uppercase', marginBottom: 4 }}>ADD DOCTOR</h1>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 28 }}>Fill in the details below to register a new doctor</p>

      <form onSubmit={handleSubmit}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e5e7eb', padding: 28, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>

          {/* Image Upload */}
          <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
            <label htmlFor="doc-img" style={{ cursor: 'pointer' }}>
              <div style={{
                width: 96, height: 96, borderRadius: 16, border: '2px dashed #bbf7d0',
                background: '#f0fdf4', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
              }}>
                {preview
                  ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <><Upload size={22} color="#16a34a" /><span style={{ fontSize: 10, color: '#16a34a', marginTop: 4, fontWeight: 600 }}>Upload Photo</span></>
                }
              </div>
            </label>
            <input id="doc-img" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImg} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#374151' }}>Doctor Profile Photo</p>
              <p style={{ fontSize: 12, color: '#9ca3af' }}>Click to upload (JPG, PNG, WEBP)</p>
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
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={inp} required />
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
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Experience (years)</label>
              <input name="experience" type="number" value={form.experience} onChange={handleChange} placeholder="5" style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Consultation Fee (₹) *</label>
              <input name="fee" type="number" value={form.fee} onChange={handleChange} placeholder="500" style={inp} required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Availability</label>
              <select name="available" value={form.available} onChange={handleChange} style={inp}>
                <option value={true}>Available</option>
                <option value={false}>Not Available</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>About the Doctor</label>
            <textarea name="about" value={form.about} onChange={handleChange}
              placeholder="Brief description about the doctor's expertise and background..."
              rows={4}
              style={{ ...inp, resize: 'vertical' }}
            />
          </div>

          <button type="submit" style={{
            marginTop: 24, background: '#16a34a', color: '#fff',
            border: 'none', borderRadius: 12, padding: '12px 32px',
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
          }}>
            <UserPlus size={16} /> Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
}
