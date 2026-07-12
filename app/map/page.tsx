"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Star, Filter, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import MapboxMap from "./mapbox-map"
import { LoginButton } from "@/components/auth/login-button"
import { AddLocationModal } from "@/components/map/add-location-modal"
import { createClient } from "@supabase/supabase-js"
import { RaizIcon } from "@/components/ui/raiz-icon"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [filterType, setFilterType] = useState("all")
  const [mapLocations, setMapLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLocations = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("map_locations")
      .select("*")
      .order("created_at", { ascending: false })
      
    if (!error && data) {
      // Mapear los datos que vienen directo de Supabase a la estructura que espera el mapa
      const formatted = data.map(item => ({
        ...item,
        coordinates: { lat: item.lat, lng: item.lng }
      }))
      setMapLocations(formatted)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  const filteredLocations = mapLocations.filter((location) => filterType === "all" || location.type === filterType)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <RaizIcon className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-green-800">Raíz·Red</span>
            </Link>
          </div>
          <LoginButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mapa de Profesionales</h1>
            <p className="text-gray-600">Encuentra profesionales del bienestar cerca de ti</p>
          </div>
          <div>
            <AddLocationModal onLocationAdded={fetchLocations} />
          </div>
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
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <MapboxMap
                  locations={filteredLocations}
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
              {filteredLocations.map((location) => (
                <Card
                  key={location.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedLocation === location.id ? "ring-2 ring-green-600 bg-green-50" : ""
                  }`}
                  onClick={() => setSelectedLocation(location.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarImage src={location.avatar || "/placeholder.svg"} alt={location.name} />
                        <AvatarFallback>
                          {location.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-gray-800 truncate flex flex-wrap items-center gap-1.5">
                              {location.name}
                              {location.consent_status === "pending_consent" && (
                                <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700 text-[9px] py-0.5 px-1.5 font-normal tracking-wide shrink-0">
                                  Esperando consentimiento
                                </Badge>
                              )}
                            </h3>
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
