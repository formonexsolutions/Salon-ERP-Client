import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Offer.css";
import Salonlogo from "../images/Salon-logo.png";
import { BASE_URL } from "../Helper/helper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Buttons from "./Buttons";

const Offer = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [offers, setOffers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [warning, setWarning] = useState("");
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();


  const createdBy = localStorage.getItem("superAdminName") || "superadmin";

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

  

  const fetchAllInterestedUsers = useCallback(async () => {
    try {
      // Create an array of promises, one for each offer
      const promises = offers.map(async (offer) => {
        // Fetch interested users for the current offer
        const response = await axios.get(
          `${BASE_URL}/api/offers/${offer._id}/interested-users`
        );
        // Add the offerId to each user in the response data
        return response.data.map((user) => ({
          ...user,
          offerId: offer._id, // Keep offerId in the user data
        }));
      });
  
      // Wait for all promises to resolve and flatten the result
      const interestedUsersData = await Promise.all(promises);
      const allInterestedUsers = interestedUsersData.flat();
  
      // Set the interested users in state
      setInterestedUsers(allInterestedUsers);
    } catch (error) {
      console.error("Error fetching interested users:", error);
    }
  }, [offers]);
  
  
  useEffect(() => {
    if (offers.length > 0) {
      fetchAllInterestedUsers();
    }
  }, [offers, fetchAllInterestedUsers]);
  
  

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("createdBy", createdBy);

    try {
      await axios.post(`${BASE_URL}/api/offers`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchOffers();
      toast.success("Offer created successfully!");
      setProductName("");
      setDescription("");
      setImage(null);
      setShowPopup(false); // Hide popup after successful submission
    } catch (error) {
      console.error("Error posting offer:", error);
      toast.error("Failed to create offer.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/offers/${id}`);
      setOffers(offers.filter((offer) => offer._id !== id));
      toast.success("Offer deleted successfully!");
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error("Failed to delete offer.");
    }
  };

  // const handleallrequest = () => {
  //   navigate("/Superadmindashboard");
  // };
  // const handleDealer = () =>{
  //   navigate("/superdealer")
  // };

  // const handlesettings = () => {
  //   navigate("/setting");
  // };

  // const handleplans = () => {
  //   navigate("/SuperSubscription");
  // };

  // const handleOffer = () => {
  //   navigate("/Offers");
  // };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logging out...");
    navigate("/");
  };

  const handleOpenChangePopup = () => {
    toast.error("Go to Settings To Edit Your Profile.");
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 60) {
      setDescription(value);
      setWarning("");
    } else {
      setWarning("Description cannot exceed 60 characters.");
    }
  };

  const handleExport = () => {
    const userName = localStorage.getItem("superAdminName");
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const formattedTime = currentDate.toLocaleTimeString().replace(/:/g, "-");
    const dateTimeString = `${formattedDate}_${formattedTime}`;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "SlNo,Product Name,Name,Phone Number,Interested Date\n";

    interestedUsers.forEach((user, index) => {
      csvContent += `${index + 1},${user.productName},${user.name},${
        user.phoneNumber
      },${formatDate(user.interestedDate)}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${userName}_${dateTimeString}_interested_users.csv`
    );
    document.body.appendChild(link);
    link.click();
  };

  const settingsOffer = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: offers.length >= 4 ? 4 : offers.length,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    adaptiveHeight: true,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };

  const filterInterestedUsersByDate = useCallback(
    (filterType) => {
      let filteredUsers = [];

      switch (filterType) {
        case "today":
          filteredUsers = interestedUsers.filter((user) => {
            const userDate = new Date(user.interestedDate);
            const today = new Date();
            return (
              userDate.getDate() === today.getDate() &&
              userDate.getMonth() === today.getMonth() &&
              userDate.getFullYear() === today.getFullYear()
            );
          });
          break;

        case "all":
          filteredUsers = interestedUsers;
          console.log("show ALL");
          break;

        case "filter":
          if (!startDate || !endDate) {
            toast.error("Please select both start and end dates.");
            return;
          }

          const startDateObj = new Date(startDate);
          const endDateObj = new Date(endDate);
          endDateObj.setHours(23, 59, 59, 999);

          filteredUsers = interestedUsers.filter((user) => {
            const userDate = new Date(user.interestedDate);
            return userDate >= startDateObj && userDate <= endDateObj;
          });
          break;

        default:
          break;
      }

      setInterestedUsers(filteredUsers); // Update state after filtering
    },
    [interestedUsers, startDate, endDate]
  );

  return (
    <div className="supermother12">
      <div className="header_part_log">
        <div className="dashboard-salon239012345">
          <img src={Salonlogo} alt="Salonlogo" className="header-h1" />
        </div>

        <div className="icon_hover_supad">
          <div className="logostyle23">
            <div className="logostyle23">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="0"
                viewBox="0 0 24 24"
                className="logo-sizing23"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 12 21Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>

            <div className="tooltip-dropdown93">
              <div style={{ color: "black" }}>
                <p className="loggen-name-1123">Welcome:{createdBy}</p>
                {/* <p className="jjnhjjgjh">Role: {userRole}</p> */}
              </div>
              <div className="bu_hj_log">
                <button
                  className="but_hb_lo_sa"
                  onClick={handleOpenChangePopup}
                >
                  Edit Profile
                </button>
                <button className="but_hb_lo_sa" onClick={handleLogout}>
                  Logout
                </button>
              </div>
              {/* <div>
              <button className="but_sa_popup_lop" onMouseLeave={handleMouseLeave}>Close</button>
            </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="supermother904">
        <Buttons />

        <div className="overflowcont9">
        {/* <div className="offer-add_offer_button_container"> */}
         
            <button className="offer-add_offer_button" onClick={togglePopup}>
              Add Offer
            </button>

            {showPopup && (
              <div className="offer-popup_overlay">
                <div className="offer-popup">
                  <form className="offer-offer_form" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="offer-offer_input"
                    />
                    <textarea
                      placeholder="Description"
                      value={description}
                      onChange={handleDescriptionChange}
                      className="offer-offer_textarea"
                    />
                    {warning && <p className="warning">{warning}</p>}

                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="offer-offer_file_input"
                    />
                    <button type="submit" className="offer-offer_submit_button">
                      Submit
                    </button>
                  </form>
                  <button
                    className="offer-close_popup_button"
                    onClick={togglePopup}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
 
            <div className="offer-offers_container">
              <Slider {...settingsOffer}>
                {offers.map((offer) => (
                  <div className="offer-offer_card" key={offer._id}>
                    <div className="offer-card">
                      <div className="offer-card-inner">
                        <div className="offer-card-front">
                          <div className="offer-card-image">
                            {offer.image && (
                              <img
                                src={`${BASE_URL}/${offer.image.replace(
                                  /\\/g,
                                  "/"
                                )}`}
                                alt={offer.productName}
                                className="offer-offer_image"
                              />
                            )}
                          </div>
                          <div className="offer-card-product-name">
                            <h2 className="offer-h2-productname">
                              ProductName: {offer.productName}
                            </h2>
                          </div>
                        </div>
                        <div className="offer-card-back">
                          <div className="offer-card-description">
                            <p>Description: {offer.description}</p>
                            <button
                              className="offer-delete-button"
                              onClick={() => handleDelete(offer._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>

            <div className="interested-users-table">
              <h3 className="table-heading-offers1">
                Users Who Are Interested In Offers
              </h3>

              <div className="unique-date-filter-container">
                <div className="flexrow8">
                  <div className="unique-date-filter-section">
                    <label className="unique-date-filter-label">From:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="unique-date-filter-input"
                    />
                  </div>
                  <div className="unique-date-filter-section">
                    <label className="unique-date-filter-label">To:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="unique-date-filter-input"
                    />
                  </div>
                </div>
                <div className="flex374">
                  <div>
                    <button
                      className="unique-offer-filter-button"
                      onClick={() => filterInterestedUsersByDate("filter")}
                    >
                      Filter
                    </button>
                    <button
                      className="unique-offer-filter-button"
                      onClick={() => filterInterestedUsersByDate("today")}
                    >
                      Today
                    </button>
                    <button
                      className="unique-offer-filter-button"
                      onClick={() => filterInterestedUsersByDate("all")}
                    >
                      Show All
                    </button>
                  </div>
                  <button
                    onClick={handleExport}
                    className="export-button-offer1"
                  >
                    Export Users
                  </button>
                </div>
              </div>
              <div className="cont_tab_offer">
                <table className="tableinterested-users-table">
                  <thead>
                    <tr>
                      <th>SlNo</th>
                      <th>Product Names</th>
                      <th>Name</th>
                      <th>Phone Number</th>
                      <th>Interested Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interestedUsers.map((user, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{user.productName}</td>
                        <td>{user.name}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{formatDate(user.interestedDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}
      <ToastContainer />
    </div>
  );
};

export default Offer;
