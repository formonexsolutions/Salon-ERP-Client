import React, { useState, useEffect } from "react";
import "../styles/ProductList.css";
import "../styles/DealerInventory.css";
import axios from "axios";
import Salonlogo from "../images/Printlogo.png";
import { BASE_URL } from "../Helper/helper";
import DealersAddProduct from "./DealersAddProduct";
import DealersPurchaseProduct from "./DealersPurchaseProduct";
// import PurchaseManageDealers from "./PurchaseManageDealers";

const DealersInventoryList = ({ onNewPurchaseClick }) => {
  const [/*DealpurchaseList*/, setDealPurchaseList] = useState([]);
  // const [searchQuery, setSearchQuery] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPurchasePopupVisible, setIsPurchasePopupVisible] = useState(false);
  const [isAddProductPopupVisible, setIsAddProductPopupVisible] =
  
    useState(false);

  const handleNewPurchaseClick = () => {
    setIsPurchasePopupVisible(true);
  };

  // const handleAddProductClick = () => {
  //   setIsAddProductPopupVisible(true);
  // };

  const closePopups = () => {
    setIsPurchasePopupVisible(false);
    setIsAddProductPopupVisible(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Read salon_id from local storage
        const salonId = localStorage.getItem("salon_id");
        if (!salonId) {
          console.error("Salon ID not found in local storage.");
          return;
        }
        // Fetch data based on salon_id
        const response = await axios.get(
          `${BASE_URL}/api/dealstock?salon_id=${salonId}`
        );
        const responseData = response.data.reverse();
        // console.log(responseData);
        setDealPurchaseList(responseData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  // const handleButtonClick = (buttonType) => {
  //   setSelectedButton(buttonType);
  // };
  // const handleSearch = (e) => {
  //   setSearchQuery(e.target.value);
  // };

  // Filter customers based on search query
  // const filteredPurchaseList = DealpurchaseList.filter((purchase) =>
  //   formatDate(purchase.purchaseDate)
  //     .toLowerCase()
  //     .includes(searchQuery.toLowerCase())
  // );

  // const handleClick = () => {
  //   // Call the callback to update selectedButton
  //   // onNewProductClick();
  //   onNewPurchaseClick();
  // };

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredPurchaseList.slice(
  //   indexOfFirstItem,
  //   indexOfLastItem
  // );
  // const totalPages = Math.ceil(filteredPurchaseList.length / itemsPerPage);

  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };
  // const handleItemsPerPageChange = (e) => {
  //   setItemsPerPage(parseInt(e.target.value, 10));
  //   setCurrentPage(1);
  // };
  // const handleFirstPageClick = () => {
  //   setCurrentPage(1);
  // };
  // const handleLastPageClick = () => {
  //   setCurrentPage(totalPages);
  // };
  // const handlePreviousPageClick = () => {
  //   setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  // };
  // const handleNextPageClick = () => {
  //   setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  // };

  // Calculate which page numbers to display
  // const getDisplayedPages = () => {
  //   const totalDisplayPages = 3; // Number of pages to display
  //   const pages = [];
  //   for (let i = currentPage - 1; i <= currentPage + 1; i++) {
  //     if (i > 0 && i <= totalPages) {
  //       pages.push(i);
  //     }
  //     if (pages.length >= totalDisplayPages) {
  //       break;
  //     }
  //   }
  //   return pages;
  // };

  // const handleDetailsClick = (item) => {
  //   // Calculate the total purchase amount for the current purchase entry
  //   const totalPurchaseAmount = item.tableData.reduce((acc, product) => {
  //     const amount = product.quantity * product.cp;
  //     return acc + amount;
  //   }, 0);

  //   // Calculate the total quantity
  //   const totalQuantity = item.tableData.reduce((acc, product) => {
  //     return acc + parseInt(product.quantity, 10);
  //   }, 0);

  //   // Calculate the total cp
  //   const totalCP = item.tableData.reduce((acc, product) => {
  //     return acc + parseFloat(product.cp);
  //   }, 0);

  //   setSelectedItem({
  //     ...item,
  //     totalPurchaseAmount: totalPurchaseAmount,
  //     NoOfProducts: item.tableData.length,
  //     totalQuantity: totalQuantity,
  //     totalCP: totalCP.toFixed(2),
  //   });
  // };

  const handlePrint = () => {
    if (selectedItem) {
      // Create the printable content
      const printContent = `
        <html>
          <head>
          <img src="${Salonlogo}" alt="Salonlogo" class="logo-salon-cd" />
            <title>Purchase Order Details</title>
            <style>
            .logo-salon-cd {
              width: 100px; /* Adjust the width as needed */
              height: auto; /* Maintain aspect ratio */
            }  
               table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
              }
              .popup-content {
                height: 100vh;
                width: 100vw;
                overflow-y: auto;
                padding: 20px;
                border-radius: 3px;
                // box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
                background: #fff;
               
                // width: 40%;
                position: relative;
              }
              .popup-title {
                text-align:center;
                  // font-size: large;
                  margin-bottom: 10px;
              }
              .popup-details{
                width: 140px;
                margin-top: 0px;
                font-weight: 500;
              }
              .flexchange4455{
                display: flex;
                flex-direction: row;
                margin-bottom: -10px;
              }
              .th89{
                background-color: rgb(218, 213, 213);
                border: 1px solid #ccc;
                padding: 5px;
                text-align: center;
              }
              .td89{
                background-color: white;
                border: 1px solid #ccc;
                padding: 5px;
                font-weight: normal;
                text-align: center;
              }
              .td88{
                text-align: left !important;
              }
            </style>
          </head>
          <body>
          <div style=" display: flex;justify-content: center;">
            <div class="popup-content">
              <h2 class="popup-title">Purchase Order Details</h2>
              <div  style="display: flex; flex-direction: row; margin-bottom: -10px;"> <p class="popup-details">Purchase Date</p> :&nbsp;&nbsp;&nbsp;&nbsp; ${
                selectedItem.purchaseDate
              } </div>
             
              <div  style="display: flex; flex-direction: row; margin-bottom: -10px;"> <p class="popup-details">Branch Name</p> : &nbsp;&nbsp;&nbsp;&nbsp;${
                selectedItem.branchName
              } </div>
              <div  style="display: flex; flex-direction: row; margin-bottom: -10px;"> <p class="popup-details">Branch ID</p> : &nbsp;&nbsp;&nbsp;&nbsp;${
                selectedItem.branchId
              } </div>      
              <div  style="display: flex; flex-direction: row; margin-bottom: -10px;">  <p class="popup-details">Company name</p> : &nbsp;&nbsp;&nbsp;&nbsp;${
                selectedItem.dealerCompany
              } </div>
              <table style=" margin-top: 16px;">
                <thead>
                  <tr>
                    <th className="th89">Product</th>
                    <th className="th89">Quantity</th>
                    
                  </tr>
                </thead>
                <tbody>
                  ${selectedItem.tableData
                    .map(
                      (product, index) => `
                      <tr>
                        <td className="td89 td88">${product.product}</td>
                        <td className="td89">${product.quantity}</td>
                    
                        
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            </div>
          </body>
        </html>
      `;

      // Open a new window for printing
      const printWindow = window.open("", "", "width=600,height=600");
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();

      // Initiate the print dialog
      printWindow.print();

      // Close the new window after printing
      printWindow.onafterprint = function () {
        printWindow.close();
      };
    }
  };

  // function formatDate(dateString) {
  //   const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString("en-GB", options).replace(/\//g, "-");
  // }
  return (
    <div className="pd-container12">
      <h5 className="heading234">Distributor Inventory Details</h5>
      <div className="margin4567">
        {/* <button className="pdadd-btn12" onClick={handleClick}>
          {" "}
          + New Purchase
        </button> */}
        <button
          className="pdadd-btn12"
          onClick={handleNewPurchaseClick}
          // onClick={() => handleButtonClick("NewPurchase")}
        >
          + New Purchase
        </button>
        &nbsp;
       
        {/* {selectedButton === "NewPurchase" && <DealersPurchaseProduct />}
        {selectedButton === "AddProduct" && <DealersAddProduct />} */}
        {isPurchasePopupVisible && (
          <div className="popup-overlay25">
            <div className="popup-content25">
              <DealersPurchaseProduct onClose={closePopups} />
            </div>
          </div>
        )}
        {isAddProductPopupVisible && (
          <div className="popup-overlay25">
            <div>
              <DealersAddProduct onClose={closePopups} />
            </div>
          </div>
        )}
       
        {selectedItem && (
          <div className="popup-overlay">
            <div className="popup-content">
              <div className="flexchange445577">
                <h5 className="popup-title">Purchase Order Details</h5>
                <button
                  className="popup-close-button"
                  onClick={() => setSelectedItem(null)}
                >
                  X
                </button>
              </div>
              <div className="flexchange4455">
                <p className="popup-details">Purchase Date</p> : &nbsp; &nbsp;
                &nbsp;{selectedItem.purchaseDate}
              </div>
             
              <div className="flexchange4455">
                <p className="popup-details">Branch Name</p> : &nbsp; &nbsp;
                &nbsp;{selectedItem.branchName}
              </div>
              <div className="flexchange4455">
                <p className="popup-details">Branch ID</p> : &nbsp; &nbsp;
                &nbsp;{selectedItem.branchId}
              </div>
             
              <div className="flexchange4455">
                <p className="popup-details">No of Products</p> : &nbsp; &nbsp;
                &nbsp;{selectedItem.NoOfProducts}
              </div>
              <div className="flexchange4455">
                <p className="popup-details">Company Name</p> : &nbsp; &nbsp;
                &nbsp;{selectedItem.dealerCompany}
              </div>
              <table className="popup-table">
                <thead>
                  <tr>
                    <th className="th89">Product</th>
                    <th className="th89">Quantity</th>
                    {/* <th className="th89">SP</th> */}
                  </tr>
                </thead>
                <tbody>
                  {selectedItem.tableData.map((product, index) => (
                    <tr key={index}>
                      <td className="td89 td88">{product.product}</td>
                      <td className="td89">{product.quantity}</td>
                      {/* <td className="td89">₹ {product.cp}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="print285">
                <button className="popup-print-button" onClick={handlePrint}>
                  Print
                </button>
              </div>
              
            </div>
          </div>
        )}
       
      </div>
    </div>
  );
};

export default DealersInventoryList;
