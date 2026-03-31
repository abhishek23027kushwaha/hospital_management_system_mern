import { useState } from 'react';
import { ImageIcon, Plus, CalendarCheck, CheckCircle2 } from 'lucide-react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const HOURS   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

const now = new Date();

export default function AddService() {
  const [image, setImage]           = useState(null);
  const [preview, setPreview]       = useState(null);
  const [name, setName]             = useState('');
  const [price, setPrice]           = useState('');
  const [available, setAvailable]   = useState('Available');
  const [about, setAbout]           = useState('');
  const [instructions, setInstructions] = useState(['']);
  const [slots, setSlots]           = useState([]);
  const [slot, setSlot]             = useState({
    day:    String(now.getDate()).padStart(2, '0'),
    month:  MONTHS[now.getMonth()],
    year:   String(now.getFullYear()),
    hour:   '11',
    minute: '00',
    ampm:   'AM',
  });

  /* ── handlers ── */
  const handleImg = e => {
    const f = e.target.files[0];
    if (f) { setImage(f); setPreview(URL.createObjectURL(f)); }
  };

  const addInstruction = () => setInstructions(p => [...p, '']);
  const updateInstruction = (i, val) => setInstructions(p => p.map((x, idx) => idx === i ? val : x));

  const addSlot = () => {
    const label = `${slot.day} ${slot.month} ${slot.year}, ${slot.hour}:${slot.minute} ${slot.ampm}`;
    setSlots(p => [...p, label]);
  };

  const reset = () => {
    setImage(null); setPreview(null); setName(''); setPrice('');
    setAvailable('Available'); setAbout(''); setInstructions(['']); setSlots([]);
  };

  const handleSubmit = () => {
    if (!image) return alert('Please upload a service image');
    if (!name)  return alert('Please enter a service name');
    alert('Service saved! (Connect with backend API)');
  };

  /* ── shared input style ── */
  const inp = {
    width: '100%', padding: '11px 16px', borderRadius: 30,
    border: '1.5px solid #d1fae5', fontSize: 14, outline: 'none',
    fontFamily: 'inherit', background: '#fff', color: '#111827',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      padding: '28px 32px', fontFamily: "'Inter','Segoe UI',sans-serif",
      background: '#f0fdf4', minHeight: '100vh',
    }}>
      {/* ── Card ── */}
      <div style={{ background: '#fff', borderRadius: 20, padding: '32px 36px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', maxWidth: 900, margin: '0 auto' }}>

        {/* ── Top Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0d9488', margin: 0 }}>Add Service</h1>
            <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Create a beautiful service card with unique time slots</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={reset} style={{
              padding: '9px 22px', borderRadius: 30, border: '1.5px solid #d1d5db',
              background: '#fff', color: '#374151', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>Reset</button>
            <button onClick={handleSubmit} style={{
              padding: '9px 22px', borderRadius: 30, border: 'none',
              background: '#0d9488', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <CheckCircle2 size={15} /> Save Service
            </button>
          </div>
        </div>

        {/* ── Two-col layout ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28 }}>

          {/* ── Left: Image Upload ── */}
          <div>
            <label htmlFor="svc-img" style={{ cursor: 'pointer' }}>
              <div style={{
                border: '2px dashed #a7f3d0', borderRadius: 16, background: '#f0fdf4',
                height: 220, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                marginBottom: 12,
              }}>
                {preview
                  ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <>
                      <ImageIcon size={44} color="#0d9488" strokeWidth={1.5} />
                      <p style={{ color: '#0d9488', fontSize: 13, fontWeight: 600, marginTop: 10 }}>Service image (required)</p>
                    </>
                }
              </div>
            </label>
            <input id="svc-img" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImg} />
            <label htmlFor="svc-img">
              <div style={{
                border: '1.5px solid #d1fae5', borderRadius: 30, padding: '10px 0',
                textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#374151',
                cursor: 'pointer', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Plus size={14} /> Upload Image
              </div>
            </label>
          </div>

          {/* ── Right: Form Fields ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Service Name + Price */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Service name</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. General Consultation" style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Price</label>
                <input value={price} onChange={e => setPrice(e.target.value)}
                  placeholder="₹ 499" type="number" style={inp} />
              </div>
            </div>

            {/* Availability */}
            <div style={{ maxWidth: '50%' }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Availability</label>
              <select value={available} onChange={e => setAvailable(e.target.value)} style={inp}>
                <option>Available</option>
                <option>Not Available</option>
              </select>
            </div>

            {/* About */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0d9488', display: 'block', marginBottom: 8 }}>About this service</label>
              <textarea value={about} onChange={e => setAbout(e.target.value)}
                placeholder="Short description" rows={4}
                style={{ ...inp, borderRadius: 14, resize: 'vertical' }}
              />
            </div>

            {/* Instructions */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#0d9488' }}>Instructions (point wise)</label>
                <button onClick={addInstruction} style={{
                  border: '1.5px solid #d1fae5', borderRadius: 20, background: '#fff',
                  padding: '5px 14px', fontSize: 13, fontWeight: 600, color: '#374151',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <Plus size={12} /> Add
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {instructions.map((inst, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0d9488', minWidth: 20 }}>{i + 1}.</span>
                    <input
                      value={inst}
                      onChange={e => updateInstruction(i, e.target.value)}
                      placeholder={`Instruction ${i + 1}`}
                      style={{ ...inp, flex: 1, borderRadius: 30 }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Slots & Schedule */}
            <div style={{ border: '1.5px solid #d1fae5', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CalendarCheck size={16} color="#0d9488" />
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>Slots &amp; Schedule</span>
                </div>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>{slots.length} slots added</span>
              </div>

              {/* Date/Time row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 0.8fr 0.8fr 0.8fr', gap: 10, marginBottom: 14 }}>
                {[
                  { label: 'Day',    val: slot.day,    key: 'day',    type: 'number', min: 1, max: 31 },
                  { label: 'Month',  val: slot.month,  key: 'month',  isSelect: true, opts: MONTHS },
                  { label: 'Year',   val: slot.year,   key: 'year',   type: 'number' },
                  { label: 'Hour',   val: slot.hour,   key: 'hour',   isSelect: true, opts: HOURS },
                  { label: 'Minute', val: slot.minute, key: 'minute', isSelect: true, opts: MINUTES },
                  { label: 'AM/PM',  val: slot.ampm,   key: 'ampm',   isSelect: true, opts: ['AM', 'PM'] },
                ].map(({ label, val, key, type, isSelect, opts, min, max }) => (
                  <div key={key}>
                    <p style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, marginBottom: 5 }}>{label}</p>
                    {isSelect
                      ? <select value={val} onChange={e => setSlot(s => ({ ...s, [key]: e.target.value }))}
                          style={{ ...inp, borderRadius: 10, padding: '9px 8px', fontSize: 13 }}>
                          {opts.map(o => <option key={o}>{o}</option>)}
                        </select>
                      : <input type={type || 'text'} value={val} min={min} max={max}
                          onChange={e => setSlot(s => ({ ...s, [key]: e.target.value }))}
                          style={{ ...inp, borderRadius: 10, padding: '9px 8px', fontSize: 13 }} />
                    }
                  </div>
                ))}
              </div>

              {/* Add slot button */}
              <button onClick={addSlot} style={{
                width: '100%', background: '#0d9488', color: '#fff',
                border: 'none', borderRadius: 30, padding: '13px 0',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginBottom: 12,
              }}>
                <Plus size={15} /> Add This Time Slot
              </button>

              {/* Added slots list */}
              <p style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, marginBottom: 6 }}>Added Slots ({slots.length})</p>
              {slots.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {slots.map((s, i) => (
                    <span key={i} style={{
                      background: '#f0fdf4', border: '1.5px solid #bbf7d0',
                      borderRadius: 20, padding: '4px 12px',
                      fontSize: 12, color: '#0d9488', fontWeight: 600,
                    }}>{s}</span>
                  ))}
                </div>
              )}
            </div>

          </div>{/* end right col */}
        </div>{/* end grid */}
      </div>{/* end card */}
    </div>
  );
}
