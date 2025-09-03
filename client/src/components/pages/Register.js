import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";
import Salonlogo from "../images/Salon-logo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Helper/helper";
import ContinueSubscription from "../pages/ContinueSubscription";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRenewalOpen, setIsRenewalOpen] = useState(false);
  const [fieldError, setFieldError] = useState({
    SalonName: "",
    adminName: "",
    phoneNumber: "",
  });

  const [data, setData] = useState({
    adminName: "",
    SalonName: "",
    phoneNumber: "",
    gst:"",
    password: "",
    confirmpassword: "",
    state: "",
    city: "",
    address:"",
    createdBy: "admin", // Set this to the actual user creating the salon
    createdAt: new Date().toISOString(),
    otpVerified: false,
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [allStates, setAllStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

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
    let { name, value } = e.target;
  
    // Remove special characters for GST field
    if (name === "gst") {
      value = value.replace(/[^a-zA-Z0-9]/g, ""); // Allow only alphanumeric characters
    }
  
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  
    setMessage("");
  
    // Validation for Phone Number
    if (name === "phoneNumber") {
      const phoneNumberPattern = /^[6-9]\d{0,9}$/; // Start with 6-9 and followed by 0-9 digits, up to a maximum length of 10
      if (!/^\d+$/.test(value)) {
        setFieldError((prevError) => ({
          ...prevError,
          phoneNumber: "Phone number must contain only digits",
        }));
      } else if (!phoneNumberPattern.test(value)) {
        setFieldError((prevError) => ({
          ...prevError,
          phoneNumber: "Phone number must start with 6, 7, 8, or 9 and be 10 digits long",
        }));
      } else {
        setFieldError((prevError) => ({ ...prevError, phoneNumber: "" }));
      }
    }
  
    // Validation for GST Number
    else if (name === "gst") {
      const gstPattern = /^[A-Z0-9]{0,15}$/i; // Allow only alphanumeric characters, up to a maximum length of 15
      if (!gstPattern.test(value)) {
        setFieldError((prevError) => ({
          ...prevError,
          gst: "GST number must contain only alphanumeric characters",
        }));
      } else {
        setFieldError((prevError) => ({ ...prevError, gst: "" }));
      }
    }
  
    // Validation for Salon Name and Admin Name
    else if (name === "SalonName" || name === "adminName") {
      const namePattern = /^[a-zA-Z\s-]{3,50}$/; // Alphanumeric, spaces, hyphens, 3-50 characters
      if (!namePattern.test(value)) {
        setFieldError((prevError) => ({
          ...prevError,
          [name]: "Name must be between 3 and 50 characters long and can only contain alphanumeric characters, spaces, hyphens.",
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
        setMessage('Passwords do not match');
        return;
    }
    if (data.phoneNumber.length !== 10 || /^[1-5]/.test(data.phoneNumber)) {
        setMessage('Phone number must be exactly 10 digits');
        return;
    }
    if (!passwordPattern.test(data.password)) {
        setMessage(
            'Password must be between 8 and 16 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        );
        return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/register`, data);
      if (response.status === 201) {
        const { salon_id, otpSent, warning } = response.data; // Extract salon_id and otpSent from response
  
        // Store registered data and salon_id in local storage
        const registeredData = {
          SalonName: data.SalonName,
          adminName: data.adminName,
          phoneNumber: data.phoneNumber,
          state: data.state,
          city: data.city,
          address: data.address,
          createdAt: new Date().toISOString(),
        };
  
        localStorage.setItem('salon_id', salon_id); // Store salon_id in localStorage
        localStorage.setItem('registeredData', JSON.stringify(registeredData)); // Store registered data
  
        if (otpSent) {
          toast.success('Registered Successfully! OTP sent to your phone.');
          setOtpSent(true);
        } else {
          toast.warning(warning || 'Registration successful, but OTP could not be sent. Please contact support.');
          // Skip OTP verification and go directly to subscription
          navigate("/Subscription");
        }
        setMessage('');
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error || 'Unknown error occurred');
      } else {
        setMessage('Unknown error occurred');
      }
    }
  };

  

const verifyOtpHandler = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/api/verify-otp`, {
      phoneNumber: data.phoneNumber, // Use the phoneNumber from the state
      otp: otp, // Use the OTP entered by the user
    });

    if (response.status === 200) {
      const { data: otpData } = response;
      if (otpData.success) {
        console.log('OTP verified successfully. Received salon_id:', otpData.salon_id);
        toast.success("OTP verified successfully!");
        setOtpVerified(true); // Set state to indicate OTP is verified

        // Create initial payment record
        const paymentResponse = await axios.post(`${BASE_URL}/api/payment/create-initial-payment`, { salon_id: otpData.salon_id, phoneNumber:otpData.phoneNumber });
        if (paymentResponse.data.success) {
          console.log('Initial payment record created successfully');
        } else {
          console.error('Failed to create initial payment record');
        }

        navigate("/Subscription");
        // Additional actions upon successful verification

        // Reset form data after successful OTP verification
        setData({
          adminName: "",
          SalonName: "",
          phoneNumber: "",
          password: "",
          confirmpassword: "",
          state: "",
          city: "",
          address:"",
          createdBy: "admin",
          createdAt: new Date().toISOString(),
          otpVerified: true,
        });
      } else {
        toast.error("Invalid OTP. Please try again.");
        // Handle invalid OTP scenario
      }
    } else {
      toast.error("Failed to verify OTP. Please try again.");
      // Handle other HTTP status codes if necessary
    }
  } catch (error) {
    toast.error("Failed to verify OTP. Please try again.");
    console.error("Error verifying OTP:", error);
  }
};



  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === "") {
      const otpArray = otp.split("");
      otpArray[index] = value;
      setOtp(otpArray.join(""));

      // Automatically focus next input
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
        city.cityName.toLowerCase().startsWith(inputCity)
      );
      setFilteredCities(filtered);
    } catch (error) {
      console.error("Error fetching cities:", error);
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
  const openRenewalModal = () => {
    setIsRenewalOpen(true);
  };

  const closeRenewalModal = () => {
    setIsRenewalOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-info">
          <img src={Salonlogo} alt="Salon Logo" className="logo" />
          <p className="para6632">
            Join us to get your salon listed and attract more customers. Fill
            out the form to get started!
          </p>
        </div>
        <div className="form398">
          <form
            onSubmit={submitHandler}
            autoComplete="off"
            className="register-form"
          >
            <h5 className="formHeading">Register your Salon!!</h5>
            <div className="form-row">
              <div className="formGroup">
                <label htmlFor="SalonName">Salon Name</label>
                <input
                  type="text"
                  name="SalonName"
                  className={`form-input ${fieldError.SalonName ? "error" : ""}`}
                  value={data.SalonName}
                  onChange={changeHandler}
                  placeholder="Salon Name"
                  required
                />
                {fieldError.SalonName && (
                  <p className="errorMessage">{fieldError.SalonName}</p>
                )}
              </div>
              <div className="formGroup">
                <label htmlFor="adminName">Admin Name</label>
                <input
                  type="text"
                  name="adminName"
                  className={`form-input ${fieldError.adminName ? "error" : ""}`}
                  value={data.adminName}
                  onChange={changeHandler}
                  placeholder="Admin Name"
                  required
                />
                {fieldError.adminName && (
                  <p className="errorMessage">{fieldError.adminName}</p>
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
                  pattern="[6-9][0-9]{0,9}"
                  required
                  maxLength={10}
                  autoComplete="username"
                />
                {fieldError.phoneNumber && (
                  <p className="errorMessage">{fieldError.phoneNumber}</p>
                )}
              </div>
              <div className="formGroup">
              <label htmlFor="gst ">GST Number</label>
              <input
                  type="text"
                  name="gst"
                  className="form-input"
                  value={data.gst}
                  onChange={changeHandler}
                  placeholder="GST Number"
                  maxLength={15}
                />
                {fieldError.adminName && (
                  <p className="errorMessage">{fieldError.gst}</p>
                )}
              </div>
            </div>
            <div className="form-row">
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
          <div className="password-icon" onClick={togglePasswordVisibility}>
            {showPassword ? (
              <IoEyeOffOutline />
            ) : (
              <IoEyeOutline />
            )}
          </div>
        </div>
      </div>
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
          <div className="password-icon" onClick={togglePasswordVisibility}>
            {showPassword ? (
              <IoEyeOffOutline />
            ) : (
              <IoEyeOutline />
            )}
          </div>
        </div>
      </div>
      </div>
            <div className="form-row">
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
                 key={index} // Added unique key here
                 onClick={() => selectState(state.stateName)}
                 >
                 {state.stateName}
              </li>
              ))}
            </ul>
           )}
              </div>
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

                    fetchCitiesByState(data.state, inputCity.toLowerCase());
                  }}
                  placeholder="City"
                  required
                />
              {filteredCities.length > 0 && (
               <ul className="suggestions">
                 {filteredCities.map((city, index) => (
                 <li
                 key={index} // Added unique key here
             onClick={() => selectCity(city.cityName)}
             >
             {city.cityName}
             </li>
            ))}
          </ul>
           )}
         </div>
          </div>
          <div className="form-row">
    <div className="formGroup">
      <label htmlFor="address">Address</label>
      <textarea
        type="text"
        name="address"
        className="form-input"
        value={data.address}
        onChange={changeHandler}
        placeholder="Address"
        required
        // style={{ height: '80px' }} 
      />
    </div>
  </div>
            <button type="submit" className="registerButton">
              Register
            </button>
            <div className="click_butt_renrewal">
            <span className="span12">
              Already Registered? &nbsp; <Link className="butt_re_renewal" onClick={openRenewalModal}>Click here to Continue Subscription.</Link>
            </span>
            </div>
            {message && <p className="errorMessage">{message}</p>}
          </form>
          
          {otpSent && !otpVerified && (
            <div className="otp-modal">
              <div className="otp-modal-content">
                <label htmlFor="otp" className="otp-label">Enter OTP</label>
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
                <button onClick={verifyOtpHandler} className="verify-otp-button">Verify OTP</button>
              </div>
            </div>
          )}
          {isRenewalOpen && (
            <div className="modal-overlay">
              <div className="modal-content1">
                <button className="close-modal" onClick={closeRenewalModal}>X</button>
                <ContinueSubscription />
              </div>
            </div>
          )}
        </div>
      </div>
      <p onClick={() => navigate(-1)} className="backButton976">
            <IoArrowBackSharp />
            Back
          </p>
      <ToastContainer />
    </div>
  );
};

export default Register;