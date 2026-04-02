import Service from "../models/service.model.js";
import ServiceAppointment from "../models/serviceAppointment.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// ── POST /api/services (admin) ────────────────────────────────────────────
export const addService = async (req, res) => {
  try {
    const { name, price, about, instructions, available, slots } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: "Service name and price are required" });
    }

    // Upload image to Cloudinary (if provided)
    let imageUrl = "";
    if (req.file) {
      try {
        imageUrl = await uploadToCloudinary(req.file.buffer, "services");
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
        return res.status(500).json({ success: false, message: "Failed to upload image" });
      }
    }

    let parsedInstructions = [];
    let parsedSlots = [];

    try {
      if (instructions) {
        const rawInstructions = typeof instructions === 'string' ? JSON.parse(instructions) : instructions;
        if (Array.isArray(rawInstructions)) {
          parsedInstructions = rawInstructions.filter(Boolean);
        }
      }
      if (slots) {
        const rawSlots = typeof slots === 'string' ? JSON.parse(slots) : slots;
        if (Array.isArray(rawSlots)) {
          parsedSlots = rawSlots.map(s => {
            if (typeof s === 'string' && s.includes(',')) {
              const [date, time] = s.split(', ');
              return { date: date.trim(), time: time.trim(), isBooked: false };
            }
            if (typeof s === 'object' && s.date && s.time) {
               return { date: s.date, time: s.time, isBooked: !!s.isBooked };
            }
            return null;
          }).filter(Boolean);
        }
      }
    } catch (parseErr) {
      console.error("Data parse error in addService:", parseErr);
      return res.status(400).json({ success: false, message: "Invalid data format for instructions or slots" });
    }

    const service = await Service.create({
      name:         name.trim(),
      price:        Number(price) || 0,
      about:        about || "",
      instructions: parsedInstructions,
      image:        imageUrl,
      available:    available !== undefined ? (available === "true" || available === true || available === "Available") : true,
      slots:        parsedSlots,
    });

    return res.status(201).json({ success: true, message: "Service added successfully", service });
  } catch (err) {
    console.error("addService error:", err);
    // Specifically handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ── GET /api/services (public) ────────────────────────────────────────────
export const listServices = async (req, res) => {
  try {
    const { search, available } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (available !== undefined) filter.available = available === "true";

    const services = await Service.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: services.length, services });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/services/:id (public) ───────────────────────────────────────
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, service });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── PUT /api/services/:id (admin) ─────────────────────────────────────────
export const updateService = async (req, res) => {
  try {
    const { name, price, about, instructions, available, slots } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name.trim();
    if (price !== undefined) updates.price = Number(price);
    if (about !== undefined) updates.about = about;
    if (available !== undefined) {
      updates.available = (available === "true" || available === true || available === "Available");
    }

    // Handle Image Upload
    if (req.file) {
      try {
        updates.image = await uploadToCloudinary(req.file.buffer, "services");
      } catch (uploadErr) {
        console.error("Cloudinary upload error in updateService:", uploadErr);
        return res.status(500).json({ success: false, message: "Failed to upload new image" });
      }
    }

    // Handle Instructions & Slots (Parsing JSON strings if from FormData)
    try {
      if (instructions !== undefined) {
        const rawInstructions = typeof instructions === 'string' ? JSON.parse(instructions) : instructions;
        if (Array.isArray(rawInstructions)) {
          updates.instructions = rawInstructions.filter(Boolean);
        }
      }
      if (slots !== undefined) {
        const rawSlots = typeof slots === 'string' ? JSON.parse(slots) : slots;
        if (Array.isArray(rawSlots)) {
          updates.slots = rawSlots.map(s => {
            if (typeof s === 'string' && s.includes(',')) {
              const [date, time] = s.split(', ');
              return { date: date.trim(), time: time.trim(), isBooked: false };
            }
            if (typeof s === 'object' && s.date && s.time) {
              return { date: s.date, time: s.time, isBooked: !!s.isBooked };
            }
            return null;
          }).filter(Boolean);
        }
      }
    } catch (parseErr) {
      console.error("Data parse error in updateService:", parseErr);
      return res.status(400).json({ success: false, message: "Invalid data format for instructions or slots" });
    }

    const service = await Service.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, message: "Service updated successfully", service });
  } catch (err) {
    console.error("updateService error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ── DELETE /api/services/:id (admin) ─────────────────────────────────────
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── POST /api/services/:id/slots (admin) ──────────────────────────────────
export const addServiceSlot = async (req, res) => {
  try {
    const { date, time } = req.body;
     console.log(date,time);
    if (!date || !time) {
      return res.status(400).json({ success: false, message: "Date and time are required" });
    }
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { $push: { slots: { date, time, isBooked: false } } },
      { new: true }
    );
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(201).json({ success: true, message: "Slot added", slots: service.slots });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/services/dashboard (admin) ──────────────────────────────────
export const getServiceDashboard = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    const allAppts = await ServiceAppointment.find();
    const totalAppointments = allAppts.length;
    const totalCompleted    = allAppts.filter((a) => a.status === "Completed").length;
    const totalCanceled     = allAppts.filter((a) => a.status === "Cancelled").length;
    const totalEarnings     = allAppts
      .filter((a) => a.status === "Completed")
      .reduce((sum, a) => sum + (a.fee || 0), 0);

    // Per-service stats
    const serviceStats = await Promise.all(
      services.map(async (svc) => {
        const appts     = allAppts.filter((a) => String(a.service) === String(svc._id));
        const completed = appts.filter((a) => a.status === "Completed").length;
        const canceled  = appts.filter((a) => a.status === "Cancelled").length;
        const earnings  = appts.filter((a) => a.status === "Completed").reduce((s, a) => s + a.fee, 0);
        return {
          _id:          svc._id,
          name:         svc.name,
          image:        svc.image,
          price:        svc.price,
          available:    svc.available,
          appointments: appts.length,
          completed,
          canceled,
          earnings,
        };
      })
    );

    return res.status(200).json({
      success: true,
      stats: {
        totalServices: services.length,
        totalAppointments,
        totalCompleted,
        totalCanceled,
        totalEarnings,
      },
      services: serviceStats,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
