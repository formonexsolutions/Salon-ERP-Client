# 🏪 Salon ERP Client - Complete Business Management System

A comprehensive Salon ERP system built with MERN stack (MongoDB, Express.js, React, Node.js) featuring dual authentication, subscription management, and real-time OTP integration.

## 🎯 **Key Features**

### 🔐 **Authentication System**
- **Dual Login Methods**: Password-based and OTP-based authentication
- **Tab-style Interface**: Clean toggle between login methods
- **Multi-Provider OTP**: Fast2SMS, TextLocal, MyLogin support with automatic failover
- **Super Admin Access**: Multiple super admin accounts with full system control

### 👥 **User Management**
- **Role-based Access**: Super Admin, Salon Admin, Staff, Dealers
- **Global Staff ID System**: Unique staff identification across all salons
- **Employee Management**: Add, edit, manage salon staff
- **Customer Database**: Comprehensive customer relationship management

### 💼 **Business Operations**
- **Appointment Scheduling**: Advanced calendar with booking management
- **Billing System**: Invoice generation with payment tracking
- **Inventory Management**: Stock tracking, purchase orders, supplier management
- **Service Management**: Service catalog with pricing and duration
- **Reports & Analytics**: Business insights and performance metrics

### 💳 **Subscription & Payments**
- **3 Subscription Plans**: Basic, Professional, Enterprise
- **Razorpay Integration**: Secure payment processing
- **Subscription Tracking**: Automated renewal and expiry management

### 🏢 **Multi-tenant Architecture**
- **Salon Management**: Multiple salon support
- **Branch System**: Multi-location management
- **Dealer Portal**: Separate dealer dashboard and inventory
- **State/City/Area Management**: Geographic organization

## 🚀 **Quick Start**

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/formonexsolutions/Salon-ERP-Client.git
   cd Salon-ERP-Client
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   cp .env.example .env  # Configure your environment variables
   npm start
   ```

3. **Setup Client**
   ```bash
   cd ../client
   npm install
   npm start
   ```

4. **Access the Application**
   - **Client**: http://localhost:3002
   - **Server**: http://localhost:5001

## ⚙️ **Environment Configuration**

### Server (.env)
```env
# MongoDB Connection
MONGO_URI=mongodb+srv://your-connection-string

# JWT Secret
JWT_SECRET=your-secret-key

# SMS API Configuration (Primary)
SMS_API_BASE_URL=https://api.mylogin.co.in/api/v2/SendSMS
SMS_API_KEY=your-api-key
SMS_API_CLIENT_ID=your-client-id
SMS_API_SENDER_ID=your-sender-id
SMS_API_MESSAGE_TEMPLATE=${otp} is your OTP for login. Valid for 5 minutes.

# Backup SMS Providers
FAST2SMS_API_KEY=your-fast2sms-key
TEXTLOCAL_API_KEY=your-textlocal-key

# Razorpay Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server Configuration
PORT=5001
```

## 📱 **OTP System Setup**

### **Current Status**: ✅ Working with Console Fallback

### **Get Real SMS (5 minutes):**

#### Option 1: Fast2SMS (Recommended)
1. Sign up: https://www.fast2sms.com/
2. Get free API key from dashboard
3. Update `.env`: `FAST2SMS_API_KEY=your_key`
4. Restart server → Real SMS working!

#### Option 2: TextLocal
1. Sign up: https://www.textlocal.in/
2. Get API key from settings
3. Update `.env`: `TEXTLOCAL_API_KEY=your_key`
4. Restart server

## 👑 **Super Admin Access**

### Default Super Admin Accounts:
1. **Primary**: `9148115647` / `Nitin@123`
2. **Secondary**: `7310013030` / `Sanket@3030`

Both accounts support:
- Password login
- OTP login
- Full system administration

## 📋 **API Endpoints**

### Authentication
- `POST /api/auth/salon-admin-login` - Salon admin login (password)
- `POST /api/auth/salon-admin-send-otp` - Send OTP for salon admin
- `POST /api/auth/salon-admin-login-otp` - Login with OTP
- `POST /api/auth/super-admin-login` - Super admin login
- `POST /api/auth/super-admin-send-otp` - Send OTP for super admin
- `POST /api/auth/super-admin-login-otp` - Super admin OTP login

### Salon Management
- `GET /api/salons` - Get all salons
- `POST /api/salons/register` - Register new salon
- `PUT /api/salons/:id` - Update salon details
- `DELETE /api/salons/:id` - Delete salon

### Staff Management
- `GET /api/staff` - Get all staff
- `POST /api/staff` - Add new staff member
- `PUT /api/staff/:id` - Update staff details
- `DELETE /api/staff/:id` - Remove staff

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

## 🏗️ **System Architecture**

```
salon-erp-client/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   └── styles/        # CSS files
├── server/                # Node.js backend
│   ├── controllers/       # Business logic
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Utility services
│   └── uploads/          # File uploads
└── docs/                 # Documentation
```

## 🔧 **Key Technologies**

### Frontend
- **React 18**: Modern React with hooks
- **CSS3**: Responsive design with custom styling
- **Axios**: HTTP client for API calls
- **React Router**: Navigation and routing

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **Multer**: File upload handling

### Services
- **MongoDB Atlas**: Cloud database
- **Fast2SMS/TextLocal**: SMS providers
- **Razorpay**: Payment gateway
- **Google OAuth**: Social authentication

## 📊 **Database Schema**

### Key Collections:
- **Staff**: User accounts and authentication
- **Salon**: Salon information and settings
- **SuperAdmin**: System administrators
- **Customers**: Customer database
- **Appointments**: Booking management
- **Services**: Service catalog
- **Products**: Inventory items
- **Billing**: Invoice and payment records
- **Subscriptions**: Plan and payment tracking

## 🛡️ **Security Features**

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access Control**: Granular permissions
- **OTP Verification**: Multi-factor authentication
- **Input Validation**: Server-side data validation
- **CORS Configuration**: Cross-origin request security

## 📈 **Subscription Plans**

### 1. Basic Plan - ₹999/month
- Up to 100 customers
- 2 staff members
- Basic reporting
- Email support

### 2. Professional Plan - ₹1999/month
- Up to 500 customers
- 5 staff members
- Advanced reporting
- SMS notifications
- Priority support

### 3. Enterprise Plan - ₹2999/month
- Unlimited customers
- Unlimited staff
- Custom reporting
- Multi-location support
- 24/7 phone support

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 📞 **Support**

- **Email**: support@formonexsolutions.com
- **Phone**: +91-9148115647
- **Website**: https://formonexsolutions.com

## 🎉 **Acknowledgments**

- Built with ❤️ by Formonex Solutions
- Special thanks to all contributors
- Powered by modern web technologies

---

**🚀 Ready to revolutionize salon management!** 

For setup assistance, check out our detailed guides:
- [OTP Setup Guide](OTP_FIXED_GUIDE.md)
- [Real-time SMS Setup](REALTIME_OTP_SETUP.md)
