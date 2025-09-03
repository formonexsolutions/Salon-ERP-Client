import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "../styles/Reports.css";
import Chart from "react-apexcharts";
import PaginationItem from "./PaginationItem";
import { BASE_URL } from "../Helper/helper";

function formatTotalPrice(totalPrice) {
  return totalPrice.toFixed(2);
}


function ItemTable() {
  const [billingData, setBillingData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPieChart, setShowPieChart] = useState(true);
  const [pieChartData, setPieChartData] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [showToday, setShowToday] = useState(false);
  const [rowsPerPage] = useState(5);
  const salonId = localStorage.getItem("salon_id");
  const branchId = localStorage.getItem("branch_id"); 

  const calculatePieChartData = useCallback((data) => {
    const pieChartLabels = [];
    const pieChartDataValues = [];
    const pieChartColors = [];

    data.forEach((bill) => {
      bill.items.forEach((item) => {
        const itemName = item.itemName;
        const price = item.price * item.quantity;
        const index = pieChartLabels.indexOf(itemName);
        if (index === -1) {
          pieChartLabels.push(itemName);
          pieChartDataValues.push(price);
          pieChartColors.push(getRandomColor()); // Assuming getRandomColor is defined elsewhere
        } else {
          pieChartDataValues[index] += price;
        }
      });
    });

    return {
      labels: pieChartLabels,
      data: pieChartDataValues,
      backgroundColor: pieChartColors,
    };
  }, []); // Empty dependency array as calculatePieChartData doesn't depend on any external state or props

  const fetchData = useCallback(() => {
    let apiUrl = `${BASE_URL}/api/customers?salonId=${salonId}&branchId=${branchId}`;

    if (showToday) {
      const today = new Date().toISOString().split("T")[0];
      apiUrl += `&fromDate=${today}&toDate=${today}`; // Use & to append query parameters
    }

    axios.get(apiUrl)
      .then((response) => {
        const billingData = response.data.reduce((acc, customer) => {
          return acc.concat(customer.billing || []);
        }, []);
        setBillingData(billingData);

        if (showPieChart) {
          const pieChartInfo = calculatePieChartData(billingData);
          setPieChartData(pieChartInfo);
        }
      })
      .catch((error) => {
        console.error("Error fetching billing data:", error);
      });
  }, [salonId, branchId, showToday, showPieChart, calculatePieChartData]); // Include calculatePieChartData in the dependency array

  useEffect(() => {
    fetchData();
  }, [fetchData, showPieChart]); // Include fetchData and showPieChart in the dependency array for useEffect



  const togglePieChart = () => {
    setShowPieChart(!showPieChart);

    if (!showPieChart) {
      const pieChartInfo = calculatePieChartData(billingData);
      setPieChartData(pieChartInfo);
    }
  };
 
  useEffect(() => {
    fetchData();
  }, [fetchData,showAll, showToday]);


 
  

  const handleShowAll = useCallback(() => {
    setShowAll(true);
    setShowToday(false);
    setFromDate("");
    setToDate("");
    fetchData();
  },[fetchData]);

  useEffect(() => {
    if (showAll) {
      handleShowAll();
    }
  }, [showAll,handleShowAll]);

  const handleShowToday = () => {
    setShowAll(false);
    setShowToday(true);
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);
    fetchData();
  };

  const handleFilter = () => {
    if (showAll) {
      setShowAll(false);
    }
    if (showToday) {
      setShowToday(false);
    }

    const filteredData = billingData
      .filter((bill) => bill.items && bill.items.length > 0)
      .map((bill) => ({
        ...bill,
        items: bill.items.map((item) => ({
          ...item,
          customer: bill.customer,
        })),
      }))
      .flat()
      .filter((item) => {
        const billDate = new Date(item.date);
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);

        return billDate >= fromDateObj && billDate <= toDateObj;
      });

    const updatedPieChartData = calculatePieChartData(filteredData);
    setPieChartData(updatedPieChartData);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const filteredBillingData = billingData.filter((bill) => {
    if (bill.items.length === 0) {
      return false;
    }
    if (fromDate && toDate) {
      const billDate = new Date(bill.date);
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);
      return billDate >= fromDateObj && billDate <= toDateObj;
    }
    return true;
  });

  const totalBillAmount = filteredBillingData.reduce((total, bill) => {
    return (
      total +
      bill.items.reduce(
        (subtotal, item) => subtotal + item.price * item.quantity,
        0
      )
    );
  }, 0);

  const totalPages = Math.ceil(filteredBillingData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = filteredBillingData.slice(startIndex, endIndex);

  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options).replace(/\//g, "-");
  }
  

  const handleExport = () => {
    const table = document.getElementById("item-table");
    const data = [];
    const userName = localStorage.getItem("employeeName");
  
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const formattedTime = currentDate.toLocaleTimeString().replace(/:/g, "-");
    const dateTimeString = `${formattedDate}_${formattedTime}`;
  
    const headers = [];
    for (let i = 0; i < table.rows[0].cells.length; i++) {
      headers.push(table.rows[0].cells[i].textContent.trim());
    }
    data.push(headers);
  
    for (let i = 1; i < table.rows.length - 1; i++) {
      const row = [];
      for (let j = 0; j < table.rows[i].cells.length; j++) {
        row.push(table.rows[i].cells[j].textContent.trim());
      }
      data.push(row);
    }
  
    // Add the total amount row
    const totalAmountRow = [`Total Amount: Rs ${formatTotalPrice(totalBillAmount)}`];
    data.push(totalAmountRow);
  
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((row) => row.join(",")).join("\n");
  
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${userName}_${dateTimeString}_Product_report.csv`);
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

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
    const maxPagesToShow = 2;
    const middlePage = Math.ceil(maxPagesToShow / 2);
    const startPage = Math.max(1, currentPage - middlePage + 1);
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  return (
    <div className="billing-table-container-sk654s">
      <h5 className="heading234">Product Sales Report</h5>
      <div className="date-filter-section-sk8765432s">
        <div className="flex-109586">
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
            <button onClick={handleFilter} className="filter-button-sk654s">
              Filter
            </button>
            &nbsp;&nbsp;
            <div className="btns-7832">
              <button onClick={handleExport} className="filter-button-sk654s">
                Export
              </button>
            </div>
          </div>
          <div className="btns-783">
            <button onClick={handleShowAll} className="show-all-button-sk654s">
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
            <button onClick={togglePieChart} className="show-chart-button">
              {showPieChart ? "Close Chart" : "Show Chart"}
            </button>
          </div>
        </div>
        {showPieChart && pieChartData && (
          <div className="pie-chart-container">
            <Chart
              options={{
                labels: pieChartData.labels,
              }}
              series={pieChartData.data}
              type="pie"
              width={380}
            />
          </div>
        )}
      </div>
      <div className="tble-overflow12">
        <table className="billing-table-sk654s" id="item-table">
          <thead className="thead87">
            <tr className="billing-table-header-sk654s">
              <th className="billing-table-cell-sk654s">Product Name</th>
              <th className="billing-table-cell-sk654s">Product Price</th>
              <th className="billing-table-cell-sk654s">Total Quantity</th>
              <th className="billing-table-cell-sk654s">
              Product Total Amount
              </th>
              <th className="billing-table-cell-sk654s">Date</th>
            </tr>
          </thead>
          <tbody className="thead87">
            {currentPageData.map((bill, index) => (
              <tr key={index} className="billing-table-row-sk654s">
                <td className="customer-table11-td">
                  {bill.items.map((item) => item.itemName).join(", ")}
                </td>
                <td className="billing-table-cell-sk654s">
                  {bill.items.map((item) => item.price).join(", ")}
                </td>
                <td className="billing-table-cell-sk654s">
                  {bill.items.map((item) => item.quantity).join(", ")}
                </td>
                <td className="billing-table-cell-sk654s">
                {bill.itemFinalTotal.toFixed(2)}
                </td>
                <td className="billing-table-cell-sk654s">
                  {formatDate(bill.date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationItem
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        handleFirstPageClick={handleFirstPageClick}
        handlePreviousPageClick={handlePreviousPageClick}
        handleNextPageClick={handleNextPageClick}
        handleLastPageClick={handleLastPageClick}
        getDisplayedPages={getDisplayedPages}
        filteredItems={filteredBillingData}
      />
      <p className="para7890">
        Total Amount: Rs {formatTotalPrice(totalBillAmount)}
      </p>
    </div>
  );
}

export default ItemTable;
