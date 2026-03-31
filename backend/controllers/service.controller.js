import Service from "../models/service.model.js";
import ServiceAppointment from "../models/serviceAppointment.model.js";

// ── POST /api/services (admin) ────────────────────────────────────────────
export const addService = async (req, res) => {
  try {
    const { name, price, about, instructions, image, available, slots } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: "Service name and price are required" });
    }

    const service = await Service.create({
      name:         name.trim(),
      price:        Number(price),
      about:        about || "",
      instructions: Array.isArray(instructions) ? instructions.filter(Boolean) : [],
      image:        image || "",
      available:    available !== undefined ? Boolean(available) : true,
      slots:        Array.isArray(slots) ? slots : [],
    });

    return res.status(201).json({ success: true, message: "Service added successfully", service });
  } catch (err) {
    console.error("addService error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
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
    const { name, price, about, instructions, image, available } = req.body;
    const updates = {};
    if (name !== undefined)         updates.name         = name.trim();
    if (price !== undefined)        updates.price        = Number(price);
    if (about !== undefined)        updates.about        = about;
    if (instructions !== undefined) updates.instructions = instructions.filter(Boolean);
    if (image !== undefined)        updates.image        = image;
    if (available !== undefined)    updates.available    = Boolean(available);

    const service = await Service.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    return res.status(200).json({ success: true, message: "Service updated", service });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
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
