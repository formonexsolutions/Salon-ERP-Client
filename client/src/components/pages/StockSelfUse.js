import React, { useState, useEffect, useRef } from "react";
import "../styles/StockSelfUse.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Helper/helper";

const StockSelfUse = () => {
  const [productList, setProductList] = useState([]);
  const [/*branches*/, setBranches] = useState([]);
  const [/*error*/, setError] = useState(null);
  const [tableData, setTableData] = useState([
    {
      product: "",
      quantity: "",
      consumedBy: "",
    },
  ]);
  const [formData, setFormData] = useState({
    branchId: "",
    branchName: "",
    dateOfRequest: new Date().toISOString().slice(0, 10), // Set the current date in YYYY-MM-DD format
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const salonId = localStorage.getItem("salon_id");
        const response = await axios.get(`${BASE_URL}/api/Products`, {
          params: { salon_id: salonId }, 
        });
        const activeProducts = response.data.filter(
          (product) => product.status !== "IA"
        );
        const reversedData = activeProducts.reverse();
        setProductList(reversedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();

    const userRole = localStorage.getItem("userRole");
    let userName;

    if (userRole === "admin") {
      userName =
        localStorage.getItem("adminName") ||
        localStorage.getItem("employeeName");
    } else {
      userName = localStorage.getItem("employeeName");
    }

    // If userName is still not available, use a generic fallback
    userName = userName || "Unknown User";

    setTableData((prevTableData) =>
      prevTableData.map((entry) => ({
        ...entry,
        consumedBy: userName,
      }))
    );
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      const salonId = localStorage.getItem("salon_id");
      if (!salonId) {
        console.error("Salon ID not found in local storage");
        return;
      }

      try {
        const response = await axios.get(
          `${BASE_URL}/api/branches?salon_id=${salonId}`
        );
        const activeBranches = response.data.filter(
          (branch) => branch.status !== "IA"
        );
        setBranches(activeBranches);
      } catch (error) {
        console.error("Error fetching branches:", error.message);
        setError("Error fetching branches");
      }
    };

    fetchBranches();
  }, []);

  const handleSave = async () => {
    const nonEmptyData = tableData.filter(
      (entry) => entry.product.trim() !== "" && entry.quantity.trim() !== ""
    );

    if (nonEmptyData.length === 0) {
      toast.error("Please enter product and quantity before saving.");
      return;
    }

    const dataToSend = nonEmptyData.map((entry) => ({
      ...entry,
      branchId: formData.branchId,
      branchName: formData.branchName,
      dateOfRequest: formData.dateOfRequest,
    }));

    try {
      const salonId = localStorage.getItem("salon_id"); // Read salon_id from local storage
      if (!salonId) {
        console.error("Salon ID not found in local storage");
        return;
      }

      await axios.post(
        `${BASE_URL}/api/stock-selfuse?salon_id=${salonId}`,
         dataToSend,
      );
      // console.log(response.data);
      toast.success("Data saved successfully");
      setTableData([
        {
          product: "",
          quantity: "",
          consumedBy: tableData[0].consumedBy,
        },
        ...tableData.slice(1),
      ]);
    } catch (error) {
      toast.error("Error saving data");
      console.error(error);
    }
  };

  const deleteEntry = (index) => {
    if (index === 0) {
      toast.error("First row cannot be deleted.");
      return;
    }

    const confirmToastId = toast(
      <div>
        <p>Are you sure you want to delete this entry?</p>
        <button
          className="confirm-btn confirm-yes"
          onClick={() => {
            handleConfirmDelete(confirmToastId, index);
          }}
        >
          Yes
        </button>
        <button
          className="confirm-btn confirm-no"
          onClick={() => {
            handleCancelDelete(confirmToastId);
          }}
        >
          No
        </button>
      </div>,
      {
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };
  // const handleBranchIdChange = (e) => {
  //   const selectedBranchId = e.target.value;
  //   const selectedBranch = branches.find(
  //     (branch) => branch.branch_id === selectedBranchId
  //   );

  //   if (selectedBranch) {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       branchId: selectedBranchId, // Ensure correct key name
  //       branchName: selectedBranch.branchName,
  //     }));
  //   } else {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       branchId: selectedBranchId, // Ensure correct key name
  //       branchName: "",
  //     }));
  //   }
  // };
  const handleConfirmDelete = (toastId, index) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);

    toast.dismiss(toastId);
    toast.success("Delete Successfully!");
  };

  const handleCancelDelete = (toastId) => {
    toast.dismiss(toastId);
    toast.success("Delete Canceled!");
  };

  const addRow = () => {
    const newEmptyEntry = {
      product: "",
      quantity: "",
      consumedBy: tableData[0].consumedBy,
    };
    setTableData((prevTableData) => [...prevTableData, newEmptyEntry]);
  };

  const productInputRef = useRef(null);
  const quantityInputRef = useRef(null);

  const handleKeyDown = (event, fieldName, index) => {
    if (event.key === "ArrowRight" || event.key === "Enter") {
      if (fieldName === "product" && quantityInputRef.current) {
        quantityInputRef.current.focus();
      } else if (fieldName === "quantity" && index === tableData.length - 1) {
        addRow();
        productInputRef.current.focus();
      }
    }
  };
  // const handleBranchNameChange = (e) => {
  //   const selectedBranchName = e.target.value;
  //   const selectedBranch = branches.find(
  //     (branch) => branch.branchName === selectedBranchName
  //   );

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     branch_id: selectedBranch ? selectedBranch.branch_id : "",
  //     branchName: selectedBranchName, // Update to 'branch name'
  //   }));
  // };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const branchId = localStorage.getItem("branch_id");
    const branchName = localStorage.getItem("branchName");
  
    if (!branchId || !branchName) {
      console.error("Required data not found in local storage");
      return;
    }
  
    setFormData((prevData) => ({
      ...prevData,
      branchId,
      branchName,
    }));
  }, []);

  return (
    <div className="A7Stockmaindiv">
      <ToastContainer />

      <h5 className="heading234">Stock Self Use</h5>
      <div className="input_self_stock">
        <div className="form-group-stock-self-use124">
          <label className="pp-label13">Branch ID:</label>
          <input
            className="empinput456"
            name="branchId"
            value={formData.branchId}
            readOnly
          />
          
        </div>
        <br />
        <div className="lable-name-saloon2345col-4">
          <label htmlFor="branch_name" className="pp-label13">
            Branch Name
          </label>
          <input
            className="empinput456"
            id="branch_name"
            name="branch_name"
            value={formData.branchName}
            readOnly
          />
        </div>
        <br />
        <div className="form-group-stock-self-use124">
          <label className="pp-label13">Date of Request</label>
          <input
            type="date"
            name="currentDate"
            className="pp-input1345"
            value={formData.dateOfRequest}
            onChange={handleChange}
            required
            readOnly
          />
        </div>
        <br />
      </div>
      <div className="kinne_iole4">
        <table className="pp-entering130">
          <thead>
            <tr>
              <td className="ppe-th">Product:</td>
              <td className="ppe-th">Quantity:</td>
              <td className="ppe-th">Consumed By:</td>
              <td className="ppe-th"></td>
            </tr>
          </thead>
          <tbody>
            {tableData.map((entry, index) => (
              <tr key={index}>
                <td>
                  <select
                    type="text"
                    className="pp-input131 pp-input1312"
                    value={entry.product}
                    onChange={(e) =>
                      setTableData((prevTableData) => {
                        const updatedTableData = [...prevTableData];
                        updatedTableData[index].product = e.target.value;
                        return updatedTableData;
                      })
                    }
                    onKeyDown={(e) => handleKeyDown(e, "product", index)}
                    ref={
                      index === tableData.length - 1 ? productInputRef : null
                    }
                  >
                    <option value="">Select an item</option>
                    {productList.map((item) => (
                      <option value={item.itemName} key={item.id}>
                        {item.itemName}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    className="pp-input13 pp-input1312"
                    value={entry.quantity}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      // Ensure only numbers are entered and limit length to 5
                      if (/^\d{0,5}$/.test(inputValue)) {
                        setTableData((prevTableData) => {
                          const updatedTableData = [...prevTableData];
                          updatedTableData[index].quantity = inputValue;
                          return updatedTableData;
                        });
                      }
                    }}
                    onKeyDown={(e) => handleKeyDown(e, "quantity", index)}
                    ref={
                      index === tableData.length - 1 ? quantityInputRef : null
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="pp-input13 pp-input1312"
                    value={entry.consumedBy}
                    readOnly
                  />
                </td>
                <td>
                  <button
                    className="delete-buttonss"
                    onClick={() => deleteEntry(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          className="add-row-btn add-row-btn90"
          onClick={addRow}
        >
          Add Row
        </button>
      </div>

      <div className="A7Stock-sub-div3">
        <button className="A7Stock-sub-div2-button3" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default StockSelfUse;
