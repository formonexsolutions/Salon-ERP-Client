import React, { useState } from "react";
import "../styles/AddProduct.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Helper/helper";

const DealersAddProduct = ({onClose}) => {
  // const [, /* supplierList */ setSupplierList] = useState([]);
  const [productData, setProductData] = useState({
    itemName: "",
    expiryDate: "",
    sellingprice: "",
    stock: "",
  });

  
  // useEffect(() => {
  //   const fetchSuppliers = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}/api/suppliers`);
  //       setSupplierList(response.data);
  //     } catch (error) {
  //       console.error("Error fetching suppliers:", error);
  //     }
  //   };
  //   fetchSuppliers();
  // }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const alphaRegex = /^[A-Za-z\s]*$/;

  // Block special characters and numbers for itemName
  if (name === "itemName" && !alphaRegex.test(value)) {
    return;
  }
    // Limit the length of selling price and stock to 5 digits
    if ((name === "sellingprice" || name === "stock") && value.length > 5) {
      return;
    }
    setProductData({ ...productData, [name]: value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (
      !productData.itemName 
      // !productData.expiryDate ||
      // !productData.sellingprice 
     
    ) {
      toast.error("Please fill in all the required fields");
      return;
    }

    try {
      const salonId = localStorage.getItem("salon_id");
      if (!salonId) {
        toast.error("Salon ID is not found in local storage");
        return;
      }
  
      let createdBy = localStorage.getItem("employeeName"); // Default to employeeName
  
      // If employeeName is not available, fallback to adminName for admins
      if (!createdBy && localStorage.getItem("userRole") === "admin") {
        createdBy = localStorage.getItem("adminName");
      }
  
      // If createdBy is still not available, use a generic fallback
      createdBy = createdBy || "Unknown User";
  
      const modifiedBy = createdBy;
      const createdAt = new Date().toISOString();
      const modifiedAt = createdAt;

      const productDataWithMetadata = {
        ...productData,
        salonId, // Include salon_id in the product data
        createdBy,
        createdAt,
        modifiedBy,
        modifiedAt,
      };

      await axios.post(`${BASE_URL}/api/dealersproducts`, productDataWithMetadata);
      toast.success("Product saved successfully");
    } catch (error) {
      console.error("Error while adding product", error);
      toast.error("Error while adding product");
    }

    setProductData({
      itemName: "",
      expiryDate: "",
      sellingprice: "",
      stock: "",
    });
  };

  // const handleKeyDown = (e) => {
  //   if (e.key === "-" || e.key === "+") {
  //     e.preventDefault();
  //   }
  // };

  return (
    <div className="main-empp12">
      <ToastContainer />
      <form className="addproduct1212" autoComplete="off">
        <h5 className="heading23412">Add Product</h5>
        <div className="product-formgroup1212">
          <label className="plabel1221">Product Name</label>
          <input
            type="text"
            name="itemName"
            value={productData.itemName}
            onChange={handleChange}
            required
            className="pinput1212"
            placeholder="Enter Product Name"
          ></input>
        </div>

        {/* <div className="product-formgroup12">
          <label className="plabel12">Expiry Date</label>
          <input
            type="date"
            className="pinput12"
            name="expiryDate"
            value={productData.expiryDate}
            onChange={handleChange}
            required
          ></input>
        </div> */}

        {/* <div className="product-formgroup12">
          <label className="plabel12">Selling Price</label>
          <input
            type="number"
            className="pinput12"
            placeholder="Enter Selling Price"
            name="sellingprice"
            value={productData.sellingprice}
            min="0" // Ensure the minimum value is 0
            maxLength="5" // Restrict to maximum 5 digits
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
          ></input>
        </div> */}
        {/* <div className="product-formgroup12">
          <label className="plabel12">Stock</label>
          <input
            type="number"
            className="pinput12"
            placeholder="Enter Stock"
            name="stock"
            value={productData.stock}
            min="0" // Ensure the minimum value is 0
            maxLength="5" // Restrict to maximum 5 digits
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
          ></input>
        </div> */}
        <div className="product-buttons1212">
          <button className="pp-btns13" onClick={handleAdd}>
            +Add
          </button>
          <button type="button" className="pp-btns131" onClick={onClose}>
              Cancel
            </button>
        </div>
      </form>
    </div>
  );
};

export default DealersAddProduct;

