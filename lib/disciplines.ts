// Diccionario de Sinónimos para Estandarización de Disciplinas de Bienestar
export const SYNONYM_MAP: Record<string, string> = {
  // Astrología
  "astrologia": "Astrología",
  "astrología": "Astrología",
  "carta natal": "Astrología",
  "carta astral": "Astrología",
  "astrologo": "Astrología",
  "astrólogo": "Astrología",
  "astrologa": "Astrología",
  "astróloga": "Astrología",
  "revolucion solar": "Astrología",
  "revolución solar": "Astrología",
  "astrology": "Astrología",
  "natal chart": "Astrología",
  
  // Biodanza
  "biodanza": "Biodanza",
  "sistema rolando toro": "Biodanza",
  "biodanza rolando toro": "Biodanza",
  "biodanza de rolando toro": "Biodanza",
  "danza de la vida": "Biodanza",
  
  // Yoga
  "yoga": "Yoga",
  "hatha": "Yoga",
  "hatha yoga": "Yoga",
  "vinyasa": "Yoga",
  "vinyasa yoga": "Yoga",
  "ashtanga": "Yoga",
  "ashtanga yoga": "Yoga",
  "kundalini": "Yoga",
  "kundalini yoga": "Yoga",
  "iyengar": "Yoga",
  "iyengar yoga": "Yoga",
  "yin yoga": "Yoga",
  "power yoga": "Yoga",
  "bikram": "Yoga",
  "bikram yoga": "Yoga",
  
  // Temazcal
  "temazcal": "Temazcal",
  "inipi": "Temazcal",
  "baño de vapor": "Temazcal",
  "temazcal ceremonial": "Temazcal",
  "fuego de temazcal": "Temazcal",
  
  // Reiki
  "reiki": "Reiki",
  "reiki usui": "Reiki",
  "reiki karuna": "Reiki",
  "sanacion pranica": "Reiki",
  "sanación pránica": "Reiki",
  "sanacion energetica": "Reiki",
  "sanación energética": "Reiki",
  
  // Sonoterapia
  "sonoterapia": "Sonoterapia",
  "terapia de sonido": "Sonoterapia",
  "gong bath": "Sonoterapia",
  "baño de gong": "Sonoterapia",
  "baños de gong": "Sonoterapia",
  "cuencos de cuarzo": "Sonoterapia",
  "cuencos": "Sonoterapia",
  "cuencos tibetanos": "Sonoterapia",
  "sound therapy": "Sonoterapia",
  "sound healing": "Sonoterapia",
  
  // Coaching
  "coaching": "Coaching",
  "coaching ontologico": "Coaching",
  "coaching ontológico": "Coaching",
  "coaching espiritual": "Coaching",
  "coaching de vida": "Coaching",
  "life coaching": "Coaching",
  "coach": "Coaching"
};

/**
 * Normaliza y estandariza una disciplina ingresada por el usuario.
 * Si encuentra un sinónimo en el mapa, devuelve la categoría estandarizada.
 * De lo contrario, limpia y capitaliza la primera letra de cada palabra.
 */
export function standardizeDiscipline(discipline: string): string {
  const clean = discipline.trim();
  if (!clean) return "";

  const normalized = clean.toLowerCase()
    // Remover acentos básicos para búsquedas más flexibles si no coincide directamente
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  
  // 1. Coincidencia directa en el mapa
  const lowerKeys = Object.keys(SYNONYM_MAP);
  
  // Buscar coincidencia exacta (removiendo diacríticos de la clave también para comparar)
  for (const key of lowerKeys) {
    const keyNormalized = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (normalized === keyNormalized) {
      return SYNONYM_MAP[key];
    }
  }

  // 2. Coincidencia parcial (p. ej., si escriben "taller de yoga vinyasa", detecta "yoga")
  for (const key of lowerKeys) {
    const keyNormalized = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Evitar coincidencias parciales absurdas de palabras muy cortas
    if (keyNormalized.length > 3 && normalized.includes(keyNormalized)) {
      return SYNONYM_MAP[key];
    }
  }

  // 3. Si no coincide con ninguna conocida, formatear con mayúsculas iniciales
  return clean
    .split(/\s+/)
    .map(word => {
      if (!word) return "";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .filter(Boolean)
    .join(" ");
}
