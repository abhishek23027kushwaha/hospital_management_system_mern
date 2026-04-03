import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CheckCircle2, CreditCard, Stethoscope, Microscope } from "lucide-react";
import toast from "react-hot-toast";



const MyAppointments = () => {
  const [doctorAppts, setDoctorAppts] = useState([]);
  const [serviceAppts, setServiceAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctorAppointments = async () => {
    try {
      const { data } = await axios.get(`/patient/appointments/my`);
      if (data.success) {
        setDoctorAppts(data.appointments);
      }
    } catch (err) {
      console.error("Error fetching doctor appointments:", err);
    }
  };

  const fetchServiceAppointments = async () => {
    try {
      const { data } = await axios.get(`/service-appointments/my`);
      if (data.success) {
        setServiceAppts(data.appointments);
      }
    } catch (err) {
      console.error("Error fetching service appointments:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchDoctorAppointments(), fetchServiceAppointments()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ecfdf5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#114232]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ecfdf5] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* ── Doctor Appointments Section ────────────────────── */}
        <section className="space-y-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#114232]">
              Your Doctor Appointments
            </h2>
            <div className="w-24 h-1 bg-[#114232] mx-auto mt-4 rounded-full" />
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <AnimatePresence>
              {doctorAppts.length > 0 ? (
                doctorAppts.map((appt, index) => (
                  <motion.div
                    key={appt._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full max-w-[340px] bg-white rounded-[2rem] p-8 shadow-xl shadow-green-900/5 border border-gray-100 flex flex-col items-center text-center group"
                  >
                    {/* Doctor Image with Border */}
                    <div className="relative mb-6">
                      <div className="w-32 h-32 rounded-full border-[3px] border-[#34ad7b] p-1.5 bg-white shadow-lg overflow-hidden">
                        <img
                          src={appt.doctor?.image || "https://via.placeholder.com/150"}
                          alt={appt.doctorName}
                          className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-1">{appt.doctorName}</h3>
                    <p className="text-[#34ad7b] font-medium text-sm mb-6 uppercase tracking-wider">
                      {appt.doctorSpecialization}
                    </p>

                    <div className="w-full space-y-3 mb-8">
                      {/* Date Pill */}
                      <div className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-100 px-5 py-2.5 rounded-full text-gray-600 font-bold text-[13px]">
                        <Calendar size={16} className="text-emerald-500" />
                        {appt.date}
                      </div>
                      {/* Time Pill */}
                      <div className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-100 px-5 py-2.5 rounded-full text-gray-600 font-bold text-[13px]">
                        <Clock size={16} className="text-emerald-500" />
                        {appt.timeSlot}
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-3 mt-auto">
                      <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border ${
                        appt.isPaid 
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        <CreditCard size={12} />
                        {appt.paymentMethod}
                      </span>
                      <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border ${
                        appt.status === 'Completed'
                          ? 'bg-gray-100 text-gray-500 border-gray-200'
                          : appt.status === 'Cancelled'
                            ? 'bg-red-50 text-red-500 border-red-100'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        <CheckCircle2 size={12} />
                        {appt.status}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 w-full">
                  <p className="text-gray-400 font-medium text-lg">No doctor appointments found.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── Service Bookings Section ─────────────────────── */}
        <section className="space-y-10 pb-20">
          <div className="text-center border-t border-[#114232]/10 pt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2a5df6]">
              Your Booked Services
            </h2>
            <div className="w-24 h-1 bg-[#2a5df6] mx-auto mt-4 rounded-full" />
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <AnimatePresence>
              {serviceAppts.length > 0 ? (
                serviceAppts.map((appt, index) => (
                  <motion.div
                    key={appt._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full max-w-[340px] bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-900/5 border border-gray-100 flex flex-col items-center text-center group"
                  >
                    <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 border border-blue-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <Microscope className="text-blue-500" size={32} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-1">{appt.serviceName}</h3>
                    <p className="text-blue-500 font-medium text-xs mb-6 uppercase tracking-wider">
                      Diagnostic Service
                    </p>

                    <div className="w-full space-y-3 mb-8">
                      <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 px-5 py-2.5 rounded-full text-gray-600 font-bold text-[12px]">
                        <span className="flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> Date:</span>
                        <span>{appt.date}</span>
                      </div>
                      <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 px-5 py-2.5 rounded-full text-gray-600 font-bold text-[12px]">
                        <span className="flex items-center gap-2"><Clock size={14} className="text-blue-500" /> Time:</span>
                        <span>{appt.timeSlot}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-auto">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        appt.isPaid ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                         {appt.isPaid ? 'Paid' : 'Pending'}
                       </span>
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        appt.status === 'Completed' ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                         {appt.status}
                       </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 w-full">
                  <p className="text-[#2a5df6] font-medium text-lg">No service bookings found.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </div>
    </div>
  );
};

export default MyAppointments;
