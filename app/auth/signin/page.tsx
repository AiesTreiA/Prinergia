"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import { Leaf } from "lucide-react"
import Link from "next/link"
import { useMockAuth } from "@/lib/mock-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SignInPage() {
  const router = useRouter()
  const mockAuth = useMockAuth()
  const [isV0, setIsV0] = useState(true)

  useEffect(() => {
    // Detectar entorno
    const isV0Environment =
      typeof window !== "undefined" &&
      (window.location.hostname.includes("v0.dev") ||
        window.location.hostname.includes("vercel.app") ||
        window.location.hostname.includes("localhost"))

    setIsV0(isV0Environment)

    // Solo redirigir en v0 si hay usuario mock
    if (isV0Environment && mockAuth.user) {
      router.push("/")
    }
  }, [mockAuth.user, router])

  if (isV0 && mockAuth.user) {
    return null // Redirigiendo...
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
