import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../Helper/helper';
import "../styles/AddCustomCategory.css";

const AddCustomCategory = ({ onClose }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Validate input
        if (!categoryName) {
            toast.error('Category name is required');
            return;
        }
    
        try {
            const dealerId = localStorage.getItem('dealerId');
            if (!dealerId) {
                toast.error('Distributor ID is not found in local storage');
                return;
            }
    
            const requestData = {
                dealer_id: dealerId,
                categoryName,
            };
    
            await axios.put(`${BASE_URL}/api/customcategory`, requestData);
            toast.success('Category added successfully');
            setCategoryName('');
            onClose(); // Close the popup after success
    
        } catch (error) {
            console.error('Error while adding or updating category:', error);
            toast.error('Error while adding or updating category');
        }
    };

    const handleCancel = () => {
        onClose(); // Close the popup on cancel
    };

    return (
        <div className="main-empp84">
            <ToastContainer />
            <form className="addproduct284" onSubmit={handleSubmit} autoComplete="off">
                <h5 className="heading23484">Create Custom Category</h5>
                <div className="product-formgroup1284 ghgh67">
                    <label className="plabel284">Category Name </label>
                    <input
                        type="text"
                        name="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="pinput1284 width86"
                        placeholder="Enter Category Name"
                        required
                    />
                </div>
                <div className="product-buttons1284">
                    <button className="pbtn12a84" type="submit">+ Add</button>
                    <button className="pbtn12a84" type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddCustomCategory;
