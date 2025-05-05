"use client"

import { toast } from "@/lib/toast"

// This is a compatibility layer for existing code that uses the old toast system
export function useToast() {
  return toast
}

export default useToast
