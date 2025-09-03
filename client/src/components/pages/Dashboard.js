import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import Vector5 from "../images/Vector5.png";
import calendar from "../images/New_Calendar.png";
import Group from "../images/Group.png";
import Vector4 from "../images/Vector4.png";
import Vector from "../images/Vector.png";
import Vector1 from "../images/Vector1.png";
import { toast, ToastContainer } from "react-toastify";
import Vector3 from "../images/Vector3.png";
import Dealer from "../images/support2.png"
import Inventory from "../images/product-evaluation_16314413.png";
import good from "../images/BillgenerateIcon.png";
import Chart1 from "../images/Chart1.png";
import settings1 from "../images/settings1.png";
import axios from "axios";
import Calendar from "./Calendar.jsx";
import AddEmployee from "./AddEmployee.js";
import NewAppointment from "./newappointment.js";
import EditProfile from "./EditProfile.js";
import SubscriptionInfo from "./SubscriptionInfo.js";
import Appointments from "./appointments.js";
import InventoryList from "./InventoryList.js";
import DealInventory from "./DealersInventoryList.js"
import total from "../images/AppoinmentsIcon.png";
import ProductList from "./ProductList.js";
// import Suppliers from "./Suppliers.js";
import ServiceForm from "./Service.js";
import { useNavigate } from "react-router-dom";
import AddProduct from "./AddProduct.js";
import AddCustomer from "./AddCustomer.js";
import PurchaseProduct from "./PurchaseProduct.js";
import BillingForm from "./Billing.js";
import AddService from "./AddService.js";
import CustomerTable from "./CustomerTable.js";
// import AddSupplier from "./AddSupplier.js";
import StockSelfUse from "./StockSelfUse.js";
import Messages from "./Messages.js";
import BillingTable from "./Reports.js";
import CustomerDetails from "./CustomerDetails.js";
import Employees from "./Employees.js";
import { BASE_URL } from "../Helper/helper.js";
import Salonlogo from "../images/Salon-logo.png";
import AddBranch from "./AddBranch.js";
import ManageBranch from "./ManageBranch.js";
import Addbranchicon from "../images/window_14708164.png";
import PurchaseManageDealers from "./PurchaseManageDealers.js";
function Dashboard() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedButton, setSelectedButton] = useState("");
  const [, /*showAddBranchForm*/ setShowAddBranchForm] = useState(false); // State to control the visibility of the Add Branch form
  const [, /*showAddSalonForm*/ setShowAddSalonForm] = useState(false); // State to control the visibility of the Add Salon form
  const [alertShown, setAlertShown] = useState(false);
  const [totalInventoryAmount, setTotalInventoryAmount] = useState(0); // Declare totalInventoryAmount
  const [totalServiceAmount, setTotalServiceAmount] = useState(0); // Declare totalServiceAmount
  const [totalNumberOfBills, setTotalNumberOfBills] = useState(0);
  const [totalNumberOfAppointments, setTotalNumberOfAppointments] = useState(0);

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  // const branch_id = localStorage.getItem("branch_id");
  // const branchName = localStorage.getItem("branchName");

  const adminName = localStorage.getItem("adminName");
  // console.log("Retrieved Admin Name:", adminName);
  const employeeName = localStorage.getItem("employeeName");
  const handleButtonClick = (buttonName, customerData) => {
    setSelectedButton(buttonName);
    setCustomer(customerData);
    setSelectedCustomer(customerData);
  };

  useEffect(() => {
    // console.log("Admin Name:", adminName);
    // console.log("Employee Name:", employeeName);
  }, [adminName, employeeName]);
  // console.log("Admin Name in localStorage:", localStorage.getItem("adminName"));
  // console.log("Employee Name in localStorage:",localStorage.getItem("employeeName")
  // );

  // useEffect(() => {
  //   // console.log("Fetching customer data...");

  //   // Retrieve branchId from localStorage
  //   const branchId = localStorage.getItem("branch_id");
  //   if (!branchId) {
  //     // console.error("Branch ID not found in local storage");
  //     return;
  //   }

  //   const requestConfig = {
  //     headers: `{ Authorization: Bearer ${token} }`,
  //   };

  //   // Construct the request URL with the branchId query parameter
  //   const requestUrl = `${BASE_URL}/api/customers/daily-statistics?branchId=${branchId}`;

  //   // console.log("Request URL:", requestUrl);
  //   // console.log("Request Config:", requestConfig);

  //   axios
  //     .get(requestUrl, requestConfig)
  //     .then((response) => {
  //       const statistics = response.data;

  //       const {
  //         serviceAmount,
  //         inventoryAmount,
  //         billsGenerated,
  //         appointmentsCount,
  //       } = statistics;

  //       setTotalServiceAmount(serviceAmount);
  //       setTotalInventoryAmount(inventoryAmount);
  //       setTotalNumberOfBills(billsGenerated);
  //       setTotalNumberOfAppointments(appointmentsCount);
  //     })
  //     .catch((error) => {
  //       // console.error("Error fetching customer data:", error);
  //       if (error.response) {
  //         // console.error("Response data:", error.response.data);
  //         // console.error("Response status:", error.response.status);
  //         // console.error("Response headers:", error.response.headers);
  //       } else if (error.request) {
  //         // console.error("Request data:", error.request);
  //       } else {
  //         // console.error("Error message:", error.message);
  //       }
  //     });
  // }, [token]);


  useEffect(() => {
    // Retrieve branchId from localStorage
    const branchId = localStorage.getItem("branch_id");
    if (!branchId) {
      console.error("Branch ID not found in local storage");
      return;
    }
  
    // Check for token availability
    if (!token) {
      console.error("Token is missing");
      return;
    }
  
    const requestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    // Construct the request URL with the branchId query parameter
    const requestUrl = `${BASE_URL}/api/customers/daily-statistics?branchId=${branchId}`;
  
    axios
      .get(requestUrl, requestConfig)
      .then((response) => {
        const statistics = response.data;
        const {
          serviceAmount = 0,
          inventoryAmount = 0,
          billsGenerated = 0,
          appointmentsCount = 0,
        } = statistics;
  
        setTotalServiceAmount(serviceAmount);
        setTotalInventoryAmount(inventoryAmount);
        setTotalNumberOfBills(billsGenerated);
        setTotalNumberOfAppointments(appointmentsCount);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  }, [token]);
  

  const handleLogout = () => {
    // Clear the token

    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("adminName");
    localStorage.removeItem("employeeName");
    localStorage.removeItem("branch_id");
    localStorage.removeItem("branchName");
    localStorage.removeItem("salon_id");
    localStorage.removeItem("phoneNumber");

    // Redirect to the login page
    navigate("/");
  };

  useEffect(() => {
    // Use token here or fetch data
  }, [token]);

  useEffect(() => {
    if (
      (selectedButton === "Employees" ||
        selectedButton === "Add Branch" ||
        selectedButton === "Manage Branch" ||
        selectedButton === "Reports" ||
        selectedButton === "Services") &&
      userRole !== "admin" &&
      userRole !== "adminName" &&
      !alertShown
    ) {
      setAlertShown(true);
      toast.error("You must be logged in as an admin to access this page.");
    }
  }, [selectedButton, alertShown, userRole]);

  return (
    <div className="master-container-salon">
      <div className="fixed-container678">
        <div className="dashboard-salon2390">
          <img className="header-h1" src={Salonlogo} alt="Salon logo" />

          <div className="logostyle23">
            <div className="logostyle23">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="0"
                viewBox="0 0 24 24"
                className="logo-sizing23"
                height="10px"
                width="10px"
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
              <div style={{ color: "white" }} className="popup0219">
                <div className="pop650">
                  {" "}
                  <p className="user-info-role">Role </p>: <p>{userRole}</p>
                </div>
                <div className="pop650">
                  {" "}
                  <p className="user-info-role">Staff Id </p>: <p>{userId}</p>
                </div>
                <div style={{ color: "white" }}>
                  {userRole === "admin" &&
                    (adminName ? (
                      <div className="pop650">
                        {" "}
                        <p className="user-info-role"> Name </p>:
                        <p>{adminName}</p>
                      </div>
                    ) : (
                      employeeName && (
                        <div className="pop650">
                          <p className="user-info-role">Name </p>:
                          <p>{employeeName}</p>
                        </div>
                      )
                    ))}
                  {userRole !== "admin" && employeeName && (
                    <div className="pop650">
                      {" "}
                      <p className="user-info-role">Name </p>:
                      <p>{employeeName}</p>
                    </div>
                  )}
                </div>
                <div className="pop650">
                  <p className="user-info-role">Salon id </p>: <p>{localStorage.getItem("salon_id")}</p>
                </div>
                {localStorage.getItem("branch_id") !== "" &&
                  localStorage.getItem("branchName") !== "" && (
                    <div>
                      <div className="pop650">
                        <p className="user-info-role">Branch id</p>:{" "}
                        <p>{localStorage.getItem("branch_id")}</p>
                      </div>
                      <div className="pop650">
                        <p className="user-info-role">Branch Name</p>:{" "}
                        <p>{localStorage.getItem("branchName")}</p>
                      </div>
                    </div>
                  )}
              </div>
              <div className="hgr56">
                <button
                  className="dropdown-item-salon231 red4"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              
                {/* {localStorage.getItem("adminName") && (
                  <button
                    className="dropdown-item-salon231"
                    onClick={() => setSelectedButton("Edit profile")}
                  >
                    Edit profile
                  </button>
                )} */}
             
              <button
                className="dropdown-item-salon231"
                onClick={() => setSelectedButton("SubscriptionInfo")}
              >
                Subscription Info
              </button>
            </div>
            </div>
          </div>
        </div>

        <div className="dashboard-salon23">
        <button
            className="dashboard-button-salon23"
            onClick={() => handleButtonClick("Customers")}
          >
            {" "}
            <div className="icon-center23 ">{/* <AiFillDatabase /> */}</div>
            <img src={Vector4} alt="" className="setting icon997"></img>
            <div className="name234">CUSTOMERS</div>
          </button>

          <button
            className="dashboard-button-salon23"
            onClick={() => handleButtonClick("Appointments")}
          >
            <div className="icon-center23 ">
              {/* <FaUsers /> */}
              <img src={Group} alt="" className="icon997"></img>
            </div>
            <div className="name234">APPOINTMENTS</div>
          </button>

          <button
            className="dashboard-button-salon23"
            onClick={() => setSelectedButton("Calendar")}
          >
            <div className="icon-center23 ">
              <img
                src={calendar}
                style={{ height: "29px" }}
                alt=""
                className="setting icon997"
              ></img>
              {/* <img src={calendar} alt="" className="calenadr icon997"></img>{" "} */}
            </div>
            <div className="name234">CALENDER</div>
          </button>
          <button
            className="dashboard-button-salon23"
            onClick={() => setSelectedButton("Billing")}
          >
            <div className="icon-center23 ">
              {/* <FaMoneyBillWaveAlt /> */}
              <img src={Vector5} alt="" className="icon997"></img>
            </div>
            <div className="name234">BILLING</div>
          </button>
       

          
          <button
            className="dashboard-button-salon23 "
            onClick={() => handleButtonClick("Manage Products")}
          >
            <div className="icon-center23 ">
              {/* <BsGraphUpArrow /> */}
              <img src={Vector3} alt="" className="icon997"></img>
            </div>
            <div className="name234">INVENTORY</div>
          </button>

          <button
            className="dashboard-button-salon23"
            onClick={() => setSelectedButton("Services")}
          >
            <div className="icon-center23 ">
              {/* <MdOutlineHomeRepairService /> */}
            </div>
            <img src={settings1} alt="" className="setting icon997"></img>
            <div className="name234">SERVICES</div>{" "}
          </button>

          <button
            className="dashboard-button-salon23"
            onClick={() => setSelectedButton("Employees")}
          >
            <div className="icon-center23 ">
              {/* <AiOutlineMenu /> */}
              <img src={Vector1} alt="" className="icon997"></img>
            </div>
            <div className="name234">EMPLOYEES</div>{" "}
          </button>

          <button
            className="dashboard-button-salon23"
            onClick={() => setSelectedButton("Reports")}
          >
            <div className="icon-center23 ">{/* <TbReportAnalytics /> */}</div>
            <img src={Vector} alt="" className="setting icon997"></img>
            <div className="name234">REPORTS</div>
          </button>

          <button
            className="dashboard-button-salon23"
            onClick={() => {
              setSelectedButton("Add Branch");
              setShowAddBranchForm(false); // Hide Add Branch form when Add Salon is clicked
              setShowAddSalonForm(true); // Show Add Salon form
            }}
          >
            <img
              src={Addbranchicon}
              style={{ height: "35px" }}
              alt=""
              className="setting icon997"
            ></img>
            <div className="name234">BRANCHES</div>
          </button>

          <button
            className="dashboard-button-salon23 "
            onClick={() => handleButtonClick("Distributor Inventory")}
          >
            
            <div className="icon-center23 ">
              {/* <BsGraphUpArrow /> */}
              <img src={Dealer} alt="" className="Dealericon997"></img>
            </div>
            <div className="name234">DISTRIBUTOR</div>
          </button>
          
        </div>

       

      

        

        <div className="button-indicators23">
          {selectedButton}
          {selectedButton === "Customers" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("New Customer")}
            >
              New Customer
            </button>
          )}

          {selectedButton === "Add Employee" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Employees")}
            >
              Employees
            </button>
          )}

          {selectedButton === "Inventory" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Manage Products")}
            >
              {" "}
              Manage Products
            </button>
          )}

          {selectedButton === "Manage Products" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Stock Self-Use")}
            >
              Stock Self-Use
            </button>
          )}

          {selectedButton === "Stock Self-Use" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Manage Products")}
            >
              Manage Products
            </button>
          )}

          {selectedButton === "NewProduct" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Manage Products")}
            >
              Manage Products
            </button>
          )}

          {selectedButton === "AddService" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Services")}
            >
              Services
            </button>
          )}

{selectedButton === "Distributor Inventory" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Distributor Products")}
            >
              {" "}
              Manage Distributor Products
            </button>
          )}

          {selectedButton === "New Customer" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Customers")}
            >
              Customers
            </button>
          )}

          {selectedButton === "CustomerDetails" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Customers")}
            >
              Customers
            </button>
          )}
          {selectedButton === "Add Branch" && (
            <div className="uybgjhnjb">
              <button
                className="sub-button23"
                onClick={() => setSelectedButton("Manage Branch")}
              >
                Manage Branch
              </button>
            </div>
          )}
          {selectedButton === "NewAppointment" && (
            <button
              className="sub-button23"
              onClick={() => setSelectedButton("Appointments")}
            >
              Appointments
            </button>
          )}
        </div>
      </div>

      <div className="white-bg23">
        <div className="cards-container23">
          <h5 className="heading234">Financial Statistics</h5>
          <div className="cards-flex23">
            <div className="two-container90">
              <div className=" all-small-cards23456">
                <div className="divideimage">
                  <div className="mii">
                    <p className="amounts">Services Amount</p>
                    <p className="amount-fetch234">
                      ₹ {totalServiceAmount.toFixed(0) || 0}
                    </p>{" "}
                  </div>
                  <div className="flextochange789">
                    {/* <BsFillCartCheckFill className="icon-center234 " /> */}
                    <img
                      src={Chart1}
                      style={{ height: "45px" }}
                      alt=""
                      className=""
                    ></img>
                    {/* <img src={Chart1} alt="" className="Inventoryd"></img> */}
                  </div>
                </div>
              </div>
              <div className=" all-small-cards23456">
                <div className="divideimage">
                  <div className="mii">
                    <p className="amounts">Inventory Amount</p>
                    <p className="amount-fetch234">
                      ₹ {totalInventoryAmount.toFixed(0) || 0}
                    </p>{" "}
                  </div>
                  <div className="flextochange789">
                    {/* <BsCurrencyRupee className="icon-center234 " /> */}
                    <img
                      src={Inventory}
                      style={{ height: "44px" }}
                      alt=""
                      className=""
                    ></img>
                    {/* <img src={Inventory} alt="" className=" Inventory"></img> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="two-container90">
              <div className=" all-small-cards23456">
                <div className="divideimage">
                  <div className="mii">
                    <p className="amounts">Bills Generated</p>
                    <p className="amount-fetch234">
                      {totalNumberOfBills || 0}
                    </p>{" "}
                  </div>

                  <div className="flextochange789">
                    {/* <AiOutlineBarChart className="icon-center234 " /> */}
                    <img
                      src={good}
                      style={{ height: "50px" }}
                      alt=""
                      className=""
                    ></img>
                    {/* <img src={good} alt="" className=" Inventory"></img> */}
                  </div>
                </div>
              </div>
              <div className=" all-small-cards23456">
                <div className="divideimage">
                  <div className="mii">
                    <p className="amounts"> Appointments </p>
                    <p className="amount-fetch234">
                      {" "}
                      {totalNumberOfAppointments || 0}
                    </p>{" "}
                  </div>

                  <div className="flextochange789">
                    {/* <FiUsers className="icon-center234 " /> */}
                    <img
                      src={total}
                      style={{ height: "48px" }}
                      alt=""
                      className=""
                    ></img>
                    {/* <img src={total} alt="" className=" Inventory"></img> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {selectedButton === "Edit profile" && <EditProfile />}
        {selectedButton === "SubscriptionInfo" && <SubscriptionInfo />}
        {selectedButton === "PurchaseProduct" && <PurchaseProduct />}
        {selectedButton === "Distributor Products" && <PurchaseManageDealers />}
        

        {/* {selectedButton === "Register" && <Register />} */}

        {selectedButton === "Calendar" && (
          <Calendar onNewBillClick={() => handleButtonClick("Billing")} />
        )}

        {selectedButton === "Employees" &&
          (userRole === "admin" || userRole === "adminName") && (
            <Employees
              onNewEmployeeClick={() => handleButtonClick("Add Employee")}
            />
          )}

        {selectedButton === "Add Employee" && <AddEmployee />}

        {selectedButton === "Appointments" && (
          <Appointments
            onNewAppointmentClick={(customerData) =>
              handleButtonClick("NewAppointment", customerData)
            }
          />
        )}

        {selectedButton === "NewAppointment" && (
          <NewAppointment customer={customer} />
        )}

        {selectedButton === "New Customer" && <AddCustomer />}

        {selectedButton === "Inventory" && (
          <InventoryList
            onNewPurchaseClick={() => handleButtonClick("PurchaseProduct")}
          />
        )}
        {selectedButton === "Manage Products" && (
          <ProductList
            onNewProductClick={() => handleButtonClick("NewProduct")}
          />
        )}
         {selectedButton === "Manage Deal Products" && (
          <PurchaseManageDealers
            onNewProductClick={() => handleButtonClick("DealProducts")}
          />
        )}

        {selectedButton === "NewProduct" && <AddProduct />}
        {selectedButton === "Services" && userRole === "admin" && (
          <ServiceForm
            onNewServiceClick={() => handleButtonClick("AddService")}
          />
        )}
        {selectedButton === "AddService" && <AddService />}

        {selectedButton === "Billing" && <BillingForm />}
        {selectedButton === "Customers" && (
          <CustomerTable
            onCustomerDetailsClick={(selectedCustomer) =>
              handleButtonClick("CustomerDetails", selectedCustomer)
            }
          />
        )}
        {selectedButton === "CustomerDetails" && (
          <CustomerDetails selectedCustomer={selectedCustomer} />
        )}
        {selectedButton === "Stock Self-Use" && <StockSelfUse />}
        {selectedButton === "Reports" &&
          userRole === "admin" &&
          employeeName && <BillingTable />}
        {selectedButton === "Messages" && <Messages />}
        {!selectedButton && (
          <Calendar onNewBillClick={() => handleButtonClick("Billing")} />
        )}

        {selectedButton === "Add Branch" &&
          (userRole === "admin" || userRole === "adminName") && <AddBranch />}

        {selectedButton === "Manage Branch" &&
          (userRole === "admin" || userRole === "adminName") && (
            <ManageBranch />
          )}
           {selectedButton === "Distributor Inventory" && (
          <DealInventory
            onNewPurchaseClick={() => handleButtonClick("PurchaseProduct")}
          />
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
export default Dashboard;
