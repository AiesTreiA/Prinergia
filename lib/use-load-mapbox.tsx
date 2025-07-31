"use client"

import { useEffect, useState } from "react"
import { getMapboxAccessToken } from "@/app/actions" // Importa la Server Action

export function useLoadMapbox() {
  const [loaded, setLoaded] = useState(false)
  const [mapboxToken, setMapboxToken] = useState<string | null>(null)
  const [tokenLoading, setTokenLoading] = useState(true)

  useEffect(() => {
    const fetchToken = async () => {
      setTokenLoading(true)
      try {
        const token = await getMapboxAccessToken()
        setMapboxToken(token || null)
      } catch (error) {
        console.error("Error fetching Mapbox token:", error)
        setMapboxToken(null) // Asegurarse de que el token sea null en caso de error
      } finally {
        setTokenLoading(false)
      }
    }
    fetchToken()
  }, []) // Se ejecuta solo una vez al montar el componente

  useEffect(() => {
    // Esperar a que el token se cargue y exista
    if (tokenLoading || !mapboxToken) {
      return
    }

    if (typeof window === "undefined") return
    if ((window as any).mapboxgl) {
      setLoaded(true)
      return
    }

    // Cargar CSS de Mapbox
    const cssLink = document.createElement("link")
    cssLink.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
    cssLink.rel = "stylesheet"
    document.head.appendChild(cssLink)

    // Cargar JS de Mapbox
    const script = document.createElement("script")
    script.src = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"
    script.async = true
    script.onload = () => {
      if ((window as any).mapboxgl) {
        ;(window as any).mapboxgl.accessToken = mapboxToken // Usar el token obtenido de la Server Action
        setLoaded(true)
      }
    }
    document.head.appendChild(script)

    return () => {
      // Limpiar los elementos añadidos dinámicamente al desmontar el componente
      if (document.head.contains(cssLink)) {
        document.head.removeChild(cssLink)
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [mapboxToken, tokenLoading]) // Depende del token y su estado de carga

  // Retornar true solo si Mapbox está cargado y el token ya se obtuvo
  return loaded && !tokenLoading
}
