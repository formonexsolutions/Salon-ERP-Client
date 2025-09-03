import React, { useState, useEffect } from "react";
import "../styles/AddEmployee.css";
// import PasswordToggle from "./PasswordToggle";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Helper/helper";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons from react-icons library

function AddEmployee({ data, onSave, onCancel }) {
  const [employees, setEmployees] = useState([]);
  // const [errors, setErrors] = useState({
  //   phoneNumber: "",
  // });

  const loggedInUser = localStorage.getItem('adminName') || localStorage.getItem('employeeName');
  
  // const handleBranchNameChange = (e) => {
  //   const selectedBranchName = e.target.value;
  //   const selectedBranch = branches.find(
  //     (branch) => branch.branchName === selectedBranchName
  //   );

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     branch_id: selectedBranch ? selectedBranch.branch_id : "",
  //     branchName: selectedBranchName, // Update to 'branch name'
  //   }));
  // };
  const handleBranchIdChange = (e) => {
    const selectedBranchId = e.target.value;
    const selectedBranch = branches.find(
      (branch) => branch.branch_id === selectedBranchId
    );

    if (selectedBranch) {
      setFormData((prevData) => ({
        ...prevData,
        branch_id: selectedBranchId,
        branchName: selectedBranch.branchName, // Update to 'branch name'
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        branch_id: selectedBranchId,
        branchName: "", // Clear 'branch name' if no matching branch is found
      }));
    }
  };
  const [formData, setFormData] = useState(
    data
      ? { ...data }
      : {
          employeeName: "",
          password: "",
          phoneNumber: "",
          Qualification: "",
          experience: "",
          specialization: "",
          role: "",
          branchName: "", // Update to 'branch name'
          gender: "",
          branch_id: "",
        }
  );

  const [showPassword, setShowPassword] = useState(false);
  // const [newRole, setNewRole] = useState("");
  // const [showAddRole, setShowAddRole] = useState(false);
  // const [newRoleName, setNewRoleName] = useState("");
  const [branches, setBranches] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [passwordError, setPasswordError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const alphaRegex = /^[A-Za-z\s]*$/;

  // Block special characters and numbers for employeeName
  if ((name === "employeeName" || name === "specialization") && !alphaRegex.test(value)) {
    return;
  }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const phonePattern = /^[6-9]\d{9}$/;
    const alphaRegex = /^[A-Za-z\s]*$/;
  
    // Validate phone number
    if (!phonePattern.test(formData.phoneNumber)) {
      setError("Phone number must be exactly 10 digits long");
      return;
    }
  
    // Validate employee name
    if (!alphaRegex.test(formData.employeeName)) {
      setError("Employee name must contain only alphabetic characters and spaces");
      return;
    }
  
    // Retrieve salon_id from local storage
    const salonId = localStorage.getItem("salon_id");
    if (!salonId) {
      setError("Salon ID not found in local storage");
      return;
    }
  
    // Determine createdBy and modifiedBy based on user role
    const createdBy = localStorage.getItem("adminName") || localStorage.getItem("employeeName");
    const modifiedBy = createdBy;
  
    // Construct the FormData object with the new fields
    const formDataToSend = new FormData();
    formDataToSend.append("employeeName", formData.employeeName);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("Qualification", formData.Qualification);
    formDataToSend.append("experience", formData.experience);
    formDataToSend.append("specialization", formData.specialization);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("branch_id", formData.branch_id);
    formDataToSend.append("branchName", formData.branchName);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("file", file);
    formDataToSend.append("createdByName", createdBy);
    formDataToSend.append("createdAt", new Date().toISOString());
    formDataToSend.append("modifiedBy", modifiedBy);
    formDataToSend.append("modifiedAt", new Date().toISOString());
    formDataToSend.append("salon_id", salonId);
  
    // Find the selected branch object based on branch_id
    const selectedBranch = branches.find(
      (branch) => branch._id === formData.branch_id
    );
  
    // If a branch is found, include BranchName in the formData
    if (selectedBranch) {
      formDataToSend.append("branchName", selectedBranch.branchName);
    } else {
      // console.error("Selected branch not found for branch_id:", formData.branch_id);
    }
  
    try {
      const response = await axios.post(
        `${BASE_URL}/api/employees`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      toast.success("Employee added successfully!", {
        position: "top-right",
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  
      setEmployees([...employees, response.data]);
  
      setFormData({
        employeeName: "",
        password: "",
        phoneNumber: "",
        Qualification: "",
        experience: "",
        specialization: "",
        role: "",
        branchName: "",
        branch_id: "",
        gender: "",
      });
  
      setFile(null);
    } catch (error) {
      console.error("Error while adding employee", error);
      toast.error("Error while adding employee", error);
    }
  };
  
  
  
  


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // const handleAddRole = () => {
  //   setShowAddRole(true);
  // };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/employees`)
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        // setError("Error fetching employee data.");
      });
  }, [setError]);



  const handleSave = async (e) => {
    e.preventDefault();
  
    try {
      const updatedEmployee = {
        ...formData,
        modifiedBy: loggedInUser
      };
      
      await axios.put(`${BASE_URL}/api/employees/${updatedEmployee._id}`, updatedEmployee);
      
      onSave(updatedEmployee);
      
      toast.success('Employee edited successfully!', {
        position: 'top-right',
        autoClose: 3000, // Close the toast after 3000 milliseconds (3 seconds)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  
      // Clear the form data
      setFormData({
        employeeName: "",
        password: "",
        phoneNumber: "",
        Qualification: "",
        experience: "",
        specialization: "",
        role: "",
        branchName: "",
        gender: "",
        
      });
    } catch (error) {
      toast.error('Error updating employee:', error.message);
    }
  };
  

  useEffect(() => {
    const fetchBranches = async () => {
      const salonId = localStorage.getItem('salon_id');
      if (!salonId) {
        console.error('Salon ID not found in local storage');
        return;
      }
  
      try {
        const response = await axios.get(`${BASE_URL}/api/branches?salon_id=${salonId}`);
        // Filter out branches with status "IA" (Inactive)
        const activeBranches = response.data.filter(branch => branch.status !== 'IA');
        setBranches(activeBranches);
      } catch (error) {
        console.error('Error fetching branches:', error.message);
        setError('Error fetching branches');
      }
    };
  
    fetchBranches();
  }, []);
  

  // const handleBranchChange = (e) => {
  //   const selectedBranchName = e.target.value;
  //   const selectedBranch = branches.find(
  //     (branch) => branch.branchName === selectedBranchName
  //   );

  //   if (selectedBranch) {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       branch_id: selectedBranch.branch_id,
  //       branchName: selectedBranchName,
  //     }));
  //   }
  // };

  const handleInputNumber = (event) => {
    const { name, value } = event.target;

    // Allow only numbers to be entered
    if (/^[0-9]*$/.test(value)) {
      setFormData({ ...formData, [name]: value });

      // Validate the phone number pattern
      const phonePattern = /^[6-9]\d{0,9}$/;
      // const partialPhonePattern = /^[6-9]\d{0,9}$/;
      if (!phonePattern.test(value)) {
        setError("Phone number must start with 6, 7, 8, or 9");
      } else if (value.length === 10 && !phonePattern.test(value)) {
        setError(
          "Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits long"
        );
      } else if (value.length < 10) {
        setError("Phone number must be exactly 10 digits long");
      } else {
        setError("");
      }
    }
  };

  const handleInputPassword = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, password: value });
    validatePassword(value);
  };

  const validatePassword = (password) => {
    const lengthCheck = password.length > 8;
    const capitalLetterCheck = /[A-Z]/.test(password);
    const specialCharacterCheck = /[@$!&]/.test(password);
    const lowercaseLetterCheck = /[a-z]/.test(password);
    const numberCheck = /[0-9]/.test(password);

    if (!lengthCheck) {
      setPasswordError("Password length must be greater than 8 characters.");
    } else if (!capitalLetterCheck) {
      setPasswordError("Password must contain at least one capital letter.");
    } else if (!specialCharacterCheck) {
      setPasswordError(
        "Password must contain at least one special character (@, $, !, &)."
      );
    } else if (!lowercaseLetterCheck) {
      setPasswordError("Password must contain at least one lowercase letter.");
    } else if (!numberCheck) {
      setPasswordError("Password must contain at least one number.");
    } else {
      setPasswordError("");
    }
  };

  return (
    <div className="main-empp">
      <div className="add-employee-container-saloon2345">
        <h5 className="heading234">Add Employee</h5>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="employeeName" className="label664">
                Employee Name
              </label>
            </div>
            <input
              className="empinput456"
              type="text"
              id="employeeName"
              name="employeeName"
              placeholder="Enter Employee Name"
              value={formData.employeeName}
              onChange={handleInputChange}
              required
              pattern="/^[A-Za-z\s'-]+$/"
              maxLength={50}
              minLength={3}
            />
          </div>

          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="phoneNumber" className="label664">
                Phone Number
              </label>
            </div>
            <input
              className="empinput456"
              placeholder="Enter Phone Number"
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputNumber}
              maxLength={10}
              onKeyDown={(evt) =>
                ["e", "E", "+", "-", "."].includes(evt.key) &&
                evt.preventDefault()
              }
              pattern="[6789]\d{9}"
              required
            />
            {error && <div style={{ color: "red" }}>{error}</div>}
          </div>

          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="password" className="label664">
                Password
              </label>
            </div>
            <div className="password-input-container90">
              <input
                className="empinput45665"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputPassword}
                required
                maxLength={16}
                minLength={8}
                placeholder="Enter Password"
              />
              <span className="eye32" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passwordError && (
              <div style={{ color: "red" }}>{passwordError}</div>
            )}
          </div>

          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="Qualification" className="label664">
                Qualification
              </label>
            </div>
            <input
              className="empinput456"
              placeholder="Qualification"
              type="text"
              id="Qualification"
              name="Qualification"
              value={formData.Qualification}
              onChange={handleInputChange}
              required
              maxLength={50}
              minLength={3}
            />
          </div>

          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="role" className="label664">
                Role
              </label>
            </div>
            <select
              className="empinput456"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Role</option>
              <option value="stylist">Stylist</option>
              <option value="admin">Admin</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>

          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="experience" className="label664">
                Experience
              </label>
            </div>
            <input
              className="empinput456"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
              maxLength={3}
              minLength={0}
              pattern="\d{1,3}"
              inputMode="numeric"
              placeholder="Enter Experience"
              title="Experience must be a number between 1 and 999"
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight" &&
                  e.key !== "Delete"
                ) {
                  e.preventDefault();
                }
              }}
            />
          </div>

          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="gender" className="label664">
                Gender
              </label>
            </div>
            <select
              className="empinput456"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="specialization" className="label664">
                Specialization
              </label>
            </div>
            <input
              className="empinput456"
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              required
              maxLength={30}
              minLength={1}
              placeholder="Specialization"
            />
          </div>

          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="branch_id" className="label664">
                Branch Id
              </label>
            </div>
            <select
              className="empinput456"
              id="branch_id"
              name="branch_id"
              placeholder="Enter Branch ID"
              value={formData.branch_id}
              onChange={handleBranchIdChange}
              required
            >
              <option value="">Select Branch ID</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch.branch_id}>
                  {branch.branch_id}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group-saloon2345">
            <div className="lable-name-saloon2345">
              <label htmlFor="branch_name" className="label664">
                Branch Name
              </label>
            </div>
            <input
            className="empinput456" 
            id="branch_name"
            name="branch_name"
            placeholder="Enter Branch Name"

            value={formData.branchName}
            readOnly
            />
          </div>

          <div className="emp-btn-flex2345">
            {data ? (
              <>
                <button
                  className="add-employee-button-saloon234567"
                  type="button"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="add-employee-button-saloon2345"
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="add-employee-button-saloon23456789"
                type="submit"
              >
                Add Employee
              </button>
            )}
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddEmployee;
