const API = (import.meta.env.VITE_API_URL) || 'http://localhost:4000/api'

export async function fetchEmployees(){
  const res = await fetch(`${API}/employees`);
  return res.ok ? res.json() : [];
}

export async function fetchTasks(filters = {}){
  const params = new URLSearchParams(filters);
  const res = await fetch(`${API}/tasks?${params.toString()}`);
  return res.ok ? res.json() : [];
}

export async function createTask(payload){
  const res = await fetch(`${API}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  return res.json();
}

export async function updateTask(id, payload){
  const res = await fetch(`${API}/tasks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  return res.json();
}
