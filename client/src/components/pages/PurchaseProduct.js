// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../styles/PurchaseProduct.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { BASE_URL } from "../Helper/helper";

// const PurchaseProduct = ({ onNewSupplierClick }) => {
//   const [productList, setProductList] = useState([]);
//   const [, /*branchList*/ setBranchList] = useState([]);
//   const [purchaseList, setPurchaseList] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [, /*error*/ setError] = useState(null);

//   const [isFormVisible, setIsFormVisible] = useState(true);
//   const [tableData, setTableData] = useState([
//     {
//       product: "",
//       quantity: "",
//       cp: "",
//       // expiryDate: "",
//     },
//   ]);

//   // Define a state variable for the latest billNumber
//   const [latestBillNumber, setLatestBillNumber] = useState(0);

//   useEffect(() => {
//     const fetchPurchaseList = async () => {
//       try {
//         const salonId = localStorage.getItem("salon_id");
//         if (!salonId) {
//           console.error("Salon ID not found in local storage");
//           return;
//         }

//         const response = await axios.get(
//           `${BASE_URL}/api/stock?salon_id=${salonId}`
//         );
//         const responseData = response.data;
//         setPurchaseList(responseData);

//         // Calculate the latest billNumber from the fetched data
//         const latestNumber = responseData.reduce((max, purchase) => {
//           const billNumber = parseInt(purchase.billNumber);
//           return isNaN(billNumber) ? max : Math.max(max, billNumber);
//         }, 0);

//         // Set the latest billNumber in the state
//         setLatestBillNumber(latestNumber);
//       } catch (error) {
//         console.error("Error fetching purchase data:", error);
//         // Handle error, e.g., display a toast message
//         toast.error("Error fetching purchase data");
//       }
//     };

//     fetchPurchaseList();
//   }, []);

//   useEffect(() => {
//     const fetchBranches = async () => {
//       const salonId = localStorage.getItem("salon_id");
//       if (!salonId) {
//         console.error("Salon ID not found in local storage");
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `${BASE_URL}/api/branches?salon_id=${salonId}`
//         );
//         const activeBranches = response.data.filter(
//           (branch) => branch.status !== "IA"
//         );
//         setBranches(activeBranches);
//       } catch (error) {
//         console.error("Error fetching branches:", error.message);
//         setError("Error fetching branches");
//       }
//     };

//     fetchBranches();
//   }, []);

//   const handleBranchNameChange = (e) => {
//     const selectedBranchName = e.target.value;
//     const selectedBranch = branches.find(
//       (branch) => branch.branchName === selectedBranchName
//     );

//     setFormData((prevData) => ({
//       ...prevData,
//       branch_id: selectedBranch ? selectedBranch.branch_id : "",
//       branchName: selectedBranchName, // Update to 'branch name'
//     }));
//   };
//   const handleBranchIdChange = (e) => {
//     const selectedBranchId = e.target.value;
//     const selectedBranch = branches.find(
//       (branch) => branch.branch_id === selectedBranchId
//     );

//     if (selectedBranch) {
//       setFormData((prevData) => ({
//         ...prevData,
//         branchId: selectedBranchId, // Ensure correct key name
//         branchName: selectedBranch.branchName,
//       }));
//     } else {
//       setFormData((prevData) => ({
//         ...prevData,
//         branchId: selectedBranchId, // Ensure correct key name
//         branchName: "",
//       }));
//     }
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();

//     // console.log("FormData to be sent:", formData);
//     // console.log("TableData to be sent:", tableData);

//     if (
//       !formData.purchaseDate.trim() ||
//       !formData.billNumber.trim() ||
//       !formData.paymentType.trim() ||
//       !formData.companyName.trim() ||
//       !formData.branchId.trim() ||
//       !formData.branchName.trim() ||
//       tableData.some(
//         (entry) =>
//           !entry.product.trim() || !entry.quantity.trim() || !entry.cp.trim()
//       )
//     ) {
//       toast.error("Please fill all the required fields");
//       return;
//     }

//     try {
//       const newBillNumber = latestBillNumber + 1;

//       const salonId = localStorage.getItem("salon_id");
//       if (!salonId) {
//         toast.error("Salon ID is not found in local storage");
//         return;
//       }

//       let createdBy = localStorage.getItem("employeeName"); // Default to employeeName

//       // If employeeName is not available, fallback to adminName for admins
//       if (!createdBy && localStorage.getItem("userRole") === "admin") {
//         createdBy = localStorage.getItem("adminName");
//       }

//       // If createdBy is still not available, use a generic fallback
//       createdBy = createdBy || "Unknown User";

//       const modifiedBy = createdBy;

//       const purchaseData = {
//         ...formData,
//         billNumber: newBillNumber.toString(),
//         salonId: salonId,
//         tableData: tableData.map((entry) => {
//           const selectedProduct = productList.find(
//             (product) => product._id === entry.product
//           );
//           return {
//             product: selectedProduct ? selectedProduct.itemName : entry.product,
//             quantity: entry.quantity,
//             cp: entry.cp,
//           };
//         }),
//         createdBy: createdBy,
//         createdAt: new Date().toISOString(),
//         modifiedBy: modifiedBy,
//         modifiedAt: new Date().toISOString(),
//       };

//       // console.log("Purchase data being sent:", purchaseData);

//       await axios.post(`${BASE_URL}/api/purchase`, purchaseData);

//       toast.success("Saved Successfully");
//       setLatestBillNumber(newBillNumber);
//       setTableData([
//         {
//           product: "",
//           quantity: "",
//           cp: "",
//         },
//       ]);
//       setFormData({
//         purchaseDate: "",
//         billNumber: newBillNumber.toString(),
//         paymentType: "",
//         companyName: "",
//         branchId: "",
//         branchName: "",
//       });
//       setNewEntry({
//         product: "",
//         quantity: "",
//         cp: "",
//       });
//     } catch (error) {
//       toast.error("Error while saving the data");
//       console.error("Error while saving the data:", error);
//     }
//   };

//   const newBillNumber =
//     purchaseList.length > 0
//       ? Math.max(
//           ...purchaseList.map((purchase) => {
//             const billNumber = parseInt(purchase.billNumber);
//             return isNaN(billNumber) ? 0 : billNumber;
//           })
//         ) + 1
//       : 1;

//   //   Set the newBillNumber in the formData state
//   useEffect(() => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       billNumber: newBillNumber.toString(),
//     }));
//   }, [newBillNumber]);

//   const [formData, setFormData] = useState({
//     purchaseDate: "",
//     billNumber: newBillNumber.toString(),
//     paymentType: "",
//     companyName: "",
//   });

//   const [, setNewEntry] = useState({
//     product: "",
//     quantity: "",
//     cp: "",
//     // expiryDate: "",
//   });

//   const deleteEntry = (index) => {
//     const updatedTableData = [...tableData];
//     updatedTableData.splice(index, 1);
//     setTableData(updatedTableData);
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // useEffect(() => {
//   //   // Fetch vitals data from the API
//   //   const fetchProducts = async () => {
//   //     try {
//   //       const response = await axios.get(`${BASE_URL}/api/suppliers`);
//   //       const responseData = response.data;
//   //       // console.log(responseData);
//   //       setSupplierList(responseData);
//   //     } catch (error) {
//   //       console.error(error);
//   //     }
//   //   };
//   //   fetchProducts();
//   // }, []);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const salonId = localStorage.getItem("salon_id");
//         const response = await axios.get(`${BASE_URL}/api/Products`, {
//           headers: {
//             salon_id: salonId,
//           },
//         });
//         const activeProducts = response.data.filter(
//           (product) => product.status !== "IA"
//         );
//         const reversedData = activeProducts.reverse();
//         setProductList(reversedData);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/api/branches`);
//         const responseData = response.data;
//         setBranchList(responseData); // Assuming responseData is an array of objects where each object contains both branchId and branchName
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchBranches();
//   }, []);

//   const handleTableDataChange = (e, fieldName, index) => {
//     const updatedTableData = [...tableData];
//     const { value } = e.target;
  
//     // Define length constraints based on fieldName
//     const maxLengths = {
//       quantity: 4,
//       cp: 6
//     };
  
//     if (maxLengths[fieldName]) {
//       // Check if value meets the length constraints and is a valid number
//       const isValid = new RegExp(`^\\d{0,${maxLengths[fieldName]}}$`).test(value);
      
//       if (isValid) {
//         updatedTableData[index][fieldName] = value;
//       } else {
//         console.error(`Invalid input for "${fieldName}" in table row ${index + 1}: only numbers allowed and length should not exceed ${maxLengths[fieldName]} digits.`);
//         return; // Exit the function if input is invalid
//       }
//     } else {
//       // Handle other fields if necessary
//       updatedTableData[index][fieldName] = value;
//     }
  
//     setTableData(updatedTableData);
//   };

//   const addRow = () => {
//     // Create a new empty entry
//     const newEmptyEntry = {
//       product: "",
//       quantity: "",
//       cp: "",
//       // expiryDate: "",
//     };

//     // Add the new empty entry to the tableData state
//     setTableData((prevTableData) => [...prevTableData, newEmptyEntry]);
//   };

//   const handleChangeText = (event) => {
//     const { name, value } = event.target;

//     // Allow only letters, spaces, and apostrophes
//     const allowedChars = /^[a-zA-Z\s']+$/;
//     if (value === "" || allowedChars.test(value)) {
//       setFormData({ ...formData, [name]: value });
//     } else {
//       // Handle invalid input (optional: display an error message)
//       console.error(
//         `Invalid input for "${name}": only letters, spaces, and apostrophes allowed`
//       );
//     }
//   };

//   // Handle Cancel button click
//   const handleCancel = (e) => {
//     e.preventDefault(); // Prevent form submission
//     setIsFormVisible(false); // Hide the form
//   };

//   return (
//     <div>
//       <ToastContainer />
//       {isFormVisible && (
//         <form className="pp-form13" autoComplete="off" onSubmit={handleSave}>
//           <h5 className="heading234">Purchase Form</h5>
//           <div className="pp-formgroup13">
//             <label className="pp-label13">Purchase Date</label>
//             <input
//               type="date"
//               className="pp-input1345"
//               name="purchaseDate"
//               value={formData.purchaseDate}
//               onChange={handleChange}
//               required
//             ></input>
//           </div>
//           <div className="pp-formgroup13">
//             <label className="pp-label13">Bill Number</label>
//             <input
//               type="text"
//               className="pp-input13"
//               name="billNumber"
//               value={formData.billNumber}
//               onChange={handleChange}
//               disabled
//               required
//             ></input>
//           </div>

//           <div className="pp-formgroup13">
//             <label className="pp-label13">Branch ID:</label>
//             <select
//               className="empinput456"
//               name="branchId" // Ensure correct key name
//               value={formData.branchId} // Ensure correct key name
//               onChange={handleBranchIdChange}
//             >
//               <option value="">Select Branch ID</option>
//               {branches.map((branch) => (
//                 <option key={branch.branch_id} value={branch.branch_id}>
//                   {branch.branch_id}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="pp-formgroup13">
//             <label htmlFor="branch_name" className="pp-label13">
//               Branch Name
//             </label>
//             <select
//               className="empinput456"
//               name="branchName"
//               value={formData.branchName}
//               onChange={handleBranchNameChange}
//               required
//             >
//               <option value="">Select Branch Name</option>
//               {branches.map((branch) => (
//                 <option key={branch.branch_id} value={branch.branchName}>
//                   {branch.branchName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="pp-formgroup13">
//             <label className="pp-label13">Payment Mode</label>
//             <select
//               name="paymentType"
//               className="pp-input13"
//               value={formData.paymentType}
//               onChange={handleChange}
//               required
//             >
//               <option value="">select</option>
//               <option value="Cash">Cash</option>
//               <option value="UPI">UPI</option>
//               <option value="Debit Card">Debit Card</option>
//               <option value="Credit Card">Credit Card</option>
//             </select>
//           </div>

//           <div className="pp-formgroup13">
//             <label className="pp-label13">Company Name</label>
//             <input
//               type="text"
//               className="pp-input13"
//               name="companyName"
//               value={formData.companyName}
//               onChange={handleChangeText}
//               placeholder="Enter Company Name"
//               required
//               minLength="4"
//               maxLength="50"
//             />
//           </div>
//           <div className="tble-overflow120">
//             <table className="pp-entering1356">
//               <thead>
//                 <tr>
//                   <td className="ppe-th">Product</td>
//                   <td className="ppe-th">Quantity</td>
//                   <td className="ppe-th">C.P</td>
//                   <td className="ppe-th">Action</td>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tableData.map((entry, index) => (
//                   <tr key={index} className="space185">
//                     <td>
//                       <select
//                         className="pp-input1310"
//                         value={entry.product}
//                         onChange={(e) =>
//                           handleTableDataChange(e, "product", index)
//                         }
//                       >
//                         <option value="">Select a Product</option>
//                         {productList.map((item) => (
//                           <option value={item._id} key={item._id}>
//                             {item.itemName}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td>
//                       <input
//                         type="text"
//                         className="pp-input131010"
//                         value={entry.quantity}
//                         maxLength={4}
//                         onChange={(e) => {
//                           const newValue = e.target.value;
//                           // Check if the newValue is a valid number and does not exceed 4 digits
//                           if (/^\d{0,4}$/.test(newValue)) {
//                             handleTableDataChange(e, "quantity", index);
//                           }
//                         }}
//                         onBlur={(e) => {
//                           // If the input is empty, set the value explicitly to '0'
//                           if (e.target.value === "") {
//                             handleTableDataChange(
//                               { target: { value: "0" } },
//                               "quantity",
//                               index
//                             );
//                           }
//                         }}
//                         placeholder="Enter Quantity"
//                         required
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="text"
//                         className="pp-input131010"
//                         value={entry.cp}
//                         maxLength={6}
//                         onChange={(e) => {
//                           const newValue = e.target.value;
//                           // Check if newValue is a valid number and does not exceed 6 digits
//                           if (/^\d{0,6}$/.test(newValue)) {
//                             handleTableDataChange(e, "cp", index);
//                           }
//                         }}
//                         required
//                         placeholder="Enter CP"
//                       />
//                     </td>
//                     <td className="center45">
//                       <button
//                         type="button"
//                         className="delete-btn156"
//                         onClick={() => deleteEntry(index)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}

//                 <tr></tr>
//               </tbody>
//             </table>
//           </div>

//           <button type="button" className="add-row-btn" onClick={addRow}>
//             Add Row
//           </button>
//           <div className="pp-btn-div13">
//             <button className="pp-btns13" type="submit">
//               Save
//             </button>
//             <button type="button" className="pp-btns131" onClick={handleCancel}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default PurchaseProduct;
