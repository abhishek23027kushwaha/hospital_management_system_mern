import ServiceAppointment from "../models/serviceAppointment.model.js";
import Service from "../models/service.model.js";
import User from "../models/user.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayInstance = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const verifySignature = (orderId, paymentId, signature) => {
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(orderId + "|" + paymentId);
  const generated = hmac.digest("hex");
  return generated === signature;
};

// ── POST /api/service-appointments/book ───────────────────────────────────
export const bookServiceAppointment = async (req, res) => {
  try {
    const { 
      serviceId, 
      slotId, 
      date, 
      timeSlot, 
      message,
      patientName,
      patientEmail,
      patientPhone,
      patientAge,
      patientGender,
      paymentMethod
    } = req.body;

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
    }

    const isCash = paymentMethod === "Cash";
    let order = null;

    if (!isCash) {
      // 1. Create Razorpay Order
      const amount = service.price * 100; // in paise
      const options = {
        amount,
        currency: "INR",
        receipt: `receipt_svc_${Date.now()}`,
      };
      order = await razorpayInstance.orders.create(options);
    }

    const user = await User.findById(req.userId);

    const appt = await ServiceAppointment.create({
      patient:       req.userId,
      patientName:   patientName || user.name,
      patientEmail:  patientEmail || user.email,
      patientPhone:  patientPhone || user.phone || "",
      patientAge:    patientAge || user.age || null,
      patientGender: patientGender || user.gender || "",
      service:       serviceId,
      serviceName:   service.name,
      slotId:        slotId || null,
      date,
      timeSlot,
      message:       message || "",
      fee:           service.price,
      paymentMethod: paymentMethod || "Online",
      razorpayOrderId: order ? order.id : null,
      isPaid:        false,
    });

    // If Cash, mark slot booked immediately
    if (isCash && slotId) {
      const slotIndex = service.slots.findIndex(s => s._id.toString() === slotId);
      if (slotIndex !== -1) {
        service.slots[slotIndex].isBooked = true;
        await service.save();
      }
      // Increment total appointments on service
      await Service.findByIdAndUpdate(serviceId, { $inc: { totalAppointments: 1 } });
    }

    return res.status(201).json({ 
      success: true, 
      message: isCash ? "Service appointment booked (Cash)" : "Order created successfully", 
      appointment: appt,
      order: order
    });
  } catch (err) {
    console.error("bookServiceAppointment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── POST /api/service-appointments/verify-payment ──────────────────────────
export const verifyServiceAppointmentPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !appointmentId) {
      return res.status(400).json({ success: false, message: "Payment details missing" });
    }

    // 1. Verify Signature
    const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) return res.status(400).json({ success: false, message: "Invalid payment signature" });

    // 2. Update Appointment
    const appt = await ServiceAppointment.findById(appointmentId);
    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });

    appt.isPaid = true;
    appt.razorpayPaymentId = razorpay_payment_id;
    appt.razorpaySignature = razorpay_signature;
    await appt.save();

    // 3. Mark Slot as Booked in Service model
    if (appt.slotId) {
      await Service.findOneAndUpdate(
        { _id: appt.service, "slots._id": appt.slotId },
        { $set: { "slots.$.isBooked": true }, $inc: { totalAppointments: 1 } }
      );
    }

    return res.status(200).json({ success: true, message: "Payment verified and appointment confirmed", appointment: appt });
  } catch (err) {
    console.error("verifyServiceAppointmentPayment error:", err);
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
