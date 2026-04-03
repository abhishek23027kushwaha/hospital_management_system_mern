import { useState, useEffect } from 'react';
import { Trash2, Edit2, List, Loader2, X, Plus, CalendarCheck, ImageIcon, CheckCircle2 } from 'lucide-react';
import axios from '../../utils/axiosInstance';



const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const HOURS   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

const now = new Date();

export default function ListServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [winWidth, setWinWidth] = useState(window.innerWidth);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/services`);
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
    const handleResize = () => setWinWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const remove = async (id) => {
    if (window.confirm('Delete this service?')) {
      try {
        const { data } = await axios.delete(`/services/${id}`);
        if (data.success) {
          setServices(prev => prev.filter(x => x._id !== id));
        }
      } catch (err) {
        alert(err?.response?.data?.message || 'Failed to delete service');
      }
    }
  };

  const isMobile = winWidth < 768;

  return (
    <div style={{ padding: isMobile ? '16px' : '28px 32px', fontFamily: "'Inter','Segoe UI',sans-serif", maxWidth: '100vw', overflowX: 'hidden' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        marginBottom: 24,
        gap: 16
      }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 900, color: '#111827', textTransform: 'uppercase', marginBottom: 4 }}>LIST SERVICES</h1>
          <p style={{ color: '#6b7280', fontSize: 13 }}>Manage all medical services</p>
        </div>
        <div style={{ 
          background: '#f0fdf4', 
          border: '1.5px solid #bbf7d0', 
          borderRadius: 30, 
          padding: '6px 16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 6,
          alignSelf: isMobile ? 'flex-start' : 'auto'
        }}>
          <List size={14} color="#16a34a" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>{services.length} Services</span>
        </div>
      </div>

      <div style={{ 
        background: '#fff', 
        borderRadius: 16, 
        border: '1.5px solid #e5e7eb', 
        overflowX: 'auto', 
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        width: '100%'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 600 : 'auto' }}>
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
                    <button 
                      onClick={() => setEditingService(s)}
                      style={{ background: '#eff6ff', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}
                    >
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

      {editingService && (
        <EditServiceModal 
          service={editingService} 
          onClose={() => setEditingService(null)} 
          onUpdate={fetchServices} 
          winWidth={winWidth}
        />
      )}
    </div>
  );
}

function EditServiceModal({ service, onClose, onUpdate, winWidth }) {
  const [image, setImage]           = useState(null);
  const [preview, setPreview]       = useState(service.image || null);
  const [name, setName]             = useState(service.name || '');
  const [price, setPrice]           = useState(service.price || '');
  const [available, setAvailable]   = useState(service.available ? 'Available' : 'Not Available');
  const [about, setAbout]           = useState(service.about || '');
  const [instructions, setInstructions] = useState(service.instructions || ['']);
  const [slots, setSlots]           = useState(service.slots?.map(s => `${s.date}, ${s.time}`) || []);
  const [slot, setSlot]             = useState({
    day:    String(now.getDate()).padStart(2, '0'),
    month:  MONTHS[now.getMonth()],
    year:   String(now.getFullYear()),
    hour:   '11',
    minute: '00',
    ampm:   'AM',
  });
  const [loading, setLoading] = useState(false);

  const isMobile = winWidth < 768;

  const handleImg = e => {
    const f = e.target.files[0];
    if (f) { setImage(f); setPreview(URL.createObjectURL(f)); }
  };

  const addInstruction = () => setInstructions(p => [...p, '']);
  const updateInstruction = (i, val) => setInstructions(p => p.map((x, idx) => idx === i ? val : x));
  const removeInstruction = (i) => setInstructions(p => p.filter((_, idx) => idx !== i));

  const addSlot = () => {
    const label = `${slot.day} ${slot.month} ${slot.year}, ${slot.hour}:${slot.minute} ${slot.ampm}`;
    setSlots(p => [...p, label]);
  };
  const removeSlot = (i) => setSlots(p => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price)  return alert('Please enter service name and price');

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('available', available);
      formData.append('about', about);
      if (image) formData.append('image', image);
      formData.append('instructions', JSON.stringify(instructions));
      formData.append('slots', JSON.stringify(slots));

      const { data } = await axios.put(`${API_BASE}/services/${service._id}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        alert('Service updated successfully!');
        onUpdate();
        onClose();
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update service');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '10px 16px', borderRadius: 30,
    border: '1.5px solid #d1fae5', fontSize: 13, outline: 'none',
    fontFamily: 'inherit', background: '#fff', color: '#111827',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: 'rgba(0,0,0,0.6)', 
      display: 'flex', 
      alignItems: isMobile ? 'flex-end' : 'center', 
      justifyContent: 'center', 
      zIndex: 1000, 
      padding: isMobile ? 0 : 20 
    }}>
      <div style={{ 
        background: '#fff', 
        borderRadius: isMobile ? '24px 24px 0 0' : 20, 
        width: '100%', 
        maxWidth: 850, 
        maxHeight: isMobile ? '95vh' : '90vh', 
        overflowY: 'auto', 
        position: 'relative', 
        padding: isMobile ? '24px 20px' : '32px 36px',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.1)'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', right: 20, top: 20, border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}>
          <X size={20} />
        </button>

        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0d9488', margin: 0 }}>Edit Service</h2>
          <p style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Update the details for "{service.name}"</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '220px 1fr', gap: 24 }}>
          {/* Left: Image */}
          <div>
            <label htmlFor="edit-svc-img" style={{ cursor: 'pointer' }}>
              <div style={{ border: '2px dashed #a7f3d0', borderRadius: 16, background: '#f0fdf4', height: isMobile ? 180 : 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 12 }}>
                {preview ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={40} color="#0d9488" />}
              </div>
            </label>
            <input id="edit-svc-img" type="file" style={{ display: 'none' }} onChange={handleImg} />
            <label htmlFor="edit-svc-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: '1.5px solid #d1fae5', borderRadius: 30, padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'pointer', background: '#fff' }}>
              <Plus size={12} /> Change Image
            </label>
          </div>

          {/* Right: Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Service Name</label>
                <input value={name} onChange={e => setName(e.target.value)} style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Price</label>
                <input value={price} onChange={e => setPrice(e.target.value)} type="number" style={inp} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Availability</label>
              <select value={available} onChange={e => setAvailable(e.target.value)} style={inp}>
                <option>Available</option>
                <option>Not Available</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#0d9488', display: 'block', marginBottom: 6 }}>About</label>
              <textarea value={about} onChange={e => setAbout(e.target.value)} rows={3} style={{ ...inp, borderRadius: 12, resize: 'none' }} />
            </div>

            {/* Instructions */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#0d9488' }}>Instructions</label>
                <button onClick={addInstruction} style={{ border: '1px solid #d1fae5', borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>+ Add</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {instructions.map((ins, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input value={ins} onChange={e => updateInstruction(i, e.target.value)} style={{ ...inp, flex: 1 }} />
                    <X size={14} color="#dc2626" cursor="pointer" onClick={() => removeInstruction(i)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Slots */}
            <div style={{ border: '1.5px solid #d1fae5', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <CalendarCheck size={14} color="#0d9488" />
                <span style={{ fontWeight: 700, fontSize: 13 }}>Schedule Slots</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 1fr) repeat(3, 0.8fr)', gap: 8, marginBottom: 12 }}>
                {['day','month','year','hour','minute','ampm'].map(k => (
                  <div key={k}>
                    <p style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, marginBottom: 4 }}>{k.toUpperCase()}</p>
                    {k === 'month' || k === 'hour' || k === 'minute' || k === 'ampm' ? (
                      <select value={slot[k]} onChange={e => setSlot(s => ({...s, [k]: e.target.value}))} style={{ ...inp, borderRadius: 8, padding: '8px 4px', fontSize: 11 }}>
                        {(k==='month' ? MONTHS : k==='hour' ? HOURS : k==='minute' ? MINUTES : ['AM','PM']).map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input value={slot[k]} onChange={e => setSlot(s => ({...s, [k]: e.target.value}))} type={k==='year' ? 'number' : 'text'} style={{ ...inp, borderRadius: 8, padding: '8px 4px', fontSize: 11 }} />
                    )}
                  </div>
                ))}
              </div>
              <button onClick={addSlot} style={{ width: '100%', background: '#0d9488', color: '#fff', border: 'none', borderRadius: 30, padding: '12px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>Add This Slot</button>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {slots.map((s, i) => (
                  <span key={i} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: '#0d9488', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {s} <X size={10} cursor="pointer" onClick={() => removeSlot(i)} />
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', gap: 12, marginTop: 8 }}>
              <button onClick={onClose} style={{ flex: 1, padding: '12px 0', borderRadius: 30, border: '1.5px solid #d1d5db', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '12px 0', borderRadius: 30, border: 'none', background: '#0d9488', color: '#fff', fontWeight: 700, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {loading ? 'Updating...' : 'Update Service'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
