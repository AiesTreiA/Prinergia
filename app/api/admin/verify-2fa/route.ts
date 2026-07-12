import { NextRequest, NextResponse } from "next/server"
import { verifyTOTP } from "@/lib/totp"

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()
    // Si no está definido en el env, usamos un secreto base32 por defecto para desarrollo ("JBSWY3DPEHPK3PXP")
    const secret = process.env.ADMIN_TOTP_SECRET || "JBSWY3DPEHPK3PXP"

    if (!code) {
      return NextResponse.json({ error: "Código requerido" }, { status: 400 })
    }

    const isValid = verifyTOTP(code, secret)

    if (!isValid) {
      return NextResponse.json({ error: "Código inválido o expirado" }, { status: 401 })
    }

    const response = NextResponse.json({ success: true, message: "Autenticación 2FA exitosa" })
    
    // Guardamos una cookie de sesión HTTP-only que expira en 2 horas
    response.cookies.set("admin_session", "authorized_session_key_prinergia_red", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7200, // 2 horas
      path: "/"
    })

    return response
  } catch (err: any) {
    console.error("Error en verify-2fa:", err)
    return NextResponse.json({ error: "Error en el servidor al verificar 2FA" }, { status: 500 })
  }
}

// Endpoint GET para verificar de forma rápida desde el cliente si la cookie está activa
export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("admin_session")
  if (cookie && cookie.value === "authorized_session_key_prinergia_red") {
    return NextResponse.json({ authorized: true })
  }
  return NextResponse.json({ authorized: false }, { status: 401 })
}
