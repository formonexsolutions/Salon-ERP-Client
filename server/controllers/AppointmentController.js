const Customer = require("../models/CustomerModel");

exports.CreateAppointment = async (req, res) => {
  const customerId = req.params.id;
  const appointmentData = req.body;

  try {
    const customer = await Customer.findOne({ _id: customerId });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    // Check if the stylist is available
    const conflictingAppointments = await Customer.find({
      "appointments.stylist": appointmentData.stylist,
      "appointments.date": appointmentData.date,
      $or: [
        {
          "appointments.fromTiming": { $lte: appointmentData.fromTiming },
          "appointments.toTiming": { $gte: appointmentData.fromTiming },
        },
        {
          "appointments.fromTiming": { $lte: appointmentData.toTiming },
          "appointments.toTiming": { $gte: appointmentData.toTiming },
        },
        {
          "appointments.fromTiming": { $gte: appointmentData.fromTiming },
          "appointments.toTiming": { $lte: appointmentData.toTiming },
        },
      ],
    });

    if (conflictingAppointments.length > 0) {
      return res
        .status(409)
        .json({ error: "Stylist is not available at the selected time." });
    }

    // Generate appointmentId for the new appointment
    let maxAppointmentId = 0;
    customer.appointments.forEach((appointment) => {
      const currentId = parseInt(appointment.appointmentId?.substring(4)) || 0;
      maxAppointmentId = Math.max(maxAppointmentId, currentId);
    });
    const newAppointmentId = maxAppointmentId + 1;
    appointmentData.appointmentId = `APMT${String(newAppointmentId).padStart(4, "0")}`;

    // Add the new appointment to the customer's appointments array
    customer.appointments.push(appointmentData);

    // Save the updated customer document
    await customer.save();

    res.status(201).json(appointmentData);
  } catch (error) {
    res.status(500).json({ error: "Error saving appointment data." });
  }
};


exports.updateAppointment = async (req, res) => {
  const { customerId, appointmentId } = req.params;
  const updatedAppointment = req.body;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).send("Customer not found");
    }

    const appointment = customer.appointments.id(appointmentId);
    if (!appointment) {
      return res.status(404).send("Appointment not found");
    }

    // Update the appointment with the new data
    Object.assign(appointment, updatedAppointment);

    // Save the updated customer document
    await customer.save();

    res.send(appointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.DeleteAppointment = async (req, res) => {
  const customerId = req.params.customerId;
  const appointmentId = req.params.appointmentId;

  try {
    // Find the customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      // If the customer with the given ID was not found
      return res.status(404).json({ error: "Customer not found" });
    }

    // Find the appointment within the customer's appointments
    const appointmentIndex = customer.appointments.findIndex(
      (appt) => appt._id.toString() === appointmentId
    );

    if (appointmentIndex === -1) {
      // If the appointment with the given ID was not found within the customer's appointments
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Remove the appointment from the customer's appointments array
    customer.appointments.splice(appointmentIndex, 1);

    // Save the updated customer data
    await customer.save();

    // If the appointment was successfully deleted
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
