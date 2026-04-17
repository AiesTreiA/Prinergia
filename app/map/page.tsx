"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Star, Filter, ArrowLeft, Leaf, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import MapboxMap from "./mapbox-map"
import { LoginButton } from "@/components/auth/login-button"
import { getMapLocations } from "@/lib/supabase-queries"
import { SupabaseStatus } from "@/components/debug/supabase-status"

interface MapLocation {
  id: string
  name: string
  specialty: string
  address: string
  rating: number
  price: string
  coordinates: { lat: number; lng: number }
  avatar: string
  type: string
}

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [filterType, setFilterType] = useState("all")
  const [locations, setLocations] = useState<MapLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMapLocations()
  }, [])

  const loadMapLocations = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Loading map locations...")
      const data = await getMapLocations()
      console.log("Map locations loaded successfully:", data.length)

      setLocations(data)

      if (data.length === 0) {
        setError("No se encontraron ubicaciones en la base de datos.")
      }
    } catch (err: any) {
      console.error("Error loading map locations:", err)

      let errorMessage = "Error al cargar las ubicaciones."

      if (err.message?.includes("environment variables")) {
        errorMessage = "Configuración de base de datos faltante. Usando datos de ejemplo."
      } else if (err.message?.includes("Network error")) {
        errorMessage = "Error de conexión. Verifica tu internet. Usando datos de ejemplo."
      } else if (err.message?.includes("Database connection failed")) {
        errorMessage = "No se puede conectar a la base de datos. Usando datos de ejemplo."
      } else {
        errorMessage = `Error: ${err.message}. Usando datos de ejemplo.`
      }

      setError(errorMessage)

      // Fallback a datos hardcodeados si falla Supabase
      const fallbackLocations: MapLocation[] = [
        {
          id: "1",
          name: "Javier Mujica",
          specialty: "Facilitador de Biodanza",
          address: "Alcalde Fernando Castillo Velasco 7379, La Reina, Santiago, Chile",
          rating: 4.9,
          price: "$35.000",
          coordinates: { lat: -33.451265937139524, lng: -70.55162381831155 },
          avatar: "/images/biodanza.jpg",
          type: "group",
        },
        {
          id: "2",
          name: "Dharma Yoga",
          specialty: "Centro de Yoga Iyengar",
          address: "Diego de Almagro 3223, Ñuñoa, Santiago, Chile",
          rating: 4.8,
          price: "$60.000",
          coordinates: { lat: -33.43506812024132, lng: -70.58510818762582 },
          avatar: "/images/sound-therapy.jpg",
          type: "center",
        },
        {
          id: "3",
          name: "Domo La Reina",
          specialty: "Biodanza y Arcilla",
          address: "Av. Alcalde Fernando Castillo Velasco 10550, La Reina, Santiago, Chile",
          rating: 4.9,
          price: "$75.000",
          coordinates: { lat: -33.452793140607056, lng: -70.52408616063985 },
          avatar: "/images/acro-yoga.jpg",
          type: "center",
        },
        {
          id: "4",
          name: "Estudio Casa Allegra",
          specialty: "Clases de Yoga y Pilates",
          address: "Suecia 1650, Dpto 103, Providencia, Santiago, Chile",
          rating: 4.9,
          price: "$45.000",
          coordinates: { lat: -33.43536788716499, lng: -70.60249843180485 },
          avatar: "/images/yoga-beach.jpg",
          type: "center",
        },
        {
          id: "5",
          name: "Alejandra Ortiz - Coach",
          specialty: "Coaching de Vida",
          address: "Costa de Montemar, Concon, V Región, Chile",
          rating: 4.8,
          price: "$50.000",
          coordinates: { lat: -32.934123590154584, lng: -71.54719752304305 },
          avatar: "/images/ale_avatar.jpg",
          type: "individual",
        },
      ]

      console.log("Using fallback data:", fallbackLocations.length, "locations")
      setLocations(fallbackLocations)
    } finally {
      setLoading(false)
    }
  }

  const filteredLocations = locations.filter((location) => filterType === "all" || location.type === filterType)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando ubicaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-green-800">Prinergia</span>
            </Link>
          </div>
          <LoginButton />
        </div>
      </header>

      {/* Debug Component */}
      {process.env.NODE_ENV === "development" && (
        <div className="container mx-auto px-4 py-4">
          <SupabaseStatus />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mapa de Profesionales</h1>
          <p className="text-gray-600">
            Encuentra profesionales del bienestar cerca de ti
            {error && <span className="text-orange-600 ml-2">({error})</span>}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Buscar por ubicación o código postal..." className="pl-10" />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de servicio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="individual">Consultas Individuales</SelectItem>
                <SelectItem value="group">Grupos y Talleres</SelectItem>
                <SelectItem value="center">Centros de Bienestar</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadMapLocations}
              className="flex items-center gap-2 bg-transparent"
            >
              <Loader2 className="h-3 w-3" />
              Actualizar
            </Button>
            <span className="text-sm text-gray-500">
              {locations.length > 0 ? `${locations.length} ubicaciones cargadas` : "Sin datos"}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <MapboxMap
                  locations={filteredLocations.map((loc, index) => ({
                    ...loc,
                    id: Number.parseInt(loc.id) || index + 1,
                  }))}
                  selectedLocation={selectedLocation}
                  onLocationSelect={setSelectedLocation}
                />
              </CardContent>
            </Card>
          </div>

          {/* Locations List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Ubicaciones ({filteredLocations.length})</h2>
              <Select defaultValue="distance">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distancia</SelectItem>
                  <SelectItem value="rating">Calificación</SelectItem>
                  <SelectItem value="price">Precio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredLocations.map((location, index) => (
                <Card
                  key={location.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedLocation === (Number.parseInt(location.id) || index + 1)
                      ? "ring-2 ring-green-600 bg-green-50"
                      : ""
                  }`}
                  onClick={() => setSelectedLocation(Number.parseInt(location.id) || index + 1)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarImage src={location.avatar || "/placeholder.svg"} alt={location.name} />
                        <AvatarFallback>
                          {location.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-gray-800 truncate">{location.name}</h3>
                            <p className="text-sm text-green-600">{location.specialty}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-bold text-gray-800">{location.price}</div>
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {location.rating}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{location.address}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              location.type === "individual"
                                ? "bg-blue-100 text-blue-700"
                                : location.type === "group"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {location.type === "individual"
                              ? "Individual"
                              : location.type === "group"
                                ? "Grupal"
                                : "Centro"}
                          </Badge>
                          <span className="text-xs text-gray-500">0.8 km</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
