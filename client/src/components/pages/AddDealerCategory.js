import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../Helper/helper';

const AddDealerCategory = ({ categoryData = {}, editMode = false, onClose }) => {
  const [formData, setFormData] = useState({
    categoryName: '',
    company: '',
    productName: '',
    productDescription: '', // Added productDescription
    quantity: '',           // Added quantity
    unit: 'ml',             // Added unit with default value 'ml'
  });

  const [errors, setErrors] = useState({
    company: '',
    productName: '',
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const dealerId = localStorage.getItem('dealerId');
        if (!dealerId) {
          toast.error('Distributor ID is not found in local storage');
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/customcategory/${dealerId}`);
        
        // Deduplicate categories based on categoryName
        const uniqueCategories = Array.from(
          new Map(response.data.map(item => [item.categoryName, item])).values()
        );

        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error fetching categories');
      }
    };

    fetchCategories();
  }, []);
  
  useEffect(() => {
    if (editMode) {
      setFormData({
        categoryName: categoryData.categoryName || '',
        company: categoryData.company || '',
        productName: categoryData.productName || '',
        productDescription: categoryData.productDescription || '', // Added productDescription for edit mode
        quantity: categoryData.quantity || '',           // Added quantity for edit mode
        unit: categoryData.unit || 'ml',                 // Added unit for edit mode
      });
    }
  }, [editMode, categoryData]);

  const validateName = (name) => {
    return /^[a-zA-Z\s]{3,20}$/.test(name);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "company" || name === "productName") {
      if (!validateName(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `${name === 'company' ? 'Company' : 'Product'} Name must be 3-20 characters long and not contain special characters or numbers.`,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.categoryName || !formData.company || !formData.productName || !formData.productDescription || !formData.quantity || !formData.unit) {
      toast.error('Please fill in all the required fields');
      return;
    }

    try {
      const dealerId = localStorage.getItem('dealerId');
      if (!dealerId) {
        toast.error('Distributor ID is not found in local storage');
        return;
      }

      const requestData = {
        ...formData,
        dealer_id: dealerId,
      };

      if (editMode) {
        // Update existing category
        await axios.put(`${BASE_URL}/api/dealercategories/${categoryData._id}`, requestData);
        toast.success('Category updated successfully');
      } else {
        // Add new category
        await axios.post(`${BASE_URL}/api/dealercategories`, requestData);
      }

      setFormData({
        categoryName: '',
        company: '',
        productName: '',
        productDescription: '', 
        quantity: '',           // Reset quantity
        unit: 'ml',             // Reset unit to default 'ml'
      });
      toast.success('Category added successfully');
      onClose();
    } catch (error) {
      console.error('Error while adding category', error);
      toast.error('Error while adding category');
    }
  };

  const onCancel = () => {
    if (editMode) {
      setFormData({
        categoryName: categoryData.categoryName || '',
        company: categoryData.company || '',
        productName: categoryData.productName || '',
        productDescription: categoryData.productDescription || '',
        quantity: categoryData.quantity || '', 
        unit: categoryData.unit || 'ml',  
      });
    } else {
      setFormData({
        categoryName: '',
        company: '',
        productName: '',
        productDescription: '',
        quantity: '', 
        unit: 'ml',  
      });
    }
    onClose();
  };

  return (
    <div className="main-empp84">
      <ToastContainer />
      {/* <DealersNavbar /> */}
      <form className="addproduct1284" autoComplete="off">
        <h5 className="heading23484">{editMode ? 'Edit Category' : 'Add Category'}</h5>
        <div className="product-formgroup1284">
          <label className="plabel1284">Category Name</label>
          <select
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            className="pinput1284"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="product-formgroup1284">
          <label className="plabel1284">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="pinput1284"
            placeholder="Enter Company Name"
          />
           {errors.company && (
            <div className="error-message">{errors.company}</div>
          )}
        </div>

        <div className="product-formgroup1284">
          <label className="plabel1284">Product Name</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
            className="pinput1284"
            placeholder="Enter Product Name"
          />
            {errors.productName && (
            <div className="error-message">{errors.productName}</div>
          )}
        </div>

        <div className="product-formgroup1284">
          <label className="plabel1284">Product Description</label> {/* New field */}
          <textarea
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            required
            className="pinput1284"
            placeholder="Enter Product Description"
          />
        </div>

        <div className="product-formgroup1284">
          <label className="plabel1284">Quantity</label> {/* New field */}
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="pinput1284"
            placeholder="Enter Quantity"
          />
        </div>

        <div className="product-formgroup1284">
          <label className="plabel1284">Unit</label> {/* New select field */}
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="pinput1284"
            required
          >
            <option value="ml">ml</option>
            <option value="kg">kg</option>
            <option value="gram">gram</option>
          </select>
        </div>

        <div className="btn-group52">
          <button className="btn btn-primary width3" onClick={handleSave}>
            {editMode ? 'Save Changes' : '+ Add'}
          </button>
          <button type="button" className="btn btn-danger width3" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDealerCategory;
