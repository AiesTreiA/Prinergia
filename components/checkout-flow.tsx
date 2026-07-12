"use client"

import React, { useState } from "react"
import {
	ShieldCheck, CreditCard, ArrowRight, ArrowLeft,
	CheckCircle, Mail, X, Copy
} from "lucide-react"

interface CartItem {
	product: { sku: string; nombre: string; precio_venta: number }
	qty: number
}

interface NodeData {
	id: number
	nombre_espacio: string
	slug: string
	user: {
		id: number; nombre: string; email: string
		banco_nombre: string; banco_tipo: string; banco_nro: string; banco_rut: string
	}
}

interface CheckoutFlowProps {
	cart: CartItem[]
	node: NodeData
	getCartTotal: () => number
	onClose: () => void
	onComplete: () => void
}

type Step = "datos" | "pago" | "procesando" | "confirmado"
type Gateway = "mercadopago" | "webpay" | "stripe" | "flow" | "crypto" | "transferencia"

const GATEWAYS = [
	{ id: "mercadopago", name: "Mercado Pago", desc: "Crédito · Débito · QR", icon: "🟡" },
	{ id: "webpay",      name: "Webpay Plus",  desc: "Transbank · Chile",     icon: "🔵" },
	{ id: "stripe",      name: "Stripe",        desc: "Visa · MC · AmEx",     icon: "💳" },
	{ id: "flow",        name: "Flow Online",   desc: "Servipag · Multicaja", icon: "🟠" },
	{ id: "crypto",      name: "Cripto",        desc: "USDT / BTC",           icon: "₿"  },
	{ id: "transferencia", name: "Transferencia", desc: "Banco directo",      icon: "🏦" },
]

// ─── Email Preview ────────────────────────────────────────────────────────────

function EmailPreview({
	nombre, email, orderId, cart, total, node, gateway, onClose
}: {
	nombre: string; email: string; orderId: string
	cart: CartItem[]; total: number; node: NodeData; gateway: string; onClose: () => void
}) {
	const gatewayLabel: Record<string, string> = {
		mercadopago: "Mercado Pago", webpay: "Webpay Plus · Transbank",
		stripe: "Stripe (tarjeta)", flow: "Flow Online",
		crypto: "Cripto (USDT/BTC)", transferencia: "Transferencia Bancaria",
	}

	return (
		<div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-3">
			<div className="bg-[#1A1A1A] w-full max-w-lg max-h-[92vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-[#333]">

				{/* macOS-style toolbar */}
				<div className="bg-[#252525] px-4 py-2.5 flex items-center justify-between border-b border-[#333]">
					<div className="flex items-center gap-1.5">
						<button onClick={onClose} className="w-3 h-3 bg-[#FF5F57] rounded-full hover:brightness-90 transition-all" />
						<div className="w-3 h-3 bg-[#FEBC2E] rounded-full" />
						<div className="w-3 h-3 bg-[#28C840] rounded-full" />
					</div>
					<div className="flex-1 mx-4 bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-1 text-center">
						<span className="text-[10px] text-[#8A8A8A]">📧 Vista previa · {email}</span>
					</div>
					<div className="w-16" />
				</div>

				{/* Email scroll area */}
				<div className="overflow-y-auto flex-1 bg-[#E8E3DC] p-4">
					<div className="max-w-sm mx-auto rounded-2xl overflow-hidden shadow-lg border border-[#D4CFC8]">

						{/* Email header */}
						<div
							className="text-white text-center py-8 px-6"
							style={{ background: "linear-gradient(135deg, #4A3F31 0%, #6B5E4C 100%)" }}
						>
							<p className="text-[10px] tracking-[0.35em] uppercase text-[#C5B79E] mb-2">Tienda Nodal · Ámbitos</p>
							<h1 className="text-2xl font-serif font-medium tracking-wide">Ámbitos</h1>
							<p className="text-xs text-[#C5B79E] mt-1 italic">{node.nombre_espacio}</p>
						</div>

						{/* Email body */}
						<div className="bg-white px-7 py-7">
							{/* Success icon */}
							<div className="text-center mb-6">
								<div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-green-100">
									<CheckCircle className="w-7 h-7 text-green-500" />
								</div>
								<h2 className="text-lg font-serif text-[#4A3F31] font-semibold">¡Tu orden está confirmada!</h2>
								<p className="text-xs text-[#8A7D6E] mt-1 leading-relaxed">
									Hola <strong className="text-[#4A3F31]">{nombre}</strong>, gracias por confiar en Ámbitos.<br />
									Tu pedido fue recibido y está siendo preparado.
								</p>
							</div>

							{/* Order ID */}
							<div className="bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl p-3 text-center mb-5">
								<p className="text-[9px] text-[#8A7D6E] uppercase tracking-wider mb-0.5">Número de orden</p>
								<p className="font-mono text-sm font-bold text-[#6B5E4C]">{orderId}</p>
							</div>

							{/* Products */}
							<div className="mb-5">
								<p className="text-[9px] font-bold text-[#8A7D6E] uppercase tracking-wider mb-2 border-b border-[#FAF6F0] pb-1">
									Detalle del pedido
								</p>
								<div className="space-y-2">
									{cart.map(item => (
										<div key={item.product.sku} className="flex justify-between items-center py-1.5 border-b border-[#FAF6F0]">
											<div>
												<p className="text-xs font-medium text-[#4A3F31]">{item.product.nombre}</p>
												<p className="text-[10px] text-[#8A7D6E]">× {item.qty} unidades</p>
											</div>
											<p className="text-xs font-semibold text-[#4A3F31]">
												${(item.product.precio_venta * item.qty).toFixed(2)}
											</p>
										</div>
									))}
								</div>
								<div className="flex justify-between items-center pt-2.5">
									<span className="text-xs font-bold text-[#4A3F31]">Total pagado</span>
									<span className="text-sm font-serif font-bold text-[#6B5E4C]">${total.toFixed(2)} USD</span>
								</div>
							</div>

							{/* Payment method */}
							<div className="bg-[#FAF8F5] rounded-xl p-3 mb-5 border border-[#EBE6DD]">
								<p className="text-[9px] text-[#8A7D6E] uppercase tracking-wider mb-1">Método de pago</p>
								<p className="text-xs text-[#4A3F31] font-semibold">{gatewayLabel[gateway] ?? gateway}</p>
							</div>

							{/* Collaborator */}
							<div className="bg-[#FAF8F5] rounded-xl p-3 mb-6 border border-[#EBE6DD]">
								<p className="text-[9px] text-[#8A7D6E] uppercase tracking-wider mb-1">Tu colaborador/a</p>
								<p className="text-xs font-semibold text-[#4A3F31]">{node.user.nombre}</p>
								<p className="text-[10px] text-[#8A7D6E]">{node.user.email}</p>
							</div>

							{/* CTA */}
							<div className="text-center">
								<a
									href="#"
									className="inline-block text-white text-xs font-semibold py-3 px-8 rounded-xl"
									style={{ background: "linear-gradient(135deg, #6B5E4C, #4A3F31)" }}
								>
									Ver mi pedido →
								</a>
							</div>

							{/* Divider */}
							<div className="border-t border-[#FAF6F0] mt-6 pt-4 text-center">
								<p className="text-[10px] text-[#8A7D6E]">
									¿Tienes preguntas? Responde a este email o escríbenos a{" "}
									<span className="text-[#6B5E4C] underline">{node.user.email}</span>
								</p>
							</div>
						</div>

						{/* Email footer */}
						<div
							className="text-[#C5B79E] text-center py-5 px-6"
							style={{ background: "#4A3F31" }}
						>
							<p className="text-[10px] mb-0.5">© 2025 Ámbitos · Viviendo despacio</p>
							<p className="text-[10px]">Este correo fue enviado a {email}</p>
							<p className="text-[10px] mt-1 underline cursor-pointer opacity-60">Cancelar suscripción</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

// ─── Main CheckoutFlow Component ─────────────────────────────────────────────

export default function CheckoutFlow({ cart, node, getCartTotal, onClose, onComplete }: CheckoutFlowProps) {
	const [step, setStep]               = useState<Step>("datos")
	const [nombre, setNombre]           = useState("")
	const [email, setEmail]             = useState("")
	const [gateway, setGateway]         = useState<Gateway>("mercadopago")
	const [cardNumber, setCardNumber]   = useState("")
	const [cardExpiry, setCardExpiry]   = useState("")
	const [cardCvv, setCardCvv]         = useState("")
	const [orderId, setOrderId]         = useState("")
	const [showEmail, setShowEmail]     = useState(false)
	const [cryptoCoin, setCryptoCoin]   = useState<"USDT" | "BTC">("USDT")
	const [copied, setCopied]           = useState(false)

	const total = getCartTotal()

	const stepLabels: Record<Step, string> = {
		datos:      "1 / 3 — Tus datos",
		pago:       "2 / 3 — Método de pago",
		procesando: "Procesando...",
		confirmado: "✓ ¡Orden confirmada!",
	}

	const simulatePay = async () => {
		setStep("procesando")
		await new Promise(res => setTimeout(res, 2600))
		setOrderId(`AMB-${Date.now().toString(36).toUpperCase()}`)
		setStep("confirmado")
	}

	const copyText = (text: string) => {
		navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 1800)
	}

	const formatCard   = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()
	const formatExpiry = (v: string) => v.replace(/\D/g, "").slice(0, 4).replace(/^(.{2})/, "$1/")

	const CRYPTO_ADDR = {
		USDT: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
		BTC:  "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
	}

	return (
		<>
			{showEmail && step === "confirmado" && (
				<EmailPreview
					nombre={nombre} email={email} orderId={orderId}
					cart={cart} total={total} node={node} gateway={gateway}
					onClose={() => setShowEmail(false)}
				/>
			)}

			<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
				<div className="bg-[#FDFBF9] border border-[#EBE6DD] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

					{/* Header */}
					<div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE6DD] sticky top-0 bg-[#FDFBF9] z-10">
						<div>
							<h3 className="text-base font-serif text-[#4A3F31] font-semibold">Finalizar Compra</h3>
							<p className="text-[10px] text-[#8A7D6E] mt-0.5">{stepLabels[step]}</p>
						</div>
						<button onClick={onClose} className="p-1.5 rounded-lg text-[#8A7D6E] hover:bg-[#FAF6F0] hover:text-[#4A3F31] transition-all">
							<X className="w-4 h-4" />
						</button>
					</div>

					{/* Progress bar */}
					<div className="h-1 bg-[#EBE6DD] w-full">
						<div
							className="h-full bg-[#6B5E4C] transition-all duration-500 rounded-r-full"
							style={{ width: step === "datos" ? "33%" : step === "pago" ? "66%" : "100%" }}
						/>
					</div>

					<div className="p-6">

						{/* ── STEP 1: Datos ── */}
						{step === "datos" && (
							<div className="space-y-4">
								{/* Cart summary */}
								<div className="bg-[#FAF8F5] rounded-xl p-4 border border-[#EBE6DD]">
									<p className="text-[10px] font-bold text-[#8A7D6E] uppercase tracking-wider mb-2">Resumen del pedido</p>
									{cart.map(item => (
										<div key={item.product.sku} className="flex justify-between text-xs text-[#5C5549] py-0.5">
											<span>{item.product.nombre} <span className="text-[#8A7D6E]">×{item.qty}</span></span>
											<span className="font-medium">${(item.product.precio_venta * item.qty).toFixed(2)}</span>
										</div>
									))}
									<div className="border-t border-[#EBE6DD] pt-2 mt-2 flex justify-between font-semibold text-sm text-[#4A3F31]">
										<span>Total</span>
										<span>${total.toFixed(2)} USD</span>
									</div>
								</div>

								{/* Autofill */}
								<button
									onClick={() => { setNombre("Valentina Solar"); setEmail("test@ambitos.cl") }}
									className="w-full text-[10px] py-1.5 px-3 border border-dashed border-[#6B5E4C] text-[#6B5E4C] rounded-lg hover:bg-[#FAF6F0] transition-all flex items-center justify-center gap-1.5"
								>
									⚡ Rellenar con datos de prueba
								</button>

								<div>
									<label className="block text-[#5C5549] mb-1 text-xs font-semibold">Nombre Completo</label>
									<input
										value={nombre}
										onChange={e => setNombre(e.target.value)}
										placeholder="Ej. Martín Vargas"
										className="w-full px-3 py-2.5 bg-white border border-[#E6DFD5] rounded-xl text-xs text-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#6B5E4C]"
									/>
								</div>

								<div>
									<label className="block text-[#5C5549] mb-1 text-xs font-semibold">Correo Electrónico</label>
									<input
										type="email"
										value={email}
										onChange={e => setEmail(e.target.value)}
										placeholder="ejemplo@correo.com"
										className="w-full px-3 py-2.5 bg-white border border-[#E6DFD5] rounded-xl text-xs text-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#6B5E4C]"
									/>
								</div>

								<button
									onClick={() => { if (nombre && email) setStep("pago") }}
									disabled={!nombre || !email}
									className="w-full bg-[#6B5E4C] hover:bg-[#534737] disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 mt-2"
								>
									Continuar al Pago <ArrowRight className="w-4 h-4" />
								</button>
							</div>
						)}

						{/* ── STEP 2: Pago ── */}
						{step === "pago" && (
							<div className="space-y-4">
								<button
									onClick={() => setStep("datos")}
									className="flex items-center gap-1 text-[11px] text-[#8A7D6E] hover:text-[#4A3F31] transition-all"
								>
									<ArrowLeft className="w-3 h-3" /> Volver a mis datos
								</button>

								{/* Gateway grid */}
								<div>
									<p className="text-xs font-semibold text-[#5C5549] mb-2">Selecciona tu método de pago</p>
									<div className="grid grid-cols-3 gap-2">
										{GATEWAYS.map(opt => (
											<button
												key={opt.id}
												onClick={() => setGateway(opt.id as Gateway)}
												className={`p-2.5 rounded-xl border transition-all text-left flex flex-col gap-0.5 ${gateway === opt.id
													? "bg-white border-[#6B5E4C] ring-2 ring-[#6B5E4C] shadow-sm"
													: "bg-white border-[#E6DFD5] hover:bg-[#FAF8F5]"}`}
											>
												<span className="text-lg leading-none">{opt.icon}</span>
												<span className="font-semibold text-[#4A3F31] text-[10px] leading-tight mt-0.5">{opt.name}</span>
												<span className="text-[8px] text-[#8A7D6E]">{opt.desc}</span>
											</button>
										))}
									</div>
								</div>

								{/* ─ Card form (Stripe / Mercado Pago) */}
								{(gateway === "stripe" || gateway === "mercadopago") && (
									<div className="bg-white border border-[#EBE6DD] rounded-xl p-4 space-y-3 animate-fadeIn">
										<p className="text-[11px] font-semibold text-[#5C5549] flex items-center gap-1.5">
											<CreditCard className="w-3.5 h-3.5" /> Datos de tarjeta
										</p>
										<div>
											<label className="text-[10px] text-[#8A7D6E] block mb-1">Número de tarjeta</label>
											<input
												value={cardNumber}
												onChange={e => setCardNumber(formatCard(e.target.value))}
												placeholder="4242 4242 4242 4242"
												maxLength={19}
												className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E6DFD5] rounded-lg text-xs text-[#2C2C2C] font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-[#6B5E4C]"
											/>
										</div>
										<div className="grid grid-cols-2 gap-2">
											<div>
												<label className="text-[10px] text-[#8A7D6E] block mb-1">Vencimiento</label>
												<input
													value={cardExpiry}
													onChange={e => setCardExpiry(formatExpiry(e.target.value))}
													placeholder="MM/AA"
													maxLength={5}
													className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E6DFD5] rounded-lg text-xs text-[#2C2C2C] font-mono focus:outline-none focus:ring-1 focus:ring-[#6B5E4C]"
												/>
											</div>
											<div>
												<label className="text-[10px] text-[#8A7D6E] block mb-1">CVV</label>
												<input
													value={cardCvv}
													onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
													placeholder="•••"
													maxLength={4}
													className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E6DFD5] rounded-lg text-xs text-[#2C2C2C] font-mono focus:outline-none focus:ring-1 focus:ring-[#6B5E4C]"
												/>
											</div>
										</div>
										<div className="flex gap-2">
											<button
												onClick={() => { setCardNumber("4242 4242 4242 4242"); setCardExpiry("12/26"); setCardCvv("123") }}
												className="text-[9px] px-2 py-1 border border-dashed border-[#6B5E4C] text-[#6B5E4C] rounded-lg hover:bg-[#FAF6F0] transition-all"
											>
												⚡ Usar tarjeta de prueba
											</button>
											<p className="text-[9px] text-[#8A7D6E] flex items-center">
												🔒 Entorno de prueba sandbox
											</p>
										</div>
									</div>
								)}

								{/* ─ Webpay / Flow redirect notice */}
								{(gateway === "webpay" || gateway === "flow") && (
									<div className="bg-white border border-[#EBE6DD] rounded-xl p-5 text-center space-y-3 animate-fadeIn">
										<div className="text-5xl">{gateway === "webpay" ? "🔵" : "🟠"}</div>
										<p className="text-sm font-serif text-[#4A3F31] font-medium">
											{gateway === "webpay" ? "Webpay Plus · Transbank" : "Flow Online"}
										</p>
										<p className="text-xs text-[#8A7D6E] leading-relaxed">
											Al confirmar serás redirigido al portal seguro de{" "}
											<strong>{gateway === "webpay" ? "Transbank" : "Flow"}</strong> para completar tu pago de{" "}
											<strong>${total.toFixed(2)} USD</strong>.
										</p>
										<div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-[10px] text-amber-700">
											🧪 Modo demo — el pago se aprobará automáticamente.
										</div>
									</div>
								)}

								{/* ─ Crypto */}
								{gateway === "crypto" && (
									<div className="bg-white border border-[#EBE6DD] rounded-xl p-4 space-y-3 animate-fadeIn">
										<div className="flex gap-2">
											{(["USDT", "BTC"] as const).map(c => (
												<button key={c} onClick={() => setCryptoCoin(c)}
													className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${cryptoCoin === c ? "bg-[#6B5E4C] text-white border-[#6B5E4C]" : "bg-white text-[#5C5549] border-[#E6DFD5]"}`}
												>
													{c}
												</button>
											))}
										</div>

										{/* QR placeholder */}
										<div className="text-center">
											<div className="w-28 h-28 mx-auto bg-[#FAF8F5] border-2 border-dashed border-[#6B5E4C] rounded-xl flex items-center justify-center text-5xl mb-2 relative overflow-hidden">
												<span className="opacity-30 select-none" style={{ fontSize: "80px", lineHeight: 1 }}>₿</span>
												<div className="absolute inset-0 flex items-center justify-center">
													<div className="grid grid-cols-7 gap-0.5 opacity-70">
														{Array.from({ length: 49 }).map((_, i) => (
															<div key={i} className={`w-2.5 h-2.5 rounded-sm ${Math.random() > 0.45 ? "bg-[#4A3F31]" : "bg-transparent"}`} />
														))}
													</div>
												</div>
											</div>
											<p className="text-[10px] text-[#8A7D6E] mb-0.5">Monto a enviar</p>
											<p className="font-mono text-sm font-bold text-[#4A3F31]">
												{cryptoCoin === "USDT"
													? `${total.toFixed(2)} USDT`
													: `${(total / 65000).toFixed(6)} BTC`}
											</p>
										</div>

										{/* Wallet address */}
										<div className="bg-[#FAF8F5] rounded-lg p-3 border border-[#EBE6DD]">
											<p className="text-[9px] text-[#8A7D6E] mb-1">Dirección de {cryptoCoin} (TRC-20 / Mainnet)</p>
											<div className="flex items-center gap-2">
												<code className="text-[10px] text-[#4A3F31] font-mono flex-1 truncate">
													{CRYPTO_ADDR[cryptoCoin]}
												</code>
												<button onClick={() => copyText(CRYPTO_ADDR[cryptoCoin])}
													className="shrink-0 text-[#6B5E4C] hover:text-[#4A3F31] transition-colors"
												>
													<Copy className="w-3.5 h-3.5" />
												</button>
											</div>
											{copied && <p className="text-[9px] text-green-600 mt-1 font-medium">¡Dirección copiada!</p>}
										</div>
									</div>
								)}

								{/* ─ Transferencia */}
								{gateway === "transferencia" && (
									<div className="bg-white border border-[#EBE6DD] rounded-xl p-4 space-y-2 text-xs animate-fadeIn">
										<p className="font-semibold text-[#5C5549] mb-3 flex items-center gap-1.5">
											🏦 Datos para la transferencia
										</p>
										{[
											{ label: "Banco",          value: node.user.banco_nombre || "Banco Santander" },
											{ label: "Tipo de cuenta", value: node.user.banco_tipo   || "Cuenta Corriente" },
											{ label: "Número",         value: node.user.banco_nro    || "123-456789-01" },
											{ label: "RUT titular",    value: node.user.banco_rut    || "12.345.678-9" },
											{ label: "Titular",        value: node.user.nombre },
											{ label: "Monto exacto",   value: `$${total.toFixed(2)} USD` },
											{ label: "Referencia",     value: `AMBITOS-${nombre.split(" ")[0]?.toUpperCase() || "CLIENTE"}` },
										].map(row => (
											<div key={row.label} className="flex justify-between items-center border-b border-[#FAF6F0] pb-1.5">
												<span className="text-[#8A7D6E] shrink-0 mr-2">{row.label}</span>
												<span className="font-semibold text-[#4A3F31] text-right">{row.value}</span>
											</div>
										))}
										<p className="text-[9px] text-[#8A7D6E] pt-1">
											Envía el comprobante a <span className="text-[#6B5E4C]">{node.user.email}</span>
										</p>
									</div>
								)}

								{/* Total + Pay button */}
								<div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#FAF6F0] flex justify-between items-center">
									<span className="text-xs font-semibold text-[#4A3F31]">Total a pagar</span>
									<span className="text-base font-serif font-bold text-[#4A3F31]">${total.toFixed(2)} USD</span>
								</div>

								<button
									onClick={simulatePay}
									className="w-full bg-[#6B5E4C] hover:bg-[#534737] text-white py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
								>
									{gateway === "stripe" || gateway === "mercadopago"
										? "Pagar ahora"
										: gateway === "transferencia"
										? "Confirmar pedido (ya transferí)"
										: gateway === "crypto"
										? "Ya envié el pago"
										: "Continuar al portal seguro"}
									<ArrowRight className="w-4 h-4" />
								</button>

								<p className="text-[10px] text-center text-[#8A7D6E] flex items-center justify-center gap-1">
									<ShieldCheck className="w-3 h-3 text-green-600" /> Transacción encriptada y segura
								</p>
							</div>
						)}

						{/* ── STEP 3: Procesando ── */}
						{step === "procesando" && (
							<div className="py-14 flex flex-col items-center gap-4 text-center">
								<div className="relative w-16 h-16">
									<div className="absolute inset-0 w-16 h-16 border-4 border-[#EBE6DD] rounded-full" />
									<div className="absolute inset-0 w-16 h-16 border-4 border-[#6B5E4C] border-t-transparent rounded-full animate-spin" />
								</div>
								<h4 className="font-serif text-[#4A3F31] text-lg">Procesando tu orden...</h4>
								<p className="text-xs text-[#8A7D6E] max-w-xs leading-relaxed">
									Confirmando con la pasarela de pago y reservando los productos.
								</p>
								<div className="flex flex-wrap gap-1.5 justify-center mt-2">
									{["Verificando datos", "Procesando pago", "Generando orden", "Enviando confirmación"].map((msg, i) => (
										<span key={i} className="text-[9px] text-[#8A7D6E] bg-[#FAF8F5] px-2 py-1 rounded-full border border-[#EBE6DD] animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
											{msg}
										</span>
									))}
								</div>
							</div>
						)}

						{/* ── STEP 4: Confirmado ── */}
						{step === "confirmado" && (
							<div className="py-6 flex flex-col items-center gap-4 text-center">
								<div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center border-2 border-green-100">
									<CheckCircle className="w-8 h-8 text-green-500" />
								</div>

								<div>
									<h4 className="font-serif text-[#4A3F31] text-xl font-medium">¡Orden Confirmada!</h4>
									<p className="text-xs text-[#8A7D6E] mt-1">
										Orden <span className="font-mono font-bold text-[#6B5E4C]">{orderId}</span>
									</p>
								</div>

								{/* Order summary */}
								<div className="w-full bg-[#FAF8F5] rounded-xl p-4 border border-[#EBE6DD] text-left space-y-1.5">
									{cart.map(item => (
										<div key={item.product.sku} className="flex justify-between text-xs text-[#5C5549]">
											<span>{item.product.nombre} <span className="text-[#8A7D6E]">×{item.qty}</span></span>
											<span className="font-medium">${(item.product.precio_venta * item.qty).toFixed(2)}</span>
										</div>
									))}
									<div className="border-t border-[#EBE6DD] pt-2 flex justify-between text-sm font-bold text-[#4A3F31]">
										<span>Total pagado</span>
										<span>${total.toFixed(2)} USD</span>
									</div>
								</div>

								<p className="text-xs text-[#8A7D6E]">
									Confirmación enviada a <strong className="text-[#4A3F31]">{email}</strong>
								</p>

								<div className="flex gap-2 w-full">
									<button
										onClick={() => setShowEmail(true)}
										className="flex-1 flex items-center justify-center gap-1.5 border border-[#6B5E4C] text-[#6B5E4C] py-2.5 rounded-xl text-xs font-semibold hover:bg-[#FAF6F0] transition-all"
									>
										<Mail className="w-3.5 h-3.5" /> Ver email
									</button>
									<button
										onClick={() => { onComplete(); onClose() }}
										className="flex-1 bg-[#6B5E4C] text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-[#534737] transition-all"
									>
										Volver a la tienda
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
