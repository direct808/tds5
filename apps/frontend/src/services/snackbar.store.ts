import { create } from 'zustand'

type Severity = 'success' | 'error' | 'info' | 'warning'

type SnackbarStore = {
  open: boolean
  message: string
  severity: Severity

  show: (message: string, severity?: Severity) => void
  close: () => void
}

export const useSnackbarStore = create<SnackbarStore>((set) => ({
  open: false,
  message: '',
  severity: 'info',

  show: (message, severity = 'info') => set({ open: true, message, severity }),

  close: () => set({ open: false }),
}))
