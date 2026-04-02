import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import DoctorAppointment from "../models/doctorAppointment.model.js";
import ServiceAppointment from "../models/serviceAppointment.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";


// ── helpers ───────────────────────────────────────────────────────────────
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ── POST /api/admin/login ─────────────────────────────────────────────────
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const ADMIN_EMAIL = "adminmedicare@gmail.com";
    const ADMIN_PASSWORD = "admin@123";

    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.cookie("token", token, cookieOpts);
      return res.status(200).json({
        success: true,
        message: "Admin logged in",
        admin: { email: ADMIN_EMAIL, role: "admin", name: "System Admin" },
        token,
      });
    }

    return res.status(401).json({ success: false, message: "Invalid admin credentials" });
  } catch (err) {
    console.error("adminLogin error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/admin/dashboard ──────────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalDoctors,
      totalUsers,
      allDocAppts,
      allSvcAppts,
    ] = await Promise.all([
      Doctor.countDocuments(),
      User.countDocuments({ role: "user" }),
      DoctorAppointment.find(),
      ServiceAppointment.find(),
    ]);

    const allAppts = [...allDocAppts, ...allSvcAppts];
    const totalAppointments = allAppts.length;
    const completedCount    = allAppts.filter((a) => a.status === "Completed").length;
    const cancelledCount    = allAppts.filter((a) => a.status === "Cancelled").length;
    const totalEarnings     = allAppts
      .filter((a) => a.status === "Completed")
      .reduce((sum, a) => sum + (a.fee || 0), 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalDoctors,
        totalUsers,
        totalAppointments,
        completedCount,
        cancelledCount,
        totalEarnings,
      },
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── POST /api/admin/doctors ───────────────────────────────────────────────
export const addDoctor = async (req, res) => {
  try {
    const { 
      name, email, password, phone, specialization, experience, fee, about, available, slots,
      qualifications, location, patients, success, rating 
    } = req.body;

    // Validation
    if (!name || !email || !password || !specialization || !fee || !experience || !about) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    // Parse slots if provided
    let parsedSlots = [];
    if (slots) {
      try {
        parsedSlots = typeof slots === 'string' ? JSON.parse(slots) : slots;
      } catch (e) {
        console.error("Error parsing slots:", e);
      }
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existing = await Doctor.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Doctor with this email already exists" });
    }

    // Upload image to Cloudinary (if provided)
    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, "doctors");
    }

    const hashed = await bcrypt.hash(password, 12);
    const doctor = await Doctor.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      plainPassword: password, // Store plain text for admin display
      phone: phone || "",
      specialization,
      experience: Number(experience) || 0,
      fee: Number(fee),
      about: about || "",
      available: available !== undefined ? available === "true" || available === true : true,
      image: imageUrl,
      slots: parsedSlots,
      qualifications: qualifications || "",
      location: location || "",
      patients: patients || "0",
      success: success || "100",
      rating: Number(rating) || 5,
    });

    return res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor: { ...doctor.toObject(), password: undefined },
    });
  } catch (err) {
    console.error("addDoctor error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// ── GET /api/admin/doctors ────────────────────────────────────────────────
export const listDoctors = async (req, res) => {
  try {
    const { search, specialization, available } = req.query;
    const filter = {};
    if (search)         filter.name           = { $regex: search, $options: "i" };
    if (specialization) filter.specialization = specialization;
    if (available !== undefined) filter.available = available === "true";

    const doctors = await Doctor.find(filter).select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: doctors.length, doctors });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── PUT /api/admin/doctors/:id ────────────────────────────────────────────
export const updateDoctor = async (req, res) => {
  try {
    const { name, email, phone, specialization, experience, fee, about, available, image } = req.body;
    const updates = {};
    if (name !== undefined)           updates.name           = name.trim();
    if (email !== undefined)          updates.email          = email.toLowerCase().trim();
    if (phone !== undefined)          updates.phone          = phone;
    if (specialization !== undefined) updates.specialization = specialization;
    if (experience !== undefined)     updates.experience     = Number(experience);
    if (fee !== undefined)            updates.fee            = Number(fee);
    if (about !== undefined)          updates.about          = about;
    if (available !== undefined)      updates.available      = Boolean(available);
    if (image !== undefined)          updates.image          = image;

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    return res.status(200).json({ success: true, message: "Doctor updated", doctor });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── DELETE /api/admin/doctors/:id ─────────────────────────────────────────
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    return res.status(200).json({ success: true, message: "Doctor deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/admin/appointments ───────────────────────────────────────────
export const getAllAppointments = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.patientName = { $regex: search, $options: "i" };

    const [docAppts, svcAppts] = await Promise.all([
      DoctorAppointment.find(filter)
        .populate("patient", "name email phone")
        .populate("doctor", "name specialization fee image")
        .sort({ createdAt: -1 }),
      ServiceAppointment.find(filter)
        .populate("patient", "name email phone")
        .populate("service", "name price image")
        .sort({ createdAt: -1 }),
    ]);

    const allAppts = [
      ...docAppts.map((a) => ({ ...a.toObject(), type: "doctor" })),
      ...svcAppts.map((a) => ({ ...a.toObject(), type: "service" })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const stats = {
      total:     allAppts.length,
      pending:   allAppts.filter((a) => a.status === "Pending").length,
      completed: allAppts.filter((a) => a.status === "Completed").length,
      cancelled: allAppts.filter((a) => a.status === "Cancelled").length,
      earnings:  allAppts.filter((a) => a.status === "Completed").reduce((s, a) => s + a.fee, 0),
    };

    return res.status(200).json({ success: true, stats, appointments: allAppts });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── PUT /api/admin/appointments/:type/:id/status ──────────────────────────
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { type, id } = req.params;  // type: "doctor" | "service"
    const { status } = req.body;
    const allowed = ["Pending", "Completed", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(", ")}` });
    }

    const Model = type === "doctor" ? DoctorAppointment : ServiceAppointment;
    const appt  = await Model.findByIdAndUpdate(id, { status }, { new: true });
    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });

    return res.status(200).json({ success: true, message: "Status updated", appointment: appt });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/admin/users ──────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = { role: "user" };
    if (search) filter.name = { $regex: search, $options: "i" };
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
