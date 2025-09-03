const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Staff = mongoose.model('Staff', new mongoose.Schema({
    staff_id: String,
    adminName: String,
    phoneNumber: String,
    password: String,
    role: String,
    status: String,
    salon_id: String
  }));
  
  const targetStaff = await Staff.findOne({ phoneNumber: '9148115647' });
  
  if (targetStaff) {
    console.log('Staff found:', targetStaff.adminName);
    console.log('Stored password hash:', targetStaff.password);
    
    // Test different password variations
    const passwords = ['Nitin@123', 'nitin@123', 'NITIN@123', 'Nitin123', 'nitin'];
    
    for (const pwd of passwords) {
      const isMatch = await bcrypt.compare(pwd, targetStaff.password);
      console.log(`Password "${pwd}": ${isMatch ? 'MATCH' : 'NO MATCH'}`);
    }
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
