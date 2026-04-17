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
import { isV0Environment } from "@/lib/auth-utils"
import Link from "next/link"

export function LoginButton() {
  const mockAuth = useMockAuth()
  const isV0 = isV0Environment()

  // SIEMPRE usar mock auth en v0, sin importar nada de NextAuth
  if (isV0) {
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
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Mis Citas</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/messages">
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>Mensajes</span>
              </Link>
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

  // En producción (no v0), mostrar botones básicos sin NextAuth por ahora
  return (
    <div className="flex items-center space-x-2">
      <Link href="/auth/signin">
        <Button variant="ghost" size="sm">
          Iniciar Sesión
        </Button>
      </Link>
      <Link href="/auth/signin">
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          Registrarse
        </Button>
      </Link>
    </div>
  )
}
