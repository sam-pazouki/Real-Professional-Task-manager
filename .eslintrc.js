module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-prettier'
  ],
  rules: {
    // Existing rules
    'vue/multi-word-component-names': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    
    // Additional helpful rules
    'vue/component-api-style': ['error', ['script-setup']], // Enforce script setup
    'vue/require-explicit-emits': 'error',
    'vue/no-unused-refs': 'warn',
    'vue/no-v-html': 'warn'
  }
}