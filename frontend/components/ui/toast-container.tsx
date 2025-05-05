"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { toastManager } from "@/lib/toast"
import { cn } from "@/lib/utils"

type Toast = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    // Subscribe to toast events
    const unsubscribe = toastManager.subscribe((toast) => {
      setToasts((prev) => [...prev, toast])

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, 5000)
    })

    // Cleanup subscription
    return unsubscribe
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

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
