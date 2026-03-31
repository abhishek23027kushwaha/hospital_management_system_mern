import React, { useState } from 'react';

const departments = [
  "Cardiology", "Neurology", "Pediatrics", "Surgery", "Oncology",
  "Dermatology", "Dentistry", "Nephrology", "Gynecology",
  "Orthopedics", "Ophthalmology", "General Medicine",
];

const services = [
  "General Consultation", "Full Body Health Checkup", "Blood Pressure Check",
  "Blood Sugar Test", "X-Ray Scan", "Full Blood Count",
  "Vaccination", "Dental Checkup", "Eye Examination", "Physiotherapy",
];

const Contact = () => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", department: "", service: "", message: "",
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleWhatsApp = (e) => {
    e.preventDefault();
    const text = `Hello MediCare! 👋

*Name:* ${form.name}
*Email:* ${form.email}
*Phone:* ${form.phone}
*Department:* ${form.department || "Not specified"}
*Service:* ${form.service || "Not specified"}

*Message:*
${form.message}`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/918299431275?text=${encoded}`, "_blank");
  };

  const canSubmit = form.name && form.phone && form.message;

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section
        className="relative py-12 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)" }}
      >
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-emerald-300/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-teal-300/25 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur rounded-full text-emerald-700 text-xs font-semibold border border-emerald-200">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            We reply via WhatsApp instantly
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900">Get In Touch</h1>
          <p className="text-emerald-700 text-sm md:text-base">
            Have a question or need to book? Fill the form and we'll connect you instantly.
          </p>
        </div>
      </section>

      {/* ── Main Layout ────────────────────────────────────── */}
      <section className="flex-1 py-12 px-4 bg-emerald-50/30">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* ─ Contact Form ─ */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-900">Contact Our Clinic</h2>
              <p className="text-emerald-600 text-sm mt-1 italic">
                Fill the form — we'll open WhatsApp so you can connect with us instantly.
              </p>
            </div>

            <form onSubmit={handleWhatsApp} className="space-y-5">
              {/* Row 1 — Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Full Name
                  </label>
                  <input
                    type="text" placeholder="Full name"
                    value={form.name} onChange={(e) => update("name", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-gray-300"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </label>
                  <input
                    type="email" placeholder="example@domain.com"
                    value={form.email} onChange={(e) => update("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-gray-300"
                  />
                </div>
              </div>

              {/* Row 2 — Phone + Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone
                  </label>
                  <input
                    type="tel" placeholder="1234567890"
                    value={form.phone} onChange={(e) => update("phone", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-gray-300"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    Department
                  </label>
                  <select
                    value={form.department} onChange={(e) => update("department", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all bg-white"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 3 — Service */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Service
                </label>
                <select
                  value={form.service} onChange={(e) => update("service", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all bg-white"
                >
                  <option value="">Select Service (or choose Department above)</option>
                  {services.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Row 4 — Message */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Message
                </label>
                <textarea
                  rows={4} placeholder="Describe your concern briefly..."
                  value={form.message} onChange={(e) => update("message", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all resize-none placeholder-gray-300"
                />
              </div>

              {/* WhatsApp Submit Button */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex items-center gap-2 px-7 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-full text-sm transition-all shadow-lg shadow-emerald-200 active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Send via WhatsApp
              </button>
            </form>
          </div>

          {/* ─ Right Sidebar ─ */}
          <div className="flex flex-col gap-5">

            {/* Visit Our Clinic Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Visit Our Clinic</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 text-gray-600">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Gomtinagar, Lucknow, Uttar Pradesh</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+918299431275" className="hover:text-emerald-600 transition-colors">8299431275</a>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:hexagonsservices@gmail.com" className="hover:text-emerald-600 transition-colors">hexagonsservices@gmail.com</a>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Our Location
                </span>
                <a
                  href="https://maps.google.com/?q=Gomtinagar,+Lucknow,+Uttar+Pradesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  Open in Maps
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.823523454862!2d80.99197507543866!3d26.855758476671747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991a3577c1%3A0x6bed4dbf19a1382b!2sGomti%20Nagar%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MediCare Clinic Location"
              />
            </div>

            {/* Clinic Hours Card */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 space-y-3">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                Clinic Hours
              </h3>
              {[
                { day: "Mon – Sat",       time: "9:00 AM – 6:00 PM", open: true },
                { day: "Sunday",          time: "10:00 AM – 2:00 PM", open: true },
                { day: "Public Holidays", time: "Emergency Only",     open: false },
              ].map(({ day, time, open }) => (
                <div key={day} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">{day}</span>
                  <span className={`font-semibold text-xs px-2.5 py-1 rounded-full ${open ? "text-emerald-700 bg-emerald-100" : "text-gray-500 bg-gray-100"}`}>
                    {time}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick WhatsApp Card */}
            <a
              href="https://wa.me/918299431275"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-3xl text-white transition-all hover:shadow-lg hover:shadow-emerald-300/40 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #25d366, #128c7e)" }}
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm">Chat on WhatsApp</p>
                <p className="text-white/80 text-xs mt-0.5">Instant replies during clinic hours</p>
              </div>
              <svg className="w-5 h-5 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
