import React, { useState } from "react";
import "../styles/EditProfile.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Helper/helper";

const EditProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const idUser = localStorage.getItem("userId");
  const adminName = localStorage.getItem("adminName");
  const employeeName = localStorage.getItem("employeeName");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // Validate passwords
    const newPasswordValidationResult = validatePassword();
    if (newPasswordValidationResult) {
      toast.error(newPasswordValidationResult, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      // Update password
      const passwordResponse = await axios.post(
        `${BASE_URL}/api/EchangePassword`,
        {
          idUser,
          oldPassword,
          newPassword,
        },
        {
          headers: {
            "x-token": token,
          },
        }
      );

      // Update username
      const usernameResponse = await axios.post(
        `${BASE_URL}/api/updateUsername`,
        {
          idUser,
          newUsername: adminName || employeeName,
        },
        {
          headers: {
            "x-token": token,
          },
        }
      );

      if (passwordResponse.data.success && usernameResponse.data.success) {
        toast.success("Username and password updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Clear form fields
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // Update username in local storage
        if (adminName) {
          localStorage.setItem("adminName", adminName);
        } else {
          localStorage.setItem("employeeName", employeeName);
        }

        // Navigate after successful update
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        toast.error(
          passwordResponse.data.message || usernameResponse.data.message,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    } catch (error) {
      toast.error("Please contact your salon admin to change the password", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Clear form fields on error
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const validatePassword = () => {
    if (newPassword !== confirmPassword) {
      return "Passwords don't match.";
    }
    // Add more validation rules if needed
    return null;
  };

  return (
    <div className="edit-profile-saloon234">
      <h5 className="heading234">Edit Profile</h5>
      <div className="pad765">
      <div className="form-group-saloon234">
        <label className="lablenamesaloon234" htmlFor="username">
          Username
        </label>
        <input
          type="text"
          className="form-group-saloon234-input2"
          id="username"
          placeholder="Enter Username"
          value={adminName || employeeName || ""}
          readOnly
          required
        />
      </div>

      <div className="form-group-saloon234">
        <label className="lablenamesaloon234" htmlFor="oldPassword">
          Old Password
        </label>
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            className="form-group-saloon234-input"
            id="oldPassword"
            placeholder="Enter Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={togglePasswordVisibility}
            className="password-icon"
          />
        </div>
      </div>

      <div className="form-group-saloon234">
        <label className="lablenamesaloon234" htmlFor="newPassword">
          New Password
        </label>
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            className="form-group-saloon234-input"
            id="newPassword"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={togglePasswordVisibility}
            className="password-icon"
          />
        </div>
      </div>

      <div className="form-group-saloon234">
        <label className="lablenamesaloon234" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <div className="password-input-container">
          <input
            type="password"
            className="form-group-saloon234-input"
            id="confirmPassword"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={togglePasswordVisibility}
            className="password-icon"
          />
        </div>
      </div>
      <div className="btnblock9">
        <button className="update-btn-saloon234" onClick={handleUpdate}>
          Update
        </button>
      </div>
      </div>
    </div>
  );
};

export default EditProfile;
