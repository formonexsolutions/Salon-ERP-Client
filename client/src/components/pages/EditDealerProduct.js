// import React, { useState, useEffect,useCallback } from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../Helper/helper';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const EditDealerProduct = ({ product, onCancel, onSave }) => {
//     const [formData, setFormData] = useState({
//         dealerProductId: '',
//         categoryName: '',
//         company: '',
//         productName: '',
//         productDescription: '',
//         quantity: '',
//         unit: '',
//         expiryDate: '',
//         sellingprice: '',
//         stock: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [categories, setCategories] = useState([]);
//     const [uniqueCompanies, setUniqueCompanies] = useState([]);
//     const [uniqueProducts, setUniqueProducts] = useState([]);
//     const [productDescriptions, setProductDescriptions] = useState([]);
//     const [quantityOptions, setQuantityOptions] = useState([]);
//     const [unitOptions, setUnitOptions] = useState([]);

//     useEffect(() => {
//         if (product) {
//             setFormData({
//                 dealerProductId: product.dealerProductId,
//                 categoryName: product.categoryName,
//                 company: product.company,
//                 productName: product.productName,
//                 productDescription: product.productDescription || '',
//                 quantity: product.quantity || '',
//                 unit: product.unit || '',
//                 expiryDate: new Date(product.expiryDate).toISOString().split('T')[0],
//                 sellingprice: product.sellingprice || '',
//                 stock: product.stock || ''
//             });
//         }
//     }, [product]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const dealerId = localStorage.getItem('dealerId');
//                 if (!dealerId) {
//                     toast.error('Dealer ID is not found in local storage');
//                     return;
//                 }

//                 const categoriesResponse = await axios.get(`${BASE_URL}/api/customcategory/${dealerId}`);
//                 setCategories(categoriesResponse.data);

//                 if (product) {
//                     await fetchCompanies(product.categoryName);
//                     await fetchProducts(product.categoryName, product.company);
//                     await fetchProductDescriptions(product.productName);
//                     await fetchQuantityAndUnit(product.productDescription);
//                 }
//             } catch (error) {
//                 console.error('Error fetching initial data:', error);
//                 toast.error('Error fetching initial data');
//             }
//         };

//         fetchData();
//     }, [product,fetchQuantityAndUnit,fetchProductDescriptions,fetchProducts,fetchCompanies]);

    
//     const handleChange = (event) => {
//         const { name, value } = event.target;
//         setFormData(prevState => ({
//             ...prevState,
//             [name]: value
//         }));

//         if (name === 'categoryName') {
//             fetchCompanies(value);
//         } else if (name === 'company') {
//             fetchProducts(formData.categoryName, value);
//         } else if (name === 'productName') {
//             fetchProductDescriptions(value);
//         } else if (name === 'productDescription') {
//             fetchQuantityAndUnit(value);
//         }
//     };

//     const fetchCompanies = useCallback(async (categoryName) => {
//         try {
//             const dealerId = localStorage.getItem('dealerId');
//             if (!dealerId) {
//                 toast.error('Dealer ID is not found in local storage');
//                 return;
//             }

//             const response = await axios.get(`${BASE_URL}/api/dealercompanies/${dealerId}/${encodeURIComponent(categoryName)}`);
//             setUniqueCompanies(response.data);
//         } catch (error) {
//             console.error('Error fetching companies:', error);
//             toast.error('Error fetching companies');
//         }
//     }, [formData]);

//     const fetchProducts = useCallback(async (categoryName, company) => {
//         try {
//             const dealerId = localStorage.getItem('dealerId');
//             if (!dealerId) {
//                 toast.error('Dealer ID is not found in local storage');
//                 return;
//             }

//             const response = await axios.get(`${BASE_URL}/api/dealerproducts/${dealerId}/${encodeURIComponent(categoryName)}/${encodeURIComponent(company)}`);
//             setUniqueProducts(response.data);
//         } catch (error) {
//             console.error('Error fetching products:', error);
//             toast.error('Error fetching products');
//         }
//     }, []);

//     const fetchProductDescriptions = useCallback(async (productName) => {
//         try {
//             const dealerId = localStorage.getItem('dealerId');
//             const { categoryName, company } = formData;

//             if (!dealerId || !categoryName || !company || !productName) {
//                 return; // Do not fetch if required data is missing
//             }

//             const response = await axios.get(`${BASE_URL}/api/productdescriptions/${dealerId}/${encodeURIComponent(categoryName)}/${encodeURIComponent(company)}/${encodeURIComponent(productName)}`);
//             const descriptions = response.data;

//             const uniqueDescriptions = Array.from(new Set(descriptions)).map(description => ({
//                 productDescription: description
//             }));

//             setProductDescriptions(uniqueDescriptions);
//         } catch (error) {
//             console.error('Error fetching product descriptions:', error);
//             toast.error('Error fetching product descriptions');
//         }
//     }, [formData]);

//     const fetchQuantityAndUnit =useCallback( async (productDescription) => {
//         try {
//             const dealerId = localStorage.getItem('dealerId');
//             const { categoryName, company, productName } = formData;

//             if (!dealerId || !categoryName || !company || !productName || !productDescription) {
//                 return; // Do not fetch if required data is missing
//             }

//             const url = `${BASE_URL}/api/quantity-unit/${dealerId}/${encodeURIComponent(categoryName)}/${encodeURIComponent(company)}/${encodeURIComponent(productName)}/${encodeURIComponent(productDescription)}`;
//             const response = await axios.get(url);

//             if (response.status === 200) {
//                 const { quantities, units } = response.data;

//                 if (Array.isArray(quantities) && Array.isArray(units)) {
//                     setQuantityOptions(quantities);
//                     setUnitOptions(units);
//                 } else {
//                     toast.error('Unexpected response structure');
//                 }
//             } else {
//                 toast.error('Product details not found');
//             }
//         } catch (error) {
//             console.error('Error fetching quantity and unit:', error);
//             toast.error('Error fetching quantity and unit');
//         }
//     }, [formData]);
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//           const { dealerProductId, categoryName, company, productName, productDescription, expiryDate, sellingprice, stock } = formData;
      
//           // Ensure all required fields are populated
//           if (!dealerProductId || !categoryName || !company || !productName || !productDescription || !expiryDate || !sellingprice || !stock) {
//             toast.error('All fields are required');
//             return;
//           }
      
//           // Update the product with the dealerProductId
//           await axios.put(`${BASE_URL}/api/dealerinventory/${dealerProductId}`, {
//             categoryName,
//             company,
//             productName,
//             productDescription,
//             expiryDate,
//             sellingprice,
//             stock
//           });
      
//           toast.success('Product updated successfully');
//           onSave(formData); // Notify parent component about the update
//         } catch (err) {
//           console.error('Error updating product:', err);
//           toast.error('Error updating product');
//         } finally {
//           setLoading(false);
//         }
//       };      

//     return (
//         <div className="main-empp">
//             <ToastContainer />
//             <form className="addproduct12" onSubmit={handleSubmit}>
//                 <h5 className="heading234">Edit Product</h5>
//                 <div className="product-formgroup12">
//                     <label className="plabel12">Product ID</label>
//                     <input
//                         type="text"
//                         name="dealerProductId"
//                         value={formData.dealerProductId}
//                         onChange={handleChange}
//                         disabled
//                         className="pinput12"
//                     />
//                 </div>
//                 <div className="product-formgroup12">
//                     <label className="plabel12">Category Name</label>
//                     <select
//                         name="categoryName"
//                         value={formData.categoryName}
//                         onChange={handleChange}
//                         required
//                         className="pinput12"
//                     >
//                         <option value="">Select Category</option>
//                         {categories.map((category, index) => (
//                             <option key={index} value={category.categoryName}>{category.categoryName}</option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="product-formgroup12">
//                     <label className="plabel12">Company Name</label>
//                     <select
//                         name="company"
//                         value={formData.company}
//                         onChange={handleChange}
//                         required
//                         className="pinput12"
//                     >
//                         <option value="">Select Company</option>
//                         {uniqueCompanies.map((company, index) => (
//                             <option key={index} value={company.company}>{company.company}</option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="product-formgroup12">
//                     <label className="plabel12">Product Name</label>
//                     <select
//                         name="productName"
//                         value={formData.productName}
//                         onChange={handleChange}
//                         required
//                         className="pinput12"
//                     >
//                         <option value="">Select Product Name</option>
//                         {uniqueProducts.map((product, index) => (
//                             <option key={index} value={product.productName}>{product.productName}</option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="product-formgroup12">
//                     <label className="plabel12">Product Description</label>
//                     <select
//                         name="productDescription"
//                         value={formData.productDescription}
//                         onChange={handleChange}
//                         required
//                         className="pinput12"
//                     >
//                         <option value="">Select Product Description</option>
//                         {productDescriptions.map((description, index) => (
//                             <option key={index} value={description.productDescription}>{description.productDescription}</option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="product-formgroup12">
//                     <label className="plabel12">Quantity</label>
//                     <select
//                         name="quantity"
//                         value={formData.quantity}
//                         onChange={handleChange}
//                         required
//                         className="pinput12"
//                     >
//                         <option value="">Select Quantity</option>
//                         {quantityOptions.map((quantity, index) => (
//                             <option key={index} value={quantity}>{quantity}</option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="product-formgroup12">
//                     <label className="plabel12">Unit</label>
//                     <select
//                         name="unit"
//                         value={formData.unit}
//                         onChange={handleChange}
//                         required
//                         className="pinput12"
//                     >
//                         <option value="">Select Unit</option>
//                         {unitOptions.map((unit, index) => (
//                             <option key={index} value={unit}>{unit}</option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="product-formgroup12">
//                     <label className="plabel12">Expiry Date</label>
//                     <input
//                         type="date"
//                         name="expiryDate"
//                         value={formData.expiryDate}
//                         onChange={handleChange}
//                         required
//                         className="pinput12"
//                     />
//                 </div>
//                 <div className="product-formgroup12">
//                     <label className="plabel12">Selling Price</label>
//                     <input
//                         type="number"
//                         name="sellingprice"
//                         value={formData.sellingprice}
//                         onChange={handleChange}
//                         required
//                         className="pinput12"
//                     />
//                 </div>
//                 <div className="product-formgroup12">
//                     <label className="plabel12">Stock</label>
//                     <input
//                         type="number"
//                         name="stock"
//                         value={formData.stock}
//                         onChange={handleChange}
//                         required
//                         className="pinput12"
//                     />
//                 </div>
//                 <div className="product-buttons12">
//                     <button type="submit" className="pbtn12a" disabled={loading}>
//                         {loading ? 'Saving...' : 'Save'}
//                     </button>
//                     <button type="button" onClick={onCancel} className="pbtn12a">Cancel</button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default EditDealerProduct;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Helper/helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditDealerProduct = ({ product, onCancel, onSave }) => {
    const [formData, setFormData] = useState({
        dealerProductId: '',
        categoryName: '',
        company: '',
        productName: '',
        productDescription: '',
        quantity: '',
        unit: '',
        expiryDate: '',
        sellingprice: '',
        stock: ''
    });
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [uniqueCompanies, setUniqueCompanies] = useState([]);
    const [uniqueProducts, setUniqueProducts] = useState([]);
    const [productDescriptions, setProductDescriptions] = useState([]);
    const [quantityOptions, setQuantityOptions] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);

    useEffect(() => {
        if (product) {
            setFormData({
                dealerProductId: product.dealerProductId,
                categoryName: product.categoryName,
                company: product.company,
                productName: product.productName,
                productDescription: product.productDescription || '',
                quantity: product.quantity || '',
                unit: product.unit || '',
                expiryDate: new Date(product.expiryDate).toISOString().split('T')[0],
                sellingprice: product.sellingprice || '',
                stock: product.stock || ''
            });
        }
    }, [product]);

    const fetchCompanies = useCallback(async (categoryName) => {
        try {
            const dealerId = localStorage.getItem('dealerId');
            if (!dealerId) {
                toast.error('Dealer ID is not found in local storage');
                return;
            }

            const response = await axios.get(`${BASE_URL}/api/dealercompanies/${dealerId}/${encodeURIComponent(categoryName)}`);
            setUniqueCompanies(response.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
            toast.error('Error fetching companies');
        }
    }, []);

    const fetchProducts = useCallback(async (categoryName, company) => {
        try {
            const dealerId = localStorage.getItem('dealerId');
            if (!dealerId) {
                toast.error('Dealer ID is not found in local storage');
                return;
            }

            const response = await axios.get(`${BASE_URL}/api/dealerproducts/${dealerId}/${encodeURIComponent(categoryName)}/${encodeURIComponent(company)}`);
            setUniqueProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Error fetching products');
        }
    }, []);

    const fetchProductDescriptions = useCallback(async (productName) => {
        try {
            const dealerId = localStorage.getItem('dealerId');
            const { categoryName, company } = formData;

            if (!dealerId || !categoryName || !company || !productName) {
                return; // Do not fetch if required data is missing
            }

            const response = await axios.get(`${BASE_URL}/api/productdescriptions/${dealerId}/${encodeURIComponent(categoryName)}/${encodeURIComponent(company)}/${encodeURIComponent(productName)}`);
            const descriptions = response.data;

            const uniqueDescriptions = Array.from(new Set(descriptions)).map(description => ({
                productDescription: description
            }));

            setProductDescriptions(uniqueDescriptions);
        } catch (error) {
            console.error('Error fetching product descriptions:', error);
            toast.error('Error fetching product descriptions');
        }
    }, [formData]);

    const fetchQuantityAndUnit = useCallback(async (productDescription) => {
        try {
            const dealerId = localStorage.getItem('dealerId');
            const { categoryName, company, productName } = formData;

            if (!dealerId || !categoryName || !company || !productName || !productDescription) {
                return; // Do not fetch if required data is missing
            }

            const url = `${BASE_URL}/api/quantity-unit/${dealerId}/${encodeURIComponent(categoryName)}/${encodeURIComponent(company)}/${encodeURIComponent(productName)}/${encodeURIComponent(productDescription)}`;
            const response = await axios.get(url);

            if (response.status === 200) {
                const { quantities, units } = response.data;

                if (Array.isArray(quantities) && Array.isArray(units)) {
                    setQuantityOptions(quantities);
                    setUnitOptions(units);
                } else {
                    toast.error('Unexpected response structure');
                }
            } else {
                toast.error('Product details not found');
            }
        } catch (error) {
            console.error('Error fetching quantity and unit:', error);
            toast.error('Error fetching quantity and unit');
        }
    }, [formData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dealerId = localStorage.getItem('dealerId');
                if (!dealerId) {
                    toast.error('Dealer ID is not found in local storage');
                    return;
                }

                const categoriesResponse = await axios.get(`${BASE_URL}/api/customcategory/${dealerId}`);
                setCategories(categoriesResponse.data);

                if (product) {
                    await fetchCompanies(product.categoryName);
                    await fetchProducts(product.categoryName, product.company);
                    await fetchProductDescriptions(product.productName);
                    await fetchQuantityAndUnit(product.productDescription);
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
                toast.error('Error fetching initial data');
            }
        };

        fetchData();
    }, [product, fetchCompanies, fetchProducts, fetchProductDescriptions, fetchQuantityAndUnit]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'categoryName') {
            fetchCompanies(value);
        } else if (name === 'company') {
            fetchProducts(formData.categoryName, value);
        } else if (name === 'productName') {
            fetchProductDescriptions(value);
        } else if (name === 'productDescription') {
            fetchQuantityAndUnit(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const { dealerProductId, categoryName, company, productName, productDescription, expiryDate, sellingprice, stock } = formData;
      
          // Ensure all required fields are populated
          if (!dealerProductId || !categoryName || !company || !productName || !productDescription || !expiryDate || !sellingprice || !stock) {
            toast.error('All fields are required');
            return;
          }
      
          // Update the product with the dealerProductId
          await axios.put(`${BASE_URL}/api/dealerinventory/${dealerProductId}`, {
            categoryName,
            company,
            productName,
            productDescription,
            expiryDate,
            sellingprice,
            stock
          });
      
          toast.success('Product updated successfully');
          onSave(formData); // Notify parent component about the update
        } catch (err) {
          console.error('Error updating product:', err);
          toast.error('Error updating product');
        } finally {
          setLoading(false);
        }
      };      

    return (
        <div className="main-empp">
            <ToastContainer />
            <form className="addproduct12" onSubmit={handleSubmit}>
                <h5 className="heading234">Edit Product</h5>
                <div className="product-formgroup12">
                    <label className="plabel12">Product ID</label>
                    <input
                        type="text"
                        name="dealerProductId"
                        value={formData.dealerProductId}
                        onChange={handleChange}
                        disabled
                        className="pinput12"
                    />
                </div>
                <div className="product-formgroup12">
                    <label className="plabel12">Category Name</label>
                    <select
                        name="categoryName"
                        value={formData.categoryName}
                        onChange={handleChange}
                        required
                        className="pinput12"
                    >
                        <option value="">Select Category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category.categoryName}>{category.categoryName}</option>
                        ))}
                    </select>
                </div>
                <div className="product-formgroup12">
                    <label className="plabel12">Company Name</label>
                    <select
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="pinput12"
                    >
                        <option value="">Select Company</option>
                        {uniqueCompanies.map((company, index) => (
                            <option key={index} value={company.company}>{company.company}</option>
                        ))}
                    </select>
                </div>
                <div className="product-formgroup12">
                    <label className="plabel12">Product Name</label>
                    <select
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        required
                        className="pinput12"
                    >
                        <option value="">Select Product</option>
                        {uniqueProducts.map((product, index) => (
                            <option key={index} value={product.productName}>{product.productName}</option>
                        ))}
                    </select>
                </div>
                <div className="product-formgroup12">
                    <label className="plabel12">Product Description</label>
                    <select
                        name="productDescription"
                        value={formData.productDescription}
                        onChange={handleChange}
                        required
                        className="pinput12"
                    >
                        <option value="">Select Description</option>
                        {productDescriptions.map((description, index) => (
                            <option key={index} value={description.productDescription}>{description.productDescription}</option>
                        ))}
                    </select>
                </div>
                <div className="product-formgroup12">
                    <label className="plabel12">Quantity</label>
                    <select
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        className="pinput12"
                    >
                        <option value="">Select Quantity</option>
                        {quantityOptions.map((quantity, index) => (
                            <option key={index} value={quantity}>{quantity}</option>
                        ))}
                    </select>
                </div>
                <div className="product-formgroup12">
                    <label className="plabel12">Unit</label>
                    <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        required
                        className="pinput12"
                    >
                        <option value="">Select Unit</option>
                        {unitOptions.map((unit, index) => (
                            <option key={index} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>
                <div className="product-formgroup12">
                    <label className="plabel12">Expiry Date</label>
                    <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        required
                        className="pinput12"
                    />
                </div>
                <div className="product-formgroup12">
                    <label className="plabel12">Selling Price</label>
                    <input
                        type="text"
                        name="sellingprice"
                        value={formData.sellingprice}
                        onChange={handleChange}
                        required
                        className="pinput12"
                    />
                </div>
                <div className="product-formgroup12">
                    <label className="plabel12">Stock</label>
                    <input
                        type="text"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        className="pinput12"
                    />
                </div>
                <div className="product-buttons12">
                    <button type="button" className="cancelbtn12" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="savebtn12" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditDealerProduct;
