import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, CalendarDays, Phone, ChevronDown, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const fontStyle = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

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
  if (!name) return <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-black text-sm shrink-0">??</div>;
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
  const style = statusConfig[appt.status] || statusConfig.Pending;
  const patient = appt.patient || {};

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md hover:border-teal-100 transition-all duration-200">
      {/* Patient row */}
      <div className="flex items-center gap-2.5">
        <Avatar name={patient.name} />
        <div className="min-w-0">
          <p className="font-bold text-gray-800 text-sm truncate">{patient.name || 'Unknown'}</p>
          <p className="text-xs text-gray-400">{patient.age || 'N/A'} yrs · {patient.gender || 'N/A'}</p>
        </div>
      </div>

      {/* Date / Time */}
      <div className="flex flex-col gap-1 py-1 px-3 bg-teal-50/50 rounded-xl border border-teal-50">
         <div className="flex justify-between items-center text-[10px] font-black text-teal-700 uppercase tracking-wider">
           <span>{appt.date}</span>
           <span>{appt.time}</span>
         </div>
      </div>

      {/* Fee */}
      <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
        <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Consult Fee</span>
        <span>₹{appt.fee}</span>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
        <Phone size={11} className="text-[#0d9488]" />
        <span>{patient.phone || 'No phone'}</span>
      </div>

      {/* Status badge + dropdown */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-auto">
        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full whitespace-nowrap uppercase tracking-widest shadow-sm ${style.badge}`}>
          {appt.status}
        </span>
        <div className="relative flex-1">
          <select
            value={appt.status}
            onChange={(e) => onStatusChange(appt._id, e.target.value)}
            className={`w-full appearance-none text-[10px] font-bold border rounded-full px-2.5 py-1.5 pr-6 outline-none cursor-pointer transition-colors shadow-sm ${style.select}`}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
      </div>

      {/* Action links */}
      <button className="text-[10px] font-bold text-[#0d9488] hover:text-teal-800 hover:underline text-right tracking-widest uppercase transition-colors">
        Manage Booking
      </button>
    </div>
  );
};

/* ── Main Appointments Page ─────────────────────────────── */
const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/doctor/appointments', { withCredentials: true });
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const patientName = a.patient?.name || '';
      const matchSearch = patientName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'All' || a.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [appointments, search, filterStatus]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await axios.put(`/api/doctor/appointments/${id}/status`, { status: newStatus }, { withCredentials: true });
      if (data.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchAppointments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 py-32">
        <RefreshCw className="animate-spin text-[#0d9488]" size={32} />
        <p className="text-gray-500 font-bold animate-pulse tracking-widest uppercase text-xs">Syncing Appointments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16" style={fontStyle}>

      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">All Appointments</h1>
      </div>

      {/* ── Toolbar: Search + Filter ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by patient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm font-medium rounded-2xl border border-gray-100 bg-white outline-none focus:border-[#0d9488] focus:ring-4 focus:ring-teal-50 transition-all placeholder-gray-300 shadow-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none text-xs font-black uppercase tracking-widest border border-gray-100 rounded-2xl px-5 py-2.5 pr-9 bg-white text-gray-600 outline-none cursor-pointer focus:border-[#0d9488] transition-colors shadow-sm"
            >
              <option value="All">All Stats</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
        </div>

        <button 
          onClick={fetchAppointments}
          className="p-2.5 rounded-2xl border border-gray-100 text-gray-400 hover:text-[#0d9488] hover:border-teal-100 transition-all shadow-sm active:scale-90"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ── Cards Grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((appt) => (
            <AppointmentCard
              key={appt._id}
              appt={appt}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-5">
            <CalendarDays size={28} className="text-gray-200" />
          </div>
          <p className="text-gray-500 font-black tracking-tight text-lg">No appointments found</p>
          <p className="text-gray-400 text-xs mt-1 font-medium italic">We couldn&apos;t find any bookings matching your criteria.</p>
          {(search || filterStatus !== 'All') && (
            <button 
               onClick={() => { setSearch(''); setFilterStatus('All'); }}
               className="mt-6 text-xs font-black text-[#0d9488] uppercase tracking-widest hover:underline underline-offset-4"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Appointment;
