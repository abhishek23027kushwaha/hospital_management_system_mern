import React, { useState } from 'react';
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
  Save
} from 'lucide-react';

const fontStyle = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

const EditProfile = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [profileData, setProfileData] = useState({
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrician',
    experience: '8',
    qualifications: 'MBBS, DCH',
    location: 'Sunrise Pediatrics, Sector 12',
    patients: '14k+',
    success: '98',
    rating: '4.7',
    fee: '1500',
    about: 'Child specialist focusing on growth, nutrition, and immunity.'
  });

  const [availability, setAvailability] = useState([
    {
      id: 1,
      day: 'Sun, Feb 15',
      date: '2026-02-15',
      slots: ['10:00 AM', '11:00 AM']
    },
    {
      id: 2,
      day: 'Mon, Feb 16',
      date: '2026-02-16',
      slots: ['11:00 AM']
    }
  ]);

  const removeSlot = (dateId, slotIndex) => {
    setAvailability(prev => prev.map(item => {
      if (item.id === dateId) {
        return {
          ...item,
          slots: item.slots.filter((_, i) => i !== slotIndex)
        };
      }
      return item;
    }));
  };

  const removeDate = (dateId) => {
    setAvailability(prev => prev.filter(item => item.id !== dateId));
  };

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
                    src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200&h=200" 
                    alt="Doctor" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-1 right-1 p-2.5 bg-white rounded-full shadow-lg border border-teal-100 text-teal-600 hover:bg-teal-50 transition-all">
                  <Camera size={18} />
                </button>
              </div>

              {/* Basic Info */}
              <div className="text-center md:text-left pb-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{profileData.name}</h1>
                <p className="flex items-center justify-center md:justify-start gap-1.5 text-teal-600 font-semibold text-sm mt-1">
                  <Briefcase size={14} />
                  {profileData.specialization} : <span className="text-gray-400 font-medium">{profileData.location}</span>
                </p>

                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                  <div className="px-3 py-1.5 bg-teal-50 rounded-full border border-teal-100 flex items-center gap-1.5">
                    <Users size={14} className="text-teal-600" />
                    <span className="text-xs font-bold text-gray-700">Patients <span className="text-teal-600 ml-1">{profileData.patients}</span></span>
                  </div>
                  <div className="px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span className="text-xs font-bold text-gray-700">Success <span className="text-emerald-600 ml-1">{profileData.success}</span></span>
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
                  isAvailable ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
                onClick={() => setIsAvailable(!isAvailable)}
              >
                <div className={`w-8 h-4 rounded-full relative transition-all ${isAvailable ? 'bg-teal-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isAvailable ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">{isAvailable ? 'Available' : 'Unavailable'}</span>
              </div>
              <button className="flex items-center gap-2 bg-[#0d9488] text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-teal-200 hover:bg-teal-700 transition-all">
                <Save size={16} />
                Save Profile
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
            <FormInput label="Name" icon={<User size={14}/>} value={profileData.name} />
            <FormInput label="Specialization" icon={<Briefcase size={14}/>} value={profileData.specialization} />
            <FormInput label="Experience" icon={<Clock size={14}/>} value={profileData.experience} />
            <FormInput label="Qualifications" icon={<GraduationCap size={14}/>} value={profileData.qualifications} />
            <FormInput label="Location" icon={<MapPin size={14}/>} value={profileData.location} />
            <FormInput label="Patients" icon={<Users size={14}/>} value={profileData.patients} />
            <FormInput label="Success" icon={<CheckCircle size={14}/>} value={profileData.success} />
            <FormInput label="Rating (out of 5)" icon={<Star size={14}/>} value={profileData.rating} />
            <FormInput label="Fee (INR)" icon={<IndianRupee size={14}/>} value={profileData.fee} />
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
              className="w-full h-32 px-5 py-4 rounded-3xl bg-teal-50/30 border border-teal-100 focus:border-teal-400 focus:ring-0 outline-none text-sm font-medium text-gray-700 transition-all resize-none"
              defaultValue={profileData.about}
            />
            <span className="absolute bottom-3 right-5 text-[10px] font-bold text-gray-400">61/500</span>
          </div>
        </section>

        {/* Section: Schedule & Availability */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <Calendar size={20} className="text-teal-600" />
              Schedule & Availability
            </h2>
            <div className="flex items-center gap-3">
              <input 
                type="date" 
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold outline-none focus:border-teal-400"
              />
              <button className="flex items-center gap-1.5 bg-teal-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-teal-700 transition-all">
                <Plus size={16} />
                Add Date
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availability.map((item) => (
              <div key={item.id} className="bg-teal-50/30 rounded-3xl border border-teal-50 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm text-teal-600 border border-teal-100">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800">{item.day}</p>
                      <p className="text-[10px] font-bold text-gray-400">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black px-2.5 py-1 bg-teal-100 text-teal-700 rounded-full">{item.slots.length} slots</span>
                    <button onClick={() => removeDate(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {item.slots.map((slot, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-teal-50 shadow-sm transition-all group hover:border-teal-200">
                      <div className="flex items-center gap-2 text-teal-700">
                        <Clock size={14} />
                        <span className="text-xs font-black">{slot}</span>
                      </div>
                      <button onClick={() => removeSlot(item.id, idx)} className="text-gray-300 group-hover:text-red-400 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-teal-50 border-dashed transition-all cursor-pointer hover:bg-teal-50/50">
                    <input type="text" placeholder="--:--" className="bg-transparent text-xs font-black text-gray-400 outline-none w-20" />
                    <button className="text-teal-400">
                      <Plus size={16} />
                    </button>
                  </div>
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
const FormInput = ({ label, icon, value }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
      {icon}
      {label}
    </label>
    <input 
      type="text" 
      defaultValue={value}
      className="w-full px-5 py-3.5 rounded-3xl bg-teal-50/30 border border-teal-100 focus:border-teal-400 focus:ring-0 outline-none text-sm font-bold text-gray-700 transition-all"
    />
  </div>
);

export default EditProfile;
