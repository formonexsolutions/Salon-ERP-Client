import React, { useEffect, useState, useCallback } from "react";
import "../styles/Superadmindashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/SuperNavbar.css";
import Salonlogo from "../images/Salon-logo.png";
import { BASE_URL } from "../Helper/helper";
import { toast } from "react-toastify";
import SuperAdminSalonPopup from "./SuperAdminSalonPopup";
import Buttons from "./Buttons";


const Superadmindashboard = () => {
  const [addSalon, setAddSalon] = useState([]);
  const [filteredSalons, setFilteredSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const createdBy = localStorage.getItem("superAdminName") || "superadmin";
  // const superAdminId = localStorage.getItem("superAdminId");
  // const userRole = localStorage.getItem("userRole");
  const [selectedAdminDetails, setSelectedAdminDetails] = useState({});
  const [selectedSubscription, setSelectedSubscriptionDetails] = useState({});
  const [adminErrorMessage, setAdminErrorMessage] = useState({});
  const [subscriptionErrorMessage, setSubscriptionErrorMessage] = useState({});



  const fetchSalon = useCallback(async () => {
    try {
      const salonResponse = await axios.get(`${BASE_URL}/api/salons`, {
        params: { page: currentPage, limit: itemsPerPage },
      });

      if (salonResponse.data.salons.length > 0) {
        const salonData = salonResponse.data.salons.map((salon) => ({
          type: "Salon",
          ...salon,
        }));
        setAddSalon(salonData);
        setFilteredSalons(salonData);
        setSelectedSalon({ type: "Salon", ...salonResponse.data.salons[0] });
        setTotalPages(Math.ceil(salonResponse.data.total / itemsPerPage));
      } else {
        setAddSalon([]);
        setFilteredSalons([]);
        setSelectedSalon({});
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching salon data", error);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchSalon();
  }, [currentPage, itemsPerPage, fetchSalon]);

  

  // // Inside the handleSalonSelect function
  const handleSalonSelect = async (salon) => {
    setSelectedSalon(salon);
    try {
      const salonAdminName = salon.adminName;
      const adminResponse = await axios.get(`${BASE_URL}/api/staff`, {
        params: { adminName: salonAdminName, role: "admin" },
      });

      const salonId = salon.salon_id;
      const subscriptionResponse = await axios.get(
        `${BASE_URL}/api/payment/subscriptions`,
        {
          params: { salon_id: salonId },
        }
      );

      if (adminResponse.data.length > 0) {
        const matchingAdmin = adminResponse.data.find(
          (admin) => admin.adminName === salonAdminName
        );
        if (matchingAdmin) {
          setSelectedAdminDetails(matchingAdmin);
          setAdminErrorMessage(""); // Clear admin error message
        } else {
          setSelectedAdminDetails({});
          setAdminErrorMessage("Admin details not found for this salon");
        }
      } else {
        setSelectedAdminDetails({});
        setAdminErrorMessage("Admin details not found for this salon");
      }

      if (subscriptionResponse.data.length > 0) {
        const matchingSubscription = subscriptionResponse.data.find(
          (payment) => payment.salon_id === salonId
        );
        if (matchingSubscription) {
          setSelectedSubscriptionDetails(matchingSubscription);
          setSubscriptionErrorMessage(""); // Clear subscription error message
        } else {
          setSelectedSubscriptionDetails({});
          setSubscriptionErrorMessage(
            "Subscription details not found for this salon"
          );
        }
      } else {
        setSelectedSubscriptionDetails({});
        setSubscriptionErrorMessage(
          "Subscription details not found for this salon"
        );
      }
    } catch (error) {
      console.error("Error fetching admin or subscription details:", error);
      setAdminErrorMessage("Error fetching admin details");
      setSubscriptionErrorMessage("Error fetching subscription details");
      setSelectedAdminDetails({});
      setSelectedSubscriptionDetails({});
    }
    setShowPopup(true);
  };

  const handleStatusChange = async (salonId, approvedstatus) => {
    try {
      await axios.put(`${BASE_URL}/api/superupdate/${salonId}`, {
        approvedstatus,
      });
  
      // Update the salon's status in the state
      const updatedSalonData = addSalon.map((salon) => {
        if (salon._id === salonId) {
          return { ...salon, approvedstatus };
        }
        return salon;
      });
      setAddSalon(updatedSalonData);
      setFilteredSalons(updatedSalonData);
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating salon status:", error);
      toast.error("Error updating status");
    }
  };
  
  // Function to handle confirmation of status change
  // const handleConfirmStatusChange = async (
  //   toastId,
  //   salonId,
  //   approvedstatus
  // ) => {
  //   try {
  //     // Make API call to update salon status
  //     await axios.put(`${BASE_URL}/api/superupdate/${salonId}`, {
  //       approvedstatus,
  //     });
  //     // Update the salon's status in the state
  //     const updatedSalonData = addSalon.map((salon) => {
  //       if (salon._id === salonId) {
  //         return { ...salon, approvedstatus };
  //       }
  //       return salon;
  //     });
  //     setAddSalon(updatedSalonData);
  //     setFilteredSalons(updatedSalonData);
  //     toast.success("Status updated successfully");
  //   } catch (error) {
  //     console.error("Error updating salon status:", error);
  //     toast.error("Error updating status");
  //   }
  //   // Close the confirmation toast
  //   toast.dismiss(toastId);
  // };

  // // Function to handle cancellation of status change
  // const handleCancelStatusChange = (toastId) => {
  //   // Close the confirmation toast
  //   toast.dismiss(toastId);
  //   // Display toast message for canceling status update
  //   toast.info("Status update canceled!");
  // };

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
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("superAdminName");
    localStorage.removeItem("superAdminId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("userId");
    toast.success("Logging out...");
    navigate("/");
  };
  const closeSalonPopup = () => {
    setSelectedSalon(null);
    setShowPopup(false);
  };


  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterSalons = useCallback(() => {
    const query = searchQuery.toLowerCase();
    const filtered = addSalon.filter((salon) => {
      const status = mapStatusToFrontend(salon.status).toLowerCase();
      return (
        salon.salon_id.toLowerCase().includes(query) ||
        salon.SalonName.toLowerCase().includes(query) ||
        salon.city.toLowerCase().includes(query) ||
        salon.state.toLowerCase().includes(query) ||
        salon.approvedstatus.toLowerCase().includes(query) ||
        status.includes(query)
      );
    });
    setFilteredSalons(filtered);
  }, [searchQuery, addSalon]);

  useEffect(() => {
    filterSalons();
  }, [searchQuery, addSalon, filterSalons]);

  const mapStatusToFrontend = (status) => {
    switch (status) {
      case "AA":
        return "Activate";
      case "IA":
        return "Deactivate";
      default:
        return status;
    }
  };
  const toggleActivation = async (salonId, currentActivation) => {
    try {
      const newActivation = currentActivation === "AA" ? "IA" : "AA";
      
      await axios.put(`${BASE_URL}/api/${salonId}/activation`, { status: newActivation });
  
      // Update the salon's activation status in the state
      const updatedSalonData = addSalon.map((salon) => {
        if (salon._id === salonId) {
          return { ...salon, status: newActivation };
        }
        return salon;
      });
      setAddSalon(updatedSalonData);
      setFilteredSalons(updatedSalonData);
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error toggling salon activation", error);
      toast.error("Error updating status");
    }
  };
  

  const handleOpenChangePopup = () => {
    toast.error("Go to Settings To Edit Your Profile.");
  };

  return (
    <div className="supermother12">
      <div className="header_part_log">
        <div className="dashboard-salon239012345">
          <img className="header-h1" src={Salonlogo} alt="Salon logo" />
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
        <div className="tab_superadmin">
          <div className="spa_in_sa_sear">
            <div className="display654">
              <label className="Salonrequest2346lk">Salon Requests </label>:
              <select
                className="selectboc54lk123"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>
            <div className="inp_supdash_sre">
              <input
                className="inp_sehjh"
                type="search"
                placeholder="Search by Salon Id/Name/City/State/Updated Status/Status"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </div>
          </div>
          <div className="overflow874">
          <table >
            <thead className="thead310">
              <tr>
                <th>Salon Id</th>
                <th>Salon Name</th>
                <th>City</th>
                <th>State</th>
                <th>Current Status</th>
                <th>Action</th>
                <th>Status</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalons.length > 0 ? (
                filteredSalons.map((item) => (
                  <tr key={item._id}>
                    <td
                      className="ee_Ee_ss_ss_cus"
                      onClick={() => handleSalonSelect(item)}
                    >
                      {item.salon_id}
                    </td>
                    <td
                      className="ee_Ee_ss_ss_cus"
                      onClick={() => handleSalonSelect(item)}
                    >
                      {item.SalonName}
                    </td>
                    <td>{item.city}</td>
                    <td>{item.state}</td>
                    <td>{item.approvedstatus}</td>
                    <td>
                      <select className="select564"
                        onChange={(e) =>
                          handleStatusChange(item._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Hold">Hold</option>
                        <option value="Approve">Approve</option>
                        <option value="Decline">Decline</option>
                      </select>
                    </td>
                    <td> {mapStatusToFrontend(item.status)} </td>
                    <td>
                      <button
                        className={`butt_act_dea ${
                          item.status === "AA" ? "deactivate" : "activate"
                        }`}
                        onClick={() => toggleActivation(item._id, item.status)}
                      >
                        {item.status === "AA" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
          <div className="entries-div12454461_jnjnj">
            <div className="flex16et4663_sa">
              <button className="badtuytuges" onClick={handleFirstPageClick}>
                First
              </button>
              <button className="badtuytuges" onClick={handlePreviousPageClick}>
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
              <button className="badtuytuges" onClick={handleNextPageClick}>
                Next
              </button>
              <button className="badtuytuges" onClick={handleLastPageClick}>
                Last
              </button>
            </div>
          </div>
          {showPopup && (
            <SuperAdminSalonPopup
              salonDetails={selectedSalon}
              adminDetails={selectedAdminDetails}
              subscriptionDetails={selectedSubscription}
              adminErrorMessage={adminErrorMessage}
              subscriptionErrorMessage={subscriptionErrorMessage}
              onClose={closeSalonPopup}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Superadmindashboard;
