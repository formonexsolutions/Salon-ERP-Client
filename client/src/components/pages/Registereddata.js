import React from "react";
import { Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import "../styles/SuperNavbar.css";
import Salonlogo from "../images/Salonlogo.png";

const Registereddata = () => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const createdBy = localStorage.getItem("superAdminName") || "superadmin";
  const superAdminId = localStorage.getItem("superAdminId");
  const userRole = localStorage.getItem("userRole");
  const handleProfileClick = () => {
    setShowProfilePopup(!showProfilePopup); // Toggle the profile popup
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    alert("Logging out...");
    navigate("/");
  };

  const handleallrequest = () =>{
    navigate('/superadmin');
  }
  const handleexisting = () =>{
    navigate('/activate');
  }
  const handleregistered = () =>{
    navigate('/registereddata');
  }
  const handlesettings = () =>{
    navigate('/setting');
  }
  const handleplans = () =>{
    navigate('/SuperSubscription');
  }
  
  return (
    <div>
             <div className="header_part_log">
       <div className="dashboard-salon239012345">
          <img src={Salonlogo} alt="Salonlogo" className="logo-salon" />
          </div>
      <div>
     
        <p className="text_header_log346765"> Welcome! {localStorage.getItem("superAdminName")}</p>
      </div>
      <div className="butt_header_log-logoutButton">
        <button className="button_hed_log-profileButton" onClick={handleProfileClick}>
        
          <div className="text-profileButton4ret">
            <img className="imagdfs4563257" src="https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"/>
          </div>
        </button>
      </div>
      {showProfilePopup && (
        <div className="popup12355e">
          <div >
            <p className="ijuiyuhjt">UserId : {superAdminId}</p>&nbsp;&nbsp;&nbsp;&nbsp;
            <p className="jjnhjjgjh">Role : {userRole}</p>&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
          <button className="button_hed_log-logoutButtonrgy" onClick={handleLogout}>
            Logout
          </button>
          <button className="popup-close" onClick={handleProfileClick}>
            Close
          </button>  
        </div>
      )}
      </div>


      <div className="clicks_button_sett">
        <div>
          <button className="inside_settings" onClick={handleallrequest}> All Request</button>
        </div>

        <div>
          <button className="inside_settings" onClick={handleexisting}>Existing Salon</button>
        </div>

        <div>
          <button className="inside_settings1" onClick={handleregistered}>Registered Data</button>
        </div>

        <div>
          <button className="inside_settings" onClick={handlesettings}>Settings</button> 
        </div>

        <div>
          <button className="inside_settings" onClick={handleplans}>Plans</button>
        </div>
      </div>

      {/* <div className="reg_data">Registered Data</div> */}
    </div>
  );
};

export default Registereddata;
