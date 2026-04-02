import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, ChevronRight,
  Facebook, Twitter, Instagram, Linkedin, Youtube,
  Stethoscope, Activity, ArrowUp, Send
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Doctors', to: '/doctors' },
    { label: 'Services', to: '/services' },
    { label: 'Contact', to: '/contact' },
    { label: 'Appointments', to: '/appointments' },
  ];

  const services = [
    'Blood Pressure Check',
    'Blood Sugar Test',
    'Full Blood Count',
    'X-Ray Scan',
    'Blood Sugar Test',
  ];

  const socials = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
  ];

  return (
    <footer className="relative bg-[#ecfdf5] border-t border-[#d1fae5] overflow-hidden">
      {/* Decorative pulse icon on the left */}
      <div className="absolute left-4 top-1/4 -translate-y-1/2 opacity-20 pointer-events-none">
        <Activity size={100} className="text-green-500" />
      </div>
      
      {/* Decorative stethoscope on the right */}
      <div className="absolute right-8 top-12 opacity-20 pointer-events-none rotate-12">
        <Stethoscope size={100} className="text-green-500" />
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

          {/* Column 1 – Brand + Contact */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white border border-emerald-100 flex items-center justify-center shadow-md overflow-hidden">
                 <img src="https://via.placeholder.com/150" alt="Medicare Logo" className="w-8 h-8 rounded-full border border-green-500 shadow-inner" />
              </div>
              <div>
                <p className="text-[#114232] text-2xl font-bold leading-none tracking-tight">MediCare</p>
                <p className="text-green-500 text-xs font-bold uppercase tracking-[0.05em] mt-1.5 opacity-90">Healthcare Solutions</p>
              </div>
            </div>

            <p className="text-green-500 text-[15px] leading-relaxed italic font-medium max-w-[280px]">
              Your trusted partner in healthcare innovation. We&apos;re committed to providing exceptional medical care with cutting-edge technology and compassionate service.
            </p>

            {/* Contact Details with Circular Icons */}
            <div className="space-y-4 pt-4">
              {[
                { icon: Phone, text: '+91 8299431275' },
                { icon: Mail, text: 'hexagonsservices@gmail.com' },
                { icon: MapPin, text: 'Lucknow, India' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-[#d1fae5] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                    <Icon size={17} className="text-[#114232]" />
                  </div>
                  <span className="text-[#114232] text-[15px] font-bold opacity-90">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 – Quick Links */}
          <div className="lg:pl-8">
            <h4 className="text-[#114232] text-xl font-bold mb-10 tracking-tight">Quick Links</h4>
            <ul className="space-y-5">
              {quickLinks.map(({ label, to }, i) => (
                <li key={i}>
                  <Link
                    to={to}
                    className="flex items-center gap-4 text-[#114232]/80 hover:text-[#114232] transition-all group"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#d1fae5] flex items-center justify-center flex-shrink-0 transition-all group-hover:bg-green-500 shadow-sm">
                      <ChevronRight size={14} className="text-[#114232] group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[15px] font-bold">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Our Services */}
          <div>
            <h4 className="text-[#114232] text-xl font-bold mb-10 tracking-tight">Our Services</h4>
            <ul className="space-y-5">
              {services.map((service, i) => (
                <li key={i} className="flex items-center gap-4 group">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0 shadow-sm shadow-green-500/40 group-hover:scale-125 transition-transform" />
                  <span className="text-[#114232]/80 text-[15px] font-bold hover:text-[#114232] cursor-pointer transition-colors leading-tight">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 – Stay Connected */}
          <div>
            <h4 className="text-[#114232] text-xl font-bold mb-5 tracking-tight">Stay Connected</h4>
            <p className="text-[#114232]/70 text-[15px] mb-10 leading-relaxed font-medium">
              Subscribe for health tips, medical updates, and wellness insights delivered to your inbox.
            </p>

            {/* Pill-shaped Email input */}
            <div className="flex items-center bg-white rounded-full p-2 shadow-xl shadow-green-900/10 mb-10 border border-emerald-100">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent outline-none text-[14px] text-gray-700 placeholder-green-500/50 pl-5 font-medium"
              />
              <button className="bg-green-500 text-white text-[13px] font-bold px-7 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-all shadow-md shadow-green-500/30 active:scale-95">
                <Send size={15} />
                Subscribe
              </button>
            </div>

            {/* Social Icons with Thin Borders */}
            <div className="flex items-center gap-4 flex-wrap">
              {socials.map(({ icon: Icon, label, href }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  className="w-11 h-11 bg-white border border-green-500/20 rounded-2xl flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all shadow-md group"
                >
                  <Icon size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#34ad7b]/10 bg-[#ecfdf5]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-7 flex flex-col sm:flex-row items-center justify-between gap-8 relative">
          <p className="text-[#114232]/50 text-[14px] font-bold">
            &copy; 2026 <span className="text-[#114232]/80">MediCare Healthcare.</span>
          </p>
          
          <p className="text-[#114232]/50 text-[14px] font-bold flex items-center gap-2">
            Designed by <span className="text-green-500 font-black underline decoration-2 underline-offset-4 cursor-pointer hover:text-[#114232] transition-colors">Hexagon Digital Services</span>
          </p>
          
          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="w-11 h-11 bg-green-500 rounded-full flex items-center justify-center text-white hover:scale-110 hover:-translate-y-1 transition-all shadow-xl active:scale-90 flex-shrink-0"
          >
            <ArrowUp size={22} strokeWidth={3} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
