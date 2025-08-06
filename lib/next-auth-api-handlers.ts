// Este archivo contiene la configuración y los handlers de NextAuth.
// Solo se importará y ejecutará en entornos que NO sean v0 (producción, desarrollo local normal).

import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Configuración de NextAuth
const nextAuthOptions = {
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
    async session({ session, token }: { session: any; token: any }) {
      return session
    },
    async jwt({ token, account }: { token: any; account: any }) {
      return token
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
  debug: process.env.NODE_ENV === "development",
}

// Crear el handler de NextAuth
const handler = NextAuth(nextAuthOptions)

// Exportar los handlers GET y POST
export { handler as GET, handler as POST }
