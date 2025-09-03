const Customer = require("../models/CustomerModel");
const Salon = require("../models/RegisterModel");

exports.CreateCustomer = async (req, res) => {
  try {
    const { name, phone, branchId, branchName, createdByModel, createdBy } = req.body;

    // Ensure all required fields are present
    if (!name || !phone || !branchId || !branchName || !createdBy || !createdByModel) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch the salon_id from query parameters
    const salonId = req.query.salon_id;
    if (!salonId) {
      return res.status(400).json({ error: "Salon ID not provided" });
    }

    const newCustomer = new Customer({
      name,
      phone,
      branchId,
      branchName,
      createdBy,
      createdByModel,
      salon_id: salonId, // Store salon_id as a string
      appointments: [],
      billing: [],
    });

    // Save the new customer to the database
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error saving customer data:", error);
    res.status(500).json({ error: "Error saving customer data" });
  }
};


exports.GetCustomers = async (req, res) => {
  try {
    const { salonId, branchId } = req.query;

    if (!salonId || !branchId) {
      // return res.status(400).json({ error: "Salon ID or Branch ID not provided" });
    }

    const customers = await Customer.find({ salon_id: salonId, branchId });
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error.message);
    res.status(500).json({ message: "An error occurred while fetching customers" });
  }
};


exports.UpdateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, phone } = req.body;
  const modifiedBy = req.headers['modified-by'];

  if (!id) {
    return res.status(400).json({ message: 'Customer ID is required' });
  }

  if (!modifiedBy) {
    return res.status(400).json({ message: 'Modifier name is required' });
  }

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.name = name || customer.name;
    customer.phone = phone || customer.phone;
    customer.modifiedBy = modifiedBy;  // Ensure this is updated
    customer.modifiedAt = new Date();

    await customer.save();

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error updating customer:', error.message);
    res.status(500).json({ message: 'An error occurred while updating the customer' });
  }
};


exports.GetDailyStatistics = async (req, res) => {
  try {
    const { branchId } = req.query;

    if (!branchId) {
      return res.status(400).json({ error: "Branch ID missing in query parameters" });
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const customers = await Customer.find({ branchId });

    let serviceAmount = 0;
    let inventoryAmount = 0;
    let billsGenerated = 0;
    let appointmentsCount = 0;

    customers.forEach(customer => {
      customer.billing.forEach(bill => {
        if (bill.date) {
          const billDate = new Date(bill.date);
          if (billDate >= startOfDay && billDate <= endOfDay) {
            serviceAmount += bill.serviceFinalTotal || 0;
            inventoryAmount += bill.itemFinalTotal || 0;
            billsGenerated++;
          }
        }
      });

      customer.appointments.forEach(appointment => {
        if (appointment.date) {
          const appointmentDate = new Date(appointment.date);
          if (appointmentDate >= startOfDay && appointmentDate <= endOfDay) {
            appointmentsCount++;
          }
        }
      });
    });

    res.status(200).json({
      serviceAmount,
      inventoryAmount,
      billsGenerated,
      appointmentsCount
    });
  } catch (error) {
    console.error("Error fetching daily statistics:", error);
    res.status(500).json({ error: "Error fetching daily statistics" });
  }
};

exports.getAppointmentsByBranch = async (req, res) => {
  const { branchId, salonId } = req.query; // Get both branchId and salonId from query parameters

  if (!branchId) {
    return res.status(400).json({ message: 'branchId query parameter is required' });
  }

  if (!salonId) {
    return res.status(400).json({ message: 'salonId query parameter is required' });
  }

  try {
    const customers = await Customer.find({ salon_id: salonId, branchId });

    const appointments = customers.flatMap(customer =>
      customer.appointments.map(appointment => ({
        customerId: customer._id,
        name: customer.name,
        phone: customer.phone,
        ...appointment
      }))
    );

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

