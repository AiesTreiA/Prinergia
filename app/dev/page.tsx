"use client"

import { useState } from "react"
import Link from "next/link"
import { RaizIcon } from "@/components/ui/raiz-icon"
import {
  Code2,
  GitBranch,
  ArrowRight,
  Terminal,
  Globe,
  Database,
  Cpu,
  Zap,
  Users,
  Shield,
  Map,
  ChevronRight,
  Star,
  Package,
  Layers,
  Heart,
  Github,
  ExternalLink,
} from "lucide-react"

const TECH_STACK = [
  { icon: Globe, label: "Next.js 14", desc: "App Router + RSC", color: "#e2622c" },
  { icon: Database, label: "Supabase", desc: "PostgreSQL + Auth + Storage", color: "#5c6b45" },
  { icon: Cpu, label: "TypeScript", desc: "Tipado estricto end-to-end", color: "#c99a3c" },
  { icon: Layers, label: "Tailwind CSS", desc: "Design system propio", color: "#e2622c" },
  { icon: Map, label: "Google Maps API", desc: "Mapa interactivo de linajes", color: "#5c6b45" },
  { icon: Zap, label: "Vercel", desc: "Despliegue continuo", color: "#c99a3c" },
]

const ROADMAP = [
  {
    phase: "Fase I",
    title: "Mapa de Linajes",
    status: "done",
    items: ["Mapa interactivo con filtros", "Fichas de terapeutas y centros", "Sistema de reservas P2P", "Panel de administración"],
  },
  {
    phase: "Fase II",
    title: "Comunidad y Formación",
    status: "active",
    items: ["Perfil de practitioner verificado", "Sistema de eventos y retiros", "Mensajería interna", "Módulo de reseñas"],
  },
  {
    phase: "Fase III",
    title: "Economía Regenerativa",
    status: "upcoming",
    items: ["Token de reconocimiento comunitario", "Fondo de acceso solidario", "API pública de linajes", "App móvil nativa"],
  },
]

const OPEN_ROLES = [
  {
    title: "Full-Stack Developer",
    tags: ["Next.js", "Supabase", "TypeScript"],
    desc: "Construir nuevas funcionalidades del producto: módulo de eventos, API pública, sistema de perfiles avanzados.",
    icon: Code2,
  },
  {
    title: "UX/UI Designer · Dev",
    tags: ["Figma", "CSS", "Animaciones"],
    desc: "Co-diseñar interfaces que traduzcan la estética de los linajes en experiencias digitales de alta resonancia.",
    icon: Layers,
  },
  {
    title: "DevOps / Infraestructura",
    tags: ["Vercel", "Postgres", "CI/CD"],
    desc: "Optimizar pipelines, monitoreo, seguridad de datos y escalabilidad de la plataforma.",
    icon: Shield,
  },
  {
    title: "Mobile Developer",
    tags: ["React Native", "Expo", "Maps"],
    desc: "Construir la app móvil nativa que llevará la red de linajes al bolsillo de practicantes y facilitadores.",
    icon: Cpu,
  },
]

const STATS = [
  { value: "3", label: "Países activos", sub: "CL · AR · CO" },
  { value: "5+", label: "Disciplinas mapeadas", sub: "Biodanza, Yoga, Reiki…" },
  { value: "Open", label: "Código abierto", sub: "pronto en GitHub" },
  { value: "∞", label: "Propósito", sub: "Red de bienestar viva" },
]

export default function DevPage() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div
      className="min-h-screen text-[#f2e9dd]"
      style={{ background: "#171310", fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-[#e2622c] opacity-[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-[#5c6b45] opacity-[0.05] blur-[100px] rounded-full" />
        <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-[#c99a3c] opacity-[0.03] blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 border-b border-[rgba(242,233,221,0.06)] bg-[rgba(23,19,16,0.85)] backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[rgba(226,98,44,0.15)] border border-[rgba(226,98,44,0.25)] transition-transform group-hover:scale-110 duration-200">
              <RaizIcon className="w-4 h-4 text-[#e2622c]" />
            </div>
            <span className="font-fraunces text-lg font-bold text-white">Raíz</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase bg-[rgba(92,107,69,0.2)] border border-[rgba(92,107,69,0.4)] text-[#b5c79e] px-2.5 py-1 rounded-full font-bold tracking-wider">
              Portal Dev
            </span>
            <Link
              href="/dev/apply"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#e2622c] hover:bg-[#f2a154] text-[#171310] font-bold text-xs transition-all duration-300 shadow-[0_4px_14px_rgba(226,98,44,0.3)] hover:shadow-[0_6px_20px_rgba(242,161,84,0.4)] hover:-translate-y-0.5"
            >
              Postular al Equipo
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-28 relative z-10">

        {/* ─── HERO ─── */}
        <section className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[rgba(92,107,69,0.1)] border border-[rgba(92,107,69,0.3)] rounded-full px-4 py-1.5 mb-6">
            <Terminal className="w-3.5 h-3.5 text-[#b5c79e]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#b5c79e] font-bold">Open Source · En construcción</span>
          </div>

          <h1 className="font-fraunces text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
            Construye la red de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e2622c] via-[#f2a154] to-[#c99a3c]">
              bienestar viva
            </span>
          </h1>

          <p className="text-[#a89a8d] text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Raíz es una plataforma de código abierto que mapea los linajes de bienestar en Latinoamérica.
            Buscamos developers apasionados que quieran construir tecnología con propósito regenerativo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dev/apply"
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#e2622c] hover:bg-[#f2a154] text-[#171310] font-bold text-sm transition-all duration-300 shadow-[0_8px_25px_rgba(226,98,44,0.3)] hover:shadow-[0_12px_35px_rgba(242,161,84,0.4)] hover:-translate-y-1"
            >
              Postular al Equipo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://github.com/AiesTreiA/Prinergia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[rgba(242,233,221,0.05)] border border-[rgba(242,233,221,0.12)] hover:border-[rgba(242,233,221,0.25)] text-[#f2e9dd] font-bold text-sm transition-all duration-300 hover:-translate-y-1"
            >
              <Github className="w-4 h-4" />
              Ver Repositorio
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="bg-[#211a15] border border-[rgba(242,233,221,0.06)] rounded-2xl p-6 text-center hover:border-[rgba(226,98,44,0.2)] transition-all duration-300 hover:-translate-y-1"
            >
              <p className="font-fraunces text-4xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs font-bold text-[#f2e9dd] mb-1">{stat.label}</p>
              <p className="text-[10px] font-mono text-[#a89a8d] uppercase tracking-wider">{stat.sub}</p>
            </div>
          ))}
        </section>

        {/* ─── TECH STACK ─── */}
        <section>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-5 h-5 text-[#e2622c]" />
              <h2 className="font-fraunces text-3xl font-bold text-white">Stack Tecnológico</h2>
            </div>
            <p className="text-[#a89a8d] text-sm leading-relaxed max-w-xl">
              Herramientas modernas, bien integradas y orientadas a la velocidad de desarrollo y la experiencia del usuario.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TECH_STACK.map((tech, i) => (
              <div
                key={i}
                className="group bg-[#211a15] border border-[rgba(242,233,221,0.06)] rounded-2xl p-5 hover:border-[rgba(226,98,44,0.2)] transition-all duration-300 hover:-translate-y-1 cursor-default"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                  style={{
                    background: hovered === i ? `${tech.color}20` : "rgba(242,233,221,0.05)",
                    border: `1px solid ${hovered === i ? tech.color + "40" : "rgba(242,233,221,0.08)"}`,
                  }}
                >
                  <tech.icon
                    className="w-5 h-5 transition-colors duration-300"
                    style={{ color: hovered === i ? tech.color : "#a89a8d" }}
                  />
                </div>
                <p className="font-bold text-white text-sm mb-1">{tech.label}</p>
                <p className="text-xs text-[#a89a8d]">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── ROADMAP ─── */}
        <section>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <GitBranch className="w-5 h-5 text-[#e2622c]" />
              <h2 className="font-fraunces text-3xl font-bold text-white">Roadmap del Proyecto</h2>
            </div>
            <p className="text-[#a89a8d] text-sm leading-relaxed max-w-xl">
              Tres fases de desarrollo que van desde el mapa de linajes hasta una economía regenerativa distribuida.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {ROADMAP.map((phase, i) => (
              <div
                key={i}
                className={`relative rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                  phase.status === "done"
                    ? "bg-[rgba(92,107,69,0.08)] border-[rgba(92,107,69,0.2)]"
                    : phase.status === "active"
                    ? "bg-[rgba(226,98,44,0.08)] border-[rgba(226,98,44,0.25)] shadow-[0_0_40px_rgba(226,98,44,0.08)]"
                    : "bg-[#211a15] border-[rgba(242,233,221,0.06)]"
                }`}
              >
                {phase.status === "active" && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#e2622c] animate-pulse" />
                    <span className="text-[10px] font-mono text-[#f2a154] uppercase tracking-wider font-bold">Activo</span>
                  </div>
                )}

                <div className="mb-4">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${
                      phase.status === "done"
                        ? "bg-[rgba(92,107,69,0.2)] text-[#b5c79e]"
                        : phase.status === "active"
                        ? "bg-[rgba(226,98,44,0.15)] text-[#f2a154]"
                        : "bg-[rgba(242,233,221,0.05)] text-[#a89a8d]"
                    }`}
                  >
                    {phase.phase}
                  </span>
                </div>

                <h3 className="font-fraunces text-xl font-bold text-white mb-4">{phase.title}</h3>

                <ul className="space-y-2.5">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-xs text-[#a89a8d]">
                      <div
                        className={`w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center border ${
                          phase.status === "done"
                            ? "bg-[rgba(92,107,69,0.3)] border-[#5c6b45]"
                            : phase.status === "active"
                            ? "bg-[rgba(226,98,44,0.15)] border-[rgba(226,98,44,0.4)]"
                            : "border-[rgba(242,233,221,0.15)]"
                        }`}
                      >
                        {phase.status === "done" && (
                          <svg className="w-2.5 h-2.5 text-[#b5c79e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {phase.status === "active" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#e2622c]" />
                        )}
                      </div>
                      <span className={phase.status === "done" ? "text-[#f2e9dd]" : ""}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ─── OPEN ROLES ─── */}
        <section>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-[#e2622c]" />
              <h2 className="font-fraunces text-3xl font-bold text-white">Roles Abiertos</h2>
            </div>
            <p className="text-[#a89a8d] text-sm leading-relaxed max-w-xl">
              No buscamos empleados, buscamos co-creadores. Si sientes el llamado de construir tecnología con alma, este es tu lugar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {OPEN_ROLES.map((role, i) => (
              <Link
                key={i}
                href="/dev/apply"
                className="group bg-[#211a15] border border-[rgba(242,233,221,0.06)] rounded-3xl p-6 hover:border-[rgba(226,98,44,0.25)] hover:bg-[rgba(226,98,44,0.04)] transition-all duration-300 hover:-translate-y-1 block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[rgba(226,98,44,0.1)] border border-[rgba(226,98,44,0.2)] flex items-center justify-center group-hover:bg-[rgba(226,98,44,0.15)] transition-all">
                    <role.icon className="w-5 h-5 text-[#e2622c]" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#a89a8d] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>

                <h3 className="font-fraunces text-xl font-bold text-white mb-2">{role.title}</h3>
                <p className="text-xs text-[#a89a8d] leading-relaxed mb-4">{role.desc}</p>

                <div className="flex flex-wrap gap-2">
                  {role.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-[rgba(242,233,221,0.05)] border border-[rgba(242,233,221,0.1)] text-[#a89a8d]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── VALUES ─── */}
        <section className="bg-[#211a15] border border-[rgba(242,233,221,0.06)] rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 w-[400px] h-[200px] bg-[#e2622c] opacity-[0.04] blur-[80px] -translate-x-1/2" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(226,98,44,0.1)] border border-[rgba(226,98,44,0.2)] flex items-center justify-center mx-auto mb-6">
              <Heart className="w-6 h-6 text-[#e2622c]" />
            </div>
            <h2 className="font-fraunces text-3xl md:text-4xl font-bold text-white mb-4">
              Tecnología con propósito
            </h2>
            <p className="text-[#a89a8d] text-base leading-relaxed max-w-2xl mx-auto mb-8">
              En Raíz no solo escribimos código. Creamos infraestructura para que los linajes de sanación y bienestar puedan conectar, crecer y sostenerse en el mundo digital. Cada línea de código es un acto de servicio a la comunidad.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              {["Open Source", "Propósito Regenerativo", "Comunidad Primero", "Código como servicio", "No VC-backed"].map((v, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-bold px-3 py-1.5 rounded-full bg-[rgba(242,233,221,0.05)] border border-[rgba(242,233,221,0.1)] text-[#f2e9dd]"
                >
                  <Star className="w-3 h-3 text-[#c99a3c]" />
                  {v}
                </span>
              ))}
            </div>
            <Link
              href="/dev/apply"
              className="group inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-[#e2622c] hover:bg-[#f2a154] text-[#171310] font-bold text-sm transition-all duration-300 shadow-[0_8px_25px_rgba(226,98,44,0.3)] hover:shadow-[0_12px_35px_rgba(242,161,84,0.4)] hover:-translate-y-1"
            >
              Quiero ser parte del equipo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

      </main>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[rgba(242,233,221,0.06)] px-6 py-8 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(226,98,44,0.15)] border border-[rgba(226,98,44,0.25)]">
              <RaizIcon className="w-3.5 h-3.5 text-[#e2622c]" />
            </div>
            <span className="font-fraunces text-base font-bold text-white">Raíz · Red</span>
          </Link>
          <p className="text-[11px] font-mono text-[#a89a8d] uppercase tracking-wider">
            Portal de Desarrolladores · Fase II en construcción
          </p>
          <Link href="/dev/apply" className="text-xs text-[#e2622c] hover:text-[#f2a154] font-bold transition-colors">
            Postular →
          </Link>
        </div>
      </footer>
    </div>
  )
}
