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

// ── POST /api/doctor/login ────────────────────────────────────────────────
export const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const doctor = await Doctor.findOne({ email: email.toLowerCase() });
    if (!doctor) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, doctor.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(doctor._id, "doctor");
    res.cookie("token", token, cookieOpts);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        fee: doctor.fee,
        about: doctor.about,
        image: doctor.image,
        available: doctor.available,
        phone: doctor.phone,
        role: doctor.role || "doctor",
      },
      token,
    });
  } catch (err) {
    console.error("doctorLogin error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/doctor/profile ───────────────────────────────────────────────
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.userId).select("-password");
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    return res.status(200).json({ success: true, doctor });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── PUT /api/doctor/profile ───────────────────────────────────────────────
export const updateDoctorProfile = async (req, res) => {
  try {
    const {
      name, phone, specialization, experience,
      fee, about, available, image,
      qualifications, location, patients, success, rating,
    } = req.body;

    const updates = {};
    if (name !== undefined)           updates.name           = name.trim();
    if (phone !== undefined)          updates.phone          = phone;
    if (specialization !== undefined) updates.specialization = specialization;
    if (experience !== undefined)     updates.experience     = Number(experience);
    if (fee !== undefined)            updates.fee            = Number(fee);
    if (about !== undefined)          updates.about          = about;
    if (available !== undefined)      updates.available      = Boolean(available);
    if (image !== undefined)          updates.image          = image;
    // Extra profile fields (shown on edit profile page)
    if (qualifications !== undefined) updates.qualifications = qualifications;
    if (location !== undefined)       updates.location       = location;
    if (patients !== undefined)       updates.patients       = patients;
    if (success !== undefined)        updates.success        = success;
    if (rating !== undefined)         updates.rating         = Number(rating);

    const doctor = await Doctor.findByIdAndUpdate(req.userId, updates, { new: true }).select("-password");
    return res.status(200).json({ success: true, message: "Profile updated", doctor });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/doctor/slots ─────────────────────────────────────────────────
export const getDoctorSlots = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.userId).select("slots");
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    return res.status(200).json({ success: true, slots: doctor.slots });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── POST /api/doctor/slots ────────────────────────────────────────────────
export const addDoctorSlot = async (req, res) => {
  try {
    const { date, time } = req.body;
    if (!date || !time) {
      return res.status(400).json({ success: false, message: "Date and time are required" });
    }

    // Check if slot already exists
    const existingDoctor = await Doctor.findById(req.userId);
    if (!existingDoctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    const isDuplicate = existingDoctor.slots.some(
      (slot) => slot.date === date && slot.time === time
    );

    if (isDuplicate) {
      return res.status(400).json({ success: false, message: "This slot is already added" });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.userId,
      { $push: { slots: { date, time, isBooked: false } } },
      { new: true }
    ).select("slots");

    return res.status(201).json({ success: true, message: "Slot added", slots: doctor.slots });
  } catch (err) {
    console.error("addDoctorSlot error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── DELETE /api/doctor/slots/:slotId ─────────────────────────────────────
export const deleteDoctorSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const doctor = await Doctor.findByIdAndUpdate(
      req.userId,
      { $pull: { slots: { _id: slotId } } },
      { new: true }
    ).select("slots");
    return res.status(200).json({ success: true, message: "Slot removed", slots: doctor.slots });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

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
      .reduce((sum, a) => sum + a.fee, 0);

    return res.status(200).json({
      success: true,
      stats: { total, completed, pending, cancelled, earnings },
      appointments,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── PUT /api/doctor/appointments/:id/status ───────────────────────────────
export const updateAppointmentStatusByDoctor = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Pending", "Completed", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(", ")}` });
    }

    const appt = await DoctorAppointment.findOne({
      _id: req.params.id,
      doctor: req.userId,
    });
    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });

    appt.status = status;
    await appt.save();

    // If completed, add fee to doctor earnings
    if (status === "Completed") {
      await Doctor.findByIdAndUpdate(req.userId, { $inc: { totalEarnings: appt.fee } });
    }

    return res.status(200).json({ success: true, message: "Status updated", appointment: appt });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/doctor/all (public) ──────────────────────────────────────────
export const getAllDoctors = async (req, res) => {
  try {
    const { specialization, available, search } = req.query;
    const filter = {};
    if (specialization) filter.specialization = specialization;
    if (available !== undefined) filter.available = available === "true";
    if (search) filter.name = { $regex: search, $options: "i" };

    const doctors = await Doctor.find(filter).select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, doctors });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/doctor/:id (public) ─────────────────────────────────────────
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password");
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    return res.status(200).json({ success: true, doctor });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
