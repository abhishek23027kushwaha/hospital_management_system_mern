import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const doctors = [
  {
    name: "Dr. Amanda Lee",
    role: "Dermatologist",
    rating: 4,
    avatar: "👩‍⚕️",
    review: "\"Excellent platform for managing appointments. Automated reminders reduce no-shows dramatically.\"",
  },
  {
    name: "Dr. Sarah Johnson",
    role: "Cardiologist",
    rating: 5,
    avatar: "👨‍⚕️",
    review: "\"The appointment booking system is incredibly efficient. It saves me valuable time and helps me focus on patient care.\"",
  },
  {
    name: "Dr. Robert Martinez",
    role: "Pediatrician",
    rating: 4,
    avatar: "👩‍⚕️",
    review: "\"This platform has streamlined our clinic operations significantly. Patient management is much more organized.\"",
  },
  {
    name: "Dr. Priya Kapoor",
    role: "Neurologist",
    rating: 5,
    avatar: "👩‍⚕️",
    review: "\"Loved the seamless interface. The digital records feature has saved hours of paperwork every week.\"",
  },
  {
    name: "Dr. James Liu",
    role: "Orthopedic Surgeon",
    rating: 4,
    avatar: "👨‍⚕️",
    review: "\"Easy to track patient history and appointments. Highly recommend to all medical professionals.\"",
  },
  {
    name: "Dr. Natasha Gupta",
    role: "Gynecologist",
    rating: 5,
    avatar: "👩‍⚕️",
    review: "\"Patients love how easy it is to book. No more phone queues. This is the future of healthcare operations.\"",
  },
];

const patients = [
  {
    name: "Michael Chen",
    role: "Patient",
    rating: 5,
    avatar: "👨",
    review: "\"Scheduling appointments has never been easier. The interface is intuitive and reminders are very helpful!\"",
  },
  {
    name: "Emily Williams",
    role: "Patient",
    rating: 4,
    avatar: "👩",
    review: "\"Booking appointments online 24/7 is a game-changer. The confirmation system gives me peace of mind.\"",
  },
  {
    name: "David Thompson",
    role: "Patient",
    rating: 5,
    avatar: "👨",
    review: "\"The wait time has reduced significantly since using this system. Truly a great experience!\"",
  },
  {
    name: "Aisha Patel",
    role: "Patient",
    rating: 4,
    avatar: "👩",
    review: "\"I appreciate the timely reminders and easy rescheduling options. A stress-free healthcare experience.\"",
  },
  {
    name: "Carlos Rivera",
    role: "Patient",
    rating: 5,
    avatar: "👨",
    review: "\"All my medical records are in one place. Finding a specialist and booking was surprisingly simple.\"",
  },
  {
    name: "Mei Lin",
    role: "Patient",
    rating: 5,
    avatar: "👩",
    review: "\"The app gave me complete confidence in managing my family's healthcare appointments. Simply outstanding!\"",
  },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={14}
        className={s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
      />
    ))}
  </div>
);

const ReviewCard = ({ name, role, rating, avatar, review, accent }) => (
  <div
    className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${
      accent === 'blue' ? 'border-blue-400' : 'border-green-400'
    } mb-4 flex-shrink-0`}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl ${
          accent === 'blue' ? 'bg-blue-100' : 'bg-green-100'
        }`}>
          {avatar}
        </div>
        <div>
          <p className={`font-bold text-sm ${accent === 'blue' ? 'text-blue-700' : 'text-green-700'}`}>{name}</p>
          <p className="text-gray-400 text-xs">{role}</p>
        </div>
      </div>
      <StarRating rating={rating} />
    </div>
    <p className="text-gray-600 text-sm leading-relaxed italic">{review}</p>
  </div>
);

const ScrollColumn = ({ reviews, accent, label, icon, duration }) => {
  const doubled = [...reviews, ...reviews];
  return (
    <div className={`flex-1 rounded-3xl overflow-hidden p-5 ${
      accent === 'blue'
        ? 'bg-blue-50 border border-blue-100'
        : 'bg-green-50 border border-green-100'
    }`}>
      {/* Column Header */}
      <div className={`text-center mb-5 pb-4 border-b ${accent === 'blue' ? 'border-blue-100' : 'border-green-100'}`}>
        <span className="text-xl">{icon}</span>
        <span className={`ml-2 font-black text-lg ${accent === 'blue' ? 'text-blue-700' : 'text-green-700'}`}>{label}</span>
      </div>

      {/* Scrolling Content */}
      <div className="overflow-hidden h-[520px] relative">
        {/* Top fade */}
        <div className={`absolute top-0 left-0 right-0 h-12 z-10 ${
          accent === 'blue'
            ? 'bg-gradient-to-b from-blue-50 to-transparent'
            : 'bg-gradient-to-b from-green-50 to-transparent'
        }`} />
        {/* Bottom fade */}
        <div className={`absolute bottom-0 left-0 right-0 h-12 z-10 ${
          accent === 'blue'
            ? 'bg-gradient-to-t from-blue-50 to-transparent'
            : 'bg-gradient-to-t from-green-50 to-transparent'
        }`} />

        <motion.div
          animate={{ y: [0, -(doubled.length / 2) * 175] }}
          transition={{ duration, ease: 'linear', repeat: Infinity }}
          className="flex flex-col"
        >
          {doubled.map((review, i) => (
            <ReviewCard key={i} {...review} accent={accent} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const VoiceOfTrust = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50/50 to-blue-50/20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-black text-[#1e584a] mb-4">
            Voices of Trust
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Real stories from doctors and patients sharing their positive experiences with our healthcare platform.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-8">
          <ScrollColumn
            reviews={doctors}
            accent="blue"
            label="Medical Professionals"
            icon="🩺"
            duration={25}
          />
          <ScrollColumn
            reviews={patients}
            accent="green"
            label="Patients"
            icon="🙂"
            duration={20}
          />
        </div>
      </div>
    </section>
  );
};

export default VoiceOfTrust;
