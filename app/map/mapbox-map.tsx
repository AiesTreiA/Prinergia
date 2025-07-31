"use client"

import { useEffect, useRef } from "react"
import { useLoadMapbox } from "@/lib/use-load-mapbox"

interface MapLocation {
  id: number
  name: string
  specialty: string
  coordinates: { lat: number; lng: number }
  rating: number
  price: string
  avatar: string
  type: string
}

interface MapboxMapProps {
  locations: MapLocation[]
  selectedLocation: number | null
  onLocationSelect: (id: number) => void
}

export default function MapboxMap({ locations, selectedLocation, onLocationSelect }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const mapboxReady = useLoadMapbox()

  useEffect(() => {
    if (mapboxReady && mapContainer.current && !map.current) {
      initializeMap()
    }
  }, [mapboxReady])

  useEffect(() => {
    if (map.current && locations.length > 0) {
      addMarkers()
    }
  }, [locations, mapboxReady])

  const initializeMap = () => {
    if (!mapContainer.current || !(window as any).mapboxgl) return

    map.current = new (window as any).mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-99.1332, 19.4326], // Mexico City [lng, lat]
      zoom: 11,
      attributionControl: false,
    })

    // Add navigation controls
    map.current.addControl(new (window as any).mapboxgl.NavigationControl(), "top-right")

    // Add geolocate control
    map.current.addControl(
      new (window as any).mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right",
    )
  }

  const addMarkers = () => {
    if (!map.current || !(window as any).mapboxgl) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    locations.forEach((location) => {
      // Create custom marker element
      const markerElement = document.createElement("div")
      markerElement.className = "custom-marker"
      markerElement.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #16a34a;
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        ${selectedLocation === location.id ? "transform: scale(1.2); background: #15803d;" : ""}
      `

      // Add icon based on type
      const getIcon = (type: string) => {
        switch (type) {
          case "individual":
            return "👤"
          case "group":
            return "👥"
          case "center":
            return "🏢"
          default:
            return "📍"
        }
      }

      markerElement.innerHTML = `<span style="font-size: 16px;">${getIcon(location.type)}</span>`

      // Create popup content
      const popupContent = `
        <div class="p-4 max-w-xs">
          <div class="flex items-center gap-3 mb-3">
            <img src="${location.avatar}" alt="${location.name}" class="w-12 h-12 rounded-full object-cover" />
            <div>
              <h3 class="font-semibold text-gray-800 text-sm">${location.name}</h3>
              <p class="text-xs text-green-600">${location.specialty}</p>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1">
              <span class="text-yellow-500">⭐</span>
              <span class="text-sm text-gray-600">${location.rating}</span>
            </div>
            <span class="font-bold text-gray-800">${location.price}</span>
          </div>
          <button 
            onclick="window.selectLocation(${location.id})" 
            class="w-full mt-3 bg-green-600 text-white text-xs py-2 px-3 rounded hover:bg-green-700 transition-colors"
          >
            Ver Perfil
          </button>
        </div>
      `

      const popup = new (window as any).mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: "custom-popup",
      }).setHTML(popupContent)

      const marker = new (window as any).mapboxgl.Marker(markerElement)
        .setLngLat([location.coordinates.lng, location.coordinates.lat])
        .setPopup(popup)
        .addTo(map.current)

      // Add click event
      markerElement.addEventListener("click", () => {
        onLocationSelect(location.id)
      })

      markersRef.current.push(marker)
    })

    // Make selectLocation available globally for popup buttons
    ;(window as any).selectLocation = (id: number) => {
      onLocationSelect(id)
    }
  }

  // Update marker styles when selection changes
  useEffect(() => {
    markersRef.current.forEach((marker, index) => {
      const element = marker.getElement()
      const location = locations[index]
      if (location && selectedLocation === location.id) {
        element.style.transform = "scale(1.2)"
        element.style.background = "#15803d"
      } else {
        element.style.transform = "scale(1)"
        element.style.background = "#16a34a"
      }
    })
  }, [selectedLocation])

  if (!mapboxReady) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Cargando mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      <style jsx global>{`
        .custom-popup .mapboxgl-popup-content {
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        .custom-popup .mapboxgl-popup-tip {
          border-top-color: white;
        }
        .custom-marker:hover {
          transform: scale(1.1) !important;
        }
      `}</style>
    </div>
  )
}
