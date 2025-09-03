import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EditService.css';
import { toast , ToastContainer  } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../Helper/helper';

const EditService = ({ selectedService, onSave,  onCancelEdit }) => {
  const [editedService, setEditedService] = useState(selectedService);
  const loggedInUser = localStorage.getItem('adminName') || localStorage.getItem('employeeName');

  useEffect(() => {
    // Separate the hours and minutes from the durationTime string if it exists
    if (selectedService.durationTime) {
      const [hours, minutes] = selectedService.durationTime.split(':');
      setEditedService({
        ...selectedService,
        hours: hours || '',
        minutes: minutes || '',
      });
    } else {
      setEditedService(selectedService);
    }
  }, [selectedService]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "price" && /^\d{0,5}$/.test(value)) {
      setEditedService({ ...editedService, [name]: value });
    } else if (name === "GST" && /^\d{0,2}$/.test(value)) {
      setEditedService({ ...editedService, [name]: value });
    } else if (name !== "price" && name !== "GST") {
      setEditedService({ ...editedService, [name]: value });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "-" || e.key === "+") {
      e.preventDefault();
    }
  };

  const handleSave = async () => {
    try {
      const durationTime = `${editedService.hours}:${editedService.minutes}`;
      const updatedService = {
        ...editedService,
        durationTime: durationTime,
        modifiedBy: loggedInUser
      };
      await axios.put(`${BASE_URL}/api/services/${updatedService._id}`, updatedService);
      onSave(updatedService);
      toast.success('Service Edited successfully!', {
        position: 'top-right',
        autoClose: 3000, // Close the toast after 3000 milliseconds (3 seconds)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error('Error updating service:', error);
    }
  };

  return (
    <div className="edit-service-container-sk142sk">
      <h5 className='heading234'>Edit Service</h5>
     
      <div className='flextochange90'>
        <div className='labelchange567'>
        <label className="label-sk142sk">Service Name :</label>
        </div>
        <input
          required
          type="text"
          name="serviceName"
          value={editedService.serviceName}
          onChange={handleInputChange}
          className="input-sk142sk"
        />
      </div>
      <div className='flextochange90'>
      <div className='labelchange567'>
        <label className="label-sk142sk">Category :</label>
        </div>
        <select
          id="category"
          name="category"
          value={editedService.category}
          onChange={handleInputChange}
          className="input-sk142sk"
          required
        >
         <option value="">Select category</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Transgender">Others</option>
     </select>
      </div>
      <div className='flextochange90'>
      <div className='labelchange567'>
        <label className="label-sk142sk">Price :</label>
        </div>
        <input
          type="number"
          name="price"
          value={editedService.price}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="input-sk142sk"
          required
        />
      </div>
      <div className='flextochange90'>
      <div className='labelchange567'>
        <label className="label-sk142sk"> GST% :</label>
        </div>
        <input
          type="number"
          name="GST"
          value={editedService.GST}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="input-sk142sk"
          required
        />
      </div>
      <div className='flextochange90'>
      <div className='labelchange567'>
        <label className="label-sk142sk">Duration Time :</label>
        </div>
        <div className="time-input-container">
          <input
            type="number"
            id="hours"
            name="hours"
            value={editedService.hours}
            onChange={handleInputChange}
            min="0"
            max="23"
            className="input-sk142sk time-input"
            placeholder="HH"
            required
          />
          <span className="time-separator">:</span>
          <input
            type="number"
            id="minutes"
            name="minutes"
            value={editedService.minutes}
            onChange={handleInputChange}
            min="0"
            max="59"
            className="input-sk142sk time-input"
            placeholder="MM"
            required
          />
        </div>
      </div>
      <div className='buttons567'>
      <button type="button" onClick={handleSave} className="save-button-sk142sk">
        Save
      </button>

      <button type="button" onClick={onCancelEdit} className="delete-button-sk142sk">
          Cancel 
      </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default EditService;
