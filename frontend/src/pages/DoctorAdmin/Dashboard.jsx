import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Users, CalendarCheck, CheckCircle2, XCircle, Phone } from 'lucide-react';
import axios from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { selectDoctor } from '../../redux/doctor.slice';

/* Inter font */

const fontStyle = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

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
  if (!name) return <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-black text-sm shrink-0">??</div>;
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-teal-100 border-2 border-white shadow-sm flex items-center justify-center text-[#0d9488] font-black text-sm shrink-0">
      {initials}
    </div>
  );
};

/* ── Main Dashboard ────────────────────────────────────── */
const Dashboard = () => {
  const doctor = useSelector(selectDoctor);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, cancelled: 0, earnings: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/doctor/appointments`);
      console.log(data);
      if (data.success) {
        setAppointments(data.appointments);
        setStats(data.stats);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await axios.put(`/doctor/appointments/${id}/status`, { status: newStatus });
      if (data.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchDashboardData(); // Refresh all stats & list
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  const statCards = [
    {
      label: 'Total Appointments', value: stats.total,
      icon: <CalendarCheck size={20} className="text-[#0d9488]" />,
      ring: 'border-teal-200', iconBg: 'bg-teal-50',
    },
    {
      label: 'Total Earnings', value: `₹ ${stats.earnings.toLocaleString()}`,
      icon: <span className="text-yellow-500 font-black text-lg">₹</span>,
      ring: 'border-yellow-200', iconBg: 'bg-yellow-50',
    },
    {
      label: 'Completed', value: stats.completed,
      icon: <CheckCircle2 size={20} className="text-emerald-500" />,
      ring: 'border-emerald-200', iconBg: 'bg-emerald-50',
    },
    {
      label: 'Cancelled', value: stats.cancelled,
      icon: <XCircle size={20} className="text-red-400" />,
      ring: 'border-red-200', iconBg: 'bg-red-50',
    },
  ];

  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <RefreshCw className="animate-spin text-teal-600" size={40} />
        <p className="text-gray-500 font-bold animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16" style={fontStyle}>

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase" style={{ letterSpacing: '-0.01em' }}>
            {doctor?.name || "Doctor Dashboard"}
          </h1>
          {/* <p className="text-[10px] text-gray-400 font-mono mt-1">ID {doctor?._id}</p> */}
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500 pt-1">
          <span className="font-medium">{stats.total} total</span>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold hover:border-[#0d9488] hover:text-[#0d9488] transition-colors"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map(({ label, value, icon, ring, iconBg }) => (
          <div key={label} className={`bg-white rounded-2xl border ${ring} p-5 flex items-center justify-between shadow-sm transition-all hover:shadow-md`}>
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
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <CalendarCheck size={18} className="text-[#0d9488]" />
            Latest Appointments
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
            <Users size={14} />
            {stats.total} total
          </div>
        </div>

        {/* Empty State */}
        {appointments.length === 0 && (
          <div className="py-20 text-center space-y-4">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
               <CalendarCheck size={32} />
             </div>
             <p className="text-gray-400 font-bold">No appointments found yet.</p>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {appointments.map((appt) => {
            const style = statusStyles[appt.status] || statusStyles.Pending;
            const patient = appt.patient || {};
            
            return (
              <div
                key={appt._id}
                className="border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md hover:border-teal-100 transition-all duration-200"
              >
                {/* Patient Info */}
                <div className="flex items-center gap-2.5">
                  <Avatar name={patient.name} />
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{patient.name}</p>
                    <p className="text-xs text-gray-400">{patient.age || 'N/A'} yrs · {patient.gender || 'N/A'}</p>
                  </div>
                </div>

                {/* Patient Contact */}
                <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                  <Phone size={11} className="text-[#0d9488]" />
                  <span>{patient.phone || 'No phone'}</span>
                </div>

                {/* Appointment Date/Time (from the slot or appt itself) */}
                <div className="flex flex-col gap-1 py-1 px-3 bg-teal-50/50 rounded-xl border border-teal-50">
                   <div className="flex justify-between items-center text-[10px] font-black text-teal-700 uppercase tracking-wider">
                     <span>{appt.date}</span>
                     <span>{appt.timeSlot}</span>
                   </div>
                </div>

                {/* Fee */}
                <div className="flex justify-between items-center">
                   <p className="text-[10px] text-gray-400 font-black uppercase">Cons. Fee</p>
                   <p className="text-sm font-black text-gray-800">₹{appt.fee}</p>
                </div>

                {/* Status + Dropdown */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-auto">
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-full whitespace-nowrap uppercase tracking-widest shadow-sm ${style.badge}`}>
                    {appt.status}
                  </span>
                  <select
                    value={appt.status}
                    onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                    className={`flex-1 text-[10px] font-bold border rounded-full px-2.5 py-1.5 outline-none cursor-pointer transition-colors shadow-sm ${style.select}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
