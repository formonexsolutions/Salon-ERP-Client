const Service = require('../models/ServiceModel');

// Create a new service
exports.CreateService = async (req, res) => {
  try {
    const { serviceName, category, price, GST, durationTime, createdBy, salon_id } = req.body;
    const serviceId = await Service.generateServiceId();
    const newService = new Service({
      serviceId,
      serviceName,
      category,
      price,
      GST,
      durationTime,
      createdBy,
      salon_id, // Include salon_id from request body
      status: 'AA', // Set default status to Active
    });
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create service.' });
  }
};






exports.ReadService = async (req, res) => {
  try {
    const {salon_id} = req.query; // Get salon_id from request headers
    if (!salon_id) {
      return res.status(400).json({ error: 'Salon ID is missing in the request headers.' });
    }

    const services = await Service.find({ salon_id });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch services.' });
  }
};

// Update a service
exports.UpdateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceName, category, price, GST, durationTime ,modifiedBy} = req.body;
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { serviceName, category, price, GST, durationTime,modifiedBy },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update service.' });
  }
};


exports.UpdateServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status,statusBy} = req.body;

    // Ensure the status is either "AA" or "IA"
    if (!['AA', 'IA'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value. Must be "AA" or "IA".' });
    }

    // Find and update the service status
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { status ,statusBy},
      { new: true }
    );

    // Check if the service was found and updated
    if (!updatedService) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    // Return the updated service
    res.status(200).json(updatedService);
  } catch (error) {
    console.error('Error updating service status:', error);
    res.status(500).json({ error: 'Unable to update service status.' });
  }
};


// Delete a service
exports.DeleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await Service.findByIdAndRemove(id);

    if (!deletedService) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    res.json(deletedService);
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete service.' });
  }
};
