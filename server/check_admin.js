const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  // Check SuperAdmin collection
  const SuperAdmin = mongoose.model('SuperAdmin', new mongoose.Schema({
    superAdminId: String,
    superAdminName: String,
    phoneNumber: String,
    password: String,
    role: String,
    status: String
  }));
  
  // Check Staff collection for admin role
  const Staff = mongoose.model('Staff', new mongoose.Schema({
    staff_id: String,
    adminName: String,
    phoneNumber: String,
    password: String,
    role: String,
    status: String,
    salon_id: String
  }));
  
  console.log('=== Super Admin Records ===');
  const superAdmins = await SuperAdmin.find({});
  if (superAdmins.length === 0) {
    console.log('No super admin records found');
  } else {
    superAdmins.forEach(admin => console.log(`ID: ${admin.superAdminId}, Name: ${admin.superAdminName}, Phone: ${admin.phoneNumber}, Role: ${admin.role}, Status: ${admin.status}`));
  }
  
  console.log('\n=== Staff Records (including admins) ===');
  const staff = await Staff.find({});
  staff.forEach(s => console.log(`ID: ${s.staff_id}, Name: ${s.adminName}, Phone: ${s.phoneNumber}, Role: ${s.role}, Status: ${s.status}, Salon: ${s.salon_id}`));
  
  // Check specifically for the target phone number
  console.log('\n=== Search for phone 9148115647 ===');
  const targetSuperAdmin = await SuperAdmin.findOne({ phoneNumber: '9148115647' });
  const targetStaff = await Staff.findOne({ phoneNumber: '9148115647' });
  
  if (targetSuperAdmin) {
    console.log('Found in SuperAdmin:', targetSuperAdmin);
  }
  if (targetStaff) {
    console.log('Found in Staff:', targetStaff);
  }
  
  if (!targetSuperAdmin && !targetStaff) {
    console.log('Phone number 9148115647 not found in either collection');
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
