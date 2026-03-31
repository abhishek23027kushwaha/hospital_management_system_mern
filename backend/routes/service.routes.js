import express from "express";
import {
  addService,
  listServices,
  getServiceById,
  updateService,
  deleteService,
  addServiceSlot,
  getServiceDashboard,
} from "../controllers/service.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";
import { handleUpload, uploadImage } from "../utils/multer.js";

const router = express.Router();

// ── Public ────────────────────────────────────────────────────────────────
router.get("/",        listServices);
router.get("/:id",     getServiceById);

// ── Admin only ────────────────────────────────────────────────────────────
router.get   ("/dashboard",        protectRoute, isAdmin, getServiceDashboard);
router.post  ("/",                 protectRoute, isAdmin, handleUpload(uploadImage), addService);
router.put   ("/:id",              protectRoute, isAdmin, updateService);
router.delete("/:id",              protectRoute, isAdmin, deleteService);
router.post  ("/:id/slots",        protectRoute, isAdmin, addServiceSlot);

export default router;
