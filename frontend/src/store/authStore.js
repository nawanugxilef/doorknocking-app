'use client'
import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user:  null,
  // localStorage is browser-only — safe to access since this runs client-side
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,

  login: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
}))
