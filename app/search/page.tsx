"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Filter, Leaf, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { LoginButton } from "@/components/auth/login-button"
import { getAllProfessionals, searchProfessionals, type Professional } from "@/lib/supabase-queries"

export default function SearchPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")

  useEffect(() => {
    loadProfessionals()
  }, [])

  const loadProfessionals = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllProfessionals()
      setProfessionals(data)
    } catch (err) {
      console.error("Error loading professionals:", err)
      setError("Error al cargar profesionales. Usando datos de ejemplo.")

      // Fallback a datos hardcodeados si falla Supabase
      const fallbackProfessionals = [
        {
          id: "1",
          user_id: "1",
          name: "Dra. María González",
          specialty: "Terapia Psicológica",
          bio: "Psicóloga clínica con más de 10 años de experiencia",
          experience_years: 10,
          price_per_session: 80000,
          session_duration: 50,
          phone: "+56 9 8765 4321",
          languages: ["Español"],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          locations: [
            {
              id: "1",
              professional_id: "1",
              name: "Consulta Centro",
              address: "Centro, Santiago",
              city: "Santiago",
              latitude: -33.4569,
              longitude: -70.6483,
              is_primary: true,
              location_type: "individual" as const,
              created_at: new Date().toISOString(),
            },
          ],
          specialties: [
            { id: "1", professional_id: "1", specialty_name: "Ansiedad", created_at: new Date().toISOString() },
            { id: "2", professional_id: "1", specialty_name: "Depresión", created_at: new Date().toISOString() },
            {
              id: "3",
              professional_id: "1",
              specialty_name: "Terapia de Pareja",
              created_at: new Date().toISOString(),
            },
          ],
          modalities: [
            { id: "1", professional_id: "1", modality: "presencial" as const, created_at: new Date().toISOString() },
            { id: "2", professional_id: "1", modality: "online" as const, created_at: new Date().toISOString() },
          ],
          user: {
            email: "maria@example.com",
            avatar_url: "/images/therapy-session.jpg",
          },
        },
      ]
      setProfessionals(fallbackProfessionals)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      const filters: any = {}

      if (selectedSpecialty !== "all") filters.specialty = selectedSpecialty
      if (selectedLocation !== "all") filters.city = selectedLocation

      const data = await searchProfessionals(filters)

      // Filtrar por término de búsqueda si existe
      let filteredData = data
      if (searchTerm) {
        filteredData = data.filter(
          (prof) =>
            prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prof.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prof.specialties?.some((spec) => spec.specialty_name.toLowerCase().includes(searchTerm.toLowerCase())),
        )
      }

      setProfessionals(filteredData)
    } catch (err) {
      console.error("Error searching professionals:", err)
      setError("Error en la búsqueda")
    } finally {
      setLoading(false)
    }
  }

  if (loading && professionals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando profesionales...</p>
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

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Encuentra tu Profesional Ideal
            {error && <span className="text-sm text-orange-600 block mt-1">({error})</span>}
          </h1>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Buscar por nombre, especialidad o técnica..."
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Terapia Psicológica">Terapia Psicológica</SelectItem>
                  <SelectItem value="Coaching">Coaching</SelectItem>
                  <SelectItem value="Yoga">Yoga</SelectItem>
                  <SelectItem value="Biodanza">Biodanza</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Santiago">Región Metropolitana</SelectItem>
                  <SelectItem value="Valparaíso">V Región</SelectItem>
                  <SelectItem value="Concepción">VIII Región</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Buscar
              </Button>

              <Button variant="outline" className="flex items-center gap-2 bg-transparent" onClick={loadProfessionals}>
                <Filter className="h-4 w-4" />
                Mostrar Todos
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">{professionals.length} profesionales encontrados</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Ordenar por:</span>
            <Select defaultValue="rating">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Mejor valorados</SelectItem>
                <SelectItem value="price-low">Precio menor</SelectItem>
                <SelectItem value="price-high">Precio mayor</SelectItem>
                <SelectItem value="distance">Distancia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6">
          {professionals.map((professional) => (
            <Card key={professional.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={professional.user?.avatar_url || "/placeholder.svg"} alt={professional.name} />
                      <AvatarFallback>
                        {professional.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">{professional.name}</h3>
                        <p className="text-green-600 font-medium mb-2">{professional.specialty}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {professional.locations?.[0]?.address || "Ubicación no especificada"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            4.8 (127 reseñas)
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800 mb-1">
                          ${professional.price_per_session?.toLocaleString("es-CL") || "0"}
                        </div>
                        <div className="text-sm text-gray-600">por sesión</div>
                        <div className="flex items-center gap-1 text-sm text-green-600 mt-2">
                          <Clock className="h-4 w-4" />
                          Disponible
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {professional.specialties?.slice(0, 4).map((specialty) => (
                        <Badge key={specialty.id} variant="secondary" className="bg-green-100 text-green-700">
                          {specialty.specialty_name}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Link href={`/professional/${professional.id}`} className="flex-1">
                        <Button className="w-full bg-green-600 hover:bg-green-700">Ver Perfil</Button>
                      </Link>
                      <Link href="/booking" className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent">
                          Reservar Sesión
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" onClick={loadProfessionals} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Cargar más resultados
          </Button>
        </div>
      </div>
    </div>
  )
}
