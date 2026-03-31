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
    <footer className="bg-[#e8f8f3] border-t border-[#b2e8d4]">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1 – Brand + Contact */}
          <div className="space-y-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-[#22c55e] flex items-center justify-center shadow-sm">
                <Stethoscope size={22} className="text-[#1e584a]" />
              </div>
              <div>
                <p className="text-[#1e584a] text-2xl font-black leading-none">MediCare</p>
                <p className="text-[#22c55e] text-xs font-bold tracking-wide">Healthcare Solutions</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed italic">
              Your trusted partner in healthcare innovation. We're committed to providing exceptional medical care with cutting-edge technology and compassionate service.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              {[
                { icon: Phone, text: '+91 8299431275' },
                { icon: Mail, text: 'hexagonsservices@gmail.com' },
                { icon: MapPin, text: 'Lucknow, India' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#b2e8d4] flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-[#22c55e]" />
                  </div>
                  <span className="text-gray-500 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 – Quick Links */}
          <div>
            <h4 className="text-[#1e584a] text-lg font-black mb-6">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(({ label, to }, i) => (
                <li key={i}>
                  <Link
                    to={to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-[#22c55e]/10 hover:text-[#1e584a] transition-all group"
                  >
                    <ChevronRight size={16} className="text-[#22c55e] group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Services */}
          <div>
            <h4 className="text-[#1e584a] text-lg font-black mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-[#22c55e] rounded-full flex-shrink-0" />
                  <span className="text-gray-500 text-sm hover:text-[#1e584a] cursor-pointer transition-colors">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 – Stay Connected */}
          <div>
            <h4 className="text-[#1e584a] text-lg font-black mb-3">Stay Connected</h4>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Subscribe for health tips, medical updates, and wellness insights delivered to your inbox.
            </p>

            {/* Email subscribe */}
            <div className="flex items-center gap-2 bg-white border border-[#b2e8d4] rounded-full px-3 py-1.5 shadow-sm mb-7">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent outline-none text-sm text-gray-600 placeholder-gray-300 pl-2"
              />
              <button className="bg-[#22c55e] text-white text-xs font-black px-4 py-2 rounded-full flex items-center gap-1.5 hover:bg-[#1e584a] transition-colors whitespace-nowrap">
                <Send size={12} />
                Subscribe
              </button>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 flex-wrap">
              {socials.map(({ icon: Icon, label, href }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 bg-white border border-[#b2e8d4] rounded-xl flex items-center justify-center text-[#1e584a] hover:bg-[#22c55e] hover:text-white hover:border-[#22c55e] transition-all shadow-sm"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#b2e8d4] bg-[#e0f5ed]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-[#22c55e]" />
            <p className="text-gray-400 text-sm">© 2026 MediCare Healthcare.</p>
          </div>
          <p className="text-gray-400 text-sm">
            Designed by{' '}
            <span className="text-[#22c55e] font-bold">Hexagon Digital Services</span>
          </p>
          {/* Scroll to top */}
          <button
            onClick={scrollToTop}
            className="w-10 h-10 bg-[#22c55e] rounded-full flex items-center justify-center text-white hover:bg-[#1e584a] transition-colors shadow-md"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
