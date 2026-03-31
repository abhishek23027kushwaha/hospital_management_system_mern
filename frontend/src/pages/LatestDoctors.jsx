import React from 'react';
import DoctorCard from '../components/DoctorCard';
import doctor_img from '../assets/doctor_main.png';

const Doctors = () => {
  const doctors = [
    { name: "Dr. David Kim", speciality: "Oncologist", experience: "7 years", image: doctor_img },
    { name: "Dr. Emily Rodriguez", speciality: "Pediatrician", experience: "8 years", image: doctor_img },
    { name: "Dr. Kabir Malhotra", speciality: "Nephrologist", experience: "7 years", image: doctor_img },
    { name: "Dr. Rahul Sharma", speciality: "Cardiologist", experience: "10 years", image: doctor_img },
    { name: "Dr. James Wilson", speciality: "Orthopedic Surgeon", experience: "12 years", image: doctor_img },
    { name: "Dr. Sarah Jenkins", speciality: "Dermatologist", experience: "6 years", image: doctor_img },
    { name: "Dr. Michael Chen", speciality: "Neurologist", experience: "9 years", image: doctor_img },
    { name: "Dr. Lisa Wang", speciality: "Gastroenterologist", experience: "7 years", image: doctor_img },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
      <div className="text-center mb-20 space-y-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl font-serif font-black text-gray-800 flex items-center gap-2">
            <span className="text-[#22c55e]">Our</span> Medical Team
          </span>
        </div>
        <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto">
          Book appointments quickly with our verified specialists.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {doctors.map((doc, index) => (
          <DoctorCard key={index} {...doc} />
        ))}
      </div>
      
      <div className="flex justify-center mt-24">
        <button className="group relative bg-[#1e584a] text-white px-12 py-5 rounded-[24px] font-black shadow-2xl shadow-green-900/20 hover:scale-105 transition-all active:scale-95 cursor-pointer overflow-hidden">
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
