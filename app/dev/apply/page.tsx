"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Leaf,
  Send,
  Github,
  Globe,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Code2,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react"

const ROLES = [
  { id: "fullstack", label: "Full-Stack Developer", icon: Code2 },
  { id: "uxui", label: "UX/UI Designer · Dev", icon: Layers },
  { id: "devops", label: "DevOps / Infraestructura", icon: Terminal },
  { id: "mobile", label: "Mobile Developer", icon: Cpu },
]

const SKILLS_OPTIONS = [
  "Next.js",
  "React / React Native",
  "TypeScript",
  "Supabase",
  "PostgreSQL",
  "Tailwind CSS",
  "Google Maps API / GIS",
  "Figma",
  "UI Animations",
  "Docker / CI-CD",
  "Node.js",
  "GraphQL",
]

export default function ApplyDevPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    github_url: "",
    portfolio_url: "",
    experience: "mid",
    motivation: "",
    skills: [] as string[],
  })

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleToggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.role) {
      setError("Por favor completa los campos obligatorios.")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/dev/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const json = await res.json()
      if (res.ok && json.success) {
        setSuccess(true)
      } else {
        setError(json.error || "Ocurrió un error al enviar tu postulación. Inténtalo de nuevo.")
      }
    } catch (err) {
      setError("Error de red. Por favor verifica tu conexión e inténtalo de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen text-[#f2e9dd] relative overflow-hidden"
      style={{ background: "#171310", fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-[#e2622c] opacity-[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[5%] w-[450px] h-[450px] bg-[#5c6b45] opacity-[0.04] blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[rgba(242,233,221,0.06)] bg-[rgba(23,19,16,0.85)] backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dev" className="flex items-center gap-2.5 text-[#a89a8d] hover:text-[#f2e9dd] transition-colors group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[rgba(242,233,221,0.03)] border border-[rgba(242,233,221,0.08)] group-hover:border-[rgba(226,98,44,0.3)] group-hover:bg-[rgba(226,98,44,0.05)] transition-all">
              <ArrowLeft className="w-4 h-4 text-[#a89a8d] group-hover:text-[#e2622c] group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider font-bold">Volver al Portal Dev</span>
          </Link>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(226,98,44,0.15)] border border-[rgba(226,98,44,0.25)]">
              <Leaf className="w-3.5 h-3.5 text-[#e2622c]" />
            </div>
            <span className="font-fraunces text-base font-bold text-white">Raíz</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 relative z-10">
        {success ? (
          /* SUCCESS STATE */
          <div className="text-center bg-[#211a15] border border-[rgba(92,107,69,0.25)] rounded-3xl p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[rgba(92,107,69,0.1)] border-2 border-[#5c6b45] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-[#b5c79e]" />
            </div>
            <h1 className="font-fraunces text-3xl md:text-4xl font-bold text-white mb-4">
              ¡Postulación Recibida!
            </h1>
            <p className="text-sm text-[#a89a8d] leading-relaxed max-w-lg mx-auto mb-8">
              Gracias, <span className="text-[#f2e9dd] font-semibold">{formData.name}</span>, por sintonizar con el fuego de nuestra red.
              Hemos guardado tus datos en la bitácora de desarrollo. Revisaremos tu perfil y tu motivación para cocrear este espacio en los próximos días.
            </p>
            <div className="bg-[#171310] border border-[rgba(242,233,221,0.06)] rounded-2xl p-6 text-left max-w-md mx-auto mb-10 space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-[rgba(242,233,221,0.04)] pb-2 text-[10px] text-[#a89a8d] uppercase">
                <span>Detalles del Registro</span>
                <span className="text-[#b5c79e]">Pendiente de revisión</span>
              </div>
              <p><span className="text-[#a89a8d]">Rol:</span> {ROLES.find(r => r.id === formData.role)?.label || formData.role}</p>
              <p><span className="text-[#a89a8d]">Email:</span> {formData.email}</p>
              {formData.github_url && <p><span className="text-[#a89a8d]">GitHub:</span> {formData.github_url}</p>}
              <p><span className="text-[#a89a8d]">Habilidades seleccionadas:</span> {formData.skills.join(", ") || "Ninguna"}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dev"
                className="px-6 py-3 rounded-xl bg-[rgba(242,233,221,0.05)] border border-[rgba(242,233,221,0.1)] hover:border-[rgba(242,233,221,0.2)] text-xs font-mono uppercase tracking-wider font-bold transition-all"
              >
                Volver al Portal
              </Link>
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-[#e2622c] hover:bg-[#f2a154] text-[#171310] text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-[0_4px_15px_rgba(226,98,44,0.25)]"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <div className="space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-[rgba(226,98,44,0.1)] border border-[rgba(226,98,44,0.25)] rounded-full px-3.5 py-1 mb-4 text-[#f2a154]">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Únete al linaje dev</span>
              </div>
              <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-white mb-4">
                Postular para el equipo dev
              </h1>
              <p className="text-sm text-[#a89a8d] leading-relaxed">
                Queremos conocer tus capacidades técnicas, pero sobre todo tu sintonía con el propósito de tejer esta infraestructura de bienestar de manera abierta, colaborativa y transparente.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#211a15] border border-[rgba(242,233,221,0.06)] rounded-3xl p-8 md:p-10 shadow-[0_20px_45px_rgba(0,0,0,0.4)] space-y-8">
              {error && (
                <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl text-red-400 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Sección 1: Información Básica */}
              <div className="space-y-6">
                <h3 className="font-fraunces text-lg font-semibold text-white border-b border-[rgba(242,233,221,0.06)] pb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#e2622c]" /> 1. Información General
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-mono uppercase tracking-wider text-[#a89a8d] font-semibold">
                      Nombre Completo <span className="text-[#e2622c]">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      placeholder="Ej. Matías Aravena"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-[#171310] border border-[rgba(242,233,221,0.1)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#a89a8d]/50 focus:outline-none focus:border-[#f2a154] transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-[#a89a8d] font-semibold">
                      Correo Electrónico <span className="text-[#e2622c]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="Ej. matias@raiz.red"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-[#171310] border border-[rgba(242,233,221,0.1)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#a89a8d]/50 focus:outline-none focus:border-[#f2a154] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#a89a8d] font-semibold block">
                    Rol Principal en el que quieres aportar <span className="text-[#e2622c]">*</span>
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {ROLES.map((role) => {
                      const IconComponent = role.icon
                      const isSelected = formData.role === role.id
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, role: role.id }))}
                          className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "bg-[rgba(226,98,44,0.08)] border-[#e2622c] text-white"
                              : "bg-[#171310] border-[rgba(242,233,221,0.06)] text-[#a89a8d] hover:border-[rgba(242,233,221,0.15)] hover:text-[#f2e9dd]"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-[rgba(226,98,44,0.15)] text-[#f2a154]"
                                : "bg-[rgba(242,233,221,0.03)] text-[#a89a8d]"
                            }`}
                          >
                            <IconComponent className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold font-mono tracking-wide">{role.label}</p>
                            <span className="text-[10px] opacity-75">Haz clic para seleccionar</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="experience" className="text-xs font-mono uppercase tracking-wider text-[#a89a8d] font-semibold block">
                    Nivel de Experiencia
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "junior", label: "Junior" },
                      { id: "mid", label: "Mid" },
                      { id: "senior", label: "Senior" },
                      { id: "lead", label: "Lead/Architect" },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, experience: lvl.id }))}
                        className={`py-2 px-3 rounded-lg border text-center text-xs transition-all ${
                          formData.experience === lvl.id
                            ? "bg-[#5c6b45]/20 border-[#5c6b45] text-[#b5c79e] font-bold"
                            : "bg-[#171310] border-[rgba(242,233,221,0.06)] text-[#a89a8d] hover:border-[rgba(242,233,221,0.12)]"
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sección 2: Enlaces y Habilidades */}
              <div className="space-y-6">
                <h3 className="font-fraunces text-lg font-semibold text-white border-b border-[rgba(242,233,221,0.06)] pb-2 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#e2622c]" /> 2. Experiencia Técnica
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="github" className="text-xs font-mono uppercase tracking-wider text-[#a89a8d] font-semibold flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5" /> Perfil de GitHub
                    </label>
                    <input
                      type="url"
                      id="github"
                      placeholder="https://github.com/tu-usuario"
                      value={formData.github_url}
                      onChange={(e) => setFormData((prev) => ({ ...prev, github_url: e.target.value }))}
                      className="w-full bg-[#171310] border border-[rgba(242,233,221,0.1)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#a89a8d]/30 focus:outline-none focus:border-[#f2a154] transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="portfolio" className="text-xs font-mono uppercase tracking-wider text-[#a89a8d] font-semibold flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> Portfolio o LinkedIn
                    </label>
                    <input
                      type="url"
                      id="portfolio"
                      placeholder="https://portfolio.dev/tu-nombre"
                      value={formData.portfolio_url}
                      onChange={(e) => setFormData((prev) => ({ ...prev, portfolio_url: e.target.value }))}
                      className="w-full bg-[#171310] border border-[rgba(242,233,221,0.1)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#a89a8d]/30 focus:outline-none focus:border-[#f2a154] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#a89a8d] font-semibold block">
                    Habilidades e Intereses de Desarrollo
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {SKILLS_OPTIONS.map((skill) => {
                      const isSelected = formData.skills.includes(skill)
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleToggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                            isSelected
                              ? "bg-[#e2622c]/10 border-[#e2622c] text-[#f2a154] font-bold"
                              : "bg-[#171310] border-[rgba(242,233,221,0.06)] text-[#a89a8d] hover:border-[rgba(242,233,221,0.12)] hover:text-[#f2e9dd]"
                          }`}
                        >
                          {skill}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Sección 3: Motivación */}
              <div className="space-y-6">
                <h3 className="font-fraunces text-lg font-semibold text-white border-b border-[rgba(242,233,221,0.06)] pb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#e2622c]" /> 3. Motivación
                </h3>

                <div className="space-y-2">
                  <label htmlFor="motivation" className="text-xs font-mono uppercase tracking-wider text-[#a89a8d] font-semibold block">
                    ¿Por qué te gustaría unirte a construir Raíz?
                  </label>
                  <textarea
                    id="motivation"
                    rows={5}
                    placeholder="Cuéntanos un poco sobre tu conexión con el bienestar integral (yoga, meditación, etc.) y cómo crees que la tecnología abierta puede potenciar este ecosistema..."
                    value={formData.motivation}
                    onChange={(e) => setFormData((prev) => ({ ...prev, motivation: e.target.value }))}
                    className="w-full bg-[#171310] border border-[rgba(242,233,221,0.1)] rounded-2xl p-4 text-sm text-white placeholder-[#a89a8d]/40 focus:outline-none focus:border-[#f2a154] transition-colors leading-relaxed resize-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-[#e2622c] hover:bg-[#f2a154] text-[#171310] font-bold font-mono uppercase tracking-widest text-xs transition-all duration-300 shadow-[0_6px_20px_rgba(226,98,44,0.25)] hover:shadow-[0_8px_25px_rgba(242,161,84,0.35)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>Enviando postulación...</>
                  ) : (
                    <>
                      Enviar Postulación
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
