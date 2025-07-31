"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Star, Filter, ArrowLeft, Leaf, Search } from "lucide-react"
import Link from "next/link"
import MapboxMap from "./mapbox-map"
import { LoginButton } from "@/components/auth/login-button"

const mapLocations = [
  {
    id: 1,
    name: "Dra. María González",
    specialty: "Terapia Psicológica",
    address: "Av. Juárez 123, Centro Histórico",
    rating: 4.9,
    price: "$800",
    coordinates: { lat: 19.4326, lng: -99.1332 },
    avatar: "/images/therapy-session.jpg",
    type: "individual",
  },
  {
    id: 2,
    name: "Centro Integral de Bienestar",
    specialty: "Centro Multidisciplinario",
    address: "Av. Insurgentes Sur 456, Roma Norte",
    rating: 4.7,
    price: "$500-900",
    coordinates: { lat: 19.415, lng: -99.162 },
    avatar: "/images/sound-therapy.jpg",
    type: "center",
  },
  {
    id: 3,
    name: "Grupo de Biodanza Corazón",
    specialty: "Biodanza Grupal",
    address: "Parque México, Condesa",
    rating: 4.8,
    price: "$300",
    coordinates: { lat: 19.411, lng: -99.171 },
    avatar: "/images/acro-yoga.jpg",
    type: "group",
  },
  {
    id: 4,
    name: "Estudio Yoga Namaste",
    specialty: "Clases de Yoga",
    address: "Calle Amsterdam 78, Condesa",
    rating: 4.9,
    price: "$400",
    coordinates: { lat: 19.412, lng: -99.168 },
    avatar: "/images/yoga-beach.jpg",
    type: "center",
  },
  {
    id: 5,
    name: "Carlos Mendoza - Coach",
    specialty: "Coaching Personal",
    address: "Av. Álvaro Obregón 234, Roma Norte",
    rating: 4.8,
    price: "$600",
    coordinates: { lat: 19.414, lng: -99.165 },
    avatar: "/images/biodanza.jpg",
    type: "individual",
  },
]

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [filterType, setFilterType] = useState("all")

  const filteredLocations = mapLocations.filter((location) => filterType === "all" || location.type === filterType)

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

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mapa de Profesionales</h1>
          <p className="text-gray-600">Encuentra profesionales del bienestar cerca de ti</p>
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
