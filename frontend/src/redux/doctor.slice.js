import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  doctorInfo: null,        // logged-in doctor's profile
  token: null,
  isAuthenticated: false,
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
    },

    updateDoctor: (state, action) => {
      state.doctorInfo = { ...state.doctorInfo, ...action.payload };
    },

    clearDoctor: (state) => {
      state.doctorInfo = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setDoctor, updateDoctor, clearDoctor } = doctorSlice.actions;

// Selectors
export const selectDoctor       = (state) => state.doctor.doctorInfo;
export const selectDoctorToken  = (state) => state.doctor.token;
export const selectIsDoctorAuth = (state) => state.doctor.isAuthenticated;

export default doctorSlice.reducer;
