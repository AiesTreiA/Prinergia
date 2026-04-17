"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Calendar, Loader2, ArrowLeft, Leaf, MapPin, Plus } from "lucide-react"
import Link from "next/link"
import { LoginButton } from "@/components/auth/login-button"
import { supabase } from "@/lib/supabase"
import { useMockAuth } from "@/lib/mock-auth"
import { useRouter } from "next/navigation"
import { isV0Environment } from "@/lib/auth-utils"
import { getProfessionalByUserId } from "@/lib/supabase-queries"
import { ProfessionalSetup } from "@/components/auth/professional-setup"

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
  const [professionalProfile, setProfessionalProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showProfessionalSetup, setShowProfessionalSetup] = useState(false)
  const isV0 = isV0Environment()

  useEffect(() => {
    fetchUserProfile()
  }, [mockAuth.user, isV0])

  const fetchUserProfile = async () => {
    setLoading(true)
    setError(null)

    let userEmail: string | undefined = undefined
    let userName: string | undefined = undefined
    let userImage: string | undefined = undefined
    let userId: string | undefined = undefined
    let isAuthenticated = false

    if (isV0) {
      userEmail = mockAuth.user?.email
      userName = mockAuth.user?.name
      userImage = mockAuth.user?.image
      userId = mockAuth.user?.id
      isAuthenticated = !!mockAuth.user
    }

    if (!isAuthenticated) {
      if (isV0) {
        setError("No hay sesión activa. Inicia sesión para ver tu perfil.")
      } else {
        router.push("/auth/signin")
        return
      }
      setLoading(false)
      return
    }

    if (!userEmail || !userId) {
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
      // Obtener o crear usuario en la base de datos
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", userEmail)
        .single()

      if (userError && userError.code === "PGRST116") {
        // Usuario no existe, crearlo
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
          // Buscar perfil profesional
          const professional = await getProfessionalByUserId(newUser.id)
          setProfessionalProfile(professional)
        }
      } else if (userError) {
        console.error("Error fetching user profile:", userError)
        setError(`Error al cargar el perfil: ${userError.message}`)
      } else if (userData) {
        setUserProfile(userData)
        // Buscar perfil profesional
        const professional = await getProfessionalByUserId(userData.id)
        setProfessionalProfile(professional)
      }
    } catch (e: any) {
      console.error("Error inesperado al obtener el perfil de usuario:", e)
      setError(`Error inesperado: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleProfessionalSetupComplete = () => {
    setShowProfessionalSetup(false)
    fetchUserProfile() // Recargar datos
  }

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
        {showProfessionalSetup ? (
          <ProfessionalSetup onComplete={handleProfessionalSetupComplete} />
        ) : (
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
              <>
                {/* Perfil de Usuario */}
                <Card className="mb-6">
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
                  </CardContent>
                </Card>

                {/* Perfil Profesional */}
                {professionalProfile ? (
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Perfil Profesional</h3>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600">Especialidad</p>
                          <p className="font-medium text-green-600">{professionalProfile.specialty}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Experiencia</p>
                          <p className="font-medium">{professionalProfile.experience_years} años</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Precio por sesión</p>
                          <p className="font-medium">
                            ${professionalProfile.price_per_session?.toLocaleString("es-CL")}
                          </p>
                        </div>

                        {professionalProfile.locations && professionalProfile.locations.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Ubicaciones</p>
                            {professionalProfile.locations.map((location: any) => (
                              <div key={location.id} className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span>
                                  {location.name} - {location.address}
                                </span>
                                {location.is_primary && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    Principal
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="pt-4 border-t">
                          <Link href="/map">
                            <Button className="w-full bg-green-600 hover:bg-green-700">
                              <MapPin className="h-4 w-4 mr-2" />
                              Ver en el Mapa
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="mb-6 border-green-200 bg-green-50">
                    <CardContent className="p-6 text-center">
                      <Plus className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">¿Eres un profesional del bienestar?</h3>
                      <p className="text-gray-600 mb-4">
                        Crea tu perfil profesional y aparece en el mapa para que te encuentren nuevos clientes.
                      </p>
                      <Button
                        onClick={() => setShowProfessionalSetup(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Crear Perfil Profesional
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Acciones de Usuario */}
                <div className="space-y-3">
                  <Button className="w-full bg-transparent" variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Editar Perfil Personal
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Mis Citas
                  </Button>
                  <Link href="/messages">
                    <Button className="w-full bg-transparent" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Mensajes
                    </Button>
                  </Link>
                </div>
              </>
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
        )}
      </div>
    </div>
  )
}
