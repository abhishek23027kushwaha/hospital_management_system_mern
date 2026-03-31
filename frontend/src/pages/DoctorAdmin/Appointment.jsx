import React, { useState, useMemo } from 'react';
import { Search, CalendarDays, Phone, ChevronDown } from 'lucide-react';

const fontStyle = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

/* ── Mock Data ──────────────────────────────────────────── */
const ALL_APPOINTMENTS = [
  {
    id: 1, patient: 'Harshit Jaiswal', age: 23, gender: 'Male',
    doctor: 'Dr. David Kim', specialty: 'Oncologist',
    phone: '7397414771', date: '22 Jan 2026', time: '6:00 PM',
    fee: 800, status: 'Cancelled',
  },
  {
    id: 2, patient: 'Rt', age: 23, gender: 'Female',
    doctor: 'Dr. David Kim', specialty: 'Oncologist',
    phone: '7397414771', date: '22 Jan 2026', time: '6:00 PM',
    fee: 800, status: 'Completed',
  },
  {
    id: 3, patient: 'Bintey Zehra Zaidi', age: 44, gender: 'Male',
    doctor: 'Dr. David Kim', specialty: 'Oncologist',
    phone: '9005073898', date: '20 Jan 2026', time: '6:00 PM',
    fee: 800, status: 'Pending',
  },
  {
    id: 4, patient: 'Bintey Zehra Zaidi', age: 77, gender: 'Male',
    doctor: 'Dr. David Kim', specialty: 'Oncologist',
    phone: '9005079655', date: '19 Jan 2026', time: '10:00 PM',
    fee: 800, status: 'Pending',
  },
  {
    id: 5, patient: 'Harshit Jaiswal', age: 23, gender: 'Male',
    doctor: 'Dr. David Kim', specialty: 'Oncologist',
    phone: '7397414771', date: '11 Jan 2026', time: '10:00 PM',
    fee: 800, status: 'Completed',
  },
  {
    id: 6, patient: 'Rahul Gupta', age: 45, gender: 'Male',
    doctor: 'Dr. David Kim', specialty: 'Oncologist',
    phone: '1234567899', date: '11 Jan 2026', time: '10:00 PM',
    fee: 800, status: 'Completed',
  },
  {
    id: 7, patient: 'Harshit Jaiswal', age: 54, gender: 'Male',
    doctor: 'Dr. David Kim', specialty: 'Oncologist',
    phone: '7397414771', date: '10 Jan 2026', time: '10:00 PM',
    fee: 800, status: 'Pending',
  },
  {
    id: 8, patient: 'Abid Mohsin Zaidi', age: 56, gender: 'Male',
    doctor: 'Dr. David Kim', specialty: 'Oncologist',
    phone: '9005073898', date: '10 Jan 2026', time: '10:00 PM',
    fee: 800, status: 'Pending',
  },
  {
    id: 9, patient: 'Priya Sharma', age: 30, gender: 'Female',
    doctor: 'Dr. David Kim', specialty: 'Oncologist',
    phone: '8123456789', date: '08 Jan 2026', time: '9:00 AM',
    fee: 800, status: 'Pending',
  },
  {
    id: 10, patient: 'Ananya Verma', age: 28, gender: 'Female',
    doctor: 'Dr. David Kim', specialty: 'Oncologist',
    phone: '9876512340', date: '07 Jan 2026', time: '11:00 AM',
    fee: 800, status: 'Completed',
  },
  {
    id: 11, patient: 'Ravi Bhatia', age: 60, gender: 'Male',
    doctor: 'Dr. David Kim', specialty: 'Oncologist',
    phone: '9012345678', date: '06 Jan 2026', time: '3:00 PM',
    fee: 800, status: 'Cancelled',
  },
  {
    id: 12, patient: 'Sunita Rao', age: 42, gender: 'Female',
    doctor: 'Dr. David Kim', specialty: 'Oncologist',
    phone: '8765432109', date: '05 Jan 2026', time: '5:00 PM',
    fee: 800, status: 'Pending',
  },
];

/* ── Status config ──────────────────────────────────────── */
const statusConfig = {
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

/* ── Avatar ─────────────────────────────────────────────── */
const Avatar = ({ name }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-teal-100 border-2 border-white shadow-sm flex items-center justify-center text-[#0d9488] font-black text-sm shrink-0">
      {initials}
    </div>
  );
};

/* ── Appointment Card ───────────────────────────────────── */
const AppointmentCard = ({ appt, onStatusChange }) => {
  const style = statusConfig[appt.status];
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md hover:border-teal-100 transition-all duration-200">
      {/* Patient row */}
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

      {/* Date / Time */}
      <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
        <CalendarDays size={12} className="text-[#0d9488] shrink-0" />
        <span>{appt.date} : {appt.time}</span>
      </div>

      {/* Fee */}
      <p className="text-xs font-semibold text-gray-700">₹{appt.fee}</p>

      {/* Phone */}
      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
        <Phone size={11} className="text-[#0d9488]" />
        <span>{appt.phone}</span>
      </div>

      {/* Status badge + dropdown */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${style.badge}`}>
          {appt.status}
        </span>
        <div className="relative flex-1">
          <select
            value={appt.status}
            onChange={(e) => onStatusChange(appt.id, e.target.value)}
            className={`w-full appearance-none text-[10px] font-semibold border rounded-full px-2.5 py-1 pr-6 outline-none cursor-pointer transition-colors ${style.select}`}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
      </div>

      {/* Reschedule */}
      <button className="text-[10px] font-semibold text-[#0d9488] hover:text-teal-800 hover:underline text-right tracking-wide transition-colors">
        Reschedule
      </button>
    </div>
  );
};

/* ── Main Appointments Page ─────────────────────────────── */
const Appointment = () => {
  const [appointments, setAppointments] = useState(ALL_APPOINTMENTS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const matchSearch = a.patient.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'All' || a.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [appointments, search, filterStatus]);

  const handleStatusChange = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16" style={fontStyle}>

      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">All Appointments</h1>
        <p className="text-xs text-[#0d9488] font-medium mt-0.5">
          Latest at top — search by patient name
        </p>
      </div>

      {/* ── Toolbar: Search + Filter ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search patient name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-gray-200 bg-white outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none text-sm font-semibold border border-gray-200 rounded-full px-4 py-2 pr-8 bg-white text-gray-600 outline-none cursor-pointer focus:border-[#0d9488] transition-colors"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
      </div>

      {/* ── Cards Grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appt={appt}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mb-4">
            <Search size={22} className="text-[#0d9488]" />
          </div>
          <p className="text-gray-500 font-semibold text-sm">No appointments found</p>
          <p className="text-gray-400 text-xs mt-1">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
};

export default Appointment;
