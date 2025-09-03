import React, { useState, useEffect } from "react";
import "../styles/SuperSubscription.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/SuperNavbar.css";
import Salonlogo from "../images/Salon-logo.png";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../Helper/helper';
import Buttons from "./Buttons";



const SuperSubscription = () => {
  const [formEntries, setFormEntries] = useState([]);
  const navigate = useNavigate();
  const createdBy = localStorage.getItem("superAdminName") || "superadmin";
  const [formData, setFormData] = useState({
    PlanId: "",
    PlanName: "",
    Duration: "",
    Amount: "",
    Feature1: "",
    Feature2: "",
    CreatedBy: createdBy,
    CreatedAt: new Date().toLocaleString(),
    ModifiedBy: "modifiedBy",
    ModifiedAt: new Date().toLocaleString(),
    Status: "AA",
  });

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const validate = (name, value) => {
    let error = "";
    switch (name) {
      case "PlanName":
        if (value.length < 3 || value.length > 50) {
          error = "Plan Name must be between 3 and 50 characters.And Special characters are not allowed";
        } else if (!/^[a-zA-Z0-9 ]+$/.test(value)) {
          error = "Plan Name must not contain special characters.";
        }
        break;
      case "Duration":
        const durationValue = parseInt(value); // Convert value to integer
        if (isNaN(durationValue) || durationValue < 5 || durationValue > 365) {
          error = "Duration must be between 5 and 365 days.";
        }
        break;
      case "Amount":
        // Check if the value contains a decimal point
        if (value.includes(".")) {
          error = "Amount cannot accept decimal values.";
        } else if (!/^\d{1,6}$/.test(value)) {
          error = "Amount must be between 1 and 6 digits.";
        }
        break;

      case "Feature1":
      case "Feature2":
        if (value.length < 10 || value.length > 100) {
          error = `${name} must be between 10 and 100 characters.`;
        }
        break;
      default:
        break;
    }
    return error; // Return error message or empty string
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Duration") {
      if (value > 365) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Duration cannot exceed 365 days",
        }));
      } else {
        const error = validate(name, value); // Validate the input
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error, // Set the error message for the input
        }));
      }
    } else if (name === "Amount") {
      if (!/^\d*$/.test(value)) { // Check if value contains only digits
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Amount should only contain digits",
        }));
      } else if (value.length > 5) { // Check if the length of the value exceeds 5 digits
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Amount cannot exceed 5 digits",
        }));
      } else if (parseInt(value) < 0) { // Check if value is negative
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Amount cannot be negative",
        }));
      } else {
        const error = validate(name, value); // Validate the input
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error, // Set the error message for the input
        }));
      }
    } else {
      const error = validate(name, value); // Validate the input
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error, // Set the error message for the input
      }));
    }
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "Duration") {
        if (value > 365) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: "Duration cannot exceed 365 days",
            }));
        } else {
            const error = validate(name, value); // Validate the input
            setEditFormData((prevEditFormData) => ({
                ...prevEditFormData,
                [name]: value,
            }));
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: error, // Set the error message for the input
            }));
        }
    } else if (name === "Amount") {
        if (!/^\d*$/.test(value)) { // Check if value contains only digits
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: "Amount should only contain digits",
            }));
        } else if (value.length > 5) { // Check if the length of the value exceeds 5 digits
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: "Amount cannot exceed 5 digits",
            }));
        } else if (parseInt(value) < 0) { // Check if value is negative
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: "Amount cannot be negative",
            }));
        } else {
            const error = validate(name, value); // Validate the input
            setEditFormData((prevEditFormData) => ({
                ...prevEditFormData,
                [name]: value,
            }));
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: error, // Set the error message for the input
            }));
        }
    } else {
        const error = validate(name, value); // Validate the input
        setEditFormData((prevEditFormData) => ({
            ...prevEditFormData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error, // Set the error message for the input
        }));
    }
};

  // const handleAllRequest = () => {
  //   navigate('/Superadmindashboard');
  // }
  // const handleDealer = () =>{
  //   navigate("/superdealer")
  // }

  // const handleSettings = () => {
  //   navigate('/setting');
  // }

  // const handlePlans = () => {
  //   navigate('/SuperSubscription');
  // }

  // const handleOffer = () => {
  //   navigate('/Offers');
  // }

  useEffect(() => {
    const fetchNextPlanId = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/generatePlanId`
        );
        if (!response.ok) throw new Error("Failed to fetch next PlanId");
        const data = await response.json();
        setFormData((prevFormData) => ({
          ...prevFormData,
          PlanId: data.PlanId,
        }));
        setFormData((prevFormData) => ({
          ...prevFormData,
          PlanId: data.PlanId,
        }));
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchNextPlanId();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/plans`);
        if (!response.ok) throw new Error("Failed to fetch plans");
        const data = await response.json();
        setFormEntries(data);
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedFormData = { ...formData };

      // Convert Duration to a number
      updatedFormData.Duration = parseInt(updatedFormData.Duration);

      const createdBy = localStorage.getItem("superAdminName") || "superadmin";
      const modifiedBy = localStorage.getItem("superAdminName") || "superadmin";
      // Convert date strings to ISO format
      updatedFormData.CreatedAt = new Date().toISOString();
      updatedFormData.ModifiedAt = new Date().toISOString();

      const response = await fetch(`${BASE_URL}/api/plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedFormData,
          CreatedBy: createdBy,
          ModifiedBy: modifiedBy,
        }),
      });

      if (!response.ok) throw new Error("Failed to add plan");

      const data = await response.json();
      setFormEntries((prevEntries) => [...prevEntries, data]);

      // Reset form data after successful submission
      setFormData({
        PlanId: "",
        PlanName: "",
        Duration: "",
        Amount: "",
        Feature1: "",
        Feature2: "",
        CreatedBy: createdBy,
        CreatedAt: new Date().toLocaleString(),
        ModifiedBy: modifiedBy,
        ModifiedAt: new Date().toLocaleString(),
        Status: "AA",
      });

      toast.success("Plan added successfully!");

      // Delay reload by 5 seconds to show toast notification
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Failed to add plan.");
    }
  };

  const handleStatusToggle = async (planId, currentStatus) => {
    const newStatus = currentStatus === "AA" ? "IA" : "AA";

    try {
      const response = await fetch(
        `${BASE_URL}/api/plans/${planId}/update-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update plan status");

      setFormEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry._id === planId ? { ...entry, Status: newStatus } : entry
        )
      );

      toast.success(
        `Plan ${newStatus === "AA" ? "Activated" : "Deactivated"} Successfully!`
      );
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Failed to update plan status");
    }
  };


  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error)) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }
    try {
      const { _id, ...updateData } = editFormData;
      const response = await fetch(
        `${BASE_URL}/api/plans/${_id}/update-plan`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );
      if (!response.ok) throw new Error("Failed to update plan");
      const updatedPlan = await response.json();
      setFormEntries((prevEntries) =>
        prevEntries.map((entry) => (entry._id === _id ? updatedPlan : entry))
      );
      setEditModalOpen(false);
      toast.success("Plan updated successfully!");
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Failed to update plan.");
    }
  };

  const handleEdit = (entry) => {
    try {
      setEditFormData(entry);
      setEditModalOpen(true);
      toast.success("Opening Edit Popup!");
    } catch (error) {
      console.error("Error initiating edit:", error);
      toast.error("Failed to initiate edit.");
    }
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
  };
  
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logging out...");
    navigate("/"); // Navigate to the login page
  };



  const handleOpenChangePopup = () => {
    toast.error("Go to Settings To Edit Your Profile.");
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="supermother12">
      <div>
        <div className="header_part_log">
          <div className="dashboard-salon239012345">
            <img src={Salonlogo} alt="Salonlogo" className="header-h1" />
          </div>
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
                  <button className="but_hb_lo_sa" onClick={handleOpenChangePopup}>
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

      
      <div className="con_sup_sub">
      <button className="supersubscription-button-Addplans" onClick={openPopup}>Add Plans</button>
        <div className="supersub-container">
          <div className="s-super-subscription-container">
            {showPopup && (
              <div className="popupaddplans">
                <div className="popup-contentaddplans">
                  <span className="closeaddplans" onClick={closePopup}>&times;</span>
                  <form onSubmit={handleSubmit}>
                    <div className="s-form-group-container">
                      <div className="s-form-group">
                        <label htmlFor="PlanId">Plan ID:</label>
                        <input
                          type="text"
                          id="PlanId"
                          name="PlanId"
                          value={formData.PlanId}
                          onChange={handleChange}
                          required
                          readOnly
                        />
                      </div>
                      <div className="s-form-group">
                        <label htmlFor="PlanName">Plan Name:</label>
                        <input
                          type="text"
                          id="PlanName"
                          name="PlanName"
                          value={formData.PlanName}
                          onChange={handleChange}
                          minLength={3}
                          maxLength={50}
                          required
                        />
                        {errors.PlanName && (
                          <span className="error">{errors.PlanName}</span>
                        )}
                      </div>
                      <div className="s-form-group">
                        <label htmlFor="Duration">Duration:Days</label>
                        <input
                          type="number"
                          id="Duration"
                          name="Duration"
                          value={formData.Duration}
                          onChange={handleChange}
                          required
                          min={5}
                          max={365}
                        />
                        {errors.Duration && (
                          <span className="error">{errors.Duration}</span>
                        )}
                      </div>
                      <div className="s-form-group">
                        <label htmlFor="Amount">Amount:</label>
                        <input
                          type="number"
                          id="Amount"
                          name="Amount"
                          value={formData.Amount}
                          onChange={handleChange}
                          required
                        />
                        {errors.Amount && (
                          <span className="error">{errors.Amount}</span>
                        )}
                      </div>
                      <div className="s-form-group">
                        <label htmlFor="Feature1">Feature 1:</label>
                        <input
                          type="text"
                          id="Feature1"
                          name="Feature1"
                          value={formData.Feature1}
                          onChange={handleChange}
                          minLength={10}
                          maxLength={100}
                        />
                        {errors.Feature1 && (
                          <span className="error">{errors.Feature1}</span>
                        )}
                      </div>
                      <div className="s-form-group">
                        <label htmlFor="Feature2">Feature 2:</label>
                        <input
                          type="text"
                          id="Feature2"
                          name="Feature2"
                          value={formData.Feature2}
                          onChange={handleChange}
                          minLength={10}
                          maxLength={100}
                        />
                        {errors.Feature2 && (
                          <span className="error">{errors.Feature2}</span>
                        )}
                      </div>
                    </div>
                    <div className="btn205">
                    <button type="submit" className="supersubscription-button-submit">
                      Submit
                    </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div className="table-container">
            <h2>Modify Plans</h2>
            <div className="table-scrollasdfg">
              <table className="SuperSubscriptionTable">
                <thead className="thead310">
                  <tr>
                    <th>Plan ID</th>
                    <th>Plan Name</th>
                    <th>Duration:Days</th>
                    <th>Amount</th>

                    <th>Feature 1</th>
                    <th>Feature 2</th>
                    <th>Status</th>
                    <th>Edit Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {formEntries.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.PlanId}</td>
                      <td>{entry.PlanName}</td>
                      <td>{entry.Duration}</td>
                      <td>{entry.Amount}</td>

                      <td>{entry.Feature1}</td>
                      <td>{entry.Feature2}</td>
                      <td>
                        <button
                          onClick={() =>
                            handleStatusToggle(entry._id, entry.Status)
                          }
                          className={`butt_act_dea ${entry.Status === "AA" ? "deactivate" : "activate"
                            }`}
                        >
                          {entry.Status === "AA" ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => handleEdit(entry)}
                          className="edit-button-supersubscription"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {isEditModalOpen && (
            <div className="edit-modal-supersubscription">
              <div className="modal-content-supersubscription">
                <h2>Edit Plan</h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="s-form-group">
                    <label htmlFor="PlanId">Plan ID:</label>
                    <input
                      type="text"
                      id="PlanId"
                      name="PlanId"
                      value={editFormData.PlanId}
                      onChange={handleEditChange}
                      required
                      readOnly
                    />
                  </div>
                  <div className="s-form-group">
                    <label htmlFor="PlanName">Plan Name:</label>
                    <input
                      type="text"
                      id="PlanName"
                      name="PlanName"
                      value={editFormData.PlanName}
                      onChange={handleEditChange}
                      minLength={5}
                      maxLength={50}
                      required
                    />
                    {errors.PlanName && (
                      <span className="error">{errors.PlanName}</span>
                    )}
                  </div>
                  <div className="s-form-group">
                    <label htmlFor="Duration">Duration:</label>
                    <input
                      type="number"
                      id="Duration"
                      name="Duration"
                      value={editFormData.Duration}
                      onChange={handleEditChange}
                      required
                      min={5}
                      max={365}
                    />
                    {errors.Duration && (
                      <span className="error">{errors.Duration}</span>
                    )}
                  </div>
                  <div className="s-form-group">
                    <label htmlFor="Amount">Amount:</label>
                    <input
                      type="number"
                      id="Amount"
                      name="Amount"
                      value={editFormData.Amount}
                      onChange={handleEditChange}
                      required
                      min={1}
                      max={99999}
                    />
                    {errors.Amount && (
                      <span className="error">{errors.Amount}</span>
                    )}
                  </div>

                  <div className="s-form-group">
                    <label htmlFor="Feature1">Feature 1:</label>
                    <input
                      type="text"
                      id="Feature1"
                      name="Feature1"
                      value={editFormData.Feature1}
                      onChange={handleEditChange}
                      minLength={10}
                      maxLength={100}
                      required
                    />
                    {errors.Feature1 && (
                      <span className="error">{errors.Feature1}</span>
                    )}
                  </div>
                  <div className="s-form-group">
                    <label htmlFor="Feature2">Feature 2:</label>
                    <input
                      type="text"
                      id="Feature2"
                      name="Feature2"
                      value={editFormData.Feature2}
                      onChange={handleEditChange}
                      minLength={10}
                      maxLength={100}
                      required
                    />
                    {errors.Feature2 && (
                      <span className="error">{errors.Feature2}</span>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="supersubscription-button-submit"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="supersubscription-button-submit"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SuperSubscription;

