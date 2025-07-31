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
import { isV0Environment } from "@/lib/auth-config"
import { useSession } from "next-auth/react"

interface UserProfile {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
}

export default function UserProfilePage() {
  const mockAuth = useMockAuth()
  const { data: session } = useSession()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isV0 = isV0Environment()

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)
      setError(null)

      let userEmail: string | undefined = undefined

      if (isV0) {
        // En v0, usamos el usuario del mock auth
        userEmail = mockAuth.user?.email
      } else {
        // En producción, intentamos obtener la sesión de NextAuth
        userEmail = session?.user?.email
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
        const { data, error } = await supabase.from("users").select("*").eq("email", userEmail).single()

        if (error) {
          console.error("Error fetching user profile:", error)
          setError(`Error al cargar el perfil: ${error.message}`)
        } else if (data) {
          setUserProfile(data)
        } else {
          // Si no se encuentra el usuario en la DB, podemos crear uno o mostrar un mensaje
          setError("Perfil de usuario no encontrado en la base de datos.")
          // Opcional: Crear el usuario si no existe
          // const { data: newUser, error: insertError } = await supabase.from('users').insert({ email: userEmail, name: mockAuth.user?.name || 'Nuevo Usuario' }).select().single();
          // if (insertError) console.error("Error inserting new user:", insertError);
          // else setUserProfile(newUser);
        }
      } catch (e: any) {
        console.error("Unexpected error fetching user profile:", e)
        setError(`Error inesperado: ${e.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [mockAuth.user, isV0, session]) // Dependencias para re-ejecutar el efecto

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

          {loading && (
            <Card className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-3 text-gray-600">Cargando perfil...</span>
            </Card>
          )}

          {error && (
            <Card className="p-6 bg-red-50 border border-red-200 text-red-700">
              <CardTitle className="text-lg font-semibold mb-2">Error al cargar el perfil</CardTitle>
              <CardDescription>{error}</CardDescription>
              <p className="mt-4 text-sm">
                Asegúrate de haber iniciado sesión y de que las variables de entorno de Supabase estén configuradas
                correctamente.
              </p>
            </Card>
          )}

          {!loading && !error && userProfile && (
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage
                    src={userProfile.avatar_url || "/placeholder.svg?height=96&width=96&text=User"}
                    alt={userProfile.name || "User Avatar"}
                  />
                  <AvatarFallback>{userProfile.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{userProfile.name || "Usuario Desconocido"}</h2>
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

          {!loading && !error && !userProfile && (
            <Card className="p-6 text-center">
              <CardTitle className="text-lg font-semibold mb-2">No se encontró el perfil</CardTitle>
              <CardDescription>Parece que no tienes un perfil de usuario en nuestra base de datos.</CardDescription>
              <Button
                className="mt-4 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  /* Lógica para crear perfil */
                }}
              >
                Crear mi perfil
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
