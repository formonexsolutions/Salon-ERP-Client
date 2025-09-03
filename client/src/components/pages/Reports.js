import React, { useEffect, useState, useRef } from "react";
import "../styles/Reports.css";
import ServiceTable from "./ServiceTable";
import ItemTable from "./ItemTable";
import Chart from "chart.js/auto";
import EmployeeTable from "./EmployeeTable";
import PaginationBillReport from "./PaginationBillReport";
import { BASE_URL } from "../Helper/helper";


function BillingTable() {
  const [billingData, setBillingData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);
  const [showChart, setShowChart] = useState(true);
  const [filteredBillingData, setFilteredBillingData] = useState([]);
  const salonId = localStorage.getItem("salon_id");
  const branchId = localStorage.getItem("branch_id");

  
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Monthly Income",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: [],
      },
    ],
  });

  const [chartViewMode] = useState("month");
  const [, /*showAll*/ setShowAll] = useState(false);
  const rowsPerPage = 5;

  const toggleChartVisibility = () => {
    setShowChart(!showChart);
  };

  const handleFilter = () => {
    setShowAll(false); // Add this line

    if (fromDate && toDate) {
      const filteredData = billingData.filter((billing) => {
        const billDate = new Date(billing.date);
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);

        return billDate >= fromDateObj && billDate <= toDateObj;
      });

      setFilteredBillingData(filteredData);
      updateChartData(chartViewMode, filteredData);
      calculateTotalAmount(filteredData);
    } else {
      fetchAllData();
    }

    setCurrentPage(1);
  };

  const calculateTotalAmount = (data) => {
    const total = data.reduce((accumulator, billing) => {
      return accumulator + billing.totalAmount;
    }, 0);

    setTotalAmount(total);
  };

  const updateChartData = (viewMode, data) => {
    const aggregateData = (mode) => {
      const aggregatedData = {};

      data.forEach((billing) => {
        const billDate = new Date(billing.date);
        let key = "";

        if (mode === "month") {
          key = `${billDate.getMonth() + 1}/${billDate.getFullYear()}`;
        } else if (mode === "day") {
          key = `${billDate.toISOString().split("T")[0]}`;
        } else if (mode === "year") {
          key = `${billDate.getFullYear()}`;
        }

        if (aggregatedData[key]) {
          aggregatedData[key] += billing.totalAmount;
        } else {
          aggregatedData[key] = billing.totalAmount;
        }
      });

      const labels = Object.keys(aggregatedData);
      const values = labels.map((key) => aggregatedData[key]);

      setChartData({
        labels,
        datasets: [
          {
            label: `${
              viewMode.charAt(0).toUpperCase() + viewMode.slice(1)
            }ly Income`,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            data: values,
          },
        ],
      });
    };

    aggregateData(viewMode);
  };


  
  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/customers?salonId=${salonId}&branchId=${branchId}&branchName`);
        const data = await response.json();
  
        const billingData = data.flatMap((customer) => {
          return (customer.billing || []).map((bill) => ({
            _id: bill._id,
            billNumber: bill.billNumber,
            date: bill.date,
            customer: customer.name,
            discountPercent: bill.serviceDiscountPercent,
            productDiscountPercent: bill.itemDiscountPercent,
            totalAmount: bill.totalAmount,
            serviceFinalTotal: bill.serviceFinalTotal,
            itemFinalTotal: bill.itemFinalTotal,
          }));
        });
  
        setBillingData(billingData);
        setFilteredBillingData(billingData);
        calculateTotalAmount(billingData);
        updateChartData(chartViewMode, billingData);
      } catch (error) {
        console.error("Error fetching billing data:", error);
      }
    };
  
    fetchBillingData();
  }, [chartViewMode, salonId, branchId]); // Include salonId and branchId in the dependency array
  
 
  // Modify the fetchAllData function to include serviceFinalTotal
  const fetchAllData = () => {
    fetch(`${BASE_URL}/api/customers?salonId=${salonId}&branchId=${branchId}`)
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Fetched data is not an array");
        }

        const billingData = [];

        data.forEach((customer) => {
          if (customer.billing && customer.billing.length > 0) {
            customer.billing.forEach((bill) => {
              billingData.push({
                _id: bill._id,
                billNumber: bill.billNumber,
                date: bill.date,
                customer: customer.name,
                discountPercent: bill.serviceDiscountPercent,
                ProductDiscountPercent: bill.itemDiscountPercent,
                totalAmount: bill.totalAmount,
                serviceFinalTotal: bill.serviceFinalTotal,
                itemFinalTotal: bill.itemFinalTotal,
              });
            });
          }
        });

        setBillingData(billingData);
        setFilteredBillingData(billingData);
        calculateTotalAmount(billingData);
        updateChartData(chartViewMode, billingData);
      })
      .catch((error) => {
        console.error("Error fetching billing data:", error);
      });
  };
 

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartContainer.current;

    if (ctx && chartData && showChart) {
      try {
        const newChartInstance = new Chart(ctx, {
          type: "bar",
          data: chartData,
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        chartInstance.current = newChartInstance;
      } catch (error) {
        console.error("Error creating chart:", error);
      }
    }
  }, [chartData, showChart]);

  const handleShowToday = () => {
    setShowAll(false);
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);

    const todayData = billingData.filter((billing) => billing.date === today);
    setFilteredBillingData(todayData);
    calculateTotalAmount(todayData);
    updateChartData(chartViewMode, todayData);
  };

  const handleClickShowAll = () => {
    setShowAll(true);
    setFromDate(""); // Clear fromDate
    setToDate(""); // Clear toDate
    fetchAllData(); // Fetch all data
  };
  const totalPages = Math.ceil(filteredBillingData.length / rowsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBillingData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFirstPageClick = () => {
    setCurrentPage(1);
  };

  const handlePreviousPageClick = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPageClick = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleLastPageClick = () => {
    setCurrentPage(totalPages);
  };
  const getDisplayedPages = () => {
    // Implement the logic to get the array of displayed page numbers
    // based on the current page, total pages, and the number of pages to show.
    // You can use Math.min and Math.max to ensure the displayed pages are within valid range.
    // Example:
    const maxPagesToShow = 2;
    const middlePage = Math.ceil(maxPagesToShow / 2);
    const startPage = Math.max(1, currentPage - middlePage + 1);
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options).replace(/\//g, "-");
  }
 
  const handleExport = () => {
    // Fetch username (replace with actual method to get username)
    const userName = localStorage.getItem("employeeName"); // Replace with actual logic to fetch username
  
    // Format current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const formattedTime = currentDate.toLocaleTimeString().replace(/:/g, "-");
    const dateTimeString = `${formattedDate}_${formattedTime}`;
  
    // Generate CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
  
    // Add header row
    csvContent += "Bill Number,Customer Name,Product Total Amount,Service Total Amount,Service Discount,Product Discount,Bill Date,Discount,Total Bill Amount\n";
  
    // Add data rows
    billingData.forEach((billing) => {
      csvContent += `${billing.billNumber},${billing.customer},${billing.itemFinalTotal},${billing.serviceFinalTotal},${billing.discountPercent}%,${billing.ProductDiscountPercent}%,${formatDate(
        billing.date
      )},${billing.discountPercent}%,${billing.totalAmount.toFixed(2)}\n`;
    });
  
    // Add total amount row
    csvContent += `,,,,,,,,Total Amount: Rs ${totalAmount.toFixed(2)}\n`;
  
    // Create a link element to trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
  
    // Set the download attribute with username and current date/time
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${userName}_${dateTimeString}_billing_report.csv`);
  
    document.body.appendChild(link);
  
    // Trigger download
    link.click();
  };
  
  
  

  
  

  return (
    <div className="main-empp">
      <div className="billing-table-container-sk654s">
        <h5 className="heading234">Billing Report</h5>

        <div className="date-filter-section-sk654s">
          <div className="flex-109586">
            {/* <div className="flex-1095"> */}
            <div className="flex143">
              <div className="container490">
                <label htmlFor="fromDate" className="date-label-sk654s">
                  From Date:
                </label>
                <input
                  type="date"
                  id="fromDate"
                  className="date-input-sk654s"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="container490">
                <label htmlFor="toDate" className="date-label-sk654s">
                  To Date:
                </label>
                <input
                  type="date"
                  id="toDate"
                  className="date-input-sk654s"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <div className="button456">
                <button onClick={handleFilter} className="filter-button-sk654s">
                  Filter
                </button>
                &nbsp;
                <button onClick={handleExport} className="filter-button-sk654s">
                  Export
                </button>
              </div>
            </div>

            {/* </div> */}
            <div className="btns-783">
              <button
                onClick={handleClickShowAll}
                className="show-all-button-sk654s"
              >
                Show All
              </button>
              &nbsp;
              <button
                onClick={handleShowToday}
                className="show-today-button-sk654s"
              >
                Today
              </button>
              &nbsp;
              <button
                onClick={toggleChartVisibility}
                className="show-chart-button"
              >
                {showChart ? "Close Chart" : "Show Chart"}
              </button>
            </div>
          </div>
          {/* </div> */}

          <div className="pie-chart-container">
            {showChart && (
              <div className="bar-graph-container-cvvroyalrpt">
                <canvas
                  ref={chartContainer}
                  id="income-chart"
                  className="chartrange574"
                ></canvas>
              </div>
            )}
          </div>
        </div>
        {/* <div className='table-container-sk654s'> */}
        <div className="tble-overflow12">
          <table className="billing-table-sk654s">
            <thead className="thead87">
              <tr className="billing-table-header-sk654s">
                <th className="billing-table-cell-sk654s">Bill Number</th>
                <th className="billing-table-cell-sk654s">Customer Name</th>
                {/* <th className="billing-table-cell-sk654s">Appointment Date</th> */}
                <th className="billing-table-cell-sk654s">Bill Date</th>
                <th className="billing-table-cell-sk654s">Product Total Amount</th>
                <th className="billing-table-cell-sk654s">service Total Amount</th>
                <th className="billing-table-cell-sk654s">Service Discount</th>
                <th className="billing-table-cell-sk654s">Product Discount</th>

                <th className="billing-table-cell-sk654s">Total Bill Amount</th>
              </tr>
            </thead>
            <tbody className="thead87">
              {currentItems.map((billing) => (
                <tr className="customer-table11-td1" key={billing._id}>
                  <td className="customer-table11-td1">{billing.billNumber}</td>
                  <td className="customer-table11-td1 text-left443">
                    {billing.customer}
                  </td>
                  {/* <td className="customer-table11-td1 text-left443">
                           {billing.appointmentDate} 
                    </td> */}
                  <td className="customer-table11-td1">
                    {formatDate(billing.date)}
                  </td>
                 <td className="customer-table11-td1 text-left443" >
                      
               {  billing.itemFinalTotal.toFixed(2)}
                 </td>

                  
              <td className="customer-table11-td1 text-left443">{billing.serviceFinalTotal}
              </td>
              

                  <td className="customer-table11-td1">
                    {billing.discountPercent}%
                  </td>
                  <td className="customer-table11-td1">
                    {billing.ProductDiscountPercent}%
                  </td>
                  <td className="customer-table11-td1">
                    {typeof billing.totalAmount === "number"
                      ? billing.totalAmount.toFixed(2)
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationBillReport
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          handleFirstPageClick={handleFirstPageClick}
          handlePreviousPageClick={handlePreviousPageClick}
          handleNextPageClick={handleNextPageClick}
          handleLastPageClick={handleLastPageClick}
          getDisplayedPages={getDisplayedPages}
          filteredBills={filteredBillingData}
        />

        <p className="para7890">Total Amount: Rs {totalAmount.toFixed(2)}</p>
      </div>
      <div>
        <div className="servicetable-cvvroyal">
          <ServiceTable />
        </div>
        <div className="itemtable-cvvroyal">
          <ItemTable />
        </div>
        <div>
          <EmployeeTable /> 
        </div>
        {/* <CustomerReport /> */}
      </div>
    </div>
  );
}

export default BillingTable;
