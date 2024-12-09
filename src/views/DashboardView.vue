<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'
import { TransitionRoot } from '@headlessui/vue'
import { PlusIcon } from '@heroicons/vue/24/solid'
import TaskList from '@/components/TaskList.vue'
import TaskModal from '@/components/TaskModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

// Store and router setup
const router = useRouter()
const taskStore = useTaskStore()
const authStore = useAuthStore()

// Reactive state
const showTaskModal = ref(false)
const selectedTask = ref(null)
const selectedCategory = ref('')
const selectedPriority = ref('')

// Computed properties
const categories = computed(() => taskStore.categories)
const priorities = computed(() => taskStore.priorities)

// Task filtering
const filterTasks = (category) => {
  let tasks = taskStore.tasks.filter((task) => task.category === category)
  if (selectedPriority.value) {
    tasks = tasks.filter((task) => task.priority === selectedPriority.value)
  }
  return tasks
}

// Modal handlers
const openTaskModal = (task = null) => {
  selectedTask.value = task
  showTaskModal.value = true
}

const closeTaskModal = () => {
  selectedTask.value = null
  showTaskModal.value = false
}

// Task operations
const handleSaveTask = async (taskData) => {
  try {
    if (selectedTask.value) {
      await taskStore.updateTask(selectedTask.value.id, taskData)
    } else {
      await taskStore.addTask(taskData)
    }
    closeTaskModal()
  } catch (error) {
    console.error('Failed to save task:', error)
  }
}

// Delete operations
const handleDeleteTask = async (taskId) => {
  try {
    // Find the task by ID to get its title
    const taskToDelete = taskStore.tasks.find((task) => task.id === taskId)
    if (!taskToDelete) return

    const confirmed = window.confirm(
      `Tem certeza de que deseja excluir "${taskToDelete.title}"?`
    )
    if (!confirmed) return

    await taskStore.deleteTask(taskId)
  } catch (error) {
    console.error('Failed to delete task:', error)
  }
}

// Auth handlers
const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Falha ao sair:', error)
  }
}

// Task refresh
const refreshTasks = async () => {
  try {
    await taskStore.fetchTasks()
  } catch (error) {
    console.error('Error refreshing tasks:', error)
  }
}

// Initialize
onMounted(() => {
  refreshTasks()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-800">
              Gerenciador de Tarefas
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">{{ authStore.user?.email }}</span>
            <BaseButton
              variant="secondary"
              class="hover:bg-gray-100"
              @click="handleLogout"
            >
              Sair
            </BaseButton>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Filters and Actions -->
        <div class="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <BaseSelect
              v-model="selectedCategory"
              :options="categories"
              placeholder="Filtrar por categoria"
              @change="handleFilterChange"
            />
            <BaseSelect
              v-model="selectedPriority"
              :options="priorities"
              placeholder="Filtrar por prioridade"
              @change="handleFilterChange"
            />
          </div>
          <BaseButton variant="primary" @click="openTaskModal()">
            <template #icon>
              <PlusIcon class="h-5 w-5" />
            </template>
            Adicionar tarefa
          </BaseButton>
        </div>

        <!-- Loading State -->
        <div v-if="taskStore.loading" class="text-center py-8">
          <LoadingSpinner />
        </div>

        <!-- Error State -->
        <div v-else-if="taskStore.error" class="text-center py-8">
          <p class="text-red-500">{{ taskStore.error }}</p>
          <BaseButton class="mt-4" @click="refreshTasks"
            >Tentar novamente</BaseButton
          >
        </div>

        <!-- Task Lists -->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskList
            v-for="category in categories"
            :key="category"
            :category="category"
            :tasks="filterTasks(category)"
            @edit="openTaskModal"
            @delete="handleDeleteTask"
          />
        </div>
      </div>
    </main>

    <!-- Task Modal -->
    <TransitionRoot appear :show="showTaskModal" as="template">
      <TaskModal
        :task="selectedTask"
        @close="closeTaskModal"
        @save="handleSaveTask"
      />
    </TransitionRoot>
  </div>
</template>
