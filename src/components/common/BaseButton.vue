<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="relative inline-flex items-center justify-center text-sm font-medium rounded-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
    :class="[
      variantClasses[variant],
      size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2',
      fullWidth ? 'w-full' : 'w-auto',
      { 'opacity-50 cursor-not-allowed': disabled || loading }
    ]"
  >
    <!-- Loading Spinner -->
    <span
      v-if="loading"
      class="absolute left-0 inset-y-0 flex items-center pl-3"
    >
      <svg
        class="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </span>

    <!-- Icon Slot -->
    <slot name="icon" />

    <!-- Content -->
    <span :class="{ 'pl-2': $slots.icon }">
      <slot />
    </span>
  </button>
</template>

<script setup>
// Define button variants
const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
  secondary:
    'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-blue-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
}

// Define props without assignment
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})
</script>
