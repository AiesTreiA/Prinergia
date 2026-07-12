import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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

// 1. GET: Obtener detalles del nodo pre-mapeado para la vista pública de consentimiento
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Falta el parámetro id del nodo." }, { status: 400 })
    }

    const supabaseAdmin = getAdminSupabase()
    const { data, error } = await supabaseAdmin
      .from("map_locations")
      .select("id, name, specialty, address, type, avatar, consent_status")
      .eq("id", id)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      return NextResponse.json({ error: "Nodo no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    console.error("Error en GET /api/consent:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// 2. POST: Guardar el consentimiento y el nivel de aporte elegido
export async function POST(req: NextRequest) {
  try {
    const { id, contribution_level } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Faltan parámetros obligatorios (id)." }, { status: 400 })
    }

    if (contribution_level !== undefined && ![0, 2000, 5000].includes(contribution_level)) {
      return NextResponse.json({ error: "Nivel de aporte inválido (debe ser 0, 2000 o 5000)." }, { status: 400 })
    }

    const supabaseAdmin = getAdminSupabase()
    
    // Validar que el nodo existe
    const { data: existing, error: existError } = await supabaseAdmin
      .from("map_locations")
      .select("id")
      .eq("id", id)
      .maybeSingle()

    if (existError) throw existError
    if (!existing) {
      return NextResponse.json({ error: "Nodo no encontrado" }, { status: 404 })
    }

    // Actualizar el nodo
    const { data, error } = await supabaseAdmin
      .from("map_locations")
      .update({
        consent_status: "given",
        contribution_level: contribution_level || 0,
        consent_date: new Date().toISOString()
      })
      .eq("id", id)
      .select()

    if (error) throw error

    // Si el aporte es 5 o 15, creamos una configuración de cobro activa por defecto en 'transferencia'
    if (contribution_level > 0) {
      const { error: payError } = await supabaseAdmin
        .from("facilitator_payment_settings")
        .upsert({
          location_id: id,
          p2p_type: "transferencia",
          is_active: true,
          updated_at: new Date().toISOString()
        }, { onConflict: "location_id" })

      if (payError) {
        console.error("Error al crear configuración de pago inicial:", payError.message)
        // No arruinamos el flujo si esto falla
      }
    }

    return NextResponse.json({ success: true, data: data[0] })
  } catch (err: any) {
    console.error("Error en POST /api/consent:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
