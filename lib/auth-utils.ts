"use client"

// Función para detectar si estamos en v0
export function isV0Environment(): boolean {
  if (typeof window === "undefined") return false

  return (
    window.location.hostname.includes("v0.dev") ||
    window.location.hostname.includes("vercel.app") ||
    window.location.hostname.includes("localhost")
  )
}

// Hook personalizado que decide qué sistema de auth usar
export function useAuthSystem() {
  return isV0Environment() ? "mock" : "nextauth"
}
