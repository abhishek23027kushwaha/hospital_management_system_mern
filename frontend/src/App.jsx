import { Routes, Route, Outlet, Navigate } from "react-router-dom"
import './App.css'


// ── User Pages ──
import Home from "./pages/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Services from "./pages/Services"
import Appointments from "./pages/Appointments"
import Contact from "./pages/Contact"
import AllDoctors from "./pages/AllDoctors"
import DoctorAdmin from "./pages/DoctorAdmin"

// ── Shared Components ──
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

// ── Admin Panel ──
import AdminLayout from "./components/admin/AdminLayout"
import AdminDashboard from "./pages/admin/Dashboard"
import AddDoctor from "./pages/admin/AddDoctor"
import ListDoctors from "./pages/admin/ListDoctors"
import AdminAppointments from "./pages/admin/Appointments"
import ServiceDashboard from "./pages/admin/ServiceDashboard"
import AddService from "./pages/admin/AddService"
import ListServices from "./pages/admin/ListServices"
import ServiceAppointments from "./pages/admin/ServiceAppointments"
import AdminLogin from "./pages/admin/AdminLogin"

/* ── User layout: Navbar + Footer ── */
const UserLayout = () => (
  <>
    <Navbar />
    <div className="pt-24 bg-gray-50 min-h-screen">
      <Outlet />
    </div>
    <Footer />
  </>
)

/* ── Doctor Admin layout ── */
const DoctorAdminLayout = () => (
  <div className="min-h-screen bg-[#f0fdfa]">
    <Outlet />
  </div>
)

function App() {
  return (
    <Routes>
      {/* ── Auth Routes (no Navbar/Footer) ── */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* ── User Routes ── */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<AllDoctors />} />
        <Route path="/services" element={<Services />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* ── Doctor Admin Routes ── */}
      <Route element={<DoctorAdminLayout />}>
        <Route path="/doctor-admin/*" element={<DoctorAdmin />} />
      </Route>

      {/* ── Admin Panel Routes ── */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="add-doctor" element={<AddDoctor />} />
        <Route path="list-doctors" element={<ListDoctors />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="service-dashboard" element={<ServiceDashboard />} />
        <Route path="add-service" element={<AddService />} />
        <Route path="list-services" element={<ListServices />} />
        <Route path="service-appointments" element={<ServiceAppointments />} />
      </Route>

      {/* ── 404 Redirect ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
