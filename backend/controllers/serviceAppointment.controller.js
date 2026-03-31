import ServiceAppointment from "../models/serviceAppointment.model.js";
import Service from "../models/service.model.js";
import User from "../models/user.model.js";

// ── POST /api/service-appointments/book ───────────────────────────────────
export const bookServiceAppointment = async (req, res) => {
  try {
    const { serviceId, slotId, date, timeSlot, message } = req.body;

    if (!serviceId || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: "Service, date and time slot are required" });
    }

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    if (!service.available) {
      return res.status(400).json({ success: false, message: "This service is currently unavailable" });
    }

    // Check slot availability
    if (slotId) {
      const slot = service.slots.id(slotId);
      if (slot && slot.isBooked) {
        return res.status(409).json({ success: false, message: "This slot is already booked" });
      }
      if (slot) {
        slot.isBooked = true;
        await service.save();
      }
    }

    const user = await User.findById(req.userId);

    const appt = await ServiceAppointment.create({
      patient:       req.userId,
      patientName:   user.name,
      patientEmail:  user.email,
      patientPhone:  user.phone || "",
      patientAge:    user.age || null,
      patientGender: user.gender || "",
      service:       serviceId,
      serviceName:   service.name,
      slotId:        slotId || null,
      date,
      timeSlot,
      message:       message || "",
      fee:           service.price,
    });

    // Increment total appointments on service
    await Service.findByIdAndUpdate(serviceId, { $inc: { totalAppointments: 1 } });

    return res.status(201).json({ success: true, message: "Service appointment booked", appointment: appt });
  } catch (err) {
    console.error("bookServiceAppointment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/service-appointments/my ──────────────────────────────────────
export const getUserServiceAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { patient: req.userId };
    if (status) filter.status = status;

    const appointments = await ServiceAppointment.find(filter)
      .populate("service", "name price image")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, appointments });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── PUT /api/service-appointments/:id/cancel (user cancels) ──────────────
export const cancelServiceAppointment = async (req, res) => {
  try {
    const appt = await ServiceAppointment.findOne({ _id: req.params.id, patient: req.userId });
    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });
    if (appt.status === "Completed") {
      return res.status(400).json({ success: false, message: "Cannot cancel a completed appointment" });
    }

    appt.status = "Cancelled";
    await appt.save();

    // Free up slot
    if (appt.slotId) {
      await Service.findByIdAndUpdate(appt.service, {
        $set: { "slots.$[el].isBooked": false },
      }, {
        arrayFilters: [{ "el._id": appt.slotId }],
      });
    }

    await Service.findByIdAndUpdate(appt.service, { $inc: { totalCanceled: 1 } });

    return res.status(200).json({ success: true, message: "Appointment cancelled", appointment: appt });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/service-appointments (admin) ────────────────────────────────
export const getAllServiceAppointments = async (req, res) => {
  try {
    const { status, search, serviceId } = req.query;
    const filter = {};
    if (status)    filter.status      = status;
    if (serviceId) filter.service     = serviceId;
    if (search)    filter.patientName = { $regex: search, $options: "i" };

    const appointments = await ServiceAppointment.find(filter)
      .populate("patient", "name email phone")
      .populate("service", "name price image")
      .sort({ createdAt: -1 });

    const stats = {
      total:     appointments.length,
      pending:   appointments.filter((a) => a.status === "Pending").length,
      completed: appointments.filter((a) => a.status === "Completed").length,
      cancelled: appointments.filter((a) => a.status === "Cancelled").length,
      earnings:  appointments.filter((a) => a.status === "Completed").reduce((s, a) => s + a.fee, 0),
    };

    return res.status(200).json({ success: true, stats, appointments });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── PUT /api/service-appointments/:id/status (admin) ─────────────────────
export const updateServiceAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Pending", "Completed", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(", ")}` });
    }

    const appt = await ServiceAppointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });

    // Update service aggregated stats
    if (status === "Completed") {
      await Service.findByIdAndUpdate(appt.service, {
        $inc: { totalCompleted: 1, totalEarnings: appt.fee },
      });
    }

    return res.status(200).json({ success: true, message: "Status updated", appointment: appt });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
