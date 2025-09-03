import React, { useEffect, useState } from "react";
import "../styles/Superadmindashboard.css";
import axios from "axios";
import "../styles/SuperNavbar.css";
import Salonlogo from "../images/Salonlogo.png";
import { useNavigate } from "react-router-dom";
import SalonPopup from "../pages/SalonPopup";
import { BASE_URL } from "../Helper/helper";

const ExistingSalon = () => {
  const [approvedSalons, setApprovedSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const navigate = useNavigate();
  const [/*changePopup*/, setChangePopup] = useState(false);
  const createdBy = localStorage.getItem("superAdminName") || "superadmin";

  useEffect(() => {
    fetchApprovedSalons();
  }, []);

  const fetchApprovedSalons = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/approved`);
      setApprovedSalons(response.data);
    } catch (error) {
      console.error("Error fetching approved salons", error);
    }
  };

  const handleLogout = () => {
    alert("Logging out...");
    navigate("/");
  };

  const toggleActivation = async (salonId, currentActivation) => {
    try {
      const newActivation =
        currentActivation === "Activated" ? "Deactivated" : "Activated";
      const response = await axios.put(
        `${BASE_URL}/api/${salonId}/activation`,
        { activation: newActivation }
      );
      if (response.status === 200) {
        fetchApprovedSalons(); // Fetch updated salon list after successful update
      }
    } catch (error) {
      console.error("Error toggling salon activation", error);
    }
  };

  const openSalonPopup = (salon) => {
    setSelectedSalon(salon);
  };

  const closeSalonPopup = () => {
    setSelectedSalon(null);
  };
  const handleallrequest = () => {
    navigate("/superadmin");
  };

  const handleOpenChangePopup = () => {
    setChangePopup(true);
  };
  const handleexisting = () => {
    navigate("/activate");
  };
  const handleregistered = () => {
    navigate("/registereddata");
  };
  const handlesettings = () => {
    navigate("/setting");
  };
  const handleplans = () => {
    navigate("/SuperSubscription");
  };


  return (
    <div>
      <div className="header_part_log">
        <div className="dashboard-salon239012345">
          <img src={Salonlogo} alt="Salonlogo" className="logo-salon" />
        </div>
        <div></div>
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

            <div className="tooltip-dropdown">
              <div style={{ color: "black" }}>
                <p className="loggen-name-1123">Welcome:{createdBy}</p>
                {/* <p className="jjnhjjgjh">Role: {userRole}</p> */}
                &nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <div className="bu_hj_log">
                <button className="passchange" onClick={handleOpenChangePopup}>
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

      <div className="clicks_button_sett">
        <div>
          <button className="inside_settings" onClick={handleallrequest}>
            {" "}
            All Request
          </button>
        </div>

        <div>
          <button className="inside_settings1" onClick={handleexisting}>
            Existing Salon
          </button>
        </div>

        <div>
          <button className="inside_settings" onClick={handleregistered}>
            Registered Data
          </button>
        </div>

        <div>
          <button className="inside_settings" onClick={handlesettings}>
            Settings
          </button>
        </div>

        <div>
          <button className="inside_settings" onClick={handleplans}>
            Plans
          </button>
        </div>
      </div>

      <div className="tab_superadmin">
        <table>
          <thead>
            <tr>
              <th>Salon Name</th>
              <th>Admin</th>
              <th>City</th>
              <th>Area</th>
              <th>Status</th>
              <th>Activation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {approvedSalons.map((item) => (
              <tr key={item._id}>
                <td onClick={() => openSalonPopup(item)}>{item.SalonName}</td>
                <td onClick={() => openSalonPopup(item)}>{item.adminName}</td>
                <td>{item.city}</td>
                <td>{item.state}</td>
                <td>{item.status}</td>
                <td>{item.activation}</td>
                <td>
                  <button
                    className={`butt_act_dea ${
                      item.activation === "Activated"
                        ? "deactivate"
                        : "activate"
                    }`}
                    onClick={() => toggleActivation(item._id, item.activation)}
                  >
                    {item.activation === "Activated"
                      ? "Deactivate"
                      : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedSalon && (
        <SalonPopup salonDetails={selectedSalon} onClose={closeSalonPopup} />
      )}
    </div>
  );
};

export default ExistingSalon;
