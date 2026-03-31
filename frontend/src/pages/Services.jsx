import React from 'react';
import { Link } from 'react-router-dom';

// ── Service Images ─────────────────────────────────────────────
import imgBloodTest from '../assets/service-blood-test.png';
import imgXray from '../assets/service-xray.png';
import imgBP from '../assets/service-bp-monitor.png';
import imgBloodSugar from '../assets/service-blood-sugar.png';

// ── Services Data ──────────────────────────────────────────────
const services = [
  {
    id: 1,
    name: "Full Body Health Checkup",
    description: "Complete head-to-toe examination with comprehensive lab tests to assess your overall health status.",
    image: imgBloodTest,
    duration: "2–3 hours",
    price: "₹1,499",
    tag: "Most Popular",
    tagColor: "bg-emerald-500",
  },
  {
    id: 2,
    name: "X-Ray Scan",
    description: "High-resolution digital X-ray imaging for accurate diagnosis of bones, lungs, and internal organs.",
    image: imgXray,
    duration: "30 mins",
    price: "₹599",
    tag: "Quick",
    tagColor: "bg-teal-500",
  },
  {
    id: 3,
    name: "Blood Pressure Check",
    description: "Accurate blood pressure monitoring using advanced digital equipment with instant results.",
    image: imgBP,
    duration: "15 mins",
    price: "₹199",
    tag: "Walk-in",
    tagColor: "bg-cyan-500",
  },
  {
    id: 4,
    name: "Blood Sugar Test",
    description: "Precise blood glucose level measurement to monitor and manage diabetes effectively.",
    image: imgBloodSugar,
    duration: "20 mins",
    price: "₹299",
    tag: "Essential",
    tagColor: "bg-emerald-600",
  },
];

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
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Hero Banner ──────────────────────────────────────── */}
      <section
        className="relative py-16 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-emerald-300/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-teal-300/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-sm rounded-full text-emerald-700 text-xs font-semibold border border-emerald-200 mb-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Safe, accurate &amp; reliable testing.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 leading-tight">
            <span className="border-b-4 border-emerald-400 pb-1">Our</span>{" "}
            Diagnostic Services
          </h1>
          <p className="text-emerald-700 text-base md:text-lg max-w-xl mx-auto">
            Advanced medical diagnostics with precision equipment and expert pathologists — all under one roof.
          </p>
        </div>
      </section>

      {/* ── Service Cards ─────────────────────────────────────── */}
      <section className="py-14 px-6 bg-emerald-50/30">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Image + Tag */}
                <div className="relative h-52 bg-gray-50 overflow-hidden">
                  <span className={`absolute top-3 left-3 z-10 ${svc.tagColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>
                    {svc.tag}
                  </span>
                  <img
                    src={svc.image}
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
                    <p className="text-xs text-gray-500 leading-relaxed">{svc.description}</p>
                  </div>

                  {/* Duration + Price */}
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      {svc.duration}
                    </span>
                    <span className="font-bold text-emerald-600 text-sm">{svc.price}</span>
                  </div>

                  {/* Book Now */}
                  <Link
                    to="/appointments"
                    className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors duration-200 shadow-md shadow-emerald-100"
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
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────── */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Why Choose <span className="text-emerald-600">MediCare</span> Diagnostics?
            </h2>
            <p className="text-gray-500 text-sm mt-2">We combine technology with compassion for accurate results you can trust.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition-colors duration-200 border border-emerald-100"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-200">
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
      <section
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
      </section>
    </div>
  );
};

export default Services;
