"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin, MessageCircle, Calendar, Leaf } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const images = [
    {
      src: "/images/therapy-session.jpg",
      backgroundSize: "cover", // Cambiado a cover para mejor ajuste
      backgroundPosition: "center center", // Centrado perfecto
      containerTransform: "scale(1) rotate(0deg)",
      useGradientOverlay: true,
    },
    {
      src: "/images/biodanza.jpg",
      backgroundSize: "cover",
      backgroundPosition: "center center",
      containerTransform: "scale(1) rotate(0deg)",
      useGradientOverlay: false,
    },
    {
      src: "/images/yoga-beach.jpg",
      backgroundSize: "140% auto",
      backgroundPosition: "center 35%",
      containerTransform: "scale(1) rotate(0deg)", // Cambiado de rotate(-15deg) a rotate(0deg)
      useGradientOverlay: false,
    },
    {
      src: "/images/acro-yoga.jpg",
      backgroundSize: "cover",
      backgroundPosition: "center center",
      containerTransform: "scale(1) rotate(0deg)",
      useGradientOverlay: false,
    },
  ]

  useEffect(() => {
    // Seleccionar imagen inicial aleatoria
    setCurrentImageIndex(Math.floor(Math.random() * images.length))

    const interval = setInterval(() => {
      // Iniciar transición de salida
      setIsTransitioning(true)

      setTimeout(() => {
        // Cambiar imagen después de 0.7s
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)

        setTimeout(() => {
          // Terminar transición de entrada después de otros 0.7s
          setIsTransitioning(false)
        }, 700)
      }, 700)
    }, 5000) // Cambiar cada 5 segundos

    return () => clearInterval(interval)
  }, [])

  const currentImage = images[currentImageIndex]

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
              Demo
            </Button>
            <Link href="/map">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Explorar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Images - Contenedor simplificado */}
        <div className="absolute inset-0 z-0">
          <div
            className={`h-full w-full transition-all duration-700 ease-in-out ${
              isTransitioning ? "opacity-0 scale-110 blur-sm" : "opacity-20 scale-100 blur-0"
            }`}
            style={{
              backgroundImage: `
                ${
                  currentImage.useGradientOverlay
                    ? `
                  radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 70%),
                  radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.08) 0%, transparent 40%),
                  radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
                  linear-gradient(135deg, rgba(168, 85, 247, 0.03) 0%, transparent 50%),
                `
                    : `
                  radial-gradient(circle at 30% 70%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                  linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, transparent 50%),
                `
                }
                url(${currentImage.src})
              `,
              backgroundSize: currentImage.backgroundSize,
              backgroundPosition: currentImage.backgroundPosition,
              backgroundRepeat: "no-repeat",
              transform: currentImage.containerTransform,
              transformOrigin: "center center",
              filter: isTransitioning
                ? "hue-rotate(15deg) brightness(1.1)"
                : currentImage.useGradientOverlay
                  ? "brightness(1.15) contrast(0.95) saturate(1.1)"
                  : "hue-rotate(0deg)",
            }}
          >
            {/* Overlay con patrón de geometría sagrada */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ${
                isTransitioning ? "opacity-30" : currentImage.useGradientOverlay ? "opacity-5" : "opacity-10"
              }`}
              style={{
                backgroundImage: currentImage.useGradientOverlay
                  ? `
                  radial-gradient(circle at 25% 25%, transparent 25%, rgba(34, 197, 94, 0.03) 26%, rgba(34, 197, 94, 0.03) 30%, transparent 31%),
                  radial-gradient(circle at 75% 75%, transparent 25%, rgba(59, 130, 246, 0.03) 26%, rgba(59, 130, 246, 0.03) 30%, transparent 31%),
                  radial-gradient(circle at 50% 50%, transparent 35%, rgba(168, 85, 247, 0.02) 36%, rgba(168, 85, 247, 0.02) 40%, transparent 41%),
                  linear-gradient(45deg, rgba(255, 255, 255, 0.02) 0%, transparent 25%, rgba(255, 255, 255, 0.01) 50%, transparent 75%, rgba(255, 255, 255, 0.02) 100%)
                `
                  : `
                  radial-gradient(circle at 25% 25%, transparent 20%, rgba(34, 197, 94, 0.1) 21%, rgba(34, 197, 94, 0.1) 25%, transparent 26%),
                  radial-gradient(circle at 75% 75%, transparent 20%, rgba(59, 130, 246, 0.1) 21%, rgba(59, 130, 246, 0.1) 25%, transparent 26%),
                  radial-gradient(circle at 50% 50%, transparent 30%, rgba(168, 85, 247, 0.05) 31%, rgba(168, 85, 247, 0.05) 35%, transparent 36%)
                `,
                backgroundSize: currentImage.useGradientOverlay
                  ? "300px 300px, 400px 400px, 250px 250px, 100% 100%"
                  : "200px 200px, 300px 300px, 150px 150px",
                backgroundRepeat: "repeat",
                animation: isTransitioning ? "none" : "sacred-geometry 25s linear infinite",
              }}
            />

            {/* Degradé adicional para suavizar bordes en imagen de terapia */}
            {currentImage.useGradientOverlay && (
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(ellipse 120% 80% at center, transparent 40%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0.2) 100%),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 0%, transparent 20%, transparent 80%, rgba(255, 255, 255, 0.05) 100%),
                    linear-gradient(to right, rgba(255, 255, 255, 0.03) 0%, transparent 15%, transparent 85%, rgba(255, 255, 255, 0.03) 100%)
                  `,
                  opacity: isTransitioning ? 0.3 : 0.6,
                  transition: "opacity 700ms ease-in-out",
                }}
              />
            )}
          </div>
        </div>

        <div className="container mx-auto text-center relative z-10">
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
            <Link href="/search">
              <Button className="bg-green-600 hover:bg-green-700 px-8">Buscar</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <Link href="/search" className="text-center hover:scale-105 transition-transform">
              <div className="bg-white rounded-full p-2 w-16 h-16 mx-auto mb-2 shadow-md overflow-hidden">
                <img
                  src="/images/therapy-session.jpg"
                  alt="Terapia"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-sm text-gray-600">Terapia</span>
            </Link>
            <Link href="/search" className="text-center hover:scale-105 transition-transform">
              <div className="bg-white rounded-full p-2 w-16 h-16 mx-auto mb-2 shadow-md overflow-hidden">
                <img src="/images/biodanza.jpg" alt="Coaching" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-sm text-gray-600">Coaching</span>
            </Link>
            <Link href="/search" className="text-center hover:scale-105 transition-transform">
              <div className="bg-white rounded-full p-2 w-16 h-16 mx-auto mb-2 shadow-md overflow-hidden">
                <img src="/images/yoga-beach.jpg" alt="Yoga" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-sm text-gray-600">Yoga</span>
            </Link>
            <Link href="/search" className="text-center hover:scale-105 transition-transform">
              <div className="bg-white rounded-full p-2 w-16 h-16 mx-auto mb-2 shadow-md overflow-hidden">
                <img src="/images/acro-yoga.jpg" alt="Biodanza" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-sm text-gray-600">Biodanza</span>
            </Link>
          </div>
        </div>

        {/* Indicadores de progreso inspirados en geometría sagrada */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-3">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-700 ${
                  index === currentImageIndex ? "bg-green-600 scale-125 shadow-lg" : "bg-white/50 scale-100"
                } ${isTransitioning && index === currentImageIndex ? "animate-pulse" : ""}`}
                style={{
                  clipPath: index === currentImageIndex ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "circle(50%)",
                }}
              />
            ))}
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

      <style jsx global>{`
        @keyframes sacred-geometry {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.05); }
          50% { transform: rotate(180deg) scale(1); }
          75% { transform: rotate(270deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }
      `}</style>
    </div>
  )
}
