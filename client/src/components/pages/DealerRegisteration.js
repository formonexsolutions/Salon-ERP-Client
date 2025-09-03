import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/DealerRegisteration.css";
import Salonlogo from "../images/Salon-logo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Helper/helper";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ContinueSubscription from "../pages/ContinueSubscription";
import {
  IoArrowBackSharp,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRenewalOpen, setIsRenewalOpen] = useState(false);
  const [isFormClicked, /*setIsFormClicked*/] = useState(false);
  const [fieldError, setFieldError] = useState({
    CompanyName: "",
    DealerName: "",
    phoneNumber: "",
  });

  const [data, setData] = useState({
    DealerName: "",
    CompanyName: "",
    phoneNumber: "",
    password: "",
    confirmpassword: "",
    state: "",
    city: "",
    area: "",
    createdAt: new Date().toISOString(),
    otpVerified: false,
    
  });
  // const [dealerData, setDealerData] = useState({
  //   phoneNumber: "",
  //   password: "",
  //   confirmPassword: "",
  //   otp: "",
  // });
  const [submitting, setSubmitting] = useState(false);
  const [loginData, setLoginData] = useState({
    phoneNumber: "",
    password: "",
  });
  const handleLoginDataChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    console.log("Login data being submitted:", loginData); // Add this line

    try {
      const response = await axios.post(
        `${BASE_URL}/api/dealers/login`,
        loginData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("dealerId", response.data.dealer_id);
      localStorage.setItem("DealerName", response.data.DealerName);
      localStorage.setItem("phoneNumber", response.data.phoneNumber);

      navigate("/DealerDashboard");
    } catch (error) {
      console.error("Error during login:", error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          if (
            data.message ===
            "Mobile number is not registered. Please try again."
          ) {
            toast.error("Incorrect Mobile Number");
          } else if (data.message === "Incorrect password") {
            toast.error("Incorrect password");
          } else {
            toast.error(data.message);
          }
        } else {
          toast.error("Internal Server Error");
        }
      } else {
        toast.error("Network Error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    phoneNumber: "",
    otp: "",
    otpVerified: false,
    newPassword: "",
    confirmPassword: "",
  });

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!forgotPasswordData.otpVerified) {
      toast.error("Please verify OTP first");
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/dealers/reset-password`,
        {
          phoneNumber: forgotPasswordData.phoneNumber,
          otp: forgotPasswordData.otp, // Include OTP in the request
          newPassword: forgotPasswordData.newPassword,
          confirmPassword: forgotPasswordData.confirmPassword,
        }
      );

      if (response && response.data && response.data.message) {
        toast.success(response.data.message);
        setShowForgotPasswordPopup(false);
      } else {
        // Handle case where response.data or response.data.message is not present
        console.error("Unexpected response structure:", response);
        toast.error("Unexpected response from server");
      }
    } catch (error) {
      // Check if error.response exists before accessing it
      console.error("Error in password reset request:", error);
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/dealers/forgot-password`,
        {
          phoneNumber: forgotPasswordData.phoneNumber,
          otp: forgotPasswordData.otp,
        }
      );
      console.log("Response:", response); // Log the entire response object
      if (response && response.data) {
        console.log("Response Data:", response.data);
      } else {
        console.error("Response data is undefined or null");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/dealers/verify-otp`, {
        phoneNumber: forgotPasswordData.phoneNumber,
        otp: forgotPasswordData.otp,
      });
      if (response.status === 200) {
        // Handle successful OTP verification
        console.log("OTP verified successfully");
        setForgotPasswordData((prevData) => ({
          ...prevData,
          otpVerified: true, // Set OTP verified to true
        }));
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP");
    }
  };

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, /*setOtpVerified*/] = useState(false);

  const [allStates, setAllStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statesResponse = await axios.get(`${BASE_URL}/api/states`);
      setAllStates(statesResponse.data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setMessage("");

    if (name === "phoneNumber") {
      const phoneNumberPattern = /^[6-9]\d{9}$/;
      if (!/^\d+$/.test(value)) {
        setFieldError((prevError) => ({
          ...prevError,
          phoneNumber: "Phone number must contain only digits",
        }));
      } else if (!phoneNumberPattern.test(value)) {
        setFieldError((prevError) => ({
          ...prevError,
          phoneNumber: "Phone number must start with 6-9 and be 10 digits long",
        }));
      } else {
        setFieldError((prevError) => ({ ...prevError, phoneNumber: "" }));
      }
    }
    if (name === "DealerNamer" || name === "CompanyName") {
      const namePattern = /^[a-zA-Z\s\-']{3,50}$/; // Allow letters, spaces, hyphens, and apostrophes
      if (!namePattern.test(value)) {
        setFieldError((prevError) => ({
          ...prevError,
          [name]: "Name must be between 3 and 50 characters long and can only contain letters, spaces, hyphens, and apostrophes.",
        }));
      } else {
        setFieldError((prevError) => ({ ...prevError, [name]: "" }));
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/;

    if (data.password !== data.confirmpassword) {
      setMessage("Passwords do not match");
      return;
    }
    if (data.phoneNumber.length !== 10 || /^[1-5]/.test(data.phoneNumber)) {
      setMessage("Phone number must be exactly 10 digits and start with 6-9");
      return;
    }
    if (!passwordPattern.test(data.password)) {
      setMessage(
        "Password must be between 8 and 16 characters and contain at least one uppercase letter, one number, and one special character."
      );
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/dealers`, data);
      if (response.status === 201) {
        const { dealer_id } = response.data;
        // const registeredData = {
        //   DealerName: data.DealerName,
        //   CompanyName: data.CompanyName,
        //   phoneNumber: data.phoneNumber,
        //   state: data.state,
        //   city: data.city,
        //   area: data.area,
        //   createdAt: new Date().toISOString(),
        // };
        localStorage.setItem("dealer_id", dealer_id);
        localStorage.setItem("registeredData", JSON.stringify(data));

        toast.success("Registration Successful! Sending OTP...");
        setOtpSent(true);
        setMessage("");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Unknown error occurred");
    }
  };

  const verifyOtpHandler = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/verifyotp`, {
        phoneNumber: data.phoneNumber, // Ensure this variable is correctly set
        otp: otp, // Ensure this variable is correctly set
      });

      if (response.status === 200) {
        // Handle successful OTP verification
        console.log("OTP verified successfully");
        navigate("/");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === "") {
      const otpArray = otp.split("");
      otpArray[index] = value;
      setOtp(otpArray.join(""));

      if (value && index < 5) {
        document.querySelector(`input[name=otp${index + 1}]`).focus();
      }
    }
  };

  const fetchCitiesByState = async (state, inputCity) => {
    try {
      const citiesResponse = await axios.get(
        `${BASE_URL}/api/cities?state=${state}`
      );
      const filtered = citiesResponse.data.filter((city) =>
        city.cityName.toLowerCase().startsWith(inputCity.toLowerCase())
      );
      setFilteredCities(filtered);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchAreasByCity = async (city, inputArea) => {
    try {
      const areasResponse = await axios.get(
        `${BASE_URL}/api/areas?city=${city}`
      );
      const filtered = areasResponse.data.filter((area) =>
        area.areaName.toLowerCase().startsWith(inputArea.toLowerCase())
      );
      setFilteredAreas(filtered);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  const selectState = (stateName) => {
    setData((prevData) => ({
      ...prevData,
      state: stateName,
    }));
    setFilteredStates([]);
  };

  const selectCity = (cityName) => {
    setData((prevData) => ({
      ...prevData,
      city: cityName,
    }));
    setFilteredCities([]);
  };

  const selectArea = (areaName) => {
    setData((prevData) => ({
      ...prevData,
      area: areaName,
    }));
    setFilteredAreas([]);
  };

  const closeRenewalModal = () => {
    setIsRenewalOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // const toggleForm = () => {
  //   setIsFormClicked(!isFormClicked);
  // };
  return (
    <div className="register-page">
      <div className="register-container32">
        {/* <div className="register-info">
          <img src={Salonlogo} alt="Salon Logo" className="logo" />
          <p className="para6632">
            Join us to get your salon listed and attract more customers. Fill
            out the form to get started!
          </p>
          <button onClick={toggleForm} className="toggleFormButton32">
        {isFormClicked ? "Go to Login" : "Go to Register"}
      </button>
   
        </div> */}

        <div className="register-info">
          <img src={Salonlogo} alt="Salon Logo" className="logo" />
          <p className="para6632">
            Join us to get your salon listed and attract more customers. Fill out the form to get started!
          </p>
        </div>

        <div className="form3988">
          {isFormClicked ? (<form
            onSubmit={submitHandler}
            autoComplete="off"
            className="register-form"
          >
            <h5 className="formHeading">Distributor Registration</h5>
            <div className="form-row">

              <div className="formGroup">
                <label htmlFor="CompanyName">Company Name</label>
                <input
                  type="text"
                  name="CompanyName"
                  className={`form-input ${fieldError.CompanyName ? "error" : ""
                    }`}
                  value={data.CompanyName}
                  onChange={changeHandler}
                  placeholder="Company Name"
                  required
                />
                {fieldError.CompanyName && (
                  <p className="errorMessage">{fieldError.CompanyName}</p>
                )}
              </div>
              <div className="formGroup">
                <label htmlFor="DealerName">Distributor Name</label>
                <input
                  type="text"
                  name="DealerName"
                  className={`form-input ${fieldError.DealerName ? "error" : ""
                    }`}
                  value={data.DealerName}
                  onChange={changeHandler}
                  placeholder="Distributor Name"
                  required
                />
                {fieldError.DealerName && (
                  <p className="errorMessage">{fieldError.DealerName}</p>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="formGroup">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className={`form-input ${fieldError.phoneNumber ? "error" : ""
                    }`}
                  value={data.phoneNumber}
                  onChange={changeHandler}
                  placeholder="Phone Number"
                  maxLength={10}
                  required
                  autoComplete="username"
                />
                {fieldError.phoneNumber && (
                  <p className="errorMessage">{fieldError.phoneNumber}</p>
                )}
              </div>
              <div className="formGroup">
                <label htmlFor="password">Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-input"
                    value={data.password}
                    onChange={changeHandler}
                    placeholder="Password"
                    required
                    autoComplete="new-password"
                  />
                  <div
                    className="password-icon"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="formGroup">
                <label htmlFor="confirmpassword">Confirm Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmpassword"
                    className="form-input"
                    value={data.confirmpassword}
                    onChange={changeHandler}
                    placeholder="Confirm Password"
                    required
                    autoComplete="new-password"
                  />
                  <div
                    className="password-icon"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </div>
                </div>
              </div>
              <div className="formGroup">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  name="state"
                  className="form-input"
                  value={data.state}
                  onChange={(e) => {
                    const inputState = e.target.value;
                    setData((prevData) => ({
                      ...prevData,
                      state: inputState,
                    }));
                    const filtered = allStates.filter((state) =>
                      state.stateName
                        .toLowerCase()
                        .startsWith(inputState.toLowerCase())
                    );
                    setFilteredStates(filtered);
                  }}
                  placeholder="State"
                  required
                />
                {filteredStates.length > 0 && (
                  <ul className="suggestions">
                    {filteredStates.map((state, index) => (
                      <li
                        key={index}
                        onClick={() => selectState(state.stateName)}
                      >
                        {state.stateName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="formGroup">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  name="city"
                  className="form-input"
                  value={data.city}
                  onChange={(e) => {
                    const inputCity = e.target.value;
                    setData((prevData) => ({
                      ...prevData,
                      city: inputCity,
                    }));
                    fetchCitiesByState(data.state, inputCity);
                  }}
                  placeholder="City"
                  required
                />
                {filteredCities.length > 0 && (
                  <ul className="suggestions">
                    {filteredCities.map((city, index) => (
                      <li key={index} onClick={() => selectCity(city.cityName)}>
                        {city.cityName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="formGroup">
                <label htmlFor="area">Area</label>
                <input
                  type="text"
                  name="area"
                  className="form-input"
                  value={data.area}
                  onChange={(e) => {
                    const inputArea = e.target.value;
                    setData((prevData) => ({
                      ...prevData,
                      area: inputArea,
                    }));
                    fetchAreasByCity(data.city, inputArea);
                  }}
                  placeholder="Area"
                  required
                />
                {filteredAreas.length > 0 && (
                  <ul className="suggestions">
                    {filteredAreas.map((area, index) => (
                      <li key={index} onClick={() => selectArea(area.areaName)}>
                        {area.areaName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <button type="submit" className="registerButton32">
              Register
            </button>
            {message && <p className="errorMessage">{message}</p>}
          </form>


          ) : (<form onSubmit={handleLoginSubmit} className="login-form32">
            <h5 className="formHeading32">Distributor Login</h5>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Mobile Number"
              value={loginData.phoneNumber}
              onChange={handleLoginDataChange}
              required
              className="input-field32"
            />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginDataChange}
                required
                minLength={8}
                maxLength={16}
                className="input-field32 password-input32"
              />
              <span className="password-toggle-icon32" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button
              type="submit"
              className="registerButton32"
              disabled={submitting}
            >
              {submitting ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={() => setShowForgotPasswordPopup(true)}
              className="forgot-password-link"
            >
              Forgot Password?
            </button>
          </form>)}

          {otpSent && !otpVerified && (
            <div className="otp-modal">
              <div className="otp-modal-content">
                <label htmlFor="otp" className="otp-label">
                  Enter OTP
                </label>
                <div className="otp-inputs">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      name={`otp${index}`}
                      maxLength="1"
                      className="otp-input"
                      value={otp[index] || ""}
                      onChange={(e) => handleOtpChange(e, index)}
                      required
                    />
                  ))}
                </div>
                <button
                  onClick={verifyOtpHandler}
                  className="verify-otp-button"
                >
                  Verify OTP
                </button>
              </div>
            </div>
          )}
          {isRenewalOpen && (
            <div className="modal-overlay">
              <div className="modal-content1">
                <button className="close-modal" onClick={closeRenewalModal}>
                  X
                </button>
                <ContinueSubscription />
              </div>
            </div>
          )}
        </div>
      </div>
      {showForgotPasswordPopup && (
        <div className="forgot-password-popup-overlay">
          <div className="forgot-password-popup">
            <button
              className="btn-close23"
              type="button"
              onClick={() => setShowForgotPasswordPopup(false)}
            >
              X
            </button>
            <h2 className="forgotpassword-heading2">Forgot Password</h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Mobile Number"
                value={forgotPasswordData.phoneNumber}
                onChange={handleForgotPasswordChange}
                required
                disabled={forgotPasswordData.otpVerified}
                className="input565"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className="send-otp-button"
              >
                Send OTP
              </button>
              <div className="otp-container">
                <input
                  type="text"
                  name="otp"
                  placeholder="OTP"
                  value={forgotPasswordData.otp}
                  onChange={handleForgotPasswordChange}
                  required
                  disabled={forgotPasswordData.otpVerified}
                  className="input56"
                />
                {!forgotPasswordData.otpVerified && (
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="verify-otp-button-for-reset-password"
                  >
                    Verify OTP
                  </button>
                )}
              </div>
              {forgotPasswordData.otpVerified && (
                <>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={forgotPasswordData.newPassword}
                    onChange={handleForgotPasswordChange}
                    required
                    minLength={8}
                    maxLength={16}
                    className="input565"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={forgotPasswordData.confirmPassword}
                    onChange={handleForgotPasswordChange}
                    required
                    minLength={8}
                    maxLength={16}
                    className="input565"
                  />
                </>
              )}
              <button type="submit" className="send-otp-button">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      <p onClick={() => navigate(-1)} className="backButton976">
        <IoArrowBackSharp />
        Back
      </p>
      <ToastContainer />
    </div>
  );
};

export default Register;
