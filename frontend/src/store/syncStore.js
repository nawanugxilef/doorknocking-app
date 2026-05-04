import { create } from 'zustand'

export const useSyncStore = create((set) => ({
  pendingCount: 0,
  isSyncing: false,
  setPending: (count) => set({ pendingCount: count }),
  setIsSyncing: (val) => set({ isSyncing: val }),
}))
