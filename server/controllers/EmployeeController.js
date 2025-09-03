const Employee = require('../models/EmployeeModel');
const EmployeeIDCounter = require('../models/EmployeeIdModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.CreateEmployee = [
  upload.single('file'),

  async (req, res) => {
    try {
      const { salon_id } = req.body; // Assuming salon_id is sent in the request body

      // Validate salon_id
      if (!salon_id) {
        return res.status(400).json({ error: 'Salon ID is required.' });
      }

      // Fetch existing employees for the salon
      const existingEmployees = await Employee.find({ salon_id });

      // Find the maximum staff_id among existing employees
      let maxEmployeeNumber = 0;
      existingEmployees.forEach((employee) => {
        const employeeIdNumber = parseInt(employee.staff_id.replace('STAF', ''), 10);
        if (!isNaN(employeeIdNumber) && employeeIdNumber > maxEmployeeNumber) {
          maxEmployeeNumber = employeeIdNumber;
        }
      });

      // Increment the staff_id based on the maximum employee number
      const currentEmployeeNumber = maxEmployeeNumber + 1;
      const currentEmployeeId = `STAF${currentEmployeeNumber.toString().padStart(3, '0')}`;

      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const employeeData = {
        staff_id: currentEmployeeId,
        salon_id, // Use the salon_id from the request body
        employeeName: req.body.employeeName,
        password: hashedPassword, // Store the hashed password
        phoneNumber: req.body.phoneNumber,
        Qualification: req.body.Qualification,
        experience: req.body.experience,
        specialization: req.body.specialization,
        gender: req.body.gender,
        branchName: req.body.branchName,
        role: req.body.role,
        branch_id: req.body.branch_id,
        createdByName: req.body.createdByName,
        createdAt: req.body.createdAt,
        modifiedBy: req.body.modifiedBy,
        modifiedAt: req.body.modifiedAt
      };

      const employee = new Employee(employeeData);
      await employee.validate();
      await employee.save();

      // Remove uploaded file if exists
      if (req.file) {
        await fs.unlink(req.file.path);
      }

      res.status(201).json(employee);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while creating the employee.' });
    }
  },
];




// Other controller methods remain the same...

// Other controller methods remain the same


// Other controller methods remain the same

  
  // Fetch all employees
  // Fetch employees based on salon_id
exports.ReadEmployee = async (req, res) => {
  try {
    const { salon_id } = req.query;
    if (!salon_id) {
      // return res.status(400).json({ error: 'Salon ID is required.' });
    }

    const employees = await Employee.find({ salon_id });
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching employees.' });
  }
};

exports.ReadStylistsBySalonAndBranch = async (req, res) => {
  try {
    const { salon_id, branch_id } = req.query;
    if (!salon_id || !branch_id) {
      return res.status(400).json({ error: 'Salon ID and Branch ID are required.' });
    }

    const stylists = await Employee.find({ salon_id, branch_id, role: 'stylist' });
    res.json(stylists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching stylists.' });
  }
};

  // Update an employee
  // EmployeeController.js

// Update an employee
exports.UpdateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      employeeName, 
      phoneNumber, 
      password, 
      qualification, 
      role, 
      stylist, 
      experience, 
      gender, 
      specialization, 
      branchId, 
      branchName,
      modifiedBy,
    } = req.body;

    // Initialize an update object
    const updateData = {
      employeeName,
      phoneNumber,
      qualification,
      role,
      stylist,
      experience,
      gender,
      specialization,
      branchId,
      branchName,
      modifiedBy,
    };

    // Check if password is provided and hash it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Update the employee's modifiedBy field with admin name from frontend
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    res.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the employee.' });
  }
};


// Other controller methods remain the same...

    
   // Delete an employee
   exports.DeleteEmployee= async (req, res) => {
    const { id } = req.params;
    try {
      const deletedEmployee = await Employee.findByIdAndRemove(id);
      if (!deletedEmployee) {
        return res.status(404).json({ error: 'Employee not found.' });
      }
      res.json({ message: 'Employee deleted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while deleting the employee.' });
    }
  };

  exports.updateStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status,statusBy } = req.body;

      // Ensure the status is either "AA" or "IA"
    if (!['AA', 'IA'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value. Must be "AA" or "IA".' });
    }
  
      // Update the employee's status
      const updatedEmployee = await Employee.findByIdAndUpdate(id, { status,statusBy }, { new: true });
  
      if (!updatedEmployee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      res.status(200).json(updatedEmployee);
    } catch (error) {
      console.error('Error updating employee activation status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  // exports.ActivateEmployee = async (req, res) => {
  //   const { id } = req.params;
  //   try {
  //     const updatedEmployee = await Employee.findByIdAndUpdate(id, { status: 'AA' }, { new: true });
  //     if (!updatedEmployee) {
  //       return res.status(404).json({ error: 'Employee not found.' });
  //     }
  //     res.json(updatedEmployee);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ error: 'An error occurred while activating the employee.' });
  //   }
  // };
  
  // exports.DeactivateEmployee = async (req, res) => {
  //   const { id } = req.params;
  //   try {
  //     const updatedEmployee = await Employee.findByIdAndUpdate(id, { status: 'IA' }, { new: true });
  //     if (!updatedEmployee) {
  //       return res.status(404).json({ error: 'Employee not found.' });
  //     }
  //     res.json(updatedEmployee);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ error: 'An error occurred while deactivating the employee.' });
  //   }
  // };
  exports.GetStylists = async (req, res) => {
    try {
      const stylists = await Employee.find({ role: 'stylist' }).select('employeeName');
      res.json(stylists);
    } catch (err) {
      console.error('Error fetching stylists:', err);
      res.status(500).json({ error: 'An error occurred while fetching stylists.' });
    }
  }; 
