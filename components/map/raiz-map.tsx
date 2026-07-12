"use client"

import { useEffect, useRef, useState } from "react"

interface NodeData {
  id?: string | number
  n: string
  cat?: string
  cats?: string[]
  lat: number
  lng: number
  info: string
  fuego?: boolean
  pending?: boolean
  consent_status?: string
}

const initialNodos: NodeData[] = [
  // --- Chile Nodos Históricos ---
  { n: "Escuela Metropolitana de Biodanza", cat: "Biodanza", lat: -33.452256, lng: -70.6122266, info: "Ñuñoa · Linaje Rolando Toro" },
  { n: "Escuela Biocéntrica (El Domo)", cat: "Biodanza", lat: -33.4530143, lng: -70.524045, info: "La Reina · Dir. Pedro Labbé Toro" },
  { n: "Escuela de Biodanza Amar", cat: "Biodanza", lat: -32.9741917, lng: -71.5395762, info: "Viña del Mar · Dir. Amanda Paz" },
  { n: "Escuela de Biodanza del Mar", cat: "Biodanza", lat: -33.4396781, lng: -71.6699752, info: "Isla Negra · Dir. Berta García" },
  { n: "Tu nodo — Barrio Lastarria", cat: "Biodanza", lat: -33.4368046, lng: -70.6422451, info: "Monjitas 350 · Facilitado con Alondra Muñoz" },
  { n: "Ashtanga Yoga Chile", cat: "Yoga", lat: -33.4371736, lng: -70.5817022, info: "Ñuñoa · Linaje K. Pattabhi Jois" },
  { n: "Mandala Chile Yoga", cat: "Yoga", lat: -33.4354463, lng: -70.6015369, info: "Providencia · Vinyasa Flow" },
  { n: "Yoga Kundalini", cat: "Yoga", lat: -33.5048224, lng: -70.6008854, info: "Macul · Linaje Yogi Bhajan" },
  { n: "Acroyoga Chile Latinoamérica", cat: "Yoga", lat: -33.4398606, lng: -70.6132177, info: "Providencia" },
  { n: "Temazcal Raíces de la Tierra", cat: "Temazcal", lat: -33.4667, lng: -70.6018, info: "Ñuñoa · Viernes 19hrs · Fuego Sagrado de la Red Kiva", fuego: true },
  { n: "Temazcal — Nodo regional", cat: "Temazcal", lat: -36.8270, lng: -73.0502, info: "Concepción · Ceremonia de Fuego de Medicina Ancestral", fuego: true },
  { n: "Centro Reiki y Armonización", cat: "Reiki", lat: -33.4251, lng: -70.6150, info: "Providencia · Reiki Usui & Sanación Pránica" },
  { n: "Gong Bath - Templo de Sonidos", cat: "Sonoterapia", lat: -33.4420, lng: -70.5980, info: "Las Condes · Baños de Gong y Cuencos de Cuarzo" },
  { n: "Escuela Empodérate — Coaching", cat: "Coaching", lat: -33.4157189, lng: -70.6025127, info: "Las Condes · Coaching Ontológico" },

  // --- Centros Emblemáticos Mundiales ---
  { n: "Esalen Institute", cat: "Coaching", lat: 36.1262, lng: -121.6378, info: "California, USA · Epicentro del Movimiento del Potencial Humano y terapia Gestalt", consent_status: "given" },
  { n: "Findhorn Foundation & Ecovillage", cat: "Reiki", lat: 57.6534, lng: -3.5934, info: "Moray, Escocia · Ecovilla pionera en co-creación con la naturaleza y escucha interna", consent_status: "given" },
  { n: "Auroville International Township", cat: "Yoga", lat: 11.9862, lng: 79.8080, info: "Tamil Nadu, India · Comunidad utópica dedicada a la unidad humana y despertar", consent_status: "given" },
  { n: "PachaMama Eco-Village", cat: "Yoga", lat: 9.9725, lng: -85.6611, info: "Guanacaste, Costa Rica · Templo de meditación, transformación y reforestación", consent_status: "given" },
  { n: "Plum Village Buddhist Community", cat: "Sonoterapia", lat: 44.7818, lng: 0.3345, info: "Dordogne, Francia · Monasterio budista Zen fundado por Thich Nhat Hanh", consent_status: "given" },
  { n: "Blue Clay Sanctuary", cat: "Reiki", lat: -8.5069, lng: 115.2625, info: "Ubud, Bali · Espacio holístico de retiro y alineación energética", consent_status: "given" },

  // --- Nodos Mundiales en Espera de Consentimiento ---
  { n: "Tassajara Zen Mountain Center", cat: "Yoga", lat: 36.2333, lng: -121.5500, info: "California, USA · Primer monasterio Zen de occidente y retiros holísticos", consent_status: "pending_consent" },
  { n: "Omega Institute for Holistic Studies", cat: "Coaching", lat: 41.8741, lng: -73.7994, info: "Rhinebeck, NY · Talleres de despertar consciente y educación holística", consent_status: "pending_consent" },
  { n: "Kripalu Center for Yoga & Health", cat: "Yoga", lat: 42.3364, lng: -73.3275, info: "Stockbridge, MA · Escuela y retiros de yoga y masoterapia", consent_status: "pending_consent" },
  { n: "Sacred Earth Sanctuary", cat: "Temazcal", lat: 51.3850, lng: -1.1850, info: "Berkshire, Reino Unido · Ceremonias ancestrales de fuego y cabañas de sudor", consent_status: "pending_consent", fuego: true },
  { n: "Chakra Holistics Ibiza", cat: "Sonoterapia", lat: 38.9067, lng: 1.4206, info: "Ibiza, España · Centro de sonoterapia y sanación vibracional mediterránea", consent_status: "pending_consent" },
  { n: "Suryalila Yoga Retreat", cat: "Yoga", lat: 36.8500, lng: -5.6000, info: "Andalucía, España · Domo geodésico de yoga y permacultura activa", consent_status: "pending_consent" },
  { n: "Caveland Sanctuary", cat: "Reiki", lat: 38.6431, lng: 34.8289, info: "Capadocia, Turquía · Meditación en cavernas y sanación de chakras", consent_status: "pending_consent" },
  { n: "Templo Ancestral de Reiki Kurama", cat: "Reiki", lat: 35.0116, lng: 135.7681, info: "Kioto, Japón · Cuna espiritual del linaje Mikao Usui", consent_status: "pending_consent" },
  { n: "Sacred Sound Dome", cat: "Sonoterapia", lat: 18.7883, lng: 98.9853, info: "Chiang Mai, Tailandia · Baños de sonido tibetano y respiración consciente", consent_status: "pending_consent" },
  { n: "Wasi Waska Research Center", cat: "Temazcal", lat: -27.5954, lng: -48.5480, info: "Florianópolis, Brasil · Integración botánica y sanación profunda", consent_status: "pending_consent", fuego: true }
]

const colores: { [key: string]: string } = {
  Biodanza: "#e2622c",   // Ascua orange
  Yoga: "#c99a3c",       // Oro gold
  Temazcal: "#f2a154",   // Ascua-2 light orange
  Reiki: "#5c6b45",      // Musgo green
  Sonoterapia: "#a89a8d", // Ceniza grey
  Coaching: "#8b5cf6",   // Purple
  Astrología: "#d946ef"  // Cosmic Magenta
}

const categoryAntiquityRank: { [key: string]: number } = {
  "Astrología": 1, // ~5000 años
  "Yoga": 2,        // ~3500 años
  "Temazcal": 3,    // ~3000 años
  "Reiki": 4,       // ~100 años
  "Biodanza": 5,    // ~60 años
  "Sonoterapia": 6,  // ~50 años
  "Coaching": 7     // ~40 años
}

interface RaizMapProps {
  selectedCategory: string
}

interface ChakraNode {
  name: string
  lat: number
  lng: number
  color: string
  chakraName: string
  meaning: string
  info: string
  desc: string
  zoom: number
  pitch: number
  bearing: number
}

const COORDS = {
  kailash: [81.3125, 31.0667],
  pac1: [120.0, 20.0],
  pac2: [160.0, 0.0],
  pac3: [200.0, -15.0],
  pac4: [240.0, -25.0],
  plomo: [289.7883, -33.2323],
  titicaca: [290.6640, -15.8430],
  sajama: [291.1178, -18.1092],
  chimborazo: [281.1831, -1.4693],
  santamarta: [286.2831, 10.8202],
  centralamerica: [275.0, 13.0],
  popocatepetl: [261.3722, 19.0225],
  eldorado: [255.5714, 20.8039]
}

const CHAKRAS_ROUTE: ChakraNode[] = [
  {
    name: "Monte Kailash",
    lat: 31.0667,
    lng: 81.3125,
    color: "#e2622c",
    chakraName: "Origen Sagrado",
    meaning: "Kundalini del Mundo anterior",
    info: "Himalayas, Tíbet",
    desc: "Durante milenios, el Tíbet fue el custodio de la energía espiritual planetaria. Desde aquí, la Kundalini terrestre inicia su viaje hacia los Andes.",
    zoom: 3.5,
    pitch: 40,
    bearing: 30
  },
  {
    name: "Cerro El Plomo",
    lat: -33.2323,
    lng: -70.2117,
    color: "#ef4444",
    chakraName: "Chakra 1: Raíz (Muladhara)",
    meaning: "Supervivencia, Base y Conexión Telúrica",
    info: "Santiago de Chile",
    desc: "Apu sagrado y santuario de altura inca. Custodia la base energética de la nueva columna planetaria, anclando nuestra existencia en la Madre Tierra.",
    zoom: 11,
    pitch: 55,
    bearing: -10
  },
  {
    name: "Lago Titicaca",
    lat: -15.8430,
    lng: -69.3360,
    color: "#f97316",
    chakraName: "Chakra 2: Sacro (Svadhisthana)",
    meaning: "Creatividad, Agua y Fuerza Vital",
    info: "Perú / Bolivia",
    desc: "El útero del continente. Sus aguas sagradas regulan las corrientes creativas y las emociones colectivas del planeta entero.",
    zoom: 8.5,
    pitch: 45,
    bearing: -15
  },
  {
    name: "Cerro Sajama",
    lat: -18.1092,
    lng: -68.8822,
    color: "#eab308",
    chakraName: "Chakra 3: Plexo Solar (Manipura)",
    meaning: "Poder Personal, Voluntad y Fuego Interior",
    info: "Oruro, Bolivia",
    desc: "El volcán más alto de Bolivia. Su fuego interno nutre el poder de transformación, iluminando la voluntad de toda la cordillera.",
    zoom: 9.5,
    pitch: 50,
    bearing: 0
  },
  {
    name: "Volcán Chimborazo",
    lat: -1.4693,
    lng: -78.8169,
    color: "#22c55e",
    chakraName: "Chakra 4: Corazón (Anahata)",
    meaning: "Amor Incondicional, Sanación y Aire",
    info: "Ecuador",
    desc: "El punto más cercano al sol desde el centro de la Tierra. Irradia amor incondicional y medicina de sanación a todo el globo.",
    zoom: 9.5,
    pitch: 45,
    bearing: 10
  },
  {
    name: "Sierra Nevada de Santa Marta",
    lat: 10.8202,
    lng: -73.7169,
    color: "#06b6d4",
    chakraName: "Chakra 5: Garganta (Vishuddha)",
    meaning: "Expresión, Verdad y Sonido Primordial",
    info: "Magdalena, Colombia",
    desc: "La montaña costera más alta del mundo. Expresa la sabiduría originaria y resuena con los cantos sagrados de los pueblos de la Tierra.",
    zoom: 9.5,
    pitch: 45,
    bearing: -5
  },
  {
    name: "Volcán Popocatépetl",
    lat: 19.0225,
    lng: -98.6278,
    color: "#6366f1",
    chakraName: "Chakra 6: Tercer Ojo (Ajna)",
    meaning: "Intuición, Visión y Luz Espiritual",
    info: "Puebla / Morelos, México",
    desc: "Don Goyo. El volcán guardián que eleva la visión intuitiva del continente, despertando la sabiduría interna de los pueblos americanos.",
    zoom: 9.5,
    pitch: 50,
    bearing: -20
  },
  {
    name: "Monte El Dorado",
    lat: 20.8039,
    lng: -104.4286,
    color: "#a855f7",
    chakraName: "Chakra 7: Corona (Sahasrara)",
    meaning: "Trascendencia, Conexión Cósmica e Iluminación",
    info: "Nayarit, México",
    desc: "Punto cúspide de la espina energética americana. Conecta la Serpiente de Luz con la fuente cósmica del universo.",
    zoom: 10,
    pitch: 40,
    bearing: -15
  }
]

const interpolatePoints = (p1: number[], p2: number[], steps: number): [number, number][] => {
  const arr: [number, number][] = []
  for (let i = 0; i < steps; i++) {
    const t = i / steps
    arr.push([
      p1[0] + (p2[0] - p1[0]) * t,
      p1[1] + (p2[1] - p1[1]) * t
    ])
  }
  return arr
}

const buildFullPath = (): { path: [number, number][]; indices: number[] } => {
  const path: [number, number][] = []
  const idxs: number[] = []
  
  idxs.push(path.length)
  path.push(COORDS.kailash as [number, number])
  
  path.push(...interpolatePoints(COORDS.kailash, COORDS.pac1, 15))
  path.push(...interpolatePoints(COORDS.pac1, COORDS.pac2, 15))
  path.push(...interpolatePoints(COORDS.pac2, COORDS.pac3, 15))
  path.push(...interpolatePoints(COORDS.pac3, COORDS.pac4, 15))
  path.push(...interpolatePoints(COORDS.pac4, COORDS.plomo, 20))
  
  idxs.push(path.length)
  path.push(COORDS.plomo as [number, number])
  
  path.push(...interpolatePoints(COORDS.plomo, COORDS.titicaca, 15))
  
  idxs.push(path.length)
  path.push(COORDS.titicaca as [number, number])
  
  path.push(...interpolatePoints(COORDS.titicaca, COORDS.sajama, 10))
  
  idxs.push(path.length)
  path.push(COORDS.sajama as [number, number])
  
  path.push(...interpolatePoints(COORDS.sajama, COORDS.chimborazo, 15))
  
  idxs.push(path.length)
  path.push(COORDS.chimborazo as [number, number])
  
  path.push(...interpolatePoints(COORDS.chimborazo, COORDS.santamarta, 15))
  
  idxs.push(path.length)
  path.push(COORDS.santamarta as [number, number])
  
  path.push(...interpolatePoints(COORDS.santamarta, COORDS.centralamerica, 10))
  path.push(...interpolatePoints(COORDS.centralamerica, COORDS.popocatepetl, 10))
  
  idxs.push(path.length)
  path.push(COORDS.popocatepetl as [number, number])
  
  path.push(...interpolatePoints(COORDS.popocatepetl, COORDS.eldorado, 12))
  
  idxs.push(path.length)
  path.push(COORDS.eldorado as [number, number])
  
  return { path, indices: idxs }
}

const { path: FULL_PATH, indices: pathIndices } = buildFullPath()

interface RaizMapProps {
  selectedCategory: string
}

export default function RaizMap({ selectedCategory }: RaizMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const markersMapRef = useRef<{ [key: string]: any }>({})
  const leafletPolylineRef = useRef<any>(null)
  
  // Modos: "loading" | "mapbox" | "leaflet"
  const [mapMode, setMapMode] = useState<"loading" | "mapbox" | "leaflet">("loading")
  const [leafletReady, setLeafletReady] = useState(false)
  const [mapboxReady, setMapboxReady] = useState(false)
  const [allNodos, setAllNodos] = useState<NodeData[]>(initialNodos)
  const [userInteracted, setUserInteracted] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | number | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Filtrar los nodos en el cuerpo para poder usarlos en el sidebar y ordenarlos por antigüedad (lo más antiguo primero)
  const filteredNodos = allNodos
    .filter((n) => {
      if (selectedCategory === "Todos") return true
      if (n.cats && Array.isArray(n.cats)) {
        return n.cats.includes(selectedCategory)
      }
      return n.cat === selectedCategory
    })
    .sort((a, b) => {
      const catA = a.cats && a.cats.length > 0 ? a.cats[0] : (a.cat || "Biodanza")
      const catB = b.cats && b.cats.length > 0 ? b.cats[0] : (b.cat || "Biodanza")
      const rankA = categoryAntiquityRank[catA] || 99
      const rankB = categoryAntiquityRank[catB] || 99
      return rankA - rankB
    })

  // Función para manejar la selección de un nodo (centrar mapa y abrir popup)
  const handleNodeSelect = (nodo: NodeData) => {
    if (!mapRef.current) return
    setSelectedNodeId(nodo.id || null)

    const normLng = ((nodo.lng + 180) % 360 + 360) % 360 - 180

    if (mapMode === "mapbox") {
      mapRef.current.flyTo({
        center: [normLng, nodo.lat],
        zoom: 13,
        pitch: 55,
        bearing: -15,
        duration: 2000
      })

      // Abrir popup programáticamente
      const marker = markersMapRef.current[nodo.id || ""]
      if (marker) {
        const popup = marker.getPopup()
        if (popup && !popup.isOpen()) {
          marker.togglePopup()
        }
      }
    } else if (mapMode === "leaflet") {
      mapRef.current.setView([nodo.lat, normLng], 13, { animate: true })

      // Abrir popup programáticamente
      const marker = markersMapRef.current[nodo.id || ""]
      if (marker) {
        marker.openPopup()
      }
    }
  }

  // Estados para la Ruta de Chakras Terrestres
  const [energyMode, setEnergyMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [lineProgressIndex, setLineProgressIndex] = useState(0)

  // Animación del trazo de la línea de energía
  useEffect(() => {
    if (!energyMode) return
    
    const targetIndex = pathIndices[currentStep]
    let active = true
    
    const stepAnimation = () => {
      setLineProgressIndex((prev) => {
        if (!active) return prev
        if (prev < targetIndex) {
          const next = Math.min(prev + 2, targetIndex)
          requestAnimationFrame(stepAnimation)
          return next
        } else if (prev > targetIndex) {
          const next = Math.max(prev - 4, targetIndex)
          requestAnimationFrame(stepAnimation)
          return next
        }
        return prev
      })
    }
    
    stepAnimation()
    
    return () => {
      active = false
    }
  }, [currentStep, energyMode])

  // Autoplay para la migración
  useEffect(() => {
    if (!energyMode || !isPlaying) return
    
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < CHAKRAS_ROUTE.length - 1) {
          return prev + 1
        } else {
          setIsPlaying(false)
          return prev
        }
      })
    }, 7000)
    
    return () => clearInterval(timer)
  }, [isPlaying, energyMode])

  // Mover cámara según el paso actual de los chakras
  useEffect(() => {
    if (!energyMode || !mapRef.current) return
    
    const activeChakra = CHAKRAS_ROUTE[currentStep]
    if (!activeChakra) return
    
    const normLng = ((activeChakra.lng + 180) % 360 + 360) % 360 - 180
    
    if (mapMode === "mapbox") {
      if (currentStep === CHAKRAS_ROUTE.length - 1) {
        mapRef.current.flyTo({
          center: [-85.0, 0.0],
          zoom: 2.8,
          pitch: 35,
          bearing: -10,
          duration: 3500
        })
      } else {
        mapRef.current.flyTo({
          center: [normLng, activeChakra.lat],
          zoom: activeChakra.zoom,
          pitch: activeChakra.pitch,
          bearing: activeChakra.bearing,
          duration: 3000,
          essential: true
        })
      }
    } else if (mapMode === "leaflet") {
      if (currentStep === CHAKRAS_ROUTE.length - 1) {
        mapRef.current.setView([-5.0, -85.0], 3, { animate: true, duration: 3 })
      } else {
        mapRef.current.setView([activeChakra.lat, normLng], activeChakra.zoom, { animate: true, duration: 2.5 })
      }
    }
  }, [currentStep, energyMode, mapMode, mapLoaded])

  const setupEnergyLayers = (map: any) => {
    if (!map) return
    if (map.getSource("energy-path-source")) return
    
    map.addSource("energy-path-source", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [[COORDS.kailash[0], COORDS.kailash[1]], [COORDS.kailash[0], COORDS.kailash[1]]]
        }
      }
    })
    
    map.addLayer({
      id: "energy-path-glow",
      type: "line",
      source: "energy-path-source",
      layout: {
        "line-join": "round",
        "line-cap": "round"
      },
      paint: {
        "line-color": "#f2a154",
        "line-width": 8,
        "line-opacity": 0.35,
        "line-blur": 5
      }
    })
    
    map.addLayer({
      id: "energy-path-layer",
      type: "line",
      source: "energy-path-source",
      layout: {
        "line-join": "round",
        "line-cap": "round"
      },
      paint: {
        "line-color": "#f2a154",
        "line-width": 3,
        "line-opacity": 0.8
      }
    })
  }

  // Actualizar la línea de energía dibujada en el mapa
  useEffect(() => {
    if (!energyMode || !mapRef.current) return
    
    if (mapMode === "mapbox") {
      setupEnergyLayers(mapRef.current)
      const source = mapRef.current.getSource("energy-path-source")
      if (source) {
        const currentCoords = FULL_PATH.slice(0, lineProgressIndex + 1)
        if (currentCoords.length < 2) {
          source.setData({
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [[COORDS.kailash[0], COORDS.kailash[1]], [COORDS.kailash[0], COORDS.kailash[1]]]
            }
          })
        } else {
          source.setData({
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: currentCoords
            }
          })
        }
      }
    } else if (mapMode === "leaflet") {
      const L = (window as any).L
      if (L) {
        if (!leafletPolylineRef.current) {
          leafletPolylineRef.current = L.polyline([], {
            color: "#f2a154",
            weight: 4,
            opacity: 0.85
          }).addTo(mapRef.current)
        }
        
        const currentCoords = FULL_PATH.slice(0, lineProgressIndex + 1)
        const latLngs = currentCoords.map(coord => [coord[1], ((coord[0] + 180) % 360 + 360) % 360 - 180])
        leafletPolylineRef.current.setLatLngs(latLngs)
      }
    }
  }, [lineProgressIndex, energyMode, mapMode, mapboxReady, leafletReady, mapLoaded])

  const handleEnterEnergyMode = () => {
    setEnergyMode(true)
    setCurrentStep(0)
    setLineProgressIndex(0)
    setIsPlaying(true)
    
    if (mapMode === "mapbox" && mapRef.current) {
      setupEnergyLayers(mapRef.current)
      mapRef.current.flyTo({
        center: [COORDS.kailash[0], COORDS.kailash[1]],
        zoom: 3.5,
        pitch: 40,
        bearing: 30,
        duration: 2500
      })
    } else if (mapMode === "leaflet" && mapRef.current) {
      mapRef.current.setView([COORDS.kailash[1], COORDS.kailash[0]], 3, { animate: true })
    }
  }

  const handleExit = () => {
    setIsPlaying(false)
    setEnergyMode(false)
    setCurrentStep(0)
    
    // Limpiar capa de línea en Mapbox
    if (mapMode === "mapbox" && mapRef.current) {
      const source = mapRef.current.getSource("energy-path-source")
      if (source) {
        source.setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [[COORDS.kailash[0], COORDS.kailash[1]], [COORDS.kailash[0], COORDS.kailash[1]]]
          }
        })
      }
      
      // Volver a centrar en Sudamérica
      mapRef.current.flyTo({
        center: [-40.0, 15.0],
        zoom: 1.8,
        pitch: 35,
        bearing: -10,
        duration: 2000
      })
    }
    
    // Limpiar Leaflet
    if (mapMode === "leaflet") {
      if (leafletPolylineRef.current) {
        leafletPolylineRef.current.remove()
        leafletPolylineRef.current = null
      }
      if (mapRef.current) {
        mapRef.current.setView([-33.45, -70.62], 4, { animate: true })
      }
    }
  }

  const handleNext = () => {
    setIsPlaying(false)
    if (currentStep < CHAKRAS_ROUTE.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    setIsPlaying(false)
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Cargar nodos propuestos desde localStorage
  useEffect(() => {
    const loadNodos = () => {
      try {
        const stored = localStorage.getItem("raiz_proposed_nodes")
        const baseNodos = initialNodos.map((n, i) => ({
          ...n,
          id: n.id || `initial-${i}`
        }))
        if (stored) {
          const parsed = JSON.parse(stored) as NodeData[]
          const parsedWithIds = parsed.map((n, i) => ({
            ...n,
            id: n.id || `proposed-${i}-${Date.now()}`
          }))
          setAllNodos([...baseNodos, ...parsedWithIds])
        } else {
          setAllNodos(baseNodos)
        }
      } catch (err) {
        console.error("Error loading nodes from localStorage", err)
        const baseNodos = initialNodos.map((n, i) => ({
          ...n,
          id: n.id || `initial-${i}`
        }))
        setAllNodos(baseNodos)
      }
    }

    loadNodos()
    window.addEventListener("storage", loadNodos)
    return () => {
      window.removeEventListener("storage", loadNodos)
    }
  }, [])

  // Registrar manejador global para clics dentro de popups HTML de Mapbox/Leaflet
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).openCheckout = (id: string, name: string, category: string) => {
        const event = new CustomEvent("open-checkout", { detail: { id, name, category } })
        window.dispatchEvent(event)
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).openCheckout
      }
    }
  }, [])

  // Cargar dinámicamente scripts de Mapbox o Leaflet según disponibilidad y velocidad
  useEffect(() => {
    let active = true
    let timeoutId: any

    const initMapSystem = async () => {
      // Iniciar un temporizador de seguridad de 3 segundos
      // Si Mapbox tarda más, cae directamente al fallback de Leaflet
      timeoutId = setTimeout(() => {
        if (active && mapMode === "loading") {
          console.warn("⏱️ Mapbox tardó demasiado en cargar. Activando fallback de Leaflet.")
          setMapMode("leaflet")
          loadLeaflet()
        }
      }, 3000)

      try {
        // Cargar Server Action dinámicamente para evitar problemas de SSR
        const { getMapboxAccessToken } = await import("@/app/actions")
        const token = await getMapboxAccessToken()

        if (!token) {
          console.warn("⚠️ No se encontró Mapbox Access Token en variables. Activando fallback de Leaflet.")
          if (active) {
            clearTimeout(timeoutId)
            setMapMode("leaflet")
            loadLeaflet()
          }
          return
        }

        if (active) {
          const mb = await loadMapboxScripts(token)
          if (mb && active) {
            clearTimeout(timeoutId)
            setMapMode("mapbox")
            setMapboxReady(true)
          } else if (active) {
            clearTimeout(timeoutId)
            setMapMode("leaflet")
            loadLeaflet()
          }
        }
      } catch (err) {
        console.error("Error al iniciar Mapbox, recurriendo a Leaflet:", err)
        if (active) {
          clearTimeout(timeoutId)
          setMapMode("leaflet")
          loadLeaflet()
        }
      }
    }

    const loadLeaflet = () => {
      if (typeof window === "undefined") return
      if ((window as any).L) {
        setLeafletReady(true)
        return
      }

      // Cargar CSS de Leaflet
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link")
        link.id = "leaflet-css"
        link.rel = "stylesheet"
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        document.head.appendChild(link)
      }

      // Cargar JS de Leaflet
      if (!document.getElementById("leaflet-js")) {
        const script = document.createElement("script")
        script.id = "leaflet-js"
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"
        script.async = true
        script.onload = () => {
          setLeafletReady(true)
        }
        document.body.appendChild(script)
      } else {
        setLeafletReady(true)
      }
    }

    const loadMapboxScripts = (token: string): Promise<any> => {
      return new Promise((resolve) => {
        if ((window as any).mapboxgl) {
          ;(window as any).mapboxgl.accessToken = token
          resolve((window as any).mapboxgl)
          return
        }

        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
        document.head.appendChild(link)

        const script = document.createElement("script")
        script.src = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"
        script.async = true
        script.onload = () => {
          const mb = (window as any).mapboxgl
          if (mb) {
            mb.accessToken = token
            resolve(mb)
          } else {
            resolve(null)
          }
        }
        script.onerror = () => resolve(null)
        document.head.appendChild(script)
      })
    }

    initMapSystem()

    return () => {
      active = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  // 2. Inyectar estilos CSS compartidos para las Fogatas y Scrollbar
  useEffect(() => {
    if (typeof window === "undefined") return
    
    let style = document.getElementById("campfires-shared-styles") as HTMLStyleElement
    if (!style) {
      style = document.createElement("style")
      style.id = "campfires-shared-styles"
      document.head.appendChild(style)
    }

    style.innerHTML = `
      /* Custom Scrollbar for sidebar list */
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(23, 19, 16, 0.5);
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(242, 233, 221, 0.15);
        border-radius: 2px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #e2622c;
      }

      /* Estilos para las fogatas en ambos mapas (Contenedor externo posicionado por el mapa) */
      .campfire-marker, .custom-mapbox-marker {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        overflow: visible !important;
      }
      .custom-mapbox-marker:hover, .custom-leaflet-campfire:hover {
        z-index: 9999 !important;
      }

      /* Elemento interno que recibe el diseño, glow y escalado al hacer hover */
      .campfire-inner {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        border-radius: 50%;
        transition: all 0.25s ease;
        background: rgba(23, 19, 16, 0.85);
        border: 2px solid var(--color, #e2622c);
        box-shadow: 0 0 10px rgba(0,0,0,0.5), 0 0 8px var(--color, #e2622c);
      }
      .campfire-inner:hover {
        transform: scale(1.25) translateY(-2px);
        box-shadow: 0 0 15px rgba(0,0,0,0.6), 0 0 15px var(--color, #e2622c);
        z-index: 999;
      }
      .fire-glow {
        position: absolute;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        opacity: 0.35;
        animation: glow-pulse 1.8s infinite alternate ease-in-out;
        pointer-events: none;
      }
      @keyframes glow-pulse {
        0% { transform: scale(0.85); opacity: 0.2; }
        100% { transform: scale(1.4); opacity: 0.5; }
      }
      .fire-flames {
        position: absolute;
        bottom: 10px;
        width: 16px;
        height: 18px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
      }
      .flame {
        position: absolute;
        border-radius: 50% 50% 20% 20%;
        transform-origin: bottom center;
      }
      .flame-1 {
        width: 10px;
        height: 16px;
        animation: flicker-1 0.7s infinite alternate ease-in-out;
        box-shadow: 0 0 8px var(--color, #e2622c);
      }
      .flame-2 {
        width: 8px;
        height: 12px;
        animation: flicker-2 0.5s infinite alternate-reverse ease-in-out;
        opacity: 0.95;
        box-shadow: 0 0 6px #f2a154;
      }
      .flame-3 {
        width: 5px;
        height: 8px;
        animation: flicker-1 0.4s infinite alternate ease-in-out;
        opacity: 0.9;
        box-shadow: 0 0 4px #c99a3c;
      }
      @keyframes flicker-1 {
        0% { transform: scale(1) rotate(-5deg); }
        100% { transform: scale(1.3) rotate(5deg); }
      }
      @keyframes flicker-2 {
        0% { transform: scale(0.9) rotate(5deg); }
        100% { transform: scale(1.2) rotate(-5deg); }
      }
      .fire-logs {
        position: absolute;
        bottom: 6px;
        width: 16px;
        height: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.9;
      }
      .log {
        position: absolute;
        width: 12px;
        height: 2.5px;
        background-color: #8b5a2b;
        border-radius: 1px;
      }
      .log-1 {
        transform: rotate(-25deg);
      }
      .log-2 {
        transform: rotate(25deg);
      }

      /* Nodos esperando consentimiento */
      .campfire-inner.is-pending {
        opacity: 0.7;
        border-style: dashed;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.4), 0 0 4px var(--color, #e2622c);
      }
      .campfire-inner.is-pending .flame {
        filter: saturate(40%) opacity(85%);
      }
      .campfire-inner.is-pending .fire-glow {
        border: 1px dashed rgba(242, 161, 84, 0.4);
        border-radius: 50%;
        animation: spin-dashed 12s infinite linear;
        opacity: 0.5;
      }
      @keyframes spin-dashed {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Estilo fuego sagrado */
      .campfire-inner.is-fuego {
        transform: scale(1.15);
      }
      .campfire-inner.is-fuego:hover {
        transform: scale(1.35) translateY(-2px);
      }
      .campfire-inner.is-fuego .flame-1 {
        box-shadow: 0 0 12px var(--color);
      }
      .campfire-inner.is-fuego .fire-glow {
        opacity: 0.55;
        animation-duration: 1.2s;
      }

      /* Leaflet specific reset */
      .custom-leaflet-campfire {
        background: transparent !important;
        border: none !important;
      }

      /* Estilos para popups en Leaflet */
      .raiz-custom-popup .leaflet-popup-content-wrapper {
        background: #211a15 !important;
        color: #f2e9dd !important;
        font-family: 'Inter', sans-serif;
        border: 1px solid rgba(242, 233, 221, 0.15);
        border-radius: 12px;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
        padding: 4px 6px;
      }
      .raiz-custom-popup .leaflet-popup-tip {
        background: #211a15 !important;
        border: 1px solid rgba(242, 233, 221, 0.15);
      }

      /* Estilos para el popup en el mapa oscuro de Mapbox */
      .raiz-mapbox-custom-popup .mapboxgl-popup-content {
        background: #211a15 !important;
        color: #f2e9dd !important;
        font-family: 'Inter', sans-serif;
        border: 1px solid rgba(242, 233, 221, 0.15) !important;
        border-radius: 12px !important;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6) !important;
        padding: 12px 14px !important;
        max-width: 200px;
      }
      .raiz-mapbox-custom-popup .mapboxgl-popup-tip {
        border-top-color: #211a15 !important;
        border-bottom-color: #211a15 !important;
      }
      .raiz-popup-title {
        font-family: 'Fraunces', serif;
        font-weight: 600;
        font-size: 14px;
        margin: 4px 0;
        color: #f2e9dd;
        line-height: 1.25;
      }
      .raiz-popup-cat {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #f2a154;
      }
      .raiz-popup-info {
        font-size: 11px;
        color: #a89a8d;
        margin-top: 4px;
        line-height: 1.35;
      }

      /* Estilos de Chakras y Llama de Energía */
      .chakra-marker {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: pointer;
        z-index: 50;
      }
      .waves-container {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }
      .energy-wave {
        position: absolute;
        border: 2px solid var(--chakra-color);
        border-radius: 50%;
        width: 20px;
        height: 20px;
        opacity: 0;
        animation: energy-expand 4s infinite cubic-bezier(0.1, 0.8, 0.3, 1);
        will-change: transform, opacity;
      }
      .energy-wave-1 {
        animation-delay: 0s;
      }
      .energy-wave-2 {
        animation-delay: 1.3s;
      }
      .energy-wave-3 {
        animation-delay: 2.6s;
      }

      @keyframes energy-expand {
        0% {
          transform: scale(1);
          opacity: 0.8;
        }
        100% {
          transform: scale(15);
          opacity: 0;
          border-width: 0.5px;
        }
      }
    `

    return () => {
      document.getElementById("campfires-shared-styles")?.remove()
    }
  }, [])

  // 3. Inicializar MODO MAPBOX (3D Globe)
  useEffect(() => {
    if (mapMode !== "mapbox" || !mapboxReady || !mapContainerRef.current || mapRef.current) return

    const mapboxgl = (window as any).mapboxgl
    if (!mapboxgl) return

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-70.62, -33.45],
      zoom: 1.5,
      pitch: 35,
      bearing: -10,
      projection: "globe",
      scrollZoom: false
    })

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right")

    map.on("load", () => {
      map.setFog({
        color: "rgb(27, 21, 17)",
        "high-color": "rgb(33, 26, 21)",
        "horizon-blend": 0.12,
        "space-color": "rgb(12, 10, 8)",
        "star-intensity": 0.85
      })

      mapRef.current = map
      setMapLoaded(true)

      // Giro orbital automático
      let activeSpin = true
      const spin = () => {
        if (!activeSpin || userInteracted || !mapRef.current) return
        const currentZoom = mapRef.current.getZoom()
        if (currentZoom < 4) {
          const center = mapRef.current.getCenter()
          center.lng += 0.08
          mapRef.current.setCenter(center)
          requestAnimationFrame(spin)
        }
      }
      spin()

      const stopSpin = () => {
        activeSpin = false
        setUserInteracted(true)
      }

      map.on("dragstart", stopSpin)
      map.on("zoomstart", stopSpin)
      map.on("pitchstart", stopSpin)
      map.on("rotatestart", stopSpin)
      map.on("mousedown", stopSpin)
      map.on("touchstart", stopSpin)
    })

    return () => {
      if (mapRef.current && mapMode === "mapbox") {
        mapRef.current.remove()
        mapRef.current = null
      }
      setMapLoaded(false)
    }
  }, [mapMode, mapboxReady])

  // 4. Inicializar MODO LEAFLET (Fallback Seguro de Código Abierto)
  useEffect(() => {
    if (mapMode !== "leaflet" || !leafletReady || !mapContainerRef.current || mapRef.current) return

    const L = (window as any).L
    if (!L) return

    const map = L.map(mapContainerRef.current, {
      scrollWheelZoom: false,
      zoomControl: true
    }).setView([-33.45, -70.62], 7)

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20
    }).addTo(map)

    mapRef.current = map
    setMapLoaded(true)

    return () => {
      if (mapRef.current && mapMode === "leaflet") {
        mapRef.current.remove()
        mapRef.current = null
      }
      setMapLoaded(false)
    }
  }, [mapMode, leafletReady])

  // 5. Renderizar Marcadores en ambos Modos
  useEffect(() => {
    if (!mapRef.current) return

    // Limpiar marcadores anteriores
    markersRef.current.forEach((marker) => {
      if (marker.remove) marker.remove()
    })
    markersRef.current = []
    markersMapRef.current = {}

    if (energyMode) {
      // MODO ENERGÉTICO (CHAKRAS DE LA TIERRA)
      CHAKRAS_ROUTE.forEach((chakra, index) => {
        const chakraTargetIdx = pathIndices[index]
        // Mostrar el chakra solo si la línea de energía ha avanzado hasta su coordenada
        if (lineProgressIndex >= chakraTargetIdx) {
          const normLng = ((chakra.lng + 180) % 360 + 360) % 360 - 180

          // Crear Llama del Chakra
          const el = document.createElement("div")
          el.className = "chakra-marker"
          el.style.setProperty("--chakra-color", chakra.color)

          const glow = document.createElement("div")
          glow.className = "fire-glow"
          glow.style.background = `radial-gradient(circle, ${chakra.color} 0%, rgba(0,0,0,0) 70%)`
          el.appendChild(glow)

          const wavesContainer = document.createElement("div")
          wavesContainer.className = "waves-container"
          const w1 = document.createElement("div")
          w1.className = "energy-wave energy-wave-1"
          w1.style.borderColor = chakra.color
          wavesContainer.appendChild(w1)
          const w2 = document.createElement("div")
          w2.className = "energy-wave energy-wave-2"
          w2.style.borderColor = chakra.color
          wavesContainer.appendChild(w2)
          const w3 = document.createElement("div")
          w3.className = "energy-wave energy-wave-3"
          w3.style.borderColor = chakra.color
          wavesContainer.appendChild(w3)
          el.appendChild(wavesContainer)

          const flames = document.createElement("div")
          flames.className = "fire-flames"
          const f1 = document.createElement("div")
          f1.className = "flame flame-1"
          f1.style.backgroundColor = chakra.color
          flames.appendChild(f1)
          const f2 = document.createElement("div")
          f2.className = "flame flame-2"
          f2.style.backgroundColor = "#ffffff" // núcleo blanco intenso
          flames.appendChild(f2)
          const f3 = document.createElement("div")
          f3.className = "flame flame-3"
          f3.style.backgroundColor = chakra.color
          flames.appendChild(f3)
          el.appendChild(flames)

          const logs = document.createElement("div")
          logs.className = "fire-logs"
          const l1 = document.createElement("div")
          l1.className = "log log-1"
          logs.appendChild(l1)
          const l2 = document.createElement("div")
          l2.className = "log log-2"
          logs.appendChild(l2)
          el.appendChild(logs)

          const popupContent = `
            <div style="min-width: 160px; font-family: sans-serif;">
              <div class="raiz-popup-cat" style="color: ${chakra.color}; font-weight: bold;">${chakra.chakraName}</div>
              <div class="raiz-popup-title" style="margin-top: 4px; font-weight: bold; font-size: 14px;">${chakra.name}</div>
              <div class="raiz-popup-info" style="margin-top: 4px; font-size: 11px;">${chakra.meaning}</div>
            </div>
          `

          if (mapMode === "mapbox") {
            const mapboxgl = (window as any).mapboxgl
            if (!mapboxgl) return

            const popup = new mapboxgl.Popup({
              closeButton: false,
              offset: [0, -8],
              className: "raiz-mapbox-custom-popup"
            }).setHTML(popupContent)

            const marker = new mapboxgl.Marker({
              element: el,
              anchor: "center"
            })
              .setLngLat([normLng, chakra.lat])
              .setPopup(popup)
              .addTo(mapRef.current)

            el.addEventListener("click", () => {
              setCurrentStep(index)
            })

            markersRef.current.push(marker)
          } else if (mapMode === "leaflet") {
            const L = (window as any).L
            if (!L) return

            const customIcon = L.divIcon({
              className: "custom-leaflet-campfire",
              html: el.outerHTML,
              iconSize: [40, 40],
              iconAnchor: [20, 20]
            })

            const marker = L.marker([chakra.lat, normLng], { icon: customIcon })
            marker.bindPopup(popupContent, {
              closeButton: false,
              offset: L.point(0, -8),
              className: "raiz-custom-popup"
            })

            marker.on("click", () => {
              setCurrentStep(index)
            })

            marker.addTo(mapRef.current)
            markersRef.current.push(marker)
          }
        }
      })
    } else {
      // MODO NORMAL (MAPA DE FACILITADORES/PROFESIONALES)
      const filtered = filteredNodos

      if (mapMode === "mapbox") {
        const mapboxgl = (window as any).mapboxgl
        if (!mapboxgl) return

        filtered.forEach((nodo) => {
          const mainCat = nodo.cats && nodo.cats.length > 0 ? nodo.cats[0] : (nodo.cat || "Biodanza")
          const color = colores[mainCat] || "#e2622c"
          const isPending = nodo.pending || nodo.consent_status === "pending_consent"

          // Crear Fogata HTML (Contenedor externo posicionado por Mapbox)
          const el = document.createElement("div")
          el.className = "custom-mapbox-marker"
          el.style.width = "36px"
          el.style.height = "36px"
          el.style.display = "flex"
          el.style.alignItems = "center"
          el.style.justifyContent = "center"
          el.style.position = "relative"
          el.style.overflow = "visible"

          // Elemento interno (visual y hover sin interferir con la traslación de Mapbox)
          const innerEl = document.createElement("div")
          innerEl.className = "campfire-inner"
          if (isPending) innerEl.classList.add("is-pending")
          if (nodo.fuego) innerEl.classList.add("is-fuego")

          innerEl.style.width = "100%"
          innerEl.style.height = "100%"
          innerEl.style.display = "flex"
          innerEl.style.alignItems = "center"
          innerEl.style.justifyContent = "center"
          innerEl.style.position = "relative"
          innerEl.style.borderRadius = "50%"
          innerEl.style.background = "rgba(23, 19, 16, 0.85)"
          innerEl.style.border = `2px ${isPending ? "dashed" : "solid"} ${color}`
          innerEl.style.boxShadow = `0 0 10px rgba(0,0,0,0.5), 0 0 8px ${color}`
          innerEl.style.transition = "all 0.25s ease"
          innerEl.style.cursor = "pointer"
          innerEl.style.setProperty("--color", color)

          const glow = document.createElement("div")
          glow.className = "fire-glow"
          glow.style.position = "absolute"
          glow.style.width = "40px"
          glow.style.height = "40px"
          glow.style.borderRadius = "50%"
          glow.style.opacity = "0.35"
          glow.style.background = `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`
          glow.style.pointerEvents = "none"
          innerEl.appendChild(glow)

          const flames = document.createElement("div")
          flames.className = "fire-flames"
          flames.style.position = "absolute"
          flames.style.bottom = "10px"
          flames.style.width = "16px"
          flames.style.height = "18px"
          flames.style.display = "flex"
          flames.style.alignItems = "flex-end"
          flames.style.justifyContent = "center"

          const f1 = document.createElement("div")
          f1.className = "flame flame-1"
          f1.style.position = "absolute"
          f1.style.borderRadius = "50% 50% 20% 20%"
          f1.style.transformOrigin = "bottom center"
          f1.style.width = "10px"
          f1.style.height = "16px"
          f1.style.backgroundColor = color
          f1.style.boxShadow = `0 0 8px ${color}`
          flames.appendChild(f1)

          const f2 = document.createElement("div")
          f2.className = "flame flame-2"
          f2.style.position = "absolute"
          f2.style.borderRadius = "50% 50% 20% 20%"
          f2.style.transformOrigin = "bottom center"
          f2.style.width = "8px"
          f2.style.height = "12px"
          f2.style.backgroundColor = "#f2a154"
          f2.style.boxShadow = "0 0 6px #f2a154"
          flames.appendChild(f2)

          const f3 = document.createElement("div")
          f3.className = "flame flame-3"
          f3.style.position = "absolute"
          f3.style.borderRadius = "50% 50% 20% 20%"
          f3.style.transformOrigin = "bottom center"
          f3.style.width = "5px"
          f3.style.height = "8px"
          f3.style.backgroundColor = "#c99a3c"
          f3.style.boxShadow = "0 0 4px #c99a3c"
          flames.appendChild(f3)
          innerEl.appendChild(flames)

          const logs = document.createElement("div")
          logs.className = "fire-logs"
          logs.style.position = "absolute"
          logs.style.bottom = "6px"
          logs.style.width = "16px"
          logs.style.height = "4px"
          logs.style.display = "flex"
          logs.style.alignItems = "center"
          logs.style.justifyContent = "center"
          logs.style.opacity = "0.9"

          const l1 = document.createElement("div")
          l1.className = "log log-1"
          l1.style.position = "absolute"
          l1.style.width = "12px"
          l1.style.height = "2.5px"
          l1.style.backgroundColor = "#8b5a2b"
          l1.style.borderRadius = "1px"
          l1.style.transform = "rotate(-25deg)"
          logs.appendChild(l1)

          const l2 = document.createElement("div")
          l2.className = "log log-2"
          l2.style.position = "absolute"
          l2.style.width = "12px"
          l2.style.height = "2.5px"
          l2.style.backgroundColor = "#8b5a2b"
          l2.style.borderRadius = "1px"
          l2.style.transform = "rotate(25deg)"
          logs.appendChild(l2)
          innerEl.appendChild(logs)

          el.appendChild(innerEl)

          // Popup Content
          const categoriesLabel = nodo.cats && Array.isArray(nodo.cats) ? nodo.cats.join(" · ") : (nodo.cat || "")
          const pendingBadge = isPending 
            ? ` <span style="background: rgba(242, 161, 84, 0.15); color: #f2a154; border: 1px solid rgba(242, 161, 84, 0.3); padding: 1.5px 4px; border-radius: 3px; font-size: 7px; margin-left: 4px; font-family: monospace; font-weight: bold; letter-spacing: 0.05em; display: inline-block; vertical-align: middle;">ESPERANDO CONSENTIMIENTO</span>`
            : ""

          const popupContent = `
            <div class="raiz-custom-popup">
              <div class="raiz-popup-cat">${categoriesLabel}${nodo.fuego ? " · fuego sagrado" : ""}${pendingBadge}</div>
              <div class="raiz-popup-title">${nodo.n}</div>
              <div class="raiz-popup-info">${nodo.info}</div>
              <button onclick="window.openCheckout('${nodo.id || 0}', '${nodo.n.replace(/'/g, "\\'")}', '${mainCat}')" class="raiz-popup-book-btn">Reservar Actividad</button>
            </div>
          `

          const popup = new mapboxgl.Popup({
            closeButton: false,
            offset: [0, -8],
            className: "raiz-mapbox-custom-popup"
          }).setHTML(popupContent)

          const marker = new mapboxgl.Marker({
            element: el,
            anchor: "center"
          })
            .setLngLat([nodo.lng, nodo.lat])
            .setPopup(popup)
            .addTo(mapRef.current)

          el.addEventListener("click", (e) => {
            e.stopPropagation()
            setSelectedNodeId(nodo.id || null)
            
            // Forzar apertura de popup para solucionar comportamiento en Mapbox
            if (marker.getPopup() && !marker.getPopup().isOpen()) {
              marker.togglePopup()
            }

            mapRef.current.flyTo({
              center: [nodo.lng, nodo.lat],
              zoom: 13,
              pitch: 55,
              bearing: -15,
              duration: 2000
            })
          })

          popup.on("close", () => {
            setSelectedNodeId((prev) => (prev === nodo.id ? null : prev))
          })

          markersRef.current.push(marker)
          if (nodo.id) {
            markersMapRef.current[nodo.id] = marker
          }
        })

        // Enfocar cámara Mapbox
        if (filtered.length > 0 && selectedCategory !== "Todos") {
          if (filtered.length === 1) {
            mapRef.current.flyTo({
              center: [filtered[0].lng, filtered[0].lat],
              zoom: 10,
              pitch: 45,
              bearing: -12,
              duration: 2500
            })
          } else {
            const bounds = new mapboxgl.LngLatBounds()
            filtered.forEach(nodo => bounds.extend([nodo.lng, nodo.lat]))
            mapRef.current.fitBounds(bounds, {
              padding: 80,
              maxZoom: 10,
              duration: 2500,
              pitch: 45,
              bearing: -12
            })
          }
        } else if (selectedCategory === "Todos" && userInteracted) {
          mapRef.current.flyTo({
            center: [-40.0, 15.0],
            zoom: 1.8,
            pitch: 35,
            bearing: -10,
            duration: 2000
          })
        }

      } else if (mapMode === "leaflet") {
        const L = (window as any).L
        if (!L) return

        filtered.forEach((nodo) => {
          const mainCat = nodo.cats && nodo.cats.length > 0 ? nodo.cats[0] : (nodo.cat || "Biodanza")
          const color = colores[mainCat] || "#e2622c"
          const isPending = nodo.pending || nodo.consent_status === "pending_consent"

          // Crear Icono de Fogata para Leaflet con estilos inline y contenedor interno garantizados
          const customIcon = L.divIcon({
            className: "custom-leaflet-campfire",
            html: `
              <div class="campfire-marker" style="
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: visible;
              ">
                <div class="campfire-inner ${nodo.fuego ? 'is-fuego' : ''} ${isPending ? 'is-pending' : ''}" style="
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                  cursor: pointer;
                  background: rgba(23, 19, 16, 0.85);
                  border: 2px ${isPending ? 'dashed' : 'solid'} ${color};
                  border-radius: 50%;
                  box-shadow: 0 0 10px rgba(0,0,0,0.5), 0 0 8px ${color};
                  transition: all 0.25s ease;
                ">
                  <div class="fire-glow" style="
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    opacity: 0.35;
                    background: radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%);
                    pointer-events: none;
                  "></div>
                  <div class="fire-flames" style="
                    position: absolute;
                    bottom: 10px;
                    width: 16px;
                    height: 18px;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                  ">
                    <div class="flame flame-1" style="
                      position: absolute;
                      border-radius: 50% 50% 20% 20%;
                      transform-origin: bottom center;
                      width: 10px;
                      height: 16px;
                      background-color: ${color};
                      box-shadow: 0 0 8px ${color};
                    "></div>
                    <div class="flame flame-2" style="
                      position: absolute;
                      border-radius: 50% 50% 20% 20%;
                      transform-origin: bottom center;
                      width: 8px;
                      height: 12px;
                      background-color: #f2a154;
                      box-shadow: 0 0 6px #f2a154;
                    "></div>
                    <div class="flame flame-3" style="
                      position: absolute;
                      border-radius: 50% 50% 20% 20%;
                      transform-origin: bottom center;
                      width: 5px;
                      height: 8px;
                      background-color: #c99a3c;
                      box-shadow: 0 0 4px #c99a3c;
                    "></div>
                  </div>
                  <div class="fire-logs" style="
                    position: absolute;
                    bottom: 6px;
                    width: 16px;
                    height: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0.9;
                  ">
                    <div class="log log-1" style="
                      position: absolute;
                      width: 12px;
                      height: 2.5px;
                      background-color: #8b5a2b;
                      border-radius: 1px;
                      transform: rotate(-25deg);
                    "></div>
                    <div class="log log-2" style="
                      position: absolute;
                      width: 12px;
                      height: 2.5px;
                      background-color: #8b5a2b;
                      border-radius: 1px;
                      transform: rotate(25deg);
                    "></div>
                  </div>
                </div>
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
          })

          // Popup Content
          const categoriesLabel = nodo.cats && Array.isArray(nodo.cats) ? nodo.cats.join(" · ") : (nodo.cat || "")
          const pendingBadge = isPending 
            ? ` <span style="background: rgba(242, 161, 84, 0.15); color: #f2a154; border: 1px solid rgba(242, 161, 84, 0.3); padding: 1.5px 4px; border-radius: 3px; font-size: 7px; margin-left: 4px; font-family: monospace; font-weight: bold; letter-spacing: 0.05em; display: inline-block; vertical-align: middle;">ESPERANDO CONSENTIMIENTO</span>`
            : ""

          const popupContent = `
            <div style="min-width: 170px;">
              <div class="raiz-popup-cat">${categoriesLabel}${nodo.fuego ? " · fuego sagrado" : ""}${pendingBadge}</div>
              <div class="raiz-popup-title">${nodo.n}</div>
              <div class="raiz-popup-info">${nodo.info}</div>
              <button onclick="window.openCheckout('${nodo.id || 0}', '${nodo.n.replace(/'/g, "\\'")}', '${mainCat}')" class="raiz-popup-book-btn">Reservar Actividad</button>
            </div>
          `

          const marker = L.marker([nodo.lat, nodo.lng], { icon: customIcon })
          marker.bindPopup(popupContent, {
            closeButton: false,
            offset: L.point(0, -8),
            className: "raiz-custom-popup"
          })

          marker.on("click", () => {
            setSelectedNodeId(nodo.id || null)
            marker.openPopup() // Forzar apertura del popup en Leaflet
            mapRef.current.setView([nodo.lat, nodo.lng], 13, { animate: true })
          })

          marker.on("popupclose", () => {
            setSelectedNodeId((prev) => (prev === nodo.id ? null : prev))
          })

          marker.addTo(mapRef.current)
          markersRef.current.push(marker)
          if (nodo.id) {
            markersMapRef.current[nodo.id] = marker
          }
        })

        // Enfocar cámara Leaflet
        if (filtered.length > 0 && selectedCategory !== "Todos") {
          if (filtered.length === 1) {
            mapRef.current.setView([filtered[0].lat, filtered[0].lng], 10, { animate: true })
          } else {
            const group = L.featureGroup(markersRef.current)
            mapRef.current.fitBounds(group.getBounds().pad(0.15), {
              maxZoom: 11,
              animate: true,
              duration: 1.5
            })
          }
        } else if (selectedCategory === "Todos" && userInteracted) {
          // Volver a centrar en Sudamérica/Chile
          mapRef.current.setView([-33.45, -70.62], 4, { animate: true })
        }
      }
    }
  }, [mapMode, mapboxReady, leafletReady, selectedCategory, allNodos, energyMode, lineProgressIndex, mapLoaded])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map Container */}
      <div className="lg:col-span-2 relative w-full h-[520px] rounded-2xl overflow-hidden border border-[rgba(242,233,221,0.12)] shadow-[0_15px_45px_rgba(0,0,0,0.5)]">
        <div ref={mapContainerRef} className="w-full h-full" style={{ background: "#171310" }} />
        
        {mapMode === "loading" && (
          <div className="absolute inset-0 bg-[#171310] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e2622c] mx-auto mb-3"></div>
              <p className="text-[#a89a8d] font-mono-plex text-sm">Encendiendo la red de mapas...</p>
            </div>
          </div>
        )}

        {/* Botón flotante para activar la ruta de energía */}
        {!energyMode && mapMode !== "loading" && (
          <button
            onClick={handleEnterEnergyMode}
            className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#171310]/95 hover:bg-[#e2622c] hover:text-[#171310] text-[#f2a154] border border-[#e2622c]/40 rounded-xl px-4 py-2.5 text-xs font-bold font-mono-plex tracking-wider uppercase transition-all duration-300 shadow-[0_6px_20px_rgba(0,0,0,0.5)] hover:scale-105"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#f2a154] animate-ping" />
            ✨ Activar Ruta de Chakras
          </button>
        )}

        {/* Panel de Narrativa Glassmorphic */}
        {energyMode && (
          <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-md z-10 bg-[rgba(23,19,16,0.92)] border border-[rgba(242,233,221,0.12)] rounded-2xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-500 animate-[fadeIn_0.3s_ease]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono-plex text-[10px] uppercase tracking-wider text-[#f2a154] font-bold">
                {CHAKRAS_ROUTE[currentStep]?.chakraName || "Kundalini de la Tierra"}
              </span>
              <span className="text-[10px] font-mono-plex text-[#a89a8d]">
                {currentStep + 1} / {CHAKRAS_ROUTE.length}
              </span>
            </div>
            
            <h3 className="font-fraunces text-xl font-bold text-white mb-2">
              {CHAKRAS_ROUTE[currentStep]?.name}
            </h3>
            <p className="text-[10px] font-mono-plex text-[#f2a154] mb-3 italic">
              {CHAKRAS_ROUTE[currentStep]?.meaning} · {CHAKRAS_ROUTE[currentStep]?.info}
            </p>
            
            <p className="text-xs text-[#d1c7bd] leading-relaxed mb-5 min-h-[50px]">
              {CHAKRAS_ROUTE[currentStep]?.desc}
            </p>
            
            <div className="flex items-center justify-between gap-4 border-t border-[rgba(242,233,221,0.08)] pt-4">
              <button
                onClick={handleExit}
                className="px-3 py-1.5 rounded-lg border border-[rgba(242,233,221,0.1)] text-[#a89a8d] hover:text-white text-xs transition-colors"
              >
                Salir
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="p-1.5 rounded-lg border border-[rgba(242,233,221,0.1)] text-[#f2e9dd] hover:bg-[rgba(242,233,221,0.05)] disabled:opacity-40 text-xs transition-all"
                >
                  ◀
                </button>
                
                <button
                  onClick={togglePlay}
                  className="px-4 py-1.5 rounded-lg bg-[#e2622c] hover:bg-[#f2a154] text-[#171310] font-bold text-xs transition-all w-24 text-center"
                >
                  {isPlaying ? "Pausar" : "Reproducir"}
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={currentStep === CHAKRAS_ROUTE.length - 1}
                  className="p-1.5 rounded-lg border border-[rgba(242,233,221,0.1)] text-[#f2e9dd] hover:bg-[rgba(242,233,221,0.05)] disabled:opacity-40 text-xs transition-all"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nodes Sidebar Panel */}
      <div className="lg:col-span-1 bg-[#211a15] rounded-2xl border border-[rgba(242,233,221,0.08)] p-5 flex flex-col h-[520px] overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(242,233,221,0.08)]">
          <h3 className="font-fraunces text-base font-bold text-white flex items-center gap-2">
            <span>🗺️</span> Nodos de la Red
          </h3>
          <span className="font-mono-plex text-[10px] uppercase bg-[rgba(242,233,221,0.05)] text-[#a89a8d] px-2.5 py-0.5 rounded-full border border-[rgba(242,233,221,0.05)]">
            {filteredNodos.length} {filteredNodos.length === 1 ? "nodo" : "nodos"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
          {filteredNodos.length === 0 ? (
            <div className="text-center py-12 text-[#a89a8d] text-xs font-mono-plex">
              No hay nodos en esta categoría.
            </div>
          ) : (
            filteredNodos.map((nodo) => {
              const mainCat = nodo.cats && nodo.cats.length > 0 ? nodo.cats[0] : (nodo.cat || "Biodanza")
              const color = colores[mainCat] || "#e2622c"
              const isSelected = selectedNodeId === nodo.id
              const isPending = nodo.pending || nodo.consent_status === "pending_consent"

              return (
                <div
                  key={nodo.id}
                  onClick={() => handleNodeSelect(nodo)}
                  className={`group relative p-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-[rgba(226,98,44,0.06)] border-[#e2622c] shadow-[0_0_12px_rgba(226,98,44,0.12)]"
                      : "bg-[#171310]/60 border-[rgba(242,233,221,0.05)] hover:bg-[#171310]/95 hover:border-[rgba(242,233,221,0.15)]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Category Indicator / Fuego Indicator */}
                    <div className="flex-shrink-0 mt-1 relative flex items-center justify-center">
                      {nodo.fuego ? (
                        <span className="text-sm animate-pulse" title="Fuego Sagrado">🔥</span>
                      ) : (
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: color,
                            boxShadow: `0 0 6px ${color}`
                          }}
                        />
                      )}
                    </div>

                    {/* Node Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1 justify-between">
                        <span className="font-mono-plex text-[9px] uppercase tracking-wider text-[#a89a8d]">
                          {nodo.cats ? nodo.cats.join(" · ") : nodo.cat}
                        </span>
                        {isPending && (
                          <span className="bg-[rgba(242,161,84,0.12)] border border-[rgba(242,161,84,0.25)] text-[#f2a154] text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wide font-mono-plex uppercase shrink-0">
                            Esperando consentimiento
                          </span>
                        )}
                      </div>

                      <h4 className={`font-fraunces text-sm font-semibold transition-colors duration-300 truncate ${
                        isSelected ? "text-[#f2a154]" : "text-white group-hover:text-[#f2a154]"
                      }`}>
                        {nodo.n}
                      </h4>

                      <p className="text-[11px] text-[#a89a8d] mt-1 line-clamp-2 leading-relaxed">
                        {nodo.info}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
