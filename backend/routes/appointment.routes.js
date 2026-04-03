import express from "express";
import {
  bookDoctorAppointment,
  getUserDoctorAppointments,
  cancelDoctorAppointment,
  verifyDoctorAppointmentPayment,
} from "../controllers/appointment.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { isUser } from "../middlewares/role.middleware.js";

const router = express.Router();

// All routes require a logged-in user
router.use(protectRoute, isUser);

router.post("/:id/cancel",    cancelDoctorAppointment);   // cancel own appointment
router.post("/book",          bookDoctorAppointment);      // book new appointment + create order
router.post("/verify-payment", verifyDoctorAppointmentPayment); // verify payment + confirm appt
router.get ("/appointments", getUserDoctorAppointments);  // get own appointments

export default router;
