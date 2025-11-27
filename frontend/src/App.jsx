import React, { useEffect, useState } from 'react'
import { fetchEmployees, fetchTasks, createTask, updateTask } from './services/api'

function App(){
  const [employees, setEmployees] = useState([])
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState({ employee: '', status: '' })
  const [form, setForm] = useState({ title: '', description: '', employee: '' })

  useEffect(()=>{ loadEmployees(); loadTasks(); }, [])

  async function loadEmployees(){
    const data = await fetchEmployees(); setEmployees(data || [])
  }

  async function loadTasks(){
    const data = await fetchTasks(filter); setTasks(data || [])
  }

  useEffect(()=>{ loadTasks(); }, [filter])

  async function onSubmit(e){
    e.preventDefault();
    await createTask(form);
    setForm({ title:'', description:'', employee: ''});
    loadTasks();
  }

  async function changeStatus(id, next){
    await updateTask(id, { status: next });
    loadTasks();
  }

  return (
    <div className="container">
      <header><h1>Employee Task Tracker</h1></header>
      <section className="grid">
        <div className="card">
          <h2>Employees</h2>
          <ul >
            {employees.map(e => <li className="emp" key={e._id}>{e.name} <small>{e.position}</small></li>)}
          </ul>
        </div>

        <div className="card">
          <h2>Tasks</h2>
          <div className="filters">
            <select value={filter.employee} onChange={e=>setFilter({...filter, employee:e.target.value})}>
              <option value="">All employees</option>
              {employees.map(e=> <option key={e._id} value={e._id}>{e.name}</option>)}
            </select>
            <select value={filter.status} onChange={e=>setFilter({...filter, status:e.target.value})}>
              <option value="">All status</option>
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <ul className="tasks">
            {tasks.map(t => (
              <li key={t._id} className={`task ${t.status}`}>
                <div><strong>{t.title}</strong> <small>({t.employee?.name})</small></div>
                <div className="meta">{t.status}</div>
                <div className="actions">
                  {t.status !== 'done' && <button onClick={()=>changeStatus(t._id, 'done')}>Mark Done</button>}
                  {t.status === 'todo' && <button onClick={()=>changeStatus(t._id, 'in-progress')}>Start</button>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2>New Task</h2>
          <form onSubmit={onSubmit} className="task-form">
            <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
            <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
            <select value={form.employee} onChange={e=>setForm({...form, employee:e.target.value})} required>
              <option value="">Assign to...</option>
              {employees.map(e=> <option key={e._id} value={e._id}>{e.name}</option>)}
            </select>
            <button type="submit">Create Task</button>
          </form>
        </div>
      </section>
      <footer>Simple tracker • Demo</footer>
    </div>
  )
}

export default App
