import React from "react";
import { motion } from "framer-motion";
import { 
  Stethoscope, 
  Star, 
  ShieldCheck, 
  Clock, 
  Users, 
  PhoneCall, 
  CalendarCheck 
} from "lucide-react";
import doctorsHero from "../assets/BannerImg.png";

const HeroSection = () => {
  return (
    <div className="relative max-w-7xl mx-auto mt-8 mb-16 p-1">
      {/* Animated Border SVG */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <motion.rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="24"
            fill="transparent"
            stroke="#22c55e"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1], 
              opacity: [0, 1, 1, 0],
              pathOffset: [0, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 0.5
            }}
          />
        </svg>
      </div>

      {/* Main Card Content */}
      <div className="bg-white rounded-[24px] shadow-2xl shadow-green-900/5 overflow-hidden flex flex-col md:flex-row items-center p-8 md:p-12 relative z-10 border border-gray-100">
        
        {/* Left Content */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                <Stethoscope size={32} />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-gray-800 flex items-center gap-1">
                  MediCare<span className="text-green-500">+</span>
                </span>
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl font-light text-gray-500 tracking-wide">Premium Healthcare</h2>
              <h1 className="text-5xl font-black text-green-600 tracking-tight">At Your Fingertips</h1>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, text: "Certified Specialists" },
              { icon: Clock, text: "24/7 Availability" },
              { icon: ShieldCheck, text: "Safe & Secure" },
              { icon: Users, text: "500+ Doctors" },
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-green-100/50 p-4 rounded-2xl border border-green-100 group hover:scale-105 transition-transform cursor-default"
              >
                <item.icon className="text-green-600 size-5" />
                <span className="text-sm font-bold text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-400 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-green-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
              <CalendarCheck className="size-5" />
              Book Appointment Now
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-red-400 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
              <PhoneCall className="size-5" />
              Emergency Call
            </button>
          </div>
        </div>

        {/* Right Content - Image */}
        <div className="flex-1 mt-12 md:mt-0 relative group">
          <div className="absolute inset-0 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-colors" />
          <motion.img 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            src={doctorsHero} 
            alt="Medical Team" 
            className="relative z-10 w-full max-w-lg mx-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
