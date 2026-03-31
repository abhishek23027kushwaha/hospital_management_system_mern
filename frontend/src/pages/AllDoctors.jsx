import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import axios from 'axios';
import DoctorCard from '../components/DoctorCard';

const API_BASE = 'http://localhost:8000/api';

const SPECIALITIES = [
  'All', 'Cardiologist', 'Neurologist', 'Pediatrician', 'Dermatologist',
  'Oncologist', 'Orthopedic Surgeon', 'Nephrologist', 'Gastroenterologist',
  'Gynecologist', 'Pulmonologist', 'Endocrinologist', 'Urologist',
  'Rheumatologist', 'Psychiatrist', 'Ophthalmologist', 'ENT Specialist',
];

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [activeSpeciality, setActiveSpeciality] = useState('All');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/doctor/all`);
        if (data.success) {
          setDoctors(data.doctors);
        }
      } catch (err) {
        setError("Failed to load medical staff");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filtered = doctors.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(query.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      activeSpeciality === 'All' || doc.specialization === activeSpeciality;
    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent mb-4"></div>
        <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Searching Database...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#e8f8f3] to-blue-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-800">
            Find Your <span className="text-[#22c55e]">Specialist</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Browse our team of {doctors.length}+ verified healthcare professionals.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mt-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name or speciality..."
              className="w-full pl-11 pr-10 py-4 rounded-2xl bg-white border border-gray-200 shadow-lg shadow-gray-100 text-gray-700 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 font-bold text-center">
            {error}
          </div>
        )}

        {/* Speciality Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          {SPECIALITIES.map(spec => (
            <button
              key={spec}
              onClick={() => setActiveSpeciality(spec)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                activeSpeciality === spec
                  ? 'bg-[#1e584a] text-white border-[#1e584a] shadow-md shadow-green-900/10'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#22c55e] hover:text-[#1e584a]'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-gray-400 text-sm mb-8 font-medium">
          Showing <span className="text-[#1e584a] font-black">{filtered.length}</span> doctor{filtered.length !== 1 ? 's' : ''}
          {query && <span> for &ldquo;<span className="text-gray-600">{query}</span>&rdquo;</span>}
        </p>

        {/* Doctor Grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filtered.map((doc, index) => (
                <motion.div
                  key={doc._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                >
                  <DoctorCard {...doc} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="text-6xl mb-4">🔍</p>
              <h3 className="text-xl font-black text-gray-600 mb-2">No doctors found</h3>
              <p className="text-gray-400 text-sm">Try a different name or speciality</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AllDoctors;
