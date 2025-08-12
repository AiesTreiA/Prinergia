"use client"

// Función para detectar si estamos en v0
export function isV0Environment(): boolean {
  // Durante el build/SSR, window no está disponible
  if (typeof window === "undefined") {
    // En el servidor, verificar variables de entorno
    return process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development"
  }

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
