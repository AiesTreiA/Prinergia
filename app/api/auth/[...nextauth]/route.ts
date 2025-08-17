import { type NextRequest, NextResponse } from "next/server"

// Función para detectar si estamos en v0
function isV0Environment() {
  return (
    process.env.VERCEL_ENV === "preview" ||
    process.env.NODE_ENV === "development" ||
    (typeof window !== "undefined" &&
      (window.location?.hostname?.includes("v0.dev") ||
        window.location?.hostname?.includes("vercel.app") ||
        window.location?.hostname?.includes("localhost")))
  )
}

// En v0, siempre devolver respuestas mock sin intentar usar NextAuth
export async function GET(request: NextRequest) {
  const { searchParams, pathname } = new URL(request.url)

  // Si estamos en v0, manejar todas las rutas de auth como mock
  if (isV0Environment()) {
    // Ruta de error
    if (pathname.includes("/error")) {
      return NextResponse.redirect(new URL("/auth/error?error=Demo", request.url))
    }

    // Ruta de signin
    if (pathname.includes("/signin")) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }

    // Ruta de callback
    if (pathname.includes("/callback")) {
      return NextResponse.redirect(new URL("/auth/signin?message=demo", request.url))
    }

    // Session endpoint
    if (pathname.includes("/session")) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Providers endpoint
    if (pathname.includes("/providers")) {
      return NextResponse.json({
        google: {
          id: "google",
          name: "Google",
          type: "oauth",
          signinUrl: "/auth/signin",
          callbackUrl: "/auth/callback/google",
        },
      })
    }

    // CSRF token
    if (pathname.includes("/csrf")) {
      return NextResponse.json({ csrfToken: "demo-csrf-token" })
    }

    // Default: redirect to signin
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  // Solo en producción, intentar cargar NextAuth
  try {
    const NextAuth = (await import("next-auth")).default

    const authOptions = {
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
        async session({ session, token }: any) {
          if (session.user) {
            session.user.id = token.sub
          }
          return session
        },
        async jwt({ token, account, user }: any) {
          if (account && user) {
            token.accessToken = account.access_token
          }
          return token
        },
      },
      session: {
        strategy: "jwt" as const,
      },
      secret: process.env.NEXTAUTH_SECRET,
      debug: process.env.NODE_ENV === "development",
    }

    const handler = NextAuth(authOptions)
    return handler.GET ? handler.GET(request) : handler(request)
  } catch (error) {
    console.error("NextAuth error:", error)
    return NextResponse.redirect(new URL("/auth/error?error=Configuration", request.url))
  }
}

export async function POST(request: NextRequest) {
  // En v0, todas las peticiones POST devuelven error de demo
  if (isV0Environment()) {
    return NextResponse.json({ error: "Authentication not available in demo mode" }, { status: 400 })
  }

  // Solo en producción, intentar cargar NextAuth
  try {
    const NextAuth = (await import("next-auth")).default

    const authOptions = {
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
        async session({ session, token }: any) {
          if (session.user) {
            session.user.id = token.sub
          }
          return session
        },
        async jwt({ token, account, user }: any) {
          if (account && user) {
            token.accessToken = account.access_token
          }
          return token
        },
      },
      session: {
        strategy: "jwt" as const,
      },
      secret: process.env.NEXTAUTH_SECRET,
      debug: process.env.NODE_ENV === "development",
    }

    const handler = NextAuth(authOptions)
    return handler.POST ? handler.POST(request) : handler(request)
  } catch (error) {
    console.error("NextAuth POST error:", error)
    return NextResponse.json({ error: "Authentication configuration error" }, { status: 500 })
  }
}
