"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastContext = React.createContext<{
  toasts: Toast[]
  addToast: (toast: Toast) => void
  removeToast: (id: string) => void
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export type Toast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, ...toast }])

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = React.useContext(ToastContext)

  return (
    <div className="fixed bottom-0 right-0 z-50 m-4 flex flex-col items-end space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex w-full max-w-md items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-right dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
            toast.variant === "destructive" &&
              "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
          )}
        >
          <div className="flex-1">
            {toast.title && <h3 className="font-medium">{toast.title}</h3>}
            {toast.description && <p className="text-sm text-slate-500 dark:text-slate-400">{toast.description}</p>}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className={cn(
              "ml-4 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300",
              toast.variant === "destructive" &&
                "text-rose-500 hover:bg-rose-100 hover:text-rose-600 dark:text-rose-400 dark:hover:bg-rose-900/20 dark:hover:text-rose-300",
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export function toast(toast: Omit<Toast, "id">) {
  const { addToast } = React.useContext(ToastContext)
  addToast(toast)
}
