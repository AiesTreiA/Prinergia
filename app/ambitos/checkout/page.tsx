"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, Sparkles, Building, KeyRound, User, Mail, CreditCard, ChevronRight } from "lucide-react"

interface NodeData {
	nombre_espacio: string
	slug: string
	user: {
		nombre: string
		email: string
		banco_nombre: string
		banco_tipo: string
		banco_nro: string
		banco_rut: string
	}
}

interface OrderData {
	id: number
	total: number
	estado: string
	pasarela: string
}

function CheckoutCallbackContent() {
	const searchParams = useSearchParams()
	const status = searchParams.get("status")
	const orderIdStr = searchParams.get("order_id")
	const gateway = searchParams.get("gateway")
	const token = searchParams.get("token") || searchParams.get("token_ws") || searchParams.get("pref_id")
	const slug = searchParams.get("slug") // Para cargar datos de transferencia

	const [order, setOrder] = useState<OrderData | null>(null)
	const [node, setNode] = useState<NodeData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	useEffect(() => {
		if (orderIdStr) {
			verifyPaymentState()
		} else {
			setLoading(false)
		}

		if (status === "transferencia" && slug) {
			fetchCollaboratorBankDetails()
		}
	}, [status, orderIdStr, gateway, token, slug])

	const verifyPaymentState = async () => {
		try {
			// Consultar endpoint de verificación en Go
			const res = await fetch(`http://localhost:8080/api/v1/payments/verify?order_id=${orderIdStr}&gateway=${gateway || ""}&token=${token || ""}`)
			if (res.ok) {
				const data = await res.json()
				setOrder(data)
			}
		} catch (err) {
			console.error("Error verificando pago en backend Go", err)
			// Simulación local si está desconectado
			setOrder({
				id: parseInt(orderIdStr || "0"),
				total: 35.00,
				estado: status === "success" ? "paid" : "pending",
				pasarela: gateway || "mercadopago"
			})
		} finally {
			if (status !== "transferencia") {
				setLoading(false)
			}
		}
	}

	const fetchCollaboratorBankDetails = async () => {
		try {
			const res = await fetch(`http://localhost:8080/api/v1/nodes/${slug}`)
			if (res.ok) {
				const data = await res.json()
				setNode(data)
			}
		} catch (err) {
			console.error("Error al cargar datos bancarios del colaborador", err)
			// Datos simulados en caso de falla de red
			setNode({
				nombre_espacio: "Espacio Tierra y Calma",
				slug: slug || "tierra-y-calma",
				user: {
					nombre: "Valentina Solar",
					email: "valentina@tierra.cl",
					banco_nombre: "Banco de Chile",
					banco_tipo: "Cuenta Corriente",
					banco_nro: "23910381029",
					banco_rut: "18.231.542-K"
				}
			})
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center text-[#8A7D6E]">
				<div className="w-8 h-8 border-4 border-[#6B5E4C] border-t-transparent rounded-full animate-spin mb-4"></div>
				<p className="font-serif text-sm">Verificando estado de la transacción...</p>
			</div>
		)
	}

	// 1. Caso de Pago Exitoso (Tarjeta / Flow / Webpay / MP)
	if (status === "success" || (order && order.estado === "paid")) {
		return (
			<div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-4">
				<div className="bg-white border border-[#EBE6DD] rounded-2xl p-8 max-w-md w-full shadow-sm text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] mb-6">
						<CheckCircle2 className="w-10 h-10 animate-pulse" />
					</div>
					<span className="text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
						Pago Confirmado
					</span>
					<h2 className="text-2xl font-serif text-[#4A3F31] font-medium mb-3">¡Gracias por tu compra!</h2>
					<p className="text-sm text-[#8A7D6E] font-light leading-relaxed mb-6">
						Tu transacción ha sido procesada con éxito. Hemos enviado un correo con la confirmación de tu compra
						tanto a ti como al colaborador de este nodo.
					</p>

					{order && (
						<div className="bg-[#FAF8F5] border border-[#FAF6F0] p-4 rounded-xl text-left text-xs space-y-2 mb-6 text-[#5C5549]">
							<p><strong>Orden de Compra:</strong> #{order.id}</p>
							<p><strong>Total Pagado:</strong> ${order.total.toFixed(2)} USD</p>
							<p><strong>Pasarela Utilizada:</strong> {order.pasarela.toUpperCase()}</p>
							<p><strong>Estado:</strong> Pagada / Aprobada</p>
						</div>
					)}

					<Link
						href="/ambitos"
						className="flex items-center justify-center gap-2 bg-[#6B5E4C] hover:bg-[#534737] text-white py-3 px-6 rounded-xl text-sm font-semibold transition-all shadow-sm"
					>
						<span>Volver a Ámbitos</span>
						<ArrowRight className="w-4 h-4" />
					</Link>
				</div>
			</div>
		)
	}

	// 2. Caso de Transferencia Bancaria Manual
	if (status === "transferencia" && node) {
		return (
			<div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-4 py-12">
				<div className="bg-white border border-[#EBE6DD] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-sm">
					<div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#FAF6F0]">
						<div className="bg-[#FAF6F0] p-3 rounded-xl text-[#6B5E4C]">
							<Building className="w-6 h-6" />
						</div>
						<div>
							<span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
								Orden Pendiente
							</span>
							<h2 className="text-xl font-serif text-[#4A3F31] font-medium mt-1">Datos para Transferencia</h2>
						</div>
					</div>

					<p className="text-xs text-[#8A7D6E] font-light leading-relaxed mb-6">
						Has seleccionado pago manual. Para activar tu reserva o validar el despacho de tus productos en el espacio <strong>{node.nombre_espacio}</strong>, realiza una transferencia bancaria electrónica a los siguientes datos directos del colaborador:
					</p>

					<div className="bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl p-5 space-y-3 text-xs mb-6">
						<div className="flex justify-between border-b border-[#FAF6F0] pb-2 text-[#5C5549]">
							<span className="font-medium">Destinatario:</span>
							<span className="font-semibold text-[#4A3F31]">{node.user.nombre}</span>
						</div>
						<div className="flex justify-between border-b border-[#FAF6F0] pb-2 text-[#5C5549]">
							<span className="font-medium">Banco:</span>
							<span className="font-semibold text-[#4A3F31]">{node.user.banco_nombre}</span>
						</div>
						<div className="flex justify-between border-b border-[#FAF6F0] pb-2 text-[#5C5549]">
							<span className="font-medium">Tipo de Cuenta:</span>
							<span className="font-semibold text-[#4A3F31]">{node.user.banco_tipo}</span>
						</div>
						<div className="flex justify-between border-b border-[#FAF6F0] pb-2 text-[#5C5549]">
							<span className="font-medium">Número de Cuenta:</span>
							<span className="font-semibold text-[#4A3F31]">{node.user.banco_nro}</span>
						</div>
						<div className="flex justify-between border-b border-[#FAF6F0] pb-2 text-[#5C5549]">
							<span className="font-medium">RUT Titular:</span>
							<span className="font-semibold text-[#4A3F31]">{node.user.banco_rut}</span>
						</div>
						<div className="flex justify-between text-[#5C5549]">
							<span className="font-medium">Correo de Respaldo:</span>
							<span className="font-semibold text-[#4A3F31]">{node.user.email}</span>
						</div>
					</div>

					<div className="border-l-2 border-amber-500 bg-amber-50/50 p-4 rounded-r-xl text-xs text-amber-800 space-y-1 mb-6">
						<p className="font-semibold flex items-center gap-1">
							<KeyRound className="w-3.5 h-3.5" /> Pasos Importantes:
						</p>
						<ol className="list-decimal pl-4 space-y-1 mt-1 font-light">
							<li>Transfiere el monto equivalente en base al total de tu orden.</li>
							<li>Envía el comprobante de transferencia al correo <strong>{node.user.email}</strong>.</li>
							<li>El colaborador verificará los fondos en su cuenta y activará tu pedido manualmente en la base nodal de Ámbitos, gatillando tu confirmación.</li>
						</ol>
					</div>

					<Link
						href={`/ambitos/n/${node.slug}`}
						className="flex items-center justify-center gap-2 bg-[#6B5E4C] hover:bg-[#534737] text-white py-3 px-6 rounded-xl text-sm font-semibold transition-all shadow-sm"
					>
						<span>Volver a la Vitrina</span>
						<ArrowRight className="w-4 h-4" />
					</Link>
				</div>
			</div>
		)
	}

	// 3. Caso de Transacción Fallida
	return (
		<div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-4">
			<div className="bg-white border border-[#EBE6DD] rounded-2xl p-8 max-w-md w-full shadow-sm text-center">
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FDEDEC] text-[#C0392B] mb-6">
					<ShieldAlert className="w-10 h-10 animate-bounce" />
				</div>
				<span className="text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
					Transacción Fallida
				</span>
				<h2 className="text-2xl font-serif text-[#4A3F31] font-medium mb-3">La transacción no pudo completarse</h2>
				<p className="text-sm text-[#8A7D6E] font-light leading-relaxed mb-6">
					Lo sentimos, el pago fue rechazado por la pasarela de pagos, o cancelado por el usuario. Por favor intenta
					realizar la transacción nuevamente con otro método.
				</p>

				<Link
					href="/ambitos"
					className="flex items-center justify-center gap-2 bg-[#6B5E4C] hover:bg-[#534737] text-white py-3 px-6 rounded-xl text-sm font-semibold transition-all shadow-sm"
				>
					<span>Volver a Intentar</span>
					<ArrowRight className="w-4 h-4" />
				</Link>
			</div>
		</div>
	)
}

export default function CheckoutCallback() {
	return (
		<Suspense fallback={
			<div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
				<div className="h-8 w-8 border-4 border-[#6B5E4C] border-t-transparent rounded-full animate-spin" />
			</div>
		}>
			<CheckoutCallbackContent />
		</Suspense>
	)
}
