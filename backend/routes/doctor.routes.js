import express from "express";
import {
  doctorLogin,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorSlots,
  addDoctorSlot,
  deleteDoctorSlot,
  getDoctorAppointments,
  updateAppointmentStatusByDoctor,
  getAllDoctors,
  getDoctorById,
} from "../controllers/doctor.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { isDoctor } from "../middlewares/role.middleware.js";
import { handleUpload, uploadImage } from "../utils/multer.js";

const router = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────
router.post("/login",  doctorLogin);
router.get ("/all",    getAllDoctors);    

// ── Doctor-only routes (requires doctor JWT) ──────────────────────────────
router.use(protectRoute, isDoctor);

// Profile
router.get("/profile",  getDoctorProfile);
router.put("/profile",  handleUpload(uploadImage), updateDoctorProfile);

// Slots
router.get   ("/slots",          getDoctorSlots);
router.post  ("/slots",          addDoctorSlot);
router.delete("/slots/:slotId",  deleteDoctorSlot);

// Appointments (doctor sees their own)
router.get("/appointments",              getDoctorAppointments);
router.put("/appointments/:id/status",   updateAppointmentStatusByDoctor);

// ── Dynamic Public routes (Must be at the very bottom) ────────────────────
router.get ("/:id",    getDoctorById);

export default router;
