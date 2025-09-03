
import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from "react-toastify";
import EditDealerProduct from "./EditDealerProduct";
import axios from "axios";
import { BASE_URL } from "../Helper/helper";
import { useNavigate } from "react-router";
import DealersNavbar from "./DealersNavbar";
import "../styles/DealerInventory.css";

const DealerInventory = () => {
    const [displayComponent, setDisplayComponent] = useState("ProductList");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [/*loading*/, setLoading] = useState(true);
    const [/*error*/, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const dealerId = localStorage.getItem('dealerId');
                if (!dealerId) {
                    toast.error('Distributor ID not found in local storage');
                    return;
                }

                const response = await axios.get(`${BASE_URL}/api/dealerinventory/${dealerId}`);
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Error fetching products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredProducts = products.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handleEdit = useCallback((index) => {
        setEditProduct(products[index]);
        setDisplayComponent("editProduct");
    }, [products]);

    const handleEditCancel = () => {
        setEditProduct(null);
        setDisplayComponent("ProductList");
    };

    const handleProductUpdate = (updatedProduct) => {
        setProducts(products.map(product => 
            product.dealerProductId === updatedProduct.dealerProductId ? updatedProduct : product
        ));
        setEditProduct(null);
        setDisplayComponent("ProductList");
    };

    const handleClick = () => navigate('/Adddealerproduct');

    return (
        <div>
            <DealersNavbar />
            <div className="pd-container12">
                <ToastContainer />
                {displayComponent === "ProductList" ? (
                    <>
                        <h5 className="heading234">Product Details</h5>
                        <div className="space209">
                            <button className="pdadd-btn12" onClick={handleClick}>
                                + New Product
                            </button>

                            <div className="pd-search12">
                                <div className="select-number-of-entries">
                                    <label className="show11">Show </label>
                                    <select
                                        className="input1"
                                        value={itemsPerPage}
                                        onChange={handleItemsPerPageChange}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                    </select>
                                </div>
                                <div className="A7serinp">
                                    <label className="show11"> Search &nbsp;</label>
                                    <input
                                        type="search"
                                        className="border-change890"
                                        placeholder="By Product Name"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                    />
                                </div>
                            </div>
                            <div className="tble-overflow12">
                                <table className="pd-table12">
                                    <thead className="thead87">
                                        <tr>
                                            <th className="pd-th12">Product ID</th>
                                            <th className="pd-th12">Category Name</th>
                                            <th className="pd-th12">Company Name</th>
                                            <th className="pd-th12">Product Name</th>
                                            <th className="pd-th12">Description</th>
                                            <th className="pd-th12">Quantity</th>
                                            <th className="pd-th12">Unit</th>
                                            <th className="pd-th12">Expiry Date</th>
                                            <th className="pd-th12">Selling Price</th>
                                            <th className="pd-th12">Stock</th>
                                            <th className="pd-th12">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="thead87">
                                        {currentItems.map((product, index) => (
                                            <tr key={product.dealerProductId}>
                                                <td className="pd-td123">{product.dealerProductId}</td>
                                                <td className="pd-td123">{product.categoryName}</td>
                                                <td className="pd-td123">{product.company}</td>
                                                <td className="pd-td123">{product.productName}</td>
                                                <td className="pd-td123">{product.productDescription}</td>
                                                <td className="pd-td123">{product.quantity}</td>
                                                <td className="pd-td123">{product.unit}</td>
                                                <td className="pd-td123">{new Date(product.expiryDate).toLocaleDateString()}</td>
                                                <td className="pd-td123">{product.sellingprice}</td>
                                                <td className="pd-td123">{product.stock}</td>
                                                <td className="pd-td123">
                                                    <button
                                                        className="book-text"
                                                        onClick={() => handleEdit(index)}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="entries-div121">
                                <div>
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} entries
                                </div>
                                <div>
                                    <button
                                        className="badges"
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                    >
                                        First
                                    </button>
                                    <button
                                        className="badges"
                                        onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            className={`badges ${currentPage === pageNumber ? 'active' : ''}`}
                                            onClick={() => setCurrentPage(pageNumber)}
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}
                                    <button
                                        className="badges"
                                        onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                    <button
                                        className="badges"
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Last
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <EditDealerProduct
                        product={editProduct}
                        onCancel={handleEditCancel}
                        onSave={handleProductUpdate}
                    />
                )}
            </div>
        </div>
    );
};

export default DealerInventory;