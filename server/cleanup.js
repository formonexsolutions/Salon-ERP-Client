const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Staff = mongoose.model('Staff', new mongoose.Schema({
    staff_id: String,
    salon_id: String,
    phoneNumber: String
  }));
  
  const Salon = mongoose.model('Salon', new mongoose.Schema({
    salon_id: String,
    SalonName: String
  }));
  
  // Find salon IDs that don't have corresponding staff records
  const staffSalonIds = await Staff.distinct('salon_id');
  const allSalons = await Salon.find({});
  
  console.log('Staff salon IDs:', staffSalonIds);
  console.log('All salon IDs:', allSalons.map(s => s.salon_id));
  
  for (const salon of allSalons) {
    if (!staffSalonIds.includes(salon.salon_id)) {
      console.log(`Deleting orphaned salon: ${salon.salon_id} - ${salon.SalonName}`);
      await Salon.deleteOne({ salon_id: salon.salon_id });
    }
  }
  
  console.log('Cleanup completed');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
