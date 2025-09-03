// // // // const mongoose = require('mongoose');

// // // // const salonSchema = new mongoose.Schema({
// // // //   salon_id: String,
// // // //   branch_id: String,
// // // //   branchName: String,
// // // //   salonName: String,
// // // //   adminName: String,
// // // //   city: String,
// // // //   state: String,
// // // //   area: String,
// // // //   about: String,
// // // //   startTime: String,
// // // //   endTime: String,
// // // //   createdBy: String,
// // // //   createdAt: { type: Date, default: Date.now }
// // // // });

// // // // const Salon = mongoose.model('Salon', salonSchema);

// // // // module.exports = Salon;
// // // const mongoose = require('mongoose');

// // // const salonSchema = new mongoose.Schema({
// // //   salon_id: String,
// // //   branch_id: String,
// // //   staff_id: String,
// // //   branchName: String,
// // //   salonName: String,
// // //   adminName: String,
// // //   city: String,
// // //   state: String,
// // //   area: String,
// // //   about: String,
// // //   startTime: String,
// // //   endTime: String,
// // //   createdBy: String,
// // //   createdAt: { type: Date, default: Date.now }
// // // });



// // // const Salon = mongoose.model('Salon', salonSchema);

// // // module.exports = Salon;
// // const mongoose = require('mongoose');

// // const salonSchema = new mongoose.Schema({
// //   salon_id: { type: String, unique: true },
// //   branch_id: { type: String, unique: true },
// //   staff_id: { type: String, unique: true },
// //   branchName: String,
// //   salonName: String,
// //   adminName: String,
// //   PhoneNumber: String, // Added PhoneNumber field
// //   Password: String, // Added Password field
// //   city: String,
// //   state: String,
// //   area: String,
// //   about: String,
// //   startTime: String,
// //   endTime: String,
// //   createdBy: String,
// //   createdAt: { type: Date, default: Date.now }
// // });

// // const Salon = mongoose.model('Salon', salonSchema);

// // module.exports = Salon;
// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const salonSchema = new mongoose.Schema({
//   salon_id: {
//     type: String,
//     default: uuidv4, // Automatically generate salon_id using UUID v4
//     unique: true,
//   },
//   SalonName: {
//     type: String,
//     required: true,
//   },
//   city: {
//     type: String,
//     required: true,
//   },
//   state: {
//     type: String,
//     required: true,
//   },
//   createdBy: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Salon = mongoose.model('Salon', salonSchema);

// module.exports = Salon;
