import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { encryptText, decryptText } from "@/lib/crypto-helper"

function checkAdminAuth(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin_session")
  return !!(cookie && cookie.value === "authorized_session_key_prinergia_red")
}

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

// Obtener la configuración de cobro de una locación
export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "No autorizado. Inicie sesión con 2FA." }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const locationId = searchParams.get("location_id")

  if (!locationId) {
    return NextResponse.json({ error: "Falta el parámetro location_id." }, { status: 400 })
  }

  try {
    const supabaseAdmin = getAdminSupabase()
    const { data, error } = await supabaseAdmin
      .from("facilitator_payment_settings")
      .select("*")
      .eq("location_id", locationId)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      return NextResponse.json({ data: null })
    }

    // No retornar el API key descifrado al cliente por seguridad.
    // Solo indicar si está configurado.
    return NextResponse.json({
      data: {
        id: data.id,
        location_id: data.location_id,
        p2p_type: data.p2p_type,
        bank_name: data.bank_name,
        bank_account_type: data.bank_account_type,
        bank_account_number: data.bank_account_number,
        bank_rut: data.bank_rut,
        bank_email: data.bank_email,
        crypto_wallet_address: data.crypto_wallet_address,
        api_key_configured: !!data.api_key_encrypted,
        is_active: data.is_active
      }
    })
  } catch (err: any) {
    console.error("Error en GET /api/admin/payment-settings:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Guardar o actualizar la configuración de cobro
export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "No autorizado. Inicie sesión con 2FA." }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      location_id,
      p2p_type,
      bank_name,
      bank_account_type,
      bank_account_number,
      bank_rut,
      bank_email,
      crypto_wallet_address,
      api_key,
      is_active
    } = body

    if (!location_id) {
      return NextResponse.json({ error: "Falta el parámetro location_id." }, { status: 400 })
    }

    const supabaseAdmin = getAdminSupabase()
    
    // Buscar si ya existe registro
    const { data: existing } = await supabaseAdmin
      .from("facilitator_payment_settings")
      .select("id, api_key_encrypted")
      .eq("location_id", location_id)
      .maybeSingle()

    // Cifrar la clave API si fue provista
    let api_key_encrypted = existing?.api_key_encrypted || null
    if (api_key) {
      api_key_encrypted = encryptText(api_key)
    }

    const payload = {
      location_id,
      p2p_type,
      bank_name,
      bank_account_type,
      bank_account_number,
      bank_rut,
      bank_email,
      crypto_wallet_address,
      api_key_encrypted,
      is_active: !!is_active,
      updated_at: new Date().toISOString()
    }

    let result
    if (existing) {
      // Actualizar
      const { data, error } = await supabaseAdmin
        .from("facilitator_payment_settings")
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single()
      
      if (error) throw error
      result = data
    } else {
      // Insertar nuevo
      const { data, error } = await supabaseAdmin
        .from("facilitator_payment_settings")
        .insert(payload)
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return NextResponse.json({ success: true, data: result })
  } catch (err: any) {
    console.error("Error en POST /api/admin/payment-settings:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
