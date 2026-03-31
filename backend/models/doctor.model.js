import mongoose from "mongoose";

// Each time slot: "22 Mar 2026, 11:00 AM"
const slotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },  // "22 Mar 2026"
    time: { type: String, required: true },  // "11:00 AM"
    isBooked: { type: Boolean, default: false },
  },
  { _id: true }
);

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    phone: {
      type: String,
      default: "",
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      enum: [
        "General Physician",
        "Cardiologist",
        "Dermatologist",
        "Neurologist",
        "Orthopedic",
        "Pediatrician",
        "Psychiatrist",
        "Gynecologist",
        "Oncologist",
        "ENT Specialist",
        "Ophthalmologist",
        "Urologist",
        "Dentist",
        "Nephrologist",
        "Surgeon",
        "Other",
      ],
    },
    experience: {
      type: Number,  // years
      default: 0,
    },
    fee: {
      type: Number,
      required: [true, "Consultation fee is required"],
    },
    about: {
      type: String,
      default: "",
    },
    image: {
      type: String,  // Cloudinary / S3 URL
      default: "",
    },
    available: {
      type: Boolean,
      default: true,
    },
    // Time slots added from Add Service / Doctor panel
    slots: [slotSchema],
    // Total earnings (updated on each completed appointment)
    totalEarnings: {
      type: Number,
      default: 0,
    },
    qualifications: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    patients: {
      type: String,
      default: "0",
    },
    success: {
      type: String,
      default: "100",
    },
    rating: {
      type: Number,
      default: 5,
    },
    role: {
      type: String,
      default: "doctor",
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
