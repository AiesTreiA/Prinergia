"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import { Leaf } from "lucide-react"
import Link from "next/link"
import { useMockAuth } from "@/lib/mock-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { isV0Environment } from "@/lib/auth-utils"
import { useSession } from "next-auth/react"

export default function SignInPage() {
  const router = useRouter()
  const mockAuth = useMockAuth()
  const [nextAuthSession, setNextAuthSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isV0 = isV0Environment()
  const { data: nextAuthSessionData, status } = useSession()

  useEffect(() => {
    // Solo cargar NextAuth si NO estamos en v0
    if (!isV0) {
      setNextAuthSession({ useSession })
    } else {
      setIsLoading(false)
    }
  }, [isV0])

  useEffect(() => {
    // Redirigir si ya está autenticado
    if (isV0 && mockAuth.user) {
      router.push("/")
    } else if (!isV0 && nextAuthSessionData) {
      router.push("/")
    }
  }, [mockAuth.user, nextAuthSessionData, isV0, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  // Si ya está autenticado, no mostrar nada (redirigiendo)
  if ((isV0 && mockAuth.user) || (!isV0 && nextAuthSessionData)) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">Prinergia</span>
          </Link>
          <p className="text-gray-600 mt-2">Conecta con tu bienestar interior</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bienvenido</CardTitle>
            <CardDescription>
              Inicia sesión para acceder a tu cuenta
              {isV0 && <span className="block text-orange-600 text-sm mt-1">Modo Demo - Autenticación simulada</span>}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <GoogleSignInButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  {isV0 ? "Demo de autenticación" : "O continúa con"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ¿Eres un profesional del bienestar?{" "}
                  <Link href="/register" className="text-green-600 hover:underline font-medium">
                    Crea tu perfil profesional
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          Al continuar, aceptas nuestros{" "}
          <Link href="#" className="text-green-600 hover:underline">
            Términos de Servicio
          </Link>{" "}
          y{" "}
          <Link href="#" className="text-green-600 hover:underline">
            Política de Privacidad
          </Link>
        </div>
      </div>
    </div>
  )
}
