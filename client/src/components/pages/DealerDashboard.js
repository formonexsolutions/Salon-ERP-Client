import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaClipboardList, FaCalendarDay } from "react-icons/fa";
import { MdPending, MdDoneAll, MdCancel } from "react-icons/md";
import axios from 'axios';
import "../styles/DealerDashboard.css";
import DealersNavbar from "./DealersNavbar";
import { BASE_URL } from "../Helper/helper.js";

const DealerDashboard = () => {
  const [branches, setBranches] = useState([]);
  const [/*orders*/, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    pendingOrders: 0,
    
    deliveredOrders: 0,
    cancelledOrders: 0
  });
  const [/*selectedBranch*/, setSelectedBranch] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const dealerId = localStorage.getItem('dealerId');
        const response = await axios.get(`${BASE_URL}/api/dealers/branch-details?dealerId=${dealerId}`);
        const uniqueBranches = filterUniqueBranches(response.data);
        setBranches(uniqueBranches);
      } catch (error) {
        console.error('Error fetching branch details:', error);
      }
    };

    const fetchOrderStatistics = async () => {
      try {
        const dealerId = localStorage.getItem('dealerId');
        const response = await axios.get(`${BASE_URL}/api/order-statistics?dealerId=${dealerId}`);
        setOrderStats(response.data);
      } catch (error) {
        console.error('Error fetching order statistics:', error);
      }
    };

    fetchBranches();
    fetchOrderStatistics();
  }, []);

  const fetchOrders = async (branchId) => {
    try {
      const dealerId = localStorage.getItem('dealerId');
      const response = await axios.get(`${BASE_URL}/api/purchase-details?branchId=${branchId}&dealerId=${dealerId}`);
      setOrders(response.data);

      // Mark today's orders as viewed
      await axios.post(`${BASE_URL}/api/mark-orders-as-viewed`, { dealerId });

      // Fetch updated order statistics
      const updatedOrderStats = await axios.get(`${BASE_URL}/api/order-statistics?dealerId=${dealerId}`);
      setOrderStats(updatedOrderStats.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
    fetchOrders(branch._id);
  };

  const filterUniqueBranches = (branches) => {
    const uniqueBranchNames = new Set();
    const uniqueBranches = [];

    branches.forEach(branch => {
      if (!uniqueBranchNames.has(branch.branchName)) {
        uniqueBranchNames.add(branch.branchName);
        uniqueBranches.push(branch);
      }
    });

    return uniqueBranches;
  };

  return (
    <div className="dashboard-container943">
      <DealersNavbar />
      <div className="dashboard-content142">
        <div className="mothercontainer45">
          <div className="box76">
            <div className="conbox7">
              <FaClipboardList style={{ color: "#2196F3" }} />
              <h1>{orderStats.totalOrders}</h1>
              <p>Total Orders</p>
            </div>
            <div className="conbox7">
              <FaCalendarDay style={{ color: "#FF5722" }} />
              <h1>{orderStats.todayOrders}</h1>
              <p>Today's Orders</p>
            </div>
            <div className="conbox7">
              <MdPending style={{ color: "#FFC107" }} />
              <h1>{orderStats.pendingOrders}</h1>
              <p>Pending Orders</p>
            </div>
            <div className="conbox7">
              <MdDoneAll style={{ color: "#4CAF50" }} />
              <h1>{orderStats.deliveredOrders}</h1>
              <p>Delivered Orders</p>
            </div>
            <div className="conbox7">
              <MdCancel style={{ color: "#F44336" }} />
              <h1>{orderStats.cancelledOrders}</h1>
              <p>Cancelled Orders</p>
            </div>
          </div>
          <div className="table-section313">
            <table className="orders-table728">
              <thead className="thsticky">
                <tr>
                  <th className="table-header638">Salon Name</th>
                  <th className="table-header638">Phone Number</th>
                  <th className="table-header638">Address</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch, index) => (
                  <tr key={index} onClick={() => handleBranchClick(branch)}>
                    <td className="table-data964">
                      <Link to={`/Dealersalondetails/${branch.branchName}`} className="salon-link">{branch.branchName}</Link>
                    </td>
                    <td className="table-data964">{branch.phoneNumber}</td>
                    <td className="table-data964">{branch.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;