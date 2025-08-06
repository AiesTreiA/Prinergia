import { NextResponse } from "next/server"

// Detección directa del entorno de v0 en el servidor
// Si VERCEL_ENV es 'preview', asumimos que estamos en el entorno de v0.
const IS_V0_ENV = process.env.VERCEL_ENV === "preview"

// --- LOGS DE DEPURACIÓN ---
console.log(`[Auth Route Handler] IS_V0_ENV: ${IS_V0_ENV}`)
console.log(`[Auth Route Handler] process.env.NODE_ENV: ${process.env.NODE_ENV}`)
console.log(`[Auth Route Handler] process.env.VERCEL_ENV: ${process.env.VERCEL_ENV}`)
// --- FIN LOGS DE DEPURACIÓN ---

// Definir los handlers de forma condicional dentro de las funciones exportadas
export async function GET(req: Request) {
  if (IS_V0_ENV) {
    console.warn("[Auth Route Handler] GET: NextAuth está deshabilitado en el entorno de v0 para propósitos de demostración.")
    return NextResponse.json(
      {
        error: "Autenticación deshabilitada en el entorno de demostración de v0.",
        code: "AUTH_DISABLED_V0_DEMO",
        message: "Por favor, usa el modo demo para iniciar sesión.",
      },
      { status: 200 }, // Devolver 200 OK para que el cliente no trate esto como un error de red
    )
  } else {
    console.log("[Auth Route Handler] GET: Cargando NextAuth handlers para producción.")
    try {
      // Importar dinámicamente los handlers de NextAuth solo cuando no sea v0
      const nextAuthHandlers = await import("@/lib/next-auth-api-handlers")
      return nextAuthHandlers.GET(req)
    } catch (e: any) {
      console.error("Error inesperado al cargar NextAuth GET handler en producción:", e)
      return NextResponse.json(
        {
          error: "Error interno del servidor al configurar la autenticación (GET).",
          details: e.message || "Error desconocido",
          code: "NEXTAUTH_INIT_FAILED_GET",
        },
        { status: 500 },
      )
    }
  }
}

export async function POST(req: Request) {
  if (IS_V0_ENV) {
    console.warn("[Auth Route Handler] POST: NextAuth está deshabilitado en el entorno de v0 para propósitos de demostración.")
    return NextResponse.json(
      {
        error: "Autenticación deshabilitada en el entorno de demostración de v0.",
        code: "AUTH_DISABLED_V0_DEMO",
        message: "Por favor, usa el modo demo para iniciar sesión.",
      },
      { status: 200 }, // Devolver 200 OK para que el cliente no trate esto como un error de red
    )
  } else {
    console.log("[Auth Route Handler] POST: Cargando NextAuth handlers para producción.")
    try {
      // Importar dinámicamente los handlers de NextAuth solo cuando no sea v0
      const nextAuthHandlers = await import("@/lib/next-auth-api-handlers")
      return nextAuthHandlers.POST(req)
    } catch (e: any) {
      console.error("Error inesperado al cargar NextAuth POST handler en producción:", e)
      return NextResponse.json(
        {
          error: "Error interno del servidor al configurar la autenticación (POST).",
          details: e.message || "Error desconocido",
          code: "NEXTAUTH_INIT_FAILED_POST",
        },
        { status: 500 },
      )
    }
  }
}
