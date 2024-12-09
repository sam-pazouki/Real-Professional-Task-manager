<script setup>
import { ref, computed } from 'vue'
import TaskCard from './TaskCard.vue'

// Constants
const SORT_OPTIONS = {
  DUE_DATE: 'dueDate',
  PRIORITY: 'priority',
  TITLE: 'title'
}

const PRIORITY_ORDER = {
  High: 3,
  Medium: 2,
  Low: 1
}

// Props
const props = defineProps({
  category: {
    type: String,
    required: true,
    validator: (value) => value?.trim().length > 0
  },
  tasks: {
    type: Array,
    default: () => [],
    validator: (tasks) =>
      tasks.every((task) => task?.id && task?.title?.trim() && task?.dueDate)
  }
})

// Emits
const emit = defineEmits(['edit', 'delete'])

// State
const sortBy = ref(SORT_OPTIONS.DUE_DATE)

// Computed
const sortedTasks = computed(() => {
  const tasks = [...props.tasks]

  return tasks.sort((a, b) => {
    switch (sortBy.value) {
      case SORT_OPTIONS.DUE_DATE:
        return new Date(a.dueDate) - new Date(b.dueDate)

      case SORT_OPTIONS.PRIORITY:
        return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]

      case SORT_OPTIONS.TITLE:
        return a.title.localeCompare(b.title)

      default:
        return 0
    }
  })
})

// Methods
const handleDelete = (task) => {
  try {
    if (!task?.id) return
    emit('delete', task.id)
  } catch (error) {
    console.error('Delete error:', error)
  }
}
</script>

<template>
  <div class="bg-white shadow rounded-lg p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-800">
        {{ category }}
        <span class="text-sm text-gray-500 ml-2">({{ tasks.length }})</span>
      </h2>

      <!-- Sort Controls -->
      <div v-if="tasks.length" class="flex gap-2">
        <select
          v-model="sortBy"
          class="text-sm border rounded px-2 py-1 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option :value="SORT_OPTIONS.DUE_DATE">data de vencimento</option>
          <option :value="SORT_OPTIONS.PRIORITY">Prioridade</option>
          <option :value="SORT_OPTIONS.TITLE">Título</option>
        </select>
      </div>
    </div>

    <!-- Tasks -->
    <div class="space-y-4">
      <div v-if="!tasks.length" class="text-center py-8 text-gray-500">
        Nenhuma tarefa nesta categoria
      </div>

      <TransitionGroup name="task-list">
        <TaskCard
          v-for="task in sortedTasks"
          :key="task.id"
          :task="task"
          @edit="$emit('edit', task)"
          @delete="handleDelete(task)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.task-list-move,
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.3s ease;
}

.task-list-enter-from,
.task-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.task-list-leave-active {
  position: absolute;
}
</style>
