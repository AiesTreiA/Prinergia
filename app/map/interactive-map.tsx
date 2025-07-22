"use client"

import { useEffect, useRef } from "react"
import { useLoadGoogleMaps } from "@/lib/use-load-google-maps"

interface MapLocation {
  id: number
  name: string
  specialty: string
  coordinates: { lat: number; lng: number }
  rating: number
  price: string
}

interface InteractiveMapProps {
  locations: MapLocation[]
  selectedLocation: number | null
  onLocationSelect: (id: number) => void
}

export default function InteractiveMap({ locations, selectedLocation, onLocationSelect }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const mapsReady = useLoadGoogleMaps()

  useEffect(() => {
    if (mapsReady) initializeMap()
  }, [mapsReady])

  const initializeMap = () => {
    if (!mapRef.current) return

    // Create map centered on Mexico City
    const map = new (window as any).google.maps.Map(mapRef.current, {
      center: { lat: 19.4326, lng: -99.1332 },
      zoom: 12,
      styles: [
        {
          featureType: "all",
          elementType: "geometry.fill",
          stylers: [{ color: "#f5f5f5" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }, { lightness: 17 }],
        },
      ],
    })

    mapInstanceRef.current = map

    // Add markers for each location
    locations.forEach((location) => {
      const marker = new (window as any).google.maps.Marker({
        position: location.coordinates,
        map: map,
        title: location.name,
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#16a34a" stroke="white" strokeWidth="4"/>
              <circle cx="20" cy="20" r="8" fill="white"/>
            </svg>
          `),
          scaledSize: new (window as any).google.maps.Size(40, 40),
          anchor: new (window as any).google.maps.Point(20, 20),
        },
      })

      // Add click listener
      marker.addListener("click", () => {
        onLocationSelect(location.id)

        // Create info window
        const infoWindow = new (window as any).google.maps.InfoWindow({
          content: `
            <div class="p-3 max-w-xs">
              <h3 class="font-semibold text-gray-800">${location.name}</h3>
              <p class="text-sm text-green-600">${location.specialty}</p>
              <div class="flex items-center justify-between mt-2">
                <span class="text-sm text-gray-600">⭐ ${location.rating}</span>
                <span class="font-bold text-gray-800">${location.price}</span>
              </div>
            </div>
          `,
        })

        infoWindow.open(map, marker)
      })
    })
  }

  return <div ref={mapRef} className="w-full h-full rounded-lg" style={{ minHeight: "400px" }} />
}
