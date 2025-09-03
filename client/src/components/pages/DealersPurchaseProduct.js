import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PurchaseProduct.css";
import "../styles/DealersPurchaseProduct.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../Helper/helper";

const DealersPurchaseProduct = ({ onNewSupplierClick, onClose }) => {
  const [/*productList*/, setProductList] = useState([]);
  const [/*dealpurchaseList*/, setdealPurchaseList] = useState([]);
  const [/*branches*/, setBranches] = useState([]);
  const [, setError] = useState(null);
  const [/*dealerPhone*/, /*setDealerPhone*/] = useState("");
  const [isFormVisible, /*setIsFormVisible*/] = useState(true);
  const [/*dealers*/, setDealers] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [/*dealerName*/, /*setDealerName*/] = useState("");
  const [dealerNames, setDealerNames] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedDealerId, setSelectedDealerId] = useState("");
  const [selectedDealerPhone, setSelectedDealerPhone] = useState("");
  const [/*selectedDealer*/, /*setSelectedDealer*/] = useState("");
  const [selectedDealerCompany, setSelectedDealerCompany] = useState("");
  const [selectedDealerDealerId, setSelectedDealerDealerId] = useState("");
  const [/*categories*/, setCategories] = useState([]);
  const [/*uniqueCompanies*/, setUniqueCompanies] = useState([]);
  const [/*uniqueProducts*/, setUniqueProducts] = useState([]);
  const [/*productDescriptions*/, setProductDescriptions] = useState([]);
  const [/*quantityOptions*/, setQuantityOptions] = useState([]);
  const [/*unitOptions*/, setUnitOptions] = useState([]);
  const [/*dealerId*/, setDealerId] = useState(
    localStorage.getItem("dealerId") || ""
  ); // Store dealerId
  const [categoryDetails, setCategoryDetails] = useState([]); // Store category details
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, /*setItemsPerPage*/] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [/*currentItem*/, setCurrentItems] = useState([]);
  const [/*tableData*/, /*setTableData*/] = useState([
    {
      Productquantity: "",
      categoryName: "",
      company: "",
      productName: "",
      productDescription: "",
      quantity: "",
      unit: "",
      selected: false,
    },
  ]);

  const [formData, setFormData] = useState({
    purchaseDate: "",
    branchId: "",
    branchName: "",
    phoneNumber: "",
    address: "",
    state: "",
    city: "",
    area: "",
    dealerName: "",
    dealerPhone: "",
    dealerCompany: "",
    dealerId: "",
    tableData: [
      {
        Productquantity: "",
        categoryName: "",
        company: "",
        productName: "",
        productDescription: "",
        quantity: "",
        unit: "",
      },
    ],
    createdBy: "",
    modifiedBy: "",
    Productquantity: "",
  });

  useEffect(() => {
    const branchId = localStorage.getItem("branch_id");
    const branchName = localStorage.getItem("branchName");
    const phoneNumber = localStorage.getItem("phoneNumber");
    const address = localStorage.getItem("address");

    setFormData((prevData) => ({
      ...prevData,
      branchId: branchId || "",
      branchName: branchName || "",
      phoneNumber: phoneNumber || "",
      address: address || "",
    }));
  }, []);

  useEffect(() => {
    const fetchPurchaseList = async () => {
      try {
        const salonId = localStorage.getItem("salon_id");
        if (!salonId) {
          console.error("Salon ID not found in local storage");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/api/dealstock?salon_id=${salonId}`
        );
        const responseData = response.data;
        setdealPurchaseList(responseData);
      } catch (error) {
        console.error("Error fetching purchase data:", error);
        toast.error("Error fetching purchase data");
      }
    };

    fetchPurchaseList();
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

  // const handleBranchChange = (e) => {
  //   const selectedBranchId = e.target.value;
  //   const selectedBranch = branches.find(
  //     (branch) => branch.branch_id === selectedBranchId
  //   );

  //   if (selectedBranch) {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       branchId: selectedBranchId,
  //       branchName: selectedBranch.branchName,
  //       phoneNumber: selectedBranch.phoneNumber,
  //       address: selectedBranch.address,
  //     }));
  //   } else {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       branchId: selectedBranchId,
  //       branchName: "",
  //       phoneNumber: "",
  //       address: "",
  //     }));
  //   }
  // };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const dealer_id = localStorage.getItem("dealerId");
        if (!dealer_id) {
          // toast.error("Dealer ID is not found in local storage");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/api/customcategory/${dealer_id}`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // toast.error('Error fetching categories');
      }
    };

    fetchCategories();
  }, []);
  const fetchCompanies = async (categoryName) => {
    try {
      const dealer_id = localStorage.getItem("dealerId");
      if (!dealer_id) {
        // toast.error("Dealer ID is not found in local storage");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/dealercompanies/${dealer_id}/${encodeURIComponent(
          categoryName
        )}`
      );
      const companies = response.data;

      const uniqueCompanies = Array.from(
        new Set(companies.map((company) => company.company))
      ).map((name) => companies.find((company) => company.company === name));

      setUniqueCompanies(uniqueCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Error fetching companies");
    }
  };
  const fetchProducts = async (categoryName, company) => {
    try {
      const dealer_id = localStorage.getItem("dealerId");
      if (!dealer_id) {
        // toast.error("Dealer ID is not found in local storage");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/dealerproducts/${dealer_id}/${encodeURIComponent(
          categoryName
        )}/${encodeURIComponent(company)}`
      );
      const products = response.data;

      const uniqueProducts = Array.from(
        new Set(products.map((product) => product.productName))
      ).map((name) => products.find((product) => product.productName === name));

      setUniqueProducts(uniqueProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products");
    }
  };



const handleSave = async (e) => {
  e.preventDefault();
    try {
        // Get the salonId, adminName, and employeeName from local storage
        const salonId = localStorage.getItem("salon_id");
        const adminName = localStorage.getItem("adminName");
        const employeeName = localStorage.getItem("employeeName");

        // Determine the creator's name based on the available data
        const createdBy = adminName || employeeName || "";
        const modifiedBy = createdBy;

        // Filter and map the selected items
        const selectedItems = currentItems.filter(item => item.selected);

        // Prepare the payload with additional form data
        const payload = selectedItems.map(item => ({
          categoryName: item.categoryName || "",
          company: item.company || "",
          productName: item.productName || "",
          productDescription: item.productDescription || "",
          quantity: item.quantity || "",
          Productquantity: item.selectedQuantity || item.Productquantity,
          unit: item.unit || "",
      }));

      const updatedFormData = {
        purchaseDate: formData.purchaseDate || "",
        branchId: formData.branchId || "",
        branchName: formData.branchName || "",
        address: formData.address || "",
        phoneNumber: formData.phoneNumber || "",
        dealerName: formData.dealerName || "",
        dealerPhone: formData.dealerPhone || "",
        dealerCompany: formData.dealerCompany || "",
        dealerId: formData.dealerId || "",
        state: formData.state || "",
        city: formData.city || "",
        area: formData.area || "",
        createdBy: formData.createdBy || createdBy,
        modifiedBy: formData.modifiedBy || modifiedBy,
        salonId: salonId || "",
        tableData: payload, // Include the selected items' payload
    };

        // Send the data to the server
        const response = await axios.post(`${BASE_URL}/api/dealerspurchase`, updatedFormData);

        if (response.status === 200) {
            console.log('Data successfully saved', response.data);

            // Show success toast message
            toast.success("Purchase saved successfully");

            // Reset form data
            setFormData({
                purchaseDate: "",
                branchId: "",
                branchName: "",
                phoneNumber: "",
                address: "",
                state: "",
                city: "",
                area: "",
                dealerName: "",
                dealerPhone: "",
                dealerCompany: "",
                dealerId: "",
                tableData: [{  
                  Productquantity: "",
                  categoryName: "",
                  company: "",
                  productName: "",
                  productDescription: "",
                  quantity: "",
                  unit: "",
                  selected: false // Make sure to reset the selected status
              }],
                createdBy: "",
                modifiedBy: "",
            });
        }
        onClose();
    } catch (error) {
        console.error('There was an error saving the data!', error);

        // Show error toast message
        toast.error("Failed to save the form");
    }
};


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const deleteEntry = (index) => {
  //   const updatedTableData = [...tableData];
  //   updatedTableData.splice(index, 1);
  //   setTableData(updatedTableData);
  // };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    if (name === "categoryName") {
      fetchCompanies(value);
    } else if (name === "company") {
      fetchProducts(formData.categoryName, value);
    } else if (name === "productName") {
      fetchProductDescriptions(value);
    } else if (name === "productDescription") {
      fetchQuantityAndUnit(value);
    }
  };
  // const [, setNewEntry] = useState({
  //   Productquantity: "",
  //   categoryName: "",
  //   company: "",
  //   productName: "",
  //   productDescription: "",
  //   quantity: "",
  //   unit: "",
  // });

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/dealers`);
        const dealersData = response.data.dealers || [];
        setDealers(dealersData);

        // Extract unique states from dealers
        const uniqueStates = [
          ...new Set(dealersData.map((dealer) => dealer.state)),
        ];
        setStates(uniqueStates);

        // Check local storage for selected state and set it
        const storedState = localStorage.getItem("selectedState");
        if (storedState) {
          setSelectedState(storedState);
        }
      } catch (error) {
        console.error("Error fetching dealers:", error.message);
        toast.error("Error fetching dealers");
      }
    };

    fetchDealers();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedState) {
        try {
          const response = await axios.get(`${BASE_URL}/api/cities-by-state`, {
            params: { state: selectedState },
          });
          setCities(response.data.cities || []);
          setAreas([]); // Reset areas when state changes
          setDealerNames([]); // Reset dealer names when state changes
          setSelectedArea(""); // Reset selected area when state changes
          // setSelectedDealerName('');
          setSelectedDealerId("");
          setSelectedDealerPhone("");
          setSelectedDealerCompany("");
          setSelectedDealerDealerId("");
          // Reset selected dealer name when state changes
        } catch (error) {
          console.error("Error fetching cities:", error.message);
          setError("Error fetching cities");
        }
      }
    };

    fetchCities();
  }, [selectedState]);

  useEffect(() => {
    const fetchAreas = async () => {
      if (selectedState && selectedCity) {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/areas-by-state-and-city`,
            { params: { state: selectedState, city: selectedCity } }
          );
          const areasData = response.data.areas || [];
          setAreas(areasData);

          // Assuming you want to update dealer info based on fetched areas
          // For example, you could have a function to get dealer details based on areas
          // const dealerData = await fetchDealerData(areasData);
          // setDealerNames(dealerData.names);

          // Reset dealer information
          setDealerNames([]); // Reset dealer names when city changes
          setSelectedDealerId("");
          setSelectedDealerPhone("");
          setSelectedDealerCompany("");
          setSelectedDealerDealerId("");

          // Optionally, update local storage with a default or new dealer ID if available
          if (areasData.length > 0) {
            const defaultDealerId = areasData[0].dealerId; // Assuming areasData contains dealer IDs
            setSelectedDealerId(defaultDealerId);
            localStorage.setItem("dealerId", defaultDealerId);
          }
        } catch (error) {
          console.error("Error fetching areas:", error.message);
          setError("Error fetching areas");
        }
      }
    };

    fetchAreas();
  }, [selectedState, selectedCity]);

  useEffect(() => {
    const fetchDealerNames = async () => {
      if (selectedState && selectedCity && selectedArea) {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/dealers-by-state-city-area`,
            {
              params: {
                state: selectedState,
                city: selectedCity,
                area: selectedArea,
              },
            }
          );
          setDealerNames(response.data.dealers || []);
        } catch (error) {
          console.error("Error fetching dealer names:", error.message);
        }
      }
    };

    fetchDealerNames();
  }, [selectedState, selectedCity, selectedArea]);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);

    setSelectedDealerId("");
    setSelectedDealerPhone("");
    setSelectedDealerCompany("");
    setSelectedDealerDealerId("");
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);

    setSelectedDealerId("");
    setSelectedDealerPhone("");
    setSelectedDealerCompany("");
    setSelectedDealerDealerId("");
  };

  // const handleAreaChange = (e) => {
  //   setSelectedArea(e.target.value);
  //   setSelectedDealerId("");
  //   setSelectedDealerPhone("");
  //   setSelectedDealerCompany("");
  //   setSelectedDealerDealerId("");
  // };

  // const handleDealerNameChange = (e) => {
  //   setSelectedDealerName(e.target.value);
  // };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const salonId = localStorage.getItem("salon_id");
        const response = await axios.get(`${BASE_URL}/api/dealersproducts`, {
          headers: {
            salon_id: salonId,
          },
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
  }, []);

  // const handleChangeText = (event) => {
  //   const { name, value } = event.target;

  //   const allowedChars = /^[a-zA-Z\s']+$/;
  //   if (value === "" || allowedChars.test(value)) {
  //     setFormData({ ...formData, [name]: value });
  //   } else {
  //     console.error(
  //       `Invalid input for "${name}": only letters, spaces, and apostrophes allowed`
  //     );
  //   }
  // };

  // const handleCancel = (e) => {
  //   // Clear specific local storage item (dealerId)
  //   e.preventDefault();
  //   // Reset form data to initial state
  //   setFormData({
  //     purchaseDate: "",
  //     branchId: "",
  //     branchName: "",
  //     phoneNumber: "",
  //     address: "",
  //     state: "",
  //     city: "",
  //     area: "",
  //     dealerName: "",
  //     dealerPhone: "",
  //     dealerCompany: "",
  //     dealerId: "",
  //     products: [
  //       {
  //         Productquantity: "",
  //         categoryName: "",
  //         company: "",
  //         productName: "",
  //         productDescription: "",
  //         quantity: "",
  //         unit: "",
  //       },
  //     ],
  //   });

  //   // Reset selected values to initial state
  //   setSelectedState("");
  //   setSelectedCity("");
  //   setSelectedArea("");
  //   setSelectedDealerId("");
  //   setSelectedDealerPhone("");
  //   setSelectedDealerCompany("");
  //   setSelectedDealerDealerId("");

  //   // Clear any existing errors
  //   setError(null);

  //   // Optionally, clear category details if stored in state
  //   setCategories([]); // Assuming 'categories' is the state holding category details
  //   setTriggerUpdate((prev) => !prev); // Toggle to force a re-render
  // };

  // const handleTableDataChange = (e, field, index) => {
  //   const value = e.target.value;
  //   const updatedItems = [...currentItems];
  //   updatedItems[index][field] = value;
  //   setCurrentItems(updatedItems);
  // };

  // const handleTableDataChange = (e, fieldName, index) => {
  //   const updatedTableData = [...tableData];
  //   const { value } = e.target;

  //   // Update the specific field in the table data for the given index
  //   updatedTableData[index] = {
  //     ...updatedTableData[index],
  //     [fieldName]: value
  //   };

  //   setTableData(updatedTableData);
  // };

  useEffect(() => {
    // Retrieve the salonId from local storage and set it in formData
    const salonId = localStorage.getItem("salonId");
    if (salonId) {
      setFormData((prevState) => ({ ...prevState, salonId }));
    }
  }, []);
  useEffect(() => {
    const adminName = localStorage.getItem("adminName");
    const employeeName = localStorage.getItem("employeeName");

    // Determine the creator's name based on the available data
    const createdBy = adminName || employeeName || "";
    const modifiedBy = createdBy;
    setFormData((prevState) => ({ ...prevState, createdBy, modifiedBy }));
  },[]);
  // const addRow = () => {
  //   // Create a new empty entry
  //   const newEmptyEntry = {
  //     status: "Ordered",
  //     Productquantity: "",
  //     categoryName: "",
  //     company: "",
  //     productName: "",
  //     productDescription: "",
  //     quantity: "",
  //     unit: "",
  //   };

  //   // Add the new empty entry to the tableData state
  //   setTableData((prevTableData) => [...prevTableData, newEmptyEntry]);
  // };

  const handleDealerChange = async (e) => {
    const dealerId = e.target.value;
    setSelectedDealerId(dealerId);

    if (dealerId) {
      try {
        const response = await axios.get(`${BASE_URL}/api/dealer/${dealerId}`);
        const dealer = response.data.dealer;
        localStorage.setItem("dealerId", dealer.dealer_id);
        setSelectedDealerPhone(dealer.phoneNumber);
        setSelectedDealerCompany(dealer.CompanyName);
        setSelectedDealerDealerId(dealer.dealer_id);

        setFormData((prevData) => ({
          ...prevData,
          dealerName: dealer.DealerName,
          dealerPhone: dealer.phoneNumber,
          dealerCompany: dealer.CompanyName,
          dealerId: dealer.dealer_id,
        }));
      } catch (error) {
        console.error("Error fetching dealer details:", error.message);
        toast.error("Error fetching dealer details");
        setSelectedDealerPhone("");
        setSelectedDealerCompany("");
        setSelectedDealerDealerId("");
      }
    } else {
      setSelectedDealerPhone("");
      setSelectedDealerCompany("");
      setSelectedDealerDealerId("");
    }
  };
  // const handleCombinedChange = (e, fieldName, index) => {
  //   // Call handleChange for form-level updates if needed
  //   handleChange(e);

  //   // Call handleTableDataChange for row-specific updates
  //   handleTableDataChange(e, fieldName, index);
  // };

  const fetchProductDescriptions = async (productName) => {
    try {
      const dealer_id = localStorage.getItem("dealerId");
      const categoryName = formData.categoryName;
      const company = formData.company;

      if (!dealer_id || !categoryName || !company || !productName) {
        toast.error("Missing required data");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/productdescriptions/${dealer_id}/${encodeURIComponent(
          categoryName
        )}/${encodeURIComponent(company)}/${encodeURIComponent(productName)}`
      );
      const descriptions = response.data;

      const uniqueDescriptions = Array.from(new Set(descriptions)).map(
        (description) => ({
          productDescription: description,
        })
      );

      setProductDescriptions(uniqueDescriptions);
    } catch (error) {
      console.error("Error fetching product descriptions:", error);
      toast.error("Error fetching product descriptions");
    }
  };

  const fetchQuantityAndUnit = async (productDescription) => {
    try {
      const dealer_id = localStorage.getItem("dealerId");
      const { categoryName, company, productName } = formData;

      if (
        !dealer_id ||
        !categoryName ||
        !company ||
        !productName ||
        !productDescription
      ) {
        toast.error("Missing required data");
        return;
      }

      const url = `${BASE_URL}/api/quantity-unit/${dealer_id}/${encodeURIComponent(
        categoryName
      )}/${encodeURIComponent(company)}/${encodeURIComponent(
        productName
      )}/${encodeURIComponent(productDescription)}`;

      const response = await axios.get(url);

      if (response.status === 200) {
        const { quantities, units } = response.data;

        if (Array.isArray(quantities) && Array.isArray(units)) {
          setQuantityOptions(quantities);
          setUnitOptions(units);
        } else {
          toast.error("Unexpected response structure");
        }
      } else {
        toast.error("Product details not found");
      }
    } catch (error) {
      console.error("Error fetching quantity and unit:", error);
      toast.error("Error fetching quantity and unit");
    }
  };

  useEffect(() => {
    // Fetch dealer ID from local storage when the component mounts
    const storedDealerId = localStorage.getItem("dealerId");
    if (storedDealerId) {
      setDealerId(storedDealerId);
    }
  }, []);
  
  const dealerId = localStorage.getItem("dealerId");


  useEffect(() => {

    const fetchCategoryDetails = async () => {
        if (!dealerId) {
            // toast.error("Dealer ID is not found in local storage");
            return;
        }

        try {
            const response = await axios.get(`${BASE_URL}/api/dealercategories`);
            const filteredCategories = response.data.filter(
                (category) => category.dealer_id === dealerId
            );
            setCategoryDetails(filteredCategories);
        } catch (error) {
            console.error("Error fetching category details:", error);
            toast.error("Failed to fetch categories. Please try again.");
        }
    };

    fetchCategoryDetails();
}, [dealerId]);


  const handleAreaChange = async (e) => {
    const selectedArea = e.target.value;
    setSelectedArea(selectedArea);

    try {
      // Fetch the new dealer ID based on the selected area
      const response = await axios.get(`${BASE_URL}/api/dealer-by-area`, {
        params: { area: selectedArea },
      });

      const newDealerId = response.data.dealerId;

      // Update dealerId in local storage
      localStorage.setItem("dealerId", newDealerId);

      // Update state with the new dealer ID and clear other fields
      setSelectedDealerId(newDealerId);
      setSelectedDealerPhone("");
      setSelectedDealerCompany("");
      setSelectedDealerDealerId("");

      // Optionally, you could trigger category details fetching here,
      // but it's already handled by the useEffect watching dealerId
    } catch (error) {
      console.error("Error fetching dealer ID for the selected area:", error);
      // toast.error("Failed to update dealer ID. Please try again.");
    }
  };

  // const handleItemsPerPageChange = (e) => {
  //   setItemsPerPage(parseInt(e.target.value, 10));
  //   setCurrentPage(1);
  // };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryFilterChange = (filter) => {
    setCategoryFilter(filter);
    setCurrentPage(1);
  };

  const filteredCategories = categoryDetails.filter((category) => {
    const matchesSearchQuery =
      category.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.productName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategoryFilter = categoryFilter
      ? category.categoryName === categoryFilter
      : true;

    return matchesSearchQuery && matchesCategoryFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  // const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // const handleFirstPageClick = () => setCurrentPage(1);
  // const handleLastPageClick = () => setCurrentPage(totalPages);
  // const handlePreviousPageClick = () =>
  //   setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  // const handleNextPageClick = () =>
  //   setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));

  // const getDisplayedPages = () => {
  //   const totalDisplayPages = 3;
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

  // const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Extract unique category names for filtering buttons
  const uniqueCategories = Array.from(
    new Set(categoryDetails.map((category) => category.categoryName))
  );

  // const handleProductChange = (e, index) => {
  //   const { name, value } = e.target;
  //   const updatedProducts = [...formData.products];
  //   updatedProducts[index][name] = value;
  //   setFormData({ ...formData, products: updatedProducts });
  // };

  // const handleProductCheckboxChange = (e, index) => {
  //   const { name, checked } = e.target;
  //   const updatedProducts = [...formData.products];
  //   updatedProducts[index][name] = checked;
  //   setFormData({ ...formData, products: updatedProducts });
  // };

  // const handleSelectAll = (e) => {
  //   const isChecked = e.target.checked;
  //   const updatedItems = currentItems.map((item) => ({
  //     ...item,
  //     selected: isChecked,
  //   }));
  //   setCurrentItems(updatedItems);
  // };

  const handleCheckboxChange = (e, index) => {
    const updatedItems = [...currentItems];
    updatedItems[index].selected = e.target.checked;
    setCurrentItems(updatedItems);
  };

  const handleQuantityChange = (e, index) => {
    const value = e.target.value;
    const updatedItems = [...currentItems];
    updatedItems[index].selectedQuantity = value ? parseInt(value, 10) : 0;
    setCurrentItems(updatedItems);
  };

  return (
    <div className="twocont004">
      <ToastContainer />
      {isFormVisible && (
        <form className="pp-form1302" autoComplete="off" onSubmit={handleSave}>
          <h5 className="heading23402">Purchase Form</h5>
          <div className="flex004302">
            {/* Left Column */}
            <div className="containerwidth5">
              <div className="pp-formgroup1302">
                <label className="pp-label1302">Purchase Order Date</label>
                <input
                  type="date"
                  className="pp-input1302"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <div className="pp-formgroup1302">
                  <label className="pp-label1302">Branch ID</label>
                  <input
                    className="pp-input1302"
                    type="text"
                    name="branchId"
                    value={formData.branchId}
                    readOnly
                  />
                </div>

                <div className="pp-formgroup1302">
                  <label className="pp-label1302">Branch Name</label>
                  <input
                    className="pp-input1302"
                    type="text"
                    name="branchName"
                    value={formData.branchName}
                    readOnly
                  />
                </div>
              </div>

              <div className="pp-formgroup1302">
                <label className="pp-label1302">Phone Number</label>
                <input
                  type="text"
                  className="pp-input1302"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  readOnly
                />
              </div>

              <div className="pp-formgroup1302">
                <label className="pp-label1302">Address</label>
                <textarea
                  type="text"
                  className="pp-input1302"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter Address"
                  readOnly
                />
              </div>

              <div className="pp-formgroup1302">
                <label htmlFor="state" className="pp-label1302">
                  State:
                </label>
                <select
                  className="pp-input1302"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={(e) => {
                    handleStateChange(e);
                    handleFormChange(e);
                  }}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="containerwidth5">
              <div className="pp-formgroup1302">
                <label htmlFor="city" className="pp-label1302">
                  City
                </label>
                <select
                  className="pp-input1302"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={(e) => {
                    handleCityChange(e);
                    handleFormChange(e);
                  }}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pp-formgroup1302">
                <label htmlFor="area" className="pp-label1302">
                  Area
                </label>
                <select
                  className="pp-input1302"
                  id="area"
                  name="area"
                  value={selectedArea}
                  onChange={(e) => {
                    handleAreaChange(e);
                    handleFormChange(e);
                  }}
                  required
                  disabled={!selectedCity}
                >
                  <option value="">Select Area</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pp-formgroup1302">
                <label htmlFor="dealer" className="pp-label1302">
                  Dealer Name
                </label>
                <select
                  className="pp-input1302"
                  id="dealerName"
                  name="dealerName"
                  value={selectedDealerId}
                  onChange={handleDealerChange}
                  required
                >
                  <option value="">Select Dealer</option>
                  {dealerNames.map((dealer) => (
                    <option key={dealer._id} value={dealer._id}>
                      {dealer.DealerName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pp-formgroup1302">
                <label htmlFor="dealerPhone" className="pp-label1302">
                  Dealer Phone Number
                </label>
                <input
                  className="pp-input1302"
                  id="dealerPhone"
                  name="dealerPhone"
                  type="text"
                  value={selectedDealerPhone}
                  readOnly
                />
              </div>

              <div className="pp-formgroup1302">
                <label htmlFor="dealerCompany" className="pp-label1302">
                  Dealer Company Name
                </label>
                <input
                  className="pp-input1302"
                  id="dealerCompany"
                  name="dealerCompany"
                  type="text"
                  value={selectedDealerCompany}
                  readOnly
                />
              </div>

              <div className="pp-formgroup1302">
                <label htmlFor="dealerId" className="pp-label1302">
                  Dealer ID
                </label>
                <input
                  className="pp-input1302"
                  id="dealerId"
                  name="dealerId"
                  type="text"
                  value={selectedDealerDealerId}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Category Details Section */}

          {/* Form Actions */}
          <div className="space00401">
            <button  className="btn014">
              Save
            </button>
            <button className="canel52" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="ghft78">
        <h2 className="heading23402">Category Details</h2>
        <div className="space2093">
          <div className="category_diff33">
            <button
              className="pdadd-btn156"
              onClick={() => handleCategoryFilterChange("")}
            >
              All
            </button>
            {uniqueCategories.map((categoryName) => (
              <button
                key={categoryName}
                className="pdadd-btn156"
                onClick={() => handleCategoryFilterChange(categoryName)}
              >
                {categoryName}
              </button>
            ))}
          </div>
          <div className="A7serinp44">
            <label className="show11"> Search &nbsp;</label>&nbsp;
            <input
              type="search"
              className="border-change89044"
              placeholder="By Category, Company, or Product Name"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="pd-search1244">
          {/* <div className="select-number-of-entries">
            <label className="show11">Show </label>&nbsp;
            <select
              className="input144"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div> */}

         
        </div>

        <div className="tble-overflow129">
          <table className="pd-table12445">
            <thead className="thead876">
              <tr>
                <th className="pd-th1244">S.No</th>
                <th className="pd-th1244">Category Name</th>
                <th className="pd-th1244">Company Name</th>
                <th className="pd-th1244">Product Name</th>
                <th className="pd-th1244">Product Description</th>
                <th className="pd-th1244">Product Quantity and Unit</th>
                <th className="pd-th1244">Product Quantity</th>
                <th className="pd-th1244">
                  Select
                  {/* <input
                    type="checkbox"
                    checked={currentItems.every((item) => item.isSelected)}
                    onChange={handleSelectAll}
                  /> */}
                </th>
              </tr>
            </thead>
            <tbody className="thead87">
              {currentItems.map((category, index) => (
                <tr key={category._id}>
                  <td className="customer-table11-td1">
                    {index + indexOfFirstItem + 1}
                  </td>
                  <td className="pd-td12344">{category.categoryName}</td>
                  <td className="pd-td12344">{category.company}</td>
                  <td className="pd-td12344">{category.productName}</td>
                  <td className="pd-td12344">{category.productDescription}</td>
                  <td className="pd-td12344">
                    {category.quantity} {category.unit}
                  </td>
                  <td className="pd-td12344">
                    <input
                      type="number"
                      className="pp-input1302101002"
                      value={category.selectedQuantity || ""}
                      onChange={(e) => handleQuantityChange(e, index)}
                      placeholder="Enter Product quantity"
                      min={0}
                    />
                  </td>

                  <td className="pd-td12344">
                    <input
                     className="checkbox90"
                      type="checkbox"
                      checked={category.selected || false}
                      onChange={(e) => handleCheckboxChange(e, index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* <div>
          <button
            className="badges44"
            onClick={handleFirstPageClick}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            className="badges44"
            onClick={handlePreviousPageClick}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {getDisplayedPages().map((pageNumber) => (
            <button
              key={pageNumber}
              className={`badges44 ${
                currentPage === pageNumber ? "active44" : ""
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button
            className="badges44"
            onClick={handleNextPageClick}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            className="badges44"
            onClick={handleLastPageClick}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div> */}
      </div>
      <ToastContainer />
    </div>
  );
};

export default DealersPurchaseProduct;
