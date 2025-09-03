const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env file in the server root
dotenv.config();

const app = express();

// Middleware to handle JSON payloads and larger payload sizes
app.use(bodyParser.json({ limit: "5mb" }));
app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tlsInsecure: true,
});
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MongoDB");
});
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
  process.exit(1); // Exit process with failure
});

// Import routes
const CustomerRoutes = require("./routes/CustomerRoutes");
const AppointmentRoutes = require("./routes/AppointmentRoutes");
const BillingRoutes = require("./routes/BillingRoutes");
const EmployeeRoutes = require("./routes/EmployeeRoutes");
const ServiceRoutes = require("./routes/ServiceRoutes");
const ProductRoutes = require("./routes/ProductRoutes");
const PurchaseStockRoutes = require("./routes/PurchaseStockRoutes");
const StockSelfUseRoutes = require("./routes/StockSelfUseRoutes");
const LoginRoutes = require("./routes/LoginRoutes");
const RegisterRoutes = require("./routes/RegisterRoutes");
const salonRoutes = require("./routes/salonRoutes");
const SuperAdmin = require("./routes/SuperAdminRouter");
const superSubscriptionRoutes = require("./routes/superSubscriptionRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const offerSuperadminRoutes = require("./routes/offerSuperAdminRoutes");
const DealersRoutes = require("./routes/DealersProductRoutes");
const DealersPurchaseRoutes = require("./routes/DealersPurchaseRoutes");
const dealerRoutes = require('./routes/DealerRoutes');
const dealerInventoryRoutes = require('./routes/DealerInventory');
const dealerCategoryRoutes = require('./routes/DealerCategory');

// Import and initialize the subscription checker
require("./cron/SubscriptionChecker");

// Use routes
app.use("/api", LoginRoutes);
app.use("/api", RegisterRoutes);
app.use("/api", CustomerRoutes);
app.use("/api", AppointmentRoutes);
app.use("/api", BillingRoutes);
app.use("/api", ServiceRoutes);
app.use("/api", EmployeeRoutes);
app.use("/api", ProductRoutes);
app.use("/api", PurchaseStockRoutes);
app.use("/api", StockSelfUseRoutes);
app.use("/api/branches", salonRoutes);
app.use("/api/superadmins", SuperAdmin);
app.use("/api", superSubscriptionRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/appointments", AppointmentRoutes);
app.use("/api", offerSuperadminRoutes);
app.use("/api", DealersRoutes);
app.use("/api", DealersPurchaseRoutes);
app.use('/api', dealerRoutes);
app.use('/api', dealerInventoryRoutes);
app.use('/api', dealerCategoryRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  process.exit(1); // Exit process with failure
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle uncaught exceptions and rejections
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1); // Exit process with failure
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1); // Exit process with failure
});