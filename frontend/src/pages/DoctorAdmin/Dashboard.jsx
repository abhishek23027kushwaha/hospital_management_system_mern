import React, { useState } from 'react';
import { RefreshCw, Users, CalendarCheck, CheckCircle2, XCircle, Phone } from 'lucide-react';

/* Inter font */
const fontStyle = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

/* ── Mock Data ─────────────────────────────────────────── */
const DOCTOR = {
  name: "Dr. David Kim",
  specialty: "Oncologist",
  id: "893f65db397207fb70ad920",
};

const INITIAL_APPOINTMENTS = [
  {
    id: 1, patient: "Harshit Jaiswal", age: 23, gender: "Male",
    doctor: "Dr. David Kim", specialty: "Oncologist",
    phone: "7397414771", date: "22 Jan 2026", time: "6:00 PM",
    fee: 800, status: "Cancelled",
  },
  {
    id: 2, patient: "Rt", age: 23, gender: "Female",
    doctor: "Dr. David Kim", specialty: "Oncologist",
    phone: "7397414771", date: "22 Jan 2026", time: "6:00 PM",
    fee: 800, status: "Completed",
  },
  {
    id: 3, patient: "Bintey Zehra Zaidi", age: 44, gender: "Male",
    doctor: "Dr. David Kim", specialty: "Oncologist",
    phone: "9005073898", date: "20 Jan 2026", time: "6:00 PM",
    fee: 800, status: "Pending",
  },
  {
    id: 4, patient: "Bintey Zehra Zaidi", age: 77, gender: "Male",
    doctor: "Dr. David Kim", specialty: "Oncologist",
    phone: "9005079655", date: "19 Jan 2026", time: "10:00 PM",
    fee: 800, status: "Pending",
  },
  {
    id: 5, patient: "Harshit Jaiswal", age: 23, gender: "Male",
    doctor: "Dr. David Kim", specialty: "Oncologist",
    phone: "7397414771", date: "18 Jan 2026", time: "5:00 PM",
    fee: 800, status: "Completed",
  },
  {
    id: 6, patient: "Rahul Gupta", age: 43, gender: "Male",
    doctor: "Dr. David Kim", specialty: "Oncologist",
    phone: "9876543210", date: "17 Jan 2026", time: "3:00 PM",
    fee: 800, status: "Pending",
  },
  {
    id: 7, patient: "Harshit Jaiswal", age: 34, gender: "Male",
    doctor: "Dr. David Kim", specialty: "Oncologist",
    phone: "7397414771", date: "16 Jan 2026", time: "11:00 AM",
    fee: 800, status: "Cancelled",
  },
  {
    id: 8, patient: "Abid Mohsin Zaidi", age: 56, gender: "Male",
    doctor: "Dr. David Kim", specialty: "Oncologist",
    phone: "9005073898", date: "15 Jan 2026", time: "4:30 PM",
    fee: 800, status: "Completed",
  },
  {
    id: 9, patient: "Priya Sharma", age: 30, gender: "Female",
    doctor: "Dr. David Kim", specialty: "Oncologist",
    phone: "8123456789", date: "14 Jan 2026", time: "9:00 AM",
    fee: 800, status: "Pending",
  },
];

/* ── Status config ─────────────────────────────────────── */
const statusStyles = {
  Completed: {
    badge: 'bg-emerald-500 text-white',
    select: 'border-emerald-300 text-emerald-700 bg-emerald-50',
  },
  Cancelled: {
    badge: 'bg-red-500 text-white',
    select: 'border-red-300 text-red-600 bg-red-50',
  },
  Pending: {
    badge: 'bg-yellow-400 text-white',
    select: 'border-yellow-300 text-yellow-700 bg-yellow-50',
  },
};

/* ── Avatar placeholder ────────────────────────────────── */
const Avatar = ({ name }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-teal-100 border-2 border-white shadow-sm flex items-center justify-center text-[#0d9488] font-black text-sm shrink-0">
      {initials}
    </div>
  );
};

/* ── Main Dashboard ────────────────────────────────────── */
const Dashboard = () => {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  const total     = appointments.length;
  const completed = appointments.filter(a => a.status === 'Completed').length;
  const cancelled = appointments.filter(a => a.status === 'Cancelled').length;
  const earnings  = completed * 800;

  const handleStatusChange = (id, newStatus) => {
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
    );
  };

  const stats = [
    {
      label: 'Total Appointments', value: total,
      icon: <CalendarCheck size={20} className="text-[#0d9488]" />,
      ring: 'border-teal-200', iconBg: 'bg-teal-50',
    },
    {
      label: 'Total Earnings', value: `₹ ${earnings.toLocaleString()}`,
      icon: <span className="text-yellow-500 font-black text-lg">₹</span>,
      ring: 'border-yellow-200', iconBg: 'bg-yellow-50',
    },
    {
      label: 'Completed', value: completed,
      icon: <CheckCircle2 size={20} className="text-emerald-500" />,
      ring: 'border-emerald-200', iconBg: 'bg-emerald-50',
    },
    {
      label: 'Cancelled', value: cancelled,
      icon: <XCircle size={20} className="text-red-400" />,
      ring: 'border-red-200', iconBg: 'bg-red-50',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16" style={fontStyle}>

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase" style={{ letterSpacing: '-0.01em' }}>
            {DOCTOR.name} <span className="text-gray-400 font-light mx-1">—</span> DASHBOARD
          </h1>
          <p className="text-xs text-[#0d9488] mt-1 font-medium tracking-wide">
            Showing appointments for doctor <span className="font-mono text-gray-400">{DOCTOR.id}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500 pt-1">
          <span className="font-medium">{total} total</span>
          <button
            onClick={() => setAppointments(INITIAL_APPOINTMENTS)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold hover:border-[#0d9488] hover:text-[#0d9488] transition-colors"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon, ring, iconBg }) => (
          <div key={label} className={`bg-white rounded-2xl border ${ring} p-5 flex items-center justify-between shadow-sm`}>
            <div>
              <p className="text-xs text-gray-400 font-semibold mb-1">{label}</p>
              <p className="text-2xl font-black text-gray-800">{value}</p>
            </div>
            <div className={`w-11 h-11 rounded-full ${iconBg} border ${ring} flex items-center justify-center`}>
              {icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── Latest Appointments ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <CalendarCheck size={18} className="text-[#0d9488]" />
            Latest Appointments
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
            <Users size={14} />
            {total} total
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {appointments.map((appt) => {
            const style = statusStyles[appt.status];
            return (
              <div
                key={appt.id}
                className="border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md hover:border-teal-100 transition-all duration-200"
              >
                {/* Patient Info */}
                <div className="flex items-center gap-2.5">
                  <Avatar name={appt.patient} />
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{appt.patient}</p>
                    <p className="text-xs text-gray-400">{appt.age} yrs · {appt.gender}</p>
                  </div>
                </div>

                {/* Doctor */}
                <div>
                  <p className="text-xs font-semibold text-gray-700">{appt.doctor}</p>
                  <p className="text-xs text-[#0d9488] font-medium">{appt.specialty}</p>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                  <Phone size={11} className="text-[#0d9488]" />
                  <span>{appt.phone}</span>
                </div>

                {/* Date / Time */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-700">{appt.date}</span>
                  <span className="text-gray-500">{appt.time}</span>
                </div>

                {/* Fee */}
                <p className="text-xs text-gray-400 font-medium">₹{appt.fee}</p>

                {/* Status + Dropdown */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  {/* Solid status badge */}
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${style.badge}`}>
                    {appt.status}
                  </span>
                  {/* Styled select matching status colour */}
                  <select
                    value={appt.status}
                    onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                    className={`flex-1 text-[10px] font-semibold border rounded-full px-2.5 py-1 outline-none cursor-pointer transition-colors ${style.select}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Reschedule */}
                <button className="text-[10px] font-semibold text-[#0d9488] hover:text-teal-800 hover:underline text-left tracking-wide">
                  Reschedule
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
