import React, { useState, useEffect } from "react";
import "../styles/Settings.css";
import "../styles/SuperNavbar.css";
import Salonlogo from "../images/Salon-logo.png";
import axios from "axios";
import "../styles/ChangembPopup.css";
import "../styles/SuperPopup.css";
import { useNavigate } from "react-router-dom";

import { BASE_URL } from "../Helper/helper";
import { toast } from "react-toastify";
import Buttons from "./Buttons";

const Setting = () => {
  const [superAdmins, setSuperAdmins] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [changePopup, setChangePopup] = useState(false);
  const [superAdminName, setSuperAdminName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("phoneNumber");
  const [newMobileNumber, setNewMobileNumber] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmNewPassword] = useState("");
  const [/*message*/, setMessage] = useState("");
  const [/*error*/, setError] = useState("");
  const [currentMobileNumber, setcurrentMobileNumber] = useState("");

  const [nameError, setNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [/*superAdminNameError*/, setSuperAdminNameError] = useState("");
  const [/*confirmPasswordError*/, setConfirmPasswordError] = useState("");

  const createdBy = localStorage.getItem("superAdminName");
  // const superAdminId = localStorage.getItem("superAdminId");
  // const userRole = localStorage.getItem("userRole");

  const navigate = useNavigate();
  const mapStatusToFrontend = (status) => {
    switch (status) {
      case "AA":
        return "Activate";
      case "IA":
        return "Deactivate";
      default:
        return status;
    }
  };
  const toggleActivation = async (adminId, currentStatus) => {
    const newStatus = currentStatus === "AA" ? "IA" : "AA";
  
    try {
      // Show a loading toast or similar if needed
  
      const response = await axios.put(
        `${BASE_URL}/api/superadmins/${adminId}/status`,
        { status: newStatus }
      );
  
      if (response.status === 200) {
        const updatedAdmins = superAdmins.map((admin) =>
          admin._id === adminId ? { ...admin, status: newStatus } : admin
        );
        setSuperAdmins(updatedAdmins);
        toast.success("Status updated successfully");
      }
    } catch (error) {
      console.error("Error toggling activation:", error);
      toast.error("Error updating status");
    }
  };
  
  

  const fetchSuperAdmins = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/superadmins/fetch`);
      setSuperAdmins(response.data);
    } catch (error) {
      console.error("Error fetching SuperAdmins", error);
    }
  };

  useEffect(() => {
    fetchSuperAdmins();
  }, []);

  const namePattern = /^[a-zA-Z0-9\s'-]{3,50}$/;
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!superAdminName.trim()) {
      setNameError("SuperAdmin name is required");
      return;
    }
    if (!namePattern.test(superAdminName)) {
      setNameError(
        "SuperAdmin name must be between 3 and 50 characters long and can only contain alphanumeric characters, spaces, hyphens, and apostrophes."
      );
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      setPhoneNumberError(
        "Invalid phone number. It should start with 6-9 and have 10 digits"
      );
      return;
    }
    if (
      !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(password) ||
      password.length < 8 ||
      password.length > 16
    ) {
      setPasswordError(
        "Password must contain at least one digit, one lowercase and uppercase letter, and one special character. It should be between 8 and 16 characters"
      );
      return;
    }
    if (password !== confirmpassword) {
      setPasswordsMatch(false);
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/api/superadmins`, {
        superAdminName,
        phoneNumber,
        password,
        confirmpassword,
        createdBy,
        createdAt: new Date().toISOString(),
      });
      if (response.status === 201) {
        toast.success("SuperAdmin added successfully");
        setSuperAdminName("");
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");
        setShowPopup(false); // Close the popup on successful submission
        fetchSuperAdmins();
      } else {
        toast.error("Failed to add SuperAdmin");
      }
    } catch (error) {
      console.error("Error adding SuperAdmin:", error.message);
      toast.error("Error adding SuperAdmin");
    }
  };

  const filteredSuperAdmins = superAdmins.filter(
    (superAdmin) =>
      superAdmin.superAdminName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      superAdmin.phoneNumber.includes(searchQuery)
  );

  const handleUpdatePhoneNumber = async (e) => {
    e.preventDefault();

    if (newMobileNumber.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/superadmins/update-phone`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentMobileNumber, newMobileNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("phoneNumber", newMobileNumber);
        setcurrentMobileNumber(newMobileNumber);
        setMessage(data.message);

        // Display success toast message
        toast.success("Phone number updated successfully");

        setError("");
      } else {
        setError(data.message);
        // Display error toast message
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Something went wrong. Please try again.");
      // Display error toast message
      toast.error("Something went wrong. Please try again.");
    }
  };

  // const showToast = (type, message) => {
  //   if (type === "success") {
  //     // Show success toast
  //     // Example: enqueueSnackbar(message, { variant: 'success' });
  //   } else if (type === "error") {
  //     // Show error toast
  //     // Example: enqueueSnackbar(message, { variant: 'error' });
  //   }
  // };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}/api/superadmins/update-password`,
        {
          phoneNumber: currentMobileNumber,
          oldPassword,
          newPassword,
          confirmPassword,
        }
      );

      if (response.status === 200) {
        setMessage(response.data.message);
        toast.success(response.data.message);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setError(
        "Incorrect old password. Please enter the correct old password."
      );
      toast.error(
        "Incorrect old password. Please enter the correct old password."
      );
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSuperAdminNameError("");
    setPhoneNumberError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setNameError("");
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logging out...");
    navigate("/"); // Navigate to the login page
  };

  const handleOpenChangePopup = () => {
    setChangePopup(true);
  };

  const handleCloseChangePopup = () => {
    setChangePopup(false);
  };

  // const handleallrequest = () => {
  //   navigate("/Superadmindashboard");
  // };
  // const handleDealer = () =>{
  //   navigate("/superdealer")
  // };
  // const handlesettings = () => {
  //   navigate("/setting");
  // };
  // const handleplans = () => {
  //   navigate("/SuperSubscription");
  // };

  // const handleOffer = () => {
  //   navigate("/Offers");
  // };

  useEffect(() => {
    const phoneNumber = localStorage.getItem("phoneNumber");
    if (phoneNumber) {
      setcurrentMobileNumber(phoneNumber); // Set the current mobile number to state
    }
  }, []);

  return (
    <div className="supermother12">
      <div>
        <div className="header_part_log">
          <div className="dashboard-salon239012345">
            <img src={Salonlogo} alt="Salonlogo" className="header-h1" />
          </div>
          <div></div>
          <div className="icon_hover_supad">
            <div className="logostyle23">
              <div className="logostyle23">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  className="logo-sizing23"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 12 21Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>

              <div className="tooltip-dropdown93">
                <div style={{ color: "black" }}>
                  <p className="loggen-name-1123">Welcome:{createdBy}</p>
                  {/* <p className="jjnhjjgjh">Role: {userRole}</p> */}
                </div>

                <div className="bu_hj_log">
                  <button
                    className="but_hb_lo_sa"
                    onClick={handleOpenChangePopup}
                  >
                    Edit Profile
                  </button>
                  <button className="but_hb_lo_sa" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="supermother904">
        <Buttons />

        <div className="tab_super">
          <div className="search_super">
            <input
              type="text"
              className="gbfghfghk"
              placeholder="Search by name or number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button className="but_super" onClick={handleOpenPopup}>
              <span className="span554"> +</span> Add Super Admin
            </button>
          </div>
          <div className="sub654">
            <table>
              <thead>
                <tr>
                  <th>Super Admin Name</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuperAdmins.length > 0 ? (
                  filteredSuperAdmins.map((superAdmin) => (
                    <tr key={superAdmin._id}>
                      <td className="tdleft09">{superAdmin.superAdminName}</td>
                      <td>{superAdmin.phoneNumber}</td>
                      <td> {mapStatusToFrontend(superAdmin.status)} </td>
                      <td>
                        <button
                          className={`buttonrety5678 ${
                            superAdmin.status === "AA"
                              ? "deactivate"
                              : "activate"
                          }`}
                          onClick={() =>
                            toggleActivation(superAdmin._id, superAdmin.status)
                          }
                        >
                          {superAdmin.status === "AA"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No SuperAdmins found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="super-popup-background">
          <div className="super-popup-content">
            <h2 className="addsupadm">Add Super Admin</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label className="lab_name_supad">SuperAdmin Name:</label>
                <input
                  type="text"
                  className="inp_superadmin"
                  value={superAdminName}
                  maxLength={50}
                  onChange={(e) => setSuperAdminName(e.target.value)}
                  onBlur={() => {
                    if (!namePattern.test(superAdminName)) {
                      setNameError(
                        "SuperAdmin name must be between 3 and 50 characters long and can only contain alphanumeric characters, spaces, hyphens, and apostrophes."
                      );
                    } else {
                      setNameError(""); // Reset the error message if the length condition is met
                    }
                  }}
                  required
                />
                {nameError && <p className="error-message">{nameError}</p>}
              </div>
              <div>
                <label className="lab_name_supad">Phone Number:</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  className="inp_superadmin"
                  pattern="[6789][0-9]{9}"
                  maxLength={10}
                  onChange={(e) => {
                    const inputPhoneNumber = e.target.value;
                    if (/^[1-5]/.test(inputPhoneNumber)) {
                      setPhoneNumberError(
                        "Phone number should start from 6 to 9 and be exactly 10 digits long"
                      );
                    } else if (!/^\d*$/.test(inputPhoneNumber)) {
                      setPhoneNumberError("Only numbers are allowed");
                    } else {
                      setPhoneNumber(inputPhoneNumber);
                      setPhoneNumberError("");
                    }
                  }}
                  onFocus={() => setPhoneNumberError("")}
                  onBlur={() => {
                    if (!/^[6-9][0-9]{9}$/.test(phoneNumber)) {
                      setPhoneNumberError(
                        "Phone number should start from 6 to 9 and Excatly 10 digits"
                      );
                    } else {
                      setPhoneNumberError("");
                    }
                  }}
                  required
                />
                {phoneNumberError && (
                  <p className="error-message">{phoneNumberError}</p>
                )}
              </div>
              <div>
                <label className="lab_name_supad">Password:</label>
                <input
                  type="password"
                  className="inp_superadmin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={16}
                  required
                />
                {passwordError && (
                  <p className="error-message">{passwordError}</p>
                )}
              </div>
              <div>
                <label className="lab_name_supad">Confirm Password:</label>
                <input
                  type="password"
                  className="inp_superadmin"
                  value={confirmpassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  maxLength={16}
                  required
                />
                {!passwordsMatch && (
                  <p style={{ color: "red" }}>Passwords do not match</p>
                )}
              </div>
              <div className="bu_ad_addsa">
                <button className="button_popup_super" type="submit">
                  Submit
                </button>
                <button
                  className="close_popup_super"
                  type="button"
                  onClick={handleClosePopup}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {changePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2 className="head_in_supadm">Change Phone Number or Password</h2>
            <div className="pop_bu">
              <div className="but_for_change">
                <button onClick={() => setActiveSection("phoneNumber")}>
                  Change Phone Number
                </button>
              </div>
              <div className="but_for_change">
                <button onClick={() => setActiveSection("password")}>
                  Change Password
                </button>
              </div>
            </div>
            {activeSection === "phoneNumber" && (
              <form onSubmit={handleUpdatePhoneNumber}>
                <div className="form-group-setting-supersubs">
                  <label>Current Number:</label>
                  <input
                    type="tel"
                    value={currentMobileNumber}
                    disabled
                    className="form-input-setting-supersubs"
                  />
                </div>
                <div className="form-group-setting-supersubs">
                  <label>New Number:</label>
                  <input
                    type="tel"
                    value={newMobileNumber}
                    pattern="[6789][0-9]{9}"
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[6789][0-9]{0,9}$/.test(value)) {
                        setNewMobileNumber(value);
                      }
                    }}
                    required
                    className="form-input-setting-supersubs"
                  />
                </div>
                <div className="button-group">
                  <button
                    type="submit"
                    className="update-button-setting-supersubs"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseChangePopup}
                    className="cancel-button-setting-supersubs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {activeSection === "password" && (
              <form onSubmit={handleUpdatePassword}>
                <div className="form-group-setting-supersubs">
                  <label>Old Password:</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="form-input-setting-supersubs"
                  />
                </div>
                <div className="form-group-setting-supersubs">
                  <label>New Password:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="form-input-setting-supersubs"
                  />
                </div>
                <div className="form-group-setting-supersubs">
                  <label>Confirm New Password:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    className="form-input-setting-supersubs"
                  />
                </div>
                <div className="button-group">
                  <button
                    type="submit"
                    className="update-button-setting-supersubs"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseChangePopup}
                    className="cancel-button-setting-supersubs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;
