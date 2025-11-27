const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().lean();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, position } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const emp = new Employee({ name, email, position });
    await emp.save();
    res.status(201).json(emp);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

module.exports = router;
