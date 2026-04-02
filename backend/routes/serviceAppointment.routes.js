import express from "express";
import {
  bookServiceAppointment,
  getUserServiceAppointments,
  cancelServiceAppointment,
  getAllServiceAppointments,
  updateServiceAppointmentStatus,
  verifyServiceAppointmentPayment,
} from "../controllers/serviceAppointment.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { isUser, isAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

// ── User routes ───────────────────────────────────────────────────────────
router.post("/book",             protectRoute, isUser, bookServiceAppointment);
router.post("/verify-payment",   protectRoute, isUser, verifyServiceAppointmentPayment);
router.get ("/my",               protectRoute, isUser, getUserServiceAppointments);
router.post("/:id/cancel",       protectRoute, isUser, cancelServiceAppointment);

// ── Admin routes ──────────────────────────────────────────────────────────
router.get ("/" ,                protectRoute, isAdmin, getAllServiceAppointments);
router.put ("/:id/status",       protectRoute, isAdmin, updateServiceAppointmentStatus);

export default router;
