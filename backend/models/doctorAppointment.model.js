import mongoose from "mongoose";

const doctorAppointmentSchema = new mongoose.Schema(
  {
    // ── Who is booking ──
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Snapshot of patient details at time of booking (so data doesn't break if user edits profile)
    patientName:  { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientPhone: { type: String, default: "" },
    patientAge:   { type: Number, default: null },
    patientGender:{ type: String, default: "" },

    // ── Which doctor ──
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    doctorName:          { type: String, required: true },
    doctorSpecialization:{ type: String, required: true },

    // ── Slot selected ── (maps to a slot._id in Doctor.slots)
    slotId:   { type: mongoose.Schema.Types.ObjectId, default: null },
    date:     { type: String, required: true },   // "22 Mar 2026"
    timeSlot: { type: String, required: true },   // "11:00 AM"

    // ── Service / reason ──
    service: {
      type: String,   // Selected service name (from dropdown on booking page)
      default: "",
    },
    message: {
      type: String,   // Additional notes from patient
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

const DoctorAppointment = mongoose.model("DoctorAppointment", doctorAppointmentSchema);
export default DoctorAppointment;
