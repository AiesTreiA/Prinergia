"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, CreditCard, ArrowLeft, Leaf, CheckCircle } from "lucide-react"
import Link from "next/link"
import { LoginButton } from "@/components/auth/login-button"

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [sessionType, setSessionType] = useState("")

  const availableTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/professional/1" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-green-800">Prinergia</span>
            </Link>
          </div>
          <LoginButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`w-12 h-0.5 mx-2 ${step > stepNumber ? "bg-green-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Selecciona Fecha y Hora
                    </CardTitle>
                    <CardDescription>Elige el día y horario que mejor se adapte a tu agenda</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Calendar */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Fecha</Label>
                      <div className="grid grid-cols-7 gap-2">
                        {/* Calendar days would go here - simplified for demo */}
                        {Array.from({ length: 14 }, (_, i) => {
                          const date = new Date()
                          date.setDate(date.getDate() + i)
                          const dateStr = date.toLocaleDateString("es-MX", {
                            weekday: "short",
                            day: "numeric",
                          })
                          return (
                            <Button
                              key={i}
                              variant={selectedDate === dateStr ? "default" : "outline"}
                              className={`h-16 flex flex-col ${
                                selectedDate === dateStr ? "bg-green-600 hover:bg-green-700" : ""
                              }`}
                              onClick={() => setSelectedDate(dateStr)}
                            >
                              <span className="text-xs">{dateStr.split(" ")[0]}</span>
                              <span className="text-sm font-bold">{dateStr.split(" ")[1]}</span>
                            </Button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Time Slots */}
                    {selectedDate && (
                      <div>
                        <Label className="text-base font-medium mb-3 block">Hora disponible</Label>
                        <div className="grid grid-cols-4 gap-3">
                          {availableTimes.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              className={selectedTime === time ? "bg-green-600 hover:bg-green-700" : ""}
                              onClick={() => setSelectedTime(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Tipo de Sesión
                    </CardTitle>
                    <CardDescription>Selecciona cómo prefieres tener tu sesión</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={sessionType} onValueChange={setSessionType}>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="presencial" id="presencial" />
                          <div className="flex-1">
                            <Label htmlFor="presencial" className="text-base font-medium cursor-pointer">
                              Sesión Presencial
                            </Label>
                            <p className="text-sm text-gray-600 mt-1">
                              En el consultorio - Av. Juárez 123, Centro Histórico, CDMX
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">$800</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="online" id="online" />
                          <div className="flex-1">
                            <Label htmlFor="online" className="text-base font-medium cursor-pointer">
                              Sesión Online
                            </Label>
                            <p className="text-sm text-gray-600 mt-1">
                              Videollamada segura a través de nuestra plataforma
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">$700</div>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Motivo de la consulta (opcional)</Label>
                      <Textarea
                        placeholder="Describe brevemente lo que te gustaría trabajar en la sesión..."
                        className="min-h-24"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>Completa tus datos para confirmar la reserva</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                      <Input id="email" type="email" placeholder="tu@email.com" />
                    </div>

                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" placeholder="+52 55 1234 5678" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        Acepto los{" "}
                        <Link href="#" className="text-green-600 hover:underline">
                          términos y condiciones
                        </Link>{" "}
                        y la{" "}
                        <Link href="#" className="text-green-600 hover:underline">
                          política de privacidad
                        </Link>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="notifications" />
                      <Label htmlFor="notifications" className="text-sm">
                        Recibir recordatorios por email y SMS
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      Método de Pago
                    </CardTitle>
                    <CardDescription>Selecciona cómo deseas pagar tu sesión</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup defaultValue="card">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 border rounded-lg">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex-1 cursor-pointer">
                            Tarjeta de Crédito/Débito
                          </Label>
                        </div>

                        <div className="ml-6 space-y-4">
                          <div>
                            <Label htmlFor="cardNumber">Número de tarjeta</Label>
                            <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Vencimiento</Label>
                              <Input id="expiry" placeholder="MM/AA" />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input id="cvv" placeholder="123" />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border rounded-lg">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                            PayPal
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border rounded-lg">
                          <RadioGroupItem value="transfer" id="transfer" />
                          <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                            Transferencia Bancaria
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                  Anterior
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={(step === 1 && (!selectedDate || !selectedTime)) || (step === 2 && !sessionType)}
                >
                  {step === 4 ? "Confirmar Reserva" : "Siguiente"}
                </Button>
              </div>
            </div>

            {/* Sidebar - Booking Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumen de Reserva</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Professional Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" />
                      <AvatarFallback>MG</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">Dra. María González</h4>
                      <p className="text-sm text-gray-600">Terapia Psicológica</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {selectedDate && selectedTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha y hora:</span>
                        <span className="font-medium">
                          {selectedDate} - {selectedTime}
                        </span>
                      </div>
                    )}

                    {sessionType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Modalidad:</span>
                        <span className="font-medium">{sessionType === "presencial" ? "Presencial" : "Online"}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600">Duración:</span>
                      <span className="font-medium">50 minutos</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${sessionType === "online" ? "700" : "800"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Cancela hasta 24 horas antes sin costo</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
