import React from 'react';
import { Link } from 'react-router-dom';
import { useState ,useEffect} from 'react';
import axios from '../utils/axiosInstance';
// ── Service Images ─────────────────────────────────────────────
import imgBloodTest from '../assets/service-blood-test.png';
import imgXray from '../assets/service-xray.png';
import imgBP from '../assets/service-bp-monitor.png';
import imgBloodSugar from '../assets/service-blood-sugar.png';

// ── Services Data ──────────────────────────────────────────────
const highlights = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "NABL Certified Lab",
    desc: "All tests conducted in certified, accredited laboratories.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Same-Day Reports",
    desc: "Get your diagnostic results on the same day, digitally.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "Home Collection",
    desc: "Sample collection available at your doorstep, 7 days a week.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Expert Pathologists",
    desc: "Results reviewed and validated by senior pathologists.",
  },
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const { data } = await axios.get('/services');
      if (data.success) {
        setServices(data.services);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Hero Banner ──────────────────────────────────────── */}
      <section className="relative py-20 px-6 text-center bg-[#ecfdf5]">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#114232]">
            Our Diagnostic Services
          </h1>
          <p className="text-[#34ad7b] text-lg md:text-xl font-medium">
            Safe, accurate &amp; reliable testing.
          </p>
        </div>
      </section>

      {/* ── Service Cards ─────────────────────────────────────── */}
      <section className="py-14 px-6 bg-emerald-50/30">
        <div className="max-w-[1200px] mx-auto">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((svc) => (
                <div
                  key={svc._id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100 flex flex-col"
                >
                  {/* Image + Tag */}
                  <div className="relative h-52 bg-gray-50 overflow-hidden">
                    <span className={`absolute top-3 left-3 z-10 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>
                      {svc.available ? 'Available' : 'Unavailable'}
                    </span>
                    <img
                      src={svc.image || imgBloodTest}
                      alt={svc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-col flex-1 p-5 gap-4">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-gray-800 group-hover:text-emerald-700 transition-colors leading-snug">
                        {svc.name}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{svc.about || svc.description}</p>
                    </div>

                    {/* Duration + Price */}
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                        {svc.duration || "Consultation"}
                      </span>
                      <span className="font-bold text-emerald-600 text-sm">₹{svc.price}</span>
                    </div>

                    {/* Book Now */}
                    <Link
                      to={`/book-service/${svc._id}`}
                      className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-lg shadow-green-500/20"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" />
                      </svg>
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────── */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Why Choose <span className="text-green-500">MediCare</span> Diagnostics?
            </h2>
            <p className="text-gray-500 text-sm mt-2">We combine technology with compassion for accurate results you can trust.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-[#ecfdf5] hover:bg-[#d1fae5] transition-colors duration-200 border border-emerald-100"
              >
                <div className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md shadow-green-200">
                  {h.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{h.title}</h3>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      {/* <section
        className="py-14 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)" }}
      >
        <div className="max-w-2xl mx-auto space-y-5">
          <h2 className="text-3xl font-bold text-white">Ready to Book Your Test?</h2>
          <p className="text-emerald-100 text-sm">
            Schedule your appointment online or visit us directly. Our team is available 7 days a week.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/appointments"
              className="px-8 py-3 bg-white text-emerald-700 font-bold rounded-full text-sm hover:shadow-lg hover:shadow-emerald-800/30 transition-all duration-200"
            >
              Book Appointment
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-full text-sm hover:bg-white/10 transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Services;
