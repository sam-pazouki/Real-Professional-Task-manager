import { defineStore } from 'pinia'
import { CATEGORIES, PRIORITIES } from '@/constants/taskConstants'
import { isWithinNextWeek, isOverdue } from '@/utils/dateUtils'

// API configuration
const API_URL = 'http://localhost:3001'

export const useTaskStore = defineStore('tasks', {
  // Initial state
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
    categories: CATEGORIES,
    priorities: PRIORITIES
  }),

  // Computed properties
  getters: {
    // Tasks due within next week
    upcomingTasks: (state) => {
      return state.tasks
        .filter((task) => !task.completed && isWithinNextWeek(task.dueDate))
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    },

    // Overdue tasks
    overdueTasks: (state) => {
      return state.tasks
        .filter((task) => !task.completed && isOverdue(task.dueDate))
        .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
    },

    // Completed tasks
    completedTasks: (state) => {
      return state.tasks
        .filter((task) => task.completed)
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    },

    // Tasks filtered by category
    getTasksByCategory: (state) => (category) => {
      return state.tasks.filter((task) => task.category === category)
    }
  },

  // Actions for API operations
  actions: {
    // Fetch all tasks
    async fetchTasks() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`${API_URL}/tasks`)
        if (!response.ok) throw new Error('Failed to fetch tasks')
        this.tasks = await response.json()
      } catch (error) {
        this.error = error.message
        console.error('Fetch tasks error:', error)
      } finally {
        this.loading = false
      }
    },

    // Add new task
    async addTask(task) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`${API_URL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...task,
            createdAt: new Date().toISOString(),
            completed: false
          })
        })
        if (!response.ok) throw new Error('Failed to add task')
        const newTask = await response.json()
        this.tasks.push(newTask)
        return true
      } catch (error) {
        this.error = error.message
        console.error('Add task error:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    // Update existing task
    async updateTask(taskId, updates) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...updates,
            updatedAt: new Date().toISOString()
          })
        })
        if (!response.ok) throw new Error('Failed to update task')
        const updatedTask = await response.json()
        const index = this.tasks.findIndex((t) => t.id === taskId)
        if (index !== -1) {
          this.tasks[index] = updatedTask
        }
        return true
      } catch (error) {
        this.error = error.message
        console.error('Update task error:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    // Toggle task completion status
    async toggleTask(taskId) {
      this.error = null
      try {
        const task = this.tasks.find((t) => t.id === taskId)
        if (!task) throw new Error('Task not found')
        
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : null,
            updatedAt: new Date().toISOString()
          })
        })
        if (!response.ok) throw new Error('Failed to toggle task')
        
        const updatedTask = await response.json()
        const index = this.tasks.findIndex((t) => t.id === taskId)
        if (index !== -1) {
          this.tasks[index] = updatedTask
        }
        return true
      } catch (error) {
        this.error = error.message
        console.error('Toggle task error:', error)
        return false
      }
    },

    // Delete task
    async deleteTask(taskId) {
      if (!taskId) throw new Error('Task ID is required')
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to delete task')
        this.tasks = this.tasks.filter((task) => task.id !== taskId)
        return true
      } catch (error) {
        this.error = error.message
        console.error('Delete task error:', error)
        return false
      } finally {
        this.loading = false
      }
    }
  }
})