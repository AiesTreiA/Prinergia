"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Leaf,
  Globe,
  Instagram,
  Youtube,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Award,
  Video,
  FileText,
  Check,
  X,
  Play,
  Heart,
  MapPin,
  Star,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useMockAuth } from "@/lib/mock-auth"
import { isV0Environment } from "@/lib/auth-utils"

interface SocialProofItem {
  id: string
  type: "web" | "instagram" | "youtube" | "credential"
  title: string
  content: string
  question: string
  tag: string
  sourceUrl: string
  imageUrl?: string
}

const AI_FINDINGS: SocialProofItem[] = [
  {
    id: "item-1",
    type: "web",
    title: "Formación en Biodanza & Terapia Corporal",
    content: "Formado/a en Terapia Corporal y Biodanza en la Escuela SRT (Santiago, 2021). Ofrece talleres grupales y sesiones individuales de integración somática.",
    question: "Hemos detectado este fragmento sobre tu formación en tu sitio web. ¿Deseas vincularlo a tu Sello Red-Raíz para validar que eres un facilitador con formación real y estructurada?",
    tag: "Formación Validada",
    sourceUrl: "https://misitio.com/sobre-mi",
  },
  {
    id: "item-2",
    type: "instagram",
    title: "Publicación: Taller de Ansiedad y Mindfulness",
    content: "Celebrando el cierre del ciclo de talleres grupales de Mindfulness y Ansiedad. Un hermoso espacio de contención grupal y expresión libre. Gracias a todos por confiar.",
    question: "Este post demuestra la realización de talleres grupales y práctica activa. ¿Deseas enlazarlo a tu sello de verificación como prueba social de tus facilitaciones en curso?",
    tag: "Prueba Social de Talleres",
    sourceUrl: "https://instagram.com/p/C3x9D1oA7x",
    imageUrl: "/images/biodanza.jpg",
  },
  {
    id: "item-3",
    type: "youtube",
    title: "Video: Práctica de Breathwork de 10 minutos",
    content: "Una guía de respiración circular consciente diseñada para calmar el sistema nervioso, reducir el cortisol y anclar la consciencia en el cuerpo físico de manera guiada.",
    question: "Este video demuestra tu metodología y pedagogía en técnicas de respiración. ¿Quieres vincularlo para que potenciales consultantes experimenten cómo guías una sesión?",
    tag: "Evidencia Pedagógica",
    sourceUrl: "https://youtube.com/watch?v=br10m",
  },
  {
    id: "item-4",
    type: "credential",
    title: "Diploma: Especialidad en Psicoterapia de Aceptación y Compromiso (ACT)",
    content: "Certificado oficial emitido tras cursar la especialización avanzada de 120 horas en el tratamiento clínico de la ansiedad y trastornos del ánimo.",
    question: "Detectamos una imagen de tu diploma de especialización ACT en tus perfiles. ¿Deseas enviarlo a validación oficial para activar el distintivo de 'Especialidad Verificada'?",
    tag: "Certificación Oficial",
    sourceUrl: "https://instagram.com/p/C4y2Z9pB8y",
    imageUrl: "/images/acro-yoga.jpg",
  }
]

export default function TherapistDashboard() {
  const router = useRouter()
  const mockAuth = useMockAuth()
  const { data: session, status } = useSession()
  const isV0 = isV0Environment()

  // Perfil del terapeuta
  const [userProfile, setUserProfile] = useState<{
    id: string
    name: string
    email: string
    avatar_url?: string
    specialty?: string
    location?: string
  } | null>(null)

  // Canales
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [instagramUser, setInstagramUser] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [isSaved, setIsSaved] = useState(false)

  // Escáner
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "questions" | "completed">("idle")
  const [scanProgress, setScanProgress] = useState(0)
  const [scanLogs, setScanLogs] = useState<string[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [linkedItems, setLinkedItems] = useState<SocialProofItem[]>([])
  const [rejectedIds, setRejectedIds] = useState<string[]>([])
  
  // Sello
  const [isVerified, setIsVerified] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const logEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll logs down
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [scanLogs])

  useEffect(() => {
    // Obtener sesión
    const loadSession = async () => {
      let email = ""
      let name = ""
      let avatar = ""

      if (isV0) {
        if (!mockAuth.user) {
          // Si no hay sesión mock, iniciar sesión automáticamente para agilizar demo
          await mockAuth.signIn("google")
          return
        }
        email = mockAuth.user.email
        name = mockAuth.user.name
        avatar = mockAuth.user.image || ""
      } else {
        if (status === "loading") return
        if (status === "unauthenticated") {
          router.push("/auth/signin")
          return
        }
        email = session?.user?.email || ""
        name = session?.user?.name || "Terapeuta Profesional"
        avatar = session?.user?.image || ""
      }

      const savedName = localStorage.getItem("rt_register_name") || name
      const savedDiscipline = localStorage.getItem("rt_register_discipline")
      const savedLinaje = localStorage.getItem("rt_register_linaje")
      const savedCity = localStorage.getItem("rt_register_city")
      
      const displaySpecialty = savedDiscipline 
        ? (savedLinaje ? `${savedDiscipline} (${savedLinaje})` : savedDiscipline)
        : "Facilitador/a de Desarrollo Somático & Terapia Integral"
        
      const displayLocation = savedCity 
        ? `${savedCity} (Presencial & Online)` 
        : "Santiago, Chile (Presencial & Online)"

      setUserProfile({
        id: "therapist-1",
        name: savedName,
        email: email,
        avatar_url: avatar,
        specialty: displaySpecialty,
        location: displayLocation
      })

      // Cargar configuraciones guardadas de redes si existen en localStorage
      const savedWeb = localStorage.getItem("rt_web") || ""
      const savedInsta = localStorage.getItem("rt_insta") || ""
      const savedYt = localStorage.getItem("rt_yt") || ""
      const savedLinked = localStorage.getItem("rt_linked") || "[]"
      const savedVerified = localStorage.getItem("rt_verified") === "true"

      setWebsiteUrl(savedWeb)
      setInstagramUser(savedInsta)
      setYoutubeUrl(savedYt)
      setIsVerified(savedVerified)
      try {
        setLinkedItems(JSON.parse(savedLinked))
      } catch (e) {
        setLinkedItems([])
      }
    }

    loadSession()
  }, [mockAuth.user, isV0, session, status, router])

  const handleSaveChannels = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("rt_web", websiteUrl)
    localStorage.setItem("rt_insta", instagramUser)
    localStorage.setItem("rt_yt", youtubeUrl)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const startAiScan = () => {
    setScanStatus("scanning")
    setScanProgress(0)
    setScanLogs([])
    
    const logs = [
      "🤖 Iniciando agente IA de escaneo de presencia en línea...",
      "🔗 Analizando conexiones declaradas en panel...",
      `🌐 Conectando a sitio web: ${websiteUrl || "https://mi-sitio-terapeutico.com"}`,
      "🌐 Escaneando estructura HTML y buscando metadatos formativos...",
      "📝 Fragmento formativo identificado en la sección 'Sobre Mí'.",
      `📸 Conectando a feed de Instagram: ${instagramUser || "@terapeuta.raiz"}`,
      "📸 Buscando hashtags relacionados y descripciones de facilitación...",
      "📝 Encontrada publicación sobre finalización de talleres grupales.",
      "🔍 Procesando imágenes con IA de Visión...",
      "🏆 Diploma detectado en publicación de feed del 12 de Marzo de 2025.",
      `🎥 Conectando a canal de YouTube: ${youtubeUrl || "https://youtube.com/c/mindfulness-somático"}`,
      "🎥 Buscando videos didácticos o sesiones guiadas...",
      "📝 Video de Breathwork y respiración circular consciente identificado.",
      "✨ Escaneo completo de presencia web, redes sociales y multimedia.",
      "🎯 Organizando cola de validación interactiva..."
    ]

    let currentLogIndex = 0
    const logInterval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setScanLogs((prev) => [...prev, logs[currentLogIndex]])
        setScanProgress((prev) => Math.min(prev + Math.floor(100 / logs.length), 100))
        currentLogIndex++
      } else {
        clearInterval(logInterval)
        setScanProgress(100)
        setTimeout(() => {
          setScanStatus("questions")
          setCurrentQuestionIndex(0)
        }, 1000)
      }
    }, 450)
  }

  const handleLinkItem = (item: SocialProofItem) => {
    const updated = [...linkedItems.filter((i) => i.id !== item.id), item]
    setLinkedItems(updated)
    localStorage.setItem("rt_linked", JSON.stringify(updated))
    nextQuestion()
  }

  const handleRejectItem = (itemId: string) => {
    setRejectedIds((prev) => [...prev, itemId])
    nextQuestion()
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < AI_FINDINGS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setScanStatus("completed")
      setIsVerified(true)
      localStorage.setItem("rt_verified", "true")
    }
  }

  const resetScanner = () => {
    setScanStatus("idle")
    setScanProgress(0)
    setScanLogs([])
    setCurrentQuestionIndex(0)
  }

  const disconnectChannels = () => {
    setWebsiteUrl("")
    setInstagramUser("")
    setYoutubeUrl("")
    setLinkedItems([])
    setIsVerified(false)
    localStorage.removeItem("rt_web")
    localStorage.removeItem("rt_insta")
    localStorage.removeItem("rt_yt")
    localStorage.removeItem("rt_linked")
    localStorage.removeItem("rt_verified")
    setScanStatus("idle")
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-white/60 text-sm font-medium">Cargando panel de verificación...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Background Gradients */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, hsl(142 70% 5%) 0%, hsl(160 60% 8%) 40%, hsl(200 65% 10%) 70%, hsl(142 70% 4%) 100%)",
        }}
      />
      
      {/* Glow Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-25 pointer-events-none bg-emerald-500/20" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[150px] opacity-15 pointer-events-none bg-teal-500/20" />

      {/* CSS Styles for Custom Animations */}
      <style jsx global>{`
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(16, 185, 129, 0.2); box-shadow: 0 0 15px rgba(16, 185, 129, 0.05); }
          50% { border-color: rgba(16, 185, 129, 0.6); box-shadow: 0 0 25px rgba(16, 185, 129, 0.25); }
        }
        .verified-seal-glow {
          animation: borderGlow 4s infinite ease-in-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.4);
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 px-6 py-4 border-b border-white/5 backdrop-blur-md bg-slate-950/70">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <ArrowLeft className="h-4 w-4 text-white/70 group-hover:text-white" />
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, hsl(142 70% 45%) 0%, hsl(160 60% 40%) 100%)" }}
              >
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">Red-Raíz</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-1.5">
              <Avatar className="h-7 w-7 border border-emerald-500/30">
                <AvatarImage src={userProfile.avatar_url} />
                <AvatarFallback className="bg-emerald-800 text-white text-xs">{userProfile.name[0]}</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold leading-tight">{userProfile.name}</span>
                <span className="text-[10px] text-emerald-400 font-mono">Facilitador/a</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/50 hover:text-white hover:bg-white/5 text-xs font-medium rounded-xl"
              onClick={() => {
                if (isV0) {
                  mockAuth.signOut()
                  router.push("/")
                } else {
                  router.push("/api/auth/signout")
                }
              }}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10 pb-28">
        
        {/* Verification Status Banner */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              Panel de Acreditación Profesional
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              Tu Sello Red-Raíz
            </h1>
            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-xl">
              Conecta tu ecosistema en línea. Nuestra Inteligencia Artificial validará que eres un facilitador activo, formado y real, otorgándote respaldo y social proof verificado ante la red.
            </p>
          </div>

          {/* Sello Card */}
          <div
            className={`rounded-3xl p-6 border transition-all duration-500 flex flex-col items-center text-center relative ${
              isVerified
                ? "bg-emerald-950/20 border-emerald-500/30 verified-seal-glow"
                : "bg-white/[0.02] border-white/10"
            }`}
          >
            <div className="absolute top-4 right-4">
              <Badge className={isVerified ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-white/5 text-white/40 border-white/10"}>
                {isVerified ? "Activo" : "Pendiente"}
              </Badge>
            </div>

            <div className="relative mb-4 flex items-center justify-center">
              {isVerified ? (
                <>
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 z-10">
                    <ShieldCheck className="h-9 w-9 text-slate-950 stroke-[2.5]" />
                  </div>
                </>
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center text-white/30 z-10">
                  <AlertCircle className="h-8 w-8" />
                </div>
              )}
            </div>

            <h3 className="font-bold text-lg mb-1">{isVerified ? "Sello Red-Raíz Vinculado" : "Sello Sin Verificar"}</h3>
            <p className="text-xs text-white/50 leading-relaxed mb-4">
              {isVerified
                ? `${linkedItems.length} elementos de prueba social y credenciales vinculados y verificados mediante escáner de presencia en línea.`
                : "Para activar tu sello de facilitador verificado, vincula tus redes y ejecuta el Escáner de Presencia en Línea con IA."}
            </p>

            {isVerified && (
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30 rounded-xl text-xs font-semibold py-4"
                onClick={() => setShowPreviewModal(true)}
              >
                Previsualizar Ficha en Mapa
              </Button>
            )}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Col 1 & 2: Social Channels & Scanning Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Step 1: Connect Social Channels */}
            <Card className="bg-white/[0.03] border-white/10 rounded-3xl overflow-hidden backdrop-blur-2xl">
              <CardHeader className="p-6 border-b border-white/5">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-semibold">1</span>
                  Conectar tus Canales Digitales
                </CardTitle>
                <CardDescription className="text-white/40">
                  Declara tus perfiles principales. La IA los recorrerá para buscar evidencias de tu trabajo.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSaveChannels} className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-xs font-medium text-white/60">Sitio Web Profesional</Label>
                      <div className="relative flex items-center">
                        <Globe className="absolute left-3.5 h-4 w-4 text-white/30" />
                        <Input
                          id="website"
                          placeholder="https://tuweb.com"
                          className="pl-10 bg-white/5 border-white/10 rounded-2xl placeholder:text-white/20 text-sm focus-visible:ring-emerald-500"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="text-xs font-medium text-white/60">Usuario de Instagram</Label>
                      <div className="relative flex items-center">
                        <Instagram className="absolute left-3.5 h-4 w-4 text-white/30" />
                        <Input
                          id="instagram"
                          placeholder="@tu_usuario"
                          className="pl-10 bg-white/5 border-white/10 rounded-2xl placeholder:text-white/20 text-sm focus-visible:ring-emerald-500"
                          value={instagramUser}
                          onChange={(e) => setInstagramUser(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="youtube" className="text-xs font-medium text-white/60">Canal de YouTube (URL)</Label>
                      <div className="relative flex items-center">
                        <Youtube className="absolute left-3.5 h-4 w-4 text-white/30" />
                        <Input
                          id="youtube"
                          placeholder="https://youtube.com/@..."
                          className="pl-10 bg-white/5 border-white/10 rounded-2xl placeholder:text-white/20 text-sm focus-visible:ring-emerald-500"
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {websiteUrl || instagramUser || youtubeUrl ? (
                      <button
                        type="button"
                        onClick={disconnectChannels}
                        className="text-xs text-red-400 hover:text-red-300 font-medium underline underline-offset-4"
                      >
                        Desconectar todos los canales
                      </button>
                    ) : (
                      <span className="text-[11px] text-white/30">Completa al menos un campo para habilitar el escáner.</span>
                    )}

                    <Button
                      type="submit"
                      className="bg-white/10 hover:bg-white/20 text-white rounded-2xl px-5 text-xs font-bold border border-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      {isSaved ? (
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <Check className="h-3.5 w-3.5" /> Canales Guardados
                        </span>
                      ) : (
                        "Guardar Canales"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Step 2: AI Scan Console & Q&A Assistant */}
            <Card className="bg-white/[0.03] border-white/10 rounded-3xl overflow-hidden backdrop-blur-2xl">
              <CardHeader className="p-6 border-b border-white/5">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-semibold">2</span>
                  Buscador Inteligente de Huella Digital
                </CardTitle>
                <CardDescription className="text-white/40">
                  Explora y vincula pruebas sociales, videos y credenciales de tu ecosistema web directamente a tu reputación.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                
                {/* IDLE state */}
                {scanStatus === "idle" && (
                  <div className="text-center py-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                      <Sparkles className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Escáner de Presencia con IA</h3>
                    <p className="text-xs text-white/50 max-w-sm mx-auto mb-6 leading-relaxed">
                      La IA leerá tu web y redes sociales buscando publicaciones formativas, videos explicativos y certificaciones que justifiquen tu autenticidad.
                    </p>
                    <Button
                      onClick={startAiScan}
                      disabled={!websiteUrl && !instagramUser && !youtubeUrl}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold px-8 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none text-xs tracking-wide"
                    >
                      <Sparkles className="h-4 w-4 mr-2 text-slate-950 animate-pulse" />
                      INICIAR ESCANEO DE PRESENCIA IA
                    </Button>
                    {!websiteUrl && !instagramUser && !youtubeUrl && (
                      <p className="text-[11px] text-yellow-500/70 mt-3">
                        * Debes ingresar y guardar al menos un canal arriba para iniciar el escaneo.
                      </p>
                    )}
                  </div>
                )}

                {/* SCANNING state */}
                {scanStatus === "scanning" && (
                  <div className="space-y-6 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Ejecutando Agente de Inspección Web...
                      </span>
                      <span className="text-xs font-mono text-white/40">{scanProgress}%</span>
                    </div>
                    
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>

                    {/* Simulated terminal console */}
                    <div className="bg-slate-950/80 rounded-2xl p-4 border border-white/5 h-48 overflow-y-auto font-mono text-[10px] text-emerald-400/80 space-y-1.5 custom-scrollbar">
                      {scanLogs.map((log, index) => (
                        <div key={index} className="fade-in">
                          <span className="text-white/20 select-none mr-2">{`>`}</span>
                          {log}
                        </div>
                      ))}
                      <div ref={logEndRef} />
                    </div>
                  </div>
                )}

                {/* QUESTIONS state (IA asking one-by-one) */}
                {scanStatus === "questions" && (
                  <div className="space-y-6 py-2">
                    
                    {/* Progress indicator */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-400 flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5" /> Hallazgos de IA por Clasificar
                      </span>
                      <span className="text-white/40">
                        Elemento {currentQuestionIndex + 1} de {AI_FINDINGS.length}
                      </span>
                    </div>

                    {/* Question Card */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 relative overflow-hidden transition-all duration-300">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            {AI_FINDINGS[currentQuestionIndex].type === "web" && <Globe className="h-4 w-4" />}
                            {AI_FINDINGS[currentQuestionIndex].type === "instagram" && <Instagram className="h-4 w-4" />}
                            {AI_FINDINGS[currentQuestionIndex].type === "youtube" && <Youtube className="h-4 w-4" />}
                            {AI_FINDINGS[currentQuestionIndex].type === "credential" && <Award className="h-4 w-4" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white">{AI_FINDINGS[currentQuestionIndex].title}</h4>
                            <p className="text-[10px] text-white/40 font-mono flex items-center gap-1.5 mt-0.5">
                              <span>Origen:</span>
                              <a
                                href={AI_FINDINGS[currentQuestionIndex].sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="underline hover:text-emerald-300 transition-colors"
                              >
                                {AI_FINDINGS[currentQuestionIndex].sourceUrl.replace("https://", "")}
                              </a>
                            </p>
                          </div>
                        </div>

                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] py-0.5">
                          {AI_FINDINGS[currentQuestionIndex].tag}
                        </Badge>
                      </div>

                      {/* Display content preview */}
                      <div className="bg-slate-950/40 rounded-xl p-4 border border-white/5 mb-6">
                        <p className="text-xs text-white/70 italic leading-relaxed font-sans">
                          &quot;{AI_FINDINGS[currentQuestionIndex].content}&quot;
                        </p>
                      </div>

                      {/* AI Question */}
                      <div className="bg-emerald-950/20 border border-emerald-500/10 rounded-xl p-4 mb-6">
                        <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                          💬 <span className="text-emerald-400">Pregunta de la IA:</span> {AI_FINDINGS[currentQuestionIndex].question}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          onClick={() => handleRejectItem(AI_FINDINGS[currentQuestionIndex].id)}
                          className="flex-1 bg-white/5 hover:bg-red-500/10 text-white/70 hover:text-red-400 rounded-xl py-5 text-xs font-semibold transition-colors"
                        >
                          <X className="h-4 w-4 mr-2" /> Omitir Hallazgo
                        </Button>
                        <Button
                          onClick={() => handleLinkItem(AI_FINDINGS[currentQuestionIndex])}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold rounded-xl py-5 text-xs hover:scale-[1.01] active:scale-[0.99] transition-all"
                        >
                          <Check className="h-4 w-4 mr-2 text-slate-950" /> Vincular con Sello Red-Raíz
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* COMPLETED state */}
                {scanStatus === "completed" && (
                  <div className="text-center py-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                      <CheckCircle className="h-9 w-9" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">¡Sello Red-Raíz Activado con Éxito!</h3>
                    <p className="text-xs text-white/50 max-w-sm mx-auto mb-6 leading-relaxed">
                      Has vinculado {linkedItems.length} elementos de prueba social y formación. Tu ficha ya cuenta con el distintivo verificado de la red.
                    </p>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={resetScanner}
                        className="bg-transparent text-white border-white/10 hover:bg-white/5 rounded-xl px-5 text-xs font-bold"
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-2" /> Escanear de Nuevo
                      </Button>
                      <Button
                        onClick={() => setShowPreviewModal(true)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl px-5 text-xs hover:scale-105 transition-all"
                      >
                        Previsualizar Ficha Pública
                      </Button>
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>

          </div>

          {/* Sidebar: Sello & Reputational Ledger */}
          <div className="space-y-8">
            
            {/* Social Proof Ledger */}
            <Card className="bg-white/[0.03] border-white/10 rounded-3xl overflow-hidden backdrop-blur-2xl">
              <CardHeader className="p-6 border-b border-white/5">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  Pruebas Vinculadas
                </CardTitle>
                <CardDescription className="text-white/40">
                  Libro de registro de evidencias asociadas a tu Sello Red-Raíz.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                
                {linkedItems.length === 0 ? (
                  <div className="text-center py-8 text-white/30 space-y-2">
                    <FileText className="h-8 w-8 mx-auto stroke-[1.5]" />
                    <p className="text-xs">No hay elementos vinculados.</p>
                    <p className="text-[10px] text-white/20">Ejecuta el escáner para certificar tu presencia.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {linkedItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-start gap-3 hover:border-emerald-500/20 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs">
                          {item.type === "web" && <Globe className="h-3.5 w-3.5" />}
                          {item.type === "instagram" && <Instagram className="h-3.5 w-3.5" />}
                          {item.type === "youtube" && <Youtube className="h-3.5 w-3.5" />}
                          {item.type === "credential" && <Award className="h-3.5 w-3.5" />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-white truncate block">{item.title}</span>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[8px] font-mono px-1 py-0 select-none">
                              ✓ Verificado
                            </Badge>
                          </div>
                          
                          <p className="text-[10px] text-white/50 line-clamp-2 leading-relaxed mt-1">
                            {item.content}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5">
                            <span className="text-[9px] text-emerald-400 font-medium">{item.tag}</span>
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[9px] text-white/30 hover:text-white underline"
                            >
                              Ver fuente
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-400 leading-tight">
                      <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                      <span>Sello visible en tu ficha pública del mapa de Red-Raíz.</span>
                    </div>
                  </div>
                )}
                
              </CardContent>
            </Card>

            {/* Checklist de Progreso de Verificación */}
            <Card className="bg-white/[0.03] border-white/10 rounded-3xl overflow-hidden backdrop-blur-2xl">
              <CardHeader className="p-6 border-b border-white/5">
                <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">
                  Progreso del Sellado
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Registro Completado</p>
                    <p className="text-[10px] text-white/40">Perfil de facilitador creado en la plataforma.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    websiteUrl || instagramUser || youtubeUrl
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-white/5 border border-white/10 text-white/30"
                  }`}>
                    {websiteUrl || instagramUser || youtubeUrl ? <Check className="h-3 w-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/30" />}
                  </div>
                  <div>
                    <p className={`font-semibold ${websiteUrl || instagramUser || youtubeUrl ? "text-white" : "text-white/40"}`}>
                      Canales Enlazados
                    </p>
                    <p className="text-[10px] text-white/40">Enlaces a sitio web, Instagram o canal de YouTube declarados.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isVerified
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-white/5 border border-white/10 text-white/30"
                  }`}>
                    {isVerified ? <Check className="h-3 w-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/30" />}
                  </div>
                  <div>
                    <p className={`font-semibold ${isVerified ? "text-white" : "text-white/40"}`}>
                      Escáner IA Completado
                    </p>
                    <p className="text-[10px] text-white/40">Análisis inteligente y validación de evidencias somáticas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isVerified
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-white/5 border border-white/10 text-white/30"
                  }`}>
                    {isVerified ? <Check className="h-3 w-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/30" />}
                  </div>
                  <div>
                    <p className={`font-semibold ${isVerified ? "text-white" : "text-white/40"}`}>
                      Sello Red-Raíz Emitido
                    </p>
                    <p className="text-[10px] text-white/40">Sello de verificación activo y enlazado a la base descentralizada.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>

      </main>

      {/* Verification Card Modal Preview */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6">
              <h3 className="font-bold text-lg mb-4 text-center">Ficha Pública Verificada</h3>
              
              {/* Map Card Mockup */}
              <div className="bg-slate-950 border border-white/10 rounded-2xl overflow-hidden relative flex flex-col">
                <div className="h-32 bg-gradient-to-tr from-emerald-950 to-slate-900 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />
                  
                  {/* Decorative verified particles */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 stroke-[2.5]" />
                    Sello Red-Raíz
                  </div>
                </div>

                <div className="p-5 relative pt-0 -mt-10 flex-1 flex flex-col">
                  <div className="flex items-end gap-3 mb-3">
                    <Avatar className="w-16 h-16 border-2 border-emerald-500 text-lg shadow-lg">
                      <AvatarImage src={userProfile.avatar_url} />
                      <AvatarFallback className="bg-emerald-800 text-white">{userProfile.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="pb-1">
                      <h4 className="font-bold text-base flex items-center gap-1.5">
                        {userProfile.name}
                        <ShieldCheck className="h-4 w-4 text-emerald-400 fill-emerald-500/10" />
                      </h4>
                      <p className="text-xs text-emerald-400 font-medium">{userProfile.specialty}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-white/60 line-clamp-3 leading-relaxed mb-4">
                    Terapeuta certificado comprometido con la salud corporal y el crecimiento colectivo en armonía con la Red-Raíz.
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-[10px] text-white/50">
                      <MapPin className="h-3 w-3 text-emerald-400" />
                      {userProfile.location}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white/50">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      5.0 (Evaluación de la Red)
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3">
                    <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Pruebas Sociales de IA Verificadas</p>
                    <div className="flex flex-wrap gap-1.5">
                      {linkedItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-lg px-2 py-1 text-[9px] text-white/70 flex items-center gap-1 cursor-help"
                          title={item.content}
                        >
                          {item.type === "web" && <Globe className="h-2.5 w-2.5 text-emerald-400" />}
                          {item.type === "instagram" && <Instagram className="h-2.5 w-2.5 text-pink-400" />}
                          {item.type === "youtube" && <Youtube className="h-2.5 w-2.5 text-red-400" />}
                          {item.type === "credential" && <Award className="h-2.5 w-2.5 text-yellow-400" />}
                          <span>{item.type === "credential" ? "Diploma ACT" : item.type === "web" ? "Formación Web" : item.type === "instagram" ? "Talleres" : "Breathwork"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={() => setShowPreviewModal(false)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-2xl py-3 text-xs"
                >
                  Volver al Panel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
