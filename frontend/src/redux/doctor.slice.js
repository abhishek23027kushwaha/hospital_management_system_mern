import { createSlice } from "@reduxjs/toolkit";

// Persist doctor session across page refresh
const storedDoctor = localStorage.getItem("doctor");
const storedDoctorToken = localStorage.getItem("doctorToken");

const initialState = {
  doctorInfo: storedDoctor ? JSON.parse(storedDoctor) : null,
  token: storedDoctorToken || null,
  isAuthenticated: !!storedDoctor,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    setDoctor: (state, action) => {
      const { doctor, token } = action.payload;
      state.doctorInfo = doctor;
      state.token = token;
      state.isAuthenticated = true;
      // Persist to localStorage
      localStorage.setItem("doctor", JSON.stringify(doctor));
      localStorage.setItem("doctorToken", token);
    },

    updateDoctor: (state, action) => {
      state.doctorInfo = { ...state.doctorInfo, ...action.payload };
      localStorage.setItem("doctor", JSON.stringify(state.doctorInfo));
    },

    clearDoctor: (state) => {
      state.doctorInfo = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("doctor");
      localStorage.removeItem("doctorToken");
    },
  },
});

export const { setDoctor, updateDoctor, clearDoctor } = doctorSlice.actions;

// Selectors
export const selectDoctor       = (state) => state.doctor.doctorInfo;
export const selectDoctorToken  = (state) => state.doctor.token;
export const selectIsDoctorAuth = (state) => state.doctor.isAuthenticated;

export default doctorSlice.reducer;
