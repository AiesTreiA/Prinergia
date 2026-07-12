"use client"

import { useState, useEffect } from "react"
import { Shield, Lock, ArrowLeft, Trash2, Check, X, RefreshCw, LogOut, CheckCircle2, AlertCircle, Coins, Wallet, Copy, ExternalLink, FileText, CheckSquare, Square, Flame } from "lucide-react"
import Link from "next/link"
import { RaizIcon } from "@/components/ui/raiz-icon"

interface MapLocation {
  id: string
  name: string
  specialty: string
  address: string
  lat: number
  lng: number
  type: string
  consent_status: "pending_consent" | "given"
  created_at: string
  contribution_level?: number
}

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [otpCode, setOtpCode] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [error2fa, setError2fa] = useState("")
  
  // Dashboard state
  const [locations, setLocations] = useState<MapLocation[]>([])
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [dashboardError, setDashboardError] = useState("")
  const [filterText, setFilterText] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Tabs y siembra territorial
  const [activeTab, setActiveTab] = useState<"list" | "discover" | "billing" | "roadmap">("list")
  const [gpsLat, setGpsLat] = useState("")
  const [gpsLng, setGpsLng] = useState("")
  const [searchKeyword, setSearchKeyword] = useState("masajes")
  const [detectingGps, setDetectingGps] = useState(false)
  const [searchingPlaces, setSearchingPlaces] = useState(false)
  const [discoveredPlaces, setDiscoveredPlaces] = useState<any[]>([])
  const [placesError, setPlacesError] = useState("")

  // Configuración de cobros / billing state
  const [billingLocationId, setBillingLocationId] = useState("")
  const [billingLocationName, setBillingLocationName] = useState("")
  const [p2pType, setP2pType] = useState("transferencia")
  const [bankName, setBankName] = useState("")
  const [bankAccountType, setBankAccountType] = useState("corriente")
  const [bankAccountNumber, setBankAccountNumber] = useState("")
  const [bankRut, setBankRut] = useState("")
  const [bankEmail, setBankEmail] = useState("")
  const [cryptoWalletAddress, setCryptoWalletAddress] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false)
  const [isBillingActive, setIsBillingActive] = useState(false)
  const [billingLoading, setBillingLoading] = useState(false)
  const [billingSuccessMessage, setBillingSuccessMessage] = useState("")
  const [billingErrorMessage, setBillingErrorMessage] = useState("")

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert("La geolocalización no está soportada por tu navegador.")
      return
    }
    setDetectingGps(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLat(position.coords.latitude.toFixed(6))
        setGpsLng(position.coords.longitude.toFixed(6))
        setDetectingGps(false)
      },
      (error) => {
        console.error("Error al obtener ubicación:", error)
        alert("No se pudo obtener tu ubicación actual. Ingresa las coordenadas manualmente.")
        setDetectingGps(false)
      },
      { enableHighAccuracy: true }
    )
  }

  const handleSearchPlaces = async () => {
    if (!gpsLat || !gpsLng) {
      alert("Por favor ingresa o detecta tu latitud y longitud.")
      return
    }
    setSearchingPlaces(true)
    setPlacesError("")
    setDiscoveredPlaces([])
    try {
      const res = await fetch("/api/admin/discover-places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: parseFloat(gpsLat),
          lng: parseFloat(gpsLng),
          keyword: searchKeyword
        })
      })

      if (res.ok) {
        const json = await res.json()
        setDiscoveredPlaces(json.places || [])
      } else {
        const json = await res.json()
        setPlacesError(json.error || "Error al buscar lugares.")
      }
    } catch (err) {
      setPlacesError("Error de red al buscar lugares.")
    } finally {
      setSearchingPlaces(false)
    }
  }

  const handleImportPlace = async (place: any) => {
    setUpdatingId(place.place_id)
    try {
      const res = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: place.name,
          specialty: `Centro de ${searchKeyword.charAt(0).toUpperCase() + searchKeyword.slice(1)}`,
          address: place.formatted_address,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          type: "center",
          consent_status: "pending_consent",
          avatar: "/placeholder.svg"
        })
      })

      if (res.ok) {
        const json = await res.json()
        const newLoc = json.data as MapLocation
        // Agregar a la lista local de locaciones
        setLocations(prev => [newLoc, ...prev])
        // Remover de la lista de descubiertos
        setDiscoveredPlaces(prev => prev.filter(p => p.place_id !== place.place_id))
        alert(`"${place.name}" se incorporó con éxito como [Esperando Consentimiento]. Puedes ir a visitarlos y actualizar su ficha con fotos.`)
      } else {
        const json = await res.json()
        alert(`Error al incorporar: ${json.error}`)
      }
    } catch (err) {
      alert("Error de conexión al incorporar.")
    } finally {
      setUpdatingId(null)
    }
  }

  // 1. Verificar si ya está autorizado al cargar la página
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/verify-2fa")
        if (res.ok) {
          setAuthorized(true)
          fetchLocations()
        }
      } catch (err) {
        console.error("Error comprobando autenticación", err)
      } finally {
        setCheckingAuth(false)
      }
    }
    checkAuth()
  }, [])

  // 2. Cargar locaciones desde la API administrativa
  async function fetchLocations() {
    setLoadingLocations(true)
    setDashboardError("")
    try {
      const res = await fetch("/api/admin/locations")
      if (res.ok) {
        const json = await res.json()
        setLocations(json.data || [])
      } else {
        const json = await res.json()
        setDashboardError(json.error || "No se pudieron cargar las locaciones.")
      }
    } catch (err) {
      setDashboardError("Error de conexión al cargar locaciones.")
    } finally {
      setLoadingLocations(false)
    }
  }

  // --- MÉTODOS DE CONFIGURACIÓN DE COBROS ---
  const fetchBillingSettings = async (locationId: string) => {
    setBillingLoading(true)
    setBillingErrorMessage("")
    setBillingSuccessMessage("")
    try {
      const res = await fetch(`/api/admin/payment-settings?location_id=${locationId}`)
      const json = await res.json()
      if (json.error) throw new Error(json.error)

      if (json.data) {
        const d = json.data
        setP2pType(d.p2p_type || "transferencia")
        setBankName(d.bank_name || "")
        setBankAccountType(d.bank_account_type || "corriente")
        setBankAccountNumber(d.bank_account_number || "")
        setBankRut(d.bank_rut || "")
        setBankEmail(d.bank_email || "")
        setCryptoWalletAddress(d.crypto_wallet_address || "")
        setApiKeyConfigured(d.api_key_configured || false)
        setIsBillingActive(d.is_active || false)
      } else {
        setP2pType("transferencia")
        setBankName("")
        setBankAccountType("corriente")
        setBankAccountNumber("")
        setBankRut("")
        setBankEmail("")
        setCryptoWalletAddress("")
        setApiKeyConfigured(false)
        setIsBillingActive(false)
      }
      setApiKey("")
    } catch (err: any) {
      console.error(err)
      setBillingErrorMessage("Error al cargar la configuración de cobros: " + err.message)
    } finally {
      setBillingLoading(false)
    }
  }

  const handleConfigureBilling = (locId: string, locName: string) => {
    setBillingLocationId(locId)
    setBillingLocationName(locName)
    setActiveTab("billing")
  }

  const handleSaveBillingSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setBillingLoading(true)
    setBillingErrorMessage("")
    setBillingSuccessMessage("")
    try {
      const res = await fetch("/api/admin/payment-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location_id: billingLocationId,
          p2p_type: p2pType,
          bank_name: bankName,
          bank_account_type: bankAccountType,
          bank_account_number: bankAccountNumber,
          bank_rut: bankRut,
          bank_email: bankEmail,
          crypto_wallet_address: cryptoWalletAddress,
          api_key: apiKey || undefined,
          is_active: isBillingActive
        })
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)

      setBillingSuccessMessage("¡Configuración de cobros guardada exitosamente!")
      setApiKeyConfigured(!!(apiKey || apiKeyConfigured))
      setApiKey("")
    } catch (err: any) {
      console.error(err)
      setBillingErrorMessage("Error al guardar: " + err.message)
    } finally {
      setBillingLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === "billing" && billingLocationId) {
      fetchBillingSettings(billingLocationId)
    }
  }, [activeTab, billingLocationId])

  // 3. Manejar envío del código 2FA
  const handleVerify2fa = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpCode.length !== 6 || isNaN(Number(otpCode))) {
      setError2fa("El código debe tener 6 dígitos numéricos.")
      return
    }

    setVerifying(true)
    setError2fa("")
    try {
      const res = await fetch("/api/admin/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otpCode })
      })

      if (res.ok) {
        setAuthorized(true)
        fetchLocations()
      } else {
        const json = await res.json()
        setError2fa(json.error || "Código incorrecto. Inténtalo de nuevo.")
      }
    } catch (err) {
      setError2fa("Error de red al verificar el código.")
    } finally {
      setVerifying(false)
    }
  }

  // 4. Cambiar el estado de consentimiento (Aprobar/Revocar)
  const handleToggleConsent = async (id: string, currentStatus: string) => {
    setUpdatingId(id)
    const newStatus = currentStatus === "given" ? "pending_consent" : "given"
    try {
      const res = await fetch("/api/admin/locations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, consent_status: newStatus })
      })

      if (res.ok) {
        // Actualizar la lista localmente
        setLocations(prev =>
          prev.map(loc => (loc.id === id ? { ...loc, consent_status: newStatus as any } : loc))
        )
      } else {
        const json = await res.json()
        alert(`Error al actualizar estado: ${json.error}`)
      }
    } catch (err) {
      alert("Error de conexión al actualizar.")
    } finally {
      setUpdatingId(null)
    }
  }

  // 5. Eliminar un nodo del mapa
  const handleDeleteLocation = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente a "${name}" del mapa?`)) {
      return
    }

    setUpdatingId(id)
    try {
      const res = await fetch(`/api/admin/locations?id=${id}`, {
        method: "DELETE"
      })

      if (res.ok) {
        // Remover de la lista local
        setLocations(prev => prev.filter(loc => loc.id !== id))
      } else {
        const json = await res.json()
        alert(`Error al eliminar: ${json.error}`)
      }
    } catch (err) {
      alert("Error de conexión al eliminar.")
    } finally {
      setUpdatingId(null)
    }
  }

  // 5.5 Copiar enlace de invitación
  const handleCopyInvitationLink = (id: string) => {
    const link = `${window.location.origin}/consent?id=${id}`
    navigator.clipboard.writeText(link)
    alert(`¡Enlace de consentimiento copiado al portapapeles!\n\nComparte este link con el facilitador:\n${link}`)
  }

  // 6. Cerrar sesión
  const handleLogout = () => {
    // Para cerrar sesión, expiramos la cookie recreándola con maxAge = 0
    document.cookie = "admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    setAuthorized(false)
    setOtpCode("")
  }

  // Filtrar locaciones según búsqueda
  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(filterText.toLowerCase()) ||
    loc.specialty.toLowerCase().includes(filterText.toLowerCase()) ||
    loc.address.toLowerCase().includes(filterText.toLowerCase())
  )

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#171310] flex items-center justify-center text-[#f2e9dd]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e2622c] mx-auto mb-4"></div>
          <p className="font-mono-plex text-sm">Verificando sesión segura...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-[#f2e9dd]" style={{ background: "#171310", fontFamily: "var(--font-inter), sans-serif" }}>
      
      {/* ─── PANTALLA DE BLOQUEO 2FA ─── */}
      {!authorized ? (
        <div className="min-h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-[20%] w-[300px] h-[300px] bg-[#e2622c] opacity-[0.05] blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[20%] w-[300px] h-[300px] bg-[#5c6b45] opacity-[0.05] blur-[100px] rounded-full pointer-events-none" />

          <div className="w-full max-w-md bg-[#211a15] rounded-3xl p-8 border border-[rgba(242,233,221,0.08)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 text-center">
            
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group mx-auto">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[rgba(226,98,44,0.15)] border border-[rgba(226,98,44,0.25)] transition-transform group-hover:-translate-x-1 duration-200">
                <RaizIcon className="w-4 h-4 text-[#e2622c]" />
              </div>
              <span className="font-fraunces text-lg font-bold text-white">Raíz · Red</span>
            </Link>

            <div className="w-12 h-12 rounded-full bg-[rgba(226,98,44,0.1)] border border-[rgba(226,98,44,0.2)] flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-[#e2622c]" />
            </div>

            <h2 className="font-fraunces text-2xl font-bold text-white mb-2">Acceso de Custodios</h2>
            <p className="text-xs text-[#a89a8d] max-w-xs mx-auto mb-6 leading-relaxed">
              Esta área está protegida por verificación en dos pasos (2FA). Ingresa el código de 6 dígitos de tu aplicación de autenticación.
            </p>

            <form onSubmit={handleVerify2fa} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a89a8d]" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Código de 6 dígitos"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-[#171310] border border-[rgba(242,233,221,0.1)] rounded-xl pl-12 pr-4 py-3.5 text-center text-lg font-mono-plex tracking-[0.3em] font-bold text-white focus:outline-none focus:border-[#f2a154] transition-colors"
                />
              </div>

              {error2fa && (
                <p className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 py-2.5 px-3 rounded-lg flex items-center gap-2 justify-center">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error2fa}
                </p>
              )}

              <button
                type="submit"
                disabled={verifying}
                className="w-full py-3.5 rounded-xl bg-[#e2622c] hover:bg-[#f2a154] text-[#171310] font-bold font-mono-plex uppercase tracking-wider text-xs transition-all duration-300 shadow-[0_6px_20px_rgba(226,98,44,0.2)] disabled:opacity-50"
              >
                {verifying ? "Verificando..." : "Verificar e Ingresar"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[10px] text-[#a89a8d]">
                * Para pruebas locales en desarrollo: usa el código generado con el secreto por defecto <code className="bg-[#171310] px-1 py-0.5 rounded text-white select-all">JBSWY3DPEHPK3PXP</code>.
              </p>
            </div>
          </div>
        </div>
      ) : (
        
        // ─── DASHBOARD ADMINISTRATIVO ───
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="border-b border-[rgba(242,233,221,0.06)] bg-[#211a15] sticky top-0 z-40 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[rgba(226,98,44,0.15)] border border-[rgba(226,98,44,0.25)]">
                    <RaizIcon className="w-4 h-4 text-[#e2622c]" />
                  </div>
                  <span className="font-fraunces text-lg font-bold text-white">Raíz</span>
                </Link>
                <div className="h-4 w-[1px] bg-[rgba(242,233,221,0.15)]" />
                <span className="text-xs font-mono-plex uppercase bg-[#5c6b45]/20 border border-[#5c6b45]/40 text-[#b5c79e] px-2.5 py-1 rounded-full font-bold">
                  Panel de Custodios
                </span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={fetchLocations}
                  className="p-2.5 rounded-lg border border-[rgba(242,233,221,0.1)] hover:border-[#f2a154] hover:text-[#f2a154] transition-colors"
                  title="Refrescar lista"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingLocations ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-950/20 border border-red-900/30 hover:bg-red-900/20 hover:border-red-600 transition-colors text-xs font-bold text-red-400"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Cerrar
                </button>
              </div>

            </div>
          </header>

          <main className="flex-grow max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
            
            {/* Tabs de Navegación */}
            <div className="flex border-b border-[rgba(242,233,221,0.08)] overflow-x-auto">
              <button
                onClick={() => setActiveTab("list")}
                className={`px-6 py-3 font-mono-plex text-xs uppercase tracking-wider font-bold border-b-2 transition-colors shrink-0 ${
                  activeTab === "list"
                    ? "border-[#e2622c] text-[#f2e9dd]"
                    : "border-transparent text-[#a89a8d] hover:text-[#f2e9dd]"
                }`}
              >
                Nodos en el Mapa ({locations.length})
              </button>
              <button
                onClick={() => setActiveTab("discover")}
                className={`px-6 py-3 font-mono-plex text-xs uppercase tracking-wider font-bold border-b-2 transition-colors shrink-0 ${
                  activeTab === "discover"
                    ? "border-[#e2622c] text-[#f2e9dd]"
                    : "border-transparent text-[#a89a8d] hover:text-[#f2e9dd]"
                }`}
              >
                Sembrado Territorial (GPS)
              </button>
              <button
                onClick={() => setActiveTab("roadmap")}
                className={`px-6 py-3 font-mono-plex text-xs uppercase tracking-wider font-bold border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
                  activeTab === "roadmap"
                    ? "border-[#e2622c] text-[#f2e9dd]"
                    : "border-transparent text-[#a89a8d] hover:text-[#f2e9dd]"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#e2622c]" /> Checklist Descentralización
              </button>
              {billingLocationId && (
                <button
                  onClick={() => setActiveTab("billing")}
                  className={`px-6 py-3 font-mono-plex text-xs uppercase tracking-wider font-bold border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
                    activeTab === "billing"
                      ? "border-[#e2622c] text-[#f2e9dd]"
                      : "border-transparent text-[#a89a8d] hover:text-[#f2e9dd]"
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" /> Cobros: {billingLocationName}
                </button>
              )}
            </div>

            {/* ─── TAB 1: LISTADO DE NODOS ─── */}
            {activeTab === "list" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Buscador y estadísticas */}
                <div className="grid md:grid-cols-4 gap-4 items-center">
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      placeholder="Buscar terapeutas por nombre, especialidad o dirección..."
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      className="w-full bg-[#211a15] border border-[rgba(242,233,221,0.1)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#a89a8d] focus:outline-none focus:border-[#f2a154] transition-colors"
                    />
                  </div>
                  <div className="bg-[#211a15] border border-[rgba(242,233,221,0.06)] rounded-xl p-3 text-center">
                    <p className="text-[10px] font-mono-plex uppercase text-[#a89a8d] tracking-wider">Consentimientos</p>
                    <p className="font-fraunces text-lg font-bold text-white mt-1">
                      {locations.filter(l => l.consent_status === "given").length} / {locations.length}
                    </p>
                  </div>
                </div>

                {dashboardError && (
                  <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl text-red-400 text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {dashboardError}
                  </div>
                )}

                <div className="bg-[#211a15] rounded-3xl border border-[rgba(242,233,221,0.06)] overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.3)]">
                  {loadingLocations ? (
                    <div className="py-24 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e2622c] mx-auto mb-3"></div>
                      <p className="text-xs text-[#a89a8d]">Cargando base de datos de linajes...</p>
                    </div>
                  ) : filteredLocations.length === 0 ? (
                    <div className="py-24 text-center">
                      <p className="text-sm text-[#a89a8d]">No se encontraron terapeutas ni centros.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[rgba(242,233,221,0.06)] text-[10px] font-mono-plex uppercase text-[#a89a8d] tracking-wider bg-[#1b1511]">
                            <th className="px-6 py-4">Nombre / Tipo</th>
                            <th className="px-6 py-4">Especialidad Principal</th>
                            <th className="px-6 py-4">Dirección</th>
                            <th className="px-6 py-4">Estado Consentimiento</th>
                            <th className="px-6 py-4 text-right">Acciones de Custodia</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLocations.map((loc) => {
                            const isGiven = loc.consent_status === "given"
                            return (
                              <tr
                                key={loc.id}
                                className="border-b border-[rgba(242,233,221,0.04)] hover:bg-[#28211c]/30 transition-colors text-xs"
                              >
                                <td className="px-6 py-4">
                                  <p className="font-semibold text-white text-sm">{loc.name}</p>
                                  <span className="inline-block mt-1 font-mono-plex text-[9px] uppercase tracking-wider bg-[rgba(242,233,221,0.05)] text-[#a89a8d] px-1.5 py-0.5 rounded">
                                    {loc.type}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-[#f2e9dd] font-medium">
                                  {loc.specialty}
                                </td>
                                <td className="px-6 py-4 text-[#a89a8d] max-w-xs truncate">
                                  {loc.address}
                                </td>
                                <td className="px-6 py-4">
                                  {isGiven ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-950/20 border border-green-900/40 text-green-400 rounded-full font-bold">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Consentimiento Admitido
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-950/20 border border-yellow-900/40 text-yellow-400 rounded-full font-bold animate-pulse">
                                      <AlertCircle className="w-3 h-3" />
                                      Esperando Consentimiento
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                  <button
                                    disabled={updatingId === loc.id}
                                    onClick={() => handleToggleConsent(loc.id, loc.consent_status)}
                                    className={`px-3 py-2 rounded-lg font-bold font-mono-plex text-[10px] uppercase tracking-wider transition-all duration-200 inline-flex items-center gap-1 ${
                                      isGiven
                                        ? "bg-yellow-950/30 text-yellow-400 border border-yellow-900/40 hover:bg-yellow-900/30"
                                        : "bg-green-950/30 text-green-400 border border-green-900/40 hover:bg-green-900/30"
                                    }`}
                                  >
                                    {isGiven ? (
                                      <>
                                        <X className="w-3.5 h-3.5" /> Revocar
                                      </>
                                    ) : (
                                      <>
                                        <Check className="w-3.5 h-3.5" /> Admitir
                                      </>
                                    )}
                                  </button>
                                  {!isGiven && (
                                    <button
                                      onClick={() => handleCopyInvitationLink(loc.id)}
                                      className="px-3 py-2 rounded-lg bg-[#e2622c]/15 text-[#e2622c] border border-[#e2622c]/30 hover:bg-[#e2622c]/30 font-bold font-mono-plex text-[10px] uppercase tracking-wider transition-all duration-200 inline-flex items-center gap-1"
                                      title="Copiar enlace de invitación para el consenso"
                                    >
                                      <Copy className="w-3.5 h-3.5" /> Invitar
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleConfigureBilling(loc.id, loc.name)}
                                    className="px-3 py-2 rounded-lg bg-[#5c6b45]/20 text-[#b5c79e] border border-[#5c6b45]/40 hover:bg-[#5c6b45]/40 font-bold font-mono-plex text-[10px] uppercase tracking-wider transition-all duration-200 inline-flex items-center gap-1"
                                    title="Configurar cobros directos y billetera cripto"
                                  >
                                    <Coins className="w-3.5 h-3.5" /> Cobros
                                  </button>
                                  <button
                                    disabled={updatingId === loc.id}
                                    onClick={() => handleDeleteLocation(loc.id, loc.name)}
                                    className="px-3 py-2 rounded-lg bg-red-950/30 text-red-400 border border-red-900/40 hover:bg-red-900/30 font-bold font-mono-plex text-[10px] uppercase tracking-wider transition-all duration-200 inline-flex items-center gap-1"
                                    title="Eliminar definitivamente"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── TAB 2: SEMBRADO TERRITORIAL CON GPS ─── */}
            {activeTab === "discover" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-[#211a15] rounded-3xl p-6 border border-[rgba(242,233,221,0.06)] space-y-4">
                  <h3 className="font-fraunces text-xl font-bold text-white">Sembrado Geográfico de Nodos</h3>
                  <p className="text-xs text-[#a89a8d] max-w-2xl leading-relaxed">
                    Utiliza esta herramienta para capturar tu ubicación actual (GPS) y descubrir centros y terapeutas locales (vía Google Places). 
                    Se agregarán al mapa público con el estado <strong className="text-[#f2a154]">"Esperando Consentimiento"</strong> para que puedas visitarlos personalmente, contarles de la red y tomar fotos de sus escuelas para completar sus perfiles.
                  </p>

                  <div className="grid md:grid-cols-4 gap-4 items-end">
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-mono-plex uppercase text-[#a89a8d]">Latitud</label>
                      <input
                        type="text"
                        placeholder="Ej. -33.456"
                        value={gpsLat}
                        onChange={(e) => setGpsLat(e.target.value)}
                        className="bg-[#171310] border border-[rgba(242,233,221,0.1)] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-mono-plex uppercase text-[#a89a8d]">Longitud</label>
                      <input
                        type="text"
                        placeholder="Ej. -70.648"
                        value={gpsLng}
                        onChange={(e) => setGpsLng(e.target.value)}
                        className="bg-[#171310] border border-[rgba(242,233,221,0.1)] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-mono-plex uppercase text-[#a89a8d]">Categoría de Búsqueda</label>
                      <select
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="bg-[#171310] border border-[rgba(242,233,221,0.1)] rounded-lg px-4 py-2.5 text-xs text-[#f2e9dd] focus:outline-none"
                      >
                        <option value="masajes">Escuelas de Masajes</option>
                        <option value="yoga">Centros de Yoga</option>
                        <option value="sonoterapia">Baños de Sonido / Gong</option>
                        <option value="reiki">Centros de Reiki / Sanación</option>
                        <option value="temazcal">Temazcal</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleDetectGPS}
                        disabled={detectingGps}
                        className="bg-transparent hover:bg-[rgba(242,233,221,0.03)] border border-[rgba(242,233,221,0.15)] text-[#f2e9dd] text-xs font-mono-plex font-bold uppercase tracking-wider py-2.5 px-4 rounded-lg transition-colors flex-grow h-[38px] flex items-center justify-center gap-1.5"
                      >
                        {detectingGps ? "Mapeando..." : "Mi GPS"}
                      </button>
                      <button
                        type="button"
                        onClick={handleSearchPlaces}
                        disabled={searchingPlaces}
                        className="bg-[#e2622c] hover:bg-[#f2a154] text-[#171310] text-xs font-mono-plex font-bold uppercase tracking-wider py-2.5 px-4 rounded-lg transition-colors flex-grow h-[38px] flex items-center justify-center"
                      >
                        {searchingPlaces ? "Buscando..." : "Buscar"}
                      </button>
                    </div>
                  </div>
                </div>

                {placesError && (
                  <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl text-red-400 text-sm">
                    {placesError}
                  </div>
                )}

                {/* Resultados del Descubrimiento */}
                {discoveredPlaces.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-mono-plex text-xs uppercase tracking-widest text-[#e2622c] font-bold">
                      Centros Descubiertos en el Sector
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {discoveredPlaces.map((place) => (
                        <div
                          key={place.place_id}
                          className="bg-[#211a15] rounded-2xl p-5 border border-[rgba(242,233,221,0.06)] hover:border-[rgba(242,233,221,0.15)] transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <h5 className="font-semibold text-white text-sm leading-snug">{place.name}</h5>
                              {place.rating && (
                                <span className="bg-[#171310] text-yellow-400 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                  ⭐ {place.rating}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#a89a8d] mb-4">{place.formatted_address}</p>
                            <div className="text-[10px] font-mono-plex text-[#5c6b45] mb-2">
                              Coord: {place.geometry.location.lat.toFixed(4)}, {place.geometry.location.lng.toFixed(4)}
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={updatingId === place.place_id}
                            onClick={() => handleImportPlace(place)}
                            className="w-full py-2.5 rounded-lg bg-[#5c6b45] hover:bg-[#6c7d52] text-[#171310] font-mono-plex text-[10px] uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Sembrar en el mapa
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── TAB 3: CONFIGURACIÓN DE COBROS DIRECTOS Y CRIPTO ─── */}
            {activeTab === "billing" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-[#211a15] rounded-3xl p-6 md:p-8 border border-[rgba(242,233,221,0.06)] space-y-6">
                  <div>
                    <h3 className="font-fraunces text-xl font-bold text-white flex items-center gap-2">
                      <Coins className="w-5 h-5 text-[#e2622c]" />
                      Configuración de Cobros P2P para: <span className="text-[#f2a154]">{billingLocationName}</span>
                    </h3>
                    <p className="text-xs text-[#a89a8d] mt-2 leading-relaxed">
                      Elige el método en que los alumnos pagarán por tus clases de forma directa y soberana. Para mantener la descentralización, las pasarelas Web2 se conectan con tus propias credenciales y el 2% de tasa de sustentabilidad de Red Raíz se deriva directamente a la billetera cripto del protocolo.
                    </p>
                  </div>

                  {billingLoading ? (
                    <div className="py-12 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#e2622c] mx-auto mb-2"></div>
                      <p className="text-xs text-[#a89a8d]">Cargando configuración financiera del nodo...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveBillingSettings} className="space-y-6">
                      
                      {/* Estado Activo */}
                      <div className="flex items-center justify-between p-4 bg-[#171310] rounded-xl border border-[rgba(242,233,221,0.06)]">
                        <div>
                          <label className="text-xs font-bold text-white block">Activar Cobros P2P en el Mapa</label>
                          <span className="text-[10px] text-[#a89a8d]">Habilita el botón de reserva y pago para este nodo</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isBillingActive}
                          onChange={(e) => setIsBillingActive(e.target.checked)}
                          className="w-5 h-5 accent-[#e2622c] rounded cursor-pointer"
                        />
                      </div>

                      {/* Tipo de Pasarela */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono-plex uppercase text-[#a89a8d] block font-bold">Tipo de Cobro / Pasarela</label>
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            type="button"
                            onClick={() => setP2pType("transferencia")}
                            className={`p-3 rounded-xl border font-bold text-xs transition-all ${
                              p2pType === "transferencia"
                                ? "bg-[#5c6b45]/20 border-[#5c6b45] text-white"
                                : "bg-[#171310] border-[rgba(242,233,221,0.08)] text-[#a89a8d] hover:border-[rgba(242,233,221,0.15)]"
                            }`}
                          >
                            Transferencia P2P
                          </button>
                          <button
                            type="button"
                            onClick={() => setP2pType("mercado_pago")}
                            className={`p-3 rounded-xl border font-bold text-xs transition-all ${
                              p2pType === "mercado_pago"
                                ? "bg-[#e2622c]/20 border-[#e2622c] text-white"
                                : "bg-[#171310] border-[rgba(242,233,221,0.08)] text-[#a89a8d] hover:border-[rgba(242,233,221,0.15)]"
                            }`}
                          >
                            Mercado Pago
                          </button>
                          <button
                            type="button"
                            onClick={() => setP2pType("crypto")}
                            className={`p-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                              p2pType === "crypto"
                                ? "bg-[#c99a3c]/20 border-[#c99a3c] text-white"
                                : "bg-[#171310] border-[rgba(242,233,221,0.08)] text-[#a89a8d] hover:border-[rgba(242,233,221,0.15)]"
                            }`}
                          >
                            <Wallet className="w-4 h-4 text-[#c99a3c]" /> Web3 Cripto
                          </button>
                        </div>
                      </div>

                      {/* --- CAMPOS PARA TRANSFERENCIA BANCARIA P2P --- */}
                      {p2pType === "transferencia" && (
                        <div className="grid md:grid-cols-2 gap-4 p-5 bg-[#171310] rounded-2xl border border-[rgba(242,233,221,0.04)] animate-fadeIn">
                          <h4 className="md:col-span-2 text-xs font-bold text-white border-b border-[rgba(242,233,221,0.06)] pb-2 mb-2">Datos Bancarios del Facilitador</h4>
                          
                          <div className="flex flex-col space-y-1">
                            <label className="text-[10px] font-mono-plex uppercase text-[#a89a8d]">Banco</label>
                            <input
                              type="text"
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              placeholder="Ej. Banco Estado, Banco de Chile"
                              className="bg-[#211a15] border border-[rgba(242,233,221,0.1)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-[10px] font-mono-plex uppercase text-[#a89a8d]">Tipo de Cuenta</label>
                            <select
                              value={bankAccountType}
                              onChange={(e) => setBankAccountType(e.target.value)}
                              className="bg-[#211a15] border border-[rgba(242,233,221,0.1)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                            >
                              <option value="corriente">Cuenta Corriente</option>
                              <option value="vista">Cuenta Vista / RUT</option>
                              <option value="ahorro">Cuenta de Ahorro</option>
                            </select>
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-[10px] font-mono-plex uppercase text-[#a89a8d]">Número de Cuenta</label>
                            <input
                              type="text"
                              value={bankAccountNumber}
                              onChange={(e) => setBankAccountNumber(e.target.value)}
                              className="bg-[#211a15] border border-[rgba(242,233,221,0.1)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-col space-y-1">
                            <label className="text-[10px] font-mono-plex uppercase text-[#a89a8d]">RUT del Titular</label>
                            <input
                              type="text"
                              value={bankRut}
                              onChange={(e) => setBankRut(e.target.value)}
                              placeholder="12.345.678-9"
                              className="bg-[#211a15] border border-[rgba(242,233,221,0.1)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-col space-y-1 md:col-span-2">
                            <label className="text-[10px] font-mono-plex uppercase text-[#a89a8d]">Email de Notificación</label>
                            <input
                              type="email"
                              value={bankEmail}
                              onChange={(e) => setBankEmail(e.target.value)}
                              className="bg-[#211a15] border border-[rgba(242,233,221,0.1)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* --- CAMPOS PARA MERCADO PAGO SPLIT --- */}
                      {p2pType === "mercado_pago" && (
                        <div className="grid md:grid-cols-2 gap-4 p-5 bg-[#171310] rounded-2xl border border-[rgba(242,233,221,0.04)] animate-fadeIn">
                          <h4 className="md:col-span-2 text-xs font-bold text-white border-b border-[rgba(242,233,221,0.06)] pb-2 mb-2">Credenciales de Integración Mercado Pago</h4>
                          
                          <div className="flex flex-col space-y-1 md:col-span-2">
                            <label className="text-[10px] font-mono-plex uppercase text-[#a89a8d]">Access Token Personal del Vendedor</label>
                            <input
                              type="password"
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                              placeholder={apiKeyConfigured ? "******** (Ya configurado, escribe aquí para cambiarlo)" : "APP_USR-xxxx..."}
                              className="bg-[#211a15] border border-[rgba(242,233,221,0.1)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                            />
                            <span className="text-[9px] text-[#a89a8d] mt-1 leading-normal">
                              El Access Token es cifrado localmente mediante algoritmos AES-256-GCM. Solo se consulta al generar el cobro para redireccionar el 98% a tu billetera Mercado Pago.
                            </span>
                          </div>

                          <div className="flex flex-col space-y-1 md:col-span-2 mt-2">
                            <label className="text-[10px] font-mono-plex uppercase text-[#a89a8d]">Billetera Cripto de Respaldo (Opcional)</label>
                            <input
                              type="text"
                              value={cryptoWalletAddress}
                              onChange={(e) => setCryptoWalletAddress(e.target.value)}
                              placeholder="0x..."
                              className="bg-[#211a15] border border-[rgba(242,233,221,0.1)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                            />
                          </div>
                        </div>
                      )}

                      {/* --- CAMPOS PARA CRYPTO WEB3 DIRECTO --- */}
                      {p2pType === "crypto" && (
                        <div className="p-5 bg-[#171310] rounded-2xl border border-[rgba(242,233,221,0.04)] space-y-4 animate-fadeIn">
                          <h4 className="text-xs font-bold text-white border-b border-[rgba(242,233,221,0.06)] pb-2 mb-2">Billetera Criptográfica Soberana</h4>
                          
                          <div className="flex flex-col space-y-1">
                            <label className="text-[10px] font-mono-plex uppercase text-[#a89a8d]">Dirección de Billetera (Ethereum/Polygon/Arbitrum)</label>
                            <input
                              type="text"
                              required={p2pType === "crypto"}
                              value={cryptoWalletAddress}
                              onChange={(e) => setCryptoWalletAddress(e.target.value)}
                              placeholder="0x71C... o ENS"
                              className="bg-[#211a15] border border-[rgba(242,233,221,0.1)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                            />
                            <span className="text-[9px] text-[#a89a8d] mt-1 leading-normal">
                              La pasarela Web3 llamará a MetaMask/WalletConnect para pagar directamente en tokens estables (USDC/USDT). El contrato inteligente deriva 98% a esta dirección y 2% a la tesorería de Red Raíz.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Mensajes de feedback */}
                      {billingSuccessMessage && (
                        <div className="bg-green-950/20 border border-green-900/40 p-4 rounded-xl text-green-400 text-sm flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 shrink-0" />
                          {billingSuccessMessage}
                        </div>
                      )}

                      {billingErrorMessage && (
                        <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl text-red-400 text-sm flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 shrink-0" />
                          {billingErrorMessage}
                        </div>
                      )}

                      {/* Botones de acción */}
                      <div className="flex gap-3 justify-end pt-4 border-t border-[rgba(242,233,221,0.06)]">
                        <button
                          type="button"
                          onClick={() => setActiveTab("list")}
                          className="bg-transparent hover:bg-[rgba(242,233,221,0.03)] border border-[rgba(242,233,221,0.15)] text-[#f2e9dd] text-xs font-mono-plex font-bold uppercase tracking-wider py-3 px-6 rounded-xl transition-colors"
                        >
                          Cerrar
                        </button>
                        <button
                          type="submit"
                          className="bg-[#e2622c] hover:bg-[#f2a154] text-[#171310] text-xs font-mono-plex font-bold uppercase tracking-wider py-3 px-6 rounded-xl transition-colors"
                        >
                          Guardar Configuración
                        </button>
                      </div>

                    </form>
                  )}

                </div>
              </div>
            )}

            {/* ─── TAB 4: CHECKLIST DE DESCENTRALIZACIÓN (ROADMAP LEAN) ─── */}
            {activeTab === "roadmap" && (
              <div className="space-y-6 animate-fadeIn text-[#f2e9dd]">
                {/* Cabecera y Progreso */}
                <div className="bg-[#211a15] rounded-3xl p-6 md:p-8 border border-[rgba(242,233,221,0.06)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-[#e2622c] opacity-[0.05] blur-[80px] rounded-full pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#5c6b45] opacity-[0.05] blur-[80px] rounded-full pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                      <h3 className="font-fraunces text-2xl font-bold text-white flex items-center gap-2">
                        <Shield className="w-6 h-6 text-[#e2622c]" />
                        Checklist de Descentralización & Lanzamiento Lean
                      </h3>
                      <p className="text-xs text-[#a89a8d] max-w-2xl leading-relaxed">
                        Controla las integraciones clave para cumplir la promesa de soberanía financiera y consenso distribuido de Red Raíz. Prioriza el crecimiento ágil (Lean) validando el interés de los facilitadores con el flujo automatizado.
                      </p>
                    </div>

                    <div className="bg-[#171310] border border-[rgba(242,233,221,0.06)] rounded-2xl p-4 text-center shrink-0 w-full md:w-auto">
                      <p className="text-[9px] font-mono-plex uppercase text-[#a89a8d] tracking-wider">Estado de Lanzamiento</p>
                      <p className="font-fraunces text-2xl font-bold text-[#e2622c] mt-1">60% Operativo</p>
                      <div className="w-32 bg-[rgba(242,233,221,0.1)] h-1.5 rounded-full mt-2 overflow-hidden mx-auto">
                        <div className="bg-[#e2622c] h-full rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard de Métricas y Guía Lean */}
                <div className="grid md:grid-cols-3 gap-6">
                  
                  {/* Columna Izquierda: Checklist Completa */}
                  <div className="md:col-span-2 space-y-6">
                    
                    {/* Sección 1: Consenso Territorial */}
                    <div className="bg-[#211a15] rounded-3xl p-6 border border-[rgba(242,233,221,0.06)] space-y-4">
                      <div className="flex justify-between items-center border-b border-[rgba(242,233,221,0.06)] pb-3">
                        <h4 className="font-fraunces text-base font-bold text-white flex items-center gap-2">
                          <RaizIcon className="w-4 h-4 text-[#5c6b45]" />
                          1. Consenso y Validación Territorial (¡LEAN & ACTIVO!)
                        </h4>
                        <span className="text-[9px] font-mono-plex bg-green-950/20 border border-green-900/40 text-green-400 px-2 py-0.5 rounded-full font-bold">
                          Completado
                        </span>
                      </div>

                      <div className="space-y-4">
                        {/* Item 1.1 */}
                        <div className="flex gap-3">
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-white">Mapeo automático de prospectos (vía GPS & Google Places)</p>
                            <p className="text-[10px] text-[#a89a8d] mt-0.5 leading-normal">
                              Los nodos se incorporan inicialmente con el estado de "Esperando consentimiento" para visitas territoriales.
                            </p>
                          </div>
                        </div>

                        {/* Item 1.2 */}
                        <div className="flex gap-3">
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-white">Flujo de Autoverificación y Consenso para Facilitadores</p>
                            <p className="text-[10px] text-[#a89a8d] mt-0.5 leading-normal">
                              Página pública en <code className="bg-[#171310] px-1.5 py-0.5 rounded text-[#f2a154] font-mono text-[9px]">/consent?id=uuid</code> que permite a los terapeutas reclamar su espacio y elegir su nivel de aporte (Semilla, Fuego o Guardián).
                            </p>
                          </div>
                        </div>

                        {/* Item 1.3 */}
                        <div className="flex gap-3">
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-white">Distribución Ágil de Enlaces de Invitación</p>
                            <p className="text-[10px] text-[#a89a8d] mt-0.5 leading-normal">
                              Botón "Invitar" agregado a la lista de nodos en el panel. Permite a los custodios copiar al portapapeles el link de consentimiento del nodo mapeado con un solo click.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sección 2: Pasarelas de Pago */}
                    <div className="bg-[#211a15] rounded-3xl p-6 border border-[rgba(242,233,221,0.06)] space-y-4">
                      <div className="flex justify-between items-center border-b border-[rgba(242,233,221,0.06)] pb-3">
                        <h4 className="font-fraunces text-base font-bold text-white flex items-center gap-2">
                          <Coins className="w-4 h-4 text-[#e2622c]" />
                          2. Pasarelas de Pago Directas (Soberanía Web2)
                        </h4>
                        <span className="text-[9px] font-mono-plex bg-yellow-950/20 border border-yellow-900/40 text-yellow-400 px-2 py-0.5 rounded-full font-bold">
                          En Progreso
                        </span>
                      </div>

                      <div className="space-y-4">
                        {/* Item 2.1 */}
                        <div className="flex gap-3">
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-white">Datos de Transferencia Directa P2P</p>
                            <p className="text-[10px] text-[#a89a8d] mt-0.5 leading-normal">
                              Habilitado. El facilitador ingresa sus datos de cuenta bancaria y los alumnos pagan directamente sin comisiones de intermediarios.
                            </p>
                          </div>
                        </div>

                        {/* Item 2.2 */}
                        <div className="flex gap-3">
                          <div className="w-4 h-4 rounded-full border border-yellow-600 flex items-center justify-center text-yellow-500 shrink-0 mt-0.5 font-mono text-[9px] font-bold">
                            /
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Split 98/2 con Mercado Pago</p>
                            <p className="text-[10px] text-[#a89a8d] mt-0.5 leading-normal">
                              Cifrado AES-256-GCM listo para almacenar credenciales del facilitador. Falta conectar el checkout para direccionar el 98% a su cuenta y el 2% a la tesorería de la red.
                            </p>
                          </div>
                        </div>

                        {/* Item 2.3 */}
                        <div className="flex gap-3">
                          <Square className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-white/60">Webhook de Confirmación Automática de Reservas</p>
                            <p className="text-[10px] text-white/40 mt-0.5 leading-normal">
                              Pendiente. Registrar webhook de Mercado Pago para liberar y confirmar la hora reservada en la DB tan pronto el alumno realice el pago.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sección 3: Web3 Cripto */}
                    <div className="bg-[#211a15] rounded-3xl p-6 border border-[rgba(242,233,221,0.06)] space-y-4">
                      <div className="flex justify-between items-center border-b border-[rgba(242,233,221,0.06)] pb-3">
                        <h4 className="font-fraunces text-base font-bold text-white flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-[#c99a3c]" />
                          3. Descentralización Web3 & Cripto (Infraestructura)
                        </h4>
                        <span className="text-[9px] font-mono-plex bg-[rgba(242,233,221,0.05)] border border-[rgba(242,233,221,0.1)] text-[#a89a8d] px-2 py-0.5 rounded-full font-bold">
                          Planificado
                        </span>
                      </div>

                      <div className="space-y-4">
                        {/* Item 3.1 */}
                        <div className="flex gap-3">
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-white">Almacenamiento de Billeteras Cripto de Facilitadores</p>
                            <p className="text-[10px] text-[#a89a8d] mt-0.5 leading-normal">
                              Habilitado. Base de datos estructurada para registrar direcciones públicas (Ethereum/Polygon) de cobro directo.
                            </p>
                          </div>
                        </div>

                        {/* Item 3.2 */}
                        <div className="flex gap-3">
                          <Square className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-white/60">Contrato Inteligente "Splitter" de Tesorería Red Raíz</p>
                            <p className="text-[10px] text-white/40 mt-0.5 leading-normal">
                              Pendiente. Deploy de smart contract ERC-20 Splitter en Polygon/Arbitrum para la recolección automática del 2% del total de las transacciones hacia la billetera del protocolo.
                            </p>
                          </div>
                        </div>

                        {/* Item 3.3 */}
                        <div className="flex gap-3">
                          <Square className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-white/60">Checkout Web3 con MetaMask / WalletConnect</p>
                            <p className="text-[10px] text-white/40 mt-0.5 leading-normal">
                              Pendiente. Integrar librerías de conexión RPC en el checkout para que los alumnos realicen reservas pagando con tokens estables (USDT/USDC).
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Columna Derecha: Métricas y Guía Lean */}
                  <div className="space-y-6">
                    
                    {/* Panel de Entusiasmo / Métricas de Consenso */}
                    <div className="bg-[#211a15] rounded-3xl p-6 border border-[rgba(242,233,221,0.06)] space-y-4">
                      <h4 className="font-fraunces text-base font-bold text-white border-b border-[rgba(242,233,221,0.06)] pb-2">
                        Métricas de Consenso Lean
                      </h4>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#171310] border border-[rgba(242,233,221,0.04)] rounded-xl p-3 text-center col-span-2">
                          <p className="text-[9px] font-mono-plex uppercase text-[#a89a8d]">Nodos Activos</p>
                          <p className="font-fraunces text-xl font-bold text-white mt-1">
                            {locations.filter(l => l.consent_status === "given").length} <span className="text-xs text-white/40">/ {locations.length}</span>
                          </p>
                        </div>

                        <div className="bg-[#171310] border border-[rgba(242,233,221,0.04)] rounded-xl p-3 text-center">
                          <p className="text-[9px] font-mono-plex uppercase text-white/40">Gratis (Semilla)</p>
                          <p className="font-fraunces text-base font-bold text-white mt-1">
                            {locations.filter(l => l.consent_status === "given" && (!l.contribution_level || l.contribution_level === 0)).length}
                          </p>
                        </div>

                        <div className="bg-[#171310] border border-[rgba(242,233,221,0.04)] rounded-xl p-3 text-center">
                          <p className="text-[9px] font-mono-plex uppercase text-[#e2622c]">$2.000 (Fuego)</p>
                          <p className="font-fraunces text-base font-bold text-[#e2622c] mt-1">
                            {locations.filter(l => l.consent_status === "given" && (l.contribution_level === 2000 || l.contribution_level === 5)).length}
                          </p>
                        </div>

                        <div className="bg-[#171310] border border-[rgba(242,233,221,0.04)] rounded-xl p-3 text-center col-span-2">
                          <p className="text-[9px] font-mono-plex uppercase text-[#c99a3c]">$5.000 (Guardián)</p>
                          <p className="font-fraunces text-base font-bold text-[#c99a3c] mt-1">
                            {locations.filter(l => l.consent_status === "given" && (l.contribution_level === 5000 || l.contribution_level === 15)).length}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Guía de Lanzamiento Ágil (Lean Launch) */}
                    <div className="bg-[#171310] border border-[rgba(226,98,44,0.15)] rounded-3xl p-6 space-y-4">
                      <h4 className="font-fraunces text-sm font-bold text-white flex items-center gap-1.5 text-[#e2622c]">
                        <Flame className="w-4 h-4 fill-current" />
                        Estrategia Ágil (Lean Launch)
                      </h4>
                      <div className="text-[11px] text-white/70 leading-relaxed space-y-3">
                        <p>
                          <strong>1. No esperes a Web3:</strong> El flujo de consenso ya está activo. Envía el enlace de invitación a los facilitadores pre-mapeados. Su elección (Semilla, Fuego o Guardián) valida el interés real en menos de una semana (Product-Market Fit).
                        </p>
                        <p>
                          <strong>2. Cobros manuales iniciales:</strong> Si eligen aportar en los planes Fuego o Guardián, puedes gestionar el pago manualmente por transferencia o cripto directa en esta fase inicial. Esto te ahorra escribir contratos complejos de tesorería antes de tener los primeros usuarios activos.
                        </p>
                        <p>
                          <strong>3. Reputación y Siembra:</strong> Genera códigos QR que enlacen a `/consent?id=xxx` y colócalos físicamente en las escuelas mapeadas. Deja que descubran que ya están listadas y decidan unirse de forma autónoma.
                        </p>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}

          </main>
        </div>
      )}
    </div>
  )
}
