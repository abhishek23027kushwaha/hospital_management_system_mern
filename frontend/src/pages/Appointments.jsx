import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/* ─── Data ───────────────────────────────────────────────── */
const doctors = [
  { name: "Dr. Rahul Sharma",    specialty: "Cardiologist" },
  { name: "Dr. Sarah Chen",      specialty: "Neurologist" },
  { name: "Dr. Emily Rodriguez", specialty: "Pediatrician" },
  { name: "Dr. Michael Bond",    specialty: "Surgeon" },
  { name: "Dr. David Kim",       specialty: "Oncologist" },
  { name: "Dr. Lisa Wong",       specialty: "Dermatologist" },
  { name: "Dr. James Wilson",    specialty: "Dentist" },
  { name: "Dr. Kabir Malhotra",  specialty: "Nephrologist" },
  { name: "Dr. Priya Nair",      specialty: "Gynecologist" },
  { name: "Dr. Arjun Mehta",     specialty: "Orthopedist" },
];

const services = [
  "Full Body Health Checkup",
  "Blood Pressure Check",
  "Blood Sugar Test",
  "X-Ray Scan",
  "Full Blood Count",
  "Vaccination",
  "General Consultation",
  "Dental Checkup",
];

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "02:00 PM",
  "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM",
  "04:30 PM", "05:00 PM",
];

/* ─── Step Indicator ─────────────────────────────────────── */
function StepIndicator({ currentStep }) {
  const steps = [
    { num: 1, label: "Patient Info" },
    { num: 2, label: "Doctor & Service" },
    { num: 3, label: "Date & Time" },
  ];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                currentStep >= step.num
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {currentStep > step.num ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.num
              )}
            </div>
            <span className={`text-xs font-medium whitespace-nowrap ${currentStep >= step.num ? "text-emerald-600" : "text-gray-400"}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-20 sm:w-28 h-0.5 mx-2 mb-4 transition-all duration-500 ${currentStep > step.num ? "bg-emerald-400" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Success Screen ─────────────────────────────────────── */
function SuccessScreen({ data, onReset }) {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-8 px-4">
      <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
        <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Appointment Booked!</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-sm">
          Your appointment has been successfully scheduled. A confirmation will be sent to <strong>{data.email}</strong>.
        </p>
      </div>

      {/* Summary Card */}
      <div className="w-full max-w-sm bg-emerald-50 rounded-2xl p-5 text-left space-y-3 border border-emerald-100">
        {[
          { label: "Patient", value: data.name },
          { label: "Doctor",  value: data.doctor },
          { label: "Service", value: data.service },
          {
            label: "Date",
            value: data.date
              ? new Date(data.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
              : "",
          },
          { label: "Time", value: data.timeSlot },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">{label}</span>
            <span className="text-gray-800 font-semibold text-right max-w-[60%]">{value}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full text-sm transition-colors shadow-md shadow-emerald-200"
      >
        Book Another Appointment
      </button>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
const Appointments = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", age: "", gender: "",
    doctor: "", service: "", message: "", date: "", timeSlot: "",
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const canNext1  = form.name && form.phone && form.email;
  const canNext2  = form.doctor && form.service;
  const canSubmit = form.date && form.timeSlot;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm({ name: "", phone: "", email: "", age: "", gender: "", doctor: "", service: "", message: "", date: "", timeSlot: "" });
    setStep(1);
    setSubmitted(false);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section
        className="relative py-14 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)" }}
      >
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-emerald-300/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-teal-300/25 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur rounded-full text-emerald-700 text-xs font-semibold border border-emerald-200">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Available 7 days a week
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900">Book an Appointment</h1>
          <p className="text-emerald-700 text-sm md:text-base">
            Schedule your visit in just 3 simple steps. Fast, easy, and hassle-free.
          </p>
        </div>
      </section>

      {/* ── Form + Sidebar ────────────────────────────────── */}
      <section className="flex-1 py-12 px-4 bg-emerald-50/30">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

          {/* ─ Form Card ─ */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            {submitted ? (
              <SuccessScreen data={form} onReset={resetForm} />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <StepIndicator currentStep={step} />

                {/* ── Step 1: Patient Info ── */}
                {step === 1 && (
                  <div className="space-y-5">
                    <h2 className="text-lg font-bold text-gray-800 border-l-4 border-emerald-400 pl-3">Patient Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
                        <input
                          type="text" placeholder="e.g. Rahul Sharma"
                          value={form.name} onChange={(e) => update("name", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number *</label>
                        <input
                          type="tel" placeholder="+91 XXXXX XXXXX"
                          value={form.phone} onChange={(e) => update("phone", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address *</label>
                        <input
                          type="email" placeholder="you@email.com"
                          value={form.email} onChange={(e) => update("email", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Age</label>
                        <input
                          type="number" placeholder="e.g. 28" min={1} max={120}
                          value={form.age} onChange={(e) => update("age", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gender</label>
                        <select
                          value={form.gender} onChange={(e) => update("gender", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all bg-white"
                        >
                          <option value="">Select gender</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                          <option>Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="button" disabled={!canNext1} onClick={() => setStep(2)}
                        className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-full text-sm transition-all flex items-center gap-2"
                      >
                        Next
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Step 2: Doctor & Service ── */}
                {step === 2 && (
                  <div className="space-y-5">
                    <h2 className="text-lg font-bold text-gray-800 border-l-4 border-emerald-400 pl-3">Doctor &amp; Service</h2>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Select Doctor *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                        {doctors.map((doc) => (
                          <button
                            key={doc.name} type="button"
                            onClick={() => update("doctor", doc.name)}
                            className={`text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
                              form.doctor === doc.name
                                ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                                : "border-gray-200 hover:border-emerald-300 text-gray-700"
                            }`}
                          >
                            <p className="font-semibold text-[13px]">{doc.name}</p>
                            <p className={`text-xs mt-0.5 ${form.doctor === doc.name ? "text-emerald-500" : "text-gray-400"}`}>{doc.specialty}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Select Service *</label>
                      <div className="flex flex-wrap gap-2">
                        {services.map((svc) => (
                          <button
                            key={svc} type="button"
                            onClick={() => update("service", svc)}
                            className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                              form.service === svc
                                ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200"
                                : "border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600"
                            }`}
                          >
                            {svc}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Additional Notes (optional)</label>
                      <textarea
                        rows={3} placeholder="Describe your symptoms or reason for visit..."
                        value={form.message} onChange={(e) => update("message", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all resize-none placeholder-gray-300"
                      />
                    </div>
                    <div className="flex justify-between pt-2">
                      <button type="button" onClick={() => setStep(1)}
                        className="px-6 py-3 border border-gray-200 text-gray-600 hover:border-gray-400 font-semibold rounded-full text-sm transition-all flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                      </button>
                      <button type="button" disabled={!canNext2} onClick={() => setStep(3)}
                        className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-full text-sm transition-all flex items-center gap-2"
                      >
                        Next
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Step 3: Date & Time ── */}
                {step === 3 && (
                  <div className="space-y-5">
                    <h2 className="text-lg font-bold text-gray-800 border-l-4 border-emerald-400 pl-3">Date &amp; Time Slot</h2>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Appointment Date *</label>
                      <input
                        type="date" min={today}
                        value={form.date} onChange={(e) => update("date", e.target.value)}
                        className="w-full sm:w-64 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Select Time Slot *</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot} type="button"
                            onClick={() => update("timeSlot", slot)}
                            className={`py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                              form.timeSlot === slot
                                ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200"
                                : "border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Summary preview */}
                    {(form.date || form.timeSlot) && (
                      <div className="bg-emerald-50 rounded-xl p-4 text-sm space-y-1 border border-emerald-100">
                        <p className="font-bold text-emerald-700 text-xs uppercase tracking-wide mb-2">Booking Summary</p>
                        {form.doctor  && <p className="text-gray-600"><span className="font-semibold">Doctor:</span> {form.doctor}</p>}
                        {form.service && <p className="text-gray-600"><span className="font-semibold">Service:</span> {form.service}</p>}
                        {form.date    && <p className="text-gray-600"><span className="font-semibold">Date:</span> {new Date(form.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>}
                        {form.timeSlot && <p className="text-gray-600"><span className="font-semibold">Time:</span> {form.timeSlot}</p>}
                      </div>
                    )}

                    <div className="flex justify-between pt-2">
                      <button type="button" onClick={() => setStep(2)}
                        className="px-6 py-3 border border-gray-200 text-gray-600 hover:border-gray-400 font-semibold rounded-full text-sm transition-all flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                      </button>
                      <button type="submit" disabled={!canSubmit}
                        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 text-white font-bold rounded-full text-sm transition-all shadow-lg shadow-emerald-200 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* ─ Info Sidebar ─ */}
          <div className="flex flex-col gap-5 h-fit">
            {/* Why Book Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-gray-800 text-sm">Why Book With Us?</h3>
              {[
                { icon: "🕐", title: "Flexible Timings",  desc: "Morning to evening slots, 7 days a week" },
                { icon: "👨‍⚕️", title: "Verified Doctors",  desc: "All specialists are board-certified" },
                { icon: "📋", title: "Digital Records",   desc: "Your reports stored securely online" },
                { icon: "🔔", title: "Reminders",         desc: "SMS & email reminders before appointment" },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{title}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Card */}
            <div
              className="rounded-3xl p-6 space-y-3 text-white"
              style={{ background: "linear-gradient(135deg, #10b981, #0d9488)" }}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="font-bold text-sm">Emergency?</h3>
              </div>
              <p className="text-emerald-100 text-xs leading-relaxed">
                For medical emergencies, please call our 24/7 helpline immediately.
              </p>
              <a
                href="tel:+918299431275"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 82994 31275
              </a>
            </div>

            {/* Working Hours Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-3">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                Working Hours
              </h3>
              {[
                { day: "Mon – Fri",  time: "9:00 AM – 6:00 PM" },
                { day: "Saturday",  time: "9:00 AM – 4:00 PM" },
                { day: "Sunday",    time: "10:00 AM – 2:00 PM" },
              ].map(({ day, time }) => (
                <div key={day} className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">{day}</span>
                  <span className="text-gray-800 font-semibold">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointments;
