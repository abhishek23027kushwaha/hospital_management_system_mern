import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';

const ServiceBooking = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    age: '',
    gender: '',
    email: '',
    paymentMethod: 'Online'
  });

  // Booking State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
    // Load user data if available (optional, can be done via context)
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      const { data } = await axios.get(`/services/${serviceId}`);
      if (data.success) {
        setService(data.service);
        // Find first available slot to pre-select
        const availableSlots = data.service.slots.filter(s => !s.isBooked);
        if (availableSlots.length > 0) {
           // Group by date for the UI
        }
      }
    } catch (err) {
      toast.error("Failed to load service details");
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBooking = async () => {
    if (!formData.fullName || !formData.mobile || !formData.age || !formData.gender || !selectedDate || !selectedTime) {
      toast.error("Please fill all required fields and select a slot");
      return;
    }

    setBookingLoading(true);
    try {
      const bookingData = {
        serviceId,
        slotId: selectedSlotId,
        date: selectedDate,
        timeSlot: selectedTime,
        patientName: formData.fullName,
        patientEmail: formData.email,
        patientPhone: formData.mobile,
        patientAge: parseInt(formData.age),
        patientGender: formData.gender,
        paymentMethod: formData.paymentMethod
      };

      const { data } = await axios.post(`/service-appointments/book`, bookingData);

      if (data.success) {
        if (formData.paymentMethod === 'Online' && data.order) {
          initPay(data.order, data.appointment._id);
        } else {
          toast.success("Booking confirmed successfully!");
          navigate('/services');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      if (formData.paymentMethod !== 'Online') setBookingLoading(false);
    }
  };

  const initPay = (order, appointmentId) => {
    const options = {
      key: "rzp_test_SUNI6vBIXNlZ8U", // Hardcoded from .env for demo or fetch via API
      amount: order.amount,
      currency: order.currency,
      name: "MediCare Hospital",
      description: `Payment for ${service.name}`,
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(`/service-appointments/verify-payment`, {
            ...response,
            appointmentId
          });

          if (data.success) {
            toast.success("Payment successful & booking confirmed!");
            navigate('/services');
          }
        } catch (error) {
          toast.error("Payment verification failed");
        }
      },
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.mobile
      },
      theme: {
        color: "#114232"
      },
      modal: {
        ondismiss: () => setBookingLoading(false)
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0fdf4]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  if (!service) return null;

  // Group slots by date
  const groupedSlots = service.slots.reduce((acc, slot) => {
    if (!slot.isBooked) {
      if (!acc[slot.date]) acc[slot.date] = [];
      acc[slot.date].push(slot);
    }
    return acc;
  }, {});

  const availableDates = Object.keys(groupedSlots);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-[#f8faf9] min-h-screen">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-emerald-700 font-medium mb-8 hover:text-emerald-800 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-100"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Form & Service Media */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Service Header Card */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 rounded-2xl overflow-hidden h-64 bg-gray-50">
              <img 
                src={service.image} 
                alt={service.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 space-y-4">
              <h1 className="text-3xl font-black text-emerald-900 capitalize">{service.name}</h1>
              
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  About This Service
                </div>
                <p className="text-emerald-700/80 text-sm leading-relaxed">
                  {service.about || "Quality healthcare service tailored for your needs."}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-emerald-100/50 text-emerald-800 px-6 py-3 rounded-2xl font-black text-xl border border-emerald-200">
                  ₹{service.price}
                </div>
              </div>

              {service.instructions?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-emerald-900 font-bold flex items-center gap-2">
                    Pre-Test Instructions
                  </h3>
                  <ul className="list-disc list-inside text-sm text-emerald-700/70 space-y-1">
                    {service.instructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Patient Details Form */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-emerald-900">Your Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-emerald-800 ml-1">Full Name *</label>
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-2xl bg-emerald-50/30 border border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-emerald-900/30 text-emerald-900 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-emerald-800 ml-1">Mobile (10 digits) *</label>
                <input 
                  type="tel" 
                  name="mobile"
                  placeholder="Mobile (10 digits) *"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="w-full px-5 py-3 rounded-2xl bg-emerald-50/30 border border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-emerald-900/30 text-emerald-900 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-emerald-800 ml-1">Age *</label>
                <input 
                  type="number" 
                  name="age"
                  placeholder="Age *"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-2xl bg-emerald-50/30 border border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-emerald-900/30 text-emerald-900 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-emerald-800 ml-1">Select Gender *</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-2xl bg-emerald-50/30 border border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-emerald-900 font-medium"
                >
                  <option value="">Select Gender *</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-emerald-800 ml-1">Email (optional)</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email (optional)"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-2xl bg-emerald-50/30 border border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-emerald-900/30 text-emerald-900 font-medium"
                />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-sm font-bold text-emerald-900 ml-1 uppercase tracking-wider">Payment Method</h3>
              <div className="flex gap-4">
                {['Cash', 'Online'].map(method => (
                  <button
                    key={method}
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                    className={`px-8 py-2.5 rounded-full font-bold transition-all border-2 ${
                      formData.paymentMethod === method 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                        : 'bg-white border-emerald-100 text-emerald-600 hover:border-emerald-300'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Summary & Slot Selection */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Booking Summary Card */}
          <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 sticky top-24">
            <h2 className="text-xl font-black text-emerald-900 mb-6 flex items-center gap-2">
              Booking Summary
            </h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-emerald-200/50">
                <span className="text-emerald-700/60 font-bold">Name:</span>
                <span className="text-emerald-900 font-bold text-right">{formData.fullName || 'Not filled'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-emerald-200/50">
                <span className="text-emerald-700/60 font-bold">Mobile:</span>
                <span className="text-emerald-900 font-bold text-right">{formData.mobile || 'Not filled'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-emerald-200/50">
                <span className="text-emerald-700/60 font-bold">Age:</span>
                <span className="text-emerald-900 font-bold text-right">{formData.age || 'Not filled'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-emerald-200/50">
                <span className="text-emerald-700/60 font-bold">Gender:</span>
                <span className="text-emerald-900 font-bold text-right">{formData.gender || 'Not filled'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-emerald-200/50">
                <span className="text-emerald-700/60 font-bold">Date:</span>
                <span className="text-emerald-900 font-bold text-right">{selectedDate || 'Not selected'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-emerald-200/50">
                <span className="text-emerald-700/60 font-bold">Time:</span>
                <span className="text-emerald-900 font-bold text-right">{selectedTime || 'Not selected'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-emerald-200/50">
                <span className="text-emerald-700/60 font-bold">Payment:</span>
                <span className="text-emerald-900 font-bold text-right">{formData.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-emerald-900 font-black text-lg">Price:</span>
                <span className="text-emerald-700 font-black text-lg">₹{service.price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slots Section - Full Width */}
        <div className="lg:col-span-12 space-y-12 pb-24">
          
          <div className="space-y-6">
            <h2 className="text-xl font-black text-emerald-900">Select Date *</h2>
            <div className="flex flex-wrap gap-4">
              {availableDates.length > 0 ? availableDates.map(date => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedTime('');
                    setSelectedSlotId(null);
                  }}
                  className={`px-8 py-3 rounded-2xl font-bold transition-all border-2 text-sm ${
                    selectedDate === date 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-500/30 scale-105' 
                      : 'bg-white border-emerald-100 text-emerald-700 hover:border-emerald-300'
                  }`}
                >
                  {date}
                </button>
              )) : (
                <p className="text-gray-400 italic">No slots available for this service.</p>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selectedDate && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-black text-emerald-900">Select Time *</h2>
                <div className="flex flex-wrap gap-4">
                  {groupedSlots[selectedDate].map(slot => (
                    <button
                      key={slot._id}
                      onClick={() => {
                        setSelectedTime(slot.time);
                        setSelectedSlotId(slot._id);
                      }}
                      className={`px-8 py-3 rounded-2xl font-bold transition-all border-2 text-sm flex items-center gap-2 ${
                        selectedTime === slot.time 
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-500/30 scale-105' 
                          : 'bg-white border-emerald-100 text-emerald-700 hover:border-emerald-300'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {slot.time}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center pt-8">
            <button
              onClick={handleBooking}
              disabled={bookingLoading}
              className={`group flex items-center justify-center gap-4 px-16 py-5 rounded-full font-black text-xl transition-all shadow-2xl relative overflow-hidden ${
                bookingLoading || !selectedDate || !selectedTime || !formData.fullName
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-none'
                  : 'bg-[#114232] text-white hover:scale-105 active:scale-95'
              }`}
            >
              {bookingLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <svg className="w-6 h-6 transform rotate-[-45deg] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Confirm Booking • ₹{service.price}
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ServiceBooking;
