import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Helper/helper";

const AddDealerProduct = ({  productData = {}, editMode = false, onClose }) => {
  const [formData, setFormData] = useState({
    expiryDate: "",
    sellingprice: "",
    stock: "",
    categoryName: "",
    company: "",
    productName: "",
    productDescription: "",
    quantity: "",
    unit: "",
  });
  const [categories, setCategories] = useState([]);
  const [uniqueCompanies, setUniqueCompanies] = useState([]);
  const [uniqueProducts, setUniqueProducts] = useState([]);
  const [productDescriptions, setProductDescriptions] = useState([]);
  const [quantityOptions, setQuantityOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  useEffect(() => {
    if (editMode) {
      setFormData({
        ...formData,
        expiryDate: productData.expiryDate || "",
        sellingprice: productData.sellingprice || "",
        stock: productData.stock || "",
        categoryName: productData.categoryName || "",
        company: productData.company || "",
        productName: productData.productName || "",
        productDescription: productData.productDescription || "",
        quantity: productData.quantity || "",
        unit: productData.unit || "",
      });
    }
  }, [editMode, productData, formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === "categoryName") {
      fetchCompanies(value);
    } else if (name === "company") {
      fetchProducts(formData.categoryName, value);
    } else if (name === "productName") {
      fetchProductDescriptions(value);
    } else if (name === "productDescription") {
      fetchQuantityAndUnit(value);
    }
  };

  const fetchQuantityAndUnit = async (productDescription) => {
    try {
      const dealerId = localStorage.getItem("dealerId");
      const { categoryName, company, productName } = formData;

      if (
        !dealerId ||
        !categoryName ||
        !company ||
        !productName ||
        !productDescription
      ) {
        toast.error("Missing required data");
        return;
      }

      const url = `${BASE_URL}/api/quantity-unit/${dealerId}/${encodeURIComponent(
        categoryName
      )}/${encodeURIComponent(company)}/${encodeURIComponent(
        productName
      )}/${encodeURIComponent(productDescription)}`;

      const response = await axios.get(url);

      if (response.status === 200) {
        const { quantities, units } = response.data;

        if (Array.isArray(quantities) && Array.isArray(units)) {
          setQuantityOptions(quantities);
          setUnitOptions(units);
        } else {
          toast.error("Unexpected response structure");
        }
      } else {
        toast.error("Product details not found");
      }
    } catch (error) {
      console.error("Error fetching quantity and unit:", error);
      toast.error("Error fetching quantity and unit");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const dealerId = localStorage.getItem("dealerId");
        if (!dealerId) {
          toast.error("Distributor ID is not found in local storage");
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

  const fetchCompanies = async (categoryName) => {
    try {
      const dealerId = localStorage.getItem("dealerId");
      if (!dealerId) {
        toast.error("Distributor ID is not found in local storage");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/dealercompanies/${dealerId}/${encodeURIComponent(
          categoryName
        )}`
      );
      const companies = response.data;

      const uniqueCompanies = Array.from(
        new Set(companies.map((company) => company.company))
      ).map((name) => companies.find((company) => company.company === name));

      setUniqueCompanies(uniqueCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Error fetching companies");
    }
  };

  const fetchProducts = async (categoryName, company) => {
    try {
      const dealerId = localStorage.getItem("dealerId");
      if (!dealerId) {
        toast.error("Distributor ID is not found in local storage");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/dealerproducts/${dealerId}/${encodeURIComponent(
          categoryName
        )}/${encodeURIComponent(company)}`
      );
      const products = response.data;

      const uniqueProducts = Array.from(
        new Set(products.map((product) => product.productName))
      ).map((name) => products.find((product) => product.productName === name));

      setUniqueProducts(uniqueProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products");
    }
  };

  const fetchProductDescriptions = async (productName) => {
    try {
      const dealerId = localStorage.getItem("dealerId");
      const categoryName = formData.categoryName;
      const company = formData.company;

      if (!dealerId || !categoryName || !company || !productName) {
        toast.error("Missing required data");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/productdescriptions/${dealerId}/${encodeURIComponent(
          categoryName
        )}/${encodeURIComponent(company)}/${encodeURIComponent(productName)}`
      );
      const descriptions = response.data;

      const uniqueDescriptions = Array.from(new Set(descriptions)).map(
        (description) => ({
          productDescription: description,
        })
      );

      setProductDescriptions(uniqueDescriptions);
    } catch (error) {
      console.error("Error fetching product descriptions:", error);
      toast.error("Error fetching product descriptions");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      !formData.expiryDate ||
      !formData.sellingprice ||
      !formData.stock ||
      !formData.categoryName ||
      !formData.company ||
      !formData.productName
    ) {
      toast.error("Please fill in all the required fields");
      return;
    }

    try {
      const dealerId = localStorage.getItem("dealerId");
      if (!dealerId) {
        toast.error("Distributor ID is not found in local storage");
        return;
      }

      const requestData = {
        ...formData,
        dealer_id: dealerId,
      };

      if (editMode) {
        await axios.put(
          `${BASE_URL}/api/dealerproducts/${productData._id}`,
          requestData
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post(`${BASE_URL}/api/dealerinventory`, requestData);
        toast.success("Product added successfully");
      }

      setFormData({
        expiryDate: "",
        sellingprice: "",
        stock: "",
        categoryName: "",
        company: "",
        productName: "",
        productDescription: "",
        quantity: "",
        unit: "",
      });

      onClose(); // Close the popup after saving
    } catch (error) {
      console.error("Error while saving product", error);
      toast.error("Error while saving product");
    }
  };

  const handleCancel = () => {
    onClose(); // Close the popup when cancel is clicked
  };

  return (
    <div className="main-empp84">
      <div>
        <form className="addproduct1284" onSubmit={handleSave}>
          <h5 className="heading23484">Add Product</h5>
          <div className="product-formgroup1284">
            <label className="plabel1284">Category</label>
            <select
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              required
              className="pinput1284"
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="product-formgroup1284">
            <label className="plabel1284">Company</label>
            <select
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="pinput1284"
            >
              <option value="">Select Company</option>
              {uniqueCompanies.map((company, index) => (
                <option key={index} value={company.company}>
                  {company.company}
                </option>
              ))}
            </select>
          </div>

          <div className="product-formgroup1284">
            <label className="plabel1284">Product Name</label>
            <select
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              className="pinput1284"
            >
              <option value="">Select Product</option>
              {uniqueProducts.map((product, index) => (
                <option key={index} value={product.productName}>
                  {product.productName}
                </option>
              ))}
            </select>
          </div>

          <div className="product-formgroup1284">
            <label className="plabel1284">Product Description</label>
            <select
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              required
              className="pinput1284"
            >
              <option value="">Select Description</option>
              {productDescriptions.map((description, index) => (
                <option key={index} value={description.productDescription}>
                  {description.productDescription}
                </option>
              ))}
            </select>
          </div>

          <div className="product-formgroup1284">
            <label className="plabel1284">Quantity</label>
            <select
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="pinput1284"
            >
              <option value="">Select Quantity</option>
              {quantityOptions.map((quantity, index) => (
                <option key={index} value={quantity}>
                  {quantity}
                </option>
              ))}
            </select>
          </div>

          <div className="product-formgroup1284">
            <label className="plabel1284">Unit</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              className="pinput1284"
            >
              <option value="">Select Unit</option>
              {unitOptions.map((unit, index) => (
                <option key={index} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          <div className="product-formgroup1284">
            <label className="plabel1284">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              className="pinput1284"
            />
          </div>

          <div className="product-formgroup1284">
            <label className="plabel1284">Selling Price</label>
            <input
              type="text"
              name="sellingprice"
              value={formData.sellingprice}
              onChange={handleChange}
              required
              className="pinput1284"
              placeholder="Enter Selling Price"
            />
          </div>

          <div className="product-formgroup1284">
            <label className="plabel1284">Stock</label>
            <input
              type="text"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="pinput1284"
              placeholder="Enter Stock"
            />
          </div>

          <div className="btn-group52">
            <button type="submit" className="btn btn-primary width3">
              Save
            </button>
            <button
              type="button"
              className="btn btn-danger width3"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddDealerProduct;
