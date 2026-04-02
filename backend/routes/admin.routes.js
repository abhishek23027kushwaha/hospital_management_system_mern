import express from "express";
import {
  adminLogin,
  getDashboardStats,
  addDoctor,
  listDoctors,
  updateDoctor,
  deleteDoctor,
  getAllAppointments,
  updateAppointmentStatus,
  getAllUsers,
} from "../controllers/admin.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";
import { handleUpload, uploadImage } from "../utils/multer.js";

const router = express.Router();

// Public — admin login
router.post("/login", adminLogin);

// All routes below require admin token
router.use(protectRoute, isAdmin);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Doctor management
router.post  ("/doctors",      handleUpload(uploadImage), addDoctor);
router.get   ("/doctors",      listDoctors);

router.put   ("/doctors/:id", handleUpload(uploadImage), updateDoctor);
router.delete("/doctors/:id",deleteDoctor);

// Appointment management (type: doctor | service)
router.get("/appointments", getAllAppointments);
router.put("/appointments/:type/:id/status",updateAppointmentStatus);

// User management
router.get("/users", getAllUsers);

export default router;
