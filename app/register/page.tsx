"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Leaf, Upload, Plus, X } from "lucide-react"
import Link from "next/link"
import { LoginButton } from "@/components/auth/login-button"
import { signIn } from "next-auth/react"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [specialties, setSpecialties] = useState<string[]>([])
  const [availableTags] = useState([
    "Ansiedad",
    "Depresión",
    "Terapia de Pareja",
    "Trauma",
    "Autoestima",
    "Desarrollo Personal",
    "Liderazgo",
    "Metas",
    "Hatha Yoga",
    "Vinyasa",
    "Meditación",
    "Principiantes",
    "Expresión Corporal",
    "Grupos",
    "Mindfulness",
  ])

  const addSpecialty = (specialty: string) => {
    if (!specialties.includes(specialty)) {
      setSpecialties([...specialties, specialty])
    }
  }

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((s) => s !== specialty))
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
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-12 h-0.5 mx-2 ${step > stepNumber ? "bg-green-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Cuéntanos sobre ti y tu experiencia profesional</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" placeholder="Tu nombre" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellidos</Label>
                    <Input id="lastName" placeholder="Tus apellidos" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input 
                     id="email" 
                     type="email" 
                     placeholder="tu@email.com" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="+52 55 1234 5678" />
                </div>

                <div>
                  <Label htmlFor="profession">Profesión Principal</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu profesión" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="psicologo">Psicólogo/a</SelectItem>
                      <SelectItem value="coach">Coach de Vida</SelectItem>
                      <SelectItem value="yoga">Profesor/a de Yoga</SelectItem>
                      <SelectItem value="biodanza">Facilitador/a de Biodanza</SelectItem>
                      <SelectItem value="terapeuta">Terapeuta Corporal</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experience">Años de Experiencia</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu experiencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1-2 años</SelectItem>
                      <SelectItem value="3-5">3-5 años</SelectItem>
                      <SelectItem value="6-10">6-10 años</SelectItem>
                      <SelectItem value="10+">Más de 10 años</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bio">Descripción Profesional</Label>
                  <Textarea
                    id="bio"
                    placeholder="Describe tu enfoque terapéutico, experiencia y lo que te hace único como profesional..."
                    className="min-h-24"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Especialidades y Servicios</CardTitle>
                <CardDescription>Define tus áreas de especialización y los servicios que ofreces</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Especialidades y Técnicas</Label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={specialties.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          specialties.includes(tag) ? "bg-green-600 hover:bg-green-700" : "hover:bg-gray-100"
                        }`}
                        onClick={() => (specialties.includes(tag) ? removeSpecialty(tag) : addSpecialty(tag))}
                      >
                        {tag}
                        {specialties.includes(tag) && <X className="h-3 w-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Agregar especialidad personalizada" />
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sessionPrice">Precio por Sesión</Label>
                    <Input id="sessionPrice" placeholder="$800" />
                  </div>
                  <div>
                    <Label htmlFor="sessionDuration">Duración (minutos)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Duración" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="50">50 minutos</SelectItem>
                        <SelectItem value="60">60 minutos</SelectItem>
                        <SelectItem value="90">90 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Modalidades de Atención</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="presencial" />
                      <Label htmlFor="presencial">Sesiones Presenciales</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="online" />
                      <Label htmlFor="online">Sesiones Online</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="domicilio" />
                      <Label htmlFor="domicilio">Visitas a Domicilio</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="grupos" />
                      <Label htmlFor="grupos">Sesiones Grupales</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="languages">Idiomas</Label>
                  <Input id="languages" placeholder="Español, Inglés, Francés..." />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Ubicación y Documentos</CardTitle>
                <CardDescription>Completa tu perfil con tu ubicación y documentos profesionales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="address">Dirección del Consultorio</Label>
                  <Input id="address" placeholder="Av. Juárez 123, Centro Histórico, CDMX" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input id="city" placeholder="Ciudad de México" />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Código Postal</Label>
                    <Input id="postalCode" placeholder="06000" />
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Foto de Perfil</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Arrastra tu foto aquí o haz clic para seleccionar</p>
                    <Button variant="outline" size="sm">
                      Seleccionar Archivo
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Documentos Profesionales</Label>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Cédula Profesional</span>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Subir
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">Documento que acredita tu formación profesional</p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Certificaciones</span>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Subir
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">Certificados de cursos, diplomados o especializaciones</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className="text-sm">
                      Acepto los{" "}
                      <Link href="#" className="text-green-600 hover:underline">
                        términos y condiciones
                      </Link>{" "}
                      de Prinergia
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="privacy" />
                    <Label htmlFor="privacy" className="text-sm">
                      Acepto la{" "}
                      <Link href="#" className="text-green-600 hover:underline">
                        política de privacidad
                      </Link>{" "}
                      y el tratamiento de mis datos
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="verification" />
                    <Label htmlFor="verification" className="text-sm">
                      Autorizo la verificación de mis documentos profesionales
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1 || isSubmitting}>
              Anterior
            </Button>
            <Button
              onClick={async () => {
                if (step < 3) {
                  setStep(step + 1)
                } else {
                  setIsSubmitting(true)
                  // TODO: Aquí guardarás los datos del perfil en Supabase.
                  // Y a continuación disparamos el Magic Link (Magic log-in de validación):
                  if (email) {
                    await signIn("email", { email, callbackUrl: "/" })
                  } else {
                    console.error("El email es requerido")
                    setIsSubmitting(false)
                  }
                }
              }}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Procesando..." : (step === 3 ? "Crear Perfil" : "Siguiente")}
            </Button>
          </div>

          {step === 3 && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">¿Qué sigue después del registro?</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Revisaremos tu perfil y documentos (24-48 horas)</li>
                <li>• Te enviaremos un email de confirmación</li>
                <li>• Podrás configurar tu calendario y comenzar a recibir pacientes</li>
                <li>• Nuestro equipo te contactará para una breve orientación</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
