import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Star, Heart, GraduationCap, MapPin, 
  Wallet, CheckCircle, Info, Calendar, Clock, 
  UserPlus, ShieldCheck, Award, MessageSquare, Loader,
  Phone, User, Mail, ChevronRight
} from 'lucide-react';



/* ─── Success Screen ─────────────────────────────────────── */
function SuccessScreen({ data, onReset }) {
  const isCash = data.paymentMethod === 'Cash';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center gap-6 py-12 px-6 bg-white rounded-[40px] shadow-2xl border border-emerald-50"
    >
      <div className="w-28 h-28 rounded-full bg-emerald-100 flex items-center justify-center relative">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
          className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" 
        />
        <CheckCircle className="w-14 h-14 text-emerald-500 relative z-10" />
      </div>
      <div>
        <h2 className="text-3xl font-black text-gray-800 tracking-tight">
          {isCash ? "Booking Pre-Confirmed!" : "Appointment Confirmed!"}
        </h2>
        <p className="text-gray-500 text-sm mt-3 max-w-sm leading-relaxed">
          {isCash 
            ? `Your appointment with Dr. ${data.doctorName} is registered. Please pay ₹${data.fee} at the clinic.`
            : `Your session with Dr. ${data.doctorName} is all set. We've sent the details to your email.`
          }
        </p>
      </div>

      <div className="w-full max-w-sm bg-gray-50 rounded-3xl p-6 text-left space-y-3 border border-gray-100">
        {[
          { label: "Patient", value: data.name, icon: <UserPlus size={14} className="text-emerald-500" /> },
          { label: "Date", value: data.date, icon: <Calendar size={14} className="text-emerald-500" /> },
          { label: "Time", value: data.timeSlot, icon: <Clock size={14} className="text-emerald-500" /> },
          { label: "Payment", value: data.paymentMethod, icon: <Wallet size={14} className="text-emerald-500" /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gray-50 shadow-sm">
            <div className="flex items-center gap-2">
              {icon}
              <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{label}</span>
            </div>
            <span className="text-gray-800 font-bold text-sm">{value}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        className="mt-4 px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-full text-sm transition-all shadow-xl shadow-emerald-200 active:scale-95"
      >
        Book Another Appointment
      </button>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
const Appointments = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector(state => state.user);

  const [loading, setLoading] = useState(false);
  const [fetchingDoc, setFetchingDoc] = useState(!!doctorId);
  const [doctorList, setDoctorList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    email: currentUser?.email || "",
    age: currentUser?.age || "",
    gender: currentUser?.gender || "",
    doctorId: doctorId || "",
    doctorName: "",
    service: "General Consultation",
    message: "",
    date: "",
    timeSlot: "",
    slotId: "",
    paymentMethod: "Online", // Default
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      setForm(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        phone: currentUser.phone || prev.phone,
        email: currentUser.email || prev.email,
        age: currentUser.age || prev.age,
        gender: currentUser.gender || prev.gender
      }));
    }
  }, [currentUser]);

  const isFormComplete = !!(currentUser && form.name && form.age && form.phone && form.date && form.timeSlot);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(`/doctor/all?available=true`);
        if (data.success) {
          setDoctorList(data.doctors);
          if (doctorId) {
            const doc = data.doctors.find(d => d._id === doctorId);
            if (doc) {
              setSelectedDoctor(doc);
              setForm(prev => ({ ...prev, doctorName: doc.name, doctorId: doc._id }));
              processSlots(doc.slots);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingDoc(false);
      }
    };
    fetchDoctors();
  }, [doctorId]);

  useEffect(() => {
    if (form.doctorId && doctorList.length > 0) {
      const doc = doctorList.find(d => d._id === form.doctorId);
      if (doc) {
        setSelectedDoctor(doc);
        setForm(prev => ({ ...prev, doctorName: doc.name }));
        processSlots(doc.slots);
      }
    }
  }, [form.doctorId, doctorList]);

  const processSlots = (slots) => {
    if (!slots) return;
    const unbooked = slots.filter(s => !s.isBooked);
    const dates = [...new Set(unbooked.map(s => s.date))].sort();
    setAvailableDates(dates);
    setAvailableSlots(unbooked);
  };

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleDateChange = (date) => {
    update("date", date);
    update("timeSlot", "");
    update("slotId", "");
  };

  const handleSlotSelection = (slot) => {
    update("timeSlot", slot.time);
    update("slotId", slot._id);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!currentUser) return navigate('/login');
    
    // Basic Validation
    if (!form.name || !form.phone || !form.date || !form.timeSlot) {
      setError("Please fill all required fields and select a slot.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(`/appointments/book`, form);
      
      if (data.success) {
        if (form.paymentMethod === 'Cash') {
          setSubmitted(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // Razorpay flow
          const { order, appointment } = data;
          const options = {
            key: "rzp_test_SUNI6vBIXNlZ8U",
            amount: order.amount,
            currency: order.currency,
            name: "MediCare Hospital",
            description: `Appointment with ${form.doctorName}`,
            order_id: order.id,
            handler: async (response) => {
              try {
                const verifyRes = await axios.post(`/appointments/verify-payment`, {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  appointmentId: appointment._id
                });

                if (verifyRes.data.success) {
                  setSubmitted(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              } catch (err) {
                setError("Payment verification failed. Please contact support.");
              }
            },
            prefill: { name: form.name, email: form.email, contact: form.phone },
            theme: { color: "#10b981" }
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Booking failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingDoc) return <div className="h-screen flex items-center justify-center text-emerald-600 font-bold animate-pulse text-lg tracking-widest uppercase">Initializing Physician Profile...</div>;

  if (!selectedDoctor) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-emerald-50">
      <p className="text-gray-500 font-medium">Please select a doctor to continue.</p>
      <Link to="/doctors" className="px-6 py-2 bg-emerald-500 text-white rounded-full font-bold">Go to Doctors</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fffd] pb-20">
      
      {/* ── Header ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-emerald-50 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 group">
          <div className="p-2.5 rounded-2xl border border-emerald-100 bg-white shadow-sm group-hover:bg-emerald-50 transition-all">
            <ArrowLeft size={18} className="text-emerald-600" />
          </div>
          <span className="text-emerald-700 font-black text-sm uppercase tracking-wider">Back</span>
        </button>
        <h2 className="text-emerald-900 font-black text-xl tracking-tight hidden sm:block">Doctor Profile</h2>
        <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-100 shadow-sm">
          <Star size={16} fill="#f59e0b" className="text-amber-500" />
          <span className="text-amber-700 font-black text-sm">{selectedDoctor.rating || '4.8'}</span>
        </div>
      </nav>

      {submitted ? (
        <div className="max-w-2xl mx-auto mt-20 px-6">
          <SuccessScreen data={{...form, fee: selectedDoctor.fee}} onReset={() => window.location.reload()} />
        </div>
      ) : (
        <div className="max-w-[1300px] mx-auto pt-10 px-6">
          
          {/* ── Doctor Info Card ──────────────────────────────── */}
          <div className="bg-[#f0fcf9] rounded-[50px] shadow-2xl shadow-emerald-900/[0.05] border border-emerald-100/50 p-8 md:p-10 relative overflow-hidden mb-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none opacity-40" />
            
            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-12 relative z-10">
              <div className="flex flex-col items-center gap-8">
                <div className="relative">
                  <div className="w-[260px] h-[260px] rounded-full p-1 bg-gradient-to-br from-emerald-400/50 to-teal-500/50">
                    <div className="w-full h-full rounded-full border-[6px] border-white overflow-hidden shadow-2xl shadow-emerald-900/10">
                      <img 
                        src={selectedDoctor.image || 'https://via.placeholder.com/300'} 
                        alt={selectedDoctor.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -inset-4 border-[2px] border-emerald-300/30 rounded-full pointer-events-none" />
                </div>
                
                <div className="grid grid-cols-3 gap-3 w-full">
                  {[
                    { label: 'Success', value: selectedDoctor.success ? `${selectedDoctor.success}%` : '98%', icon: <Heart size={16} />, color: 'emerald' },
                    { label: 'Exp', value: `${selectedDoctor.experience || 5}Y`, icon: <Award size={16} />, color: 'amber' },
                    { label: 'Patients', value: selectedDoctor.patients || '500+', icon: <UserPlus size={16} />, color: 'blue' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl flex flex-col items-center gap-1.5 p-3 shadow-lg shadow-emerald-900/[0.03] border border-white">
                      <div className={`p-1.5 rounded-lg bg-${s.color}-50 text-${s.color}-500 flex items-center justify-center`}>{s.icon}</div>
                      <p className="text-sm font-black text-gray-900 leading-none">{s.value}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-6 text-left">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-emerald-900 tracking-tight mb-2">Dr. {selectedDoctor.name}</h1>
                  <span className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-2xl text-[13px] font-black shadow-lg shadow-emerald-100">
                    <Heart size={14} fill="currentColor" />
                    {selectedDoctor.specialization}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Qualifications', value: selectedDoctor.qualifications || 'MBBS, MD', icon: <GraduationCap size={18} /> },
                    { label: 'Location', value: selectedDoctor.location || 'Mumbai, India', icon: <MapPin size={18} /> },
                    { label: 'Consultation Fee', value: `₹${selectedDoctor.fee}`, icon: <Wallet size={18} />, textStyle: 'text-rose-500 font-black' },
                    { label: 'Availability', value: selectedDoctor.available ? 'Available' : 'On Leave', icon: <CheckCircle size={18} />, textStyle: 'text-emerald-600 font-black' },
                  ].map((info, i) => (
                    <div key={i} className="flex items-center gap-4 bg-[#f0fcf9] border border-emerald-100/50 p-4 rounded-3xl shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100/50 flex items-center justify-center text-emerald-700 shrink-0">{info.icon}</div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{info.label}</p>
                        <p className={`text-[13px] font-black text-emerald-900 ${info.textStyle || ''}`}>{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#dcfce7] rounded-[32px] p-6 border border-emerald-200/50">
                  <p className="text-emerald-900 text-sm leading-relaxed font-bold">
                    <Info className="inline mr-2 text-emerald-600" size={16} />
                    {selectedDoctor.about || 'A highly dedicated medical professional with extensive experience in providing comprehensive patient care and innovative treatment solutions...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Booking & Patient Details Section ────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
            
            <div className="space-y-8">
              {/* 1. Date Selection */}
              <div className="bg-[#f0fcf9] rounded-[40px] p-8 shadow-xl shadow-emerald-900/[0.03] border border-emerald-100/50">
                <h3 className="text-xl font-black text-emerald-900 flex items-center gap-3 mb-8">
                  <Calendar size={22} className="text-emerald-500" />
                  Select Date
                </h3>
                <div className="flex flex-wrap gap-4">
                  {availableDates.length > 0 ? (
                    availableDates.map((date) => {
                      const d = new Date(date);
                      const day = d.toLocaleDateString('en-GB', { weekday: 'short' });
                      const num = d.toLocaleDateString('en-GB', { day: 'numeric' });
                      const mon = d.toLocaleDateString('en-GB', { month: 'short' });
                      
                      return (
                        <button
                          key={date} type="button"
                          onClick={() => handleDateChange(date)}
                          className={`w-20 h-24 rounded-full flex flex-col items-center justify-center gap-1 border-2 transition-all duration-300 ${
                            form.date === date
                              ? "bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-200"
                              : "bg-white border-gray-100 text-gray-500 hover:border-emerald-200"
                          }`}
                        >
                          <span className={`text-[10px] font-bold uppercase ${form.date === date ? 'text-emerald-100' : 'text-gray-400'}`}>{day}</span>
                          <span className="text-xl font-black">{num}</span>
                          <span className={`text-[10px] font-bold uppercase ${form.date === date ? 'text-emerald-100' : 'text-gray-400'}`}>{mon}</span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 font-bold italic py-4">No slots available currently</p>
                  )}
                </div>
              </div>

              {/* 2. Patient Details Form */}
              <div className="bg-[#f0fdf9] rounded-[40px] p-8 shadow-xl shadow-emerald-900/[0.03] border border-emerald-100/50">
                <h3 className="text-xl font-black text-emerald-900 flex items-center gap-3 mb-8">
                  <UserPlus size={22} className="text-emerald-500" />
                  Patient Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="relative group sm:col-span-1">
                    <User className="absolute left-4 top-4 text-emerald-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                    <input 
                      type="text" placeholder="Full Name" 
                      value={form.name} onChange={(e) => update('name', e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-white/60 border-2 border-emerald-50 focus:border-emerald-400 focus:bg-white rounded-2xl outline-none font-bold text-sm text-gray-900 transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div className="relative group">
                    <Award className="absolute left-4 top-4 text-emerald-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                    <input 
                      type="number" placeholder="Age" 
                      value={form.age} onChange={(e) => update('age', e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-white/60 border-2 border-emerald-50 focus:border-emerald-400 focus:bg-white rounded-2xl outline-none font-bold text-sm text-gray-900 transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-4 text-emerald-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                    <input 
                      type="tel" placeholder="Mobile Number (10 digits)" 
                      value={form.phone} onChange={(e) => update('phone', e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-white/60 border-2 border-emerald-50 focus:border-emerald-400 focus:bg-white rounded-2xl outline-none font-bold text-sm text-gray-900 transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div className="relative group">
                    <User className="absolute left-4 top-4 text-emerald-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                    <select 
                      value={form.gender} onChange={(e) => update('gender', e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-white/60 border-2 border-emerald-50 focus:border-emerald-400 focus:bg-white rounded-2xl outline-none font-bold text-sm text-gray-900 transition-all appearance-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="relative group sm:col-span-2">
                    <Mail className="absolute left-4 top-4 text-emerald-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                    <input 
                      type="email" placeholder="Email (optional - for receipts)" 
                      value={form.email} onChange={(e) => update('email', e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-white/60 border-2 border-emerald-50 focus:border-emerald-400 focus:bg-white rounded-2xl outline-none font-bold text-sm text-gray-900 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Summary & Slot Selection ────────────────────── */}
            <div className="space-y-6">
              
              {/* Slots Section */}
              <div className="bg-[#f0fcf9] rounded-[40px] p-8 border border-emerald-100/50 shadow-xl shadow-emerald-900/[0.03]">
                <h3 className="text-lg font-black text-emerald-900 flex items-center gap-3 mb-6">
                  <Clock size={20} className="text-emerald-500" />
                  Available Time Slots
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {form.date ? (
                    availableSlots
                      .filter((s) => s.date === form.date)
                      .map((slot) => (
                        <button
                          key={slot._id} type="button"
                          onClick={() => handleSlotSelection(slot)}
                          className={`py-3 rounded-xl text-[11px] font-black border-2 transition-all ${
                            form.timeSlot === slot.time
                              ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100"
                              : "bg-white border-white text-gray-500 hover:border-emerald-200"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))
                  ) : (
                    <div className="col-span-3 text-center py-6 text-gray-400 font-bold italic text-sm">Select a date to view slots</div>
                  )}
                </div>
              </div>

              {/* Final Summary Card */}
              <div className="bg-[#f0fdf9] rounded-[40px] p-8 shadow-2xl border border-emerald-100/50 space-y-6">
                <h4 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">Booking Summary</h4>
                
                <div className="space-y-4">
                  {[
                    { label: 'Patient Name:', value: form.name || 'Not provided', color: form.name ? 'text-emerald-600 italic' : 'text-emerald-400/60' },
                    { label: 'Patient Age:', value: form.age || 'Not provided', color: form.age ? 'text-emerald-600 italic' : 'text-emerald-400/60' },
                    { label: 'Patient Phone:', value: form.phone || 'Not provided', color: form.phone ? 'text-emerald-600 italic' : 'text-emerald-400/60' },
                    { label: 'Selected Doctor:', value: `Dr. ${selectedDoctor.name}`, color: 'text-emerald-900' },
                    { label: 'Doctor Speciality:', value: selectedDoctor.specialization, color: 'text-emerald-800/80' },
                    { label: 'Selected Date:', value: form.date || 'Not selected', color: form.date ? 'text-emerald-900' : 'text-emerald-500 font-bold' },
                    { label: 'Selected Time:', value: form.timeSlot || 'Not selected', color: form.timeSlot ? 'text-emerald-900' : 'text-emerald-500 font-bold' },
                    { label: 'Consultation Fee:', value: `₹${selectedDoctor.fee}`, color: 'text-rose-500 font-black' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-emerald-800 font-bold">{item.label}</span>
                      <span className={`font-black ${item.color || 'text-emerald-900'}`}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-dashed border-gray-100">
                   <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-black text-gray-800">Payment:</span>
                    <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
                      {['Cash', 'Online'].map((method) => (
                        <button
                          key={method}
                          onClick={() => update('paymentMethod', method)}
                          className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                            form.paymentMethod === method
                              ? "bg-emerald-600 text-white shadow-lg"
                              : "text-gray-400 hover:text-gray-600"
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                   </div>

                   {error && <p className="text-rose-500 text-[11px] font-bold text-center mb-4">{error}</p>}

                   <button 
                    onClick={handleSubmit} disabled={loading}
                    className={`w-full py-5 rounded-[24px] font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xl group ${
                      isFormComplete 
                        ? "bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700" 
                        : "bg-gray-200 text-gray-400 shadow-gray-100 cursor-not-allowed"
                    }`}
                  >
                    {loading ? <Loader className="animate-spin" size={20} /> : <ShieldCheck size={20} className={isFormComplete ? "group-hover:scale-110 transition-transform" : ""} />}
                    Confirm Booking
                    <ChevronRight size={18} className={`transition-transform ${isFormComplete ? "group-hover:translate-x-1" : ""}`} />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Appointments;
