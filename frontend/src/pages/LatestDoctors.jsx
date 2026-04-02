import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DoctorCard from '../components/DoctorCard';

const API_BASE = 'http://localhost:8000/api';

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/doctor/all?available=true`);
        if (data.success) {
          setDoctors(data.doctors.slice(0, 8)); // Top 8
        }
      } catch (err) {
        setError("Failed to load specialists");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 mt-24 py-20 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
      <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Specialists...</p>
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
      <div className="text-center mb-20 space-y-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl md:text-5xl font-serif font-black text-gray-800 flex items-center gap-2">
            <span className="text-[#22c55e]">Our</span> Medical Team
          </span>
        </div>
        <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto">
          Book appointments quickly with our verified specialists.
        </p>
      </div>

      {error ? (
        <div className="text-center py-10 bg-red-50 rounded-3xl border border-red-100">
          <p className="text-red-500 font-bold">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {doctors.map((doc) => (
            <DoctorCard key={doc._id} {...doc} />
          ))}
        </div>
      )}
      
      <div className="flex justify-center mt-24">
        <button 
          onClick={() => navigate('/doctors')}
          className="group relative bg-green-500 text-white px-12 py-5 rounded-[24px] font-black shadow-2xl shadow-green-900/10 hover:scale-105 transition-all active:scale-95 cursor-pointer overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Explore All Specialists
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </section>
  );
};

export default Doctors;
