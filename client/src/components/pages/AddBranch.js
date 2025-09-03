import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../Helper/helper";
import "../styles/Addbranch.css";
import { toast, ToastContainer } from "react-toastify";

const AddBranchForm = (props) => {
  const { branchId, salonId } = props;
  const [formData, setFormData] = useState({
    branch_id: branchId,
    salon_id: salonId,
    staff_id: "",
    branchName: "",
    adminName: "",
    phoneNumber: "",
    password: "",
    city: "",
    state: "",
    area: "",
    address: "",
    startTime: "",
    endTime: "",
    status: "IA",
    createdBy: "",
  });
  const [errors, setErrors] = useState({});
  const [allStates, setAllStates] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [allAreas, setAllAreas] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);

  useEffect(() => {
    const adminName = localStorage.getItem("adminName");
    if (adminName) {
      setFormData((prevData) => ({
        ...prevData,
        createdBy: adminName,
      }));
    }
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/states`);
      setAllStates(response.data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCitiesByState = async (stateName) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/cities?state=${stateName}`
      );
      setAllCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchAreasByCity = async (cityName) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/areas?city=${cityName}`
      );
      setAllAreas(response.data);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  const handleBranchNameChange = (e) => {
    let { value } = e.target;
    let error = "";

    // Remove special characters from the input value except spaces and apostrophes
    value = value.replace(/[^\w\s']/gi, ""); // Removes all non-word characters except spaces and apostrophes
    value = value.replace(/\d/g, ""); // Removes all digits

    // Capitalize the first letter of the branch name
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    // Check if the length of the branch name is at least 3 characters
    if (value.length < 3) {
      error = "Branch name must be at least 3 characters";
    } else {
      error = ""; // Clear error if input is valid
    }

    setFormData((prevData) => ({ ...prevData, branchName: value }));
    setErrors((prevErrors) => ({ ...prevErrors, branchName: error }));
  };

  const handleStateChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      state: value,
      city: "", // Reset city when state changes
      area: "", // Reset area when state changes
    }));

    // Filter states based on input value
    const filtered = allStates.filter((state) =>
      state.stateName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStates(filtered);

    fetchCitiesByState(value);
    setFilteredCities([]); // Reset filtered cities
    setFilteredAreas([]); // Reset filtered areas
  };

  const handleCityChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      city: value,
      area: "", // Reset area when city changes
    }));

    // Filter cities based on input value
    const filtered = allCities.filter((city) =>
      city.cityName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCities(filtered);

    fetchAreasByCity(value);
    setFilteredAreas([]); // Reset filtered areas
  };

  const handleAreaChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      area: value,
    }));

    // Filter areas based on input value
    const filtered = allAreas.filter((area) =>
      area.areaName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAreas(filtered);
  };

  const handleStateSuggestionClick = (stateName) => {
    setFormData((prevData) => ({ ...prevData, state: stateName }));
    setFilteredStates([]); // Clear suggestions after selection
  };

  const handleCitySuggestionClick = (cityName) => {
    setFormData((prevData) => ({ ...prevData, city: cityName }));
    setFilteredCities([]); // Clear suggestions after selection
  };

  const handleAreaSuggestionClick = (areaName) => {
    setFormData((prevData) => ({ ...prevData, area: areaName }));
    setFilteredAreas([]); // Clear suggestions after selection
  };

  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    let error = "";

    if (!/^[6-9]\d{9}$/.test(value)) {
      error = "Phone number must be 10 digits and start with 6, 7, 8, or 9";
    } else {
      error = ""; // Clear error if input is valid
    }

    setFormData((prevData) => ({ ...prevData, phoneNumber: value }));
    setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: error }));
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    let error = "";

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        value
      )
    ) {
      error =
        "Password must contain at least 8 characters including one uppercase letter, one lowercase letter, one number, and one special character";
    } else {
      error = ""; // Clear error if input is valid
    }

    setFormData((prevData) => ({ ...prevData, password: value }));
    setErrors((prevErrors) => ({ ...prevErrors, password: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "address") {
      if (value.trim().length < 3) {
        error = "Address must be at least 3 characters";
      } else if (value.trim().length > 50) {
        error = "Address cannot exceed 50 characters";
      }
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (formData.branchName.length < 3) {
      newErrors.branchName = "Branch name must be at least 3 characters";
      isValid = false;
    } else if (!/^[a-zA-Z0-9' ]*$/.test(formData.branchName)) {
      // Allow letters, numbers, and apostrophes
      newErrors.branchName =
        "Branch name should only contain alphabets, numbers, and apostrophes";
      isValid = false;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Phone number must be 10 digits and start with 6, 7, 8, or 9";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      // Read salon_id from localStorage
      const salonId = localStorage.getItem("salon_id");
      if (!salonId) {
        throw new Error("Salon ID not found in localStorage");
      }

      // Include salon_id in the formData
      const updatedFormData = {
        ...formData,
        salon_id: salonId,
        createdBy: "amruta", // Set createdBy to the current admin
      };

      const response = await axios.post(
        `${BASE_URL}/api/branches`,
        updatedFormData
      );
      console.log(response.data);

      setFormData({
        branch_id: "",
        salon_id: salonId,
        staff_id: "",
        branchName: "",
        adminName: "",
        phoneNumber: "",
        password: "",
        city: "",
        state: "",
        area: "",
        address: "",
        startTime: "",
        endTime: "",
        status: "IA",
        createdBy: "", // Clear the createdBy field
      });

      // Display a success toast
      toast.success("Branch added successfully!");
    } catch (error) {
      console.error("Error adding branch:", error);
    }
  };

  return (
    <div className="main-empp">
      <div className="customer-container11">
        <h6 className="heading234"> Add Branch</h6>
        <div className="main-container-alex1">
        
          <form className="form-container-jordan2" onSubmit={handleSubmit}>
            <div className="input-row-taylor4">
              <input
                type="text"
                name="branchName"
                className={`input-branch-name-pat5 ${
                  errors.branchName ? "input-error" : ""
                }`}
                placeholder="Branch Name"
                value={formData.branchName}
                onChange={handleBranchNameChange}
                required
              />
              <input
                type="text"
                name="state"
                className="input-state-riley12"
                placeholder="State"
                value={formData.state}
                onChange={handleStateChange}
                required
              />
              {filteredStates.length > 0 && (
                <div className="suggestions-container">
                  {filteredStates.map((state) => (
                    <div
                      key={state.stateId}
                      className="suggestion"
                      onClick={() =>
                        handleStateSuggestionClick(state.stateName)
                      }
                    >
                      {state.stateName}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.branchName && (
              <span className="error-message">{errors.branchName}</span>
            )}
            {errors.phoneNumber && (
              <span className="error-message">{errors.phoneNumber}</span>
            )}
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
            <div className="input-row-taylor4">
              <input
                type="text"
                name="phoneNumber"
                className={`input-phone-number-devon10 ${
                  errors.phoneNumber ? "input-error" : ""
                }`}
                placeholder="Admin Phone"
                value={formData.phoneNumber}
                onChange={handlePhoneNumberChange}
                maxLength={10}
                required
              />
              <input
                type="text"
                name="city"
                className="input-city-morgan7"
                placeholder="City"
                value={formData.city}
                onChange={handleCityChange}
                required
              />
              {filteredCities.length > 0 && (
                <div className="suggestions-container">
                  {filteredCities.map((city) => (
                    <div
                      key={city.cityId}
                      className="suggestion"
                      onClick={() => handleCitySuggestionClick(city.cityName)}
                    >
                      {city.cityName}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="input-row-taylor4">
              <input
                type="password"
                name="password"
                className={`input-password-avery11 ${
                  errors.password ? "input-error" : ""
                }`}
                placeholder="Admin Password"
                value={formData.password}
                onChange={handlePasswordChange}
                required
              />
              <input
                type="text"
                name="area"
                className="input-area-casey8"
                placeholder="Area"
                value={formData.area}
                onChange={handleAreaChange}
                required
              />
              {filteredAreas.length > 0 && (
                <div className="suggestions-container">
                  {filteredAreas.map((area) => (
                    <div
                      key={area.areaId}
                      className="suggestion"
                      onClick={() => handleAreaSuggestionClick(area.areaName)}
                    >
                      {area.areaName}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="input-row-taylor4">
              <input
                type="time"
                name="startTime"
                className="input-start-time-reese13"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
              <input
                type="time"
                name="endTime"
                className="input-end-time-sam14"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-textarea-jessie15">
              <textarea
                name="address"
                className="textarea-address-frankie16"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={50}
              ></textarea>
            </div>
            {errors.address && (
              <span className="error-message">{errors.address}</span>
            )}
            <div className="fgr89">
            <button type="submit" className="submit-button-jordan18">
              Add Branch
            </button>
            </div>
          </form>
          
          
        </div>

      </div>
      <ToastContainer />
    </div>
  );
};

export default AddBranchForm;
