import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Key, Hospital } from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Doctors", path: "/doctors" },
  { name: "Services", path: "/services" },
  { name: "Appointments", path: "/appointments" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-3 no-underline group">
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center border border-green-100 shadow-sm group-hover:scale-105 transition-transform">
          <Hospital className="text-green-600 size-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-700 leading-none">MediCare</h1>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mt-1">Healthcare Solutions</p>
        </div>
      </Link>

      {/* Navigation Capsule */}
      <div className="bg-white border border-green-200 rounded-full px-1.5 py-1.5 flex items-center gap-2 shadow-lg shadow-green-900/5 relative">
        {navItems.map((item) => {
          const isActive = activePath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-6 py-2.5 text-sm font-bold transition-all duration-300 no-underline z-10 ${
                isActive ? "text-green-600" : "text-gray-600 hover:text-green-500"
              }`}
            >
              {item.name}
              
              {/* Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white rounded-full -z-10 shadow-md border border-gray-100"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Dot Indicator under the capsule */}
              {isActive && (
                <motion.div
                  layoutId="active-dot"
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right Section Buttons */}
      <div className="flex items-center gap-4">
        <Link 
          to="/doctor-admin" 
          className="flex items-center gap-2 px-6 py-2.5 border-2 border-green-600 text-green-700 rounded-full font-bold text-sm hover:bg-green-50 transition-all no-underline"
        >
          <User className="size-4" />
          Doctor Admin
        </Link>
        <Link 
          to="/login" 
          className="flex items-center gap-2 px-8 py-2.5 bg-green-500 text-white rounded-full font-bold text-sm hover:bg-green-600 shadow-lg shadow-green-500/30 active:scale-95 transition-all no-underline"
        >
          <Key className="size-4" />
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
