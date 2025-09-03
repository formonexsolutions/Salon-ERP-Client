import React, { useState, useEffect} from "react";
import "../styles/AddCustomer.css";
import Axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Helper/helper";

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    branchId: "",
    branchName: "",
  });
  const [errors, setErrors] = useState({ name: "", phone: "" });

  useEffect(() => {
    const salonId = localStorage.getItem('salon_id');
    const branchId = localStorage.getItem('branch_id');
    const branchName = localStorage.getItem('branchName');
    const storedUserRole = localStorage.getItem("userRole") || "defaultUserRole";
    const storedEmployeeName = localStorage.getItem("employeeName") || "defaultEmployeeName";
  
    if (!salonId || !branchId || !branchName) {
      // console.error('Required data not found in local storage');
      return;
    }
  
    setFormData(prevFormData => ({
      ...prevFormData,
      branchId,
      branchName,
    }));
    setUserRole(storedUserRole);
    setEmployeeName(storedEmployeeName);
  }, []); // Include formData in the dependency array
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "name") {
      // Remove any characters that are not letters or spaces
      const filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
      if (filteredValue !== value) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: "Name can only contain letters and spaces",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: "",
        }));
      }
      setFormData({
        ...formData,
        [name]: filteredValue,
      });
      return; // Exit early to avoid setting the unfiltered value
    }
  
    if (name === "phone") {
      // Allow only digits and ensure it starts with 6, 7, 8, or 9
      const filteredValue = value.replace(/\D/g, "");
      const phoneRegex = /^[6789]\d{0,9}$/; // Starts with 6, 7, 8, or 9 and up to 10 digits long
      if (!phoneRegex.test(filteredValue)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone: "Phone number must start with 6, 7, 8, or 9 and be a 10-digit number",
        }));
      } else if (filteredValue.length > 10) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone: "Phone number must be a 10-digit number",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone: "",
        }));
      }
      setFormData({
        ...formData,
        [name]: filteredValue,
      });
      return; // Exit early to avoid setting the unfiltered value
    }
  
    // Update form data state for other fields
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  
  

  const [/*adminName*/, setAdminName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [, setSubmitting] = useState(false);

  useEffect(() => {
    const adminNameFromStorage = localStorage.getItem("adminName") || "defaultAdminName";
    const userRoleFromStorage = localStorage.getItem("userRole") || "defaultUserRole";
    const employeeNameFromStorage = localStorage.getItem("employeeName") || "defaultEmployeeName";
    setAdminName(adminNameFromStorage);
    setUserRole(userRoleFromStorage);
    setEmployeeName(employeeNameFromStorage);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (errors.name || errors.phone) {
      toast.error("Please correct the errors in the form.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setSubmitting(true);
    try {
      // Use the correct createdBy value based on userRole
      let createdBy;
      let createdByModel;
      if (userRole === "admin") {
        createdBy = employeeName;
        createdByModel = "Employee";
      } else {
        createdBy = employeeName;
        createdByModel = "Employee"; // Change this accordingly if needed
      }

      const formDataToSubmit = {
        ...formData,
        createdBy,
        createdByModel,
      };

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in local storage");
      }

      const salonId = localStorage.getItem('salon_id');
      if (!salonId) {
        throw new Error("Salon ID not found in local storage");
      }

      // console.log("FormData to submit:", formDataToSubmit);
      // console.log("Salon ID:", salonId);

      await Axios.post(
        `${BASE_URL}/api/customers?salon_id=${salonId}`,
        formDataToSubmit,
      );

      toast.success("Customer added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setFormData({
        name: "",
        phone: "",
        branchId: "",
        branchName: "",
      });
    } catch (error) {
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      toast.error("Failed to add customer. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="A7custmaindiv86">
      <form onSubmit={handleFormSubmit} autoComplete="off">
        <h5 className="add-cus-heading">Add New Customer</h5>
        <div className="flexchange190">
          <div className="width890">
            <div className="form-group">
              <label className="custlabel">Name</label>
              <input
                className="customer-inputa7"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter Customer Name"
                required
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label className="custlabel">Phone</label>
              <input
                className="customer-inputa7"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter Phone Number"
                maxLength={10}
                required
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>
            <div className="form-group">
              <label className="custlabel">Branch ID</label>
              <input
                className="customer-inputa7"
                type="text"
                name="branchId"
                value={formData.branchId}
                readOnly
                required
              />
            </div>
            <div className="form-group">
              <label className="custlabel">Branch Name</label>
              <input
                className="customer-inputa7"
                type="text"
                name="branchName"
                value={formData.branchName}
                readOnly
                required
              />
            </div>
          </div>
          <div className="button-container">
          <button className="customerbtn86">Add Customer</button>
        </div>
        </div>
        
      </form>
      <ToastContainer />
    </div>
  );
};



export default AddCustomer;
