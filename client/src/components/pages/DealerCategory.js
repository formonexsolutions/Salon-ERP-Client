import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../Helper/helper";
import { useNavigate } from "react-router";
import DealersNavbar from "./DealersNavbar";
import EditDealerCategory from "./EditDealerCategory";
import Modal from "react-modal";
import AddDealerProduct from "../pages/AddDealerCategory";
import AddCustomCategory from "../pages/AddCustomCategory";
import "../styles/DealerCategory.css";

// Set the app element for accessibility
Modal.setAppElement("#root");

const DealerCategory = () => {
  const [displayComponent, /*setDisplayComponent*/] = useState("CategoryList");
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showEditCategoryPopup, setShowEditCategoryPopup] = useState(false);

  const handleOpenEditCategoryPopup = (category) => {
    setEditingCategory(category);
    setShowEditCategoryPopup(true);
  };

  const handleCloseEditCategoryPopup = () => {
    setEditingCategory(null);
    setShowEditCategoryPopup(false);
  };


  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const dealerId = localStorage.getItem("dealerId");
        if (!dealerId) {
          toast.error("Distributor ID is not found in local storage");
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/dealercategories`);
        const filteredCategories = response.data.filter(
          (category) => category.dealer_id === dealerId
        );
        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryFilterChange = (filter) => {
    setCategoryFilter(filter);
    setCurrentPage(1);
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearchQuery =
      category.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.productName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategoryFilter = categoryFilter
      ? category.categoryName === categoryFilter
      : true;

    return matchesSearchQuery && matchesCategoryFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handleFirstPageClick = () => setCurrentPage(1);
  const handleLastPageClick = () => setCurrentPage(totalPages);
  const handlePreviousPageClick = () =>
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  const handleNextPageClick = () =>
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));

  const getDisplayedPages = () => {
    const totalDisplayPages = 3;
    const pages = [];
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 0 && i <= totalPages) {
        pages.push(i);
      }
      if (pages.length >= totalDisplayPages) {
        break;
      }
    }
    return pages;
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // const handleEditClick = (category) => {
  //   setEditingCategory(category);
  //   setDisplayComponent('EditCategory');
  //   setModalIsOpen(true); // Open the modal
  // };

  // const handleCancelEdit = () => {
  //   setEditingCategory(null);
  //   setModalIsOpen(false); // Close the modal
  // };

  // Extract unique category names for filtering buttons
  const uniqueCategories = Array.from(
    new Set(categories.map((category) => category.categoryName))
  );

  const handleAddProductClick = () => {
    setShowProductPopup(true);
  };

  const handleAddCategoryClick = () => {
    setShowCategoryPopup(true);
  };

  const handleClosePopup = () => {
    setShowProductPopup(false);
    setShowCategoryPopup(false);
  };

  return (
    <div className="dashboard-container-unique">
      <DealersNavbar />
      <div className="flex786">
        <button
          className="back-button-unique"
          onClick={() => navigate("/Dealerdashboard")}
        >
          Back to Dashboard
        </button>
      </div>
      <div className="pd-container123">
        <ToastContainer />

        {displayComponent === "CategoryList" && (
          <>
            <h2 className="salon-name-unique">Category Details</h2>
            <div className="space2093">
              <div>
                <button onClick={handleAddProductClick} className="btn976">+ Add Product</button>
                &nbsp;&nbsp;
                <button onClick={handleAddCategoryClick} className="btn976">+ Add Category</button>

                {/* Add Product Modal */}
                <Modal
                  isOpen={showProductPopup}
                  onRequestClose={handleClosePopup}
                  contentLabel="Add Product"
                  className="custom-modal445"
                  overlayClassName="custom-modal-overlay44"
                >
                  <AddDealerProduct onClose={handleClosePopup} />
                </Modal>

                {/* Add Category Modal */}
                <Modal
                  isOpen={showCategoryPopup}
                  onRequestClose={handleClosePopup}
                  contentLabel="Add Category"
                  className="custom-modal44"
                  overlayClassName="custom-modal-overlay44"
                >
                  <AddCustomCategory onClose={handleClosePopup} />
                </Modal>
              </div>

              <div className="category_diff33">
                <button
                  className="pdadd-btn156"
                  onClick={() => handleCategoryFilterChange("")}
                >
                  All
                </button>
                {uniqueCategories.map((categoryName) => (
                  <button
                    key={categoryName}
                    className="pdadd-btn156"
                    onClick={() => handleCategoryFilterChange(categoryName)}
                  >
                    {categoryName}
                  </button>
                ))}
              </div>
            </div>
            <div className="pd-search1244">
              <div className="select-number-of-entries">
                <label className="show11">Show </label>
                <select
                  className="input144"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>
              <div className="A7serinp44">
                <label className="show11"> Search </label>
                <input
                  type="search"
                  className="border-change89044"
                  placeholder="By Category, Company, or Product Name"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="tble-overflow128">
              <table className="pd-table1244">
                <thead className="thead7">
                  <tr>
                    <th className="pd-th1244">S.No</th>
                    <th className="pd-th1244">Category Name</th>
                    <th className="pd-th1244">Company Name</th>
                    <th className="pd-th1244">Product Name</th>
                    <th className="pd-th1244">Product Description</th>
                    <th className="pd-th1244">Product Quantity and Unit</th>
                    <th className="pd-th1244">Actions</th>
                  </tr>
                </thead>
                <tbody className="thead87">
                  {currentItems.map((category, index) => (
                    <tr key={category._id}>
                      <td className="customer-table11-td1">
                        {index + indexOfFirstItem + 1}
                      </td>
                      <td className="pd-td12344">{category.categoryName}</td>
                      <td className="pd-td12344">{category.company}</td>
                      <td className="pd-td12344">{category.productName}</td>
                      <td className="pd-td12344">
                        {category.productDescription}
                      </td>
                      <td className="pd-td12344">
                        {category.quantity} {category.unit}
                      </td>
                      <td className="pd-td12344">
                        <button
                          className="book-text44"
                          onClick={() => handleOpenEditCategoryPopup(category)}
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
              <div className="color54">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredCategories.length)} of{" "}
                {filteredCategories.length} entries
              </div>
              <div>
                <button
                  className="badges44"
                  onClick={handleFirstPageClick}
                  disabled={currentPage === 1}
                >
                  First
                </button>
                <button
                  className="badges44"
                  onClick={handlePreviousPageClick}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {getDisplayedPages().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className={`badges44 ${currentPage === pageNumber ? "active44" : ""
                      }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  className="badges44"
                  onClick={handleNextPageClick}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
                <button
                  className="badges44"
                  onClick={handleLastPageClick}
                  disabled={currentPage === totalPages}
                >
                  Last
                </button>
              </div>
            </div>
          </>
        )}
        {/* Edit Category Modal */}
        <Modal
          isOpen={showEditCategoryPopup}
          onRequestClose={handleCloseEditCategoryPopup}
          contentLabel="Edit Category"
          className="custom-modal445"
          overlayClassName="custom-modal-overlay44"
        >
          {editingCategory && (
            <EditDealerCategory
              category={editingCategory}
              onCancelEdit={handleCloseEditCategoryPopup}
            />
          )}
        </Modal>

      </div>
    </div>
  );
};

export default DealerCategory;
