import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogoMatrical from "../images/LogoMatrical.png";
import "../styles/Subscription.css";
import axios from "axios";
import TermsAndConditionsPopup from "../pages/TermsAndConditionsPopup"; // Ensure correct path
import { BASE_URL } from "../Helper/helper";
import { IoArrowBackSharp } from "react-icons/io5";

const Subscription = () => {
  const navigate = useNavigate();
  const [baseAmount, setBaseAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedSaloonCount /*setSelectedSaloonCount*/] = useState(1);
  const [, /*salonId*/ setSalonId] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [adminName, setAdminName] = useState("");
  const [salonName, setSalonName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("registeredData"));
    if (storedData) {
      setAdminName(storedData.adminName);
      setSalonName(storedData.SalonName);
      setPhoneNumber(storedData.phoneNumber);
      setSalonId(storedData.salon_id);
    }

    const fetchPlans = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/active-plans`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchSalonId = () => {
      const salonId = localStorage.getItem("salon_id");
      if (salonId) {
        try {
          setSalonId(salonId); // Set salonId directly since it's retrieved as a string
        } catch (error) {
          console.error("Error setting salon_id:", error);
          // Handle error if needed
        }
      } else {
        console.error("salon_id not found in localStorage");
        // Handle case where salon_id is not found in localStorage
      }
    };

    fetchSalonId();
  }, []);

  const handlePlanSelection = (planId) => {
    if (selectedPlan === planId) {
      setSelectedPlan("");
      setBaseAmount(0);
      setGstAmount(0);
      setTotalAmount(0);
    } else {
      setSelectedPlan(planId);
      calculateTotalAmount(planId, selectedSaloonCount);
    }
  };

  const calculateTotalAmount = (planId, count) => {
    const plan = plans.find((p) => p._id === planId);
    if (plan) {
      const baseAmount = count * parseInt(plan.Amount, 10);
      const gstAmount = baseAmount * 0.18;
      const totalAmountWithGST = baseAmount + gstAmount;
      setTotalAmount(totalAmountWithGST);
      setBaseAmount(baseAmount);
      setGstAmount(gstAmount);
    }
  };

  const handlePayment = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan.");
      return;
    }
    if (termsAccepted) {
      try {
        const storedData = JSON.parse(localStorage.getItem("registeredData"));
        const phoneNumber = storedData ? storedData.phoneNumber : null;

        if (!phoneNumber) {
          toast.error("Phone number not found.");
          return;
        }

        // Fetch payment record to check status
        const paymentResponse = await axios.get(
          `${BASE_URL}/api/payment/status?phoneNumber=${phoneNumber}`
        );
        const paymentStatus = paymentResponse.data.status;

        if (paymentStatus === "Payment Done") {
          toast.error(
            "You are already subscribed. Please contact Super Admin."
          );
          return;
        }

        const response = await axios.post(
          `${BASE_URL}/api/payment/create-order`,
          { amount: totalAmount, phoneNumber }
        );

        const orderData = response.data.order;
        const salon_id = response.data.salon_id;

        // console.log("Order Data:", orderData);
        // console.log("Salon ID:", salon_id);
        const razorpayKey = process.env.RAZORPAY_KEY;

        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Formonex Solutions - OneSalon",
          description: "OneSalon Subscription",
          order_id: orderData.id,
          handler: async function (response) {
            try {
              const razorpay_payment_id = response.razorpay_payment_id;

              const result = await axios.put(
                `${BASE_URL}/api/payment/updatePaymentRecord`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  salon_id,
                  phoneNumber,
                  currency: orderData.currency,
                  amount: totalAmount,
                }
              );

              // console.log("Payment Response:", response);

              if (result.data.success) {
                navigate("/paymentsuccess", {
                  state: {
                    reference: razorpay_payment_id,
                    order_id: response.razorpay_order_id,
                    totalAmount,
                    subscription_startDate:
                      result.data.paymentRecord.subscription_startDate,
                  },
                });
              } else {
                toast.error("Payment verification failed.");
              }
            } catch (verificationError) {
              console.error(
                "Error in payment verification:",
                verificationError
              );
              toast.error("Payment verification failed.");
            }
          },
          prefill: {
            name: "Amith K",
            email: "amithk@matrical.in",
            contact: "9036686725",
          },
          notes: {
            address:
              "First Floor, Raghvendra Complex, BEML Layout 3rd Stage Rajarajeswari Nagar, Bengaluru, Karnataka - 560098",
          },
          theme: {
            color: "#F37254",
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on("payment.failed", function (response) {
          console.error(response.error);
          toast.error("Payment failed. Please try again.");
        });

        rzp1.open();
      } catch (error) {
        console.error("Error in payment:", error);
        toast.error("Error initiating payment. Please try again.");
      }
    } else {
      toast.error("Please accept the terms and conditions.");
    }
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setTermsAccepted(true);
  };
  const handleBackClick = () => {
    localStorage.clear();
    navigate(-1);
  };

  return (
    <div className={`mothercontainer923 ${isPopupOpen ? "blur" : ""}`}>
      <div className="subscription-containeruvwy">
        <ToastContainer />
        <div className="dsa45">
          <h2 className="subscription-heading">ONE SALON SUBSCRIPTION</h2>
        </div>
        <div className="subscription-body">
          <div className="subscription-info-container">
            <div className="subscription-info">
              <div className="gap5">
                <label htmlFor="adminName" className="info-label-subsricption1">
                  Welcome,
                </label>
                <input
                  type="text"
                  id="adminName"
                  value={adminName}
                  readOnly
                  className="info-input-subsricption"
                />
              </div>
              <div className="main231">
                <div className="gap5">
                  <label
                    htmlFor="salonName"
                    className="info-label-subsricption"
                  >
                    Salon Name
                  </label>
                  :
                  <input
                    type="text"
                    id="salonName"
                    value={salonName}
                    readOnly
                    className="info-input-subsricption"
                  />
                </div>

                <div className="gap5">
                  <label
                    htmlFor="phoneNumber"
                    className="info-label-subsricption"
                  >
                    Phone Number
                  </label>
                  :
                  <input
                    type="text"
                    id="phoneNumber"
                    value={phoneNumber}
                    readOnly
                    className="info-input-subsricption"
                  />
                </div>
                {/* <div className="gap5">
                  <label htmlFor="salonId" className="info-label-subsricption">
                    Salon ID
                  </label>
                  : {salonId}
                </div> */}
              </div>
            </div>
          </div>
          <div className="containerflex-23">
            <div className="subscription-plans">
              <h3 className="plan-heading">Select Plan</h3>
              <div className="plan-options">
                {plans.map((plan) => (
                  <div
                    key={plan._id}
                    className={`plan-option ${
                      selectedPlan === plan._id ? "selected" : ""
                    }`}
                    onClick={() => handlePlanSelection(plan._id)}
                  >
                    <p className="plan-price">{plan.PlanName}</p>
                    <p className="plan-price">Rs - {plan.Amount}</p>
                    <p className="plan-price">{plan.Duration} Days</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="total-amount">
              <h3 className="amount-heading">Total Amount</h3>
              <div className="amount-breakdown">
                <div className="cont410">
                  <p className="amount564">Base Amount </p>:&nbsp;&nbsp;{" "}
                  {baseAmount.toFixed(2)} Rs
                </div>
                <div className="cont410">
                  <p className="amount564">GST (18%)</p>:&nbsp;&nbsp;{" "}
                  {gstAmount.toFixed(2)} Rs
                </div>
                <div className="cont410">
                  <p className="amount564">Total Amount (incl. GST)</p>:
                  &nbsp;&nbsp;{totalAmount.toFixed(2)} Rs
                </div>
              </div>
              <div className="terms-checkbox">
                <input
                  type="checkbox"
                  id="termsCheckbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label
                  htmlFor="termsCheckbox"
                  onClick={handleOpenPopup}
                  style={{ cursor: "pointer" }}
                >
                  Accept <u>Terms and Conditions</u>
                </label>
              </div>
              <button className="payment-button" onClick={handlePayment}>
                Pay Now
              </button>
              <p onClick={handleBackClick} className="backButton">
                <IoArrowBackSharp />
                Back
              </p>
            </div>
          </div>

          <div className="service-provider">
            <div>
              <h3 className="provider-heading">Service Provider</h3>
              <img
                src={LogoMatrical}
                alt="Service Provider"
                className="provider-image"
              />
            </div>
            <p className="matcssxyz">
              @Powered by{" "}
              <a href="https://www.matrical.in/" className="matrical-link">
                Formonex Solutions
              </a>
            </p>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="modal18">
          <TermsAndConditionsPopup
            isOpen={isPopupOpen}
            onClose={handleClosePopup}
          />
        </div>
      )}
    </div>
  );
};

export default Subscription;
