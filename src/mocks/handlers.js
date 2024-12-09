import { rest } from 'msw'

export const handlers = [
  // Get all tasks
  rest.get('/api/tasks', (req, res, ctx) => {
    try {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      return res(ctx.delay(500), ctx.status(200), ctx.json(tasks))
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: 'Failed to fetch tasks' }))
    }
  }),

  // Create task
  rest.post('/api/tasks', async (req, res, ctx) => {
    try {
      const task = await req.json()
      const newTask = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        completed: false,
        ...task
      }

      // Update localStorage
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      tasks.push(newTask)
      localStorage.setItem('tasks', JSON.stringify(tasks))

      return res(ctx.delay(500), ctx.status(201), ctx.json(newTask))
    } catch (error) {
      return res(ctx.status(400), ctx.json({ error: 'Invalid task data' }))
    }
  }),

  // Update task
  rest.put('/api/tasks/:id', async (req, res, ctx) => {
    try {
      const { id } = req.params
      const updates = await req.json()

      // Update in localStorage
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      const taskIndex = tasks.findIndex((t) => t.id === id)

      if (taskIndex === -1) {
        return res(ctx.status(404), ctx.json({ error: 'Task not found' }))
      }

      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }

      localStorage.setItem('tasks', JSON.stringify(tasks))

      return res(ctx.delay(500), ctx.status(200), ctx.json(tasks[taskIndex]))
    } catch (error) {
      return res(ctx.status(400), ctx.json({ error: 'Invalid update data' }))
    }
  }),

  // Delete task
  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    try {
      const { id } = req.params

      // Remove from localStorage
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      const filteredTasks = tasks.filter((task) => task.id !== id)
      localStorage.setItem('tasks', JSON.stringify(filteredTasks))

      return res(
        ctx.delay(500),
        ctx.status(200),
        ctx.json({ success: true, id })
      )
    } catch (error) {
      return res(ctx.status(500), ctx.json({ error: 'Failed to delete task' }))
    }
  })
]
