/**
 * SCRIPT PARA POBLAR AUTOMÁTICAMENTE EL MAPA DE SANTIAGO DE CHILE
 * -------------------------------------------------------------
 * Uso: 
 * 1. Asegúrate de tener tu clave de API en .env.local bajo GOOGLE_PLACES_API_KEY
 * 2. Corre en consola: node scripts/seed-places.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno manualmente (puedes usar dotenv si lo instalaste)
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) process.env[match[1]] = match[2].trim().replace(/^"|"$/g, '');
    });
  } catch (err) {
    console.log('No se encontró archivo .env.local, usando variables globales.');
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Faltan credenciales de Supabase en .env.local");
  process.exit(1);
}

if (!googleApiKey) {
  console.error("❌ Falta GOOGLE_PLACES_API_KEY en .env.local");
  console.log("👉 Debes crear una en https://console.cloud.google.com/ e incluirla en el archivo .env.local");
  // process.exit(1); // Descomentar para forzar existencia
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Lista de búsquedas inteligentes para Masa Crítica
const SEARCH_QUERIES = [
  { keyword: "centro de yoga santiago chile", type: "center", specialty: "Centro Holístico y Yoga" },
  { keyword: "biodanza santiago chile", type: "group", specialty: "Facilitación Biodanza" },
  { keyword: "psicologia clinica santiago chile", type: "individual", specialty: "Terapia y Psicología" },
  { keyword: "coaching ontologico santiago chile", type: "individual", specialty: "Coaching de Vida" }
];

async function seedPlaces() {
  console.log('🌱 Iniciando Scrapper Semilla de Puntos de Interés...');
  let totalAdded = 0;

  for (const q of SEARCH_QUERIES) {
    console.log(`\n🔍 Buscando: "${q.keyword}"...`);
    
    // Si no hay API KEY, agregamos datos de prueba estáticos simulando la API de Google
    let results = [];

    if (!googleApiKey) {
      console.log('⚠️ Modo Demo: Insertando data simulada porque no hay API Key de Google detectada.');
      results = [
        {
          name: "Centro " + q.keyword.split(" ")[0] + " Las Condes",
          formatted_address: "Av. Apoquindo 1234, Las Condes, Región Metropolitana",
          geometry: { location: { lat: -33.414 + Math.random()*0.02, lng: -70.584 - Math.random()*0.02 } },
          rating: 4.8 + Math.random()*0.2,
        },
        {
          name: "Espacio de " + q.specialty + " Providencia",
          formatted_address: "Av. Providencia 900, Providencia, Región Metropolitana",
          geometry: { location: { lat: -33.428 + (Math.random()*0.01), lng: -70.615 - (Math.random()*0.01) } },
          rating: 4.5 + Math.random()*0.4,
        }
      ];
    } else {
      // Búsqueda real en Google Places API TextSearch
      const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q.keyword)}&key=${googleApiKey}`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.status === 'OK') {
          results = data.results.slice(0, 5); // Insertamos solo los primeros 5 por búsqueda para evitar spam
        } else {
          console.error("❌ Error de Google API:", data.status);
        }
      } catch (err) {
        console.error("❌ Error conectando a Google Places:", err.message);
      }
    }

    // Insertar en Supabase
    for (const place of results) {
      const locationData = {
        name: place.name,
        specialty: q.specialty,
        address: place.formatted_address || "Sin dirección",
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        rating: place.rating || 5.0,
        price: "$40.000 (Aprox)",
        avatar: "/placeholder.svg",
        type: q.type,
        consent_status: "pending_consent"
      };

      // Inserción en Supabase
      const { data, error } = await supabase.from('map_locations').insert([locationData]);
      
      if (error) {
        console.error(`  - ⚠️ Error agregando ${place.name}: ${error.message}`);
      } else {
        console.log(`  - ✅ Se agregó exitosamente: ${place.name}`);
        totalAdded++;
      }
    }
  }

  console.log(`\n🎉 Proceso finalizado. Se agregaron ${totalAdded} lugares al mapa.`);
}

seedPlaces();
