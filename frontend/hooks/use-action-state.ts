"use client"

import { useState } from "react"

export function useActionState<T, U>(
  action: (formData: FormData) => Promise<T>,
): [T | null, (formData: FormData) => Promise<void>, boolean] {
  const [state, setState] = useState<T | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function dispatch(formData: FormData) {
    setIsPending(true)
    try {
      const result = await action(formData)
      setState(result)
    } catch (error) {
      console.error("Action error:", error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  return [state, dispatch, isPending]
}
