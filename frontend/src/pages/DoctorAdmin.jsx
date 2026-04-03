import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsDoctorAuth } from '../redux/doctor.slice';
import DoctorNav from './DoctorAdmin/DoctorNav';
import Dashboard from './DoctorAdmin/Dashboard';
import Appointment from './DoctorAdmin/Appointment';
import EditProfile from './DoctorAdmin/EditProfile';

const DoctorAdmin = () => {
  const isDoctorAuth = useSelector(selectIsDoctorAuth);

  if (!isDoctorAuth) {
    return <Navigate to="/doctor/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f0fdfa]">
      <DoctorNav />
      <div className="pt-24">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointment />} />
          <Route path="profile" element={<EditProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default DoctorAdmin;
