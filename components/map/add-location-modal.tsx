"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "next-auth/react"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export function AddLocationModal({ onLocationAdded }: { onLocationAdded?: () => void }) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    address: "",
    price: "",
    lat: "",
    lng: "",
    type: "individual",
    avatar: "/placeholder.svg"
  })

  // Autofill coords by getting current location
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData({
          ...formData,
          lat: pos.coords.latitude.toString(),
          lng: pos.coords.longitude.toString()
        })
      })
    } else {
      alert("La geolocalización no está soportada por este navegador.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      setError("Debes iniciar sesión para agregar lugares.")
      return
    }

    setLoading(true)
    setError("")

    try {
      // 1. Validar los datos
      if (!formData.name || !formData.address || !formData.lat || !formData.lng) {
        throw new Error("Por favor llena todos los campos obligatorios y coordenadas.")
      }

      // 2. Insertar en la BD
      const { data, error: insertError } = await supabase
        .from('map_locations')
        .insert([{
            name: formData.name,
            specialty: formData.specialty,
            address: formData.address,
            price: formData.price || "$0",
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng),
            type: formData.type,
            avatar: formData.avatar,
            // En Supabase, guardamos el email si quieremos hacer un constraint, 
            // pero el "creador" lo vinculamos por seguridad o un join si hubiéramos pasado sessionUser id.
        }])
        .select()

      if (insertError) {
        throw new Error("Error interno al agregar a la base de datos: " + insertError.message)
      }

      // 3. Exito
      setOpen(false)
      if (onLocationAdded) {
        onLocationAdded() // Llamada a refrescar el mapa
      }
      setFormData({
        name: "", specialty: "", address: "", price: "", lat: "", lng: "", type: "individual", avatar: "/placeholder.svg"
      })

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Si no está logeado, no se muestra o muestra un tooltip. Aquí ocultamos el botón.
  if (!session) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 font-medium">
          <Plus className="mr-2 h-4 w-4" />
          Añadir Lugar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Profesional al Mapa</DialogTitle>
          <DialogDescription>
            Agrega terapeutas, profesores o centros que conozcas para enriquecer la comunidad.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Especialista o Centro</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ej. Javier Mujica" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="specialty">Especialidad Principal</Label>
              <Input id="specialty" value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} placeholder="Ej. Biodanza" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de Espacio</Label>
              <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Consultorio/Individual</SelectItem>
                  <SelectItem value="group">Clases/Grupal</SelectItem>
                  <SelectItem value="center">Centro Holístico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Dirección Pública (Opcional si es Secreto)</Label>
              <Input id="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Ej. Calle Falsa 123, Santiago" required />
            </div>

            <div className="grid grid-cols-2 gap-4 border p-3 rounded bg-gray-50">
               <div className="col-span-2 flex items-center justify-between">
                 <Label className="text-gray-600">Coordenadas Exactas</Label>
                 <Button type="button" variant="outline" size="sm" onClick={detectLocation} className="text-xs">
                   <MapPin className="mr-2 h-3 w-3" /> Capturar mi GPS actual
                 </Button>
               </div>
               <div className="grid gap-2">
                <Label htmlFor="lat" className="text-xs">Latitud</Label>
                <Input id="lat" value={formData.lat} onChange={(e) => setFormData({...formData, lat: e.target.value})} placeholder="-33.456" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lng" className="text-xs">Longitud</Label>
                <Input id="lng" value={formData.lng} onChange={(e) => setFormData({...formData, lng: e.target.value})} placeholder="-70.648" required />
              </div>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Lugar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
