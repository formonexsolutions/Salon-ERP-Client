import React, { useState } from 'react';
import '../styles/CustomerDetailsEdit.css';
import axios from 'axios'; // Assuming you are using axios for API requests
import { BASE_URL } from '../Helper/helper'; // Adjust the path as needed

const CustomerDetailsPopup = ({ customer, onSave, onClose }) => {
  const [editedCustomer, setEditedCustomer] = useState(customer);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCustomer({
      ...editedCustomer,
      [name]: value
    });
  };

  const handleSaveClick = async () => {
    try {
      // const userRole = localStorage.getItem('userRole');
      const modifiedBy = localStorage.getItem('employeeName') || localStorage.getItem('adminName');
  
      if (!modifiedBy) {
        throw new Error('Unable to retrieve the modifier name from localStorage');
      }
  
      const updatedCustomer = {
        ...editedCustomer,
        modifiedBy,
        modifiedAt: new Date().toISOString(),
      };
  
      const customerId = customer.id || customer._id;
      if (!customerId) {
        throw new Error('Customer ID is missing');
      }
  
      await axios.put(
        `${BASE_URL}/api/customers/${customerId}`,
        updatedCustomer,
        { headers: { 'modified-by': modifiedBy } }  // Sending modifiedBy in headers
      );
  
      onSave(updatedCustomer);
      onClose();
    } catch (error) {
      console.error('Error saving customer details:', error.message);
    }
  };
  
  return (
    <div className="A7-customer-details-popup">
      <div className='A7-cust-edit-content-popup'>
        <div><h5 className='A7-cust-popup-h5'>Edit Customer Details</h5></div>
        <div className='A7-cust-edit-popup-close'>
          <button className='btn0011' onClick={onClose}>x</button>
        </div>
      </div><br/>
      <div className='margin184'>
        <label className='label203'>Name</label> 
        <input className='A7-cust-popup-input'
          type="text"
          name="name"
          value={editedCustomer.name}
          onChange={handleInputChange}
        />
      </div>
      <div className='margin184'>
        <label className='label203'>Phone No.</label>
        <input className='A7-cust-popup-input'
          type="tel"
          name="phone"
          maxLength={10}
          value={editedCustomer.phone}
          onChange={handleInputChange}
        />
      </div>
      <div className='btn123'>
        <button type='button' className='A7-cust-popup-button' onClick={handleSaveClick}>Save</button>
      </div>
    </div>
  );
};

export default CustomerDetailsPopup;

