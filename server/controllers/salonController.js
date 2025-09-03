const mongoose = require('mongoose');
const Salon = require('../models/RegisterModel');
const Branch = require('../models/Branchmodel');
const moment = require('moment-timezone');

const padCounter = (counter) => {
  return counter > 999 ? counter.toString() : counter.toString().padStart(3, '0');
};

const getFormattedDate = () => {
  return moment().tz('Asia/Kolkata').format();
};

const salonController = {

  
    addBranch: async (req, res) => {
      try {
        const {
          salon_id,
          phoneNumber,
          branchName,
          city,
          state,
          area,
          address,
          startTime,
          endTime,
          createdBy
        } = req.body;
  
        // Check for required fields
        if (!salon_id || !phoneNumber || !branchName || !city || !state || !area || !startTime || !endTime || !createdBy) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
  
        // Generate branch_id (example logic)
        const lastBranch = await Branch.findOne({ salon_id }).sort({ branch_id: -1 });
        const branchCounter = lastBranch ? parseInt(lastBranch.branch_id.slice(4)) : 0;
        const branch_id = `BRAI${padCounter(branchCounter + 1)}`;
  
        const newBranch = new Branch({
          branch_id,
          salon_id,
          phoneNumber,
          branchName,
          city,
          state,
          area,
          address,
          startTime,
          endTime,
          status: 'IA',
          createdBy,
          createdAt: getFormattedDate(),
        });
  
        await newBranch.save();
  
        res.status(201).json({
          message: 'Branch added successfully',
          branch: newBranch
        });
      } catch (error) {
        console.error('Error adding branch:', error);
        res.status(500).json({
          error: 'Failed to add branch'
        });
      }
    },
  
  
  fetchBranches: async (req, res) => {
    try {
      const { salon_id } = req.query;
      
      const query = salon_id ? { salon_id } : {};
      const branches = await Branch.find(query);
     
      res.status(200).json(branches);
    } catch (error) {
      console.error('Error fetching branches:', error);
      res.status(500).json({ error: 'Failed to fetch branches' });
    }
  },
  
  // getBranchNameById: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     // Find the branch by ID in your database
  //     const branch = await Branch.findById(id);
  //     if (!branch) {
  //       return res.status(404).json({ error: 'Branch not found' });
  //     }
  //     // If branch found, send the branch name in the response
  //     res.json({ name: branch.branchName });
  //   } catch (error) {
  //     console.error('Error fetching branch name:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // },

  getBranchNameById: async (req, res) => {
    try {
      const { id } = req.params;
      const branch = await Branch.findById(id);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }
      res.json({ name: branch.branchName });
    } catch (error) {
      console.error('Error fetching branch name:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  editBranch : async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const branch = await Branch.findByIdAndUpdate(id, updates, { new: true });
      if (!branch) {
        return res.status(404).send({ error: 'Branch not found' });
      }
      res.send(branch);
    } catch (error) {
      console.error('Error updating branch:', error);
      res.status(400).send({ error: 'Failed to update branch' });
    }
  },

  updatedStatus: async (req, res) => {
    const { id } = req.params;
    const { status, statusBy } = req.body;

    try {
      const updatedBranch = await Branch.findByIdAndUpdate(
        id,
        { status, statusBy },
        { new: true }
      );

      if (!updatedBranch) {
        return res.status(404).json({ message: 'Branch not found' });
      }

      res.json(updatedBranch);
    } catch (error) {
      console.error('Error updating branch status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateBranchDetails: async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
      const updatedBranch = await Branch.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!updatedBranch) {
        return res.status(404).json({ message: 'Branch not found' });
      }

      res.json(updatedBranch);
    } catch (error) {
      console.error('Error updating branch:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = salonController;
