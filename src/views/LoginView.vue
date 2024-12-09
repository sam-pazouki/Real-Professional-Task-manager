<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Entre na sua conta
        </h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <!-- Error Message -->
        <div v-if="errors.general" class="p-4 bg-red-50 rounded-md">
          <p class="text-sm text-red-600">{{ errors.general }}</p>
        </div>

        <div class="rounded-md shadow-sm space-y-4">
          <BaseInput
            v-model="formData.email"
            type="email"
            required
            placeholder="Email address"
            :error="errors.email"
            :disabled="loading"
            @input="clearError('email')"
          />

          <BaseInput
            v-model="formData.password"
            type="password"
            required
            placeholder="Password"
            :error="errors.password"
            :disabled="loading"
            @input="clearError('password')"
          />
        </div>

        <div>
          <BaseButton type="submit" :loading="loading" :disabled="loading" full>
            {{ loading ? 'Signing in...' : 'Entrar' }}
          </BaseButton>
        </div>

        <!-- Test Credentials Helper -->
        <div class="mt-4 text-sm text-center text-gray-600">
          <p>Use essas credenciais para testar:</p>
          <p>Email: test@example.com</p>
          <p>Senha: password</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const formData = reactive({
  email: '',
  password: ''
})
const errors = ref({})
const loading = ref(false)

// Error handling with auto-cleanup
let errorTimeout
const clearError = (field) => {
  if (errorTimeout) clearTimeout(errorTimeout)
  if (errors.value[field]) delete errors.value[field]
  if (errors.value.general) delete errors.value.general
}

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const validateForm = () => {
  const newErrors = {}

  if (!formData.email?.trim()) {
    newErrors.email = 'E-mail é obrigatório'
  } else if (!isValidEmail(formData.email)) {
    newErrors.email = 'Por favor, insira um e-mail válido'
  }

  if (!formData.password) {
    newErrors.password = 'Senha é necessária'
  } else if (formData.password.length < 6) {
    newErrors.password = 'A senha deve ter pelo menos 6 caracteres'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleLogin = async () => {
  try {
    if (!validateForm()) return

    loading.value = true
    errors.value = {}

    const success = await authStore.login({
      email: formData.email.trim(),
      password: formData.password
    })

    if (success) {
      router.push('/dashboard')
    } else {
      errors.value.general = 'E-mail ou senha inválidos'
      errorTimeout = setTimeout(() => {
        errors.value.general = null
      }, 5000)
    }
  } catch (error) {
    console.error('Login error:', error)
    errors.value.general = 'Ocorreu um erro. Tente novamente.'
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (errorTimeout) clearTimeout(errorTimeout)
})
</script>
