<template>
  <div class="bg-white border rounded-lg p-4 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
    <div class="flex justify-between items-start gap-4">
      <!-- Task Content -->
      <div class="flex-1">
        <h3 class="font-semibold text-gray-800">{{ task.title }}</h3>
        <p v-if="task.description" class="text-sm text-gray-600 mt-1">
          {{ task.description }}
        </p>
        <div class="mt-3 flex items-center gap-3">
          <span :class="priorityClass">{{ task.priority }}</span>
          <span class="text-sm text-gray-500 flex items-center">
            <CalendarIcon class="h-4 w-4 mr-1" />
            {{ formattedDate }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button
          class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          title="Editar tarefa"
          @click="$emit('edit', task)"
        >
          <PencilIcon class="h-5 w-5" />
        </button>
        <button
          class="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
          title="Excluir tarefa"
          @click="handleDelete"
        >
          <TrashIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PencilIcon, TrashIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'

const props = defineProps({
  task: {
    type: Object,
    required: true,
    validator: (task) => {
      return ['id', 'title', 'priority', 'dueDate'].every(
        (prop) => prop in task
      )
    }
  }
})

const emit = defineEmits(['edit', 'delete'])

const handleDelete = () => {
  emit('delete', props.task.id)
}

const formattedDate = computed(() => {
  return dayjs(props.task.dueDate).format('MMM D, YYYY')
})

// Updated priorityClass with Portuguese terms
const priorityClass = computed(() => {
  const classes = {
    'Baixa': 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium',
    'Média': 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium',
    'Alta': 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium'
  }
  return classes[props.task.priority] || classes['Média']
})
</script>
