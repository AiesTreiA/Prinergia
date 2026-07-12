"use client"

import React, { useState, useEffect } from "react"
import { ShoppingBag, ListFilter, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import BookingCalendar from "@/components/booking-calendar"
import CheckoutFlow from "@/components/checkout-flow"

interface NodeData {
	id: number
	nombre_espacio: string
	slug: string
	config_estetica: string // JSON String
	user: {
		id: number
		nombre: string
		email: string
		banco_nombre: string
		banco_tipo: string
		banco_nro: string
		banco_rut: string
	}
}

interface Product {
	sku: string
	nombre: string
	descripcion: string
	material_principal: string
	enfoque_calma: string
	precio_venta: number
	stock: number
}

export default function Storefront({ params }: { params: { slug: string } }) {
	const slug = params.slug

	const [activeTab, setActiveTab] = useState<"productos" | "sesiones">("productos")
	const [node, setNode] = useState<NodeData | null>(null)
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	// Categoría activa de productos
	const [selectedCategory, setSelectedCategory] = useState<string>("all")

	// Estado del carrito de compras
	const [cart, setCart] = useState<{ product: Product; qty: number }[]>([])
	const [showCheckoutModal, setShowCheckoutModal] = useState(false)
	const [clienteNombre, setClienteNombre] = useState("")
	const [clienteEmail, setClienteEmail] = useState("")
	const [gateway, setGateway] = useState("mercadopago")
	const [checkoutLoading, setCheckoutLoading] = useState(false)

	// Estilos dinámicos parseados
	const [styles, setStyles] = useState<any>({
		primaryColor: "#FAF6F0",
		accentColor: "#5C5549",
		textColor: "#2C2C2C",
		heroTitle: "Bienvenidos",
		heroSubtitle: "Un espacio de calma.",
	})

	useEffect(() => {
		fetchStoreData()
	}, [slug])

	const fetchStoreData = async () => {
		setLoading(true)
		setError("")
		try {
			// 1. Obtener datos del Nodo
			const nodeRes = await fetch(`http://localhost:8080/api/v1/nodes/${slug}`)
			if (!nodeRes.ok) throw new Error("Vitrina no encontrada en el backend.")
			const nodeData: NodeData = await nodeRes.json()
			setNode(nodeData)

			// Parsear configuración estética
			if (nodeData.config_estetica) {
				try {
					setStyles(JSON.parse(nodeData.config_estetica))
				} catch (e) {
					console.error("Error parseando estilos", e)
				}
			}

			// 2. Obtener Productos
			const prodRes = await fetch("http://localhost:8080/api/v1/products")
			if (prodRes.ok) {
				const prodData = await prodRes.json()
				setProducts(prodData)
			}
		} catch (err: any) {
			console.log("Backend inactivo o nodo inexistente. Levantando simulación local.")
			// Fallback mock
			const mockNode: NodeData = {
				id: 99,
				nombre_espacio: "Espacio Tierra y Calma",
				slug: slug,
				config_estetica: "",
				user: {
					id: 10,
					nombre: "Valentina Solar",
					email: "valentina@tierra.cl",
					banco_nombre: "Banco de Chile",
					banco_tipo: "Cuenta Corriente",
					banco_nro: "23910381029",
					banco_rut: "18.231.542-K"
				}
			}
			setNode(mockNode)

			// Obtener productos fallback
			fetchProductsFallback()
		} finally {
			setLoading(false)
		}
	}

	const fetchProductsFallback = async () => {
		// Mock de algunos productos si el backend está apagado
		const dummyProducts: Product[] = [
			{ sku: "ATM-HUM-01", nombre: "Humidificador Efecto Llama", descripcion: "Simula la calidez de una fogata con neblina ultrasónica y luz ámbar tenue.", material_principal: "Madera clara y ABS", enfoque_calma: "Simulación fogata ASMR", precio_venta: 45, stock: 10 },
			{ sku: "ATM-DIF-02", nombre: "Difusor Ultrasónico Compacto", descripcion: "Aromaterapia de alta precisión para salas de yoga o masajes.", material_principal: "Bambú natural", enfoque_calma: "Aromaterapia", precio_venta: 35, stock: 12 },
			{ sku: "ATM-LAM-03", nombre: "Lámpara de Sal del Himalaya", descripcion: "Purifica el ambiente y emite luz tenue rosada. Base artesanal de madera.", material_principal: "Cristal de sal + madera", enfoque_calma: "Purificación de aire", precio_venta: 39, stock: 15 },
			{ sku: "ATM-QUE-04", nombre: "Quemador Incienso Cascada", descripcion: "Flujo de humo descendente que crea una cascada visual hipnótica y calmante.", material_principal: "Cerámica blanca mate", enfoque_calma: "Flujo visual relajante", precio_venta: 25, stock: 18 },
			{ sku: "ATM-VEL-05", nombre: "Velas de Soja Aromáticas", descripcion: "Cera de soja natural con fragancia orgánica. Tapa de bambú reutilizable.", material_principal: "Frasco vidrio + bambú", enfoque_calma: "Iluminación natural", precio_venta: 19, stock: 30 },
			{ sku: "KIC-RAC-12", nombre: "Rack Organizador de Platos", descripcion: "Secado y almacenamiento estético de platos al aire libre.", material_principal: "Madera de bambú", enfoque_calma: "Orden zen cocina", precio_venta: 19, stock: 8 },
			{ sku: "KIC-BOT-13", nombre: "Set Botes Vidrio y Bambú", descripcion: "Botes herméticos minimalistas para especias o cereales. 4 piezas.", material_principal: "Vidrio borosilicato + bambú", enfoque_calma: "Cocina ordenada", precio_venta: 32, stock: 14 },
			{ sku: "BTH-JAB-18", nombre: "Dispensador Jabón Mármol", descripcion: "Dispensador de bomba de acero inoxidable con base mármol blanco.", material_principal: "Mármol y acero inox", enfoque_calma: "Spa en casa", precio_venta: 28, stock: 22 },
			{ sku: "TEX-COJ-22", nombre: "Zafu Meditación Lino", descripcion: "Cojín de meditación relleno de cáscara de trigo sarraceno. Funda lavable.", material_principal: "Lino lavado rústico", enfoque_calma: "Meditación profunda", precio_venta: 49, stock: 6 },
			{ sku: "OFF-SOA-25", nombre: "Soporte Laptop Madera Haya", descripcion: "Elevador ergonómico plegable, ángulo 30° con ranura de ventilación.", material_principal: "Madera de haya", enfoque_calma: "Escritorio minimalista", precio_venta: 55, stock: 9 },
			{ sku: "WEL-MAS-30", nombre: "Masajeador Cuero Cabelludo", descripcion: "Rutina ASMR de relajación capilar con cabezales de silicona suave.", material_principal: "ABS blanco mate", enfoque_calma: "Rutina capilar ASMR", precio_venta: 29, stock: 20 },
			{ sku: "WEL-ROL-31", nombre: "Roller Facial Cuarzo Rosa", descripcion: "Masaje facial drenante con piedra de cuarzo rosa natural.", material_principal: "Cuarzo rosa natural", enfoque_calma: "Ritual facial", precio_venta: 22, stock: 25 },
		]
		setProducts(dummyProducts)
	}

	// Carrito
	const addToCart = (product: Product) => {
		const exist = cart.find(x => x.product.sku === product.sku)
		if (exist) {
			setCart(cart.map(x => x.product.sku === product.sku ? { ...exist, qty: exist.qty + 1 } : x))
		} else {
			setCart([...cart, { product, qty: 1 }])
		}
	}

	const removeFromCart = (sku: string) => {
		setCart(cart.filter(x => x.product.sku !== sku))
	}

	const clearCart = () => setCart([])

	const getCartTotal = () => {
		return cart.reduce((sum, item) => sum + (item.product.precio_venta * item.qty), 0)
	}

	const handleCheckoutSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!clienteNombre || !clienteEmail || cart.length === 0 || !node) return

		setCheckoutLoading(true)
		setError("")

		const orderItems = cart.map(item => ({
			sku: item.product.sku,
			nombre: item.product.nombre,
			precio: item.product.precio_venta,
			cantidad: item.qty
		}))

		try {
			const res = await fetch("http://localhost:8080/api/v1/payments/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					node_id: node.id,
					total: getCartTotal(),
					pasarela: gateway,
					items: JSON.stringify(orderItems),
					cliente_mail: clienteEmail,
					cliente_nom: clienteNombre
				})
			})

			if (!res.ok) {
				const errData = await res.json()
				throw new Error(errData.error || "Error al procesar el pago.")
			}

			const data = await res.json()
			clearCart()
			setShowCheckoutModal(false)

			if (data.redirect_url) {
				window.location.href = data.redirect_url
			}
		} catch (err: any) {
			setError(err.message || "Error al procesar la orden.")
		} finally {
			setCheckoutLoading(false)
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF9] text-[#8A7D6E]">
				<div className="w-8 h-8 border-4 border-[#6B5E4C] border-t-transparent rounded-full animate-spin mb-4"></div>
				<p className="font-serif">Cargando vitrina de calma...</p>
			</div>
		)
	}

	if (!node) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF9] text-[#8A7D6E] p-4 text-center">
				<h2 className="text-2xl font-serif font-medium text-[#4A3F31] mb-2">Vitrina Inexistente</h2>
				<p className="text-sm max-w-sm mb-6">El espacio solicitado no se encuentra registrado en nuestra base nodal.</p>
				<Link href="/ambitos" className="bg-[#6B5E4C] text-white py-2 px-6 rounded-xl text-sm transition-all">
					Volver al Portal de Ámbitos
				</Link>
			</div>
		)
	}

	// Clasificación manual básica de categorías de producto mediante prefijo SKU
	const getCategoryLabel = (sku: string) => {
		if (sku.startsWith("ATM-")) return "Atmósfera"
		if (sku.startsWith("KIC-")) return "Cocina"
		if (sku.startsWith("BTH-")) return "Baño"
		if (sku.startsWith("TEX-")) return "Textiles"
		if (sku.startsWith("OFF-")) return "Escritorio"
		if (sku.startsWith("WEL-")) return "Bienestar"
		return "Hogar"
	}

	// Imágenes reales de Pexels por SKU individual (warm minimalist interiors)
	const PRODUCT_IMAGES: Record<string, string> = {
		"ATM-HUM-01": "https://images.pexels.com/photos/6758785/pexels-photo-6758785.jpeg?auto=compress&cs=tinysrgb&w=600",
		"ATM-DIF-02": "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600",
		"ATM-LAM-03": "https://images.pexels.com/photos/6707628/pexels-photo-6707628.jpeg?auto=compress&cs=tinysrgb&w=600",
		"ATM-QUE-04": "https://images.pexels.com/photos/3616760/pexels-photo-3616760.jpeg?auto=compress&cs=tinysrgb&w=600",
		"ATM-VEL-05": "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=600",
		"KIC-RAC-12": "https://images.pexels.com/photos/4270366/pexels-photo-4270366.jpeg?auto=compress&cs=tinysrgb&w=600",
		"KIC-BOT-13": "https://images.pexels.com/photos/5765/pexels-photo-5765.jpeg?auto=compress&cs=tinysrgb&w=600",
		"BTH-JAB-18": "https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=600",
		"TEX-COJ-22": "https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=600",
		"OFF-SOA-25": "https://images.pexels.com/photos/6474475/pexels-photo-6474475.jpeg?auto=compress&cs=tinysrgb&w=600",
		"WEL-MAS-30": "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=600",
		"WEL-ROL-31": "https://images.pexels.com/photos/3997387/pexels-photo-3997387.jpeg?auto=compress&cs=tinysrgb&w=600",
	}
	const getProductImage = (sku: string) => {
		return PRODUCT_IMAGES[sku] || "https://images.pexels.com/photos/1358900/pexels-photo-1358900.jpeg?auto=compress&cs=tinysrgb&w=600"
	}

	const filteredProducts = products.filter(p => {
		if (selectedCategory === "all") return true
		const cat = getCategoryLabel(p.sku).toLowerCase()
		return cat === selectedCategory.toLowerCase()
	})

	return (
		<div className="min-h-screen bg-[#FDFBF9] text-[#2C2C2C] font-sans antialiased pb-20">
			{/* Navbar */}
			<header className="border-b border-[#EBE6DD] bg-white sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<Link href="/ambitos" className="flex items-center gap-1.5 text-xs text-[#8A7D6E] hover:text-[#6B5E4C] font-medium transition-all">
						<ArrowLeft className="w-4 h-4" /> Volver al Portal Nodal
					</Link>
					<div className="text-center">
						<span className="font-serif text-sm font-semibold tracking-widest text-[#6B5E4C]">ÁMBITOS</span>
						<h1 className="text-xs text-[#8A7D6E] font-light italic">Viviendo despacio</h1>
					</div>
					<div className="w-24 flex justify-end">
						<button
							onClick={() => activeTab === "productos" ? setActiveTab("sesiones") : setActiveTab("productos")}
							className="text-xs font-medium text-[#6B5E4C] border border-[#6B5E4C] rounded-lg py-1.5 px-3 hover:bg-[#FAF8F5] transition-all"
						>
							{activeTab === "productos" ? "Ver Citas" : "Ver Productos"}
						</button>
					</div>
				</div>
			</header>

			{/* Hero personalizado */}
			<section className="bg-[#FAF6F0] py-14 text-center px-4 border-b border-[#EBE6DD]">
				<div className="max-w-4xl mx-auto">
					<h2 className="text-3xl sm:text-4xl font-serif text-[#4A3F31] font-medium mb-3">
						{node.nombre_espacio}
					</h2>
					<p className="text-sm text-[#8A7D6E] max-w-lg mx-auto font-light leading-relaxed">
						Vitrina curada por <strong>{node.user.nombre}</strong>. Ofrecemos una selección de objetos para
						incentivar rituales diarios de tranquilidad y terapia de masajes en nuestro espacio físico.
					</p>
				</div>
			</section>

			{/* Contenedor principal */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				{activeTab === "productos" ? (
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
						{/* Filtros Categorías */}
						<div className="lg:col-span-1">
							<div className="bg-white border border-[#EBE6DD] rounded-2xl p-5 space-y-4">
								<h3 className="text-xs font-semibold text-[#8A7D6E] uppercase tracking-wider flex items-center gap-1.5">
									<ListFilter className="w-4 h-4" /> Filtrar Por Categoría
								</h3>
								<div className="flex flex-col gap-1 text-sm">
									{[
										{ id: "all", name: "Todos los productos" },
										{ id: "Atmósfera", name: "Bienestar Atmosférico" },
										{ id: "Cocina", name: "Organización Cocina" },
										{ id: "Baño", name: "Organización Baño" },
										{ id: "Textiles", name: "Textiles y Confort" },
										{ id: "Escritorio", name: "Escritorio / Oficina" },
										{ id: "Bienestar", name: "Accesorios Bienestar" }
									].map(cat => (
										<button
											key={cat.id}
											onClick={() => setSelectedCategory(cat.id)}
											className={`text-left py-2 px-3 rounded-xl transition-all ${
												selectedCategory === cat.id
													? "bg-[#FAF6F0] text-[#6B5E4C] font-semibold border-l-2 border-[#6B5E4C]"
													: "text-[#5C5549] hover:bg-[#FAF8F5]"
											}`}
										>
											{cat.name}
										</button>
									))}
								</div>
							</div>
						</div>

						{/* Grilla de Productos */}
						<div className="lg:col-span-2">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{filteredProducts.map((p) => (
									<div key={p.sku} className="bg-white border border-[#EBE6DD] rounded-2xl p-4 flex flex-col justify-between hover:shadow-sm transition-all overflow-hidden">
										<div>
											<div className="aspect-square w-full bg-[#FAF6F0] rounded-xl overflow-hidden mb-3 border border-[#EBE6DD] relative">
												<img
													src={getProductImage(p.sku)}
													alt={p.nombre}
													className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
												/>
											</div>
											<span className="text-[10px] font-semibold text-[#8A7D6E] uppercase tracking-wider block mb-1">
												{getCategoryLabel(p.sku)}
											</span>
											<h4 className="font-serif text-base font-medium text-[#4A3F31] mb-1">{p.nombre}</h4>
											<p className="text-xs text-[#8A7D6E] font-light line-clamp-2 mb-3">{p.descripcion}</p>
											<div className="text-[11px] text-[#5C5549] space-y-0.5 bg-[#FAF8F5] p-2 rounded-lg mb-4 border border-[#FAF6F0]">
												<p><strong>Material:</strong> {p.material_principal}</p>
												<p><strong>Foco:</strong> {p.enfoque_calma}</p>
											</div>
										</div>
										<div className="flex items-center justify-between pt-2 border-t border-[#FAF6F0]">
											<span className="font-serif text-md text-[#4A3F31] font-semibold">${p.precio_venta.toFixed(2)} USD</span>
											<button
												onClick={() => addToCart(p)}
												className="bg-[#6B5E4C] hover:bg-[#534737] text-white py-1.5 px-3 rounded-lg text-xs font-medium transition-all"
											>
												Añadir
											</button>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Carrito de Compras Lateral */}
						<div className="lg:col-span-1">
							<div className="bg-white border border-[#EBE6DD] rounded-2xl p-5 sticky top-20 shadow-sm">
								<h3 className="text-sm font-serif font-medium text-[#4A3F31] mb-4 flex items-center gap-2 border-b border-[#FAF6F0] pb-3">
									<ShoppingBag className="w-5 h-5 text-[#6B5E4C]" /> Bolsa de Compras
								</h3>

								{cart.length === 0 ? (
									<div className="text-center py-8 text-xs text-[#8A7D6E] font-light">
										Tu bolsa está vacía. Añade productos relajantes a tu carrito.
									</div>
								) : (
									<div className="space-y-4">
										<div className="max-h-[30vh] overflow-y-auto space-y-3 pr-1 text-xs">
											{cart.map((item) => (
												<div key={item.product.sku} className="flex justify-between items-start gap-2 border-b border-[#FAF8F5] pb-2">
													<div>
														<p className="font-medium text-[#4A3F31]">{item.product.nombre}</p>
														<p className="text-[10px] text-[#8A7D6E]">{item.qty} x ${item.product.precio_venta.toFixed(2)}</p>
													</div>
													<button
														onClick={() => removeFromCart(item.product.sku)}
														className="text-red-500 hover:text-red-700 shrink-0"
													>
														<Trash2 className="w-3.5 h-3.5" />
													</button>
												</div>
											))}
										</div>

										<div className="border-t border-[#EBE6DD] pt-3 text-sm flex justify-between font-medium">
											<span className="text-[#5C5549]">Total:</span>
											<span className="font-serif text-[#4A3F31] font-semibold">${getCartTotal().toFixed(2)} USD</span>
										</div>

										<button
											onClick={() => setShowCheckoutModal(true)}
											className="w-full bg-[#6B5E4C] hover:bg-[#534737] text-white py-2.5 px-4 rounded-xl text-xs font-semibold text-center block transition-all"
										>
											Proceder al Pago
										</button>
										<button
											onClick={clearCart}
											className="w-full text-center text-[10px] text-[#8A7D6E] hover:underline"
										>
											Vaciar Bolsa
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				) : (
					/* Vista Citas Calendario */
					<div className="animate-fadeIn">
						<BookingCalendar
							colaboradorId={node.user.id}
							colaboradorNombre={node.user.nombre}
							slug={node.slug}
						/>
					</div>
				)}
			</main>

			{/* Checkout Flow Modal */}
			{showCheckoutModal && node && (
				<CheckoutFlow
					cart={cart}
					node={node}
					getCartTotal={getCartTotal}
					onClose={() => setShowCheckoutModal(false)}
					onComplete={clearCart}
				/>
			)}
		</div>
	)
}
