import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../Helper/helper";

const EditDealerCategory = ({ category,onCancelEdit }) => {
  const [editedData, setEditedData] = useState({
    categoryName: "",
    company: "",
    productName: "",
    productDescription: "",
    quantity: "",
    unit: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (category) {
      setEditedData({
        categoryName: category.categoryName || "",
        company: category.company || "",
        productName: category.productName || "",
        productDescription: category.productDescription || "",
        quantity: category.quantity || "",
        unit: category.unit || "",
      });
    }
  }, [category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const dealerId = localStorage.getItem("dealerId");
        if (!dealerId) {
          toast.error("Dealer ID is not found in local storage");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/api/customcategory/${dealerId}`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Error fetching categories");
      }
    };

    fetchCategories();
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `${BASE_URL}/api/dealercategories/${category._id}`,
        editedData
      );
      toast.success("Category updated successfully!");
      onCancelEdit()
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error updating category. Please try again.");
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    toast.info("Edit cancelled!");
    onCancelEdit()
  };

  return (
    <div className="main-empp84">
      <ToastContainer />
      <form className="addproduct1284">
        <h5 className="heading23484">Edit Category</h5>

        <div className="product-formgroup1284">
          <label className="plabel1284">Category Name</label>
          <select
            name="categoryName"
            value={editedData.categoryName}
            onChange={handleInputChange}
            required
            className="pinput1284"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.categoryName}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="product-formgroup1284">
          <label className="plabel1284">Company Name</label>
          <input
            type="text"
            id="company"
            name="company"
            value={editedData.company}
            onChange={handleInputChange}
            required
            className="pinput1284"
          />
        </div>

        <div className="product-formgroup1284">
          <label className="plabel1284">Product Name</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={editedData.productName}
            onChange={handleInputChange}
            required
            className="pinput1284"
          />
        </div>

        <div className="product-formgroup1284">
          <label className="plabel1284">Product Description</label>
          <textarea
            id="productDescription"
            name="productDescription"
            value={editedData.productDescription}
            onChange={handleInputChange}
            required
            className="pinput1284"
          />
        </div>

        <div className="product-formgroup1284">
          <label className="plabel1284">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={editedData.quantity}
            onChange={handleInputChange}
            required
            className="pinput1284"
          />
        </div>

        <div className="product-formgroup1284">
          <label className="plabel1284">Unit</label>
          <select
            id="unit"
            name="unit"
            value={editedData.unit}
            onChange={handleInputChange}
            required
            className="pinput1284"
          >
            <option value="">Select unit</option>
            <option value="ml">ml</option>
            <option value="kg">kg</option>
            <option value="gram">gram</option>
          </select>
        </div>

        <div className="btn-group52">
          <button
            type="button"
            onClick={handleSave}
            className="btn-save44"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn-cancel44"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDealerCategory;