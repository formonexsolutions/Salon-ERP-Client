import React, { useState, useEffect,useCallback} from "react";
import axios from "axios";
import { BASE_URL } from "../Helper/helper";
import EditService from "./EditService";
import "../styles/Service.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServiceForm = ({ onNewServiceClick }) => {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [displayComponent, setDisplayComponent] = useState("Services");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); 

  const loggedInUser = localStorage.getItem('adminName') || localStorage.getItem('employeeName');
  const salonId = localStorage.getItem('salon_id'); // Get salon_id from local storage

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/services?salon_id=${salonId}`);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }, [salonId]); // Keep salonId in the dependency array
  
  

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleClick = () => {
    onNewServiceClick();
  };

  const handleEditCancel = () => {
    setDisplayComponent("Services");
  };

  const handleEdit = (serviceId) => {
    if (!serviceId) {
      toast.warn("Please select a service name before editing.");
      return;
    }

    setSelectedServiceId(serviceId);
    setIsEditing(true);
    setDisplayComponent("editService");
  };

  const handleSaveEdit = (editedService) => {
    const updatedServices = services.map((service) =>
      service._id === editedService._id ? editedService : service
    );
    setServices(updatedServices);
    setIsEditing(false);
    setDisplayComponent("Services");
    setSelectedServiceId("");
  };

  const handleStatusChange = async (serviceId, currentStatus) => {
    try {
      // Display a confirmation toast with custom JSX content
      const confirmToastId = toast(
        <div>
          <p>Are you sure you want to change the service status?</p>
          <button
            className="confirm-btn confirm-yes"
            onClick={async () => {
              try {
                const newStatus = currentStatus === "AA" ? "IA" : "AA";
                const response = await axios.put(
                  `${BASE_URL}/api/services/${serviceId}/status`,
                  { status: newStatus, statusBy: loggedInUser }
                );
  
                if (response.status === 200) {
                  const updatedServices = services.map((service) =>
                    service._id === serviceId ? { ...service, status: newStatus, statusBy: loggedInUser } : service
                  );
                  setServices(updatedServices);
                  toast.success("Service status updated successfully");
                }
              } catch (error) {
                console.error("Error updating service status:", error);
                toast.error("Error updating service status. Please try again.");
              } finally {
                toast.dismiss(confirmToastId); // Dismiss the confirmation toast
              }
            }}
          >
            Yes
          </button>
          <button
            className="confirm-btn confirm-no"
            onClick={() => {
              toast.dismiss(confirmToastId); // Dismiss the confirmation toast
              toast.info("Status update cancelled");
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
      console.error("Error displaying confirmation toast:", error);
      toast.error(`Error updating service status: ${error.message}`);
    }
  };
  
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = services.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(services.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
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

  return (
    <div className="service-form-container-sk141">
      {displayComponent === "Services" ? (
        <>
          <h5 className="heading234">Services</h5>
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
          </div>
          <div className="tble-overflow12555">
            <table className="table-saloon_service">
              <thead className="thead87">
                <tr className="tr-saloon2345">
                  <th className="th-saloon2345">Service ID</th>
                  <th className="th-saloon2345">Service Name</th>
                  <th className="th-saloon2345">Category</th>
                  <th className="th-saloon2345">Price</th>
                  <th className="th-saloon2345">GST(%)</th>
                  <th className="th-saloon2345">AddedBy</th>
                  <th className="th-saloon2345">Status</th>
                  <th className="th-saloon2345">Status By</th>
                  <th className="th-saloon2345">Action</th>

                  <th className="th-saloon2345">Action By</th>
                </tr>
              </thead>
              <tbody className="thead87">
                {currentItems.map((service) => (
                  <tr key={service._id} className="tr-saloon2345">
                    <td className="td-saloon23456 td-saloon2345900 width30">{service.serviceId}</td>
                    <td className="td-saloon2345900">{service.serviceName}</td>
                    <td className="td-saloon23456">{service.category}</td>
                    <td className="td-saloon23456">{service.price}</td>
                    <td className="td-saloon23456">{service.GST}</td>
                    <td className="td-saloon23456">{service.createdBy}</td>
                    <td className="td-saloon23456"><button
                        type="button"
                        onClick={() => handleStatusChange(service._id, service.status)}
                        className={`buttonrety5678 ${service.status === "AA" ? 'deactivate' : 'activate'}`}
                      >
                        {service.status === "AA" ? "Deactivate" : "Activate"}
                      </button></td>
                    <td className="td-saloon23456">{service.statusBy}</td>
                    <td className="td-saloon23456">
                      <button
                        className="butt_edit_emloy"
                        onClick={() => handleEdit(service._id)}
                      >
                        Edit
                      </button>
                      
                     
                    </td>
                    <td className="td-saloon23456">{service.modifiedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="entries-div121_service">
            <div className="number-of-entries-div">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, services.length)} of{" "}
              {services.length} Entries
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
          <div className="add-edit-buttons-container">
            <button className="add-button-sk141" onClick={handleClick}>
              Add New
            </button>
          </div>
        </>
      ) : displayComponent === "editService" ? (
        <div className="changeedit248">
          {isEditing !== null && (
            <EditService
              selectedService={services.find(
                (service) => service._id === selectedServiceId
              )}
              onSave={handleSaveEdit}
              onCancelEdit={handleEditCancel}
            />
          )}
        </div>
      ) : null}
      <ToastContainer />
    </div>
  );
};

export default ServiceForm;
