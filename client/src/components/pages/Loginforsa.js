import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Salonlogo from "../images/Salon-logo.png";
import "../styles/Loginforsa.css";
import { BASE_URL } from "../Helper/helper";
import { IoArrowBackSharp } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Loginforsa = () => {
  const [isSuperAdminLogin, setIsSuperAdminLogin] = useState(false);
  const [loginMethod, setLoginMethod] = useState("password"); // "password" or "otp"
  const [formData, setFormData] = useState({
    mobilenumber: "",
    password: "",
    otp: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    mobileNumber: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
    otpVerified: false,
  });

  const handleToggleLogin = () => {
    setIsSuperAdminLogin(!isSuperAdminLogin);
    setError("");
    setFormData({
      mobilenumber: "",
      password: "",
      otp: "",
    });
    setOtpSent(false);
    setLoginMethod("password");
  };

  const handleLoginMethodToggle = (method) => {
    setLoginMethod(method);
    setFormData({
      mobilenumber: "",
      password: "",
      otp: "",
    });
    setOtpSent(false);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "mobilenumber") {
      newValue = newValue.replace(/\D/g, "");
      newValue = newValue.slice(0, 10);
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (loginMethod === "password") {
        // Password login
        if (!formData.mobilenumber || !formData.password) {
          throw new Error("Mobile number and password are required");
        }

        const url = isSuperAdminLogin
          ? `${BASE_URL}/api/superadmin/login`
          : `${BASE_URL}/api/salonadmin/login`;

        const response = await axios.post(url, formData);

        // Handle successful login response
        handleSuccessfulLogin(response.data);
      } else {
        // OTP login
        if (!formData.mobilenumber || !formData.otp) {
          throw new Error("Mobile number and OTP are required");
        }

        const url = isSuperAdminLogin
          ? `${BASE_URL}/api/superadmin/login-with-otp`
          : `${BASE_URL}/api/salonadmin/login-with-otp`;

        const response = await axios.post(url, {
          mobilenumber: formData.mobilenumber,
          otp: formData.otp,
        });

        // Handle successful login response
        handleSuccessfulLogin(response.data);
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        if (error.response.status === 401) {
          if (
            error.response.data.message ===
            "Mobile number is not registered. Please try again."
          ) {
            toast.error("Incorrect Mobile Number ");
          } else if (error.response.data.message === "Incorrect password") {
            toast.error("Incorrect password");
          } else if (error.response.data.message === "Invalid OTP") {
            toast.error("Invalid OTP");
          } else if (
            error.response.data.message ===
            "Your Subscription Might Have Ended. Please Contact SuperAdmin."
          ) {
            toast.error(
              "Your Subscription Might Have Ended OR Account Not Activated. Please Contact SuperAdmin."
            );
          } else if (
            error.response.data.message ===
            "Your Saloon Branch Subscription might have ended. Contact Admin."
          ) {
            toast.error(
              "Your Branch Subscription might have ended OR Not Activated . Contact Admin."
            );
          } else if (
            error.response.data.message ===
            "Your status is deactivated. Please check with your superior for activation.."
          ) {
            toast.error(
              "Your status is deactivated. Please check with your superior."
            );
          } else {
            toast.error(error.response.data.message);
          }
        } else {
          setError(error.response.data.message || "Internal Server Error");
        }
      } else {
        setError("Network Error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessfulLogin = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("salon_id", data.salon_id);

    if (isSuperAdminLogin) {
      localStorage.setItem("userId", data.superAdminId);
      localStorage.setItem("superAdminName", data.superAdminName);
      localStorage.setItem("phoneNumber", data.phoneNumber || "");
      navigate("/Superadmindashboard");
    } else {
      if (!data.salon_id) {
        throw new Error("Salon ID is missing in the response");
      }

      localStorage.setItem("userId", data.staff_id);
      localStorage.setItem("branch_id", data.branch_id);
      localStorage.setItem("branchName", data.branchName);
      localStorage.setItem("address", data.address);
      localStorage.setItem("phoneNumber", data.phoneNumber);

      if (data.role === "admin") {
        if (data.employeeName) {
          localStorage.setItem("employeeName", data.employeeName);
        } else if (data.adminName) {
          localStorage.setItem("adminName", data.adminName);
          localStorage.setItem("phoneNumber", data.phoneNumber);
        }
      } else if (
        data.role === "receptionist" ||
        data.role === "stylist"
      ) {
        if (data.employeeName) {
          localStorage.setItem("employeeName", data.employeeName);
          localStorage.setItem("phoneNumber", data.phoneNumber);
        }
      }

      navigate("/Dashboard");
    }
  };

  const handleSendLoginOtp = async () => {
    if (!formData.mobilenumber) {
      toast.error("Please enter mobile number");
      return;
    }

    try {
      const url = isSuperAdminLogin
        ? `${BASE_URL}/api/superadmin/send-login-otp`
        : `${BASE_URL}/api/salonadmin/send-login-otp`;

      const response = await axios.post(url, {
        mobilenumber: formData.mobilenumber,
      });

      if (response.data.message) {
        toast.success(response.data.message);
        setOtpSent(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSendOtp = async () => {
    const endpoint = isSuperAdminLogin
      ? `${BASE_URL}/api/superadmin/forgot-password`
      : `${BASE_URL}/api/salonadmin/forgot-password`;

    try {
      const response = await axios.post(endpoint, {
        mobileNumber: forgotPasswordData.mobileNumber,
      });

      if (response.data.message) {
        toast.success(response.data.message);
        setForgotPasswordData((prevData) => ({
          ...prevData,
          otpVerified: false,
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    const endpoint = isSuperAdminLogin
      ? `${BASE_URL}/api/superadmin/verify-otp`
      : `${BASE_URL}/api/salonadmin/verify-otp`;

    try {
      const response = await axios.post(endpoint, {
        mobileNumber: forgotPasswordData.mobileNumber,
        otp: forgotPasswordData.otp,
      });

      if (response.data.message === "OTP verified successfully") {
        toast.success(response.data.message);
        setForgotPasswordData((prevData) => ({
          ...prevData,
          otpVerified: true,
        }));
      } else {
        toast.error("Failed to verify OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Failed to verify OTP");
    }
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

    const endpoint = isSuperAdminLogin
      ? `${BASE_URL}/api/superadmin/reset-password`
      : `${BASE_URL}/api/salonadmin/reset-password`;

    try {
      const response = await axios.post(endpoint, {
        mobileNumber: forgotPasswordData.mobileNumber,
        otp: forgotPasswordData.otp, // Include OTP in the request
        newPassword: forgotPasswordData.newPassword,
        confirmPassword: forgotPasswordData.confirmPassword,
      });

      if (response.data.message) {
        toast.success(response.data.message);
        setShowForgotPasswordPopup(false);
      }
    } catch (error) {
      console.error("Error in password reset request:", error);
      toast.error(error.response.data.message || "Failed to reset password");
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="main-body31">
      <div
        className={`login-body ${
          isSuperAdminLogin ? "super-admin-active" : ""
        }`}
      >
        <div className="flex1054">
        <div className="login-container">
          <ToastContainer />
          <div className="login-banner">
            <img src={Salonlogo} alt="Salon Logo" className="logo" />
            {!isSuperAdminLogin && (
              <div className="banner-content">
                <h1 className="h190">Boost your Salon Business</h1>
                <p className="para321">
                  Manage appointments, staff, and much more efficiently with our
                  dashboard.
                </p>
              </div>
            )}
            <button className="btn765" onClick={handleToggleLogin}>
              {isSuperAdminLogin
                ? "Salon Admin & Staff Login"
                : "Super Admin Login"}
            </button>
          </div>
          <div className="login-form-container">
            <div className="form-box">
              <h2 className="heading65">
                {isSuperAdminLogin
                  ? "Super Admin Login"
                  : "Salon Admin & Staff Login"}
              </h2>
              
              {/* Login Method Tabs */}
              <div className="login-method-section">
                <p className="login-with-text">login with</p>
                <div className="login-tabs">
                  <div 
                    className={`tab-item ${loginMethod === "password" ? "tab-active" : ""}`}
                    onClick={() => handleLoginMethodToggle("password")}
                  >
                    Password
                  </div>
                  <div 
                    className={`tab-item ${loginMethod === "otp" ? "tab-active" : ""}`}
                    onClick={() => handleLoginMethodToggle("otp")}
                  >
                    OTP
                  </div>
                </div>
              </div>

              {error && <p className="error-message">{error}</p>}
              <form onSubmit={handleSubmit} className="form740">
      <input
        type="text"
        id="mobilenumber"
        name="mobilenumber"
        className="input-field"
        placeholder="Mobile Number"
        value={formData.mobilenumber}
        onChange={handleChange}
        required
      />
      
      {loginMethod === "password" ? (
        <div className="password-containereyeicon">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            className="input-field password-inputeyeicon"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            maxLength={16}
            required
          />
          <span className="password-toggle-iconeyeicon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      ) : (
        <div className="otp-input-container">
          <input
            type="text"
            id="otp"
            name="otp"
            className="input-field otp-input"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            disabled={!otpSent}
            required
          />
          <button
            type="button"
            className="send-otp-btn"
            onClick={handleSendLoginOtp}
            disabled={!formData.mobilenumber || otpSent}
          >
            {otpSent ? "OTP Sent" : "Send OTP"}
          </button>
        </div>
      )}
      
      <button
        type="submit"
        className="submit-button01"
        disabled={submitting || (loginMethod === "otp" && !otpSent)}
      >
        {submitting ? "Logging in..." : "Login"}
      </button>
      
      {loginMethod === "password" && (
        <button
          type="button"
          className="forgot-password-link"
          onClick={() => setShowForgotPasswordPopup(true)}
        >
          Forgot password?
        </button>
      )}
    </form>
              <div className="toggle-login">
                {!isSuperAdminLogin && (
                  <span className="span12">
                    Want to register your salon? &nbsp;
                    <Link to="/register" className="register-link">
                      Click here.
                    </Link>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="backButton976">
            <IoArrowBackSharp />
            Back
          </button>
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
                name="mobileNumber"
                placeholder="Mobile Number"
                value={forgotPasswordData.mobileNumber}
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
    </div>
  );
};

export default Loginforsa;
