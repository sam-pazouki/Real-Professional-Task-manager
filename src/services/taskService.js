const BASE_URL = 'http://localhost:3001/tasks'

export const taskService = {
  async fetchTasks() {
    const response = await fetch(BASE_URL)
    if (!response.ok) throw new Error('Failed to fetch tasks')
    return response.json()
  },

  async createTask(task) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    })
    if (!response.ok) throw new Error('Failed to create task')
    return response.json()
  },

  async updateTask(taskId, updates) {
    const response = await fetch(`${BASE_URL}/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!response.ok) throw new Error('Failed to update task')
    return response.json()
  },

  async deleteTask(taskId) {
    const response = await fetch(`${BASE_URL}/${taskId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete task')
    return true
  }
}
