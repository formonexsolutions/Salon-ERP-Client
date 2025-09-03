import React, { useState } from "react";
import classNames from "classnames";
import "../styles/SalonPopup.css";

const SuperAdminSalonPopup = ({
  salonDetails,
  adminDetails,
  subscriptionDetails,
  adminErrorMessage,
  subscriptionErrorMessage,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState("");

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const renderSalonDetails = () => (
    <>
      <div className="popupwif89">
        <p className="popuppara89">Salon ID</p>: {salonDetails.salon_id}
      </div>
      <div className="popupwif89">
        <p className="popuppara89">Salon Name</p>: {salonDetails.SalonName}
      </div>
      <div className="popupwif89">
        <p className="popuppara89">Admin Name</p>: {salonDetails.adminName}
      </div>
      <div className="popupwif89">
        <p className="popuppara89">State</p>: {salonDetails.state}
      </div>
      <div className="popupwif89">
        <p className="popuppara89">City</p>: {salonDetails.city}
      </div>
      <div className="popupwif89">
        <p className="popuppara89">Approved Status</p>:{" "}
        {salonDetails.approvedstatus}
      </div>
      <div className="popupwif89">
        <p className="popuppara89">Status</p>: {salonDetails.status}
      </div>
    </>
  );

  const renderAdminDetails = () => (
    <>
      <div className="popupwif89">
        <p className="popuppara89">Admin Name</p>: {adminDetails.adminName}
      </div>
      <div className="popupwif89">
        <p className="popuppara89">Phone Number</p>: {adminDetails.phoneNumber}
      </div>
      <div className="popupwif89">
        <p className="popuppara89">Role</p>: {adminDetails.role}
      </div>
      <div className="popupwif89">
        <p className="popuppara89">CreatedBy</p>: {adminDetails.createdBy}
      </div>
      <div className="popupwif89">
        <p className="popuppara89">Status</p>: {adminDetails.status}
      </div>
    </>
  );

  const renderSubscriptionDetails = () => {
    // Convert subscription start date and expiry date to Date objects
    const startDate = new Date(subscriptionDetails.subscription_startDate);
    const expiryDate = new Date(subscriptionDetails.subscription_expiryDate);

    // Format subscription start date and expiry date as dd/mm/yy
    const formattedStartDate = startDate.toLocaleDateString("en-GB");
    const formattedExpiryDate = expiryDate.toLocaleDateString("en-GB");

    return (
      <>
        <div className="popupwif89">
          <p className="popuppara894">Salon ID </p>:{" "}
          {subscriptionDetails.salon_id}
        </div>
        <div className="popupwif89">
          <p className="popuppara894">Subscription ID</p>:{" "}
          {subscriptionDetails.subscription_id}
        </div>
        <div className="popupwif89">
          <p className="popuppara894">Amount</p>: {subscriptionDetails.amount}
        </div>
        <div className="popupwif89">
          <p className="popuppara894">Currency</p>:{" "}
          {subscriptionDetails.currency}
        </div>
        <div className="popupwif89">
          <p className="popuppara894">Status</p>: {subscriptionDetails.status}
        </div>
        <div className="popupwif89">
          <p className="popuppara894">Subscription Start date</p>:{" "}
          {formattedStartDate}
        </div>
        <div className="popupwif89">
          <p className="popuppara894">Subscription Expiry date</p>:{" "}
          {formattedExpiryDate}
        </div>
      </>
    );
  };

  return (
    <div className="pop-container">
      <div className="pop">
        <div className="salon-name-header">
          <h1 className="he_sa_heh_ss">{salonDetails.SalonName}</h1>
        </div>
        <div
          className={classNames("div_3_cont_sa", {
            error: adminErrorMessage || subscriptionErrorMessage,
          })}
        >
          <div className="pop_inner">
            <h2
              onClick={() => handleSectionClick("salon")}
              className="hehe_sa_gaga"
            >
              Salon Details
            </h2>
            {activeSection === "salon" && renderSalonDetails()}
          </div>
          <div className="popupwif890">
            <h2
              onClick={() => handleSectionClick("admin")}
              className="hehe_sa_gaga"
            >
              Admin Details
            </h2>
            {activeSection === "admin" &&
              (adminErrorMessage ? (
                <p className="popuppara89">{adminErrorMessage}</p>
              ) : (
                renderAdminDetails()
              ))}
          </div>
          <div className="popupwif890">
            <h2
              onClick={() => handleSectionClick("subscription")}
              className="hehe_sa_gaga"
            >
              Subscription Details
            </h2>
            {activeSection === "subscription" &&
              (subscriptionErrorMessage ? (
                <p className="popuppara89">{subscriptionErrorMessage}</p>
              ) : (
                renderSubscriptionDetails()
              ))}
          </div>
        </div>
        <div className="hhh_burr_sa">
          <button onClick={onClose} className="butt_close">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSalonPopup;
