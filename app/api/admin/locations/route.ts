import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Función para verificar si la cookie de sesión de administrador es válida
function checkAdminAuth(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin_session")
  return !!(cookie && cookie.value === "authorized_session_key_prinergia_red")
}

// Inicializa el cliente de Supabase con la Service Role Key para saltar políticas RLS
function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  if (!url || !key) {
    throw new Error("Faltan credenciales de administración en .env.local (URL o Service Role Key)")
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })
}

// Obtener todas las locaciones del mapa (sin importar su estado de consentimiento)
export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "No autorizado. Inicie sesión con 2FA." }, { status: 401 })
  }

  try {
    const supabaseAdmin = getAdminSupabase()
    const { data, error } = await supabaseAdmin
      .from("map_locations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (err: any) {
    console.error("Error en GET /api/admin/locations:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Crear una nueva locación directamente desde el panel administrativo
export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "No autorizado. Inicie sesión con 2FA." }, { status: 401 })
  }

  try {
    const { name, specialty, address, lat, lng, type, avatar, consent_status } = await req.json()
    if (!name || !specialty || !address || !lat || !lng || !type) {
      return NextResponse.json({ error: "Faltan parámetros obligatorios" }, { status: 400 })
    }

    const supabaseAdmin = getAdminSupabase()
    const { data, error } = await supabaseAdmin
      .from("map_locations")
      .insert([
        {
          name,
          specialty,
          address,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          type,
          avatar: avatar || "/placeholder.svg",
          consent_status: consent_status || "pending_consent"
        }
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data: data[0] })
  } catch (err: any) {
    console.error("Error en POST /api/admin/locations:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Modificar el estado de consentimiento de un nodo (esperando / dado)
export async function PATCH(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "No autorizado. Inicie sesión con 2FA." }, { status: 401 })
  }

  try {
    const { id, consent_status } = await req.json()
    if (!id || !consent_status) {
      return NextResponse.json({ error: "Faltan parámetros (id, consent_status)" }, { status: 400 })
    }

    if (consent_status !== "pending_consent" && consent_status !== "given") {
      return NextResponse.json({ error: "Estado de consentimiento inválido" }, { status: 400 })
    }

    const supabaseAdmin = getAdminSupabase()
    const { data, error } = await supabaseAdmin
      .from("map_locations")
      .update({ consent_status })
      .eq("id", id)
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    console.error("Error en PATCH /api/admin/locations:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Eliminar un nodo del mapa definitivamente
export async function DELETE(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "No autorizado. Inicie sesión con 2FA." }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "Falta ID de locación" }, { status: 400 })
    }

    const supabaseAdmin = getAdminSupabase()
    const { error } = await supabaseAdmin
      .from("map_locations")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true, message: "Locación eliminada exitosamente" })
  } catch (err: any) {
    console.error("Error en DELETE /api/admin/locations:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
