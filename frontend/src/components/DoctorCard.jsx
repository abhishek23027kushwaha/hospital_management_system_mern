import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, ChevronRight } from 'lucide-react';

const DoctorCard = ({ _id, name, speciality, specialization, experience, image, rating }) => {
  const displaySpeciality = speciality || specialization || "Medical Specialist";
  const displayRating = typeof rating === 'number' ? rating.toFixed(1) : "4.9";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl p-5 shadow-lg shadow-gray-100 border border-gray-100 flex flex-col group cursor-pointer h-full"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-50 mb-5 aspect-[4/3]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-gray-700">{displayRating}</span>
        </div>
      </div>

      {/* Info */}
      <div className="mb-3">
        <h3 className="text-lg font-black text-gray-800 tracking-tight leading-tight line-clamp-1">{name}</h3>
        <p className="text-[#1e584a] font-bold text-sm mt-0.5 line-clamp-1">{displaySpeciality}</p>
      </div>

      {/* Experience Badge */}
      <div className="inline-flex items-center gap-1.5 bg-[#f0f9f6] text-[#22c55e] px-3 py-1 rounded-full w-fit mb-5">
        <Clock size={12} />
        <span className="text-[10px] font-black uppercase tracking-wider">{experience} Years Experience</span>
      </div>

      {/* Book Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = `/book-appointment/${_id || ""}`;
        }}
        className="w-full bg-gradient-to-r from-[#22c55e] to-[#10b981] text-white py-3 rounded-xl font-black flex items-center justify-center gap-1.5 shadow-md shadow-green-500/20 hover:shadow-green-500/40 transition-all active:scale-95 mt-auto"
      >
        <ChevronRight size={16} />
        Book Now
      </button>
    </motion.div>
  );
};

export default DoctorCard;
