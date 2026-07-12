"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Check, User, Sparkles, Upload, Mail, MapPin } from "lucide-react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { RaizIcon } from "@/components/ui/raiz-icon"

const AVAILABLE_TAGS = [
  "Hatha Yoga", "Vinyasa", "Temazcal Tradicional", "Biodanza Biocéntrica",
  "Sonoterapia", "Reiki Usui", "Baños de Gong", "Respiración Consciente",
  "Astrología Evolutiva", "Meditación Vipassana", "Danza Medicina", "Cacao Sagrado",
  "Alineación Somática", "Integración Emocional"
]

const PROFESSIONS = [
  { value: "biodanza", label: "Facilitador/a de Biodanza", emoji: "💃" },
  { value: "yoga", label: "Profesor/a de Yoga", emoji: "🧘" },
  { value: "temazcal", label: "Corredor(a) de Temazcal", emoji: "🔥" },
  { value: "reiki", label: "Terapeuta de Reiki", emoji: "🌿" },
  { value: "sonoterapia", label: "Sonoterapeuta", emoji: "🔔" },
  { value: "meditacion", label: "Instructor/a de Meditación", emoji: "✨" },
  { value: "astrologia", label: "Astrología Evolutiva", emoji: "🪐" },
  { value: "otro", label: "Otra medicina / disciplina", emoji: "🌱" }
]

const STEPS = [
  { id: 1, title: "Tu presencia", icon: User, desc: "Datos de contacto y disciplina" },
  { id: 2, title: "Tu linaje", icon: Sparkles, desc: "Tus raíces y especialidades" },
  { id: 3, title: "Tu espacio", icon: MapPin, desc: "Ubicación en el mapa vivo" },
]

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [profession, setProfession] = useState("")
  const [experience, setExperience] = useState("")
  const [bio, setBio] = useState("")
  const [specialties, setSpecialties] = useState<string[]>([])
  const [sessionPrice, setSessionPrice] = useState("")
  const [sessionDuration, setSessionDuration] = useState("")
  const [modalities, setModalities] = useState<string[]>([])
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [linaje, setLinaje] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState("")

  const toggleSpecialty = (tag: string) => {
    setSpecialties((prev) => prev.includes(tag) ? prev.filter((s) => s !== tag) : [...prev, tag])
  }

  const inputStyle = (field: string) => ({
    background: "rgba(255, 255, 255, 0.04)",
    border: `1px solid ${focusedField === field ? "#f2a154" : "rgba(242, 233, 221, 0.1)"}`,
    boxShadow: focusedField === field ? "0 0 0 3px rgba(226, 98, 44, 0.12)" : "none",
    borderRadius: "16px",
    color: "white",
    transition: "all 0.2s ease",
  })

  const inputClass = "w-full px-4 py-3 text-sm placeholder-white/30 outline-none bg-transparent"

  const handleNext = () => {
    if (step === 1) {
      if (!firstName.trim() || !lastName.trim()) {
        alert("Por favor ingresa tu nombre y apellidos.")
        return
      }
      if (!email.trim() || !email.includes("@")) {
        alert("Por favor ingresa un correo electrónico válido.")
        return
      }
      if (!profession) {
        alert("Por favor selecciona tu disciplina principal.")
        return
      }
    }
    if (step === 2) {
      if (!linaje.trim()) {
        alert("Por favor describe tu linaje o escuela formadora.")
        return
      }
    }
    setStep((s) => s + 1)
  }

  return (
    <div className="min-h-screen relative overflow-hidden text-[#f2e9dd]" style={{ background: "#171310" }}>
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #171310 0%, #211a15 50%, #2a201a 100%)",
        }}
      />
      {/* Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #e2622c 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #5c6b45 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .slide-up { animation: slideUp 0.5s ease-out forwards; }
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3); }
        input, textarea, select { color: white; }
        select option { background: #211a15; color: #f2e9dd; }
        .step-card { animation: slideUp 0.4s ease-out forwards; }
      `}</style>

      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4"
        style={{
          background: "rgba(23, 19, 16, 0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(242, 233, 221, 0.08)",
        }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 text-[#a89a8d] group-hover:text-[#f2e9dd] transition-colors" />
            </div>
            <div className="flex items-center gap-2">
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
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[#a89a8d] text-xs">¿Ya tienes cuenta?</span>
            <Link
              href="/auth/signin"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:scale-105"
              style={{ background: "rgba(242,233,221,0.08)", color: "rgba(242,233,221,0.7)", border: "1px solid rgba(242,233,221,0.1)" }}
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 pb-24">
        {/* Hero */}
        <div className="text-center mb-10 slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
            style={{ background: "rgba(226, 98, 44, 0.1)", color: "#f2a154", border: "1px solid rgba(226, 98, 44, 0.2)" }}>
            <Sparkles className="h-3 w-3 text-[#f2a154]" />
            Mapea tu linaje · Comunidad horizontal
          </div>
          <h1 className="font-fraunces text-3xl sm:text-4xl font-bold text-white mb-2">Enciende tu brasa en el mapa</h1>
          <p className="text-[#a89a8d] text-sm max-w-md mx-auto leading-relaxed">
            Comparte tu linaje, geolocaliza tu práctica y únete a la red horizontal de facilitadores de bienestar y medicina.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300"
                    style={{
                      background: step > s.id
                        ? "linear-gradient(135deg, #e2622c 0%, #f2a154 100%)"
                        : step === s.id
                        ? "rgba(226, 98, 44, 0.2)"
                        : "rgba(255, 255, 255, 0.06)",
                      border: step === s.id
                        ? "2px solid rgba(242, 161, 84, 0.5)"
                        : step > s.id
                        ? "2px solid transparent"
                        : "2px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: step === s.id ? "0 0 20px rgba(226, 98, 44, 0.2)" : "none",
                    }}
                  >
                    {step > s.id ? (
                      <Check className="h-4 w-4 text-[#171310] font-bold" />
                    ) : (
                      <s.icon
                        className="h-4 w-4"
                        style={{ color: step === s.id ? "#f2a154" : "rgba(255,255,255,0.3)" }}
                      />
                    )}
                  </div>
                  <span
                    className="text-xs font-medium hidden sm:block"
                    style={{ color: step >= s.id ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)" }}
                  >
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: step > s.id ? "100%" : "0%",
                        background: "linear-gradient(90deg, #e2622c, #f2a154)",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-white/35 text-xs">
            Paso {step} de {STEPS.length} · {STEPS[step - 1].desc}
          </p>
        </div>

        {/* Card */}
        <div
          key={step}
          className="rounded-3xl p-0.5 step-card"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
          }}
        >
          <div
            className="rounded-[22px] p-8"
            style={{
              background: "rgba(33, 26, 21, 0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(242, 233, 221, 0.08)",
            }}
          >

            {/* ─── STEP 1 ─── */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-1">Tu presencia en la red</h2>
                  <p className="text-[#a89a8d] text-sm">Comencemos con tus datos básicos</p>
                </div>

                {/* Google fast-track */}
                <button
                  onClick={() => {
                    localStorage.setItem("rt_register_name", "Facilitador/a Invitado/a")
                    localStorage.setItem("rt_register_discipline", "Facilitador/a de Biodanza")
                    localStorage.setItem("rt_register_linaje", "Formado/a en la Escuela Metropolitana de Biodanza")
                    signIn("google", { callbackUrl: "/professional/dashboard" })
                  }}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "rgba(255,255,255,0.95)", color: "#1a1a1a", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Registrarme con Google (más rápido)
                </button>

                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <span className="text-xs text-white/25 uppercase tracking-wider">o manualmente</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div style={inputStyle("firstName")}>
                    <input
                      className={inputClass}
                      placeholder="Nombre"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onFocus={() => setFocusedField("firstName")}
                      onBlur={() => setFocusedField("")}
                    />
                  </div>
                  <div style={inputStyle("lastName")}>
                    <input
                      className={inputClass}
                      placeholder="Apellidos"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onFocus={() => setFocusedField("lastName")}
                      onBlur={() => setFocusedField("")}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl px-4" style={inputStyle("email")}>
                  <Mail className="h-4 w-4 flex-shrink-0" style={{ color: focusedField === "email" ? "#f2a154" : "rgba(255,255,255,0.3)" }} />
                  <input
                    type="email"
                    className={`${inputClass} px-0`}
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>

                <div style={inputStyle("phone")}>
                  <input
                    className={inputClass}
                    placeholder="Teléfono (opcional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>

                <div>
                  <p className="text-white/50 text-xs font-medium mb-3 uppercase tracking-wider">¿Cuál es tu disciplina principal?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {PROFESSIONS.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setProfession(p.value)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-150 hover:scale-[1.02]"
                        style={{
                          background: profession === p.value ? "rgba(226, 98, 44, 0.15)" : "rgba(255,255,255,0.05)",
                          border: `1px solid ${profession === p.value ? "#e2622c" : "rgba(242, 233, 221, 0.08)"}`,
                          color: profession === p.value ? "#f2a154" : "rgba(255,255,255,0.55)",
                        }}
                      >
                        <span className="text-base">{p.emoji}</span>
                        <span className="font-medium leading-tight text-xs">{p.label}</span>
                        {profession === p.value && <Check className="h-3 w-3 ml-auto flex-shrink-0 text-[#f2a154]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── STEP 2 ─── */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-1">Tus raíces y especialidades</h2>
                  <p className="text-[#a89a8d] text-sm">Comparte de dónde vienes y tu enfoque</p>
                </div>

                {/* Specialties */}
                <div>
                  <p className="text-[#a89a8d] text-xs font-medium mb-3 uppercase tracking-wider">Especialidades (elige las que apliquen)</p>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleSpecialty(tag)}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 hover:scale-105"
                        style={{
                          background: specialties.includes(tag) ? "rgba(226, 98, 44, 0.15)" : "rgba(255,255,255,0.06)",
                          border: `1px solid ${specialties.includes(tag) ? "#e2622c" : "rgba(242, 233, 221, 0.10)"}`,
                          color: specialties.includes(tag) ? "#f2a154" : "rgba(255,255,255,0.45)",
                        }}
                      >
                        {specialties.includes(tag) && "✓ "}
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Linaje y Escuela Formadora */}
                <div>
                  <p className="text-[#a89a8d] text-xs font-medium mb-2 uppercase tracking-wider">Tu Linaje y Escuela Formadora *</p>
                  <div style={{ ...inputStyle("linaje"), padding: 0 }}>
                    <textarea
                      required
                      className={`${inputClass} min-h-[76px] resize-none py-3`}
                      placeholder="Ej. Formada por Amanda Paz en la Escuela de Biodanza de Viña del Mar, linaje Rolando Toro."
                      value={linaje}
                      onChange={(e) => setLinaje(e.target.value)}
                      onFocus={() => setFocusedField("linaje")}
                      onBlur={() => setFocusedField("")}
                    />
                  </div>
                </div>

                {/* Price & Duration */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-white/40 text-xs mb-2">Aporte sugerido por sesión</p>
                    <div style={inputStyle("price")}>
                      <input
                        className={inputClass}
                        placeholder="Ej: $2.000"
                        value={sessionPrice}
                        onChange={(e) => setSessionPrice(e.target.value)}
                        onFocus={() => setFocusedField("price")}
                        onBlur={() => setFocusedField("")}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-2">Duración aproximada</p>
                    <div style={inputStyle("duration")}>
                      <select
                        className={inputClass}
                        value={sessionDuration}
                        onChange={(e) => setSessionDuration(e.target.value)}
                        onFocus={() => setFocusedField("duration")}
                        onBlur={() => setFocusedField("")}
                        style={{ background: "transparent", appearance: "none" }}
                      >
                        <option value="">Duración</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="50">50 min</option>
                        <option value="60">60 min</option>
                        <option value="90">90 min</option>
                        <option value="120">120 min</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Modalities */}
                <div>
                  <p className="text-white/50 text-xs font-medium mb-3 uppercase tracking-wider">Modalidades de práctica</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "presencial", label: "Presencial (Espacio/Sala)", emoji: "🏢" },
                      { id: "online", label: "Online / Transmisión", emoji: "💻" },
                      { id: "domicilio", label: "Encuentro al aire libre / Domo", emoji: "🏕️" },
                      { id: "grupos", label: "Talleres y Grupos", emoji: "👥" },
                    ].map((mod) => (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() =>
                          setModalities((prev) =>
                            prev.includes(mod.id) ? prev.filter((m) => m !== mod.id) : [...prev, mod.id]
                          )
                        }
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all hover:scale-[1.02]"
                        style={{
                          background: modalities.includes(mod.id) ? "rgba(226, 98, 44, 0.15)" : "rgba(255,255,255,0.05)",
                          border: `1px solid ${modalities.includes(mod.id) ? "#e2622c" : "rgba(242, 233, 221, 0.08)"}`,
                          color: modalities.includes(mod.id) ? "#f2a154" : "rgba(255,255,255,0.5)",
                        }}
                      >
                        <span>{mod.emoji}</span>
                        <span className="font-medium text-xs text-left leading-tight">{mod.label}</span>
                        {modalities.includes(mod.id) && <Check className="h-3 w-3 ml-auto text-[#f2a154] flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <p className="text-white/40 text-xs mb-2">Descripción (opcional, puedes completarla después)</p>
                  <div style={{ ...inputStyle("bio"), padding: 0 }}>
                    <textarea
                      className={`${inputClass} min-h-[90px] resize-none py-3`}
                      placeholder="Describe tu enfoque y lo que hace único a tu fuego/espacio…"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      onFocus={() => setFocusedField("bio")}
                      onBlur={() => setFocusedField("")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── STEP 3 ─── */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-1">¿Dónde encendemos tu brasa?</h2>
                  <p className="text-[#a89a8d] text-sm">Geolocaliza tu práctica en el mapa vivo</p>
                </div>

                <div style={inputStyle("address")}>
                  <input
                    className={inputClass}
                    placeholder="Dirección / Lugar de práctica (ej. Domo, Sala o calle)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onFocus={() => setFocusedField("address")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>

                <div style={inputStyle("city")}>
                  <input
                    className={inputClass}
                    placeholder="Ciudad / Comuna"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onFocus={() => setFocusedField("city")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>

                {/* Photo upload */}
                <div>
                  <p className="text-white/40 text-xs mb-2">Foto de tu espacio o perfil (opcional)</p>
                  <button
                    type="button"
                    className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-2xl transition-all hover:scale-[1.01]"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "2px dashed rgba(242, 233, 221, 0.15)",
                    }}
                  >
                    <Upload className="h-6 w-6 text-white/30" />
                    <span className="text-[#a89a8d] text-sm">Sube una foto</span>
                    <span className="text-white/20 text-xs">JPG, PNG · Máx. 5MB</span>
                  </button>
                </div>

                {/* Terms — single combined checkbox */}
                <div
                  className="flex items-start gap-3 p-4 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(242, 233, 221, 0.08)" }}
                >
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-0.5 w-4 h-4 accent-[#e2622c] rounded flex-shrink-0"
                  />
                  <label htmlFor="terms" className="text-[#a89a8d] text-xs leading-relaxed cursor-pointer">
                    Acepto los{" "}
                    <Link href="#" className="text-[#f2a154] hover:text-[#f2a154]/80 underline underline-offset-2">términos y condiciones</Link>
                    {" "}y la{" "}
                    <Link href="#" className="text-[#f2a154] hover:text-[#f2a154]/80 underline underline-offset-2">política de privacidad</Link>
                    {" "}de Raíz·Red, incluyendo la verificación de mi linaje declarado.
                  </label>
                </div>

                {/* What happens next */}
                <div
                  className="p-4 rounded-2xl space-y-2"
                  style={{ background: "rgba(226, 98, 44, 0.06)", border: "1px solid rgba(226, 98, 44, 0.12)" }}
                >
                  <p className="text-[#f2a154] text-xs font-semibold uppercase tracking-wider mb-3">¿Qué sigue?</p>
                  {[
                    "Revisamos tu linaje y nodo en 24–48 h",
                    "Recibirás un email para validar tu brasa",
                    "Tu nodo aparecerá brillando en el mapa colectivo de linajes",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ background: "rgba(226, 98, 44, 0.15)", color: "#f2a154" }}
                      >
                        {i + 1}
                      </div>
                      <span className="text-[#a89a8d] text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </button>

          <button
            type="button"
            onClick={async () => {
              if (step < 3) {
                handleNext()
              } else {
                // Validate that terms and conditions checkbox is checked
                const termsChecked = (document.getElementById("terms") as HTMLInputElement)?.checked;
                if (!termsChecked) {
                  alert("Por favor acepta los términos y condiciones.")
                  return
                }

                setIsSubmitting(true)
                if (email) {
                  // Save to localStorage
                  localStorage.setItem("rt_register_name", `${firstName} ${lastName}`.trim())
                  
                  const selectedProf = PROFESSIONS.find(p => p.value === profession);
                  const profLabel = selectedProf ? selectedProf.label : "Facilitador/a de Desarrollo Somático";
                  localStorage.setItem("rt_register_discipline", profLabel)
                  localStorage.setItem("rt_register_linaje", linaje)
                  localStorage.setItem("rt_register_city", city)
                  
                  // Save proposed node to the map live list so it shows up in real time on homepage
                  const newProposedNode = {
                    id: Date.now(),
                    n: `${firstName} ${lastName}`.trim(),
                    cats: [selectedProf?.label || "Bienestar"],
                    lat: -33.45 + (Math.random() - 0.5) * 0.08,
                    lng: -70.62 + (Math.random() - 0.5) * 0.08,
                    info: `${city} · Linaje: ${linaje}`,
                    pending: true
                  }
                  
                  try {
                    const existing = localStorage.getItem("raiz_proposed_nodes")
                    const list = existing ? JSON.parse(existing) : []
                    list.push(newProposedNode)
                    localStorage.setItem("raiz_proposed_nodes", JSON.stringify(list))
                    
                    // Dispatch event for local live updating
                    window.dispatchEvent(new Event("storage"))
                  } catch (e) {
                    console.error("Error saving proposed node", e)
                  }

                  await signIn("email", { email, callbackUrl: "/professional/dashboard" })
                } else {
                  console.error("El email es requerido")
                  setIsSubmitting(false)
                }
              }
            }}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #e2622c 0%, #f2a154 100%)",
              color: "#171310",
              boxShadow: "0 8px 24px rgba(226, 98, 44, 0.3)",
            }}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-[#171310]/40 border-t-[#171310] rounded-full animate-spin" />
            ) : (
              <>
                {step === 3 ? "Crear mi perfil" : "Continuar"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {/* Skip hint */}
        {step < 3 && (
          <p className="text-center text-[#a89a8d]/40 text-xs mt-4">
            Puedes completar el resto de tu perfil después del registro
          </p>
        )}
      </div>
    </div>
  )
}
