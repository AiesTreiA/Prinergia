"use client"

import { useEffect, useRef } from "react"
import { useLoadMapbox } from "@/lib/use-load-mapbox"
import { useRouter } from "next/navigation"

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
  const router = useRouter()

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

  // Centrar el mapa cuando se selecciona una ubicación
  useEffect(() => {
    if (map.current && selectedLocation) {
      const selectedLocationData = locations.find((loc) => loc.id === selectedLocation)
      if (selectedLocationData) {
        map.current.flyTo({
          center: [selectedLocationData.coordinates.lng, selectedLocationData.coordinates.lat],
          zoom: 15, // Zoom más cercano para ver mejor el área
          duration: 1500, // Animación suave de 1.5 segundos
          essential: true,
        })
      }
    }
  }, [selectedLocation, locations])

  const initializeMap = () => {
    if (!mapContainer.current || !(window as any).mapboxgl) return

    map.current = new (window as any).mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-70.6483, -33.4569], // Santiago de Chile [lng, lat]
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
      // Create custom marker element with image
      const markerElement = document.createElement("div")
      markerElement.className = "custom-marker"

      // Base styles for the marker container
      const isSelected = selectedLocation === location.id
      const baseSize = isSelected ? 50 : 44
      const borderColor = isSelected ? "#15803d" : "#16a34a"
      const borderWidth = isSelected ? 4 : 3

      markerElement.style.cssText = `
        width: ${baseSize}px;
        height: ${baseSize}px;
        border-radius: 50%;
        border: ${borderWidth}px solid ${borderColor};
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        overflow: hidden;
        position: relative;
        background: white;
        transform: ${isSelected ? "scale(1.1)" : "scale(1)"};
        transform-origin: center center;
        display: flex;
        align-items: center;
        justify-content: center;
      `

      // Create image element
      const imageElement = document.createElement("img")
      imageElement.src = location.avatar
      imageElement.alt = location.name
      imageElement.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        transition: all 0.3s ease;
        pointer-events: none;
      `

      // Add type indicator overlay
      const typeIndicator = document.createElement("div")
      const getTypeColor = (type: string) => {
        switch (type) {
          case "individual":
            return "#3b82f6" // blue
          case "group":
            return "#8b5cf6" // purple
          case "center":
            return "#16a34a" // green
          default:
            return "#6b7280" // gray
        }
      }

      const getTypeIcon = (type: string) => {
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

      typeIndicator.style.cssText = `
        position: absolute;
        bottom: -2px;
        right: -2px;
        width: 18px;
        height: 18px;
        background: ${getTypeColor(location.type)};
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        pointer-events: none;
      `
      typeIndicator.innerHTML = getTypeIcon(location.type)

      // Assemble marker
      markerElement.appendChild(imageElement)
      markerElement.appendChild(typeIndicator)

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
            onclick="window.goToProfile(${location.id})" 
            class="w-full mt-3 bg-green-600 text-white text-xs py-2 px-3 rounded hover:bg-green-700 transition-colors"
          >
            Ver Perfil
          </button>
        </div>
      `

      const popup = new (window as any).mapboxgl.Popup({
        offset: [0, -30], // Offset específico en lugar de valor genérico
        closeButton: false,
        className: "custom-popup",
        anchor: "bottom",
      }).setHTML(popupContent)

      const marker = new (window as any).mapboxgl.Marker({
        element: markerElement,
        anchor: "center", // Ancla el marcador desde el centro
        offset: [0, 0], // Sin offset para máxima precisión
      })
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
    
    // Función global para redireccionar directamente sin recargar página
    ;(window as any).goToProfile = (id: number) => {
      router.push(`/professional/${id}`)
    }
  }

  // Update marker styles when selection changes
  useEffect(() => {
    markersRef.current.forEach((marker, index) => {
      const element = marker.getElement()
      const location = locations[index]
      if (location) {
        const isSelected = selectedLocation === location.id
        const baseSize = isSelected ? 50 : 44
        const borderColor = isSelected ? "#15803d" : "#16a34a"
        const borderWidth = isSelected ? 4 : 3

        element.style.width = `${baseSize}px`
        element.style.height = `${baseSize}px`
        element.style.borderColor = borderColor
        element.style.borderWidth = `${borderWidth}px`
        element.style.transform = isSelected ? "scale(1.1)" : "scale(1)"
        element.style.boxShadow = isSelected ? "0 6px 20px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.3)"
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
        .custom-marker {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        .custom-marker:hover {
          z-index: 1000;
          filter: brightness(1.1);
        }
        .mapboxgl-marker {
          will-change: transform;
        }
      `}</style>
    </div>
  )
}
