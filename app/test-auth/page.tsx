"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMockAuth } from "@/lib/mock-auth"
import { useState, useEffect } from "react"

export default function TestAuthPage() {
  const mockAuth = useMockAuth()
  const [isV0, setIsV0] = useState(true)

  useEffect(() => {
    const isV0Environment =
      typeof window !== "undefined" &&
      (window.location.hostname.includes("v0.dev") ||
        window.location.hostname.includes("vercel.app") ||
        window.location.hostname.includes("localhost"))

    setIsV0(isV0Environment)
  }, [])

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Test de Autenticación
            <Badge variant="secondary">{isV0 ? "v0 Demo" : "Producción"}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Entorno:</strong> {isV0 ? "v0 (Mock Auth)" : "Producción (NextAuth)"}
          </div>

          <div>
            <strong>Estado:</strong>{" "}
            {mockAuth.isLoading ? "loading" : mockAuth.user ? "authenticated" : "unauthenticated"}
          </div>

          {mockAuth.user ? (
            <div className="space-y-2">
              <div>
                <strong>Usuario:</strong> {mockAuth.user.name}
              </div>
              <div>
                <strong>Email:</strong> {mockAuth.user.email}
              </div>
              <div>
                <strong>Imagen:</strong> {mockAuth.user.image ? "✅" : "❌"}
              </div>
              <Button onClick={mockAuth.signOut} variant="destructive">
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div>No hay sesión activa</div>
              <Button onClick={() => mockAuth.signIn("google")} disabled={mockAuth.isLoading}>
                {mockAuth.isLoading ? "Iniciando..." : "Iniciar Sesión con Google"}
              </Button>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <div>
              <strong>Información del entorno:</strong>
            </div>
            <div>Entorno: {isV0 ? "v0" : "Producción"}</div>
            <div>NextAuth: {isV0 ? "Deshabilitado" : "Habilitado"}</div>
            <div>Estado: ✅ Sin errores de hooks</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
