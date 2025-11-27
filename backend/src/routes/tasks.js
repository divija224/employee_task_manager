const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Employee = require('../models/Employee');

// GET /api/tasks?employee=ID&status=todo
router.get('/', async (req, res) => {
  try {
    const { employee, status } = req.query;
    const filter = {};
    if (employee) filter.employee = employee;
    if (status) filter.status = status;
    const tasks = await Task.find(filter).populate('employee').lean();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, employee, dueDate } = req.body;
    if (!title || !employee) return res.status(400).json({ error: 'title and employee required' });
    const exists = await Employee.findById(employee);
    if (!exists) return res.status(400).json({ error: 'employee not found' });
    const task = new Task({ title, description, employee, dueDate });
    await task.save();
    res.status(201).json(await task.populate('employee'));
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('employee');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Dashboard summary
router.get('/dashboard/summary', async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const done = await Task.countDocuments({ status: 'done' });
    const perEmployee = await Task.aggregate([
      { $group: { _id: '$employee', count: { $sum: 1 } } }
    ]);
    res.json({ total, done, completionRate: total ? Math.round((done / total) * 100) : 0, perEmployee });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute dashboard' });
  }
});

module.exports = router;
