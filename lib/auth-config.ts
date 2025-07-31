// Función para detectar si estamos en v0
export const isV0Environment = () => {
  if (typeof window !== "undefined") {
    // Detección en el lado del cliente (navegador)
    return (
      window.location.hostname.includes("v0.dev") ||
      window.location.hostname.includes("vercel.app") ||
      window.location.hostname.includes("localhost")
    )
  } else {
    // Detección en el lado del servidor (ej. API routes, SSR)
    // En el entorno de vista previa de v0, VERCEL_ENV puede ser 'development' o 'preview'.
    // NODE_ENV es típicamente 'development' en entornos de desarrollo/preview.
    const isVercelNonProduction = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production"
    const isLocalDevelopment = process.env.NODE_ENV === "development"

    // Consideramos que es un entorno de v0 si es desarrollo local o un entorno Vercel no de producción.
    return isLocalDevelopment || isVercelNonProduction
  }
}
