import React from 'react';
import { useNavigate, useLocation } from 'react-router';

const Buttons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="clicks_button_sett">
      <button
        className={location.pathname === '/Superadmindashboard' ? 'inside_settings1' : 'inside_settings'}
        onClick={() => handleNavigation("/Superadmindashboard")}
      >
        All Request
      </button>

      <button
        className={location.pathname === '/superdealer' ? 'inside_settings1' : 'inside_settings'}
        onClick={() => handleNavigation("/superdealer")}
      >
        All Distributor
      </button>

      <button
        className={location.pathname === '/SuperSubscription' ? 'inside_settings1' : 'inside_settings'}
        onClick={() => handleNavigation("/SuperSubscription")}
      >
        Plans
      </button>

      <button
        className={location.pathname === '/setting' ? 'inside_settings1' : 'inside_settings'}
        onClick={() => handleNavigation("/setting")}
      >
        Settings
      </button>

      <button
        className={location.pathname === '/Offers' ? 'inside_settings1' : 'inside_settings'}
        onClick={() => handleNavigation("/Offers")}
      >
        Offers
      </button>
    </div>
  );
};

export default Buttons;
