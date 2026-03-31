import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DoctorNav from './DoctorAdmin/DoctorNav';
import Dashboard from './DoctorAdmin/Dashboard';
import Appointment from './DoctorAdmin/Appointment';
import EditProfile from './DoctorAdmin/EditProfile';

const DoctorAdmin = () => {
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
