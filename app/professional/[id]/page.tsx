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

export default function ProfessionalProfile() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/search" className="flex items-center space-x-2">
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src="/images/therapy-session.jpg" alt="Dra. María González" />
                      <AvatarFallback>MG</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dra. María González</h1>
                        <p className="text-xl text-green-600 font-medium mb-3">Terapia Psicológica</p>
                        <div className="flex items-center gap-4 text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            Centro, CDMX
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            4.9 (127 reseñas)
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            500+ pacientes
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
                      <Badge className="bg-green-100 text-green-700">Ansiedad</Badge>
                      <Badge className="bg-blue-100 text-blue-700">Depresión</Badge>
                      <Badge className="bg-purple-100 text-purple-700">Terapia de Pareja</Badge>
                      <Badge className="bg-orange-100 text-orange-700">Trauma</Badge>
                    </div>

                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <Clock className="h-4 w-4" />
                      Disponible hoy
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
                  Soy psicóloga clínica con más de 10 años de experiencia ayudando a personas a superar desafíos
                  emocionales y mentales. Mi enfoque se basa en la terapia cognitivo-conductual y técnicas de
                  mindfulness, adaptándome siempre a las necesidades específicas de cada paciente.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Creo firmemente en crear un espacio seguro y sin juicios donde mis pacientes puedan explorar sus
                  emociones y desarrollar herramientas para una vida más plena y equilibrada.
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
                      <h4 className="font-medium text-gray-800">Licenciatura en Psicología</h4>
                      <p className="text-sm text-gray-600">Universidad Nacional Autónoma de México (UNAM)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">Maestría en Terapia Cognitivo-Conductual</h4>
                      <p className="text-sm text-gray-600">Instituto Mexicano de Psicoterapia Cognitiva</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">Certificación en Mindfulness</h4>
                      <p className="text-sm text-gray-600">Centro Mexicano de Mindfulness</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">Cédula Profesional</h4>
                      <p className="text-sm text-gray-600">#12345678 - Secretaría de Educación Pública</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reseñas de Pacientes</CardTitle>
                <CardDescription>127 reseñas • Calificación promedio: 4.9/5</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-l-4 border-green-200 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">• Ana L. • Hace 2 semanas</span>
                    </div>
                    <p className="text-gray-700">
                      "La Dra. González me ayudó enormemente con mi ansiedad. Su enfoque es muy profesional pero también
                      cálido y empático. Recomiendo ampliamente sus servicios."
                    </p>
                  </div>

                  <div className="border-l-4 border-green-200 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">• Carlos M. • Hace 1 mes</span>
                    </div>
                    <p className="text-gray-700">
                      "Excelente profesional. Las sesiones de terapia de pareja con mi esposa han sido transformadoras.
                      Muy agradecido por su ayuda."
                    </p>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    Ver todas las reseñas
                  </Button>
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
                  <span className="text-3xl font-bold text-gray-800">$800</span>
                  <span className="text-gray-600"> / sesión</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Duración:</div>
                  <div className="font-medium">50 minutos</div>
                  <div className="text-gray-600">Modalidad:</div>
                  <div className="font-medium">Presencial/Online</div>
                  <div className="text-gray-600">Idiomas:</div>
                  <div className="font-medium">Español, Inglés</div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Link href="/booking">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      Reservar Cita
                    </Button>
                  </Link>

                  <Link href="/messages">
                    <Button variant="outline" className="w-full bg-transparent">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Enviar Mensaje
                    </Button>
                  </Link>
                </div>

                <div className="text-xs text-gray-500 text-center">Cancela hasta 24 horas antes sin costo</div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Disponibilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Hoy</span>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        2:00 PM
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        4:00 PM
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Mañana</span>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        10:00 AM
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        12:00 PM
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        3:00 PM
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Viernes</span>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        9:00 AM
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        11:00 AM
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="link" className="w-full mt-3 p-0 h-auto text-green-600">
                  Ver calendario completo
                </Button>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ubicación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-600 mt-1" />
                    <div className="text-sm">
                      <p className="font-medium">Consultorio Centro</p>
                      <p className="text-gray-600">Av. Juárez 123, Centro Histórico</p>
                      <p className="text-gray-600">Ciudad de México, CDMX</p>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Mapa interactivo</span>
                  </div>
                  <Button variant="outline" className="w-full text-sm bg-transparent">
                    Ver en mapa completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
