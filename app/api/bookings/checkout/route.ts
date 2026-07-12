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

/**
 * API de Reserva y Checkout: Modelo B (Recargo visible de Sustentabilidad del 2%)
 * Soporta:
 * 1. Mercado Pago Split: Genera preferencia con ruteo dividido.
 * 2. Transferencia Directa Híbrida: El alumno paga el 2% online en la web para asegurar
 *    la reserva, y transfiere el 98% directamente al facilitador P2P.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { location_id, amount_base, student_email, student_name, class_name } = body

    if (!location_id || !amount_base || !student_email) {
      return NextResponse.json({ error: "Faltan parámetros obligatorios." }, { status: 400 })
    }

    const supabaseAdmin = getAdminSupabase()

    // 1. Obtener datos bancarios y API del facilitador
    const { data: settings } = await supabaseAdmin
      .from("facilitator_payment_settings")
      .select("*, map_locations(name, type)")
      .eq("location_id", location_id)
      .maybeSingle()

    // Calcular montos de Modelo B
    const amountBaseNum = parseFloat(amount_base)
    const protocolFee = Math.round(amountBaseNum * 0.02) // 2% de tasa de sustentabilidad
    const totalAmount = amountBaseNum + protocolFee

    // Si el facilitador no tiene activado el cobro P2P, mostrar error
    if (!settings || !settings.is_active) {
      return NextResponse.json({
        error: "Este facilitador aún no ha configurado sus métodos de cobros directos."
      }, { status: 400 })
    }

    // 2. Ejecutar flujo de pago UNIFICADO (El alumno realiza una sola acción de pago)
    // El desglose muestra el recargo de sustentabilidad, y la pasarela divide el dinero en el fondo.
    
    if (settings.p2p_type === "transferencia" || settings.p2p_type === "mercado_pago") {
      /**
       * FLUJO DE PAGO ÚNICO (MERCADO PAGO / FLOW SPLIT / KHIPU-FINTOC BANCARIO):
       * El alumno paga el monto total ($10.200 CLP) en una sola transacción.
       * - En pantalla se muestra de manera transparente:
       *   * Clase: $10.000 CLP
       *   * Tasa de Sustento Red Raíz (2.0%): $200 CLP
       *   * Total a Pagar: $10.200 CLP
       * - La pasarela (Mercado Pago o Flow Split) procesa el pago unificado y realiza la división en el fondo:
       *   * $10.000 CLP se depositan directo al facilitador (API Key o Cuenta bancaria asociada).
       *   * $200 CLP se depositan directo en la cuenta recolectora de Red Raíz para ser convertidos a cripto.
       */
      const isBank = settings.p2p_type === "transferencia"
      
      return NextResponse.json({
        success: true,
        payment_method: isBank ? "transferencia_fintoc_split" : "mercado_pago_split",
        pricing: {
          base: amountBaseNum,
          fee: protocolFee,
          total: totalAmount
        },
        // En producción, generamos el link de pago único con el Split de la API correspondiente
        checkout_url: isBank
          ? `https://gateway.fintoc.com/checkout?amount=${totalAmount}&destination_split_1=98&destination_split_2=2`
          : `https://www.mercadopago.cl/checkout/v1/redirect?pref_id=pref_split_${location_id}_${totalAmount}`,
        message: `Redireccionando a la pasarela de pago seguro. Se cobrará un total de $${totalAmount.toLocaleString('es-CL')} CLP (incluye 2.0% de aporte a la sustentabilidad del mapa).`,
        breakdown: {
          facilitator_receives: amountBaseNum,
          protocol_receives: protocolFee
        }
      })
    }

    if (settings.p2p_type === "crypto") {
      /**
       * FLUJO WEB3 CRIPTO DIRECTO:
       * El alumno firma una sola transacción en su billetera Web3 (MetaMask, Phantom, etc.).
       * El Smart Contract de Red Raíz recibe los tokens y realiza el split (98% / 2%) en la misma transacción on-chain.
       */
      return NextResponse.json({
        success: true,
        payment_method: "crypto_web3",
        pricing: {
          base: amountBaseNum,
          fee: protocolFee,
          total: totalAmount
        },
        facilitator_wallet: settings.crypto_wallet_address,
        protocol_wallet: "0x4b789178C98Bf49aB841804E1E262241F804B8D1", // Billetera de tesorería de Red Raíz
        message: "Inicializando transacción unificada (Split 98% / 2%) en el Smart Contract del protocolo..."
      })
    }

    return NextResponse.json({ error: "Método de pago no soportado." }, { status: 400 })

  } catch (err: any) {
    console.error("Error en POST /api/bookings/checkout:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
