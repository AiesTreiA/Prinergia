import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  MapPin,
  Clock,
  Calendar,
  MessageCircle,
  Heart,
  ArrowLeft,
  Leaf,
  Award,
  Users,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { LoginButton } from "@/components/auth/login-button"
import { notFound } from "next/navigation"

// Datos simulados (los mismos que en la búsqueda)
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
    about: "Soy psicóloga clínica con más de 10 años de experiencia ayudando a personas a superar desafíos emocionales y mentales. Mi enfoque se basa en la terapia cognitivo-conductual y técnicas de mindfulness, adaptándome siempre a las necesidades específicas de cada paciente."
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
    about: "Como Coach de Vida, mi misión es acompañarte en el descubrimiento de tu verdadero potencial. Trabajo con líderes y emprendedores para desbloquear barreras mentales y construir planes de acción efectivos y duraderos."
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
    about: "Profesora certificada de Yoga con 5 años de experiencia. Mis clases están diseñadas para conectar cuerpo y mente, enfocándome en la respiración correcta y en lograr posturas saludables adaptadas al nivel de cada practicante."
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
    about: "Facilitador de Biodanza de la escuela SRT. Creo firmemente que el movimiento libre y la música son medicinas naturales para el desarrollo personal, sanación de vínculos y expresión de las emociones profundas."
  },
]

export default function ProfessionalProfile({ params }: { params: { id: string } }) {
  const profileId = parseInt(params.id)
  const professional = professionals.find((p) => p.id === profileId)

  // Si no encuentra el ID (por ejemplo un ID que no existe), arroja un error 404
  if (!professional) {
    notFound()
  }

  // Obtener las iniciales correctas
  const initials = professional.name.split(" ").map((n) => n[0]).join("").substring(0, 2)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/search" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600 font-medium">Volver</span>
            </Link>
          </div>
          <LoginButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Avatar className="w-32 h-32 text-2xl">
                      <AvatarImage src={professional.image} alt={professional.name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{professional.name}</h1>
                        <p className="text-xl text-green-600 font-medium mb-3">{professional.specialty}</p>
                        <div className="flex items-center gap-4 text-gray-600 mb-4">
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

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4 mr-2" />
                          Guardar
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                       {professional.tags.map((tag, i) => (
                           <Badge key={i} className="bg-green-100 text-green-700 hover:bg-green-200">{tag}</Badge>
                       ))}
                    </div>

                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <Clock className="h-4 w-4" />
                      {professional.available}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>Acerca de mí</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {professional.about}
                </p>
              </CardContent>
            </Card>

            {/* Credentials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  Formación y Certificaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">Cursos de formación</h4>
                      <p className="text-sm text-gray-600">Especialización en {professional.specialty}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-center">Reservar Sesión</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold text-gray-800">{professional.price}</span>
                  <span className="text-gray-600"> / sesión</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Duración:</div>
                  <div className="font-medium">50 minutos</div>
                  <div className="text-gray-600">Modalidad:</div>
                  <div className="font-medium">Presencial/Online</div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Link href="/booking">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <Calendar className="h-4 w-4 mr-2" />
                      Reservar Cita
                    </Button>
                  </Link>

                  <Link href="/messages">
                    <Button variant="outline" className="w-full bg-transparent hover:bg-gray-50">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Enviar Mensaje
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
