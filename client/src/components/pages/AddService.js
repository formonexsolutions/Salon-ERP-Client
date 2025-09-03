import React, { useState } from "react";
import axios from "axios";

import "../styles/AddService.css";
import { BASE_URL } from "../Helper/helper";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddService = () => {
  const [service, setService] = useState({
    serviceName: "",
    category: "",
    price: "",
    GST: "",
    hours: "",
    minutes: "",
  });

  const [errors, setErrors] = useState({
    serviceName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "serviceName") {
      const isValid = /^[a-zA-Z0-9\s]{2,20}$/.test(value);
      if (!isValid) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          serviceName: "Service name must be 2-20 characters long and not contain special characters and Numbers.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          serviceName: "",
        }));
      }
      setService((prevState) => ({
        ...prevState,
        [name]: value,
      }));

   } else if (name === "price" && /^\d{0,5}$/.test(value)) {
      setService((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else if (name === "GST" && /^\d{0,2}$/.test(value)) {
      setService((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else if (name !== "price" && name !== "GST") {
      setService((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "-" || e.key === "+") {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const salonId = localStorage.getItem("salon_id");
      let createdBy = localStorage.getItem("employeeName"); // Default to employeeName
  
      // If employeeName is not available, fallback to adminName for admins
      if (!createdBy && localStorage.getItem("userRole") === "admin") {
        createdBy = localStorage.getItem("adminName");
      }
  
      // If createdBy is still not available, use a generic fallback
      createdBy = createdBy || "Unknown User";
  
      const modifiedBy = createdBy;
  
      // Concatenate hours and minutes into a single string
      const durationTime = `${service.hours}:${service.minutes}`;
  
      const serviceData = {
        ...service,
        salon_id: salonId,
        createdBy: createdBy,
        createdAt: new Date().toISOString(),
        modifiedBy: modifiedBy,
        modifiedAt: new Date().toISOString(),
        durationTime: durationTime, // Include durationTime as a single string
      };
  
      await axios.post(`${BASE_URL}/api/services`, serviceData);
      toast.success("Service added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  
      setService({
        serviceName: "",
        category: "",
        price: "",
        GST: "",
        hours: "",
        minutes: "",
      });
    } catch (error) {
      toast.error("Error adding service:", error);
    }
  };
  
  
  return (
    <div className="main-empp">
      <div className="add-service-container-sk141s">
        <h5 className="heading234">Services</h5>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group-sk141s">
            <div className="labelchange567">
              <label htmlFor="serviceName" className="label-sk141s">
                Service Name:
              </label>
            </div>
            <input
              type="text"
              id="serviceName"
              name="serviceName"
              value={service.serviceName}
              placeholder="Enter Service Name"
              onChange={handleChange}
              className="input-sk141s"
              required
            />
              {errors.serviceName && (
              <div className="error-message">{errors.serviceName}</div>
            )}
          </div>
          <div className="form-group-sk141s">
            <div className="labelchange567">
              <label htmlFor="category" className="label-sk141s">
                Category:
              </label>
            </div>
            <select
              id="category"
              name="category"
              value={service.category}
              onChange={handleChange}
              className="select-sk141s"
              required
            >
              <option value="">Select category</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Transgender">Others</option>
            </select>
          </div>
          <div className="form-group-sk141s">
            <div className="labelchange567">
              <label htmlFor="price" className="label-sk141s">
                Price:
              </label>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              value={service.price}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter Price"
              min="0" // Ensure the minimum value is 0
              className="input-sk141s"
              required
            />
          </div>
          <div className="form-group-sk141s">
            <div className="labelchange567">
              <label htmlFor="GST" className="label-sk141s">
                GST(%):
              </label>
            </div>
            <input
              type="number"
              id="GST"
              name="GST"
              value={service.GST}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter GST(%)"
              min="0" // Ensure the minimum value is 0
              className="input-sk141s"
              required
            />
          </div>
          <div className="form-group-sk141s">
            <div className="labelchange567">
              <label htmlFor="durationTime" className="label-sk141s">
                 Time Duration:
              </label>
            </div>
            <div className="time-input-container">
              <input
                type="number"
                id="hours"
                name="hours"
                value={service.hours}
                onChange={handleChange}
                min="0"
                max="23"
                className="input-sk141s time-input"
                placeholder="HH"
                required
              />
              <span className="time-separator">:</span>
              <input
                type="number"
                id="minutes"
                name="minutes"
                value={service.minutes}
                onChange={handleChange}
                min="0"
                max="59"
                className="input-sk141s time-input"
                placeholder="MM"
                required
              />
            </div>
          </div>
          <div className="buttons143sk">
            <button type="submit" className="submit-button-sk141s">
              Save
            </button>
          </div>
        </form>
      <ToastContainer />
      </div>
    </div>
  );
};

export default AddService;
