// Archivo simplificado que solo exporta tipos y configuración básica
export interface AuthUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export interface AuthSession {
  user: AuthUser
  expires: string
}

// Configuración básica que se puede usar sin importar NextAuth
export const authConfig = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as const,
  },
}
