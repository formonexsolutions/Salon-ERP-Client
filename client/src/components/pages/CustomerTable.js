import React, { useState, useEffect } from "react";
import "../styles/CustomerTable.css";
import axios from "axios";
import { BASE_URL } from "../Helper/helper";

const CustomerTable = ({ onCustomerDetailsClick }) => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchCustomers = async () => {
    try {
      const salonId = localStorage.getItem("salon_id");
      const branchId = localStorage.getItem("branch_id");
  
      if (!salonId || !branchId) {
        // console.error("Salon ID or Branch ID not found in local storage.");
        return;
      }
  
      // console.log("Fetching customers with salonId:", salonId, "and branchId:", branchId);
  
      const response = await axios.get(
        `${BASE_URL}/api/customers?salonId=${salonId}&branchId=${branchId}`
      );
  
      if (response.status === 200) {
        setCustomers(response.data.reverse());
      } else {
        console.error("Error fetching customers:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching customers:", error.message);
    }
  };
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.customerId &&
        customer.customerId
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClick = (selectedCustomer) => {
    onCustomerDetailsClick(selectedCustomer);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

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
    <div>
      <div className="main-empp">

          <div className="customer-container11">
            <h6 className="edit-customer-heading1123"> Customers</h6>
            <div className="margin786">
              <div className="customer-search11">
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
                  <label className="show11"> Search </label>
                  <input
                    className="input2"
                    type="search"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder=" ID / Mobile Number"
                  />
                </div>
              </div>
              <div className="tble-overflow12">
                <table className="customer-table11a7">
                  <thead className="thead87">
                    <tr>
                      <th className="A7th1">Customer ID</th>
                      <th className="A7th10">Branch ID</th>
                      <th className="A7th10">Customer Name</th>
                      <th className="A7th10">Branch Name</th>
                      <th className="A7th4">Mobile Number</th>
                      <th className="A7th6">Added By</th>
                      <th className="A7th7">Modified By</th>
                      <th className="A7th7">Action</th>
                    </tr>
                  </thead>
                  <tbody className="thead87">
                    {currentItems.map((customer) => (
                      <tr key={customer._id}>
                        <td
                          style={{ color: "#007bff", cursor: "pointer" }}
                          className="customer-table-td1"
                          onClick={() => handleClick(customer)}
                        >
                          {customer.customerId}
                        </td>
                        <td className="customer-table-td">
                          {customer.branchId}
                        </td>
                        <td className="customer-table-td">{customer.name}</td>
                        <td className="customer-table-td">
                          {customer.branchName}
                        </td>
                        <td className="customer-table-td1">{customer.phone}</td>
                        <td className="customer-table-td1">
                          {customer.createdBy}
                        </td>
                        <td className="customer-table-td1">
                          {customer.modifiedBy}
                        </td>
                        <td className="customer-table-td1">
                          <button
                            className="book-text"
                            onClick={() => handleClick(customer)}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="entries-div121">
                <div className="number-of-entries-div">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredCustomers.length)} of{" "}
                  {filteredCustomers.length} Entries
                </div>
                <div className="pagination-div">
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
          </div>
        </div>
    </div>
  );
};
export default CustomerTable;
