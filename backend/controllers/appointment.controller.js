import Razorpay from "razorpay";
import crypto from "crypto";
import DoctorAppointment from "../models/doctorAppointment.model.js";
import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";

const razorpayInstance = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── Helpers ──
const verifySignature = (orderId, paymentId, signature) => {
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(orderId + "|" + paymentId);
  const generated = hmac.digest("hex");
  return generated === signature;
};

// ── POST /api/appointments/book ────────────────────────────────────
// Now also creates a Razorpay order
export const bookDoctorAppointment = async (req, res) => {
  try {
    const { 
      doctorId, slotId, date, timeSlot, service, message,
      name, email, phone, age, gender, paymentMethod 
    } = req.body;

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: "Doctor, date and time slot are required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    if (!doctor.available) {
      return res.status(400).json({ success: false, message: "Doctor is not available" });
    }

    // Check slot is not already booked
    if (slotId) {
      const slot = doctor.slots.id(slotId);
      if (slot && slot.isBooked) {
        return res.status(409).json({ success: false, message: "This slot is already booked" });
      }
    }

    const isCash = paymentMethod === "Cash";
    let order = null;

    if (!isCash) {
      // 1. Create Razorpay Order
      const amount = doctor.fee * 100; // in paise
      const options = {
        amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };
      order = await razorpayInstance.orders.create(options);
    }

    // 2. Create local appointment
    const appt = await DoctorAppointment.create({
      patient:              req.userId,
      patientName:          name || "Unknown",
      patientEmail:         email || "Unknown",
      patientPhone:         phone || "",
      patientAge:           Number(age) || null,
      patientGender:        gender || "",
      doctor:               doctorId,
      doctorName:           doctor.name,
      doctorSpecialization: doctor.specialization,
      slotId:               slotId || null,
      date,
      timeSlot,
      service:              service || "",
      message:              message || "",
      fee:                  doctor.fee,
      paymentMethod:        paymentMethod || "Online",
      razorpayOrderId:      order ? order.id : null,
      isPaid:               false, // Still false for Cash till they pay at clinic
    });

    // 3. If Cash, mark slot booked immediately
    if (isCash && slotId) {
      const slotIndex = doctor.slots.findIndex(s => s._id.toString() === slotId);
      if (slotIndex !== -1) {
        doctor.slots[slotIndex].isBooked = true;
        await doctor.save();
      }
    }

    return res.status(201).json({
      success: true,
      message: isCash ? "Appointment booked successfully (Cash)" : "Order created successfully",
      appointment: appt,
      order: order,
    });
  } catch (err) {
    console.error("bookDoctorAppointment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── POST /api/appointments/doctor/verify-payment ──────────────────────────
export const verifyDoctorAppointmentPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !appointmentId) {
      return res.status(400).json({ success: false, message: "Payment details missing" });
    }

    // 1. Verify Signature
    const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) return res.status(400).json({ success: false, message: "Invalid payment signature" });

    // 2. Update Appointment
    const appt = await DoctorAppointment.findById(appointmentId);
    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });

    appt.isPaid = true;
    appt.razorpayPaymentId = razorpay_payment_id;
    appt.razorpaySignature = razorpay_signature;
    await appt.save();

    // 3. Mark Slot as Booked in Doctor model
    if (appt.slotId) {
      await Doctor.findOneAndUpdate(
        { _id: appt.doctor, "slots._id": appt.slotId },
        { $set: { "slots.$.isBooked": true } }
      );
    }

    return res.status(200).json({ success: true, message: "Payment verified and appointment confirmed", appointment: appt });
  } catch (err) {
    console.error("verifyDoctorAppointmentPayment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/appointments/doctor/my ──────────────────────────────────────
export const getUserDoctorAppointments = async (req, res) => {
  try {
    const filter = { patient: req.userId };
    const appointments = await DoctorAppointment.find(filter)
      .populate("doctor", "name specialization fee image phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, appointments });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── POST /api/appointments/doctor/:id/cancel ──────────────────────────────
export const cancelDoctorAppointment = async (req, res) => {
  try {
    const appt = await DoctorAppointment.findOne({ _id: req.params.id, patient: req.userId });
    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });
    if (appt.status === "Completed") return res.status(400).json({ success: false, message: "Cannot cancel a completed appointment" });

    appt.status = "Cancelled";
    await appt.save();

    // Free up the slot
    if (appt.slotId) {
      await Doctor.findOneAndUpdate(
        { _id: appt.doctor, "slots._id": appt.slotId },
        { $set: { "slots.$.isBooked": false } }
      );
    }

    return res.status(200).json({ success: true, message: "Appointment cancelled", appointment: appt });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
