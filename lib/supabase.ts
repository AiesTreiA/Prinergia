import { createClient } from "@supabase/supabase-js"

// Asegúrate de que estas variables de entorno estén configuradas en Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("Supabase config:", {
  url: supabaseUrl ? "Set" : "Missing",
  key: supabaseAnonKey ? "Set" : "Missing",
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL o Anon Key no están configuradas. Variables de entorno faltantes:", {
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey,
  })
}

// Cliente para el lado del cliente (navegador)
let supabaseClient: any = null

function getSupabaseClient() {
  if (typeof window !== "undefined") {
    // Solo inicializar en el cliente
    if (!supabaseClient && supabaseUrl && supabaseAnonKey) {
      try {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: false, // Desactivar persistencia para evitar problemas en v0
          },
        })
        console.log("Supabase client initialized successfully")
      } catch (error) {
        console.error("Error initializing Supabase client:", error)
        return null
      }
    }
    return supabaseClient
  }
  return null
}

export const supabase = getSupabaseClient()

// Función para usar en Server Components o Route Handlers si se necesita
export function createServerSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Cannot create server client: missing environment variables")
    return null
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("Error creating server Supabase client:", error)
    return null
  }
}

// Función para verificar si las tablas existen
export async function checkTablesExist() {
  const client = getSupabaseClient()
  if (!client) {
    return { success: false, error: "Client not initialized", tables: {} }
  }

  const tables = {
    users: false,
    professionals: false,
    professional_locations: false,
    professional_specialties: false,
    service_modalities: false,
  }

  try {
    // Verificar tabla users
    const { error: usersError } = await client.from("users").select("count").limit(1)
    tables.users = !usersError

    // Verificar tabla professionals
    const { error: profError } = await client.from("professionals").select("count").limit(1)
    tables.professionals = !profError

    // Verificar tabla professional_locations
    const { error: locError } = await client.from("professional_locations").select("count").limit(1)
    tables.professional_locations = !locError

    // Verificar tabla professional_specialties
    const { error: specError } = await client.from("professional_specialties").select("count").limit(1)
    tables.professional_specialties = !specError

    // Verificar tabla service_modalities
    const { error: modError } = await client.from("service_modalities").select("count").limit(1)
    tables.service_modalities = !modError

    const allTablesExist = Object.values(tables).every(Boolean)

    return {
      success: allTablesExist,
      error: allTablesExist ? null : "Some tables are missing",
      tables,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      tables,
    }
  }
}

// Función para verificar la conexión básica
export async function testSupabaseConnection() {
  const client = getSupabaseClient()
  if (!client) {
    return { success: false, error: "Client not initialized" }
  }

  try {
    // Intentar una consulta simple que no requiere tablas específicas
    const { data, error } = await client.rpc("version")
    if (error) {
      // Si RPC no funciona, intentar con una consulta básica
      const { error: basicError } = await client.from("users").select("count").limit(1)
      if (basicError) {
        return { success: false, error: basicError.message }
      }
    }
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Función para inicializar las tablas automáticamente
export async function initializeTables() {
  const client = getSupabaseClient()
  if (!client) {
    return { success: false, error: "Client not initialized" }
  }

  try {
    // Crear tabla users básica si no existe
    const createUsersSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Nota: En un entorno real, esto se haría a través del dashboard de Supabase
    // o mediante migraciones. Aquí es solo para demostración.
    console.log("Tables should be created through Supabase dashboard or migrations")

    return { success: true, message: "Tables should be created manually" }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
