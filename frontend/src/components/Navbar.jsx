import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Key, Hospital, LogOut } from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Doctors", path: "/doctors" },
  { name: "Services", path: "/services" },
  { name: "Appointments", path: "/appointments" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(location.pathname);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Read user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { setUser(null); }
    }
  }, [location.pathname]); // re-check on route change (after login)

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
      {/* Logo */}
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
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white rounded-full -z-10 shadow-md border border-gray-100"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
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

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {user ? (
          /* ── Logged-in: avatar circle + dropdown ── */
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDropdownOpen((v) => !v)}
              className="w-10 h-10 rounded-full bg-green-500 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-green-500/40 hover:bg-green-600 transition-colors focus:outline-none"
            >
              {firstLetter}
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                >
                  {/* User info */}
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* ── Guest: Doctor Admin + Login buttons ── */
          <>
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
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
