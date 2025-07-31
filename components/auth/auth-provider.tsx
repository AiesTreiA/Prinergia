"use client"

import React from "react"

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [SessionProvider, setSessionProvider] = React.useState<any>(null)
  const [isV0, setIsV0] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Detectar entorno v0
    const isV0Environment =
      typeof window !== "undefined" &&
      (window.location.hostname.includes("v0.dev") ||
        window.location.hostname.includes("vercel.app") ||
        window.location.hostname.includes("localhost"))

    setIsV0(isV0Environment)

    // Solo cargar NextAuth en producción (no v0)
    if (!isV0Environment) {
      const loadNextAuth = async () => {
        try {
          const { SessionProvider: NextAuthSessionProvider } = await import("next-auth/react")
          setSessionProvider(() => NextAuthSessionProvider)
        } catch (error) {
          console.warn("NextAuth not available")
        }
        setIsLoading(false)
      }
      loadNextAuth()
    } else {
      setIsLoading(false)
    }
  }, [])

  // En v0 o mientras carga, renderizar directamente sin SessionProvider
  if (isV0 || isLoading || !SessionProvider) {
    return <>{children}</>
  }

  // En producción con NextAuth disponible
  return <SessionProvider>{children}</SessionProvider>
}
