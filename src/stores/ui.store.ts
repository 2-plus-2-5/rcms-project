import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface UIState {
  sidebarOpen: boolean
  toasts: Toast[]

  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  toasts: [],

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  addToast: (toast) => {
    const id = crypto.randomUUID()
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
    // Auto-remove after duration
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, toast.duration ?? 4000)
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

/** Convenience helper — use anywhere without importing the full store */
export const toast = {
  success: (message: string) =>
    useUIStore.getState().addToast({ type: 'success', message }),
  error: (message: string) =>
    useUIStore.getState().addToast({ type: 'error', message, duration: 6000 }),
  warning: (message: string) =>
    useUIStore.getState().addToast({ type: 'warning', message }),
  info: (message: string) =>
    useUIStore.getState().addToast({ type: 'info', message }),
}
