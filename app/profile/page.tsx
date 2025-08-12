"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Calendar, Loader2, ArrowLeft, Leaf } from "lucide-react"
import Link from "next/link"
import { LoginButton } from "@/components/auth/login-button"
import { supabase } from "@/lib/supabase"
import { useMockAuth } from "@/lib/mock-auth"
import { useRouter } from "next/navigation"
import { isV0Environment } from "@/lib/auth-utils"

interface UserProfile {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
}

export default function UserProfilePage() {
  const mockAuth = useMockAuth()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authData, setAuthData] = useState<any>(null)
  const isV0 = isV0Environment()

  useEffect(() => {
    const loadAuthData = async () => {
      if (!isV0) {
        try {
          const { useSession } = await import("next-auth/react")
          setAuthData({ useSession })
        } catch (error) {
          console.warn("NextAuth not available:", error)
        }
      }
    }
    loadAuthData()
  }, [isV0])

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)
      setError(null)

      let userEmail: string | undefined = undefined
      let userName: string | undefined = undefined
      let userImage: string | undefined = undefined
      let isAuthenticated = false

      if (isV0) {
        userEmail = mockAuth.user?.email
        userName = mockAuth.user?.name
        userImage = mockAuth.user?.image
        isAuthenticated = !!mockAuth.user
      } else {
        // En producción, necesitamos manejar NextAuth de forma diferente
        // Por ahora, asumimos no autenticado hasta que se implemente correctamente
        isAuthenticated = false
      }

      if (!isAuthenticated) {
        if (isV0) {
          // En v0, no redirigir automáticamente
          setError("No hay sesión activa. Inicia sesión para ver tu perfil.")
        } else {
          router.push("/auth/signin")
          return
        }
        setLoading(false)
        return
      }

      if (!userEmail) {
        setError("No se encontró un usuario autenticado.")
        setLoading(false)
        return
      }

      if (!supabase) {
        setError("Supabase no está inicializado. Verifica las variables de entorno.")
        setLoading(false)
        return
      }

      try {
        const { data, error: dbError } = await supabase.from("users").select("*").eq("email", userEmail).single()

        if (dbError) {
          console.error("Error fetching user profile from DB:", dbError)

          // Si el usuario no existe, crearlo
          if (dbError.code === "PGRST116" && userName) {
            console.log("Usuario no encontrado en DB, creando nuevo usuario.")
            const { data: newUser, error: insertError } = await supabase
              .from("users")
              .insert({
                email: userEmail,
                name: userName,
                avatar_url: userImage,
              })
              .select()
              .single()

            if (insertError) {
              console.error("Error inserting new user:", insertError)
              setError(`Error al crear el perfil: ${insertError.message}`)
            } else if (newUser) {
              setUserProfile(newUser)
              setError(null)
            }
          } else {
            setError(`Error al cargar el perfil: ${dbError.message}`)
          }
        } else if (data) {
          setUserProfile(data)
        } else {
          setError("Perfil de usuario no encontrado en la base de datos.")
        }
      } catch (e: any) {
        console.error("Error inesperado al obtener el perfil de usuario:", e)
        setError(`Error inesperado: ${e.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [mockAuth.user, isV0, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-green-800">Prinergia</span>
            </Link>
          </div>
          <LoginButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi Perfil</h1>

          {error && (
            <Card className="p-6 bg-red-50 border border-red-200 text-red-700 mb-6">
              <CardTitle className="text-lg font-semibold mb-2">Error al cargar el perfil</CardTitle>
              <CardDescription>{error}</CardDescription>
              {isV0 && (
                <div className="mt-4">
                  <Button onClick={() => mockAuth.signIn("google")} className="bg-green-600 hover:bg-green-700">
                    Iniciar Sesión Demo
                  </Button>
                </div>
              )}
            </Card>
          )}

          {!error && userProfile && (
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage
                    src={
                      userProfile.avatar_url ||
                      (isV0 ? mockAuth.user?.image : null) ||
                      "/placeholder.svg?height=96&width=96&text=User"
                    }
                    alt={userProfile.name || "User Avatar"}
                  />
                  <AvatarFallback>{userProfile.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {userProfile.name || (isV0 ? mockAuth.user?.name : "Usuario")}
                </h2>
                <p className="text-gray-600 flex items-center gap-2 mb-4">
                  <Mail className="h-4 w-4" />
                  {userProfile.email}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Miembro desde: {new Date(userProfile.created_at).toLocaleDateString()}
                </div>

                <div className="mt-6 space-y-3 w-full max-w-sm">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <User className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Mis Citas
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!error && !userProfile && (
            <Card className="p-6 text-center">
              <CardTitle className="text-lg font-semibold mb-2">Creando tu perfil...</CardTitle>
              <CardDescription>Estamos configurando tu cuenta por primera vez.</CardDescription>
              <div className="mt-4">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-green-600" />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
