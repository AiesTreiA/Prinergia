"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Check, Sparkles, AlertCircle, ArrowRight, Heart, Shield, Compass, MapPin, Share2, Copy, Send, MessageSquare } from "lucide-react"
import Link from "next/link"
import { RaizIcon } from "@/components/ui/raiz-icon"

interface MapLocation {
  id: string
  name: string
  specialty: string
  address: string
  type: string
  avatar: string
  consent_status: string
}

function ConsentForm() {
  const searchParams = useSearchParams()
  const locationId = searchParams.get("id")

  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<MapLocation | null>(null)
  const [error, setError] = useState("")
  const [contribution, setContribution] = useState<0 | 2000 | 5000>(2000)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!locationId) {
      setError("No se especificó un identificador de nodo válido en la URL.")
      setLoading(false)
      return
    }

    async function fetchLocation() {
      try {
        const res = await fetch(`/api/consent?id=${locationId}`)
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setLocation(json.data)
          } else {
            setError("El nodo especificado no existe o fue removido.")
          }
        } else {
          setError("Error al cargar la información del nodo.")
        }
      } catch (err) {
        setError("Error de red al conectar con el servidor.")
      } finally {
        setLoading(false)
      }
    }

    fetchLocation()
  }, [locationId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!locationId) return

    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: locationId,
          contribution_level: contribution
        })
      })

      if (res.ok) {
        setSuccess(true)
      } else {
        const json = await res.json()
        setError(json.error || "No se pudo registrar tu consentimiento.")
      }
    } catch (err) {
      setError("Error de red al guardar los datos.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center items-center px-4 py-12">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #120e0c 0%, #1c1511 40%, #1f271b 70%, #10140e 100%)",
        }}
      />
      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #e2622c 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #5c6b45 0%, transparent 70%)" }} />

      <div className="w-full max-w-xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[rgba(226,98,44,0.15)] border border-[rgba(226,98,44,0.25)] transition-transform group-hover:scale-105">
              <RaizIcon className="w-4 h-4 text-[#e2622c]" />
            </div>
            <span className="font-bold text-white text-lg tracking-wider">Red Raíz</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white font-serif">Consenso de la Red</h1>
          <p className="text-white/60 text-xs mt-2 max-w-md mx-auto">
            Activa tu nodo en el mapa soberano y elige cómo colaborar con el sustento de la red de bienestar.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#211a15]/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-[rgba(242,233,221,0.08)] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {loading ? (
            <div className="py-16 text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e2622c] mx-auto"></div>
              <p className="text-white/50 text-xs font-mono">Buscando coordenadas de tu linaje...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center space-y-6">
              <div className="w-12 h-12 rounded-full bg-red-950/30 border border-red-900/50 flex items-center justify-center mx-auto text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-red-300 text-sm max-w-sm mx-auto">{error}</p>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[rgba(242,233,221,0.05)] border border-[rgba(242,233,221,0.1)] text-white text-xs font-mono uppercase tracking-wider hover:bg-[rgba(242,233,221,0.1)] transition-colors"
              >
                Volver al Mapa
              </Link>
            </div>
          ) : success ? (
            <div className="py-8 text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-green-950/30 border border-green-900/50 flex items-center justify-center mx-auto text-green-400">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">¡Consentimiento Registrado!</h3>
                <p className="text-white/60 text-xs leading-relaxed max-w-sm mx-auto">
                  Tu espacio <strong>"{location?.name}"</strong> ha sido activado con éxito. Ahora eres parte oficial del mapa y la red de bienestar soberana.
                </p>
              </div>

              {/* Widget de Compartir para expandir la red */}
              <div className="bg-[#171310]/50 border border-[rgba(242,233,221,0.04)] rounded-2xl p-5 text-left max-w-md mx-auto space-y-4">
                <div className="flex items-center gap-2 text-[#f2a154]">
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">¡El micelio crece contigo!</span>
                </div>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Para que esta red sea soberana, necesitamos masa crítica. Comparte este mapa con tus alumnos, facilitadores de tu linaje y colegas terapeutas para que enciendan su brasa en la red.
                </p>
                
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      const shareText = encodeURIComponent(
                        `¡Hola! Acabo de activar mi nodo "${location?.name}" en Red Raíz, el mapa vivo y colaborativo de bienestar. Te invito a sumar tu espacio o buscar facilitadores aquí: ${window.location.origin}/map`
                      );
                      window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#25d366]/10 hover:bg-[#25d366]/20 border border-[#25d366]/30 rounded-xl text-white text-[10px] font-mono uppercase tracking-wider transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25d366]" /> WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      const shareText = encodeURIComponent(
                        `¡Hola! Acabo de activar mi nodo "${location?.name}" en Red Raíz, el mapa vivo y colaborativo de bienestar. Te invito a sumar tu espacio o buscar facilitadores aquí:`
                      );
                      const shareUrl = encodeURIComponent(`${window.location.origin}/map`);
                      window.open(`https://t.me/share/url?url=${shareUrl}&text=${shareText}`, '_blank');
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/30 rounded-xl text-white text-[10px] font-mono uppercase tracking-wider transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-[#0088cc]" /> Telegram
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/map`);
                    alert("Enlace de Red Raíz copiado al portapapeles!");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[rgba(242,233,221,0.03)] hover:bg-[rgba(242,233,221,0.06)] border border-[rgba(242,233,221,0.08)] rounded-xl text-white text-[10px] font-mono uppercase tracking-wider transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-white/70" /> Copiar Enlace del Mapa
                </button>
              </div>

              {contribution > 0 && (
                <div className="bg-[#171310] border border-[rgba(242,233,221,0.04)] rounded-2xl p-4 text-left max-w-md mx-auto space-y-2">
                  <div className="flex items-center gap-2 text-[#e2622c]">
                    <Heart className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold font-mono">APORTE SELECCIONADO: ${contribution.toLocaleString("es-CL")} CLP/mes</span>
                  </div>
                  <p className="text-[10px] text-white/50 leading-normal">
                    Gracias por apoyar activamente el desarrollo libre y descentralizado. Un custodio se pondrá en contacto para indicarte cómo realizar tu contribución en tokens estables (USDC/USDT) o transferencia, o bien podrás configurarlo en tu panel una vez habilitado.
                  </p>
                </div>
              )}

              <div className="pt-4">
                <Link
                  href="/map"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#e2622c] hover:bg-[#f2a154] text-[#171310] font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_6px_20px_rgba(226,98,44,0.2)]"
                >
                  Ver en el Mapa <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
              {/* Info del Nodo Pre-mapeado */}
              <div className="bg-[#171310]/50 border border-[rgba(242,233,221,0.04)] rounded-2xl p-5 space-y-3">
                <span className="text-[9px] font-mono uppercase bg-[#e2622c]/10 text-[#e2622c] border border-[#e2622c]/20 px-2 py-0.5 rounded-full font-bold">
                  Espacio Pre-Mapeado Detectado
                </span>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#e2622c]" />
                    {location?.name}
                  </h3>
                  <p className="text-[#e2622c] text-xs font-semibold">{location?.specialty}</p>
                </div>
                <div className="flex items-start gap-1.5 text-white/40 text-xs">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#5c6b45]" />
                  <span>{location?.address}</span>
                </div>
              </div>

              {/* Texto de Consenso */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Llamado al Tejido Colectivo</h4>
                <p className="text-white/70 text-xs leading-relaxed">
                  Tu trayectoria y sabiduría en <strong className="text-[#e2622c]">{location?.specialty}</strong> es un pilar fundamental en el territorio. Hemos pre-mapeado tu espacio <strong className="text-white">"{location?.name}"</strong> para honrar tu labor y hacer visible la red de sanación.
                </p>
                <p className="text-white/60 text-xs leading-relaxed">
                  Al confirmar tu consentimiento, tu nodo brillará oficialmente en el mapa de Red Raíz, permitiendo que alumnos, colegas y la comunidad conecten de forma directa, soberana y libre de comisiones intermediarias.
                </p>
              </div>

              {/* Opciones de Contribución */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider font-mono block">Elegir Nivel de Aporte Mensual</label>
                
                <div className="grid gap-3">
                  
                  {/* Opción 0 */}
                  <div
                    onClick={() => setContribution(0)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      contribution === 0
                        ? "bg-[#5c6b45]/15 border-[#5c6b45] text-white"
                        : "bg-[#171310]/60 border-[rgba(242,233,221,0.06)] text-white/60 hover:border-white/20"
                    }`}
                  >
                    <div className="mt-1">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${contribution === 0 ? "border-[#5c6b45]" : "border-white/30"}`}>
                        {contribution === 0 && <div className="w-2 h-2 rounded-full bg-[#5c6b45]" />}
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-bold text-white">Gratis (Plan Semilla)</span>
                        <span className="text-[9px] uppercase tracking-wider bg-[rgba(242,233,221,0.05)] text-white/40 px-1.5 py-0.5 rounded font-mono font-bold">
                          Semilla
                        </span>
                      </div>
                      <p className="text-[10px] text-white/50 mt-1 leading-normal">
                        Deseo unirme a alguna comunidad, asistir, conocer y compartir presencia en el mapa.
                      </p>
                    </div>
                  </div>

                  {/* Opción 2000 */}
                  <div
                    onClick={() => setContribution(2000)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      contribution === 2000
                        ? "bg-[#e2622c]/15 border-[#e2622c] text-white"
                        : "bg-[#171310]/60 border-[rgba(242,233,221,0.06)] text-white/60 hover:border-white/20"
                    }`}
                  >
                    <div className="mt-1">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${contribution === 2000 ? "border-[#e2622c]" : "border-white/30"}`}>
                        {contribution === 2000 && <div className="w-2 h-2 rounded-full bg-[#e2622c]" />}
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-bold text-white">$2.000 CLP / mes</span>
                        <span className="text-[9px] uppercase tracking-wider bg-[rgba(226,98,44,0.15)] text-[#e2622c] px-1.5 py-0.5 rounded font-mono font-bold">
                          Fuego
                        </span>
                      </div>
                      <p className="text-[10px] text-white/50 mt-1 leading-normal">
                        Para profes que ya requieren que su plataforma tenga para agregar sus clases y facilitar recibir pagos.
                      </p>
                    </div>
                  </div>

                  {/* Opción 5000 */}
                  <div
                    onClick={() => setContribution(5000)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      contribution === 5000
                        ? "bg-[#c99a3c]/15 border-[#c99a3c] text-white"
                        : "bg-[#171310]/60 border-[rgba(242,233,221,0.06)] text-white/60 hover:border-white/20"
                    }`}
                  >
                    <div className="mt-1">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${contribution === 5000 ? "border-[#c99a3c]" : "border-white/30"}`}>
                        {contribution === 5000 && <div className="w-2 h-2 rounded-full bg-[#c99a3c]" />}
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-bold text-white">$5.000 CLP / mes</span>
                        <span className="text-[9px] uppercase tracking-wider bg-[rgba(201,154,60,0.15)] text-[#c99a3c] px-1.5 py-0.5 rounded font-mono font-bold">
                          Guardián
                        </span>
                      </div>
                      <p className="text-[10px] text-white/50 mt-1 leading-normal">
                        Para escuelas y formadores, cobro de formaciones y plataforma para sostener contenidos y herramientas.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Botón de Enviar */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-[#e2622c] hover:bg-[#f2a154] text-[#171310] font-bold font-mono uppercase tracking-wider text-xs transition-all duration-300 shadow-[0_6px_20px_rgba(226,98,44,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? "Procesando Consenso..." : (
                    <>
                      Firmar y Activar mi Nodo <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-[10px] text-white/35">
          Al unirte a Red Raíz, tus datos de contacto seguirán siendo 100% soberanos y podrás solicitar la baja de tu nodo en cualquier momento.
        </div>
      </div>
    </div>
  )
}

export default function ConsentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#120e0c] flex items-center justify-center text-white font-mono text-xs">
        Cargando formulario de consenso...
      </div>
    }>
      <ConsentForm />
    </Suspense>
  )
}
