import React, { useState, useEffect, /*useCallback*/ } from "react";
import "../styles/Billing.css";
import axios from "axios";
import Salonlogo from "../images/Printlogo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Helper/helper";

const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so add 1
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const BillingForm = () => {
  const [billNumber, setBillNumber] = useState(1);
  const [date, setDate] = useState(getCurrentDate());
  const [services, setServices] = useState([]);
  const [items, setItems] = useState([
    { id: 1, itemName: "", sellingprice: 0, quantity: 1 },
  ]);
  const [/*discountPercent*/,] = useState("");
  const [customerNames, setCustomerNames] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [showEmployeeField, setShowEmployeeField] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [, /*customers*/ setCustomers] = useState([]);
  const [gstNumber, setGstNumber] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedCustomerSalonId, setSelectedCustomerSalonId] = useState("");
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [serviceIdCounter, setServiceIdCounter] = useState(1);
  const [, /*selectedMobileNumber*/ setSelectedMobileNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceDiscountPercent, setServiceDiscountPercent] = useState(0);
  const [serviceGstPercent, setServiceGstPercent] = useState(0);
  const [itemDiscountPercent, setItemDiscountPercent] = useState(0);
  const [serviceFinalTotal, setServiceFinalTotal] = useState(0);
  const [itemFinalTotal, setItemFinalTotal] = useState(0);
  const [stylists, setStylists] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productList, setProductList] = useState([]);
  const salonId = localStorage.getItem("salon_id");

  useEffect(() => {
    const fetchGST = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/${salonId}/gst`);
        if (response.status === 200) {
          setGstNumber(response.data.gst);
        } else {
          console.error('Error fetching GST:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching GST:', error);
      }
    };

    fetchGST();
  }, [salonId]);

  useEffect(() => {
    fetchCustomerNames();
  }, []);

  const fetchCustomerNames = async () => {
    try {
      const salonId = localStorage.getItem("salon_id");
      const branchId = localStorage.getItem("branch_id");

      if (!salonId || !branchId) {
        // console.error("Salon ID or Branch ID not found in local storage.");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/customers?salonId=${salonId}&branchId=${branchId}`
      );
      if (response.status === 200) {
        const customer = response.data;
        setCustomers(customer);
        setCustomerNames(customer);
      } else {
        // Handle error here
        console.error("Error fetching customer names");
      }
    } catch (error) {
      console.error("Error fetching customer names:", error);
    }
  };

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted
  
    const fetchServicesData = async () => {
      try {
        const salonId = localStorage.getItem("salon_id"); // Ensure salonId is being retrieved correctly
        if (!salonId) {
          console.error("Salon ID is not found in local storage.");
          return; // Exit if salonId is not available
        }
  
        const response = await axios.get(`${BASE_URL}/api/services?salon_id=${salonId}`);
        
        if (response.status === 200) { // Check if the response status is OK
          // Ensure response.data is an array and check its structure
          if (Array.isArray(response.data) && isMounted) {
            // Filter out services with status "IA" (Inactive)
            const activeServices = response.data.filter(service => service.status !== 'IA');
            setAvailableServices(activeServices);
          } else {
            console.error("Unexpected response data format:", response.data);
          }
        } else {
          console.error("Error fetching services, status code:", response.status);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
  
    fetchServicesData();
  
    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [salonId]); // Dependency array to trigger the effect when salonId changes
  


  

  const handleDeleteService = (id) => {
    const updatedServices = [...services];
    const indexToDelete = updatedServices.findIndex(
      (service) => service.id === id
    );

    if (indexToDelete !== -1) {
      updatedServices.splice(indexToDelete, 1); // Remove the service at the found index
      setServices(updatedServices); // Update the state with the modified services array
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: items.length + 1, itemName: "", sellingprice: 0, quantity: 1 },
    ]);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };
  // Function to handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === "itemName") {
      // Fetch the price of the selected product
      const selectedProduct = productList.find(
        (product) => product._id === value
      );
      if (selectedProduct) {
        updatedItems[index].itemName = selectedProduct.itemName;
        updatedItems[index].sellingprice = selectedProduct.sellingprice; // Assuming 'price' is the key for product price
      }
    }

    setItems(updatedItems);
  };


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const salonId = localStorage.getItem("salon_id");
        const response = await axios.get(`${BASE_URL}/api/Products/?salon_id=${salonId}`); // Append salonId to the base URL
        if (response.status === 200) {
          // Filter out products with status "IA" (Inactive)
          const activeProducts = response.data.filter(product => product.status !== 'IA');
          const reversedActiveProducts = activeProducts.reverse();
          setProductList(reversedActiveProducts);
        } else {
          console.error('Error fetching products:', response.statusText);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchProducts();
  }, []);
  

  const handleAddService = () => {
    const newService = {
      id: serviceIdCounter,
      serviceName: "",
      sellingprice: 0,
      employeeName: "",
    };
    setServices([...services, newService]);
    setServiceIdCounter(serviceIdCounter + 1); // Increment the serviceIdCounter
    setShowEmployeeField(true); // Show the employeeName field when adding a service
  };

  useEffect(() => {
    const salonId = localStorage.getItem("salon_id");
    const branchId = localStorage.getItem("branch_id");
    if (!salonId || !branchId) {
      // console.error("Salon ID or Branch ID not found in local storage.");
      return;
    }

    axios
      .get(
        `${BASE_URL}/api/employees/stylists/bySalonAndBranch?salon_id=${salonId}&branch_id=${branchId}`
      )
      .then((response) => {
        const activeStylists = response.data.filter(stylist => stylist.status !== 'IA');
        setStylists(activeStylists);
      })
      .catch((error) => {
        console.error("Error fetching stylists:", error);
      });
  }, []);

  useEffect(() => {
    const serviceTotal = services.reduce(
      (acc, service) => acc + service.price,
      0
    );
    const serviceDiscount = (serviceTotal * serviceDiscountPercent) / 100;
    const serviceGst =
      ((serviceTotal - serviceDiscount) * serviceGstPercent) / 100;
    const serviceFinal = serviceTotal - serviceDiscount + serviceGst;
    setServiceFinalTotal(serviceFinal);

    const itemTotal = items.reduce(
      (acc, item) => acc + item.sellingprice * item.quantity,
      0
    );
    const itemDiscount = (itemTotal * itemDiscountPercent) / 100;
    const itemFinal = itemTotal - itemDiscount;
    setItemFinalTotal(itemFinal);


    setTotalAmount(serviceFinal + itemFinal);
  }, [
    services,
    items,
    serviceDiscountPercent,
    serviceGstPercent,
    itemDiscountPercent,
  ]);

  useEffect(() => {
    const fetchMaxBillNumber = async () => {
      try {
        // Fetch salon and branch IDs from local storage
        // const salonId = localStorage.getItem("salon_id");
        const branchId = localStorage.getItem("branch_id");
        const branchName = localStorage.getItem("branchName"); // Assuming branchName is stored in localStorage

        const response = await axios.get(
          `${BASE_URL}/api/billing/max-bill-number`,
          {
            params: { branchId, branchName },
          }
        );

        if (response.status === 200) {
          const { maxBillNumber } = response.data;
          // Calculate the new bill number by incrementing the maximum
          const newBillNumber = maxBillNumber + 1 || 1; // Default to 1 if no billing data found
          setBillNumber(newBillNumber);
        } else {
          // Handle error
          console.error("Error fetching max bill number");
        }
      } catch (error) {
        console.error("Error fetching max bill number:", error);
      }
    };

    fetchMaxBillNumber();

    // Optionally reset bill number to 1 every 24 hours (if desired)
    const interval = setInterval(() => {
      fetchMaxBillNumber(); // Fetch and set the new bill number every 24 hours
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomerId) {
      toast.warn("Please select a customer.");
      return;
    }

    if (services.length === 0 && items.length === 0) {
      toast.warn("Please select at least one service or one item.");
      return;
    }

    const allServicesHaveStylist = services.every(
      (service) => service.employeeName
    );
    if (!allServicesHaveStylist) {
      toast.warn(
        "Please select a stylist for all services before submitting the bill."
      );
      return;
    }

    const selectedCustomer = customerNames.find(
      (customer) => customer._id === selectedCustomerId
    );

    if (!selectedCustomer) {
      toast.warn("Selected customer not found.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Fetch user information from local storage
      // const userRole = localStorage.getItem("userRole");
      const loggedInUser =
        localStorage.getItem("adminName") ||
        localStorage.getItem("employeeName");

      const formattedPaymentMethod = paymentMethod.replace(/_/g, " ");

      const currentDate = new Date().toISOString().slice(0, 10);

      const formDataToSend = {
        billNumber: billNumber,
        date: currentDate,
        customer: selectedCustomerSalonId, // Ensure correct field name
        name: selectedCustomerName,
        services: services.map((service) => ({
          id: service.id,
          serviceName: service.serviceName,
          price: service.price,
          employee: service.employeeName,
        })),
        items: items.map((item) => ({
          itemName: item.itemName,
          price: item.sellingprice,
          quantity: item.quantity,
        })),
        serviceDiscountPercent: serviceDiscountPercent,
        itemDiscountPercent: itemDiscountPercent,
        serviceGstPercent: serviceGstPercent,
        serviceFinalTotal: serviceFinalTotal,
        itemFinalTotal: itemFinalTotal,
        gstNumber: gstNumber,
        paymentMethod: formattedPaymentMethod,
        totalAmount: totalAmount,
        createdByName: loggedInUser, // Changed to createdByName
        branchId: selectedCustomer.branchId, // Include branchId
        branchName: selectedCustomer.branchName, // Include branchName
      };

      const response = await axios.post(
        `${BASE_URL}/api/customers/${selectedCustomerId}/billing`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Response:", response);

      if (response.status === 201) {
        toast.success("Billing data saved successfully!", {
          position: "top-right",
          autoClose: 800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        const printContent = generatePrintContent(selectedCustomer);
        openPrintWindow(printContent);

        setBillNumber(billNumber + 1);
        setDate("");
        setSearchQuery("");
        setSelectedCustomerName("");
        setSelectedCustomerId(""); // Reset the selected customer
        setServices([]);
        setItems([]);
        setServiceDiscountPercent("");
        setItemDiscountPercent("");
        setServiceGstPercent("");
        setServiceFinalTotal(0);
        setItemFinalTotal(0);
        setGstNumber("");
        setPaymentMethod("");
        setTotalAmount(0);
      } else {
        toast.error("Error saving billing data");
      }
    } catch (error) {
      console.error("Error saving billing data:", error);
      toast.error("Error saving billing data");
    } finally {
      setIsSubmitting(false); // Reset the submitting state
    }
  };

  const generatePrintContent = (selectedCustomer) => {
    const createdByName =
      localStorage.getItem("employeeName") || localStorage.getItem("adminName");
    const printContent = `
    <html>
      <head>
        <img src="${Salonlogo}" alt="Salonlogo" class="logo-salon-cd" />
        <title>Invoice</title>
        <style>
          .logo-salon-cd {
            width: 100px; /* Adjust the width as needed */
            height: auto; /* Maintain aspect ratio */
                      } 
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .invoice-container {
            border-radius: 10px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .th89, .td89 {
            background-color: rgb(218, 213, 213);
            border: 1px solid #ccc;
            padding: 5px;
            text-align: center;
          }
          .td89 {
            background-color: white;
            font-weight: normal;
          }
          .td88 {
            text-align: left !important;
          }
          .invoice-name {
            width: 100px;
            margin-top: 0px;
          }
          .invoice-flex {
            display: flex;
          }
          .white-table th, .white-table td {
            background-color: white;
            border: 1px solid black;
            padding: 5px;
            text-align: left;
          }
          .white-table h3 {
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h2>Customer Invoice Details</h2>
          </div>
          <div class="invoice-details">
            <div class="invoice-flex">  <p class="invoice-name">Date</p>:&nbsp;&nbsp; ${date}</div>
            <div>Bill Number &nbsp;:&nbsp; ${billNumber}</div>
          </div>
          <div class="customer-details">
            <div class="invoice-flex"><p class="invoice-name">Customer ID</p>:&nbsp;&nbsp; ${selectedCustomer.customerId
      }</div>
            <div class="invoice-flex"><p class="invoice-name">Name</p>:&nbsp;&nbsp; ${selectedCustomer.name
      }</div>
          </div>
          <div class="customer-details">
            <div class="invoice-flex"><p class="invoice-name">Branch Name</p>:&nbsp;&nbsp; ${selectedCustomer.branchName
      }</div>
            <div class="invoice-flex"><p class="invoice-name">Branch ID</p>:&nbsp;&nbsp; ${selectedCustomer.branchId
      }</div>
          </div>
          <table class="items-table">
            <thead>
              <tr>
                <th class="th89">Employee Name</th>
                <th class="th89">Service Name</th>
                <th class="th89">Service Price (RS)</th>
              </tr>
            </thead>
            <tbody>
              ${services
        .map(
          (service) => `
                    <tr>
                      <td class="td89 td88">${service.employeeName}</td>
                      <td class="td89 td88">${service.serviceName}</td>
                      <td class="td89">${service.price}</td>
                    </tr>
                  `
        )
        .join("")}
            </tbody>
          </table>
          <table class="items-table">
            <thead>
              <tr>
                <th class="th89">Item Name</th>
                <th class="th89">Quantity</th>
                <th class="th89">Item Price (RS)</th>
              </tr>
            </thead>
            <tbody>
              ${items
        .map(
          (item) => `
                    <tr>
                      <td class="td89 td88">${item.itemName}</td>
                      <td class="td89">${item.quantity}</td>
                      <td class="td89">${item.sellingprice}</td>
                    </tr>
                  `
        )
        .join("")}
            </tbody>
          </table>
          <table class="items-table white-table">
            <tbody>
              <tr>
                <th>GST No</th>
                <td>${gstNumber}</td>
              </tr>
              <tr>
                <th>Service Discount %</th>
                <td>${serviceDiscountPercent.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Item Discount %</th>
                <td>${itemDiscountPercent.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Service GST %</th>
                <td>${serviceGstPercent.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Service Final Total</th>
                <td>${serviceFinalTotal.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Item Final Total (inculding all tax)</th>
                <td>${itemFinalTotal.toFixed(2)}</td>
              </tr>
              <tr>
                 <th>Payment Method</th>
                 <td>${paymentMethod}</td>
              </tr>

              <tr>
                <th colspan="2"><h3>Total Amount in RS &nbsp;:&nbsp; ${totalAmount.toFixed(
          2
        )} /-</h3></th>
              </tr>
            </tbody>
          </table>
           <div style="display: flex; flex-direction: row; margin-bottom: -10px;"><p class="popup-details" style=" margin-top: 1px;">Bill GeneratedBy</p> &nbsp;&nbsp;:&nbsp;&nbsp; ${createdByName}</div>
      </body>
    </html>
    `;

    return printContent;
  };

  const openPrintWindow = (printContent) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast.error("Error opening print window. Please allow pop-ups.");
      return;
    }

    // Open print window, write content, and initiate print
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();

    // Close print window after printing
    printWindow.onafterprint = function () {
      printWindow.close();
    };
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Reset the selected customer and customer ID when the input field is empty
    if (query === "") {
      setSelectedCustomerId("");
      setSelectedCustomerName("");
      setSelectedMobileNumber("");

      // setCustomerNames(billingData); // Assuming billingData contains the original customer names data
      return;
    }

    const selectedCustomer = customerNames.find(
      (customer) =>
        customer.phone && customer.phone.includes(query) && query.length === 10
    );

    if (selectedCustomer) {
      // If a customer with the entered phone number is found, set the selected customer and customer ID in the state
      setSelectedCustomerId(selectedCustomer._id);
      setSelectedCustomerSalonId(selectedCustomer.customerId);
      setSelectedCustomerName(selectedCustomer.name);
      setSelectedMobileNumber(selectedCustomer.phone);
    } else {
      // If no matching customer is found, reset the selected customer and customer ID in the state
      setSelectedCustomerId("");
      setSelectedCustomerName();
      setSelectedMobileNumber("");
    }

    // Filter the customer data based on the search query (phone or ID)
    const filteredCustomers = customerNames.filter((customer) => {
      return customer.phone && customer.phone.includes(query);
    });

    // Update the customer names list with filtered results
    setCustomerNames(filteredCustomers);
  };
    // Function to handle key down event
    const handleKeyDown = (e) => {
      // Allow only numbers, backspace, delete, arrow keys, and tab
      const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
      if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
        e.preventDefault();
      }
    };
  
    const handleInput = (e) => {
      let inputValue = e.target.value.replace(/[^0-9]/g, ""); // Keep only digits
  
      // Ensure the number starts with 6, 7, 8, or 9 and is at most 10 digits long
      if (inputValue && !/^[6-9]/.test(inputValue)) {
        setErrorMessage('Phone number must start with 6, 7, 8, or 9 and be 10 digits long.');
        inputValue = ""; // Clear if it doesn't start with 6-9
      } else if (inputValue.length > 10) {
        setErrorMessage('Phone number must be exactly 10 digits long.');
        inputValue = inputValue.slice(0, 10); // Limit to 10 digits
      } else {
        setErrorMessage(''); // Clear the error message if valid
      }
  
      setSearchQuery(inputValue);
    };
  
    


  return (
    <div className="billing-form-sk142s">
      <h5 className="heading234">Generate Bill </h5>
      <div className="small-container678">
        <div className="bnsk142s">
          <div className="form-groupsk142s">
            <div className="lable-width567">
              <label className="bill-no123">Bill Number :</label>
            </div>
            <input
              className="bnsk142sinput89"
              type="text"
              value={billNumber}
              readOnly
            />
          </div>
          <div className="form-groupsk142s">
            <label className="bill-no123">Date:</label>
            <input
              className="bnsk142datesinput89"
              type="text" // Use type="text" to prevent date picker
              value={date}
              readOnly // Make the input read-only to prevent user changes
            />
          </div>
        </div>
        <div className="form-groupsk14210s">
          <div className="flex1100">
            <div className="lable-width567">
              <label className="bill-no123"> Mobile Number:</label>
            </div>
            <input
              className="bnsk142sinput89"
              type="tel"
              value={searchQuery}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              onChange={handleSearch}
              placeholder="Enter Phone Number"
              maxLength={10}
            />
             {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>
          {/* <div className="lable-width567"> */}
          <div className="flex1100">
            <label className="bill-no123 width8901">Customer:</label>
            {/* </div> */}
            <input
              className="bnsk142sinput89" placeholder="Enter Customer"
              value={`${selectedCustomerName || ""}${selectedCustomerId ? ` (${selectedCustomerSalonId})` : ""
                }`}
              readOnly
            ></input>
          </div>
        </div>
        <div className="servicesk142s">
          <div className="lable-width567">
            <label className="bill-no123">Services :</label>
          </div>
          <div className="columns456">
            {services.map((service, index) => (
              <div key={service.id} className="service-row">
                <select
                  className="changesize567"
                  value={service.id} // Use service ID as the value for the dropdown
                  onChange={(e) => {
                    const selectedServiceId = e.target.value;
                    const selectedService = availableServices.find(
                      (availableService) =>
                        availableService._id === selectedServiceId
                    );

                    const updatedServices = services.map((s, idx) => {
                      if (idx === index) {
                        return {
                          ...s,
                          id: selectedServiceId,
                          serviceName: selectedService
                            ? selectedService.serviceName
                            : "",
                          price: selectedService ? selectedService.price : 0,
                        };
                      }
                      return s;
                    });

                    setServices(updatedServices);
                  }}
                >
                  <option className="optionselect7899" value="">
                    Select a service
                  </option>
                  {availableServices.map((availableService) => (
                    <option
                      key={availableService._id}
                      value={availableService._id} // Use service ID as the value for each option
                    >
                      {availableService.serviceName}
                    </option>
                  ))}
                </select>
                <input
                  className="input-change789"
                  type="number"
                  placeholder="Price"
                  readOnly
                  value={service.price}
                  onChange={(e) => {
                    const updatedServices = [...services];
                    updatedServices[index] = {
                      ...updatedServices[index],
                      price: parseFloat(e.target.value),
                    };
                    setServices(updatedServices);
                  }}
                />
                {showEmployeeField && (
                  <select
                    key={index}
                    className="optionselect789"
                    value={service.employeeName}
                    onChange={(e) => {
                      const selectedEmployee = e.target.value;
                      const updatedServices = [...services];
                      updatedServices[index] = {
                        ...updatedServices[index],
                        employeeName: selectedEmployee,
                      };
                      setServices(updatedServices);
                    }}
                  >
                    <option value="">Select a stylist</option>
                    {stylists.map((stylist) => (
                      <option key={stylist._id} value={stylist.employeeName}>
                        {stylist.employeeName}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  className="delete-buttonsk142s"
                  onClick={() => handleDeleteService(service.id)}
                >
                  Delete
                </button>
              </div>
            ))}
            <div>
              <button className="addnewsk142sd" onClick={handleAddService}>
                <span className="plusk142s">+</span>Add Service
              </button>
            </div>
          </div>
        </div>

        <div className="form-group-label234">
          <div className="lable-width567">
            <label className="bill-no123">Service Discount (%)</label>
          </div>
          <input
            className="totalbillsk142s"
            type="number"
            value={serviceDiscountPercent === 0 ? "" : serviceDiscountPercent}


            maxLength={2}
            placeholder="Enter Service Discount"
            onFocus={(e) => {
              if (e.target.value === "0") {
                setServiceDiscountPercent("");
              }
            }}
            onChange={(e) => {
              const inputDiscount = parseInt(e.target.value, 10);
              if (
                !isNaN(inputDiscount) &&
                inputDiscount >= 0 &&
                inputDiscount <= 99
              ) {
                setServiceDiscountPercent(inputDiscount);
              } else if (e.target.value === "") {
                setServiceDiscountPercent("");
              }
            }}
            onBlur={(e) => {
              if (e.target.value === "") {
                setServiceDiscountPercent(0);
              }
            }}
          />
        </div>

        <div className="form-group-label234">
          <div className="lable-width567">
            <label className="bill-no123">Service GST (%)</label>
          </div>
          <input
            className="totalbillsk142s"
            type="number"
            value={serviceGstPercent === 0 ? "" : serviceGstPercent}
            maxLength={2}
            placeholder="Enter Service GST (%)"
            onFocus={(e) => {
              if (e.target.value === "0") {
                setServiceGstPercent("");
              }
            }}
            onChange={(e) => {
              const newGSTPercent = parseInt(e.target.value, 10);
              if (
                !isNaN(newGSTPercent) &&
                newGSTPercent >= 0 &&
                newGSTPercent <= 99
              ) {
                setServiceGstPercent(newGSTPercent);
              } else if (e.target.value === "") {
                setServiceGstPercent("");
              }
            }}
            onBlur={(e) => {
              if (e.target.value === "") {
                setServiceGstPercent(0);
              }
            }}
          />
        </div>
        <div className="form-group-label234">
          <div className="lable-width567">
            <label className="bill-no123">Service Final Total:</label>
          </div>
          <input
            className="totalbillsk142s"
            type="text"
            placeholder="Service Final Total"
            value={serviceFinalTotal.toFixed(2)}
            readOnly
          />
        </div>

        <div className="itemsk142s">
          <div className="lable-width567">
            <label className="bill-no123">Items :</label>
          </div>

          <div className="columns456">
            {items.map((itemName, index) => (
              <div key={itemName.id} className="item-row-select67">
                <select
                  className="options678"
                  value={items.itemName}
                  onChange={(e) =>
                    handleItemChange(index, "itemName", e.target.value)
                  }
                >
                  <option value="">Select an item</option>
                  {productList.map((itemName) => (
                    <option value={itemName._id} key={itemName._id}>
                      {itemName.itemName}
                    </option>
                  ))}
                </select>

                <input
                  className="input-change789"
                  type="number"
                  placeholder="Price"
                  value={itemName.sellingprice}
                  readOnly
                />
                <input
                  className="input-change789"
                  type="number"
                  placeholder="Quantity"
                  value={itemName.quantity}
                  maxLength={4}
                  onChange={(e) => {
                    let newValue = parseInt(e.target.value, 10);
                    if (isNaN(newValue) || newValue < 1) {
                      newValue = 1; // Ensure quantity is at least 1
                    } else if (newValue > 9999) {
                      newValue = 9999; // Ensure quantity does not exceed 5 digits
                    }
                    handleItemChange(index, "quantity", newValue);
                  }}
                  onBlur={(e) => {
                    if (
                      e.target.value === "" ||
                      parseInt(e.target.value, 10) < 1
                    ) {
                      handleItemChange(index, "quantity", 1);
                    }
                  }}
                />

                <input
                  className="input-change789"
                  type="number"
                  placeholder="Total Price"
                  value={(itemName.sellingprice * itemName.quantity).toFixed(2)}
                  readOnly
                />
                <button
                  className="delete-buttonsk1445"
                  onClick={() => handleDeleteItem(itemName.id)}
                >
                  Delete
                </button>
              </div>
            ))}
            <button className="addnewsk142s" onClick={handleAddItem}>
              <span className="plusk142s">+</span>Add Item
            </button>
          </div>
        </div>

        <div className="form-group-label234">
          <div className="lable-width567">
            <label className="bill-no123">Item Discount (%)</label>
          </div>
          <input
            className="totalbillsk142s"
            type="number"
            value={itemDiscountPercent === 0 ? "" : itemDiscountPercent}
            maxLength={2}
            placeholder="Enter Item Discount (%)"
            onFocus={(e) => {
              if (e.target.value === "0") {
                setItemDiscountPercent("");
              }
            }}
            onChange={(e) => {
              const inputDiscount = parseInt(e.target.value, 10);
              if (
                !isNaN(inputDiscount) &&
                inputDiscount >= 0 &&
                inputDiscount <= 99
              ) {
                setItemDiscountPercent(inputDiscount);
              } else if (e.target.value === "") {
                setItemDiscountPercent("");
              }
            }}
            onBlur={(e) => {
              if (e.target.value === "") {
                setItemDiscountPercent(0);
              }
            }}
          />
        </div>
        <div className="form-group-label234">
          <div className="lable-width567">
            <label className="bill-no123">Item Final Total:</label>
          </div>
          <input
            className="totalbillsk142s"
            type="text"
            value={itemFinalTotal.toFixed(2)}
            readOnly
          />
        </div>

        <div className="form-group-label234">
          <div className="lable-width567">
            <label className="bill-no123">Mode Of Payment:</label>
          </div>
          <select
            className="bnsk142sinput89"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Payment Method</option>
            <option value="online">Online</option>
            <option value="Credit Card">CreditCard</option>
            <option value="Debit Card">DebitCard</option>
            <option value="cash">Cash</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Add GST Number input field */}
        <div className="form-group-label234">
          <div className="lable-width567">
            <label className="bill-no123">GST Number:</label>
          </div>
          <input
            className="totalbillsk142s"
            type="text"
            value={gstNumber}
            readOnly
          />
        </div>

        <div className="form-group-label234">
          <div className="lable-width567">
            <label className="bill-no123">Total Amount:</label>
          </div>
          <input
            className="totalbillsk142s"
            type="text"
            value={totalAmount.toFixed(2)}
            readOnly
          />
        </div>
        <div className="save-btn456">
          <button
            className="addnewsk1445"
            type="submit"
            onClick={handleFormSubmit}
            disabled={isSubmitting}
          >
            Save
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BillingForm;
