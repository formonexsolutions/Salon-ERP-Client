const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const SuperAdmin = mongoose.model('SuperAdmin', new mongoose.Schema({
    superAdminId: String,
    superAdminName: String,
    phoneNumber: String,
    password: String,
    confirmpassword: String,
    role: String,
    createdBy: String,
    createdAt: { type: Date, default: Date.now },
    modifiedBy: String,
    modifiedAt: { type: Date, default: Date.now },
    status: String,
    otp: String
  }));
  
  // Check if super admin already exists
  const existingSuperAdmin = await SuperAdmin.findOne({ phoneNumber: '9148115647' });
  if (existingSuperAdmin) {
    console.log('Super admin already exists with this phone number');
    process.exit(0);
  }
  
  // Generate super admin ID
  const lastSuperAdmin = await SuperAdmin.findOne().sort({ createdAt: -1 });
  let newIdNumber = 1;
  if (lastSuperAdmin && lastSuperAdmin.superAdminId) {
    const lastIdNumber = parseInt(lastSuperAdmin.superAdminId.slice(4), 10);
    newIdNumber = lastIdNumber + 1;
  }
  const superAdminId = `SUPA${newIdNumber.toString().padStart(3, '0')}`;
  
  // Hash the password
  const hashedPassword = await bcrypt.hash('Nitin@123', 10);
  
  // Create super admin
  const newSuperAdmin = new SuperAdmin({
    superAdminId,
    superAdminName: 'nitin',
    phoneNumber: '9148115647',
    password: hashedPassword,
    confirmpassword: hashedPassword,
    role: 'superAdmin',
    createdBy: 'system',
    createdAt: new Date(),
    modifiedBy: 'None',
    modifiedAt: new Date(),
    status: 'AA', // Active status
    otp: null
  });
  
  await newSuperAdmin.save();
  console.log('Super admin created successfully:');
  console.log('ID:', superAdminId);
  console.log('Name:', 'nitin');
  console.log('Phone:', '9148115647');
  console.log('Password:', 'Nitin@123');
  console.log('Status:', 'AA (Active)');
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
