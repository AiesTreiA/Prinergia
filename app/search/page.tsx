import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Filter, Leaf, ArrowLeft } from "lucide-react"
import Link from "next/link"

const professionals = [
  {
    id: 1,
    name: "Dra. María González",
    specialty: "Terapia Psicológica",
    location: "Centro, CDMX",
    rating: 4.9,
    reviews: 127,
    price: "$800",
    image: "/images/therapy-session.jpg",
    tags: ["Ansiedad", "Depresión", "Terapia de Pareja"],
    available: "Hoy disponible",
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    specialty: "Coach de Vida",
    location: "Roma Norte, CDMX",
    rating: 4.8,
    reviews: 89,
    price: "$600",
    image: "/images/biodanza.jpg",
    tags: ["Desarrollo Personal", "Liderazgo", "Metas"],
    available: "Disponible mañana",
  },
  {
    id: 3,
    name: "Ana Sofía Ruiz",
    specialty: "Profesora de Yoga",
    location: "Condesa, CDMX",
    rating: 5.0,
    reviews: 203,
    price: "$400",
    image: "/images/yoga-beach.jpg",
    tags: ["Hatha Yoga", "Meditación", "Principiantes"],
    available: "Hoy disponible",
  },
  {
    id: 4,
    name: "Roberto Silva",
    specialty: "Facilitador de Biodanza",
    location: "Coyoacán, CDMX",
    rating: 4.7,
    reviews: 56,
    price: "$500",
    image: "/images/acro-yoga.jpg",
    tags: ["Expresión Corporal", "Grupos", "Autoestima"],
    available: "Disponible esta semana",
  },
]

export default function SearchPage() {
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
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              Iniciar Sesión
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Registrarse
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Encuentra tu Profesional Ideal</h1>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input placeholder="Buscar por nombre, especialidad o técnica..." className="w-full" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="terapia">Terapia Psicológica</SelectItem>
                  <SelectItem value="coaching">Coaching</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="biodanza">Biodanza</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="centro">Centro</SelectItem>
                  <SelectItem value="roma">Roma Norte</SelectItem>
                  <SelectItem value="condesa">Condesa</SelectItem>
                  <SelectItem value="coyoacan">Coyoacán</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Precio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-500">$0 - $500</SelectItem>
                  <SelectItem value="500-800">$500 - $800</SelectItem>
                  <SelectItem value="800+">$800+</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Disponibilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="tomorrow">Mañana</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Más filtros
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
                      <AvatarImage src={professional.image || "/placeholder.svg"} alt={professional.name} />
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
                            {professional.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {professional.rating} ({professional.reviews} reseñas)
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800 mb-1">{professional.price}</div>
                        <div className="text-sm text-gray-600">por sesión</div>
                        <div className="flex items-center gap-1 text-sm text-green-600 mt-2">
                          <Clock className="h-4 w-4" />
                          {professional.available}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {professional.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                          {tag}
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
          <Button variant="outline" size="lg">
            Cargar más resultados
          </Button>
        </div>
      </div>
    </div>
  )
}
