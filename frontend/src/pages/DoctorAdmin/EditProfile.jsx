import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  User, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Users, 
  CheckCircle, 
  Star, 
  IndianRupee, 
  Plus, 
  Trash2, 
  X,
  Clock,
  Calendar,
  Save,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';
const fontStyle = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

const EditProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: '',
    specialization: 'General Physician',
    experience: '0',
    qualifications: '',
    location: '',
    patients: '0',
    success: '100',
    rating: '5',
    fee: '0',
    about: '',
    image: '',
    available: true,
  });

  const [availability, setAvailability] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/doctor/profile`, { withCredentials: true });
      if (data.success) {
        setProfileData({
          ...data.doctor,
          experience: String(data.doctor.experience || 0),
          fee: String(data.doctor.fee || 0),
          rating: String(data.doctor.rating || 5),
        });
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/doctor/slots`, { withCredentials: true });
      if (data.success) {
        // Group slots by date for display
        const grouped = data.slots.reduce((acc, slot) => {
          const date = slot.date;
          if (!acc[date]) acc[date] = { date, slots: [] };
          acc[date].slots.push(slot);
          return acc;
        }, {});
        setAvailability(Object.values(grouped));
      }
    } catch (err) {
      console.error('Failed to fetch slots', err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchSlots();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // We'll upload on save, but show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData(prev => ({ ...prev, imagePreview: reader.result, imageFile: file }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (key === 'imageFile') {
          formData.append('image', profileData[key]);
        } else if (key !== 'imagePreview' && key !== 'image' && key !== 'slots') {
          formData.append(key, profileData[key]);
        }
      });

      const { data } = await axios.put(`${API_BASE}/doctor/profile`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        alert('Profile updated successfully!');
        fetchProfile();
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addSlot = async () => {
    if (!newDate || !newTime) return alert('Please select date and time');
    try {
      // Format date to "22 Mar 2026" or similar if needed, 
      // but let's just send the raw date string for now
      const dateObj = new Date(newDate);
      const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      
      const { data } = await axios.post(`${API_BASE}/doctor/slots`, 
        { date: formattedDate, time: newTime }, 
        { withCredentials: true }
      );
      if (data.success) {
        setNewTime('');
        fetchSlots();
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to add slot');
    }
  };

  const removeSlot = async (slotId) => {
    try {
      const { data } = await axios.delete(`${API_BASE}/doctor/slots/${slotId}`, { withCredentials: true });
      if (data.success) {
        fetchSlots();
      }
    } catch (err) {
      alert('Failed to remove slot');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" style={fontStyle}>
        <Loader2 className="animate-spin text-teal-600" size={40} />
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20" style={fontStyle}>
      {/* ── Hero Section ── */}
      <div className="relative mb-12">
        {/* Banner */}
        <div className="h-48 w-full bg-[#0d9488] rounded-3xl shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-transparent"></div>
        </div>

        {/* Profile Card Overlay */}
        <div className="mt-[-80px] px-8">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-teal-50 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-36 h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-teal-50">
                  <img 
                    src={profileData.imagePreview || profileData.image || "https://via.placeholder.com/150"} 
                    alt="Doctor" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-1 right-1 p-2.5 bg-white rounded-full shadow-lg border border-teal-100 text-teal-600 hover:bg-teal-50 transition-all cursor-pointer">
                  <Camera size={18} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>

              {/* Basic Info */}
              <div className="text-center md:text-left pb-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{profileData.name || 'Set Name'}</h1>
                <p className="flex items-center justify-center md:justify-start gap-1.5 text-teal-600 font-semibold text-sm mt-1">
                  <Briefcase size={14} />
                  {profileData.specialization} : <span className="text-gray-400 font-medium">{profileData.location || 'Location Not Set'}</span>
                </p>

                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                  <div className="px-3 py-1.5 bg-teal-50 rounded-full border border-teal-100 flex items-center gap-1.5">
                    <Users size={14} className="text-teal-600" />
                    <span className="text-xs font-bold text-gray-700">Patients <span className="text-teal-600 ml-1">{profileData.patients}</span></span>
                  </div>
                  <div className="px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span className="text-xs font-bold text-gray-700">Success <span className="text-emerald-600 ml-1">{profileData.success}%</span></span>
                  </div>
                  <div className="px-3 py-1.5 bg-yellow-50 rounded-full border border-yellow-100 flex items-center gap-1.5">
                    <Star size={14} className="text-yellow-600 fill-yellow-600" />
                    <span className="text-xs font-bold text-gray-700">Rating <span className="text-yellow-600 ml-1">{profileData.rating}/5</span></span>
                  </div>
                  <div className="px-3 py-1.5 bg-teal-600 rounded-full flex items-center gap-1.5">
                    <IndianRupee size={12} className="text-white" />
                    <span className="text-xs font-bold text-white">{profileData.fee}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center md:items-end gap-3 pb-2">
              <div 
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 cursor-pointer transition-all ${
                  profileData.available ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
                onClick={() => setProfileData(prev => ({ ...prev, available: !prev.available }))}
              >
                <div className={`w-8 h-4 rounded-full relative transition-all ${profileData.available ? 'bg-teal-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${profileData.available ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">{profileData.available ? 'Available' : 'Unavailable'}</span>
              </div>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-[#0d9488] text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-teal-200 hover:bg-teal-700 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Form Content ── */}
      <div className="grid grid-cols-1 gap-10">
        
        {/* Section: Personal Information */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2 mb-8">
            <User size={20} className="text-teal-600" />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput label="Name" name="name" icon={<User size={14}/>} value={profileData.name} onChange={handleInputChange} />
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                <Briefcase size={14}/> SPECIALIZATION
              </label>
              <select 
                name="specialization"
                value={profileData.specialization}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 rounded-3xl bg-teal-50/30 border border-teal-100 focus:border-teal-400 focus:ring-0 outline-none text-sm font-bold text-gray-700 transition-all appearance-none"
              >
                {["General Physician", "Cardiologist", "Dermatologist", "Neurologist", "Orthopedic", "Pediatrician", "Psychiatrist", "Gynecologist", "Oncologist", "ENT Specialist", "Ophthalmologist", "Urologist", "Dentist", "Nephrologist", "Surgeon"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <FormInput label="Experience" name="experience" icon={<Clock size={14}/>} value={profileData.experience} onChange={handleInputChange} />
            <FormInput label="Qualifications" name="qualifications" icon={<GraduationCap size={14}/>} value={profileData.qualifications} onChange={handleInputChange} />
            <FormInput label="Location" name="location" icon={<MapPin size={14}/>} value={profileData.location} onChange={handleInputChange} />
            <FormInput label="Patients" name="patients" icon={<Users size={14}/>} value={profileData.patients} onChange={handleInputChange} />
            <FormInput label="Success %" name="success" icon={<CheckCircle size={14}/>} value={profileData.success} onChange={handleInputChange} />
            <FormInput label="Rating (1-5)" name="rating" icon={<Star size={14}/>} value={profileData.rating} onChange={handleInputChange} />
            <FormInput label="Fee (INR)" name="fee" icon={<IndianRupee size={14}/>} value={profileData.fee} onChange={handleInputChange} />
          </div>
        </section>

        {/* Section: About */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2 mb-8">
            <Briefcase size={20} className="text-teal-600" />
            About
          </h2>
          <div className="relative">
            <textarea 
              name="about"
              className="w-full h-32 px-5 py-4 rounded-3xl bg-teal-50/30 border border-teal-100 focus:border-teal-400 focus:ring-0 outline-none text-sm font-medium text-gray-700 transition-all resize-none"
              value={profileData.about}
              onChange={handleInputChange}
            />
            <span className="absolute bottom-3 right-5 text-[10px] font-bold text-gray-400">{profileData.about?.length || 0}/500</span>
          </div>
        </section>

        {/* Section: Schedule & Availability */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <Calendar size={20} className="text-teal-600" />
              Schedule & Availability
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <input 
                type="date" 
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold outline-none focus:border-teal-400"
              />
              <input 
                type="text" 
                placeholder="Time (e.g. 10:00 AM)"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold outline-none focus:border-teal-400 w-40"
              />
              <button 
                onClick={addSlot}
                className="flex items-center gap-1.5 bg-teal-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-teal-700 transition-all"
              >
                <Plus size={16} />
                Add Slot
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availability.map((item) => (
              <div key={item.date} className="bg-teal-50/30 rounded-3xl border border-teal-50 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm text-teal-600 border border-teal-100">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black px-2.5 py-1 bg-teal-100 text-teal-700 rounded-full">{item.slots.length} slots</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {item.slots.map((slot, idx) => (
                    <div key={slot._id} className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-teal-50 shadow-sm transition-all group hover:border-teal-200">
                      <div className="flex items-center gap-2 text-teal-700">
                        <Clock size={14} />
                        <span className="text-xs font-black">{slot.time}</span>
                      </div>
                      <button onClick={() => removeSlot(slot._id)} className="text-gray-300 group-hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

/* ── Reusable Form Input ── */
const FormInput = ({ label, name, icon, value, onChange }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
      {icon}
      {label}
    </label>
    <input 
      type="text" 
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-5 py-3.5 rounded-3xl bg-teal-50/30 border border-teal-100 focus:border-teal-400 focus:ring-0 outline-none text-sm font-bold text-gray-700 transition-all"
    />
  </div>
);

export default EditProfile;
