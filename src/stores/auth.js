import { defineStore } from 'pinia'

// Constants
const SESSION_DURATION = 24 * 60 * 60 * 1000  
const TOKEN_KEY = 'auth_token'
const USER_KEY = 'user'
const debug = process.env.NODE_ENV !== 'production'

// Debug logger for authentication errors
const logError = (message, error) => {
  if (debug) {
    console.error(`[Auth Store] ${message}:`, error)
  }
}

// Authentication Store
export const useAuthStore = defineStore('auth', {
  state: () => {
    const getStoredItem = (key) => {
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
      } catch (e) {
        logError(`Error reading ${key} from localStorage`, e)
        return null
      }
    }

    return {
      isAuthenticated: !!localStorage.getItem(USER_KEY),
      user: getStoredItem(USER_KEY),
      token: localStorage.getItem(TOKEN_KEY),
      loading: false,
      error: null,
      lastActivity: Number(localStorage.getItem('lastActivity')) || null
    }
  },

  // Computed properties
  getters: {
    userEmail: (state) => state.user?.email,
    isAdmin: (state) => state.user?.role === 'admin',
    isSessionValid: (state) => {
      if (!state.lastActivity) return false
      return Date.now() - state.lastActivity < SESSION_DURATION
    }
  },

  // Actions for authentication operations
  actions: {
    async login(credentials) {
      try {
        this.loading = true
        this.error = null
        debug && console.log('[Auth Store] Login attempt:', credentials.email)

        // Use mock login for development
        if (process.env.NODE_ENV === 'development') {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          return this.handleDevLogin(credentials)
        }

        return await this.handleProdLogin(credentials)
      } catch (error) {
        logError('Login failed', error)
        this.error = error.message
        return false
      } finally {
        this.loading = false
      }
    },
    handleDevLogin(credentials) {
      if (
        credentials.email === 'test@example.com' &&
        credentials.password === 'password'
      ) {
        const mockUser = {
          email: credentials.email,
          role: 'user',
          lastLogin: new Date().toISOString()
        }
        const mockToken = 'mock_token_' + Date.now()
        this.setAuthData(mockUser, mockToken)
        return true
      }
      throw new Error('Credenciais inválidas')
    },

    
   // Production environment login handler
    async handleProdLogin(credentials) {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const data = await response.json()
      this.setAuthData(data.user, data.token)
      return true
    },

    setAuthData(user, token) {
      try {
        this.user = user
        this.token = token
        this.isAuthenticated = true
        this.lastActivity = Date.now()

        localStorage.setItem(USER_KEY, JSON.stringify(user))
        localStorage.setItem(TOKEN_KEY, token)
        localStorage.setItem('lastActivity', this.lastActivity.toString())

        debug && console.log('[Auth Store] Auth data set successfully')
      } catch (error) {
        logError('Failed to set auth data', error)
        throw error
      }
    },

    async logout() {
      try {
        this.loading = true
        this.clearAuthData()
        return true
      } catch (error) {
        logError('Logout failed', error)
        this.error = 'Logout failed'
        return false
      } finally {
        this.loading = false
      }
    },

    //Clear all authentication data
    clearAuthData() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.lastActivity = null
      this.error = null

      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('lastActivity')
    },

    checkSession() {
      if (!this.isSessionValid && this.isAuthenticated) {
        this.logout()
        return false
      }
      return true
    },

    updateActivity() {
      this.lastActivity = Date.now()
      localStorage.setItem('lastActivity', this.lastActivity.toString())
    },

    clearError() {
      this.error = null
    }
  }
})