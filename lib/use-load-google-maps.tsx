"use client"

import { useEffect, useState } from "react"

export function useLoadGoogleMaps() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if ((window as any).google && (window as any).google.maps) {
      setLoaded(true)
      return
    }

    const existingScript = document.getElementById("google-maps-sdk")
    if (existingScript) {
      existingScript.addEventListener("load", () => setLoaded(true))
      return
    }

    const script = document.createElement("script")
    script.id = "google-maps-sdk"
    script.async = true
    script.defer = true
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.onload = () => setLoaded(true)
    document.head.appendChild(script)
  }, [])

  return loaded
}
