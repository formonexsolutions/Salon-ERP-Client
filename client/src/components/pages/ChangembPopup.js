import React, { useState } from 'react';
import '../styles/ChangembPopup.css';
import axios from 'axios';
import { BASE_URL } from '../Helper/helper';

const ChangembPopup = ({ onClose}) => {
  const [phoneNumber, setMobileNumber] = useState('');
  const [oldMobileNumber, setOldMobileNumber] = useState('');
  const [newMobileNumber, setNewMobileNumber] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [activeSection, setActiveSection] = useState('mobileNumber');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdatePassword = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/api/superadmin/update-password`, {
        phoneNumber: phoneNumber,
        oldpassword: oldPassword,
        newpassword: newPassword
      });
      setMessage(response.data.message);
      setError('');
    } catch (error) {
      setMessage('');
      setError(error.response.data.error);
    }
  };

  const handleUpdateMobileNumber = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/api/superadmin/update-mobile-number`, {
        oldmobilenumber: oldMobileNumber,
        newmobilenumber: newMobileNumber
      });
      setMessage(response.data.message);
      setError('');
    } catch (error) {
      setMessage('');
      setError(error.response.data.error);
    }
  };


  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button onClick={onClose} className="close-button">X</button>
        <div className='pop_bu'>
          <button onClick={() => setActiveSection('mobileNumber')}>Change Mobile Number</button>
          <button onClick={() => setActiveSection('password')}>Change Password</button>
        </div>
      {activeSection === 'mobileNumber' && (
        <div>
           <div className='update-col'>
          <input
            type="tel"
            pattern="[0-9]*"
            maxLength={10} 
            className="inp_popup"
            value={oldMobileNumber}
            placeholder='Enter Your Old Mobile Number'
            onChange={(e) => setOldMobileNumber(e.target.value)}
          />
          <input
            type="tel"
            pattern="[0-9]*"
            maxLength={10} 
            className="inp_popup"
            value={newMobileNumber}
            placeholder='Enter Your New Mobile Number'
            onChange={(e) => setNewMobileNumber(e.target.value)}
          />
          </div>
          <button  className="butt_p" onClick={handleUpdateMobileNumber}>Submit</button>
        </div>
      )}
      {activeSection === 'mobileNumber' && message && <div>{message}</div>}
      {activeSection === 'mobileNumber' && error && <div>{error}</div>}

      {activeSection === 'password' && (
        <div>
          <div className='update-col'>
          <input
            type="tel"
            pattern="[0-9]*"
            maxLength={10} 
            value={phoneNumber}
            className="inp_popup"
            placeholder='Enter Your Mobile Number'
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          
          <input
            type="password"
            value={oldPassword}
            className="inp_popup"
            placeholder='Enter Your Old Password'
            onChange={(e) => setOldPassword(e.target.value)}
          />
         
          <input
            type="password"
            value={newPassword}
            className="inp_popup"
            placeholder='Enter Your New Password'
            onChange={(e) => setNewPassword(e.target.value)}
          />
          </div>
          <button  className="butt_p" onClick={handleUpdatePassword}>Submit</button>
        </div>
      )}
      {activeSection === 'password' && message && <div>{message}</div>}
      {activeSection === 'password' && error && <div>{error}</div>} 


      </div>
    </div>
  );
};

export default ChangembPopup;
