import React, { useEffect, useState } from 'react';
import Salonlogo from '../images/Salon-logo.png';
import { IoMdNotifications } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { BASE_URL } from '../Helper/helper.js'; // Adjust the import path if necessary
import "../styles/DealersNavbar.css";

const DealersNavbar = () => {
    const navigate = useNavigate();
    const [todayOrdersCount, setTodayOrdersCount] = useState(0);

    useEffect(() => {
        const fetchTodayOrdersCount = async () => {
            try {
                const dealerId = localStorage.getItem('dealerId');
                const response = await axios.get(`${BASE_URL}/api/order-statistics?dealerId=${dealerId}`);
                setTodayOrdersCount(response.data.todayOrders);
            } catch (error) {
                console.error('Error fetching today orders count:', error);
            }
        };

        fetchTodayOrdersCount();
    }, []);

    // const handleInventory = () => {
    //     navigate("/DealerInventory");
    // };

    const DealerId = localStorage.getItem("dealerId");
    const DealerName = localStorage.getItem("DealerName");
    
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };
    
    const handleCategory = () => {
        navigate("/Dealercateogy");
    };

    return (
        <div>
            <nav className="navbar843">
                <img src={Salonlogo} alt="Logo" className="logo315" />
                <h1 className="navbar-title284">Distributor's Dashboard</h1>
                <div className="div579">
                    <button className="inv_but" onClick={handleCategory}>CATEGORY</button>
                   { /*<button className="inv_but" onClick={handleInventory}>INVENTORY</button>*/}
                    <div className="notification-container">
                        <IoMdNotifications className="icon802" />
                        <span className="notification-count">{todayOrdersCount}</span>
                    </div>
                    <div className="tooltip-popup611">
                        <FaUserCircle className="navbar-button920" />
                        <div className="popup-content763">
                            <div className="user656">
                                <div className="user65">
                                    <p>Distributor ID</p>:<span>{DealerId}</span>
                                </div>
                                <div className="user65">
                                    <p>Distributor Name</p>:<span>{DealerName}</span>
                                </div>
                            </div>
                            <div className="btnspopup">
                                <button className="logout-button784" onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default DealersNavbar;
