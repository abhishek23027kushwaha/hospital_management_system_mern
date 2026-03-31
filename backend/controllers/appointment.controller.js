import DoctorAppointment from "../models/doctorAppointment.model.js";
import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";

// ── POST /api/appointments/doctor/book ────────────────────────────────────
export const bookDoctorAppointment = async (req, res) => {
  try {
    const { doctorId, slotId, date, timeSlot, service, message } = req.body;

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
      // Mark slot as booked
      if (slot) {
        slot.isBooked = true;
        await doctor.save();
      }
    }

    const user = await User.findById(req.userId);

    const appt = await DoctorAppointment.create({
      patient:              req.userId,
      patientName:          user.name,
      patientEmail:         user.email,
      patientPhone:         user.phone || "",
      patientAge:           user.age || null,
      patientGender:        user.gender || "",
      doctor:               doctorId,
      doctorName:           doctor.name,
      doctorSpecialization: doctor.specialization,
      slotId:               slotId || null,
      date,
      timeSlot,
      service:              service || "",
      message:              message || "",
      fee:                  doctor.fee,
    });

    return res.status(201).json({ success: true, message: "Appointment booked successfully", appointment: appt });
  } catch (err) {
    console.error("bookDoctorAppointment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/appointments/doctor/my ──────────────────────────────────────
export const getUserDoctorAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { patient: req.userId };
    if (status) filter.status = status;

    const appointments = await DoctorAppointment.find(filter)
      .populate("doctor", "name specialization fee image phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, appointments });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── PUT /api/appointments/doctor/:id/cancel (user cancels own appt) ───────
export const cancelDoctorAppointment = async (req, res) => {
  try {
    const appt = await DoctorAppointment.findOne({ _id: req.params.id, patient: req.userId });
    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });
    if (appt.status === "Completed") {
      return res.status(400).json({ success: false, message: "Cannot cancel a completed appointment" });
    }

    appt.status = "Cancelled";
    await appt.save();

    // Free up the slot
    if (appt.slotId) {
      await Doctor.findByIdAndUpdate(appt.doctor, {
        $set: { "slots.$[el].isBooked": false },
      }, {
        arrayFilters: [{ "el._id": appt.slotId }],
      });
    }

    return res.status(200).json({ success: true, message: "Appointment cancelled", appointment: appt });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
