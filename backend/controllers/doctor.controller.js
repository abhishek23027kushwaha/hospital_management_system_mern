import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Doctor from "../models/doctor.model.js";
import DoctorAppointment from "../models/doctorAppointment.model.js";

// ── helpers ───────────────────────────────────────────────────────────────
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ── AUTH ──────────────────────────────────────────────────────────────────
// ── POST /api/doctor/login ───────────────────────────────────────────────
export const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(doctor._id, "doctor");
    res.cookie("token", token, cookieOpts);

    return res.status(200).json({
      success: true,
      message: "Doctor logged in successfully",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        image: doctor.image,
        role: doctor.role || "doctor",
      },
      token,
    });
  } catch (err) {
    console.error("doctorLogin error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── PROFILE ───────────────────────────────────────────────────────────────

// ── GET /api/doctor/profile ──────────────────────────────────────────────
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.userId).select("-password");
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    return res.status(200).json({ success: true, doctor });
  } catch (err) {
    console.error("getDoctorProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── PUT /api/doctor/profile ───────────────────────────────────────────────
export const updateDoctorProfile = async (req, res) => {
  try {
    const { name, specialization, fee, phone, address, gender, age, degree, experience, about } = req.body;
    const updateData = { name, specialization, fee, phone, address, gender, age, degree, experience, about };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const doctor = await Doctor.findByIdAndUpdate(req.userId, updateData, { new: true }).select("-password");
    return res.status(200).json({ success: true, message: "Profile updated", doctor });
  } catch (err) {
    console.error("updateDoctorProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── SLOTS ─────────────────────────────────────────────────────────────────

// ── GET /api/doctor/slots ───────────────────────────────────────────────
export const getDoctorSlots = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.userId).select("slots");
    return res.status(200).json({ success: true, slots: doctor?.slots || [] });
  } catch (err) {
    console.error("getDoctorSlots error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── POST /api/doctor/slots ──────────────────────────────────────────────
export const addDoctorSlot = async (req, res) => {
  try {
    const { day, time } = req.body; // e.g. "Monday", "10:30 AM"
    if (!day || !time) return res.status(400).json({ success: false, message: "Day and time required" });

    const doctor = await Doctor.findById(req.userId);
    doctor.slots.push({ day, time });
    await doctor.save();

    return res.status(201).json({ success: true, message: "Slot added", slots: doctor.slots });
  } catch (err) {
    console.error("addDoctorSlot error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── DELETE /api/doctor/slots/:slotId ────────────────────────────────────
export const deleteDoctorSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const doctor = await Doctor.findById(req.userId);
    doctor.slots = doctor.slots.filter((s) => s._id.toString() !== slotId);
    await doctor.save();
    return res.status(200).json({ success: true, message: "Slot deleted", slots: doctor.slots });
  } catch (err) {
    console.error("deleteDoctorSlot error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── APPOINTMENTS ──────────────────────────────────────────────────────────

// ── GET /api/doctor/appointments ──────────────────────────────────────────
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await DoctorAppointment.find({ doctor: req.userId })
      .sort({ createdAt: -1 })
      .populate("patient", "name email phone gender age avatar");

    const total     = appointments.length;
    const completed = appointments.filter((a) => a.status === "Completed").length;
    const pending   = appointments.filter((a) => a.status === "Pending").length;
    const cancelled = appointments.filter((a) => a.status === "Cancelled").length;
    const earnings  = appointments
      .filter((a) => a.status === "Completed")
      .reduce((sum, a) => sum + (Number(a.fee) || 0), 0);

    return res.status(200).json({
      success: true,
      stats: { total, completed, pending, cancelled, earnings },
      appointments,
    });
  } catch (err) {
    console.error("getDoctorAppointments error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ── PUT /api/doctor/appointments/:id/status ───────────────────────────────
export const updateAppointmentStatusByDoctor = async (req, res) => {
  try {
    const { status } = req.body;
    const appt = await DoctorAppointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });

    // if completed, increment doctor's totalEarnings (field in Doctor model)
    if (status === "Completed") {
      await Doctor.findByIdAndUpdate(req.userId, { $inc: { totalEarnings: appt.fee } });
    }

    return res.status(200).json({ success: true, message: `Status updated to ${status}`, appointment: appt });
  } catch (err) {
    console.error("updateAppointmentStatusByDoctor error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── PUBLIC / OTHERS ───────────────────────────────────────────────────────

// ── GET /api/doctor/all ──────────────────────────────────────────────────
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password");
    return res.status(200).json({ success: true, doctors });
  } catch (err) {
    console.error("getAllDoctors error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/doctor/:id ──────────────────────────────────────────────────
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password");
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    return res.status(200).json({ success: true, doctor });
  } catch (err) {
    console.error("getDoctorById error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
