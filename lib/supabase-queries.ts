import { supabase, checkTablesExist } from "./supabase"

export interface Professional {
  id: string
  user_id: string
  name: string
  specialty: string
  bio?: string
  experience_years?: number
  price_per_session: number
  session_duration?: number
  phone?: string
  languages: string[]
  created_at: string
  updated_at: string
  // Relaciones
  locations?: ProfessionalLocation[]
  specialties?: ProfessionalSpecialty[]
  modalities?: ServiceModality[]
  user?: {
    email: string
    avatar_url?: string
  }
}

export interface ProfessionalLocation {
  id: string
  professional_id: string
  name: string
  address: string
  city: string
  postal_code?: string
  latitude: number
  longitude: number
  is_primary: boolean
  location_type: "individual" | "group" | "center"
  created_at: string
}

export interface ProfessionalSpecialty {
  id: string
  professional_id: string
  specialty_name: string
  created_at: string
}

export interface ServiceModality {
  id: string
  professional_id: string
  modality: "presencial" | "online" | "domicilio" | "grupos"
  created_at: string
}

// Datos de fallback cuando la base de datos no está configurada
const FALLBACK_LOCATIONS = [
  {
    id: "1",
    name: "Javier Mujica",
    specialty: "Facilitador de Biodanza",
    address: "La Reina, Santiago",
    rating: 4.9,
    price: "$45.000",
    coordinates: { lat: -33.451265, lng: -70.551623 },
    avatar: "/images/biodanza.jpg",
    type: "individual" as const,
  },
  {
    id: "2",
    name: "Dharma Yoga Studio",
    specialty: "Centro de Yoga Integral",
    address: "Ñuñoa, Santiago",
    rating: 4.8,
    price: "$35.000",
    coordinates: { lat: -33.435068, lng: -70.585108 },
    avatar: "/images/yoga-beach.jpg",
    type: "center" as const,
  },
  {
    id: "3",
    name: "Domo La Reina",
    specialty: "Biodanza y Arcilla",
    address: "La Reina, Santiago",
    rating: 4.7,
    price: "$40.000",
    coordinates: { lat: -33.452793, lng: -70.524086 },
    avatar: "/images/sound-therapy.jpg",
    type: "group" as const,
  },
  {
    id: "4",
    name: "Casa Allegra",
    specialty: "Yoga y Pilates",
    address: "Providencia, Santiago",
    rating: 4.9,
    price: "$38.000",
    coordinates: { lat: -33.435367, lng: -70.602498 },
    avatar: "/images/acro-yoga.jpg",
    type: "center" as const,
  },
  {
    id: "5",
    name: "Alejandra Ortiz",
    specialty: "Coach de Bienestar",
    address: "Concón, V Región",
    rating: 5.0,
    price: "$50.000",
    coordinates: { lat: -32.934123, lng: -71.547197 },
    avatar: "/images/therapy-session.jpg",
    type: "individual" as const,
  },
  {
    id: "6",
    name: "Circo Wellness",
    specialty: "Artes Circenses y Bienestar",
    address: "Parque Centenario, Santiago",
    rating: 4.8,
    price: "$42.000",
    coordinates: { lat: -33.437, lng: -70.634 },
    avatar: "/images/circo-icon.jpg",
    type: "center" as const,
  },
]

// Obtener ubicaciones para el mapa
export async function getMapLocations() {
  console.log("getMapLocations: Starting...")

  if (!supabase) {
    console.warn("Supabase client not initialized, using fallback data")
    return FALLBACK_LOCATIONS
  }

  // Verificar si las tablas existen
  const tablesCheck = await checkTablesExist()
  if (!tablesCheck.success) {
    console.warn("Tables check failed, using fallback data:", tablesCheck.error)
    console.log("Tables status:", tablesCheck.tables)
    return FALLBACK_LOCATIONS
  }

  try {
    console.log("getMapLocations: All tables exist, fetching from database...")

    const { data, error } = await supabase
      .from("professional_locations")
      .select(`
        *,
        professional:professionals(
          id,
          name,
          specialty,
          price_per_session,
          user:users(avatar_url)
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database query error:", error)
      throw new Error(`Database query failed: ${error.message}`)
    }

    console.log("getMapLocations: Raw data received:", data?.length || 0, "records")

    if (!data || data.length === 0) {
      console.warn("No locations found in database, using fallback data")
      return FALLBACK_LOCATIONS
    }

    // Transformar datos para el formato esperado por el mapa
    const transformedData = data.map((location, index) => {
      const result = {
        id: location.professional?.id || location.id || `fallback-${index}`,
        name: location.professional?.name || location.name || "Profesional",
        specialty: location.professional?.specialty || "Profesional del Bienestar",
        address: location.address || "Dirección no especificada",
        rating: 4.8, // Por ahora hardcodeado, después se puede calcular
        price: location.professional?.price_per_session
          ? `$${location.professional.price_per_session.toLocaleString("es-CL")}`
          : "$0",
        coordinates: {
          lat: Number.parseFloat(location.latitude?.toString() || "-33.4569"),
          lng: Number.parseFloat(location.longitude?.toString() || "-70.6483"),
        },
        avatar: location.professional?.user?.avatar_url || "/placeholder.svg",
        type: location.location_type || "individual",
      }

      console.log(`Transformed location ${index}:`, result)
      return result
    })

    console.log("getMapLocations: Successfully transformed", transformedData.length, "locations")
    return transformedData
  } catch (error: any) {
    console.error("Error in getMapLocations:", error)

    // Proporcionar más detalles del error
    if (error.message?.includes("fetch")) {
      throw new Error("Network error: Unable to connect to database. Check your internet connection.")
    } else if (error.message?.includes("JWT")) {
      throw new Error("Authentication error: Invalid database credentials.")
    } else {
      throw new Error(`Database error: ${error.message || "Unknown error occurred"}`)
    }
  }
}

// Datos de fallback para profesionales
const FALLBACK_PROFESSIONALS: Professional[] = FALLBACK_LOCATIONS.map((loc, index) => ({
  id: loc.id,
  user_id: `user-${loc.id}`,
  name: loc.name,
  specialty: loc.specialty,
  bio: `Profesional dedicado/a al bienestar y desarrollo personal.`,
  experience_years: 5 + index,
  price_per_session: parseInt(loc.price.replace(/\D/g, '')),
  session_duration: 60,
  phone: "+56 9 1234 5678",
  languages: ["Español"],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  locations: [{
    id: `loc-${loc.id}`,
    professional_id: loc.id,
    name: loc.name,
    address: loc.address,
    city: loc.address.split(',')[0]?.trim() || "Santiago",
    latitude: loc.coordinates.lat,
    longitude: loc.coordinates.lng,
    is_primary: true,
    location_type: loc.type,
    created_at: new Date().toISOString(),
  }],
  user: {
    email: `${loc.name.toLowerCase().replace(/\s/g, '.')}@example.com`,
    avatar_url: loc.avatar,
  }
}))

// Obtener todos los profesionales con sus ubicaciones
export async function getAllProfessionals(): Promise<Professional[]> {
  console.log("getAllProfessionals: Starting...")

  if (!supabase) {
    console.warn("Supabase client not initialized, using fallback data")
    return FALLBACK_PROFESSIONALS
  }

  // Verificar si las tablas existen
  const tablesCheck = await checkTablesExist()
  if (!tablesCheck.success) {
    console.warn("Tables check failed, using fallback data:", tablesCheck.error)
    return FALLBACK_PROFESSIONALS
  }

  try {
    const { data, error } = await supabase
      .from("professionals")
      .select(`
        *,
        locations:professional_locations(*),
        specialties:professional_specialties(*),
        modalities:service_modalities(*),
        user:users(email, avatar_url)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching professionals:", error)
      throw new Error(`Failed to fetch professionals: ${error.message}`)
    }

    console.log("getAllProfessionals: Found", data?.length || 0, "professionals")
    return data || []
  } catch (error: any) {
    console.error("Error in getAllProfessionals:", error)
    throw error
  }
}

// Crear un nuevo profesional
export async function createProfessional(
  userId: string,
  professionalData: {
    name: string
    specialty: string
    bio?: string
    experience_years?: number
    price_per_session: number
    session_duration?: number
    phone?: string
    languages?: string[]
  },
) {
  if (!supabase) {
    throw new Error("Supabase not initialized")
  }

  // Verificar si las tablas existen
  const tablesCheck = await checkTablesExist()
  if (!tablesCheck.success) {
    throw new Error("Database tables missing. Please run the SQL scripts to create the tables.")
  }

  const { data, error } = await supabase
    .from("professionals")
    .insert({
      user_id: userId,
      ...professionalData,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating professional:", error)
    throw error
  }

  return data
}

// Agregar ubicación a un profesional
export async function addProfessionalLocation(locationData: {
  professional_id: string
  name: string
  address: string
  city?: string
  postal_code?: string
  latitude: number
  longitude: number
  is_primary?: boolean
  location_type?: "individual" | "group" | "center"
}) {
  if (!supabase) {
    throw new Error("Supabase not initialized")
  }

  const { data, error } = await supabase.from("professional_locations").insert(locationData).select().single()

  if (error) {
    console.error("Error adding professional location:", error)
    throw error
  }

  return data
}

// Obtener profesional por user_id
export async function getProfessionalByUserId(userId: string): Promise<Professional | null> {
  console.log("getProfessionalByUserId: Starting...")

  if (!supabase) {
    console.warn("Supabase client not initialized")
    return null
  }

  // Verificar si las tablas existen
  const tablesCheck = await checkTablesExist()
  if (!tablesCheck.success) {
    console.error("Tables check failed:", tablesCheck.error)
    return null
  }

  try {
    const { data, error } = await supabase
      .from("professionals")
      .select(`
        *,
        locations:professional_locations(*),
        specialties:professional_specialties(*),
        modalities:service_modalities(*),
        user:users(email, avatar_url)
      `)
      .eq("user_id", userId)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No se encontró el profesional
        console.warn("getProfessionalByUserId: No professional found for user_id:", userId)
        return null
      }
      console.error("Error fetching professional by user_id:", error)
      throw new Error(`Failed to fetch professional by user_id: ${error.message}`)
    }

    console.log("getProfessionalByUserId: Found professional for user_id:", userId)
    return data
  } catch (error: any) {
    console.error("Error in getProfessionalByUserId:", error)
    throw error
  }
}

// Buscar profesionales por filtros
export async function searchProfessionals(filters: {
  specialty?: string
  city?: string
  location_type?: string
  price_min?: number
  price_max?: number
}) {
  console.log("searchProfessionals: Starting...")

  if (!supabase) {
    console.warn("Supabase client not initialized, using fallback data")
    return FALLBACK_PROFESSIONALS
  }

  // Verificar si las tablas existen
  const tablesCheck = await checkTablesExist()
  if (!tablesCheck.success) {
    console.warn("Tables check failed, using fallback data:", tablesCheck.error)
    return FALLBACK_PROFESSIONALS
  }

  try {
    let query = supabase.from("professionals").select(`
        *,
        locations:professional_locations(*),
        specialties:professional_specialties(*),
        modalities:service_modalities(*),
        user:users(email, avatar_url)
      `)

    // Aplicar filtros
    if (filters.specialty) {
      query = query.ilike("specialty", `%${filters.specialty}%`)
    }

    if (filters.price_min) {
      query = query.gte("price_per_session", filters.price_min)
    }

    if (filters.price_max) {
      query = query.lte("price_per_session", filters.price_max)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Database query error:", error)
      throw new Error(`Database query failed: ${error.message}`)
    }

    console.log("searchProfessionals: Raw data received:", data?.length || 0, "records")

    if (!data || data.length === 0) {
      console.warn("No professionals found matching filters")
      return []
    }

    // Filtrar por ciudad si se especifica
    if (filters.city && data) {
      const filteredByCity = data.filter((prof) =>
        prof.locations?.some((loc: ProfessionalLocation) =>
          loc.city.toLowerCase().includes(filters.city!.toLowerCase()),
        ),
      )
      console.log("searchProfessionals: Filtered by city:", filteredByCity.length, "records")
      return filteredByCity
    }

    // Filtrar por tipo de ubicación si se especifica
    if (filters.location_type && data) {
      const filteredByLocationType = data.filter((prof) =>
        prof.locations?.some((loc: ProfessionalLocation) => loc.location_type === filters.location_type),
      )
      console.log("searchProfessionals: Filtered by location type:", filteredByLocationType.length, "records")
      return filteredByLocationType
    }

    console.log("searchProfessionals: No additional filters applied")
    return data || []
  } catch (error: any) {
    console.error("Error in searchProfessionals:", error)
    throw error
  }
}
