import React, { useState } from "react";
import "../styles/AddProduct.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProduct = ({ data, onSave, onCancel }) => {
  const [editedData, setEditedData] = useState({ ...data });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Limit the length of selling price and stock to 5 digits
    if ((name === "sellingprice" || name === "stock") && value.length > 5) {
      return;
    }
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSave = (e) => {
     e.preventDefault();
     onSave(editedData);
    // toast.success('Product updated successfully');
  };

  const handleCancel = () => {
    onCancel();
    toast.warn('Edit canceled');
  };

  const handleKeyDown = (e) => {
    if (e.key === "-" || e.key === "+") {
      e.preventDefault();
    }
  };

  return (
    <div className="sp-popup14">
      <form className="editproduct12">
        <h5 className="product-heading12">Edit Product</h5>
        <div className="product-formgroup12">
          <label className="plabel12">Product Name</label>
          <input
            type="text"
            name="itemName"
            value={editedData.itemName}
            onChange={handleInputChange}
            required
            className="pinput12"
          ></input>
        </div>
        
        <div className="product-formgroup12">
          <label className="plabel12">Expiry Date</label>
          <input
            type="Date"
            className="pinput12"
            name="expiryDate"
            value={editedData.expiryDate}
            onChange={handleInputChange}
            required
          ></input>
        </div> 

        <div className="product-formgroup12">
          <label className="plabel12">Selling Price</label>
          <input
            type="number"
            className="pinput12"
            placeholder="0"
            name="sellingprice"
            value={editedData.sellingprice}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            min="0" // Ensure the minimum value is 0
            maxLength="5" // Restrict to maximum 5 digits
            required
          ></input>
        </div>
        <div className="product-formgroup12">
          <label className="plabel12">Stock</label>
          <input
            type="number"
            className="pinput12"
            placeholder="0"
            name="stock"
            value={editedData.stock}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            min="0" // Ensure the minimum value is 0
            maxLength="5" // Restrict to maximum 5 digits
            required
          ></input>
        </div>
        <div className="product-buttons12">
          <button className="pbtn12a" onClick={handleSave}>
            Save
          </button>
          <button className="pbtn12c" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
