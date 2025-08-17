import NextAuth from "next-auth"

// Configuración de NextAuth
const nextAuthOptions = {
  providers: [
    {
      id: "google",
      name: "Google",
      type: "oauth",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        url: "https://accounts.google.com/oauth/authorize",
        params: {
          scope: "openid email profile",
          response_type: "code",
        },
      },
      token: "https://oauth2.googleapis.com/token",
      userinfo: "https://www.googleapis.com/oauth2/v2/userinfo",
      profile(profile: any) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    },
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

// Archivo legacy - ya no se usa, mantenido para compatibilidad
export const legacyHandler = null
