import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { SupabaseAdapter } from "@auth/supabase-adapter"

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url }) {
        const { sendMagicLinkEmail } = await import("@/lib/email")
        await sendMagicLinkEmail(identifier, url)
      },
    }),
  ],
  adapter: (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
    ? SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
      }) as any
    : undefined,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user, token }) {
      // Castear para evitar errores de typescript en next-auth v4
      const sessionUser = session.user as any;
      if (sessionUser) {
        if (user) {
          sessionUser.id = user.id;
        } else if (token) {
          sessionUser.id = token.sub as string;
        }
      }
      return session
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
  session: {
    // Cuando hay un adapter y Provider como Email, suele forzarse a "database"
    // Pero especificamos "jwt" si preferimos tokens JWT. Email Provider necesita DB para tokens de verificación.
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

// Handler para la app router (App Directory)
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
