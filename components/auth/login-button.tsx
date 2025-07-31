"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Calendar, MessageCircle } from "lucide-react"
import { useMockAuth } from "@/lib/mock-auth"
import React from "react"

export function LoginButton() {
  // Siempre llamar el mock auth hook
  const mockAuth = useMockAuth()
  const [nextAuthData, setNextAuthData] = React.useState<any>(null)
  const [isProduction, setIsProduction] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Detectar entorno
    const isV0 =
      typeof window !== "undefined" &&
      (window.location.hostname.includes("v0.dev") ||
        window.location.hostname.includes("vercel.app") ||
        window.location.hostname.includes("localhost"))

    setIsProduction(!isV0)

    // Solo cargar NextAuth en producción
    if (!isV0) {
      const loadNextAuth = async () => {
        try {
          const { useSession, signIn, signOut } = await import("next-auth/react")
          setNextAuthData({ useSession, signIn, signOut })
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

  // En v0, usar mock auth
  if (!isProduction) {
    const { user, isLoading: mockLoading, signIn, signOut } = mockAuth

    if (mockLoading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      )
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                <p className="text-xs text-orange-600">Modo Demo</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Mis Citas</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>Mensajes</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => signIn("google")}>
          Iniciar Sesión
        </Button>
        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => signIn("google")}>
          Registrarse
        </Button>
      </div>
    )
  }

  // En producción, usar NextAuth
  if (isLoading || !nextAuthData) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  return <ProductionLoginButton nextAuthData={nextAuthData} />
}

// Componente separado para producción que usa NextAuth
function ProductionLoginButton({ nextAuthData }: { nextAuthData: any }) {
  const { useSession, signIn, signOut } = nextAuthData
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
              <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{session.user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Mi Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Mis Citas</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Mensajes</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" onClick={() => signIn()}>
        Iniciar Sesión
      </Button>
      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => signIn()}>
        Registrarse
      </Button>
    </div>
  )
}
