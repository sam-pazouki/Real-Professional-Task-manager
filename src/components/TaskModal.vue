<script setup>
// Imports
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/solid'
import { useTaskStore } from '@/stores/tasks'

const taskStore = useTaskStore()
const categories = taskStore.categories
const priorities = taskStore.priorities
const props = defineProps({
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])
const formData = ref({
  title: props.task?.title || '',
  description: props.task?.description || '',
  category: props.task?.category || '',
  priority: props.task?.priority || '',
  dueDate: props.task?.dueDate || new Date().toISOString().split('T')[0]
})

const handleSubmit = async () => {
  try {
    if (!formData.value.title.trim()) {
      alert('Título é obrigatório')
      return
    }

    // Emit save event with form data
    await emit('save', {
      ...formData.value,
      title: formData.value.title.trim(),
      description: formData.value.description.trim()
    })
  } catch (error) {
    console.error('Form submission error:', error)
  }
}

// Modal close handler
const handleClose = () => {
  emit('close')
}

// Escape key handler
const handleEscKey = (event) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
  document.body.style.overflow = 'hidden'
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscKey)
  document.body.style.overflow = '' 
})
</script>

<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    @click.self="handleClose"
  >
    <div
      class="bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all duration-300 scale-100"
      role="dialog"
      aria-modal="true"
    >
      <!-- Modal Header -->
      <div class="p-6 border-b">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ task ? 'Editar tarefa' : 'Criar nova tarefa' }}
          </h2>
          <button
            class="text-gray-400 hover:text-gray-500 transition-colors"
            aria-label="Close modal"
            @click="handleClose"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-6">
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <!-- Title Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Título *</label
            >
            <input
              v-model="formData.title"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Insira o título da tarefa"
            />
          </div>

          <!-- Description Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Descrição</label
            >
            <textarea
              v-model="formData.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Insira a descrição da tarefa"
            ></textarea>
          </div>

          <!-- Category Select -->
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Categoria *</label
            >
            <select
              v-model="formData.category"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="" disabled>Selecione uma categoria</option>
              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>

          <!-- Priority Select -->
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Prioridade *</label
            >
            <select
              v-model="formData.priority"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="" disabled>Selecione a prioridade</option>
              <option
                v-for="priority in priorities"
                :key="priority"
                :value="priority"
              >
                {{ priority }}
              </option>
            </select>
          </div>

          <!-- Due Date Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Data de vencimento *</label
            >
            <input
              v-model="formData.dueDate"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              @click="handleClose"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              {{ task ? 'Atualizar' : 'Criar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
