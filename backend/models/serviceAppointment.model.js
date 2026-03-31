import mongoose from "mongoose";

const serviceAppointmentSchema = new mongoose.Schema(
  {
    // ── Who is booking ──
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName:  { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientPhone: { type: String, default: "" },
    patientAge:   { type: Number, default: null },
    patientGender:{ type: String, default: "" },

    // ── Which service ──
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    serviceName: { type: String, required: true },

    // ── Slot selected ── (maps to a slot._id in Service.slots)
    slotId:   { type: mongoose.Schema.Types.ObjectId, default: null },
    date:     { type: String, required: true },   // "22 Mar 2026"
    timeSlot: { type: String, required: true },   // "11:00 AM"

    // ── Notes ──
    message: {
      type: String,
      default: "",
    },

    // ── Payment ──
    fee: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },

    // ── Status ──
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const ServiceAppointment = mongoose.model("ServiceAppointment", serviceAppointmentSchema);
export default ServiceAppointment;
