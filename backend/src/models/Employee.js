const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  position: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
