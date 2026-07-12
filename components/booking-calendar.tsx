"use client"

import React, { useState, useEffect } from "react"
import { Calendar, Clock, User, Mail, CreditCard, ChevronRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"

interface BookingCalendarProps {
	colaboradorId: number
	colaboradorNombre: string
	slug: string
}

export default function BookingCalendar({ colaboradorId, colaboradorNombre, slug }: BookingCalendarProps) {
	const [selectedDate, setSelectedDate] = useState<string>("")
	const [availableSlots, setAvailableSlots] = useState<string[]>([])
	const [selectedSlot, setSelectedSlot] = useState<string>("")
	const [loadingSlots, setLoadingSlots] = useState<boolean>(false)
	const [error, setError] = useState<string>("")

	// Formulario del cliente
	const [nombre, setNombre] = useState<string>("")
	const [email, setEmail] = useState<string>("")
	const [gateway, setGateway] = useState<string>("mercadopago")
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [bookingSuccess, setBookingSuccess] = useState<any>(null)

	// Calcular fechas de los próximos 7 días para agendar
	const getNextDays = () => {
		const days = []
		const today = new Date()
		for (let i = 1; i <= 10; i++) {
			const nextDay = new Date(today)
			nextDay.setDate(today.getDate() + i)
			// Excluir domingos
			if (nextDay.getDay() !== 0) {
				days.push(nextDay)
			}
		}
		return days
	}

	const daysToBook = getNextDays()

	// Cargar slots disponibles cuando cambia la fecha
	useEffect(() => {
		if (!selectedDate) return

		const fetchAvailability = async () => {
			setLoadingSlots(true)
			setError("")
			setSelectedSlot("")
			try {
				const response = await fetch(`http://localhost:8080/api/v1/bookings/availability?colaborador_id=${colaboradorId}&fecha=${selectedDate}`)
				if (!response.ok) {
					throw new Error("No se pudo obtener la disponibilidad de la agenda.")
				}
				const data = await response.json()
				setAvailableSlots(data.available_slots || [])
			} catch (err: any) {
				setError(err.message || "Error de conexión con el servidor.")
			} finally {
				setLoadingSlots(false)
			}
		}

		fetchAvailability()
	}, [selectedDate, colaboradorId])

	const handleBookingSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!selectedDate || !selectedSlot || !nombre || !email || !gateway) {
			setError("Por favor completa todos los campos requeridos.")
			return
		}

		setSubmitting(true)
		setError("")

		try {
			const response = await fetch("http://localhost:8080/api/v1/bookings/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					colaborador_id: colaboradorId,
					slug: slug,
					fecha: selectedDate,
					hora: selectedSlot,
					cliente_nombre: nombre,
					cliente_email: email,
					gateway: gateway,
					service_price: 35.00, // USD 35
				}),
			})

			if (!response.ok) {
				const errData = await response.json()
				throw new Error(errData.error || "Ocurrió un error al crear la reserva.")
			}

			const data = await response.json()
			setBookingSuccess(data)

			// Redireccionar al cliente a la pasarela de pago
			if (data.redirect_url) {
				setTimeout(() => {
					window.location.href = data.redirect_url
				}, 1500)
			}
		} catch (err: any) {
			setError(err.message || "Ocurrió un error al procesar tu solicitud.")
			setSubmitting(false)
		}
	}

	const formatDateDisplay = (dateStr: string) => {
		const parts = dateStr.split("-")
		const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
		return date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })
	}

	return (
		<div className="bg-[#FAF8F5] border border-[#EBE6DD] rounded-2xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
			<div className="flex items-center gap-3 mb-6">
				<div className="bg-[#EAE4D9] p-3 rounded-xl text-[#6B5E4C]">
					<Calendar className="w-6 h-6" />
				</div>
				<div>
					<h3 className="text-xl font-medium text-[#4A3F31] font-serif">Reserva tu Sesión de Calma</h3>
					<p className="text-sm text-[#8A7D6E]">Agenda una cita presencial con {colaboradorNombre}</p>
				</div>
			</div>

			{bookingSuccess ? (
				<div className="text-center py-8">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] mb-4">
						<CheckCircle2 className="w-10 h-10 animate-bounce" />
					</div>
					<h4 className="text-lg font-medium text-[#2E7D32] mb-2 font-serif">¡Reserva bloqueada con éxito!</h4>
					<p className="text-sm text-[#5C5549] max-w-md mx-auto mb-6">
						Estamos redirigiéndote de forma segura a la pasarela de pago ({gateway.toUpperCase()}) para finalizar tu reserva de $35.00 USD.
					</p>
					<div className="flex justify-center items-center gap-2 text-xs text-[#8A7D6E]">
						<Sparkles className="w-4 h-4 animate-pulse text-amber-500" />
						<span>Preparando portal de pago...</span>
					</div>
				</div>
			) : (
				<form onSubmit={handleBookingSubmit} className="space-y-6">
					{error && (
						<div className="bg-[#FDEDEC] text-[#C0392B] p-4 rounded-xl flex items-start gap-3 border border-[#FADBD8]">
							<AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
							<span className="text-sm">{error}</span>
						</div>
					)}

					{/* 1. Selección de Fecha */}
					<div>
						<label className="block text-sm font-medium text-[#5C5549] mb-3">1. Selecciona un día disponible</label>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
							{daysToBook.map((day) => {
								const value = day.toISOString().split("T")[0]
								const label = day.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })
								const isSelected = selectedDate === value
								return (
									<button
										key={value}
										type="button"
										onClick={() => setSelectedDate(value)}
										className={`py-3 px-4 rounded-xl border text-sm transition-all text-center flex flex-col items-center justify-center ${
											isSelected
												? "bg-[#6B5E4C] border-[#6B5E4C] text-[#FAF8F5] shadow-sm font-medium scale-[1.02]"
												: "bg-white border-[#E6DFD5] text-[#5C5549] hover:bg-[#F3ECE0] hover:border-[#D2C4B1]"
										}`}
									>
										<span className="capitalize font-medium">{label.split(" ")[0]}</span>
										<span className="text-lg font-serif mt-0.5">{label.split(" ")[1]} {label.split(" ")[2]}</span>
									</button>
								)
							})}
						</div>
					</div>

					{/* 2. Selección de Hora */}
					{selectedDate && (
						<div>
							<label className="block text-sm font-medium text-[#5C5549] mb-3">
								2. Selecciona un horario para el {formatDateDisplay(selectedDate)}
							</label>

							{loadingSlots ? (
								<div className="py-6 flex items-center justify-center gap-2 text-sm text-[#8A7D6E]">
									<Clock className="w-4 h-4 animate-spin" />
									<span>Consultando disponibilidad de agenda...</span>
								</div>
							) : availableSlots.length === 0 ? (
								<div className="bg-[#FAF2E8] text-[#A0522D] p-4 rounded-xl text-center text-sm border border-[#F4E3D0]">
									No hay horarios disponibles para este día. Intenta seleccionar otra fecha.
								</div>
							) : (
								<div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
									{availableSlots.map((slot) => {
										const isSelected = selectedSlot === slot
										return (
											<button
												key={slot}
												type="button"
												onClick={() => setSelectedSlot(slot)}
												className={`py-2 px-3 rounded-lg border text-sm font-serif transition-all text-center flex items-center justify-center gap-1.5 ${
													isSelected
														? "bg-[#6B5E4C] border-[#6B5E4C] text-[#FAF8F5] shadow-sm font-medium"
														: "bg-white border-[#E6DFD5] text-[#5C5549] hover:bg-[#F3ECE0] hover:border-[#D2C4B1]"
												}`}
											>
												<Clock className="w-3.5 h-3.5" />
												{slot}
											</button>
										)
									})}
								</div>
							)}
						</div>
					)}

					{/* 3. Datos del Cliente */}
					{selectedSlot && (
						<div className="space-y-4 pt-4 border-t border-[#EBE6DD] animate-fadeIn">
							<h4 className="text-sm font-medium text-[#5C5549] mb-1">3. Tus Datos e Información de Contacto</h4>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs text-[#8A7D6E] mb-1 font-medium">Nombre Completo</label>
									<div className="relative">
										<span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8A7D6E]">
											<User className="w-4 h-4" />
										</span>
										<input
											type="text"
											required
											value={nombre}
											onChange={(e) => setNombre(e.target.value)}
											placeholder="Ej. Sofía Valenzuela"
											className="block w-full pl-10 pr-3 py-2.5 bg-white border border-[#E6DFD5] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#6B5E4C] focus:border-[#6B5E4C] text-[#2C2C2C]"
										/>
									</div>
								</div>

								<div>
									<label className="block text-xs text-[#8A7D6E] mb-1 font-medium">Correo Electrónico</label>
									<div className="relative">
										<span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8A7D6E]">
											<Mail className="w-4 h-4" />
										</span>
										<input
											type="email"
											required
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="ejemplo@correo.com"
											className="block w-full pl-10 pr-3 py-2.5 bg-white border border-[#E6DFD5] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#6B5E4C] focus:border-[#6B5E4C] text-[#2C2C2C]"
										/>
									</div>
								</div>
							</div>

							{/* Pasarelas de Pago */}
							<div className="pt-2">
								<label className="block text-xs text-[#8A7D6E] mb-2 font-medium">Método de Pago</label>
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
									{[
										{ id: "mercadopago", label: "Mercado Pago", logo: "💳" },
										{ id: "webpay", label: "Webpay Plus", logo: "🇨🇱" },
										{ id: "flow", label: "Flow Red", logo: "🌐" },
										{ id: "transferencia", label: "Transferencia", logo: "🏦" },
									].map((opt) => {
										const isSelected = gateway === opt.id
										return (
											<button
												key={opt.id}
												type="button"
												onClick={() => setGateway(opt.id)}
												className={`py-2 px-3 rounded-xl border text-xs text-center flex flex-col items-center justify-center gap-1 transition-all ${
													isSelected
														? "bg-white border-[#6B5E4C] ring-2 ring-[#6B5E4C] text-[#6B5E4C] font-semibold"
														: "bg-white border-[#E6DFD5] text-[#5C5549] hover:bg-[#F3ECE0] hover:border-[#D2C4B1]"
												}`}
											>
												<span className="text-base">{opt.logo}</span>
												<span>{opt.label}</span>
											</button>
										)
									})}
								</div>
							</div>

							<button
								type="submit"
								disabled={submitting}
								className={`w-full mt-4 bg-[#6B5E4C] hover:bg-[#534737] text-white py-3 px-6 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 ${
									submitting ? "opacity-75 cursor-not-allowed" : ""
								}`}
							>
								{submitting ? "Procesando Reserva..." : `Reservar Sesión por $35.00 USD`}
								{!submitting && <ChevronRight className="w-4 h-4" />}
							</button>

							<p className="text-[11px] text-center text-[#8A7D6E] mt-2">
								* Sesión presencial de 60 min. Al pagar, se bloqueará la hora y recibirás un correo confirmando tu sesión.
							</p>
						</div>
					)}
				</form>
			)}
		</div>
	)
}
