import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ContinueSubscription.css';
import { BASE_URL } from '../Helper/helper'; // Assuming BASE_URL is defined for API endpoint
import { useNavigate } from 'react-router';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RenewalCheck = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [staffData, setStaffData] = useState(null);
  const [salonName, setSalonName] = useState('');
  const [salonId, setSalonId] = useState(''); // Add state for salonId
  const navigate = useNavigate();

  // Function to validate mobile number format
  const validateMobileNumber = (number) => {
    const pattern = /^[0-9]*$/; // Matches only numeric digits (0-9)
    return pattern.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateMobileNumber(mobileNumber)) {
      setError('Please enter a valid mobile number (numeric digits only)');
      return;
    }

    if (mobileNumber.length !== 10) {
      setError('Mobile number must be exactly 10 digits');
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/staffs`, {
        params: { phoneNumber: mobileNumber }
      });

      const { adminName, phoneNumber, salonName, salon_id } = response.data;

      if (adminName) {
        setStaffData({ adminName, phoneNumber });
        setSalonName(salonName);
        setSalonId(salon_id); // Set the salonId state
        setError('');
      } else {
        setError('No staff found for this mobile number');
        setStaffData(null);
        setSalonName('');
        setSalonId(''); // Reset the salonId state
      }
    } catch (error) {
      console.error('Error fetching staff data:', error);
      toast.warn("We couldnt find a salon registered with this number  Would you like to try a different number?");
      setStaffData(null);
      setSalonName('');
      setSalonId(''); // Reset the salonId state
    }
  };

  const handleNav = () => {
    const registeredData = {
      SalonName: salonName,
      SalonID: salonId, // Use the custom formatted salonId
      adminName: staffData.adminName,
      phoneNumber: staffData.phoneNumber,
    };
    localStorage.setItem('registeredData', JSON.stringify(registeredData));
  
    // Navigate to '/Subscription'
    navigate('/Subscription');
  };
  
  return (
    <div>
      <div className='maincontainer_check'>
        <div className='Main_container_check'>
          <p className='heading_check'>Renewal Check</p>

          <div>
            <p className='hehe_check_k'>Enter your Mobile Number</p>
            <form onSubmit={handleSubmit}>
              <input 
                type='text'
                maxLength={10}
                className='input_check'
                value={mobileNumber}
                onChange={(e) => {
                  const inputNumber = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                  setMobileNumber(inputNumber);
                }}
              />
              <button type='submit' className='butt_check_sub'>Submit</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {staffData && (
              <div>
                <br></br>
                <h5>Salon Details</h5>
                {salonName && <p>Salon Name: {salonName}</p>}
                <p>Name: {staffData.adminName}</p>
                <p>Number: {staffData.phoneNumber}</p>
                <p>Salon ID: {salonId}</p> {/* Display the custom formatted salonId */}
                <p>Confirm your details</p>
                <button type='button' className='butt_check_sub12' onClick={handleNav}>Confirm</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewalCheck;
