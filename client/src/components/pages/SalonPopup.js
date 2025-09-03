import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from '../Helper/helper';

const AddSuperAdmin = () => {
  const [superAdminName, setSuperAdminName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const createdBy = localStorage.getItem('superAdminName') || 'superadmin';
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/superadmins`, {
        superAdminName,
        phoneNumber,
        password,
        createdBy,
        createdAt: new Date().toISOString(),
      });
      toast.success('SuperAdmin added successfully');
      // Reset form fields
      setSuperAdminName('');
      setPhoneNumber('');
      setPassword('');
    } catch (error) {
      toast.error('Error adding SuperAdmin');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>SuperAdmin Name:</label>
        <input
          type="text"
          value={superAdminName}
          onChange={(e) => setSuperAdminName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add SuperAdmin</button>
    </form>

  );
};

export default AddSuperAdmin;