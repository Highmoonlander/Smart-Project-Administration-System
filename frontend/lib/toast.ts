// Simple event-based toast system
type ToastType = {
    id: string
    title?: string
    description?: string
    variant?: "default" | "destructive"
  }
  
  type ToastListener = (toast: ToastType) => void
  
  class ToastManager {
    private listeners: ToastListener[] = []
  
    // Add a toast listener
    subscribe(listener: ToastListener) {
      this.listeners.push(listener)
      return () => {
        this.listeners = this.listeners.filter((l) => l !== listener)
      }
    }
  
    // Show a toast notification
    show(toast: Omit<ToastType, "id">) {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast = { id, ...toast }
      this.listeners.forEach((listener) => listener(newToast))
      return id
    }
  }
  
  // Create a singleton instance
  export const toastManager = new ToastManager()
  
  // This function can be called from anywhere
  export function toast(props: Omit<ToastType, "id">) {
    return toastManager.show(props)
  }
  