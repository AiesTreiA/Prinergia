import { NextRequest, NextResponse } from "next/server"

// Función para verificar si la cookie de sesión de administrador es válida
function checkAdminAuth(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin_session")
  return !!(cookie && cookie.value === "authorized_session_key_prinergia_red")
}

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { lat, lng, keyword } = await req.json()

    if (!lat || !lng || !keyword) {
      return NextResponse.json({ error: "Faltan parámetros (lat, lng, keyword)" }, { status: 400 })
    }

    const googleApiKey = process.env.GOOGLE_PLACES_API_KEY
    let places = []

    if (!googleApiKey) {
      // MODO DEMO: Generamos centros simulados alrededor de las coordenadas del usuario
      console.log("⚠️ Google Places API Key no configurada. Generando centros simulados para desarrollo.")
      
      const sampleNames = {
        masajes: [
          "Escuela de Masajes Tradicionales El Árbol",
          "Templo Sanador - Masoterapia Ancestral",
          "Masajes y Sanación Corporal Providencia",
          "Escuela de Masajes y Anatomía Intuitiva"
        ],
        yoga: [
          "Prana Yoga & Meditación Colectiva",
          "Surya Ashtanga - Espacio de Luz",
          "Yoga Integral y Sonidos de la Tierra",
          "Kundalini Yoga Comunidad"
        ],
        reiki: [
          "Centro Reiki Usui y Armonía Vital",
          "Sanación Pránica y Limpieza de Aura",
          "Luz Violeta - Terapeutas Asociados"
        ]
      }

      const selectedNames = (sampleNames as any)[keyword.toLowerCase()] || [
        `Espacio Holístico de ${keyword}`,
        `Centro de Sanación y Práctica ${keyword}`,
        `Escuela Comunitaria de ${keyword}`
      ]

      places = selectedNames.map((name: string, i: number) => {
        // Pequeño desplazamiento aleatorio en radianes (~1km)
        const offsetLat = (Math.random() - 0.5) * 0.015
        const offsetLng = (Math.random() - 0.5) * 0.015
        
        return {
          place_id: `mock_place_${Date.now()}_${i}`,
          name: name,
          formatted_address: `Calle de la Armonía #${100 + i * 20}, a ${Math.round(Math.random() * 500 + 100)}m de tu GPS`,
          geometry: {
            location: {
              lat: parseFloat(lat) + offsetLat,
              lng: parseFloat(lng) + offsetLng
            }
          },
          rating: (4.5 + Math.random() * 0.5).toFixed(2),
          types: ["health", "point_of_interest", "establishment"]
        }
      })
    } else {
      // Búsqueda real en Google Places Nearby Search
      const radius = 3000 // Radio de 3km
      const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(keyword)}&key=${googleApiKey}`
      
      const response = await fetch(apiUrl)
      const data = await response.json()
      
      if (data.status === "OK" || data.status === "ZERO_RESULTS") {
        const results = data.results || []
        // Mapeamos los datos al formato requerido
        places = results.slice(0, 10).map((place: any) => ({
          place_id: place.place_id,
          name: place.name,
          formatted_address: place.vicinity || "Dirección aproximada",
          geometry: {
            location: {
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng
            }
          },
          rating: place.rating || 5.0
        }))
      } else {
        console.error("Error de Google Places API:", data.status, data.error_message)
        return NextResponse.json({ error: `Google API Error: ${data.status}` }, { status: 502 })
      }
    }

    return NextResponse.json({ success: true, places })
  } catch (err: any) {
    console.error("Error en discover-places:", err)
    return NextResponse.json({ error: "Error al descubrir lugares locales" }, { status: 500 })
  }
}
