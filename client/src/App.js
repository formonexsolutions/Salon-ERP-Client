import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./components/pages/AuthContext";
// import ProtectedRoute from "./components/pages/ProtectedRoute";
import Landingpage from "./components/pages/Landingpage";
import LoginPage from "./components/pages/Loginforsa";
import Register from "./components/pages/Register";
import ContinueSubscription from "./components/pages/ContinueSubscription";
import Error404 from "./components/pages/Error404";
import Dashboard from "./components/pages/Dashboard";
import Appointments from "./components/pages/appointments";
import AddProduct from "./components/pages/AddProduct";
import ProductList from "./components/pages/ProductList";
// import PurchaseProduct from "./components/pages/PurchaseProduct";
import InventoryList from "./components/pages/InventoryList";
import EditAppointments from "./components/pages/EditAppointments";
import AddService from "./components/pages/AddService";
import BillingForm from "./components/pages/Billing";
import ServiceForm from "./components/pages/Service";
import Inventory from "./components/pages/InventoryLogic";
import AddCustomer from "./components/pages/AddCustomer";
import CustomerTable from "./components/pages/CustomerTable";
import CustomerDetails from "./components/pages/CustomerDetails";
import CustomerDetailsPopup from "./components/pages/CustomerDetailsEdit";
import StockSelfUse from "./components/pages/StockSelfUse";
import Superadmindashboard from "./components/pages/Superadmindashboard";
import ExistingSalon from "./components/pages/ExistingSalon";
import Setting from "./components/pages/Setting";
import Subscription from "./components/pages/Subscription";
import PaymentSuccess from "./components/pages/PaymentSuccess";
import SuperSubscription from "./components/pages/SuperSubscription";
import Offers from "./components/pages/Offer";
import DealersProductList from "./components/pages/DealersProductList";
import DealersPurchaseProduct from "./components/pages/DealersPurchaseProduct";
import DealerRegisteration from "./components/pages/DealerRegisteration";
import SuperDealer from "./components/pages/SuperDealer";
import DealerDashboard from "./components/pages/DealerDashboard";
import Dealersalondetails from "./components/pages/Dealersalondetails";
import DealerInventory from "./components/pages/DealerInventory";
import AddDealerProduct from "./components/pages/AddDealerProduct";
import EditDealerProduct from "./components/pages/EditDealerProduct";
import DealersNavbar from "./components/pages/DealersNavbar";
import DealerCategory from "./components/pages/DealerCategory";
import AddDealerCategory from "./components/pages/AddDealerCategory";
import EditDealerCategory from "./components/pages/EditDealerCategory";
import AddCustomCategory from "./components/pages/AddCustomCategory";
import  Button  from "./components/pages/Buttons";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="*" element={<Error404 />} />
          <Route path="/" element={<Landingpage />} />
          <Route path="/Loginpage" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ContinueSubscription" element={<ContinueSubscription />} />
          <Route path="/Subscription" element={<Subscription />} />

          {/* Protected Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/AddProduct" element={<AddProduct />} />
            <Route path="/ProductList" element={<ProductList />} />
            {/* <Route path="/PurchaseProduct" element={<PurchaseProduct />} /> */}
            <Route path="/InventoryList" element={<InventoryList />} />
            <Route path="/EditAppointments" element={<EditAppointments />} />
            <Route path="/AddService" element={<AddService />} />
            <Route path="/Billing" element={<BillingForm />} />
            <Route path="/Service" element={<ServiceForm />} />
            <Route path="/InventoryLogic" element={<Inventory />} />
            <Route path="/AddCustomer" element={<AddCustomer />} />
            <Route path="/CustomerTable" element={<CustomerTable />} />
            <Route path="/CustomerDetails" element={<CustomerDetails />} />
            <Route path="/CustomerDetailsEdit" element={<CustomerDetailsPopup />} />
            <Route path="/StockSelfUse" element={<StockSelfUse />} />
            <Route path="/Superadmindashboard" element={<Superadmindashboard />} />
            <Route path="/activate" element={<ExistingSalon />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/paymentsuccess" element={<PaymentSuccess />} />
            <Route path="/SuperSubscription" element={<SuperSubscription />} />
            <Route path="/Offers" element={<Offers />} />
            <Route path="/DealersProductList" element={<DealersProductList />} />
            <Route path="/DealersPurchaseProduct" element={<DealersPurchaseProduct />} />
            <Route path="/button" element={<Button />} />


            <Route path="/Dealer" element={<DealerRegisteration />} />
            <Route path="/Dealerdashboard" element={<DealerDashboard />} />
            <Route path="/Dealersalondetails/:branchName" element={<Dealersalondetails />} />
            <Route path="/superdealer" element={<SuperDealer />} />
            <Route path="/DealerInventory" element={<DealerInventory />} />
            <Route path="/Adddealerproduct" element={<AddDealerProduct />} />
            <Route path="/Editdealerproduct" element={<EditDealerProduct />} />   
            <Route path="/DealersNavbar" element={<DealersNavbar />} />   
            <Route path="/Dealercateogy" element={<DealerCategory />} /> 
            <Route path="/AddCategory" element={<AddDealerCategory />} /> 
            <Route path="/EditCategory" element={<EditDealerCategory />} /> 
            <Route path="/AddCustomCategory" element={<AddCustomCategory />} /> 

            
            {/* ExampleComponent route */}
       
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
