import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "../styles/Dealersalondetails.css";
import DealersNavbar from "./DealersNavbar";
import { BASE_URL } from "../Helper/helper.js";

const Dealersalondetails = () => {
  const { branchName } = useParams();
  const navigate = useNavigate();
  const [view, setView] = useState("new");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const dealerId = localStorage.getItem("dealerId"); // Get dealerId from local storage
        const response = await axios.get(`${BASE_URL}/api/dealers/branch-products/${branchName}`, {
          params: { dealerId } // Pass dealerId as a query parameter
        });
        const formattedOrders = response.data.map(order => ({
          ...order,
          deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : "",
        }));
        setOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchOrders();
  }, [branchName]);

  const filteredOrders = orders
    .filter((order) => {
      const orderDate = new Date(order.purchaseDate);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

    if (from && orderDate < from) return false;
    if (to && orderDate > to) return false;
    return true;
  }).filter((order) => {
    if (view === "new" && (order.status === "Accepted" || order.status === "Ordered")) return true;     
    if (view === "previous" && order.status === "Delivered") return true;
    if (view === "cancel" && order.status === "Cancelled") return true;
    return false;
  });

  const handleDeliveryDateChange = async (orderId, newDate) => {
    try {
      await axios.put(`${BASE_URL}/api/dealers/update-delivery-date`, {
        orderId,
        deliveryDate: newDate,
      });
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, deliveryDate: newDate } : order
        )
      );
      toast.success("Delivery Date Updated successfully!");
    } catch (error) {
      console.error("Error updating delivery date:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/api/dealers/update-order-status`, {
        orderId,
        status: newStatus,
      });
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Status Updated successfully!");
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleProductUpdate = async (orderId, productId, newAvailability, newAvailableQuantity) => {
    try {
      // Send the update request to the backend
      await axios.put(`${BASE_URL}/api/dealers/update-available-quantity`, { 
        orderId, 
        productId, 
        availability: newAvailability,
        availableQuantity: newAvailableQuantity 
      });
  
      // Update the local state
      setOrders(
        orders.map(order =>
          order._id === orderId
            ? {
                ...order,
                tableData: order.tableData.map(item =>
                  item._id === productId 
                    ? { ...item, availability: newAvailability, availableQuantity: newAvailableQuantity }
                    : item
                )
              }
            : order
        )
      );
      toast.success("Updated successfully!");
    } catch (error) {
      console.error('Error updating product availability and quantity:', error);
    }
  };  


  return (
    <div className="dashboard-container-unique">
      <DealersNavbar />
      <ToastContainer />
      <div className="content-unique">
      <div className="gap930">
        <h2 className="salon-name-unique">{branchName}</h2>
        
            <button
              className="back-button-unique"
              onClick={() => navigate("/Dealerdashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        <div className="orders-section-unique">
          
        <div className="gap89">
          <button
            className="order-button-unique"
            onClick={() => setView("new")}
          >
            New Orders
          </button>
          <button
            className="order-button-unique"
            onClick={() => setView("previous")}
          >
            Delivered Orders
          </button>
          <button
            className="order-button-unique"
            onClick={() => setView("cancel")}
          >
            Cancelled Orders
          </button>
          </div>
         
        </div>

        <div className="details-section-unique">
          <div className="datefilters56">
            <h3 className="table-title-unique">
              {view === "new" ? "New Orders" : "Order"} Details
            </h3>
            <div className="date-filters">
              <label>
                From :{" "}
                <input
                  className="date-input"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </label>
              <label>
                To :{" "}
                <input
                  className="date-input"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="table32">
          <table className="orders-table-unique">
  <thead>
    <tr>
      <th className="table-header-unique">Purchase Order Id</th>
      <th className="table-header-unique">Category</th>
      <th className="table-header-unique">Company</th>
      <th className="table-header-unique">Product Name</th>
      <th className="table-header-unique">Unit Quantity</th>
      <th className="table-header-unique">Order Date</th>
      <th className="table-header-unique">Delivery Date</th>
      <th className="table-header-unique">Order Status</th>
    </tr>
  </thead>
  <tbody>
    {filteredOrders.map((order) => (
      <React.Fragment key={order._id}>
        <tr>
          <td className="table-data-unique">
            
            <p className="a675" href="#" onClick={() => setSelectedOrder(order)}>
              {order.purchaseOrderId}
            </p>
          </td>
          <td className="table-data-unique">
              {order.tableData.map((data, index) => (
                <React.Fragment key={data.product}>
                  {data.categoryName}
                  {index < order.tableData.length - 1 && (
                    <hr style={{ margin: '5px 0', borderTop: '2px solid #ffffff' }} />
                  )}
                </React.Fragment>
              ))}
          </td>
          <td className="table-data-unique">
            {order.tableData.map((data, index) => (
              <React.Fragment key={data.product}>
                {data.company}
                {index < order.tableData.length - 1 && (
                  <hr style={{ margin: '5px 0', borderTop: '2px solid #ffffff',color: 'rgb(255,255,255)' }} />
                )}
              </React.Fragment>
            ))}
          </td>
          <td className="table-data-unique">
            {order.tableData.map((data, index) => (
              <React.Fragment key={data.product}>
                {data.productName}
                {index < order.tableData.length - 1 && (
                  <hr style={{ margin: '5px 0', borderTop: '2px solid #ffffff',color: 'rgb(255,255,255)' }} />
                )}
              </React.Fragment>
            ))}
          </td>
          <td className="table-data-unique">
            {order.tableData.map((data, index) => (
              <React.Fragment key={data.product}>
                {data.quantity}{data.unit}
                {index < order.tableData.length - 1 && (
                  <hr style={{ margin: '5px 0', borderTop: '2px solid #ffffff',color: 'rgb(255,255,255)' }} />
                )}
              </React.Fragment>
            ))}
          </td>
          <td className="table-data-unique">{order.purchaseDate}</td>
          <td className="table-data-unique">
            <input
              className="date-input"
              type="date"
              value={order.deliveryDate || ""}
              onChange={(e) => handleDeliveryDateChange(order._id, e.target.value)}
            />
          </td>
          <td className="table-data-unique">
            <select
              className="select45"
              value={order.status}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
            >
              <option className="option00" value="">Select</option>
              <option className="option00" value="Accepted">Accepted</option>
              <option className="option00" value="Cancelled">Cancelled</option>
              <option className="option00" value="Delivered">Delivered</option>
            </select>
          </td>
        </tr>
      </React.Fragment>
    ))}
  </tbody>
</table></div>

        </div>
      </div>

      {selectedOrder && (
        <div className="popup-overlay51">
          <div className="popup-content51">
            <h2 className="heading12">Order Details for {selectedOrder.purchaseOrderId}</h2>
           <div className="table30">
            <table className="details-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Description</th>
                  <th>Unit</th>
                  <th>Ordered Quantity</th>
                  <th>Available Quantity</th>
                  <th>Select Quantity</th>
                  <th>Availability</th>
                  <th>Actions</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.tableData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>{item.productDescription}</td>
                    <td>{item.quantity}{item.unit}</td>
                    <td>{item.Productquantity}</td>
                    <td>{item.availableQuantity}</td>
                    <td>
                          <input
                          className="input58"
                          type="number"
                          value={item.availableQuantity || ""}
                          min={0}
                          onChange={(e) => {
                            const newAvailableQuantity = parseInt(e.target.value, 10);
                            if (newAvailableQuantity > item.Productquantity) {
                              setSelectedOrder({
                                ...selectedOrder,
                                tableData: selectedOrder.tableData.map((data, i) =>
                                  i === index ? { ...data, availableQuantity: item.Productquantity } : data
                                ),
                              });
                            } else {
                              setSelectedOrder({
                                ...selectedOrder,
                                tableData: selectedOrder.tableData.map((data, i) =>
                                  i === index ? { ...data, availableQuantity: newAvailableQuantity } : data
                                ),
                              });
                            }
                          }}
                        />
                    </td>
                    <td>{item.availability}</td>
                    <td>
                      <select
                      className="input58"
                         value={item.availability || ""}
                         onChange={(e) => setSelectedOrder({
                           ...selectedOrder,
                           tableData: selectedOrder.tableData.map((data, i) =>
                             i === index ? { ...data, availability: e.target.value } : data
                           ),
                         })}
                      >
                        <option value="">Select</option>
                        <option value="InStock">InStock</option>
                        <option value="OutOfStock">OutOfStock</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleProductUpdate(
                          selectedOrder._id,
                          item._id,
                          item.availability,
                          item.availableQuantity
                        )}
                        className="update-popup-button"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <div className="hii_button">
            <button className="close-popup-button" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dealersalondetails;