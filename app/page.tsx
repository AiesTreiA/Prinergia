import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, MapPin, MessageCircle, Calendar, Users, Leaf } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">Prinergia</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/search" className="text-gray-600 hover:text-green-600 transition-colors">
              Buscar Profesionales
            </Link>
            <Link href="/map" className="text-gray-600 hover:text-green-600 transition-colors">
              Mapa
            </Link>
            <Link href="/register" className="text-gray-600 hover:text-green-600 transition-colors">
              Soy Profesional
            </Link>
          </nav>
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

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Conecta con tu
            <span className="text-green-600 block">Bienestar Interior</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Encuentra terapeutas, coaches, profesores de yoga y facilitadores de biodanza cerca de ti. Tu camino hacia
            el equilibrio emocional y corporal comienza aquí.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-12">
            <Input placeholder="¿Qué tipo de terapia buscas?" className="flex-1" />
            <Button className="bg-green-600 hover:bg-green-700 px-8">Buscar</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-2 shadow-md">
                <Heart className="h-8 w-8 text-pink-500" />
              </div>
              <span className="text-sm text-gray-600">Terapia</span>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-2 shadow-md">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <span className="text-sm text-gray-600">Coaching</span>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-2 shadow-md">
                <Leaf className="h-8 w-8 text-green-500" />
              </div>
              <span className="text-sm text-gray-600">Yoga</span>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-2 shadow-md">
                <MessageCircle className="h-8 w-8 text-purple-500" />
              </div>
              <span className="text-sm text-gray-600">Biodanza</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">¿Cómo funciona Prinergia?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Encuentra</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  Busca profesionales cerca de ti usando nuestro mapa interactivo y filtros personalizados por
                  especialidad y disponibilidad.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-800">Reserva</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  Agenda tu sesión de forma sencilla viendo la disponibilidad en tiempo real y confirmando tu cita al
                  instante.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-purple-800">Conecta</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  Mantén comunicación directa con tu profesional a través de nuestro sistema de mensajería seguro y
                  privado.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">¿Eres un profesional del bienestar?</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad y conecta con personas que buscan mejorar su bienestar emocional y corporal.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
              Crear Perfil Profesional
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold">Prinergia</span>
              </div>
              <p className="text-gray-400">
                Conectando profesionales del bienestar con quienes buscan equilibrio emocional y corporal.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Para Usuarios</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/search" className="hover:text-white">
                    Buscar Profesionales
                  </Link>
                </li>
                <li>
                  <Link href="/map" className="hover:text-white">
                    Mapa Interactivo
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Cómo Funciona
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Para Profesionales</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/register" className="hover:text-white">
                    Crear Perfil
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Gestionar Citas
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Recursos
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Centro de Ayuda
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Prinergia. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
