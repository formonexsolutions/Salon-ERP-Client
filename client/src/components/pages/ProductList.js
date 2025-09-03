import React, { useState, useEffect } from "react";
import "../styles/ProductList.css";
import axios from "axios";
import EditProduct from "./EditProduct";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BASE_URL } from "../Helper/helper";

const ProductList = ({ onNewProductClick }) => {
  const [productList, setProductList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [displayComponent, setDisplayComponent] = useState("ProductList");
  const [offers, setOffers] = useState([]);
  const loggedInUser =
    localStorage.getItem("adminName") || localStorage.getItem("employeeName");
  // const salonId = localStorage.getItem("salon_id");

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/offers`);
      setOffers(response.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const handleInterest = (isInterested, offerId, productName) => {
    if (!isInterested) return;
  
    const name = localStorage.getItem("adminName") || localStorage.getItem("employeeName");
    const phoneNumber = localStorage.getItem("phoneNumber");
  
    const data = {
      name,
      phoneNumber,
      offerId,
      productName, // Ensure this is correctly set
      isInterested: "yes",
    };
  
    axios
      .post(`${BASE_URL}/api/interest`, data)
      .then((response) => {
        console.log("Interest data posted successfully:", response.data);
        toast.success("Thank You For Showing Interest We Will Contact Soon");
      })
      .catch((error) => {
        console.error("Error posting interest data:", error);
        toast.error("Thank You, We Will come with Other offers Soon");
      });
  };
  


  const settings = {
    dots: false,
    infinite: true,
    speed: 2500,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    centerMode: true,
    focusOnSelect: true,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const salonId = localStorage.getItem("salon_id");
      const response = await axios.get(`${BASE_URL}/api/Products`, {
        params: { salon_id: salonId }, // Pass salon_id as a query parameter
      });
      const responseData = response.data.reverse();
      setProductList(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  fetchProducts();
}, []);


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = productList.filter((product) =>
    product.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (index) => {
    const confirmToastId = toast(
      <div>
        <p>Are you sure you want to edit this product?</p>
        <button
          className="confirm-btn confirm-yes"
          onClick={() => {
            handleEditConfirmed(confirmToastId, index);
          }}
        >
          Yes
        </button>
        <button
          className="confirm-btn confirm-no"
          onClick={() => {
            handleCancelEdit(confirmToastId);
          }}
        >
          No
        </button>
      </div>,
      {
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
      }
    );
  };

  const handleEditConfirmed = (toastId, index) => {
    toast.dismiss(toastId);
    setEditIndex(index);
    setDisplayComponent("editProduct");
  };

  const handleCancelEdit = (toastId) => {
    toast.dismiss(toastId);
    toast.info("Edit cancelled!");
  };
  const handleClick = () => {
    onNewProductClick();
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setDisplayComponent("ProductList");
  };

  const handleEditSave = async (editedData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/Products/${editedData._id}`,
        { ...editedData, username: loggedInUser }
      );

      if (response.status === 200) {
        const updatedProductList = [...productList];
        updatedProductList[editIndex] = editedData;
        setProductList(updatedProductList);
        setEditIndex(null);
        toast.success("Product updated successfully!");
        setDisplayComponent("ProductList");
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product. Please try again.");
    }
  };

  const handleToggleStatus = (productId, currentStatus) => {
    const confirmToastId = toast(
      <div>
        <p>
          Are you sure you want to{" "}
          {currentStatus === "AA" ? "deactivate" : "activate"} this product?
        </p>
        <button
          className="confirm-btn confirm-yes"
          onClick={() => {
            handleToggleStatusConfirmed(
              confirmToastId,
              productId,
              currentStatus
            );
          }}
        >
          Yes
        </button>
        <button
          className="confirm-btn confirm-no"
          onClick={() => {
            handleCancelStatus(confirmToastId);
          }}
        >
          No
        </button>
      </div>,
      {
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
      }
    );
  };
  const handleCancelStatus = (toastId) => {
    toast.dismiss(toastId);
    toast.info("Status update cancelled!");
  };
  const handleToggleStatusConfirmed = async (
    toastId,
    productId,
    currentStatus
  ) => {
    toast.dismiss(toastId);
    try {
      const newStatus = currentStatus === "AA" ? "IA" : "AA";
      const response = await axios.put(
        `${BASE_URL}/api/Products/${productId}/status`,
        { status: newStatus, username: loggedInUser }
      );

      if (response.status === 200) {
        const updatedProductList = productList.map((product) =>
          product._id === productId
            ? {
                ...product,
                status: newStatus,
                statusBy: loggedInUser,
                statusAt: new Date(),
              }
            : product
        );
        setProductList(updatedProductList);
        toast.success(
          `Product ${
            newStatus === "AA" ? "activated" : "deactivated"
          } successfully!`
        );
      } else {
        console.error("Failed to update product status");
        toast.error("Error updating product status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Error updating product status. Please try again.");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleFirstPageClick = () => {
    setCurrentPage(1);
  };

  const handleLastPageClick = () => {
    setCurrentPage(totalPages);
  };

  const handlePreviousPageClick = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPageClick = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

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

  return (
    
    <div className="pd-container12">
      <ToastContainer />
      {displayComponent === "ProductList" ? (
        <>
          <h5 className="heading234">Product Details</h5>
          <div className="space209">
            <button className="pdadd-btn12" onClick={handleClick}>
              {" "}
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
                {" "}
                <label className="show11"> Search &nbsp;</label>
                <input
                  type="search"
                  className="border-change890"
                  placeholder="By Product Name"
                  value={searchQuery}
                  onChange={handleSearch}
                ></input>{" "}
              </div>
            </div>
            <div className="tble-overflow12">
              <table className="pd-table12">
                <thead className="thead87">
                  <tr>
                    <th className="pd-th12">S.No</th>
                    <th className="pd-th12">Product Name</th>
                    <th className="pd-th12">Added By</th>
                    <th className="pd-th12">ExpiryDate</th>
                    <th className="pd-th12">S.P</th>
                    <th className="pd-th12">Stock</th>
                    <th className="pd-th12">Status</th>
                    <th className="pd-th12">Status By</th>
                    <th className="pd-th12">Action</th>
                    <th className="pd-th12">Action By</th>
                  </tr>
                </thead>

                <tbody className="thead87">
                  {currentItems.map((item, index) => (
                    <tr key={item._id}>
                      <td className="customer-table11-td1">
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </td>
                      <td className="pd-td123">{item.itemName}</td>
                      <td className="pd-td123">{item.createdBy}</td>
                      <td className="pd-td123">
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="pd-td12">{item.sellingprice}</td>
                      <td className="pd-td12">{item.stock}</td>
                      <td className="pd-td12">
                        <button
                          className={`buttonrety5678 ${
                            item.status === "AA" ? "deactivate" : "activate"
                          }`}
                          onClick={() =>
                            handleToggleStatus(item._id, item.status)
                          }
                        >
                          {item.status === "AA" ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                      <td className="pd-td12">{item.statusBy}</td>
                      <td className="pd-td12">
                        <button
                          className="book-text"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </button>
                      </td>
                      <td className="pd-td12">{item.modifiedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="entries-div121">
              <div>
                {" "}
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredProducts.length)} of{" "}
                {filteredProducts.length} entries
              </div>
              <div>
                <button className="badges" onClick={handleFirstPageClick}>
                  First
                </button>
                <button className="badges" onClick={handlePreviousPageClick}>
                  Previous
                </button>
                {getDisplayedPages().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className={`badges ${
                      pageNumber === currentPage ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button className="badges" onClick={handleNextPageClick}>
                  Next
                </button>
                <button className="badges" onClick={handleLastPageClick}>
                  Last
                </button>
              </div>
            </div>
          </div>
        </>
      ) : displayComponent === "editProduct" ? (
        <div>
          {editIndex !== null && (
            <EditProduct
              data={productList[editIndex]}
              onSave={handleEditSave}
              onCancel={handleEditCancel}
            />
          )}
        </div>
      ) : null}
      <div className="offer-offers_container1">
        <Slider {...settings}>
          {offers.map((offer) => (
            <div className="offer-offer_card1" key={offer._id}>
              <div className="offer-card1">
                <div className="offer-card-inner1">
                  <div className="offer-card-front1">
                    <div className="offer-card-image1">
                      {offer.image && (
                        <img
                          src={`${BASE_URL}/${offer.image.replace(/\\/g, "/")}`}
                          className="offer-offer_image1"
                          alt={offer.productName}
                        />
                      )}
                    </div>
                  </div>
                  <div className="offer-card-back1">
                    <div className="offer-card-description1">
                      <p className="offer-contsiner-text-fonts1">
                        ProductName: {offer.productName}
                      </p>
                      <p className="offer-contsiner-text-fonts1">
                        Do You Like this Advertisement?
                      </p>
                      <div className="container-offer-productlist1">
                        <div className="container-offer-like1">
                          <label htmlFor={`like-${offer._id}`}>
                            <input
                              type="radio"
                              name={`evaluation-${offer._id}`}
                              id={`like-${offer._id}`}
                              onClick={() =>
                                handleInterest(
                                  true,
                                  offer._id,
                                  offer.productName
                                )
                              }
                            />
                            <svg
                              className="icon like"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2zM4 10h2v9H4v-9zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7v1.819z"></path>
                            </svg>
                            <p className="productlist-offer-interested1">
                              Interested
                            </p>
                          </label>
                        </div>
                        <div className="container-offer-dislike1">
                          <label htmlFor={`dislike-${offer._id}`}>
                            <input
                              type="radio"
                              name={`evaluation-${offer._id}`}
                              id={`dislike-${offer._id}`}
                              onClick={() => handleInterest(false, offer._id)}
                            />
                            <svg
                              className="icon dislike"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20 3H6.693A2.01 2.01 0 0 0 4.82 4.298l-2.757 7.351A1 1 0 0 0 2 12v2c0 1.103.897 2 2 2h5.612L8.49 19.367a2.004 2.004 0 0 0 .274 1.802c.376.52.982.831 1.624.831H12c.297 0 .578-.132.769-.36l4.7-5.64H20c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm-8.469 17h-1.145l1.562-4.684A1 1 0 0 0 11 14H4v-1.819L6.693 5H16v9.638L11.531 20zM18 14V5h2l.001 9H18z"></path>
                            </svg>
                            <p className="productlist-offer-interested1">
                              Not Interested
                            </p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
    
  );
};

export default ProductList;


