import { NextResponse } from "next/server"
import { isV0Environment } from "@/lib/auth-config"

// Detectar si estamos en el entorno de v0
const IS_V0_ENV = isV0Environment()

// Definir el handler de la API de forma condicional en el nivel superior
// Esto asegura que el código de NextAuth solo se cargue/parse si no es el entorno de v0
const handler = IS_V0_ENV
  ? // Si estamos en v0, devolver un JSON de demo directamente
    async (req: Request) => {
      console.warn("NextAuth está deshabilitado en el entorno de v0 para propósitos de demostración.")
      return NextResponse.json(
        {
          error: "Autenticación deshabilitada en el entorno de demostración de v0.",
          code: "AUTH_DISABLED_V0_DEMO",
          message: "Por favor, usa el modo demo para iniciar sesión.",
        },
        { status: 200 }, // Devolver 200 OK para que el cliente no trate esto como un error de red
      )
    }
  : // En producción, inicializar NextAuth normalmente
    (async () => {
      const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

      if (!NEXTAUTH_SECRET) {
        // Si NEXTAUTH_SECRET no está configurado en producción, devolver un error 500
        return async (req: Request) => {
          console.error("NEXTAUTH_SECRET no está configurado. La ruta de la API de NextAuth no puede funcionar.")
          return NextResponse.json(
            {
              error: "El servicio de autenticación no está configurado. Falta NEXTAUTH_SECRET.",
              code: "NEXTAUTH_SECRET_MISSING",
            },
            { status: 500 },
          )
        }
      } else {
        // Importar NextAuth y GoogleProvider solo si no es el entorno de v0
        const NextAuth = (await import("next-auth")).default
        const GoogleProvider = (await import("next-auth/providers/google")).default

        return NextAuth({
          providers: [
            GoogleProvider({
              clientId: process.env.GOOGLE_CLIENT_ID!,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            }),
          ],
          pages: {
            signIn: "/auth/signin",
            error: "/auth/error",
          },
          callbacks: {
            async session({ session, token }) {
              return session
            },
            async jwt({ token, account }) {
              return token
            },
          },
          secret: NEXTAUTH_SECRET,
          debug: process.env.NODE_ENV === "development",
        })
      }
    })() // Ejecutar la IIFE para obtener el handler

export { handler as GET, handler as POST }
