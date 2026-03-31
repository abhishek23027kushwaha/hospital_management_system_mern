import { configureStore } from "@reduxjs/toolkit";
import userReducer  from "./user.slice.js";
import doctorReducer from "./doctor.slice.js";

const store = configureStore({
  reducer: {
    user:   userReducer,
    doctor: doctorReducer,
  },
});

export default store;
