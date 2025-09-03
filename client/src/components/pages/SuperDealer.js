import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Salonlogo from "../images/Salon-logo.png";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../Helper/helper";
import Papa from "papaparse";
import "../styles/SuperDealer.css"
import Buttons from "./Buttons";

const SuperDealer = () => {
  const navigate = useNavigate();
  const createdBy = localStorage.getItem("superAdminName") || "superadmin";
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dealers, setDealers] = useState([]);
  const [filteredDealer, setFilteredDealer] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

 

  const fetchDealers = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/dealers`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
        },
      });
      setDealers(response.data.dealers);
      setFilteredDealer(response.data.dealers);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
    } catch (error) {
      toast.error("Failed to fetch dealers.");
    }
  }, [currentPage, itemsPerPage, searchQuery]);

  useEffect(() => {
    fetchDealers();
  }, [fetchDealers]);


  const handleOpenChangePopup = () => {
    toast.error("Go to Settings To Edit Your Profile.");
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logging out...");
    navigate("/");
  };
  const getDisplayedPages = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
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
  const filterDealer = useCallback(() => {
    const query = searchQuery.toLowerCase();
    const filtered = dealers.filter((salon) => {
      const status = mapStatusToFrontend(salon.status).toLowerCase();
      return (
        salon.dealer_id.toLowerCase().includes(query) ||
        salon.CompanyName.toLowerCase().includes(query) ||
        salon.DealerName.toLowerCase().includes(query) ||
        salon.city.toLowerCase().includes(query) ||
        salon.state.toLowerCase().includes(query) ||
        salon.area.toLowerCase().includes(query) ||
        salon.approvedstatus.toLowerCase().includes(query) ||
        status.includes(query)
      );
    });
    setFilteredDealer(filtered);
  }, [searchQuery, dealers]);

  useEffect(() => {
    filterDealer();
  }, [searchQuery, dealers, filterDealer]);

 
  const handleStatusChange = async (dealerId, approvedstatus) => {
    try {
      await axios.put(`${BASE_URL}/api/dealerupdate/${dealerId}`, {
        approvedstatus,
      });
      const updatedDealerData = dealers.map((dealer) => {
        if (dealer._id === dealerId) {
          return { ...dealer, approvedstatus };
        }
        return dealer;
      });
      setDealers(updatedDealerData);
      setFilteredDealer(updatedDealerData);
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating dealer status:", error);
      toast.error("Error updating status");
    }
  };

  const toggleActivationStatus = async (dealerId, currentStatus) => {
    try {
      const newStatus = currentStatus === "AA" ? "IA" : "AA";
      const response = await axios.put(
        `${BASE_URL}/api/dealers/${dealerId}/activation`,
        { status: newStatus }
      );
      if (response.status === 200) {
        const updatedDealerData = dealers.map((dealer) => {
          if (dealer._id === dealerId) {
            return { ...dealer, status: newStatus };
          }
          return dealer;
        });
        setDealers(updatedDealerData);
        setFilteredDealer(updatedDealerData);
        toast.success("Status updated successfully");
      }
    } catch (error) {
      console.error("Error toggling dealer activation", error);
      toast.error("Error updating status");
    }
  };


  // const handleConfirmToggleActivation = async (
  //   toastId,
  //   dealerId,
  //   newStatus
  // ) => {
  //   try {
  //     const response = await axios.put(
  //       `${BASE_URL}/api/dealers/${dealerId}/activation`,
  //       { status: newStatus }
  //     );
  //     if (response.status === 200) {
  //       // Update the dealer's activation status in the state
  //       const updatedDealerData = dealers.map((dealer) => {
  //         if (dealer._id === dealerId) {
  //           return { ...dealer, status: newStatus };
  //         }
  //         return dealer;
  //       });
  //       setDealers(updatedDealerData);
  //       setFilteredDealer(updatedDealerData);
  //       toast.success("Status updated successfully");
  //     }
  //     // Close the confirmation toast
  //     toast.dismiss(toastId);
  //   } catch (error) {
  //     console.error("Error toggling dealer activation", error);
  //     toast.error("Error updating status");
  //   }
  // };

  // const handleCancelToggleActivation = (toastId) => {
  //   // Close the confirmation toast
  //   toast.dismiss(toastId);
  //   // Display toast message for canceling status update
  //   toast.info("Status update Canceled!");
  // };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    Papa.parse(file, {
      complete: async (results) => {
        const dealers = results.data.slice(1).map(row => {
          const dealer = {
            dealer_id: row[7] ? row[7].trim() : '', // Use 'area' value for dealer_id
            CompanyName: row[1] ? row[1].trim() : '',
            DealerName: row[2] ? row[2].trim() : '',
            phoneNumber: row[3] ? row[3].trim() : '',
            password: row[4] ? row[4].trim() : '',
            state: row[5] ? row[5].trim() : '',
            city: row[6] ? row[6].trim() : '',
            area: row[8] ? row[8].trim() : '', // Use 'otp' value for area
            otp: null, // Set otp to null
            approvedstatus: row[9] ? row[9].trim() : 'pending', // Default to 'pending' if not provided
            status: row[10] === 'AA' || row[10] === 'IA' ? row[10] : 'IA', // Validate status
          };
  
          // Check if any required field is missing
          const missingFields = Object.entries(dealer).filter(([key, value]) => {
            return ['CompanyName', 'DealerName', 'phoneNumber', 'password', 'state', 'city', 'area'].includes(key) && !value;
          });
  
          if (missingFields.length > 0) {
            console.warn(`Missing required fields for dealer: ${JSON.stringify(missingFields)}`);
            return null; // Skip this dealer if required fields are missing
          }
  
          return dealer;
        }).filter(dealer => dealer !== null); // Remove any dealers with missing required fields
  
        if (dealers.length === 0) {
          toast.error("No valid dealer data to import.");
          return;
        }
  
        try {
          await axios.post(`${BASE_URL}/api/import`, { dealers });
          toast.success("Dealers imported successfully");
          fetchDealers(); // Refresh the dealer list
        } catch (error) {
          toast.error("Failed to import dealers.");
        }
      },
      header: false,
    });
  };
  
  
  
  
  
  
  return (
    <div className="supermother12">
      <div className="header_part_log">
        <div className="dashboard-salon239012345">
          <img className="header-h1" src={Salonlogo} alt="Salon logo" />
        </div>
        <div className="icon_hover_supad">
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
            <div className="tooltip-dropdown93">
              <div style={{ color: "black" }}>
                <p className="loggen-name-1123">Welcome: {createdBy}</p>
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
            </div>
          </div>
        </div>
      </div>
      <div className="supermother904">
        <Buttons />
        <div className="tab_superadmin">
  <div className="dealers-header">
    <div className="dealers-request">
      <label className="Salonrequest2346lk">Distributors Requests </label>:
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
    <button
      className="import-dealers-button"
      onClick={() => document.getElementById('importDealers').click()}
    >
      Import Distributors
    </button>
    <div className="inp_supdash_sre">
      <input
        className="inp_sehjh"
        type="search"
        placeholder="Search by Distributor Id/Name/City/State/Updated Status/Status"
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
    </div>
  </div>

  <div className="overflow874">
    <table>
      <thead className="thead310">
        <tr>
          <th>Distributor Id</th>
          <th>Company Name</th>
          <th>Distributor Name</th>
          <th>State</th>
          <th>City</th>
          <th>Area</th>
          <th>Current Status</th>
          <th>Action</th>
          <th>Status</th>
          <th>Active</th>
        </tr>
      </thead>
      <tbody>
        {filteredDealer.length > 0 ? (
          filteredDealer.map((item) => (
            <tr key={item._id}>
              <td>{item.dealer_id}</td>
              <td>{item.CompanyName}</td>
              <td>{item.DealerName}</td>
              <td>{item.state}</td>
              <td>{item.city}</td>
              <td>{item.area}</td>
              <td>{item.approvedstatus}</td>
              <td>
                <select
                  className="select564"
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
              <td>{mapStatusToFrontend(item.status)}</td>
              <td>
                <button
                  className={`butt_act_dea ${
                    item.status === "AA" ? "deactivate" : "activate"
                  }`}
                  onClick={() =>
                    toggleActivationStatus(item._id, item.status)
                  }
                >
                  {item.status === "AA" ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="10">No results found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  <div className="import-button-container">
    <input
      type="file"
      id="importDealers"
      accept=".csv"
      style={{ display: "none" }}
      onChange={handleFileUpload}
    />
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
</div>

      </div>
    </div>
  );
};

export default SuperDealer;
