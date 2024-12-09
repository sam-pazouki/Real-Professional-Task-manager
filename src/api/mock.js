import { createServer, Response } from 'miragejs'
import { format, addDays } from 'date-fns'

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    seeds(server) {
      server.db.loadData({
        tasks: [
          {
            id: '1',
            title: 'Complete project documentation',
            description: 'Write detailed documentation for the new features',
            category: 'Work',
            priority: 'High',
            dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Weekly grocery shopping',
            description: 'Buy groceries for the week',
            category: 'Shopping',
            priority: 'Medium',
            dueDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
            createdAt: new Date().toISOString()
          }
        ]
      })
    },

    routes() {
      this.namespace = 'api'
      this.timing = 750

      this.get('/tasks', (schema) => {
        return schema.db.tasks
      })

      this.post('/tasks', (schema, request) => {
        const attrs = JSON.parse(request.requestBody)
        return schema.db.tasks.insert(attrs)
      })

      this.put('/tasks/:id', (schema, request) => {
        const attrs = JSON.parse(request.requestBody)
        return schema.db.tasks.update(request.params.id, attrs)
      })

      this.delete('/tasks/:id', (schema, request) => {
        schema.db.tasks.remove(request.params.id)
        return new Response(204)
      })
    }
  })
}
