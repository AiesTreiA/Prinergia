"use client"

import { useState, useEffect } from "react"
import { MapPin, MessageCircle, Calendar, Search, ArrowRight, Star, Users, Shield, Heart, HelpCircle, Code, HelpCircle as InfoIcon, X, Check, Coins, Lock, Key, Database, Globe, Github } from "lucide-react"
import Link from "next/link"
import { RaizIcon } from "@/components/ui/raiz-icon"
import { LoginButton } from "@/components/auth/login-button"
import { standardizeDiscipline } from "@/lib/disciplines"
import dynamic from "next/dynamic"

// Import Map component dynamically to avoid SSR window errors
const RaizMap = dynamic(() => import("@/components/map/raiz-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] bg-[#171310] rounded-2xl border border-[rgba(242,233,221,0.12)] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e2622c] mx-auto mb-3"></div>
        <p className="text-[#a89a8d] font-mono-plex text-sm">Cargando el mapa de linajes...</p>
      </div>
    </div>
  )
})

const CATEGORIES = [
  { label: "Todos", emoji: "✨" },
  { label: "Astrología", emoji: "🪐" }, // ~5000 años de antigüedad (Mesopotamia)
  { label: "Yoga", emoji: "🧘" },        // ~3500 años de antigüedad (India Védica)
  { label: "Temazcal", emoji: "🔥" },    // ~3000 años de antigüedad (Mesoamérica Prehispánica)
  { label: "Reiki", emoji: "🌿" },       // ~100 años de antigüedad (Japón 1922)
  { label: "Biodanza", emoji: "💃" },    // ~60 años de antigüedad (década de 1960)
  { label: "Sonoterapia", emoji: "🔔" },  // ~50 años de antigüedad (fines del siglo XX)
  { label: "Coaching", emoji: "🎯" }     // ~40 años de antigüedad (fines del siglo XX)
]

const KIVA_HIGHLIGHTS = [
  { icon: "🔥", text: "El Fuego que une América" },
  { icon: "🌍", text: "Rezo de Tierra del Fuego hasta Alaska" },
  { icon: "🪶", text: "Líderes espirituales ancestrales de muchas regiones" },
  { icon: "✨", text: "Encuentro sagrado de linajes y rezos" },
]


const EVENTOS = [
  {
    title: "Festival MCA — Mente, Cuerpo y Alma",
    date: "09 - 11 Octubre, 2026",
    location: "Estación Mapocho, Santiago",
    desc: "El mayor encuentro de bienestar integral de Chile. Tres días de talleres, conferencias con expositores internacionales, música de meditación, clases guiadas de yoga y una feria de alimentación consciente y terapias naturales.",
    badge: "Bienestar Integral",
    color: "#8b5cf6",
    image: "/images/mca_wellbeing_festival.png"
  },
  {
    title: "Wanderlust Chile — Festival del Bienestar",
    date: "14 Noviembre, 2026",
    location: "Parque Araucano, Las Condes, Santiago",
    desc: "La emblemática corrida de 5k, yoga al aire libre guiada por profesores reconocidos, meditación colectiva con música en vivo y talleres de sustentabilidad para toda la comunidad.",
    badge: "Yoga & Deporte",
    color: "#e2622c",
    image: "/images/wanderlust_yoga_park.png"
  },
  {
    title: "Feria Ecobelleza — Primavera",
    date: "07 - 08 Noviembre, 2026",
    location: "Centro Cultural Estación Mapocho, Santiago",
    desc: "Encuentro de cosmética natural, vida sustentable y alimentación basada en plantas. Organizado para promover alternativas de consumo consciente y salud natural en armonía con la tierra.",
    badge: "Sustentabilidad",
    color: "#5c6b45",
    image: "/images/ecobelleza_nature_fair.png"
  },
  {
    title: "Biofest — Celebración Biocéntrica",
    date: "05 - 07 Diciembre, 2026",
    location: "El Domo, La Reina, Santiago",
    desc: "Encuentro de Biodanza, ecología y música de medicina en vivo. Un festival familiar enfocado en cuidar la tierra, reforestar vínculos, encontrarse y celebrar la abundancia de la vida en comunidad.",
    badge: "Encuentro Comunitario",
    color: "#e2622c",
    image: "/images/biofest_community_dance.png"
  },
  {
    title: "Día Internacional del Yoga - Red Raíz",
    date: "21 Junio, 2026",
    location: "Parque Metropolitano (Jardín Mapulemu)",
    desc: "Jornada colectiva de yoga, meditación y baños de gong dirigida por facilitadores de la red. Una meditación colectiva con el propósito de irradiar paz e intencionar el cuidado de los ecosistemas locales.",
    badge: "Sintonía Global",
    color: "#5c6b45",
    image: "/images/yoga_sound_bath.png"
  }
]
const GALLERY_ITEMS = [
  {
    title: "El Fuego Primordial",
    desc: "La brasa mística en el centro de cada nodo, conectando raíces y saberes ancestrales.",
    src: "/images/ember-hero.png"
  },
  {
    title: "El Abrazo Sagrado",
    desc: "Humanos festejando la existencia en el bosque, tejiendo afecto y sonrisas en sintonía con la tierra.",
    src: "/images/abrazo.jpg",
    fallbackSrc: "/images/biodanza.jpg"
  },
  {
    title: "La Medicina del Temazcal",
    desc: "El vientre de la Madre Tierra en Ñuñoa. Fuego, piedras y cantos por todas nuestras relaciones.",
    src: "/images/temazcal.png"
  },
  {
    title: "Encuentro en el Bosque",
    desc: "Abrazos, sonrisas y contención profunda entre los árboles, conectando con lo sagrado.",
    src: "/images/forest-hugs.png",
    fallbackSrc: "/images/acro-yoga.jpg"
  },
  {
    title: "Sintonía Vibracional",
    desc: "Reposo profundo y baño de sonido bajo las frecuencias de cuencos de cuarzo y gongs.",
    src: "/images/sound-therapy.jpg"
  }
]

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [submittedDisciplines, setSubmittedDisciplines] = useState<string[]>([])
  const [imgSrcs, setImgSrcs] = useState<string[]>(GALLERY_ITEMS.map((item) => item.src))
  
  // Estados para simulación de Checkout y Suscripción P2P
  const [checkoutNode, setCheckoutNode] = useState<{ id: string; name: string; category: string } | null>(null)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<"form" | "loading" | "success">("form")
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState("mercado_pago")
  const [checkoutAmount, setCheckoutAmount] = useState(10000)

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [subscriptionStep, setSubscriptionStep] = useState<"plans" | "loading" | "success">("plans")
  const [selectedSubPlan, setSelectedSubPlan] = useState("fuego")
  const [manifestoTab, setManifestoTab] = useState<"commitment" | "architecture" | "sovereignty">("commitment")
  const [commitmentImage, setCommitmentImage] = useState<"tree" | "assembly" | "spirit">("tree")
  const [architectureVisualMode, setArchitectureVisualMode] = useState<"technical" | "organic">("technical")
  const [organicArchImage, setOrganicArchImage] = useState<"mycelium" | "puzzle">("mycelium")
  const [sovereigntyImage, setSovereigntyImage] = useState<"canopy" | "spirit">("canopy")

  useEffect(() => {
    if (typeof window === "undefined") return
    const handleOpen = (e: any) => {
      setCheckoutNode(e.detail)
      setCheckoutStep("form")
      setShowCheckoutModal(true)
    }
    window.addEventListener("open-checkout", handleOpen)
    return () => window.removeEventListener("open-checkout", handleOpen)
  }, [])

  const handleSimulatePayment = () => {
    setCheckoutStep("loading")
    setTimeout(() => {
      setCheckoutStep("success")
    }, 2500)
  }

  const handleSimulateSubscription = () => {
    setSubscriptionStep("loading")
    setTimeout(() => {
      setSubscriptionStep("success")
    }, 2500)
  }

  const [availableDisciplines, setAvailableDisciplines] = useState([
    { name: "Biodanza", emoji: "💃" },
    { name: "Yoga", emoji: "🧘" },
    { name: "Temazcal", emoji: "🔥" },
    { name: "Reiki", emoji: "🌿" },
    { name: "Sonoterapia", emoji: "🔔" },
    { name: "Coaching", emoji: "🎯" }
  ])

  const [formData, setFormData] = useState({
    nombre: "",
    disciplinas: ["Biodanza"] as string[],
    ciudad: "",
    linaje: ""
  })
  const [customDiscInput, setCustomDiscInput] = useState("")

  const toggleDiscipline = (name: string) => {
    setFormData(prev => {
      const isSelected = prev.disciplinas.includes(name)
      const newDisciplinas = isSelected
        ? prev.disciplinas.filter(d => d !== name)
        : [...prev.disciplinas, name]
      return { ...prev, disciplinas: newDisciplinas }
    })
  }

  const handleAddCustomDiscipline = () => {
    if (!customDiscInput.trim()) return
    const standardized = standardizeDiscipline(customDiscInput)
    if (standardized) {
      const exists = availableDisciplines.some(d => d.name === standardized)
      if (!exists) {
        let emoji = "✨"
        if (standardized === "Astrología") emoji = "🪐"
        setAvailableDisciplines(prev => [...prev, { name: standardized, emoji }])
      }
      if (!formData.disciplinas.includes(standardized)) {
        setFormData(prev => ({
          ...prev,
          disciplinas: [...prev.disciplinas, standardized]
        }))
      }
      setCustomDiscInput("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.disciplinas.length === 0) {
      alert("Por favor selecciona al menos una disciplina.")
      return
    }

    setSubmittedDisciplines(formData.disciplinas)
    
    // Save to localStorage
    const newProposedNode = {
      id: Date.now(),
      n: formData.nombre,
      cats: formData.disciplinas,
      // Random coordinates in Santiago area
      lat: -33.45 + (Math.random() - 0.5) * 0.08,
      lng: -70.62 + (Math.random() - 0.5) * 0.08,
      info: `${formData.ciudad} · Linaje: ${formData.linaje}`,
      pending: true
    }

    try {
      const existing = localStorage.getItem("raiz_proposed_nodes")
      const list = existing ? JSON.parse(existing) : []
      list.push(newProposedNode)
      localStorage.setItem("raiz_proposed_nodes", JSON.stringify(list))
      // Trigger a storage event to update the map in real-time
      window.dispatchEvent(new Event("storage"))
    } catch (err) {
      console.error("Error saving node to localStorage", err)
    }

    setFormSubmitted(true)
    setTimeout(() => {
      setFormData({ nombre: "", disciplinas: ["Biodanza"], ciudad: "", linaje: "" })
      setFormSubmitted(false)
    }, 5000)
  }

  const handleCheckoutMock = (plan: string) => {
    setSelectedSubPlan(plan.toLowerCase())
    setSubscriptionStep("plans")
    setShowSubscriptionModal(true)
  }

  return (
    <div className="min-h-screen text-[#f2e9dd]" style={{ background: "#171310", fontFamily: "var(--font-inter), sans-serif" }}>
      
      {/* ─── NAV ─── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300"
        style={{
          background: "rgba(23, 19, 16, 0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(242, 233, 221, 0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12 duration-300"
              style={{ background: "linear-gradient(135deg, #e2622c 0%, #c99a3c 100%)" }}
            >
              <RaizIcon className="h-4.5 w-4.5 text-[#171310]" />
            </div>
            <div className="flex flex-col">
              <span className="font-fraunces text-xl font-bold tracking-tight leading-none text-[#f2e9dd]">
                Raíz<span className="text-[#e2622c]">·</span>Red
              </span>
              <span className="font-mono-plex text-[9px] uppercase tracking-widest text-[#a89a8d] mt-0.5">
                by Prinergia
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#mapa" className="text-sm font-medium hover:text-[#f2a154] transition-colors text-[#a89a8d]">
              Mapa Vivo
            </a>
            <a href="#eventos" className="text-sm font-medium hover:text-[#f2a154] transition-colors text-[#a89a8d]">
              Fuegos y Eventos
            </a>
            <a href="#manifiesto" className="text-sm font-medium hover:text-[#f2a154] transition-colors text-[#a89a8d]">
              Manifiesto
            </a>
            <a href="#registro" className="text-sm font-medium hover:text-[#f2a154] transition-colors text-[#a89a8d]">
              Mapear Linaje
            </a>
            <a href="#membresia" className="text-sm font-medium hover:text-[#f2a154] transition-colors text-[#a89a8d]">
              Sostener Red
            </a>
          </div>

          <div className="flex items-center gap-4">
            <LoginButton />
            <a
              className="hidden sm:inline-block font-mono-plex uppercase text-xs tracking-wider bg-[#e2622c] hover:bg-[#f2a154] text-[#171310] px-4 py-2.5 rounded-lg font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(226,98,44,0.25)]"
              href="#registro"
            >
              Encender mi nodo
            </a>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-24 pb-16 px-6">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-[#5c6b45] opacity-[0.08] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[45vw] h-[45vw] bg-[#e2622c] opacity-[0.06] blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero text content */}
          <div className="md:col-span-7 flex flex-col space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(242,233,221,0.1)] bg-[rgba(242,233,221,0.02)] w-fit backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#f2a154] animate-ping" />
              <span className="font-mono-plex text-xs text-[#f2a154] tracking-wider uppercase">
                Territorio · Linaje · Comunidad Horizontal
              </span>
            </div>

            <h1 className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-white tracking-tight">
              Cada facilitador es una <span className="text-[#e2622c] relative italic font-semibold">brasa.</span> <br />
              Juntos, somos el <span className="text-[#f2a154] font-semibold">fuego.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#a89a8d] max-w-xl leading-relaxed">
              Mapeamos de forma consentida escuelas y linajes de Biodanza, Yoga, Temazcal, Reiki, Meditación y toda disciplina con historia y tradición en el mundo. Comparte de quién aprendiste, enciende tu nodo global, y ayuda a que quien busca sanar encuentre el fuego más cercano.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#registro"
                className="px-6 py-3.5 rounded-lg bg-[#e2622c] hover:bg-[#f2a154] text-[#171310] font-bold transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_10px_25px_rgba(226,98,44,0.3)] text-sm"
              >
                Encender mi nodo
              </a>
              <a
                href="#mapa"
                className="px-6 py-3.5 rounded-lg border border-[rgba(242,233,221,0.15)] hover:border-[#f2a154] hover:text-[#f2a154] bg-[rgba(255,255,255,0.02)] transition-all duration-300 text-sm font-semibold"
              >
                Ver el mapa vivo
              </a>
            </div>

            {/* Social proof indicators */}
            <div className="flex items-center gap-6 pt-6 border-t border-[rgba(242,233,221,0.06)] w-fit">
              <div className="flex flex-col">
                <span className="font-fraunces text-2xl font-bold text-white leading-none">250+</span>
                <span className="text-[11px] text-[#a89a8d] font-mono-plex uppercase mt-1">Nodos Encendidos</span>
              </div>
              <div className="w-[1px] h-8 bg-[rgba(242,233,221,0.12)]" />
              <div className="flex flex-col">
                <span className="font-fraunces text-2xl font-bold text-white leading-none">12</span>
                <span className="text-[11px] text-[#a89a8d] font-mono-plex uppercase mt-1">Linajes Trazados</span>
              </div>
              <div className="w-[1px] h-8 bg-[rgba(242,233,221,0.12)]" />
              <div className="flex flex-col">
                <span className="font-fraunces text-2xl font-bold text-[#f2a154] leading-none">100%</span>
                <span className="text-[11px] text-[#a89a8d] font-mono-plex uppercase mt-1">Co-Propiedad Libre</span>
              </div>
            </div>
          </div>

          {/* Hero graphics - Glowing Video Loop */}
          <div className="md:col-span-5 flex justify-center items-center relative w-full">
            
            {/* Loop Glow Orbit Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[110%] h-[110%] rounded-full bg-[radial-gradient(circle,rgba(226,98,44,0.08)_0%,transparent_70%)]" />
            </div>

            {/* Premium Video Container with Glassmorphism Border & Glow */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[rgba(242,233,221,0.15)] bg-[#171310] shadow-[0_20px_50px_rgba(0,0,0,0.5)] group animate-float">
              {/* Subtle light leak backdrop */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#e2622c]/10 to-[#c99a3c]/10 rounded-3xl opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-700 pointer-events-none" />
              
              <video
                src="/images/miceliodevloop.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-[1.02]"
              />
              
              {/* Ambient overlay vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#171310]/40 via-transparent to-transparent pointer-events-none z-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Roots wave separator */}
      <div className="w-full overflow-hidden leading-[0] fill-none stroke-[2] py-4">
        <svg className="w-full h-[32px] md:h-[48px]" viewBox="0 0 1000 64" preserveAspectRatio="none">
          <path
            d="M0 32 Q 250 8 500 32 T 1000 32"
            stroke="var(--musgo)"
            strokeDasharray="6 6"
            style={{ opacity: 0.6 }}
          />
        </svg>
      </div>

      {/* ─── MAP SECTION ─── */}
      <section id="mapa" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <p className="font-mono-plex text-xs text-[#e2622c] tracking-widest uppercase mb-2">
              Territorio Vivo de Linajes
            </p>
            <h2 className="font-fraunces text-3xl sm:text-4xl font-bold text-white">
              El Mapa de la Red
            </h2>
            <p className="text-sm text-[#a89a8d] mt-2 max-w-xl">
              Filtra por disciplina. Los puntos con contorno dorado/ámbar representan "Fuegos Activos" o templos tradicionales que actúan como nodos regionales de sanación ancestral.
            </p>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 md:max-w-md">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`px-4 py-2 rounded-full font-mono-plex text-xs tracking-wider transition-all duration-300 border ${
                  selectedCategory === cat.label
                    ? "bg-[#e2622c] border-[#e2622c] text-[#171310] font-bold"
                    : "border-[rgba(242,233,221,0.1)] bg-[#211a15] text-[#f2e9dd] hover:border-[rgba(242,233,221,0.25)]"
                }`}
              >
                <span className="mr-1.5">{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Leaflet Map */}
        <div className="relative shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <RaizMap selectedCategory={selectedCategory} />
        </div>
      </section>

      {/* ─── EVENTS SECTION ─── */}
      <section id="eventos" className="relative py-24 bg-[#1a1410] px-6 border-y border-[rgba(242,233,221,0.06)] overflow-hidden">
        {/* Floating ember particles */}
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="festive-ember"
            style={{
              left: `${8 + i * 8}%`,
              animationDelay: `${i * 0.9}s`,
              animationDuration: `${9 + (i % 4) * 2}s`,
              width: i % 3 === 0 ? '5px' : '3px',
              height: i % 3 === 0 ? '5px' : '3px',
              background: i % 2 === 0 ? '#f2a154' : '#c99a3c',
              ['--x-offset' as any]: `${(i % 2 === 0 ? 1 : -1) * (15 + i * 5)}px`
            }}
          />
        ))}

        {/* Background warm ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#c99a3c] opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-[#e2622c] opacity-[0.04] blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="font-mono-plex text-xs text-[#c99a3c] tracking-[0.25em] uppercase mb-4 flex items-center justify-center gap-2">
              <span>🔥</span> Fuegos Encendidos <span>🔥</span>
            </p>
            <h2 className="font-fraunces text-4xl sm:text-5xl font-bold text-white mb-4">
              Próximos Encuentros de la Red
            </h2>
            <p className="text-sm text-[#a89a8d] leading-relaxed">
              Actividades donde la comunidad se encuentra, festeja, danza, cuida la tierra y comparte alimentos.
              El pulso latente de nuestras tradiciones locales.
            </p>
          </div>

          {/* ─── KIVA FEATURED CARD ─── */}
          <div className="kiva-featured-card glow-mystic relative rounded-3xl border overflow-hidden mb-14 group">
            {/* Inner glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(201,154,60,0.07)] via-transparent to-[rgba(226,98,44,0.07)] pointer-events-none z-0" />

            <div className="relative z-10 flex flex-col lg:flex-row">
              {/* Image side */}
              <div className="relative lg:w-1/2 h-72 lg:h-auto overflow-hidden">
                <img
                  src="/images/kiva_chile_2026.jpg"
                  alt="Kiva — Raíces de la Tierra: Ceremonia del Fuego Sagrado"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                {/* Image gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#1a1410] hidden lg:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1410] via-transparent to-transparent lg:hidden" />
                {/* Floating fire emoji */}
                <div className="absolute top-4 left-4 flex gap-1">
                  <span className="text-2xl animate-pulse">🔥</span>
                </div>
              </div>

              {/* Content side */}
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
                <div>
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-mono-plex tracking-widest uppercase font-bold bg-[rgba(201,154,60,0.2)] text-[#c99a3c] border border-[rgba(201,154,60,0.4)]">
                      🌟 Evento Sin Precedentes
                    </span>
                    <span className="px-3 py-1.5 rounded-full text-[10px] font-mono-plex tracking-wider uppercase font-semibold bg-[rgba(226,98,44,0.15)] text-[#f2a154] border border-[rgba(226,98,44,0.3)]">
                      Fuego Ancestral
                    </span>
                    <span className="font-mono-plex text-[10px] text-[#a89a8d] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#c99a3c]" />
                      12 – 15 Noviembre, 2026
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-fraunces text-4xl lg:text-5xl font-bold text-white mb-4 group-hover:text-[#f2a154] transition-colors duration-500 leading-tight">
                    Kiva Chile 2026
                    <span className="block text-[#c99a3c] text-3xl lg:text-4xl">El Fuego que une América</span>
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#b5a898] leading-relaxed mb-8">
                    En Chile comenzará el rezo que impulsará la Kiva de Tierra del Fuego hasta Alaska.
                    Un encuentro espiritual sin precedentes donde se reúne el rezo y la medicina de abuelas, abuelos y <strong className="text-[#f2e9dd]">líderes ancestrales de muchas regiones</strong> de nuestro continente.
                  </p>

                  {/* Highlights */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {KIVA_HIGHLIGHTS.map((h) => (
                      <li key={h.text} className="flex items-start gap-2.5 text-xs text-[#a89a8d]">
                        <span className="text-lg leading-none mt-0.5 flex-shrink-0">{h.icon}</span>
                        <span className="leading-snug">{h.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-[rgba(242,233,221,0.08)] pt-6">
                  <div className="flex items-center gap-2 text-sm text-[#a89a8d]">
                    <MapPin className="w-4 h-4 text-[#e2622c] flex-shrink-0" />
                    <span>Camping Callejones, Región de O'Higgins</span>
                  </div>
                  <a
                    href="https://www.instagram.com/familiaraicesdelatierra/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#c99a3c] to-[#e2622c] text-[#171310] font-mono-plex text-xs font-bold tracking-wider uppercase hover:shadow-[0_0_30px_rgba(201,154,60,0.4)] hover:scale-105 transition-all duration-300"
                  >
                    Unirme a la Kiva <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                </div>
              </div>
            </div>
          </div>

          {/* ─── OTHER EVENTS GRID ─── */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EVENTOS.map((ev) => (
              <div
                key={ev.title}
                className="group relative rounded-2xl border border-[rgba(242,233,221,0.07)] bg-[#171310] hover:border-opacity-80 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
                style={{ ['--ev-color' as any]: ev.color }}
              >
                {/* Hover glow overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none z-0 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 30%, ${ev.color}, transparent 70%)` }}
                />

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171310] via-[rgba(23,19,16,0.3)] to-transparent" />
                  {/* Badge over image */}
                  <span
                    className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-mono-plex tracking-wider uppercase font-bold backdrop-blur-sm"
                    style={{
                      background: `${ev.color}30`,
                      color: ev.color,
                      border: `1px solid ${ev.color}50`
                    }}
                  >
                    {ev.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-1.5 mb-3 text-[#a89a8d] font-mono-plex text-[10px]">
                    <Calendar className="w-3 h-3" style={{ color: ev.color }} />
                    <span>{ev.date}</span>
                  </div>

                  <h3 className="font-fraunces text-lg font-bold text-white mb-2 group-hover:text-[#f2a154] transition-colors leading-snug">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-[#a89a8d] leading-relaxed flex-1 mb-5">
                    {ev.desc}
                  </p>

                  <div className="border-t border-[rgba(242,233,221,0.06)] pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-[#a89a8d]">
                      <MapPin className="w-3 h-3 text-[#e2622c] flex-shrink-0" />
                      <span className="truncate max-w-[140px]">{ev.location}</span>
                    </div>
                    <button
                      onClick={() => alert(`Inscripción para: ${ev.title}. Te contactaremos con los facilitadores organizadores del evento.`)}
                      className="text-xs font-mono-plex font-semibold flex items-center gap-1 transition-colors group-hover:text-white"
                      style={{ color: ev.color }}
                    >
                      Unirme <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MANIFIESTO SECTION ─── */}
      <section id="manifiesto" className="py-24 px-6 max-w-6xl mx-auto relative overflow-hidden">
        {/* Ambient Glowing trails and halos */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#5c6b45] opacity-[0.08] blur-[120px] rounded-full pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-[#e2622c] opacity-[0.05] blur-[120px] rounded-full pointer-events-none animate-pulse duration-[10000ms]" />

        {/* Epic sovereign grid line overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(242,233,221,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(242,233,221,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

        <div className="relative z-10 border border-[rgba(242,233,221,0.08)] rounded-[32px] p-8 sm:p-12 bg-gradient-to-b from-[#211a15]/95 via-[#1d1612]/95 to-[#171310]/95 backdrop-blur-xl shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
          
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-[rgba(92,107,69,0.2)] to-[rgba(226,98,44,0.15)] border border-[rgba(242,233,221,0.1)] shadow-[0_0_20px_rgba(92,107,69,0.1)] relative">
              <Shield className="w-7 h-7 text-[#f2a154] animate-float" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e2622c] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#e2622c]"></span>
              </span>
            </div>
          </div>

          <h2 className="font-fraunces text-3xl sm:text-5xl text-center font-bold bg-gradient-to-r from-white via-[#f2a154] to-white bg-clip-text text-transparent mb-4 leading-tight py-2">
            Manifiesto de Co-Propiedad & Transparencia Digital
          </h2>

          <p className="text-xs sm:text-sm text-center text-[#a89a8d] max-w-2xl mx-auto mb-12 leading-relaxed font-mono-plex uppercase tracking-widest">
            Tejiendo un ecosistema tecnológico libre de algoritmos adictivos y corporaciones mediadoras.
          </p>

          {/* Tab Selection buttons - 3 Tabs now */}
          <div className="flex flex-col sm:flex-row justify-center p-1.5 bg-[#171310] rounded-2xl max-w-xl mx-auto mb-12 border border-[rgba(242,233,221,0.06)] shadow-inner gap-1">
            <button
              onClick={() => setManifestoTab("commitment")}
              className={`flex-1 py-3 px-4 rounded-xl text-[10px] sm:text-xs font-mono-plex font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                manifestoTab === "commitment"
                  ? "bg-[#5c6b45] text-white shadow-[0_4px_12px_rgba(92,107,69,0.3)] border border-[#748757]/30"
                  : "text-[#a89a8d] hover:text-white"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              1. Compromiso Humano
            </button>
            <button
              onClick={() => setManifestoTab("architecture")}
              className={`flex-1 py-3 px-4 rounded-xl text-[10px] sm:text-xs font-mono-plex font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                manifestoTab === "architecture"
                  ? "bg-[#e2622c] text-white shadow-[0_4px_12px_rgba(226,98,44,0.3)] border border-[#ef7b4b]/30"
                  : "text-[#a89a8d] hover:text-white"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              2. Arquitectura Digital
            </button>
            <button
              onClick={() => setManifestoTab("sovereignty")}
              className={`flex-1 py-3 px-4 rounded-xl text-[10px] sm:text-xs font-mono-plex font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                manifestoTab === "sovereignty"
                  ? "bg-gradient-to-r from-[#e2622c] to-[#c99a3c] text-white shadow-[0_4px_12px_rgba(201,154,60,0.3)] border border-[#c99a3c]/30"
                  : "text-[#a89a8d] hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              3. Soberanía de Software
            </button>
          </div>

          {/* Content Wrapper with Grid layouts */}
          <div className="min-h-[420px] transition-all duration-500">
            {manifestoTab === "commitment" && (
              <div className="grid md:grid-cols-12 gap-8 items-center animate-fadeIn">
                {/* Visual Side */}
                <div className="md:col-span-5 space-y-4">
                  <div className="relative group rounded-3xl overflow-hidden border border-[rgba(242,161,84,0.15)] bg-[#171310] aspect-square shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                    {/* Glowing mesh overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(23,19,16,0.9)] via-[rgba(23,19,16,0.2)] to-transparent z-10" />
                    <img 
                      src={
                        commitmentImage === "tree"
                          ? "/images/glowing_tree.png"
                          : commitmentImage === "assembly"
                          ? "/images/ancestral_network.jpg"
                          : "/images/spirit_bison.jpg"
                      }
                      alt={
                        commitmentImage === "tree"
                          ? "Árbol Raíz digital organic tree"
                          : commitmentImage === "assembly"
                          ? "Ancestral fire gathering nodes"
                          : "Bison spirit community fire"
                      }
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05]"
                    />
                    <div className="absolute bottom-4 inset-x-4 z-20 text-center">
                      <span className="font-mono-plex text-[9px] uppercase tracking-widest text-[#f2a154] bg-[#171310]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[rgba(242,161,84,0.2)] shadow-md">
                        {commitmentImage === "tree"
                          ? "El Gran Árbol Raíz: Ecosistema Vivo"
                          : commitmentImage === "assembly"
                          ? "Gobernanza del Fuego: Nodos Activos"
                          : "Espíritu Común y Co-Propiedad"}
                      </span>
                    </div>
                  </div>

                  {/* Selector Buttons */}
                  <div className="flex gap-1 bg-[#171310] p-1 rounded-xl border border-[rgba(242,233,221,0.06)] shadow-inner">
                    <button
                      onClick={() => setCommitmentImage("tree")}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[9px] font-mono-plex font-bold tracking-wider uppercase transition-all duration-300 ${
                        commitmentImage === "tree"
                          ? "bg-[#5c6b45] text-white shadow-sm"
                          : "text-[#a89a8d] hover:text-white"
                      }`}
                    >
                      Árbol
                    </button>
                    <button
                      onClick={() => setCommitmentImage("assembly")}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[9px] font-mono-plex font-bold tracking-wider uppercase transition-all duration-300 ${
                        commitmentImage === "assembly"
                          ? "bg-[#5c6b45] text-white shadow-sm"
                          : "text-[#a89a8d] hover:text-white"
                      }`}
                    >
                      Asamblea
                    </button>
                    <button
                      onClick={() => setCommitmentImage("spirit")}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[9px] font-mono-plex font-bold tracking-wider uppercase transition-all duration-300 ${
                        commitmentImage === "spirit"
                          ? "bg-[#5c6b45] text-white shadow-sm"
                          : "text-[#a89a8d] hover:text-white"
                      }`}
                    >
                      Espíritu
                    </button>
                  </div>
                </div>

                {/* Text Side */}
                <div className="md:col-span-7 space-y-6">
                  <div>
                    <h3 className="font-fraunces text-2xl text-[#f2a154] font-bold mb-2">
                      ¿Por qué puedes confiar en Red Raíz?
                    </h3>
                    <p className="text-xs text-[#a89a8d] leading-relaxed">
                      Las plataformas comerciales mercantilizan tu presencia y tus lazos afectivos. Red Raíz está diseñada desde su base ética para proteger a la comunidad y asegurar la confianza mutua.
                    </p>
                  </div>

                  <div className="space-y-4 font-sans">
                    <div className="flex gap-3.5 items-start">
                      <div className="w-6 h-6 rounded-full bg-[rgba(92,107,69,0.15)] border border-[rgba(92,107,69,0.25)] flex items-center justify-center text-[#b5c79e] shrink-0 mt-0.5">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="font-fraunces text-base font-semibold text-white">Gobernanza Horizontal e Inteligencia Colectiva</h4>
                        <p className="text-[11px] text-[#a89a8d] leading-relaxed mt-1">
                          Sin juntas directivas corporativas ni capitales de riesgo. La propiedad del código y la plataforma es común. Las decisiones sobre las reglas del mapa se acuerdan comunitariamente entre los nodos de facilitadores activos.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3.5 items-start">
                      <div className="w-6 h-6 rounded-full bg-[rgba(92,107,69,0.15)] border border-[rgba(92,107,69,0.25)] flex items-center justify-center text-[#b5c79e] shrink-0 mt-0.5">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="font-fraunces text-base font-semibold text-white">Custodia Consentida y Derecho a Retirada</h4>
                        <p className="text-[11px] text-[#a89a8d] leading-relaxed mt-1">
                          Tus datos de contacto, linaje y ubicación te pertenecen. En cualquier momento puedes editar tu información, ocultarla o darte de baja por completo. Tu perfil está a salvo de scraping comercial y uso para entrenamiento de IAs comerciales.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3.5 items-start">
                      <div className="w-6 h-6 rounded-full bg-[rgba(92,107,69,0.15)] border border-[rgba(92,107,69,0.25)] flex items-center justify-center text-[#b5c79e] shrink-0 mt-0.5">
                        <Coins className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="font-fraunces text-base font-semibold text-white">Sostenibilidad Sin Lucro (Membresías P2P)</h4>
                        <p className="text-[11px] text-[#a89a8d] leading-relaxed mt-1">
                          Los aportes de los miembros (Semilla, Fuego y Guardián) cubren de forma auditada los servidores e infraestructura. El remanente se destina a la promoción colectiva de eventos comunitarios, sin desviar ganancias a intermediarios.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {manifestoTab === "architecture" && (
              <div className="grid md:grid-cols-12 gap-8 items-center animate-fadeIn">
                {/* Visual Side - Interactive Architecture (Technical vs. Organic) */}
                <div className="md:col-span-5 space-y-4">
                  {/* Selector at the top of the card */}
                  <div className="flex bg-[#171310] p-1 rounded-2xl border border-[rgba(242,233,221,0.06)] shadow-inner">
                    <button
                      onClick={() => setArchitectureVisualMode("technical")}
                      className={`flex-1 py-2 px-3 rounded-xl text-[9px] font-mono-plex font-bold tracking-wider uppercase transition-all duration-300 ${
                        architectureVisualMode === "technical"
                          ? "bg-[#e2622c] text-white shadow-sm"
                          : "text-[#a89a8d] hover:text-white"
                      }`}
                    >
                      Esquema de Red
                    </button>
                    <button
                      onClick={() => setArchitectureVisualMode("organic")}
                      className={`flex-1 py-2 px-3 rounded-xl text-[9px] font-mono-plex font-bold tracking-wider uppercase transition-all duration-300 ${
                        architectureVisualMode === "organic"
                          ? "bg-gradient-to-r from-[#e2622c] to-[#c99a3c] text-white shadow-sm"
                          : "text-[#a89a8d] hover:text-white"
                      }`}
                    >
                      Visión Orgánica
                    </button>
                  </div>

                  {architectureVisualMode === "technical" ? (
                    <div className="relative group rounded-3xl border border-[rgba(226,98,44,0.15)] bg-[#171310]/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-center min-h-[380px]">
                      <div className="absolute top-4 right-4 text-[9px] font-mono-plex uppercase text-[#a89a8d] tracking-widest bg-[#211a15] px-2 py-0.5 rounded border border-[rgba(242,233,221,0.06)]">
                        Arquitectura de Confianza
                      </div>
                      
                      {/* SVG Diagram representing the technology flow */}
                      <svg viewBox="0 0 320 360" className="w-full h-auto max-w-[340px] mx-auto overflow-visible mt-6">
                        <defs>
                          <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#e2622c" />
                            <stop offset="100%" stopColor="#5c6b45" />
                          </linearGradient>
                          <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                            <feMerge>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>

                        {/* Tree branches/lines */}
                        <path d="M 160 300 L 160 190" stroke="url(#cyberGrad)" strokeWidth="3" fill="none" />
                        <path d="M 160 190 L 60 130" stroke="#e2622c" strokeWidth="2" fill="none" strokeDasharray="3,3" />
                        <path d="M 160 190 L 260 130" stroke="#5c6b45" strokeWidth="2" fill="none" strokeDasharray="3,3" />
                        <path d="M 60 130 L 60 60" stroke="#e2622c" strokeWidth="2" fill="none" />
                        <path d="M 260 130 L 260 60" stroke="#5c6b45" strokeWidth="2" fill="none" />
                        
                        {/* Nodes */}
                        {/* Root: Identity */}
                        <circle cx="160" cy="300" r="22" fill="#211a15" stroke="#e2622c" strokeWidth="2.5" filter="url(#glow)" />
                        <text x="160" y="303.5" fill="#ffffff" fontSize="9.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">LOGIN</text>
                        <text x="160" y="334" fill="#a89a8d" fontSize="9" fontFamily="monospace" textAnchor="middle">NextAuth (Seguridad P2P)</text>
                        
                        {/* Server core */}
                        <circle cx="160" cy="190" r="24" fill="#211a15" stroke="url(#cyberGrad)" strokeWidth="2.5" filter="url(#glow)" />
                        <text x="160" y="193.5" fill="#ffffff" fontSize="9.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">NEXT.JS</text>
                        <text x="160" y="226" fill="#a89a8d" fontSize="9" fontFamily="monospace" textAnchor="middle">Servidor Soberano</text>

                        {/* Database Vault */}
                        <circle cx="60" cy="130" r="20" fill="#211a15" stroke="#e2622c" strokeWidth="2.5" filter="url(#glow)" />
                        <text x="60" y="133.5" fill="#ffffff" fontSize="9.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">RLS</text>
                        
                        {/* Map View */}
                        <circle cx="260" cy="130" r="20" fill="#211a15" stroke="#5c6b45" strokeWidth="2.5" filter="url(#glow)" />
                        <text x="260" y="133.5" fill="#ffffff" fontSize="9.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">MAPA</text>

                        {/* Leaf nodes */}
                        <circle cx="60" cy="60" r="14" fill="#171310" stroke="#e2622c" strokeWidth="1.5" />
                        <text x="60" y="63" fill="#a89a8d" fontSize="8" fontFamily="monospace" textAnchor="middle">BÓVEDA</text>
                        <text x="60" y="40" fill="#f2a154" fontSize="9" fontFamily="monospace" textAnchor="middle">Supabase</text>

                        <circle cx="260" cy="60" r="14" fill="#171310" stroke="#5c6b45" strokeWidth="1.5" />
                        <text x="260" y="63" fill="#a89a8d" fontSize="8" fontFamily="monospace" textAnchor="middle">NUDO</text>
                        <text x="260" y="40" fill="#b5c79e" fontSize="9" fontFamily="monospace" textAnchor="middle">Leaflet</text>
                      </svg>

                      <p className="text-[10px] text-center text-[#a89a8d] leading-relaxed mt-4">
                        <strong>El Flujo de Confianza</strong>: Tu acceso (Google) valida tu identidad, Next.js renderiza sin rastrearte, Supabase RLS restringe las ediciones a tu propio perfil y el Mapa dibuja la red en el navegador con anonimato territorial.
                      </p>
                    </div>
                  ) : (
                    <div className="relative group rounded-3xl overflow-hidden border border-[rgba(226,98,44,0.15)] bg-[#171310] flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] min-h-[380px]">
                      <div className="relative aspect-square w-full overflow-hidden flex-grow">
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(23,19,16,0.9)] via-[rgba(23,19,16,0.2)] to-transparent z-10" />
                        <img 
                          src={
                            organicArchImage === "mycelium"
                              ? "/images/mycelium_matrix.jpg"
                              : "/images/network_puzzle.jpg"
                          }
                          alt={
                            organicArchImage === "mycelium"
                              ? "Mycelium network with digital code"
                              : "Glowing puzzle piece with root structure"
                          }
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05]"
                        />
                        <div className="absolute bottom-4 inset-x-4 z-20 text-center">
                          <span className="font-mono-plex text-[9px] uppercase tracking-widest text-[#ffd700] bg-[#171310]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[rgba(226,98,44,0.2)] shadow-glow">
                            {organicArchImage === "mycelium"
                              ? "Red Micelial: Interconexión Natural"
                              : "Encaje Nodal: Modularidad Libre"}
                          </span>
                        </div>
                      </div>

                      {/* Sub-selector buttons inside organic card */}
                      <div className="p-3 bg-[#171310]/95 border-t border-[rgba(242,233,221,0.06)] flex gap-2">
                        <button
                          onClick={() => setOrganicArchImage("mycelium")}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-[8px] font-mono-plex font-bold tracking-wider uppercase transition-all duration-200 text-center ${
                            organicArchImage === "mycelium"
                              ? "bg-[#e2622c] text-white"
                              : "text-[#a89a8d] hover:text-white"
                          }`}
                        >
                          Micelio Digital
                        </button>
                        <button
                          onClick={() => setOrganicArchImage("puzzle")}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-[8px] font-mono-plex font-bold tracking-wider uppercase transition-all duration-200 text-center ${
                            organicArchImage === "puzzle"
                              ? "bg-[#e2622c] text-white"
                              : "text-[#a89a8d] hover:text-white"
                          }`}
                        >
                          Encaje Nodal
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Text Side */}
                <div className="md:col-span-7 space-y-6">
                  <div>
                    <h3 className="font-fraunces text-2xl text-[#f2a154] font-bold mb-2">
                      La Arquitectura del Código Abierto
                    </h3>
                    <p className="text-xs text-[#a89a8d] leading-relaxed">
                      El software de Red Raíz utiliza tecnologías modernas descentralizadas para asegurar que el sistema sea inmune a la apropiación de datos de terceros y fallos de seguridad comunes.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-[#171310]/40 p-4 rounded-xl border border-[rgba(242,233,221,0.04)] hover:border-[#e2622c]/20 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Globe className="w-4 h-4 text-[#e2622c]" />
                        <h4 className="font-fraunces text-xs font-bold text-white">Next.js & React (El Motor)</h4>
                      </div>
                      <p className="text-[10px] text-[#a89a8d] leading-relaxed">
                        Páginas pre-generadas en el servidor. Esto significa velocidad instantánea en zonas de baja señal sin scripts espías de Google Tag Manager o Facebook Pixel en el navegador.
                      </p>
                    </div>

                    <div className="bg-[#171310]/40 p-4 rounded-xl border border-[rgba(242,233,221,0.04)] hover:border-[#e2622c]/20 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Key className="w-4 h-4 text-[#e2622c]" />
                        <h4 className="font-fraunces text-xs font-bold text-white">NextAuth.js (La Seguridad)</h4>
                      </div>
                      <p className="text-[10px] text-[#a89a8d] leading-relaxed">
                        Control por proveedor de identidad OAuth (Google) o enlaces mágicos directos. <strong>Red Raíz nunca almacena ni conoce tu contraseña</strong>, eliminando filtraciones accidentales.
                      </p>
                    </div>

                    <div className="bg-[#171310]/40 p-4 rounded-xl border border-[rgba(242,233,221,0.04)] hover:border-[#e2622c]/20 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Database className="w-4 h-4 text-[#e2622c]" />
                        <h4 className="font-fraunces text-xs font-bold text-white">Row-Level Security (El Cofre)</h4>
                      </div>
                      <p className="text-[10px] text-[#a89a8d] leading-relaxed">
                        Políticas de base de datos RLS aplicadas en Supabase. El motor de base de datos rechaza a nivel de hardware cualquier intento de modificación de perfil que no sea del dueño.
                      </p>
                    </div>

                    <div className="bg-[#171310]/40 p-4 rounded-xl border border-[rgba(242,233,221,0.04)] hover:border-[#e2622c]/20 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-1.5">
                        <MapPin className="w-4 h-4 text-[#e2622c]" />
                        <h4 className="font-fraunces text-xs font-bold text-white">Leaflet & Mapbox (El Territorio)</h4>
                      </div>
                      <p className="text-[10px] text-[#a89a8d] leading-relaxed">
                        Renderizado local en cliente. No recopilamos las coordenadas exactas de tu GPS ni rastreamos tus desplazamientos; solo mostramos puntos aproximados acordados voluntariamente.
                      </p>
                    </div>
                  </div>

                  {/* Únete al Equipo de Desarrollo */}
                  <div className="bg-[#1c1815] p-5 rounded-2xl border border-[rgba(226,98,44,0.15)] shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#e2622c]/5 rounded-full blur-2xl group-hover:bg-[#e2622c]/10 transition-all duration-500 pointer-events-none" />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                      <div className="space-y-1.5 max-w-md">
                        <h4 className="font-fraunces text-sm font-bold text-white flex items-center gap-2">
                          <Code className="w-4 h-4 text-[#e2622c]" />
                          Únete al Equipo de Desarrollo
                        </h4>
                        <p className="text-[10px] text-[#a89a8d] leading-relaxed">
                          Red Raíz es un proyecto de software libre y colaborativo. Si resuenas con nuestra visión y quieres colaborar co-creando este ecosistema digital, puedes sumarte a nosotros.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2.5 shrink-0 w-full sm:w-auto">
                        <Link
                          href="/dev"
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#e2622c] hover:bg-[#ef7b4b] text-white text-[10px] font-mono-plex font-bold tracking-wider uppercase px-4 py-2.5 rounded-xl transition-all duration-300 shadow-[0_4px_12px_rgba(226,98,44,0.2)] hover:shadow-[0_4px_16px_rgba(226,98,44,0.4)] border border-[#ef7b4b]/20"
                        >
                          Postular al Equipo
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        <a
                          href="https://github.com/AiesTreiA/Prinergia#red-ra%C3%ADz--ecosistema-digital-de-linajes--saberes"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#211a15] hover:bg-[#2c231c] text-[#a89a8d] hover:text-white text-[10px] font-mono-plex font-bold tracking-wider uppercase px-4 py-2.5 rounded-xl transition-all duration-300 border border-[rgba(242,233,221,0.08)] hover:border-[rgba(242,233,221,0.15)]"
                        >
                          <Github className="w-3.5 h-3.5" />
                          GitHub Repo
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {manifestoTab === "sovereignty" && (
              <div className="grid md:grid-cols-12 gap-8 items-center animate-fadeIn">
                {/* Visual Side */}
                <div className="md:col-span-5 space-y-4">
                  <div className="relative group rounded-3xl overflow-hidden border border-[rgba(201,154,60,0.25)] bg-[#171310] aspect-square shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                    {/* Glowing mesh overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(23,19,16,0.9)] via-[rgba(23,19,16,0.1)] to-transparent z-10" />
                    <img 
                      src={
                        sovereigntyImage === "canopy"
                          ? "/images/sovereign_canopy.png"
                          : "/images/spirit_bison.jpg"
                      }
                      alt="Sovereignty digital canopy or spirit bison" 
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05]"
                    />
                    <div className="absolute bottom-4 inset-x-4 z-20 text-center">
                      <span className="font-mono-plex text-[9px] uppercase tracking-widest text-[#ffd700] bg-[#171310]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[rgba(201,154,60,0.25)] shadow-glow">
                        {sovereigntyImage === "canopy"
                          ? "Gobernanza Autónoma Libre"
                          : "Soberanía y Espíritu Común"}
                      </span>
                    </div>
                  </div>

                  {/* Selector buttons */}
                  <div className="flex gap-2 justify-center bg-[#171310]/60 p-1.5 rounded-xl border border-[rgba(242,233,221,0.04)]">
                    <button
                      onClick={() => setSovereigntyImage("canopy")}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[9px] font-mono-plex font-bold tracking-wider uppercase transition-all duration-200 text-center ${
                        sovereigntyImage === "canopy"
                          ? "bg-[#c99a3c] text-[#171310] shadow-sm font-extrabold"
                          : "text-[#a89a8d] hover:text-white"
                      }`}
                    >
                      Canopea
                    </button>
                    <button
                      onClick={() => setSovereigntyImage("spirit")}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[9px] font-mono-plex font-bold tracking-wider uppercase transition-all duration-200 text-center ${
                        sovereigntyImage === "spirit"
                          ? "bg-[#c99a3c] text-[#171310] shadow-sm font-extrabold"
                          : "text-[#a89a8d] hover:text-white"
                      }`}
                    >
                      Espíritu
                    </button>
                  </div>
                </div>

                {/* Text Side */}
                <div className="md:col-span-7 space-y-6">
                  <div>
                    <h3 className="font-fraunces text-2xl text-[#f2a154] font-bold mb-2">
                      Trascendiendo a las Corporaciones
                    </h3>
                    <p className="text-xs text-[#a89a8d] leading-relaxed">
                      La Web corporativa (Meta, Google, AWS) se construyó para lucrar con la desconexión social mediante feeds adictivos y venta de perfiles. En Red Raíz, el software sirve para reconectarnos en la Tierra y devolver el control absoluto a las personas.
                    </p>
                  </div>

                  {/* Sovereignty Dashboard */}
                  <div className="bg-[#171310]/75 p-6 rounded-2xl border border-[rgba(242,233,221,0.06)] space-y-4 shadow-inner relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#5c6b45] opacity-[0.05] blur-[20px] rounded-full" />
                    
                    <div className="flex justify-between items-center border-b border-[rgba(242,233,221,0.06)] pb-3">
                      <span className="font-mono-plex text-[9px] uppercase tracking-wider text-[#ffd700] font-bold">Consola de Estado Soberano</span>
                      <span className="text-[8px] bg-[rgba(92,107,69,0.15)] text-[#b5c79e] border border-[rgba(92,107,69,0.3)] px-2 py-0.5 rounded font-mono-plex uppercase animate-pulse">● Conexión Activa</span>
                    </div>

                    <div className="space-y-3 font-mono-plex text-[10px] text-[#a89a8d]">
                      {/* Metric 1 */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span>SOBERANÍA DE DATOS</span>
                          <span className="text-white font-bold">100% (LOCAL & CONSENTIDO)</span>
                        </div>
                        <div className="w-full bg-[#211a15] rounded-full h-1.5 border border-[rgba(242,233,221,0.04)]">
                          <div className="bg-[#5c6b45] h-full rounded-full w-[100%] shadow-[0_0_10px_rgba(92,107,69,0.3)] transition-all duration-1000" />
                        </div>
                      </div>

                      {/* Metric 2 */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span>INTERMEDIACIÓN ALGORÍTMICA</span>
                          <span className="text-[#e2622c] font-bold">0% (SIN FEEDS DE ADICCIÓN)</span>
                        </div>
                        <div className="w-full bg-[#211a15] rounded-full h-1.5 border border-[rgba(242,233,221,0.04)]">
                          <div className="bg-[#e2622c] h-full rounded-full w-[0%] transition-all duration-1000" />
                        </div>
                      </div>

                      {/* Metric 3 */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span>COMISIÓN FINANCIERA CORPORATIVA</span>
                          <span className="text-white font-bold">0% (SOPORTE DIRECTO SERVIDOR)</span>
                        </div>
                        <div className="w-full bg-[#211a15] rounded-full h-1.5 border border-[rgba(242,233,221,0.04)]">
                          <div className="bg-gradient-to-r from-[#e2622c] to-[#c99a3c] h-full rounded-full w-[100%] transition-all duration-1000" />
                        </div>
                      </div>

                      {/* Metric 4 */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span>PROPIEDAD DE LA PLATAFORMA</span>
                          <span className="text-[#b5c79e] font-bold">COLECTIVA / BIEN COMÚN</span>
                        </div>
                        <div className="w-full bg-[#211a15] rounded-full h-1.5 border border-[rgba(242,233,221,0.04)]">
                          <div className="bg-[#5c6b45] h-full rounded-full w-[100%] transition-all duration-1000" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-[#a89a8d] leading-relaxed italic">
                    Al utilizar un diseño de código abierto y aportes voluntarios en CLP o criptomonedas estables transparentadas en tesorería abierta, fundamos una isla autónoma de resistencia digital para las medicinas tradicionales de nuestro continente.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-[rgba(242,233,221,0.06)] text-center text-[10px] text-[#a89a8d] font-mono-plex uppercase tracking-widest">
            <span>Tecnologías abiertas y soberanas para proteger el pulso medicinal de nuestros territorios.</span>
          </div>
        </div>
      </section>

      {/* ─── GALLERY SECTION ─── */}
      <section id="esencia" className="py-24 px-6 max-w-7xl mx-auto border-t border-[rgba(242,233,221,0.06)]">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="font-mono-plex text-xs text-[#e2622c] tracking-widest uppercase mb-3">
            El Pulso de la Comunidad
          </p>
          <h2 className="font-fraunces text-3xl sm:text-4xl font-bold text-white">
            La Esencia de la Red
          </h2>
          <p className="text-sm text-[#a89a8d] mt-3">
            Nuestros encuentros, ceremonias y momentos de re-conexión sagrada con la vida, el bosque y la comunidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={item.title}
              className="group relative rounded-2xl overflow-hidden border border-[rgba(242,233,221,0.08)] bg-[#211a15] h-[340px] shadow-[0_12px_30px_rgba(0,0,0,0.4)] transition-all duration-500 hover:border-[#f2a154] hover:shadow-[0_15px_45px_rgba(242,161,84,0.08)] hover:-translate-y-1"
            >
              {/* Image */}
              <img
                src={imgSrcs[idx]}
                alt={item.title}
                onError={() => {
                  if (item.fallbackSrc && imgSrcs[idx] !== item.fallbackSrc) {
                    setImgSrcs(prev => {
                      const copy = [...prev]
                      copy[idx] = item.fallbackSrc!
                      return copy
                    })
                  }
                }}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-[1.05]"
              />

              {/* Glassmorphic info overlay (always visible on bottom, expanding on hover) */}
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[rgba(23,19,16,0.95)] via-[rgba(23,19,16,0.7)] to-transparent pt-12 transition-all duration-500 flex flex-col justify-end min-h-[140px]">
                <span className="font-mono-plex text-[9px] uppercase tracking-widest text-[#f2a154] font-semibold mb-1">
                  Encuentros & Linaje
                </span>
                <h3 className="font-fraunces text-lg font-bold text-white group-hover:text-[#f2a154] transition-colors leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-[#a89a8d] mt-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-h-0 group-hover:max-h-[60px] overflow-hidden">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── REGISTER SECTION ─── */}
      <section id="registro" className="py-20 bg-[#171310] px-6 border-t border-[rgba(242,233,221,0.06)]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center">
          
          {/* Register Info & Beautiful Temazcal Image with Custom Breathe Animation */}
          <div className="md:col-span-5 flex flex-col space-y-6">
            <div>
              <p className="font-mono-plex text-xs text-[#e2622c] tracking-widest uppercase mb-2">
                Consentimiento Primero
              </p>
              <h2 className="font-fraunces text-3xl font-bold text-white">
                Enciende tu Nodo
              </h2>
            </div>
            
            <p className="text-sm text-[#a89a8d] leading-relaxed">
              Nadie se agrega a esta red sin su consentimiento expreso. Tú declaras tu propia especialidad, ubicación de práctica, y el árbol formador del cual provienes — así la red se teje de forma consciente y humana.
            </p>

            {/* Custom Temazcal Image with breathe loop animation */}
            <div className="relative rounded-2xl overflow-hidden border border-[rgba(242,233,221,0.12)] shadow-[0_15px_40px_rgba(0,0,0,0.5)] group h-[280px]">
              {/* Breathe Animation Overlay */}
              <div className="absolute inset-0 bg-[#e2622c] opacity-0 group-hover:opacity-[0.06] transition-opacity duration-1000 mix-blend-color-dodge pointer-events-none" />
              <img
                src="/images/temazcal.png"
                alt="Temazcal Ñuñoa Ceremonia de Fuego"
                className="w-full h-full object-cover transition-all duration-[1200ms] ease-in-out group-hover:scale-[1.03]"
              />
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[rgba(23,19,16,0.9)] via-[rgba(23,19,16,0.5)] to-transparent">
                <span className="font-mono-plex text-[9px] uppercase tracking-widest text-[#f2a154] font-semibold">
                  Temazcal Ñuñoa
                </span>
                <p className="text-[10px] text-[#a89a8d] mt-1 italic">
                  "Permiso para entrar, por mí y por todas mis relaciones."
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5c6b45] mt-1.5 flex-shrink-0" />
                <p className="text-xs text-[#a89a8d]">
                  <strong className="text-[#f2e9dd]">Ejemplo:</strong> Reymundo &quot;Tigre&quot; Pérez → aprendió de Henry Crow Dog (Lakota Sioux) y Chief Eagle Feather → fundó la Kiva para reunir culturas indígenas, preservar sus medicinas y transmitir costumbres ancestrales.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5c6b45] mt-1.5 flex-shrink-0" />
                <p className="text-xs text-[#a89a8d]">
                  <strong className="text-[#f2e9dd]">Ejemplo:</strong> Alondra Muñoz → formada en Escuela de Biodanza de Concepción → facilita hoy clases en Barrio Lastarria, Santiago.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5c6b45] mt-1.5 flex-shrink-0" />
                <p className="text-xs text-[#a89a8d]">
                  <strong className="text-[#f2e9dd]">Ejemplo:</strong> Pedro Labbé Toro → formado directamente con Rolando Toro → dirige la Escuela Biocéntrica en El Domo, La Reina.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 bg-[#211a15] rounded-3xl p-8 border border-[rgba(242,233,221,0.08)] shadow-[0_15px_45px_rgba(0,0,0,0.3)]">
            {formSubmitted ? (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[rgba(92,107,69,0.15)] flex items-center justify-center border border-[rgba(92,107,69,0.25)]">
                  <Heart className="w-6 h-6 text-[#5c6b45] animate-pulse" />
                </div>
                <h3 className="font-fraunces text-2xl font-bold text-white font-semibold">Nodo Propuesto Exitosamente</h3>
                <p className="text-xs text-[#a89a8d] max-w-sm">
                  Gracias por encender tu brasa. El equipo de custodia revisará los linajes declarados antes de que tu nodo brille oficialmente en el mapa colectivo.
                </p>
                <div className="mt-2">
                  <p className="text-[10px] font-mono-plex uppercase text-[#a89a8d] mb-1.5 tracking-wider">Disciplinas registradas:</p>
                  <div className="flex flex-wrap justify-center gap-1.5 max-w-sm">
                    {submittedDisciplines.map((d) => (
                      <span key={d} className="px-2.5 py-1 bg-[rgba(226,98,44,0.1)] border border-[rgba(226,98,44,0.25)] text-[#f2a154] text-[10px] rounded-full font-mono-plex">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-fraunces text-2xl font-bold text-white mb-2">Formulario de Registro</h3>
                <p className="text-xs text-[#a89a8d] mb-4">Ingresa tus datos de práctica y formación para que seamos un fuego más grande.</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-mono-plex uppercase text-[#a89a8d] tracking-wide">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Alondra Muñoz"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="bg-[#171310] border border-[rgba(242,233,221,0.1)] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f2a154] transition-colors h-[48px]"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-mono-plex uppercase text-[#a89a8d] tracking-wide">Disciplinas (Selecciona todas las que correspondan)</label>
                    <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#171310] border border-[rgba(242,233,221,0.1)] rounded-lg min-h-[48px] items-center">
                      {availableDisciplines.map((disc) => {
                        const isSelected = formData.disciplinas.includes(disc.name);
                        return (
                          <button
                            key={disc.name}
                            type="button"
                            onClick={() => toggleDiscipline(disc.name)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-mono-plex transition-all duration-200 flex items-center gap-1.5 border ${
                              isSelected
                                ? "bg-[#e2622c] border-[#e2622c] text-[#171310] font-bold shadow-[0_2px_8px_rgba(226,98,44,0.2)]"
                                : "bg-transparent border-transparent text-[#a89a8d] hover:text-[#f2e9dd] hover:bg-[rgba(242,233,221,0.03)]"
                            }`}
                          >
                            <span>{disc.emoji}</span>
                            {disc.name}
                          </button>
                        );
                      })}
                    </div>
                    {/* Agregar disciplina personalizada */}
                    <div className="flex gap-2 items-center mt-1">
                      <input
                        type="text"
                        placeholder="Ej. Carta natal, acupuntura..."
                        value={customDiscInput}
                        onChange={(e) => setCustomDiscInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomDiscipline();
                          }
                        }}
                        className="bg-[#171310] border border-[rgba(242,233,221,0.1)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f2a154] transition-colors flex-grow h-[34px]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomDiscipline}
                        className="px-3 py-2 rounded-lg bg-[#5c6b45] hover:bg-[#6c7d52] text-[#171310] text-xs font-bold font-mono-plex uppercase tracking-wider transition-all h-[34px] flex items-center justify-center"
                      >
                        + Agregar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-mono-plex uppercase text-[#a89a8d] tracking-wide">Ciudad / Región / Comuna de Práctica</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Providencia, Santiago (Chile)"
                    value={formData.ciudad}
                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                    className="bg-[#171310] border border-[rgba(242,233,221,0.1)] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f2a154] transition-colors"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-mono-plex uppercase text-[#a89a8d] tracking-wide">Tu Linaje (¿Quién te formó?)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Ej. Formada por Amanda Paz en la Escuela de Biodanza Amar de Viña del Mar, linaje Rolando Toro."
                    value={formData.linaje}
                    onChange={(e) => setFormData({ ...formData, linaje: e.target.value })}
                    className="bg-[#171310] border border-[rgba(242,233,221,0.1)] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f2a154] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg bg-[#e2622c] hover:bg-[#f2a154] text-[#171310] font-bold font-mono-plex uppercase tracking-wider text-xs transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_6px_20px_rgba(226,98,44,0.2)] mt-2"
                >
                  Proponer mi nodo en la red
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── PRICING / MEMBERSHIPS SECTION ─── */}
      <section id="membresia" className="py-24 bg-gradient-to-b from-[#211a15] to-[#1c1612] px-6 border-y border-[rgba(242,233,221,0.06)] relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#e2622c] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-[#5c6b45] opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-xl mx-auto mb-20">
            <p className="font-mono-plex text-xs text-[#e2622c] tracking-widest uppercase mb-3 font-semibold">
              Sostener la Red Colectiva
            </p>
            <h2 className="font-fraunces text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Membresía Solidaria de Facilitador
            </h2>
            <p className="text-sm text-[#a89a8d] mt-4 leading-relaxed">
              No tenemos inversionistas. Sostenemos esta red de forma comunitaria. Aportas según la escala y difusión de tu actividad, financiando la infraestructura técnica para todos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Semilla Plan */}
            <div className="group rounded-3xl p-8 border border-[rgba(242,233,221,0.06)] bg-[#171310]/90 backdrop-blur-md flex flex-col justify-between hover:border-[rgba(242,233,221,0.15)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
              <div>
                <span className="font-mono-plex text-[10px] text-[#b5c79e] uppercase tracking-wider font-bold bg-[rgba(92,107,69,0.08)] border border-[rgba(92,107,69,0.2)] px-2.5 py-1 rounded-full">Plan Semilla</span>
                <h3 className="font-fraunces text-3xl font-bold text-white mt-4">Semilla</h3>
                <div className="font-fraunces text-4xl font-bold text-[#f2e9dd] my-6 flex items-baseline gap-2">
                  Gratis
                  <span className="text-xs text-[#a89a8d] font-sans font-normal uppercase tracking-wider">para conocer y asistir</span>
                </div>
                <div className="h-[1px] bg-[rgba(242,233,221,0.08)] my-5" />
                <ul className="space-y-4 text-xs text-[#a89a8d]">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#5c6b45]/10 border border-[#5c6b45]/30 text-[#b5c79e] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>Pensado para quien se quiere unir a alguna comunidad, asistir, conocer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#5c6b45]/10 border border-[#5c6b45]/30 text-[#b5c79e] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>Perfil activo en el mapa interactivo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#5c6b45]/10 border border-[#5c6b45]/30 text-[#b5c79e] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>Acceso a foros y red horizontal de la comunidad</span>
                  </li>
                </ul>
              </div>
              <a
                href="#registro"
                className="mt-10 w-full py-3.5 text-center text-xs font-mono-plex uppercase border border-[rgba(242,233,221,0.12)] hover:border-[#b5c79e] hover:text-[#b5c79e] hover:bg-[#b5c79e]/5 rounded-xl transition-all duration-300 font-bold tracking-wider"
              >
                Unirse gratis
              </a>
            </div>

            {/* Fuego Plan (Recomendado) */}
            <div className="group rounded-3xl p-8 border-2 border-[#e2622c] bg-[#171310] relative flex flex-col justify-between shadow-[0_20px_50px_rgba(226,98,44,0.08)] hover:-translate-y-2 hover:shadow-[0_25px_55px_rgba(226,98,44,0.15)] transition-all duration-300">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-[#e2622c] to-[#f2a154] text-[#171310] rounded-full text-[10px] font-mono-plex font-bold uppercase tracking-widest shadow-[0_4px_12px_rgba(226,98,44,0.3)]">
                Recomendado
              </span>
              <div>
                <span className="font-mono-plex text-[10px] text-[#e2622c] uppercase tracking-wider font-bold bg-[rgba(226,98,44,0.1)] border border-[rgba(226,98,44,0.2)] px-2.5 py-1 rounded-full">Plan Fuego</span>
                <h3 className="font-fraunces text-3xl font-bold text-white mt-4">Fuego</h3>
                <div className="font-fraunces text-4xl font-bold text-white my-6 flex flex-col gap-2">
                  <div className="flex items-baseline gap-2">
                    $2.000 <span className="text-xs text-[#a89a8d] font-sans font-normal">/ mes</span>
                  </div>
                  <div className="text-[10px] font-mono-plex text-[#f2a154] font-medium leading-relaxed bg-[rgba(242,161,84,0.06)] border border-[rgba(242,161,84,0.15)] p-2.5 rounded-xl">
                    + 1% de venta (neto tras descuentos de Mpago, Transbank, Khipu, Flow)
                  </div>
                </div>
                <div className="h-[1px] bg-[rgba(242,233,221,0.08)] my-5" />
                <ul className="space-y-4 text-xs text-[#a89a8d]">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#e2622c]/10 border border-[#e2622c]/30 text-[#f2a154] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span className="text-[#f2e9dd] font-medium">Para profes, agregar clases y facilitar recibir pagos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#e2622c]/10 border border-[#e2622c]/30 text-[#f2a154] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>Perfil destacado con anillo brillante en el mapa</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#e2622c]/10 border border-[#e2622c]/30 text-[#f2a154] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>Multi-disciplinas y linajes ilimitados</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#e2622c]/10 border border-[#e2622c]/30 text-[#f2a154] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>Agenda de clases y reservas directas con pasarela</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleCheckoutMock("Fuego")}
                className="mt-10 w-full py-4 text-center text-xs font-mono-plex uppercase bg-gradient-to-r from-[#e2622c] to-[#f2a154] hover:brightness-110 text-[#171310] rounded-xl transition-all duration-300 font-bold tracking-widest shadow-[0_6px_20px_rgba(226,98,44,0.35)] hover:shadow-[0_8px_25px_rgba(226,98,44,0.45)] hover:-translate-y-0.5"
              >
                Suscribirme
              </button>
            </div>

            {/* Guardián Plan */}
            <div className="group rounded-3xl p-8 border border-[rgba(242,233,221,0.06)] bg-[#171310]/90 backdrop-blur-md flex flex-col justify-between hover:border-[rgba(201,154,60,0.3)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(201,154,60,0.06)] transition-all duration-300">
              <div>
                <span className="font-mono-plex text-[10px] text-[#c99a3c] uppercase tracking-wider font-bold bg-[rgba(201,154,60,0.08)] border border-[rgba(201,154,60,0.2)] px-2.5 py-1 rounded-full">Plan Guardián</span>
                <h3 className="font-fraunces text-3xl font-bold text-white mt-4">Guardián</h3>
                <div className="font-fraunces text-4xl font-bold text-white my-6 flex flex-col gap-2">
                  <div className="flex items-baseline gap-2">
                    $5.000 <span className="text-xs text-[#a89a8d] font-sans font-normal">/ mes</span>
                  </div>
                  <div className="text-[10px] font-mono-plex text-[#c99a3c] font-medium leading-relaxed bg-[rgba(201,154,60,0.05)] border border-[rgba(201,154,60,0.15)] p-2.5 rounded-xl">
                    Para escuelas, centros y formadores de facilitadores
                  </div>
                </div>
                <div className="h-[1px] bg-[rgba(242,233,221,0.08)] my-5" />
                <ul className="space-y-3.5 text-xs text-[#a89a8d]">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#c99a3c]/10 border border-[#c99a3c]/30 text-[#c99a3c] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span className="text-white font-medium">Todo lo del Plan Fuego</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#c99a3c]/10 border border-[#c99a3c]/30 text-[#c99a3c] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span><strong className="text-white font-medium">Formadores y Escuelas</strong>: Cobrar formaciones y sostener contenidos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#c99a3c]/10 border border-[#c99a3c]/30 text-[#c99a3c] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span><strong className="text-white font-medium">Micro-sitio & QR</strong>: Página dedicada `raiz.red/tu-centro`</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#c99a3c]/10 border border-[#c99a3c]/30 text-[#c99a3c] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span><strong className="text-white font-medium">Destacar Eventos</strong>: Banner de tus talleres en principal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#c99a3c]/10 border border-[#c99a3c]/30 text-[#c99a3c] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span><strong className="text-white font-medium">Linajes</strong>: Trazado de descendencia de discípulos</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleCheckoutMock("Guardian")}
                className="mt-10 w-full py-3.5 text-center text-xs font-mono-plex uppercase border border-[rgba(242,233,221,0.12)] hover:border-[#c99a3c] hover:text-[#c99a3c] hover:bg-[#c99a3c]/5 rounded-xl transition-all duration-300 font-bold tracking-wider"
              >
                Suscribirme
              </button>
            </div>
          </div>

          <p className="text-[11px] text-[#a89a8d] text-center mt-8 font-mono-plex max-w-lg mx-auto">
            El cobro se procesa a través de transferencia bancaria directa (P2P), Mercado Pago, Flow, Khipu o Transbank. Todo aporte se reinvierte en servidores de custodia distribuida y publicidad geográfica para promocionar la red de linajes.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 bg-[#171310] px-6 border-t border-[rgba(242,233,221,0.06)] text-xs text-[#a89a8d]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[rgba(226,98,44,0.15)] border border-[rgba(226,98,44,0.25)]">
              <RaizIcon className="w-3.5 h-3.5 text-[#e2622c]" />
            </div>
            <span className="font-fraunces font-semibold text-white">Raíz · Red de linajes de bienestar</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span>© 2026 Raíz. Licencia Creative Commons (BY-NC-SA).</span>
            <span>Mapas: © OpenStreetMap contributors & CARTO</span>
          </div>
        </div>
      </footer>

      {/* ─── MODAL DE CHECKOUT SIMULADO (SPLIT P2P) ─── */}
      {showCheckoutModal && checkoutNode && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#211a15] rounded-3xl p-6 md:p-8 border border-[rgba(242,233,221,0.08)] shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono-plex text-[10px] text-[#e2622c] uppercase tracking-wider block">Reservar clase en directo</span>
                <h3 className="font-fraunces text-2xl font-bold text-white mt-1">{checkoutNode.name}</h3>
                <span className="font-mono-plex text-[9px] uppercase tracking-widest text-[#a89a8d]">{checkoutNode.category}</span>
              </div>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="w-8 h-8 rounded-full bg-[#171310] hover:bg-[#e2622c]/10 hover:text-[#e2622c] flex items-center justify-center transition-colors text-[#a89a8d]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {checkoutStep === "form" && (
              <div className="space-y-6">
                {/* Desglose de Precios */}
                <div className="bg-[#171310] rounded-2xl p-5 border border-[rgba(242,233,221,0.04)] space-y-3 font-mono-plex text-xs text-[#a89a8d]">
                  <h4 className="text-white font-sans font-bold text-sm mb-2 pb-1 border-b border-[rgba(242,233,221,0.06)]">Detalle del Cobro Transparente</h4>
                  <div className="flex justify-between">
                    <span>Clase / Actividad (Directo al Facilitador)</span>
                    <span className="text-white font-bold">${checkoutAmount.toLocaleString("es-CL")} CLP</span>
                  </div>
                  <div className="flex justify-between text-[#e2622c]">
                    <span>Aporte de Sustentabilidad Red Raíz (2.0%)</span>
                    <span className="font-bold">+ $200 CLP</span>
                  </div>
                  <div className="h-[1px] bg-[rgba(242,233,221,0.08)] my-2" />
                  <div className="flex justify-between text-base font-bold text-white font-fraunces">
                    <span>Total a Pagar</span>
                    <span>$10.200 CLP</span>
                  </div>
                </div>

                {/* Métodos de Pago */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono-plex uppercase text-[#a89a8d] font-bold block">Medio de Pago Único</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCheckoutPaymentMethod("mercado_pago")}
                      className={`p-3 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-1.5 ${
                        checkoutPaymentMethod === "mercado_pago"
                          ? "bg-[#e2622c]/20 border-[#e2622c] text-white"
                          : "bg-[#171310] border-[rgba(242,233,221,0.06)] text-[#a89a8d] hover:border-[rgba(242,233,221,0.12)]"
                      }`}
                    >
                      <span className="font-bold">💳 Tarjeta / Mercado Pago</span>
                      <span className="text-[8px] opacity-75 font-normal">Soporta Split Automatizado</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutPaymentMethod("crypto")}
                      className={`p-3 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-1.5 ${
                        checkoutPaymentMethod === "crypto"
                          ? "bg-[#c99a3c]/20 border-[#c99a3c] text-white"
                          : "bg-[#171310] border-[rgba(242,233,221,0.06)] text-[#a89a8d] hover:border-[rgba(242,233,221,0.12)]"
                      }`}
                    >
                      <span className="font-bold">🪙 Web3 Wallet (Crypto)</span>
                      <span className="text-[8px] opacity-75 font-normal">Split Directo On-chain</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3.5 bg-yellow-950/20 border border-yellow-900/30 text-yellow-400 rounded-xl text-[11px] leading-relaxed">
                  <InfoIcon className="w-5 h-5 shrink-0" />
                  <span>El facilitador recibe su abono directo de forma inmediata. Al pagar con tarjeta, se procesa un cobro unificado de $10.200 CLP que es dividido automáticamente en la pasarela.</span>
                </div>

                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="w-full py-4 bg-[#e2622c] hover:bg-[#f2a154] text-[#171310] font-bold font-mono-plex text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_6px_20px_rgba(226,98,44,0.3)]"
                >
                  Pagar $10.200 CLP
                </button>
              </div>
            )}

            {checkoutStep === "loading" && (
              <div className="py-16 text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e2622c] mx-auto"></div>
                <h4 className="font-fraunces text-lg text-white font-bold">Procesando Pago con Split Seguro</h4>
                <p className="text-xs text-[#a89a8d] max-w-xs mx-auto">
                  {checkoutPaymentMethod === "crypto" 
                    ? "Firmando la transacción en el Smart Contract de Red Raíz en Polygon..." 
                    : "Redireccionando a la API segura de Mercado Pago. Conectando balances..."}
                </p>
              </div>
            )}

            {checkoutStep === "success" && (
              <div className="text-center space-y-6 animate-scaleIn">
                <div className="w-16 h-16 rounded-full bg-green-950/20 border-2 border-green-500 text-green-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-fraunces text-2xl text-white font-bold">¡Reserva Confirmada de Forma Soberana!</h4>
                  <p className="text-xs text-[#a89a8d] mt-2 max-w-sm mx-auto leading-relaxed">
                    Hemos procesado tu pago de **$10.200 CLP** de forma exitosa y transparente. El dinero ha sido ruteado en el fondo:
                  </p>
                </div>

                <div className="bg-[#171310] rounded-xl p-4 border border-[rgba(242,233,221,0.06)] text-left font-mono-plex text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#a89a8d]">Ruteado al Facilitador (98%):</span>
                    <span className="text-white font-bold">${checkoutAmount.toLocaleString("es-CL")} CLP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a89a8d]">Tasa del Protocolo Red Raíz (2%):</span>
                    <span className="text-[#e2622c] font-bold">$200 CLP</span>
                  </div>
                </div>

                <p className="text-[10px] text-[#a89a8d] leading-normal italic">
                  Se ha enviado tu recibo de reserva encriptado a tu correo. El facilitador ha sido notificado al instante para esperarte en clase.
                </p>

                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="w-full py-3.5 bg-green-900/20 hover:bg-green-900/30 text-green-400 border border-green-900/40 font-bold font-mono-plex text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Cerrar y Volver al Mapa
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ─── MODAL DE SUSCRIPCIÓN SIMULADA (SOSTENER LA RED) ─── */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#211a15] rounded-3xl p-6 md:p-8 border border-[rgba(242,233,221,0.08)] shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[rgba(226,98,44,0.1)] border border-[rgba(226,98,44,0.2)] flex items-center justify-center">
                  <Coins className="w-4 h-4 text-[#e2622c]" />
                </div>
                <div>
                  <h3 className="font-fraunces text-xl font-bold text-white">Sostener el Fuego</h3>
                  <span className="font-mono-plex text-[9px] uppercase tracking-widest text-[#a89a8d]">Membresía Solidaria Recurrente</span>
                </div>
              </div>
              <button 
                onClick={() => setShowSubscriptionModal(false)}
                className="w-8 h-8 rounded-full bg-[#171310] hover:bg-[#e2622c]/10 hover:text-[#e2622c] flex items-center justify-center transition-colors text-[#a89a8d]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {subscriptionStep === "plans" && (
              <div className="space-y-6">
                <p className="text-xs text-[#a89a8d] leading-relaxed">
                  Apoya la descentralización. Elige un aporte recurrente mensual que se cobra de forma automatizada por Mercado Pago o se stremea en cripto estable. Todos los recursos sostienen la infraestructura del mapa.
                </p>

                {/* Selección de Planes */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono-plex uppercase text-[#a89a8d] font-bold block">Selecciona tu Plan Mensual</label>
                  <div className="space-y-2 font-mono-plex text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedSubPlan("semilla")}
                      className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                        selectedSubPlan === "semilla"
                          ? "bg-[#5c6b45]/20 border-[#5c6b45] text-white"
                          : "bg-[#171310] border-[rgba(242,233,221,0.06)] text-[#a89a8d] hover:border-[rgba(242,233,221,0.12)]"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-white">Plan Semilla</div>
                        <div className="text-[10px] text-[#a89a8d] mt-1 font-sans">Para quien se quiere unir a alguna comunidad, asistir y conocer</div>
                      </div>
                      <span className="font-fraunces font-bold text-sm text-[#b5c79e]">Gratis</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedSubPlan("fuego")}
                      className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                        selectedSubPlan === "fuego"
                          ? "bg-[#e2622c]/20 border-[#e2622c] text-white animate-pulse"
                          : "bg-[#171310] border-[rgba(242,233,221,0.06)] text-[#a89a8d] hover:border-[rgba(242,233,221,0.12)]"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-white flex items-center gap-1.5">
                          Plan Fuego <span className="text-[8px] bg-[#e2622c] text-[#171310] px-1.5 py-0.5 rounded font-mono font-bold">RECOMENDADO</span>
                        </div>
                        <div className="text-[10px] text-[#a89a8d] mt-1 font-sans">Para profes, para agregar clases y facilitar recibir pagos</div>
                      </div>
                      <span className="font-fraunces font-bold text-sm text-[#f2a154]">$2.000 CLP / mes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedSubPlan("guardian")}
                      className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                        selectedSubPlan === "guardian"
                          ? "bg-[#c99a3c]/20 border-[#c99a3c] text-white"
                          : "bg-[#171310] border-[rgba(242,233,221,0.06)] text-[#a89a8d] hover:border-[rgba(242,233,221,0.12)]"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-white">Plan Guardián</div>
                        <div className="text-[10px] text-[#a89a8d] mt-1 font-sans">Para escuelas, formadores, cobros y contenidos de formaciones</div>
                      </div>
                      <span className="font-fraunces font-bold text-sm text-[#ffd700]">$5.000 CLP / mes</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateSubscription}
                  className="w-full py-4 bg-[#e2622c] hover:bg-[#f2a154] text-[#171310] font-bold font-mono-plex text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_6px_20px_rgba(226,98,44,0.3)]"
                >
                  {selectedSubPlan === "semilla" ? "Unirse Gratis" : "Confirmar Suscripción"}
                </button>
              </div>
            )}

            {subscriptionStep === "loading" && (
              <div className="py-16 text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e2622c] mx-auto"></div>
                <h4 className="font-fraunces text-lg text-white font-bold">
                  {selectedSubPlan === "semilla" ? "Procesando Registro" : "Creando Cobro Recurrente"}
                </h4>
                <p className="text-xs text-[#a89a8d] max-w-xs mx-auto">
                  {selectedSubPlan === "semilla" 
                    ? "Registrando tu nodo en la comunidad de forma libre..." 
                    : "Vigilando la pasarela segura. Conectando tu membresía recurrente en CLP a la tesorería distribuida..."}
                </p>
              </div>
            )}

            {subscriptionStep === "success" && (
              <div className="text-center space-y-6 animate-scaleIn">
                <div className="w-16 h-16 rounded-full bg-[#e2622c]/10 border-2 border-[#e2622c] text-[#e2622c] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(226,98,44,0.15)]">
                  <Heart className="w-8 h-8 fill-[#e2622c]/10" />
                </div>
                <div>
                  <h4 className="font-fraunces text-2xl text-white font-bold">
                    {selectedSubPlan === "semilla" ? "¡Bienvenido a la Red!" : "¡Gracias por Sostener la Red!"}
                  </h4>
                  <p className="text-xs text-[#a89a8d] mt-2 max-w-sm mx-auto leading-relaxed">
                    {selectedSubPlan === "semilla" && "Tu registro en el plan gratuito se ha completado exitosamente. Ahora eres un miembro Semilla de la Red Raíz."}
                    {selectedSubPlan === "fuego" && "Tu suscripción mensual se ha configurado exitosamente. Ahora eres un Colaborador Fuego de la Red Raíz."}
                    {selectedSubPlan === "guardian" && "Tu suscripción mensual se ha configurado exitosamente. Ahora eres un Guardián de la Red Raíz."}
                  </p>
                </div>

                <div className="bg-[#171310] rounded-xl p-4 border border-[rgba(242,233,221,0.06)] text-center font-mono-plex text-xs">
                  <span className="text-[#a89a8d]">Estado:</span>{" "}
                  {selectedSubPlan === "semilla" ? (
                    <>
                      <span className="text-[#b5c79e] font-bold">PLAN GRATUITO ACTIVO</span>
                      <div className="text-[10px] text-[#a89a8d] mt-1">Acceso libre a la comunidad y presencia en el mapa.</div>
                    </>
                  ) : (
                    <>
                      <span className="text-[#f2a154] font-bold">SUSCRIPCIÓN ACTIVA</span>
                      <div className="text-[10px] text-[#a89a8d] mt-1">Próximo cobro automático en 30 días.</div>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowSubscriptionModal(false)}
                  className="w-full py-3.5 bg-[#e2622c]/10 hover:bg-[#e2622c]/20 text-[#e2622c] border border-[#e2622c]/30 font-bold font-mono-plex text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Volver al Mapa Vivo
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* CSS Animation Helper Styles */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  )
}
