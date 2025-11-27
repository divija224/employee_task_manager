const mongoose = require('mongoose');
require('dotenv').config();
const Employee = require('../src/models/Employee');
const Task = require('../src/models/Task');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/tasktracker';

async function seed() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB for seeding');
  await Employee.deleteMany({});
  await Task.deleteMany({});
  // create a few demo employees
  const employees = await Employee.insertMany([
    { name: 'Alice Johnson', email: 'alice@example.com', position: 'Engineer' },
    { name: 'Bob Smith', email: 'bob@example.com', position: 'Designer' },
    { name: 'Carlos Rivera', email: 'carlos@example.com', position: 'Product Manager' },
    { name: 'Diana Lee', email: 'diana@example.com', position: 'QA Engineer' },
    { name: 'Evan Chen', email: 'evan@example.com', position: 'Support' }
  ]);

  // create several demo tasks assigned to those employees
  const tasks = [
    { title: 'Implement login', description: 'Add authentication flow (JWT)', status: 'in-progress', employee: employees[0]._id, dueDate: new Date(Date.now() + 3*24*60*60*1000) },
    { title: 'Design homepage', description: 'Finalize hero and features sections', status: 'todo', employee: employees[1]._id, dueDate: new Date(Date.now() + 7*24*60*60*1000) },
    { title: 'Write unit tests', description: 'Cover Task and Employee models', status: 'todo', employee: employees[0]._id },
    { title: 'QA: Regression', description: 'Smoke tests for release', status: 'in-progress', employee: employees[3]._id, dueDate: new Date(Date.now() + 2*24*60*60*1000) },
    { title: 'Customer follow-up', description: 'Reach out about billing question', status: 'todo', employee: employees[4]._id },
    { title: 'Roadmap planning', description: 'Prepare Q1 roadmap draft', status: 'todo', employee: employees[2]._id },
    { title: 'Accessibility fixes', description: 'Fix color contrast on buttons', status: 'done', employee: employees[1]._id }
  ];

  const created = await Task.insertMany(tasks);

  console.log('Seeded sample data:');
  console.log('  Employees:', employees.map(e => ({ id: e._id, name: e.name }))); 
  console.log('  Tasks:', created.map(t => ({ id: t._id, title: t.title, status: t.status })));
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
