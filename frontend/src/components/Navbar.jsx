import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Key, Hospital, LogOut, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, selectUser, selectIsAuth } from "../redux/user.slice.js";

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
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [activePath, setActivePath] = useState(location.pathname);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setActivePath(location.pathname);
    setMobileOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    dispatch(clearUser());
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate("/login");
  };

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-8 py-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-full flex items-center justify-center border border-green-100 shadow-sm group-hover:scale-105 transition-transform">
              <Hospital className="text-green-600 size-5 md:size-7" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-green-700 leading-none">MediCare</h1>
              <p className="hidden sm:block text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Healthcare Solutions</p>
            </div>
          </Link>

          {/* Desktop Nav Capsule */}
          <div className="hidden lg:flex bg-white border border-green-200 rounded-full px-1.5 py-1.5 items-center gap-1 shadow-lg shadow-green-900/5 relative">
            {navItems.map((item) => {
              const isActive = activePath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 xl:px-6 py-2 text-sm font-bold transition-all duration-300 no-underline z-10 ${
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
          <div className="flex items-center gap-3">
            {/* Desktop right buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
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
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
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
                <>
                  <Link
                    to="/doctor-admin"
                    className="flex items-center gap-2 px-4 xl:px-6 py-2 border-2 border-green-600 text-green-700 rounded-full font-bold text-sm hover:bg-green-50 transition-all no-underline"
                  >
                    <User className="size-4" />
                    Doctor Admin
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-5 xl:px-8 py-2 bg-green-500 text-white rounded-full font-bold text-sm hover:bg-green-600 shadow-lg shadow-green-500/30 active:scale-95 transition-all no-underline"
                  >
                    <Key className="size-4" />
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Mobile: avatar or hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="w-9 h-9 rounded-full bg-green-500 text-white font-bold text-base flex items-center justify-center shadow-md focus:outline-none"
                  >
                    {firstLetter}
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                      >
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                        >
                          <LogOut size={14} />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="p-2 rounded-xl text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-gray-100 bg-white px-4 pb-4 md:hidden"
            >
              <div className="flex flex-col gap-1 pt-3">
                {navItems.map((item) => {
                  const isActive = activePath === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-4 py-2.5 rounded-xl text-sm font-bold no-underline transition-colors ${
                        isActive
                          ? "bg-green-50 text-green-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-green-500"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}

                {/* Mobile auth buttons (shown only when logged out) */}
                {!user && (
                  <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-100">
                    <Link
                      to="/doctor-admin"
                      className="flex items-center justify-center gap-2 py-2.5 border-2 border-green-600 text-green-700 rounded-xl font-bold text-sm hover:bg-green-50 transition-all no-underline"
                    >
                      <User className="size-4" />
                      Doctor Admin
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-all no-underline"
                    >
                      <Key className="size-4" />
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
