import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  if (!url || !key) {
    return null
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Fallback to local JSON file inside the project workspace
function saveFallback(data: any) {
  try {
    const dataDir = path.join(process.cwd(), "data")
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    const filePath = path.join(dataDir, "dev_applications.json")
    let currentApplications: any[] = []
    
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8")
      currentApplications = JSON.parse(fileData)
    }
    
    const newRecord = {
      id: crypto.randomUUID(),
      ...data,
      status: "pending",
      created_at: new Date().toISOString(),
    }
    
    currentApplications.push(newRecord)
    fs.writeFileSync(filePath, JSON.stringify(currentApplications, null, 2), "utf-8")
    console.log("Postulación dev guardada en archivo fallback local:", filePath)
    return newRecord
  } catch (err) {
    console.error("Error al guardar en fallback local:", err)
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, role, github_url, portfolio_url, experience, motivation, skills } = body

    if (!name || !email || !role) {
      return NextResponse.json({ error: "Faltan parámetros obligatorios (nombre, email y rol)." }, { status: 400 })
    }

    const supabaseAdmin = getAdminSupabase()
    
    if (!supabaseAdmin) {
      console.warn("Supabase no configurado. Usando fallback de almacenamiento local para postulación.")
      const localData = saveFallback(body)
      return NextResponse.json({ 
        success: true, 
        message: "Postulación recibida con éxito (modo fallback local).", 
        data: localData 
      })
    }

    const { data, error } = await supabaseAdmin
      .from("dev_applications")
      .insert([
        {
          name,
          email,
          role,
          github_url: github_url || "",
          portfolio_url: portfolio_url || "",
          experience: experience || "",
          motivation: motivation || "",
          skills: skills || [],
          status: "pending"
        }
      ])
      .select()

    if (error) {
      console.error("Error al insertar en Supabase, intentando fallback:", error.message)
      const localData = saveFallback(body)
      if (localData) {
        return NextResponse.json({ 
          success: true, 
          message: "Postulación recibida con éxito (Guardado local por error de BD).", 
          data: localData 
        })
      }
      throw error
    }

    return NextResponse.json({ success: true, data: data[0] })
  } catch (err: any) {
    console.error("Error en POST /api/dev/apply:", err.message)
    return NextResponse.json({ error: err.message || "Error interno del servidor." }, { status: 500 })
  }
}
