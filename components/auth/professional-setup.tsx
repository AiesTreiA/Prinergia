"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Loader2, CheckCircle } from "lucide-react"
import { createProfessional, addProfessionalLocation } from "@/lib/supabase-queries"
import { useMockAuth } from "@/lib/mock-auth"

interface ProfessionalSetupProps {
  onComplete: () => void
}

export function ProfessionalSetup({ onComplete }: ProfessionalSetupProps) {
  const { user } = useMockAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Datos del profesional
  const [professionalData, setProfessionalData] = useState({
    name: user?.name || "",
    specialty: "",
    bio: "",
    experience_years: 1,
    price_per_session: 50000,
    session_duration: 50,
    phone: "",
    languages: ["Español"],
  })

  // Datos de ubicación
  const [locationData, setLocationData] = useState({
    name: "",
    address: "",
    city: "Santiago",
    postal_code: "",
    latitude: -33.4569,
    longitude: -70.6483,
    location_type: "individual" as const,
  })

  const handleProfessionalSubmit = async () => {
    if (!user?.id) {
      setError("Usuario no autenticado")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Crear el profesional
      const professional = await createProfessional(user.id, professionalData)

      // Agregar la ubicación
      await addProfessionalLocation({
        professional_id: professional.id,
        ...locationData,
        is_primary: true,
      })

      setSuccess(true)
      setTimeout(() => {
        onComplete()
      }, 2000)
    } catch (err: any) {
      console.error("Error creating professional:", err)
      setError(err.message || "Error al crear el perfil profesional")
    } finally {
      setLoading(false)
    }
  }

  // Función para obtener coordenadas de una dirección (simulada)
  const getCoordinatesFromAddress = async (address: string) => {
    // En una implementación real, usarías una API de geocodificación
    // Por ahora, devolvemos coordenadas de Santiago
    return {
      latitude: -33.4569 + (Math.random() - 0.5) * 0.1,
      longitude: -70.6483 + (Math.random() - 0.5) * 0.1,
    }
  }

  const handleAddressChange = async (address: string) => {
    setLocationData((prev) => ({ ...prev, address }))

    if (address.length > 10) {
      try {
        const coords = await getCoordinatesFromAddress(address)
        setLocationData((prev) => ({
          ...prev,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }))
      } catch (err) {
        console.warn("Could not geocode address:", err)
      }
    }
  }

  if (success) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">¡Perfil Creado!</h3>
          <p className="text-gray-600 mb-4">
            Tu perfil profesional ha sido creado exitosamente. Tu ubicación ya aparece en el mapa.
          </p>
          <div className="animate-pulse text-sm text-gray-500">Redirigiendo...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Crear Perfil Profesional</h2>
        <p className="text-gray-600">Completa tu información para aparecer en el mapa</p>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Información Profesional</CardTitle>
            <CardDescription>Cuéntanos sobre tu práctica profesional</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre Profesional</Label>
              <Input
                id="name"
                value={professionalData.name}
                onChange={(e) => setProfessionalData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Tu nombre como aparecerá en el mapa"
              />
            </div>

            <div>
              <Label htmlFor="specialty">Especialidad Principal</Label>
              <Select
                value={professionalData.specialty}
                onValueChange={(value) => setProfessionalData((prev) => ({ ...prev, specialty: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Terapia Psicológica">Terapia Psicológica</SelectItem>
                  <SelectItem value="Coach de Vida">Coach de Vida</SelectItem>
                  <SelectItem value="Profesor de Yoga">Profesor de Yoga</SelectItem>
                  <SelectItem value="Facilitador de Biodanza">Facilitador de Biodanza</SelectItem>
                  <SelectItem value="Terapeuta Corporal">Terapeuta Corporal</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bio">Descripción</Label>
              <Textarea
                id="bio"
                value={professionalData.bio}
                onChange={(e) => setProfessionalData((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Describe tu enfoque y experiencia..."
                className="min-h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experience">Años de Experiencia</Label>
                <Input
                  id="experience"
                  type="number"
                  min="1"
                  max="50"
                  value={professionalData.experience_years}
                  onChange={(e) =>
                    setProfessionalData((prev) => ({ ...prev, experience_years: Number.parseInt(e.target.value) || 1 }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="price">Precio por Sesión (CLP)</Label>
                <Input
                  id="price"
                  type="number"
                  min="10000"
                  step="5000"
                  value={professionalData.price_per_session}
                  onChange={(e) =>
                    setProfessionalData((prev) => ({
                      ...prev,
                      price_per_session: Number.parseInt(e.target.value) || 50000,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Teléfono de Contacto</Label>
              <Input
                id="phone"
                value={professionalData.phone}
                onChange={(e) => setProfessionalData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+56 9 1234 5678"
              />
            </div>

            <Button
              onClick={() => setStep(2)}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!professionalData.name || !professionalData.specialty}
            >
              Siguiente: Ubicación
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Ubicación de tu Consulta
            </CardTitle>
            <CardDescription>Esta información aparecerá en el mapa para que te encuentren</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="locationName">Nombre del Lugar</Label>
              <Input
                id="locationName"
                value={locationData.name}
                onChange={(e) => setLocationData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Consulta Centro, Mi Estudio, etc."
              />
            </div>

            <div>
              <Label htmlFor="address">Dirección Completa</Label>
              <Input
                id="address"
                value={locationData.address}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder="Calle, número, comuna, ciudad"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ciudad</Label>
                <Select
                  value={locationData.city}
                  onValueChange={(value) => setLocationData((prev) => ({ ...prev, city: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Santiago">Santiago</SelectItem>
                    <SelectItem value="Valparaíso">Valparaíso</SelectItem>
                    <SelectItem value="Concepción">Concepción</SelectItem>
                    <SelectItem value="La Serena">La Serena</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="postalCode">Código Postal</Label>
                <Input
                  id="postalCode"
                  value={locationData.postal_code}
                  onChange={(e) => setLocationData((prev) => ({ ...prev, postal_code: e.target.value }))}
                  placeholder="7500000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="locationType">Tipo de Atención</Label>
              <Select
                value={locationData.location_type}
                onValueChange={(value: any) => setLocationData((prev) => ({ ...prev, location_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Consultas Individuales</SelectItem>
                  <SelectItem value="group">Grupos y Talleres</SelectItem>
                  <SelectItem value="center">Centro de Bienestar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Coordenadas:</strong> {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
              </p>
              <p className="text-xs text-gray-500">Las coordenadas se calculan automáticamente desde tu dirección</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Anterior
              </Button>
              <Button
                onClick={handleProfessionalSubmit}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={loading || !locationData.name || !locationData.address}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creando...
                  </>
                ) : (
                  "Crear Perfil"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
