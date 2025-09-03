// const mongoose = require("mongoose");

// const serviceSchema = new mongoose.Schema({
//   serviceId: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   serviceName: {
//     type: String,
//     required: true,
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   GST: {
//     type: Number,
//     required: true,
//   },
//   durationTime: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["AA", "IA"],
//     default: "AA",
//   },
//   createdBy: String,
//   createdAt: { type: Date, default: Date.now },
//   modifiedBy: String,
//   modifiedAt: { type: Date, default: Date.now },
//   statusBy:String,
//  statusAt: { type: Date, default: Date.now },

// });

// // Custom function to generate serial serviceId like "SVC001", "SVC002", etc.
// serviceSchema.statics.generateServiceId = async function () {
//   const latestService = await this.findOne({}, {}, { sort: { serviceId: -1 } });
//   const lastServiceId = latestService
//     ? parseInt(latestService.serviceId.replace("SVC", ""))
//     : 0;
//   return `SVC${(lastServiceId + 1).toString().padStart(3, "0")}`;
// };

// const Service = mongoose.model("Service", serviceSchema);

// module.exports = Service;
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    unique: true,
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  GST: {
    type: Number,
    required: true,
  },
  durationTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["AA", "IA"],
    default: "AA",
  },
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  modifiedBy: String,
  modifiedAt: { type: Date, default: Date.now },
  statusBy: String,
  statusAt: { type: Date, default: Date.now },
  salon_id: { // Added salon_id field
    type: String,
    required: true,
  },
});

// Custom function to generate serial serviceId like "SVC001", "SVC002", etc.
serviceSchema.statics.generateServiceId = async function () {
  const latestService = await this.findOne({}, {}, { sort: { serviceId: -1 } });
  const lastServiceId = latestService
    ? parseInt(latestService.serviceId.replace("SVC", ""))
    : 0;
  return `SVC${(lastServiceId + 1).toString().padStart(3, "0")}`;
};

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
