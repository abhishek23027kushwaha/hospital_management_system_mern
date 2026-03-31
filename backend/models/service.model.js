import mongoose from "mongoose";

// Time slot for a service: "22 Mar 2026, 11:00 AM"
const serviceSlotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },   // "22 Mar 2026"
    time: { type: String, required: true },   // "11:00 AM"
    isBooked: { type: Boolean, default: false },
  },
  { _id: true }
);

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Service price is required"],
    },
    about: {
      type: String,
      default: "",
    },
    // Bullet-point instructions for the patient
    instructions: {
      type: [String],
      default: [],
    },
    image: {
      type: String,  // Cloudinary / S3 URL
      default: "",
    },
    available: {
      type: Boolean,
      default: true,
    },
    // Time slots defined when creating the service
    slots: [serviceSlotSchema],
    // Aggregated stats (updated on each appointment)
    totalAppointments: { type: Number, default: 0 },
    totalCompleted:    { type: Number, default: 0 },
    totalCanceled:     { type: Number, default: 0 },
    totalEarnings:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
