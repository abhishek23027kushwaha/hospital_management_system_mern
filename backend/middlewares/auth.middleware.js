import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";

// ── Protect any route (user or doctor or admin) ──────────────────────────
export const protectRoute = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized – no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId   = decoded.id;
    req.userRole = decoded.role; // "user" | "doctor" | "admin"
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// ── Attach full user document ─────────────────────────────────────────────
export const attachUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Attach full doctor document ───────────────────────────────────────────
export const attachDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.userId).select("-password");
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    req.doctor = doctor;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
