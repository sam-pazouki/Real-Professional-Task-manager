<template>
  <form
    class="space-y-6 bg-white p-6 rounded-lg shadow-sm"
    @submit.prevent="handleSubmit"
  >
    <div class="form-group">
      <BaseInput
        v-model="formData.title"
        label="Task Title"
        required
        :error="errors.title"
        placeholder="Enter task title"
      />
      <span v-if="errors.title" class="error-text">{{ errors.title }}</span>
    </div>

    <div class="form-group">
      <BaseInput
        v-model="formData.description"
        label="Description"
        type="textarea"
        placeholder="Enter task description"
        class="h-24"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-group">
        <BaseSelect
          v-model="formData.category"
          label="Category"
          :options="taskStore.categories"
          required
          :error="errors.category"
          placeholder="Select category"
        />
        <span v-if="errors.category" class="error-text">{{
          errors.category
        }}</span>
      </div>

      <div class="form-group">
        <BaseSelect
          v-model="formData.priority"
          label="Priority"
          :options="taskStore.priorities"
          required
          :error="errors.priority"
          placeholder="Select priority"
        />
        <span v-if="errors.priority" class="error-text">{{
          errors.priority
        }}</span>
      </div>
    </div>

    <div class="form-group">
      <BaseInput
        v-model="formData.dueDate"
        label="Due Date"
        type="date"
        required
        :min="minDate"
        :error="errors.dueDate"
      />
      <span v-if="errors.dueDate" class="error-text">{{ errors.dueDate }}</span>
    </div>

    <div class="flex justify-end space-x-3 pt-4 border-t">
      <BaseButton type="button" variant="secondary" @click="handleCancel">
        Cancelar
      </BaseButton>
      <BaseButton type="submit">
        {{ initialValues ? 'Update Task' : 'Create Task' }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTaskStore } from '@/stores/tasks'
import BaseInput from './common/BaseInput.vue'
import BaseSelect from './common/BaseSelect.vue'
import BaseButton from './common/BaseButton.vue'

const props = defineProps({
  initialValues: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])
const taskStore = useTaskStore()
const errors = ref({})

const formData = ref({
  title: '',
  description: '',
  category: '',
  priority: '',
  dueDate: ''
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

onMounted(() => {
  if (props.initialValues) {
    formData.value = { ...formData.value, ...props.initialValues }
  }
})

const validateForm = () => {
  errors.value = {}

  if (!formData.value.title?.trim()) {
    errors.value.title = 'Title is required'
  }
  if (!formData.value.category) {
    errors.value.category = 'Category is required'
  }
  if (!formData.value.priority) {
    errors.value.priority = 'Priority is required'
  }
  if (!formData.value.dueDate) {
    errors.value.dueDate = 'Due date is required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', {
      ...formData.value,
      title: formData.value.title.trim(),
      description: formData.value.description?.trim()
    })
  }
}

const handleCancel = () => {
  if (hasFormChanges.value) {
    if (confirm('Tem certeza de que deseja descartar as alterações?')) {
      emit('cancel')
    }
  } else {
    emit('cancel')
  }
}

const hasFormChanges = computed(() => {
  if (!props.initialValues) return true
  return Object.keys(formData.value).some(
    (key) => formData.value[key] !== props.initialValues[key]
  )
})
</script>

<style scoped>
.form-group {
  @apply space-y-1;
}

.error-text {
  @apply text-red-500 text-sm mt-1;
}
</style>
