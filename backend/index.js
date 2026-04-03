import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db.js";

// ── Routes ────────────────────────────────────────────────────────────────
import authRoutes  from "./routes/auth.routes.js";
import adminRoutes  from "./routes/admin.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import patientAppointmentRoutes from "./routes/patientAppointment.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import serviceAppointmentRoutes from "./routes/serviceAppointment.routes.js";

dotenv.config();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,       // allow cookies
}));
app.use(cookieParser());

// ── DB ────────────────────────────────────────────────────────────────────
connectDB();

// ── Health check ──────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ success: true, message: "MediCare API is running 🚀" }));

// ── API Routes ────────────────────────────────────────────────────────────
app.use("/api/auth",   authRoutes);
app.use("/api/admin",  adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient/appointments",patientAppointmentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/service-appointments",serviceAppointmentRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ── Global error handler ──────────────────────────────────────────────────
import fs from "fs";
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const logMsg = `[${new Date().toISOString()}] ${req.method} ${req.url} - Error: ${err.message}\nStack: ${err.stack}\n`;
  fs.appendFileSync("./error_logs.log", logMsg);
  res.status(500).json({ success: false, message: "Internal server error", debug: err.message });
});

// ── Start ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});