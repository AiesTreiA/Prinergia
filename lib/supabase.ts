import { createClient } from "@supabase/supabase-js"

// Asegúrate de que estas variables de entorno estén configuradas en Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase URL o Anon Key no están configuradas. La integración con la base de datos no funcionará correctamente.",
  )
}

// Cliente para el lado del cliente (navegador)
let supabaseClient: any = null

function getSupabaseClient() {
  if (typeof window !== "undefined") {
    // Solo inicializar en el cliente
    if (!supabaseClient) {
      supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!)
    }
    return supabaseClient
  }
  // Para el lado del servidor, se puede crear una nueva instancia si es necesario,
  // o usar un patrón diferente para Server Components/Route Handlers.
  // Para este ejemplo, nos enfocaremos en el cliente.
  return null
}

export const supabase = getSupabaseClient()

// Función para usar en Server Components o Route Handlers si se necesita
export function createServerSupabaseClient() {
  return createClient(supabaseUrl!, supabaseAnonKey!)
}
