const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['todo','in-progress','done'], default: 'todo' },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  dueDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
