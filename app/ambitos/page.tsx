"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Compass, Sparkles, Store, ChevronRight, PlusCircle, CheckCircle2, ShieldAlert } from "lucide-react"
import Scene3D from "@/components/scene-3d"
import ProcessVisualization3D from "@/components/process-visualization-3d"

interface CollaboratorNode {
	id: number
	nombre_espacio: string
	slug: string
	user?: {
		nombre: string
		email: string
	}
}

export default function AmbitosHub() {
	const [nodes, setNodes] = useState<CollaboratorNode[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	// Formulario de creación
	const [showForm, setShowForm] = useState(false)
	const [collabNombre, setCollabNombre] = useState("")
	const [collabEmail, setCollabEmail] = useState("")
	const [espacioNombre, setEspacioNombre] = useState("")
	const [slug, setSlug] = useState("")
	const [bancoNombre, setBancoNombre] = useState("Banco Estado")
	const [bancoTipo, setBancoTipo] = useState("Cuenta Corriente")
	const [bancoNro, setBancoNro] = useState("")
	const [bancoRut, setBancoRut] = useState("")
	const [submitting, setSubmitting] = useState(false)
	const [successMsg, setSuccessMsg] = useState("")

	// Mock nodes fallback si el backend no está corriendo localmente
	const mockNodes: CollaboratorNode[] = [
		{
			id: 1,
			nombre_espacio: "Espacio Tierra y Calma",
			slug: "tierra-y-calma",
			user: { nombre: "Valentina Solar", email: "valentina@tierra.cl" }
		},
		{
			id: 2,
			nombre_espacio: "Estudio Bambú Meditación",
			slug: "estudio-bambu",
			user: { nombre: "Tomás Riquelme", email: "tomas@bambu.cl" }
		},
		{
			id: 3,
			nombre_espacio: "Loto Azul Terapias",
			slug: "loto-azul",
			user: { nombre: "Andrea Paz", email: "andrea@lotoazul.cl" }
		}
	]

	useEffect(() => {
		fetchNodes()
	}, [])

	const fetchNodes = async () => {
		setLoading(true)
		setError("")
		try {
			const res = await fetch("http://localhost:8080/api/v1/nodes")
			if (!res.ok) {
				throw new Error("No se pudo conectar al API de Go.")
			}
			const data = await res.json()
			setNodes(data && data.length > 0 ? data : mockNodes)
		} catch (err: any) {
			console.log("Servidor Go inactivo. Usando nodos de simulación.", err)
			setNodes(mockNodes)
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSubmitting(true)
		setError("")
		setSuccessMsg("")

		const formattedSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, "-")

		try {
			const res = await fetch("http://localhost:8080/api/v1/nodes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nombre_colaborador: collabNombre,
					email_colaborador: collabEmail,
					nombre_espacio: espacioNombre,
					slug: formattedSlug,
					banco_nombre: bancoNombre,
					banco_tipo: bancoTipo,
					banco_nro: bancoNro,
					banco_rut: bancoRut
				})
			})

			if (!res.ok) {
				const errData = await res.json()
				throw new Error(errData.error || "Ocurrió un error al registrar la vitrina.")
			}

			setSuccessMsg("¡Tu vitrina nodal ha sido creada con éxito en la base de datos Supabase!")
			// Limpiar campos
			setCollabNombre("")
			setCollabEmail("")
			setEspacioNombre("")
			setSlug("")
			setBancoNro("")
			setBancoRut("")

			// Recargar nodos del backend
			setTimeout(() => {
				setShowForm(false)
				setSuccessMsg("")
				fetchNodes()
			}, 2000)

		} catch (err: any) {
			setError(err.message || "Error al conectar con el backend.")
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="min-h-screen bg-[#FDFBF9] text-[#2C2C2C] font-sans antialiased">
			{/* Navbar */}
			<header className="border-b border-[#EBE6DD] bg-white sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="bg-[#6B5E4C] text-[#FAF8F5] p-2 rounded-lg">
							<Compass className="w-5 h-5" />
						</div>
						<span className="font-serif text-lg font-semibold tracking-wider text-[#4A3F31]">ÁMBITOS</span>
					</div>
					<button
						onClick={() => setShowForm(true)}
						className="flex items-center gap-2 bg-[#6B5E4C] hover:bg-[#534737] text-white py-2 px-4 rounded-xl text-sm font-medium transition-all shadow-sm"
					>
						<PlusCircle className="w-4 h-4" />
						<span>Unirse como Colaborador</span>
					</button>
				</div>
			</header>

			{/* Hero 3D */}
			<section className="relative">
				<Scene3D />
				{/* Texto superpuesto */}
				<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4" style={{ background: "linear-gradient(to bottom, rgba(26,18,8,0.3) 0%, transparent 40%, transparent 60%, rgba(26,18,8,0.5) 100%)" }}>
					<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold mb-3" style={{ background: "rgba(200,170,100,0.15)", border: "1px solid rgba(200,170,100,0.3)", color: "rgba(220,185,120,0.9)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
						<Sparkles className="w-3 h-3" /> E-commerce Colaborativo Nodal
					</span>
					<h1 className="text-3xl sm:text-4xl font-serif font-medium text-center" style={{ color: "rgba(250,246,240,0.95)", textShadow: "0 2px 30px rgba(0,0,0,0.6)", lineHeight: 1.2 }}>
						Red de Espacios para el Bienestar
					</h1>
					<p className="text-xs mt-2 text-center" style={{ color: "rgba(200,170,100,0.7)", maxWidth: 340, letterSpacing: "0.04em" }}>
						Arrastra el orbe · {new Date().getFullYear()} · Ámbitos Chile
					</p>
				</div>
			</section>

			{/* Sección Interactiva de Transformación Operacional (3D) */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
				<div className="text-center mb-8">
					<h2 className="text-xl sm:text-2xl font-serif font-medium text-[#4A3F31] mb-2">
						Transformación Nodal: De la Complejidad a la Calma
					</h2>
					<p className="text-xs text-[#8A7D6E] max-w-lg mx-auto font-light leading-relaxed">
						Visualiza en tiempo real cómo estructuramos y optimizamos los flujos de abastecimiento, reservas y liquidaciones de pagos de todos nuestros colaboradores.
					</p>
				</div>
				<ProcessVisualization3D />
			</section>

			{/* Grid de Vitrinas */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{loading ? (
					<div className="text-center py-20 text-[#8A7D6E]">
						<div className="inline-block w-8 h-8 border-4 border-[#6B5E4C] border-t-transparent rounded-full animate-spin mb-4"></div>
						<p className="text-sm font-serif">Invocando el API de Ámbitos...</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{nodes.map((node) => (
							<div
								key={node.id}
								className="bg-white border border-[#EBE6DD] rounded-2xl p-6 transition-all hover:shadow-md flex flex-col justify-between"
							>
								<div>
									<div className="flex items-center gap-3 mb-4">
										<div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E6DFD5] text-[#6B5E4C]">
											<Store className="w-6 h-6" />
										</div>
										<div>
											<h3 className="font-serif text-lg font-medium text-[#4A3F31]">{node.nombre_espacio}</h3>
											<p className="text-xs text-[#8A7D6E] font-medium">/n/{node.slug}</p>
										</div>
									</div>
									<div className="space-y-1.5 mb-6 text-sm text-[#5C5549] border-t border-[#FAF6F0] pt-3">
										<p className="flex items-center gap-1.5">
											<span className="text-[#8A7D6E] text-xs">Anfitrión:</span>
											<span className="font-medium">{node.user?.nombre || "Colaborador"}</span>
										</p>
										<p className="flex items-center gap-1.5">
											<span className="text-[#8A7D6E] text-xs">Contacto:</span>
											<span className="font-light">{node.user?.email || "hola@ambitos.cl"}</span>
										</p>
									</div>
								</div>
								<Link
									href={`/ambitos/n/${node.slug}`}
									className="flex items-center justify-between bg-[#FAF8F5] hover:bg-[#F3ECE0] border border-[#E6DFD5] text-[#6B5E4C] font-medium py-2.5 px-4 rounded-xl text-sm transition-all"
								>
									<span>Visitar Espacio</span>
									<ChevronRight className="w-4 h-4" />
								</Link>
							</div>
						))}
					</div>
				)}
			</main>

			{/* Modal Crear Nodo */}
			{showForm && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-[#FDFBF9] border border-[#EBE6DD] rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-fadeIn">
						<div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EBE6DD]">
							<h3 className="text-xl font-serif text-[#4A3F31] font-medium">Registra tu Vitrina</h3>
							<button onClick={() => setShowForm(false)} className="text-[#8A7D6E] hover:text-[#4A3F31] text-sm">
								Cerrar
							</button>
						</div>

						{successMsg ? (
							<div className="text-center py-8">
								<div className="inline-flex justify-center items-center w-12 h-12 bg-green-100 text-green-700 rounded-full mb-4">
									<CheckCircle2 className="w-6 h-6 animate-pulse" />
								</div>
								<p className="text-sm font-serif font-medium text-green-700">{successMsg}</p>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-4">
								{error && (
									<div className="bg-red-50 text-red-700 p-3.5 rounded-xl border border-red-200 text-xs flex items-center gap-2">
										<ShieldAlert className="w-4 h-4 shrink-0" />
										<span>{error}</span>
									</div>
								)}

								<h4 className="text-xs font-semibold text-[#8A7D6E] uppercase tracking-wider">1. Datos Personales</h4>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-xs text-[#5C5549] mb-1 font-medium">Nombre</label>
										<input
											type="text"
											required
											value={collabNombre}
											onChange={(e) => setCollabNombre(e.target.value)}
											placeholder="Ej. Francisca Silva"
											className="w-full px-3 py-2 bg-white border border-[#E6DFD5] rounded-xl text-xs focus:ring-[#6B5E4C] focus:border-[#6B5E4C] text-[#2C2C2C]"
										/>
									</div>
									<div>
										<label className="block text-xs text-[#5C5549] mb-1 font-medium">Email</label>
										<input
											type="email"
											required
											value={collabEmail}
											onChange={(e) => setCollabEmail(e.target.value)}
											placeholder="francisca@calma.cl"
											className="w-full px-3 py-2 bg-white border border-[#E6DFD5] rounded-xl text-xs focus:ring-[#6B5E4C] focus:border-[#6B5E4C] text-[#2C2C2C]"
										/>
									</div>
								</div>

								<h4 className="text-xs font-semibold text-[#8A7D6E] uppercase tracking-wider pt-2">2. Tu Espacio / Vitrina</h4>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-xs text-[#5C5549] mb-1 font-medium">Nombre del Espacio</label>
										<input
											type="text"
											required
											value={espacioNombre}
											onChange={(e) => setEspacioNombre(e.target.value)}
											placeholder="Ej. Espacio Bosque Húmedo"
											className="w-full px-3 py-2 bg-white border border-[#E6DFD5] rounded-xl text-xs focus:ring-[#6B5E4C] focus:border-[#6B5E4C] text-[#2C2C2C]"
										/>
									</div>
									<div>
										<label className="block text-xs text-[#5C5549] mb-1 font-medium">Slug de URL (único)</label>
										<input
											type="text"
											required
											value={slug}
											onChange={(e) => setSlug(e.target.value)}
											placeholder="ej. bosque-humedo"
											className="w-full px-3 py-2 bg-white border border-[#E6DFD5] rounded-xl text-xs focus:ring-[#6B5E4C] focus:border-[#6B5E4C] text-[#2C2C2C]"
										/>
									</div>
								</div>

								<h4 className="text-xs font-semibold text-[#8A7D6E] uppercase tracking-wider pt-2">3. Cuenta para Recibir Transferencias</h4>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-xs text-[#5C5549] mb-1 font-medium">Nombre Banco</label>
										<select
											value={bancoNombre}
											onChange={(e) => setBancoNombre(e.target.value)}
											className="w-full px-3 py-2 bg-white border border-[#E6DFD5] rounded-xl text-xs focus:ring-[#6B5E4C] text-[#2C2C2C]"
										>
											<option>Banco Estado</option>
											<option>Banco de Chile</option>
											<option>Banco Santander</option>
											<option>BCI</option>
											<option>Banco Itaú</option>
										</select>
									</div>
									<div>
										<label className="block text-xs text-[#5C5549] mb-1 font-medium">Tipo Cuenta</label>
										<select
											value={bancoTipo}
											onChange={(e) => setBancoTipo(e.target.value)}
											className="w-full px-3 py-2 bg-white border border-[#E6DFD5] rounded-xl text-xs focus:ring-[#6B5E4C] text-[#2C2C2C]"
										>
											<option>Cuenta Corriente</option>
											<option>Cuenta Vista / RUT</option>
											<option>Cuenta Ahorro</option>
										</select>
									</div>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-xs text-[#5C5549] mb-1 font-medium">Nro Cuenta</label>
										<input
											type="text"
											required
											value={bancoNro}
											onChange={(e) => setBancoNro(e.target.value)}
											placeholder="1290382012"
											className="w-full px-3 py-2 bg-white border border-[#E6DFD5] rounded-xl text-xs focus:ring-[#6B5E4C] focus:border-[#6B5E4C] text-[#2C2C2C]"
										/>
									</div>
									<div>
										<label className="block text-xs text-[#5C5549] mb-1 font-medium">RUT Titular</label>
										<input
											type="text"
											required
											value={bancoRut}
											onChange={(e) => setBancoRut(e.target.value)}
											placeholder="19.231.423-K"
											className="w-full px-3 py-2 bg-white border border-[#E6DFD5] rounded-xl text-xs focus:ring-[#6B5E4C] focus:border-[#6B5E4C] text-[#2C2C2C]"
										/>
									</div>
								</div>

								<button
									type="submit"
									disabled={submitting}
									className="w-full bg-[#6B5E4C] hover:bg-[#534737] text-white py-2.5 px-4 rounded-xl text-xs font-semibold mt-4 transition-all"
								>
									{submitting ? "Creando vitrina..." : "Confirmar e Inicializar Espacio"}
								</button>
							</form>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
