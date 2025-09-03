import React, { useState, useEffect } from "react";
import axios from "axios";
import AddEmployee from "./AddEmployee";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classnames from "classnames";
import { BASE_URL } from "../Helper/helper";



const EmployeeDetailsPopup = ({ employee, onClose }) => {
  return (
    <div className="popup-container-sk9879">
      <div className="hh23">
        <h2 className="h28">Employee Details</h2>
        <button className="close-btn-sk9879" onClick={onClose}>
          X
        </button>
      </div>
      <div className="popup-content-sk9879">
        <div className="abc1234">
          <p>
            <label className="align100px">ID</label>:&nbsp;&nbsp;&nbsp;{" "}
            {employee.staff_id}
          </p>
          <p>
            <label className="align100px">Name</label>: &nbsp;&nbsp;&nbsp;
            {employee.employeeName}{employee.adminName}
          </p>
          <p>
            <label className="align100px">MobileNumber</label>:
            &nbsp;&nbsp;&nbsp;{employee.phoneNumber}
          </p>         
        </div>
      </div>
    </div>
  );
};

const Employees = ({ onNewEmployeeClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [employees, setEmployees] = useState([]);
  const [/*error*/, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [displayComponent, setDisplayComponent] = useState("Employees");

  const handleEdit = (employee) => {
    // Display confirmation toast before proceeding
    const confirmToastId = toast(
      <div>
        <p>Are you sure you want to edit this employee?</p>
        <button
          className="confirm-btn confirm-yes"
          onClick={() => {
            handleConfirmEdit(confirmToastId, employee);
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
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  const handleConfirmEdit = (toastId, employee) => {
    // Close the confirmation toast
    toast.dismiss(toastId);
    // Set the edit index and switch to the editEmployee display
    setEditIndex(employee);
    setDisplayComponent("editEmployee");
  };

  const handleCancelEdit = (toastId) => {
    // Close the confirmation toast
    toast.dismiss(toastId);
    // Display a toast message for canceling the edit operation
    toast.info("Edit canceled!");
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setDisplayComponent("Employees");
  };

  const handleClick = () => {
    onNewEmployeeClick();
  };

  useEffect(() => {
    const salonId = localStorage.getItem('salon_id');
    if (!salonId) {
      console.error('Salon ID not found in local storage.');
      return;
    }

    axios
      .get(`${BASE_URL}/api/employees?salon_id=${salonId}`)
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        // console.error('Error fetching employees:', error);
      });
  }, []);
  
  const toggleActivation = async (staff_id, currentStatus) => {
    try {
      // Display a confirmation toast with custom JSX content
      const confirmToastId = toast(
        <div>
          <p>Are you sure you want to {currentStatus === 'AA' ? 'deactivate' : 'activate'} this employee?</p>
          <button
            className="confirm-btn confirm-yes"
            onClick={() => {
              handleConfirmToggleActivation(confirmToastId, staff_id, currentStatus);
            }}
          >
            Yes
          </button>
          <button
            className="confirm-btn confirm-no"
            onClick={() => {
              handleCancelToggleActivation(confirmToastId);
            }}
          >
            No
          </button>
        </div>,
        {
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } catch (error) {
      console.error('Error displaying confirmation toast:', error);
      toast.error(`Error displaying confirmation: ${error.message}`);
    }
  };
  
  const handleConfirmToggleActivation = async (toastId, staff_id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'AA' ? 'IA' : 'AA';
      const loggedInEmployeeName = localStorage.getItem("employeeName");
      const loggedInAdminName = localStorage.getItem("adminName");
      const statusBy = loggedInEmployeeName || loggedInAdminName || "Unknown";

      const response = await axios.put(
        `${BASE_URL}/api/employees/${staff_id}/status`,
        {
          status: newStatus,
          statusBy: statusBy, // Include the admin name fetched from localStorage
        }
      );
  
      if (response.status === 200) {
        const updatedEmployees = employees.map((employee) =>
          employee._id === staff_id
            ? { ...employee, status: newStatus, statusBy: statusBy }
            : employee
        );
        setEmployees(updatedEmployees);
        toast.success(`Employee ${newStatus === 'AA' ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (error) {
      console.error('Error toggling activation:', error);
      toast.error('Failed to update employee status');
    }
    // Close the confirmation toast
    toast.dismiss(toastId);
  };
  
  const handleCancelToggleActivation = (toastId) => {
    // Close the confirmation toast
    toast.dismiss(toastId);
    // Display toast message for canceling status update
    toast.info("Status update canceled!");
  };
  const handleEditSave = (EmployeeData) => {
    try {
      axios
        .put(`${BASE_URL}/api/employees/${EmployeeData._id}`, EmployeeData)
        .then((response) => {
          const updatedEmployees = employees.map((employee) => {
            if (employee._id === response.data._id) {
              return {
                ...response.data,
                statusby: employee.statusby, // Preserve the statusby field
              };
            }
            return employee;
          });
          setEmployees(updatedEmployees);
  
          setDisplayComponent("Employees");
          setError(null);
        })
        .catch((error) => {
          setError("Error updating employee data.");
  
          const toastClassName = classnames({
            "Toastify__toast--success234": false,
            "Toastify__toast--error234": true,
            "Toastify__toast--info234": false,
            "Toastify__toast--warning234": false,
          });
  
          toast.error("Error updating employee data!", {
            autoClose: 3000,
            className: toastClassName,
          });
        });
    } catch (error) {
      console.error('Error updating employee data:', error);
      toast.error(`Error updating employee data: ${error.message}`);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    // const employeeName = employee.employeeName || "";
    // const adminName = employee.adminName || "";
    // const phoneNumber = employee.phoneNumber || "";
    return (
      (employee.role === 'stylist' || employee.role === 'receptionist') &&
      (employee.employeeName || '')
    );
  });
  
  const filteredAdmins = employees.filter((employee) => {
    return employee.role === 'admin' && (employee.employeeName || "").includes(searchQuery);
  });
  
  const indexOfLastAdmin = currentPage * itemsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - itemsPerPage;
  const currentAdmins = filteredAdmins.slice(
    indexOfFirstAdmin,
    indexOfLastAdmin
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const totalPagesAdmins = Math.ceil(filteredAdmins.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handlePageChangeAdmins = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page when items per page change
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
  const getDisplayedPagesAdmins = () => {
    const totalDisplayPages = 3;
    const pages = [];
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 0 && i <= totalPagesAdmins) {
        pages.push(i);
      }
      if (pages.length >= totalDisplayPages) {
        break;
      }
    }
    return pages;
  };

  const handleDetailsClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseDetails = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="main-empee">
      {displayComponent === "Employees" ? (
        <>
          <div className="customer-container11">
            <h5 className="heading234">Employees</h5>
            <div className="margin786">
              <button className="pdadd-btn12" onClick={handleClick}>
                {" "}
                + Add Employee
              </button>
              <div className="customer-search11">
                <div className="select-number-of-entries">
                  <label className="show11">Show</label>
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
                  <label className="show11">Search </label>
                  <input
                    type="text"
                    placeholder="Name or phone number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input2"
                  />
                </div>
              </div>
              <div className="tble-overflow12">
                <table className="table-saloon2345">
                  <thead className="thead87">
                    <tr className="tr-saloon2345">
                      <th className="th-saloon2345">Staff ID</th>
                      <th className="th-saloon2345">Staff Name</th>
                      <th className="th-saloon2345">Mobile Number</th>
                      <th className="th-saloon2345">Role</th>
                      <th className="th-saloon2345">Branch ID</th>
                      <th className="th-saloon2345">Branch Name</th>
                      <th className="th-saloon2345">AddedBy</th>
                      <th className="th-saloon2345">Status</th>
                      <th className="th-saloon2345">statusBy</th>
                      <th className="th-saloon2345">Action</th>
                      <th className="th-saloon2345">ActionBy</th>                      
                    </tr>
                  </thead>
                  <tbody className="thead87">
                    {currentItems.map((employee) => (
                        <tr key={employee._id} className="tr-saloon2345">
                          <td
                            className="td-saloon23456 td-saloon2345900 width30"
                            onClick={() => handleDetailsClick(employee)}
                          >
                            {employee.staff_id}
                          </td>
                          <td
                            className="td-saloon2345900"
                            onClick={() => handleDetailsClick(employee)}
                          >
                            {employee.employeeName}
                          </td>
                          <td className="td-saloon23456">
                            {employee.phoneNumber}
                          </td>
                          <td className="td-saloon23456">{employee.role}</td>
                          <td className="td-saloon23456">
                            {employee.branch_id}
                          </td>
                          <td className="td-saloon23456">{employee.branchName}</td>
                          <td className="td-saloon23456">
                            {employee.createdByName}
                          </td>
                          <td className="td-saloon23456">                          
                            <button
                              className={`buttonrety5678 ${employee.status === 'AA' ? 'deactivate' : 'activate'}`}
                              onClick={() => toggleActivation(employee._id, employee.status)}
                            >
                              {employee.status === "AA" ? "Deactivate" : "Activate"}
                            </button>
                          </td>
                          <td className="td-saloon23456">
                            {employee.statusBy}
                          </td>                          
                          <td className="td-saloon23456">
                            <button
                              className="butt_edit_emloy"
                              onClick={() => handleEdit(employee)}
                            >
                              Edit
                            </button>            
                          </td>
                          <td className="td-saloon23456">
                            {employee.modifiedBy}
                          </td>
                        </tr>
                      )).slice(0, itemsPerPage)  }
                  </tbody>
                </table>
              </div>
              <div className="entries-div121">
                <div className="number-of-entries-div">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredEmployees.length)} of{" "}
                  {filteredEmployees.length} Entries
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
          </div>
          
          <div className="customer-container11">
            <h5 className="heading234">Admins</h5>
            <div className="margin786">
            <div className="tble-overflow12">
                <table className="table-saloon2345">
                  <thead className="thead87">
                    <tr className="tr-saloon2345">
                      <th className="th-saloon2345">Staff ID</th>
                      <th className="th-saloon2345">Admin Name</th>
                      <th className="th-saloon2345">Mobile Number</th>
                      <th className="th-saloon2345">Role</th>
                      <th className="th-saloon2345">Status</th>
                      <th className="th-saloon2345">statusBy</th>
                      <th className="th-saloon2345">Action</th>
                      <th className="th-saloon2345">ActionBy</th>
                    </tr>
                  </thead>
                  <tbody className="thead87">
                    {currentAdmins.map((employee) => (
                        <tr key={employee._id} className="tr-saloon2345">
                          <td
                            className="td-saloon23456 td-saloon2345900 width30"
                            onClick={() => handleDetailsClick(employee)}
                          >
                            {employee.staff_id}
                          </td>
                          <td
                            className="td-saloon2345900"
                            onClick={() => handleDetailsClick(employee)}
                          >
                             {employee.employeeName || employee.adminName}
                          </td>
                          <td className="td-saloon23456">
                            {employee.phoneNumber}
                          </td>
                          <td className="td-saloon23456">{employee.role}</td>                          
                          <td className="td-saloon23456">                          
                            <button
                              className={`buttonrety5678 ${employee.status === 'AA' ? 'deactivate' : 'activate'}`}
                              onClick={() => toggleActivation(employee._id, employee.status)}
                            >
                              {employee.status === "AA" ? "Deactivate" : "Activate"}
                            </button>
                          </td>
                          <td className="td-saloon23456">
                            {employee.statusBy}
                          </td>                          
                          <td className="td-saloon23456">
                            <button
                              className="butt_edit_emloy"
                              onClick={() => handleEdit(employee)}
                            >
                              Edit
                            </button>            
                          </td>
                          <td className="td-saloon23456">
                            {employee.modifiedBy}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="entries-div121">
          <div className="number-of-entries-div">
            Showing {indexOfFirstAdmin + 1} to{" "}
            {Math.min(indexOfLastAdmin, filteredAdmins.length)} of{" "}
            {filteredAdmins.length} Entries
          </div>
          <div>
            <button className="badges" onClick={handleFirstPageClick}>
              First
            </button>
            <button className="badges" onClick={handlePreviousPageClick}>
              Previous
            </button>
            {getDisplayedPagesAdmins().map((pageNumber) => (
              <button
                key={pageNumber}
                className={`badges ${
                  pageNumber === currentPage ? "active" : ""
                }`}
                onClick={() => handlePageChangeAdmins(pageNumber)}
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
        </>
      ) : displayComponent === "editEmployee" ? (
        <div>
          {editIndex !== null && (
            <AddEmployee
              data={editIndex}
              onSave={handleEditSave}
              onCancel={handleEditCancel}
            />
          )}
        </div>
      ) : null}

      {selectedEmployee && (
        <EmployeeDetailsPopup
          employee={selectedEmployee}
          onClose={handleCloseDetails}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Employees;
