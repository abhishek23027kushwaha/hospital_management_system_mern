import React from 'react';
import { motion } from 'framer-motion';
import logo1 from '../assets/logo1.png';
import logo2 from '../assets/logo2.png';
import logo3 from '../assets/logo3.png';
import logo4 from '../assets/logo4.png';
import certifications from '../assets/certifications.png';

const Certified = () => {
  const logos = [
    { name: "Government Approved", src: logo1 },
    { name: "NABH Accredited", src: logo2 },
    { name: "Medical Council", src: logo3 },
    { name: "Quality Healthcare", src: logo4 },

  ];

  // For seamless marquee, we duplicate the logos
  const marqueeLogos = [...logos, ...logos, ...logos];

  return (
    <section className="py-24 bg-white overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center justify-center w-full mb-4">
            <div className="hidden md:block h-[1px] bg-gradient-to-r from-transparent to-gray-200 flex-grow max-w-[200px]"></div>
            <h2 className="mx-8 text-4xl md:text-5xl font-serif font-black text-[#1e584a] text-center tracking-tight uppercase">
              CERTIFIED & EXCELLENCE
            </h2>
            <div className="hidden md:block h-[1px] bg-gradient-to-l from-transparent to-gray-200 flex-grow max-w-[200px]"></div>
          </div>
          <p className="text-center text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Government recognized and internationally accredited healthcare standards
          </p>
        </div>

        {/* Marquee - Centered and Right to Left */}
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden py-12 bg-gradient-to-r from-transparent via-[#f0f9f6]/40 to-transparent">
          <motion.div 
            className="flex items-center"
            animate={{
              x: ["0%", "-33.33%"]
            }}
            transition={{
              ease: "linear",
              duration: 25, // Slightly faster for responsiveness
              repeat: Infinity
            }}
          >
            {marqueeLogos.map((logo, index) => (
              <div
                key={index}
                className="flex flex-col items-center flex-shrink-0 px-20 group"
              >
                <div className="relative w-28 h-28 mb-6 flex items-center justify-center bg-transparent group-hover:scale-110 transition-all duration-500 ease">
                  <div className="w-full h-full overflow-hidden flex items-center justify-center p-2 rounded-2xl bg-white/50 shadow-sm border border-gray-50">
                     <img 
                      src={logo.src} 
                      alt={logo.name}
                      className={`w-full h-full object-contain transition-all duration-500 ease-in-out ${logo.isSprite ? 'scale-[3.5]' : 'scale-110'}`}
                      style={logo.isSprite ? { objectPosition: logo.pos } : {}}
                    />
                  </div>
                </div>
                <span className="text-sm font-black text-[#1e584a] transition-all duration-300 text-center tracking-wider max-w-[130px] leading-tight">
                  {logo.name}
                </span>
              </div>
            ))}
          </motion.div>
          
          {/* Fading gradients on sides for smoothness */}
          <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-white via-white/80 to-transparent z-10"></div>
        </div>

        {/* Experience Stats Section */}
        <div className="mt-32 pt-16 border-t border-gray-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: "Years of Excellence", value: "25+", icon: "🏆" },
              { label: "Expert Doctors", value: "500+", icon: "👨‍⚕️" },
              { label: "Happy Patients", value: "10k+", icon: "😊" },
              { label: "Success Rate", value: "99%", icon: "⭐" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center p-8 rounded-3xl bg-gradient-to-br from-white to-[#f0f9f6] border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-4xl mb-4">{stat.icon}</span>
                <span className="text-4xl font-black text-[#1e584a] mb-2">{stat.value}</span>
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certified;
