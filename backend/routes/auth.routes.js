import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  googleAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { isUser } from "../middlewares/role.middleware.js";

const router = express.Router();

// Public
router.post("/register", register);
router.post("/login",    login);
router.post("/logout",   logout);
router.post("/google",   googleAuth);   // Google OAuth verification

// Protected (logged-in user)
router.get( "/me",              protectRoute, getMe);
router.put( "/update-profile",  protectRoute, isUser, updateProfile);
router.put( "/change-password", protectRoute, isUser, changePassword);

export default router;

