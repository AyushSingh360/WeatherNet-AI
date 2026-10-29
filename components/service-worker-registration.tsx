"use client"

import { useEffect } from "react"

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator)) return
    if (process.env.NODE_ENV !== "production") return

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js")
      } catch (error) {
        console.warn("Service worker registration failed:", error)
      }
    }

    register()
  }, [])

  return null
}
