const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Faltan credenciales de Supabase en .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listLocations() {
  const { data, error } = await supabase
    .from('map_locations')
    .select('id, name, specialty, consent_status');
  
  if (error) {
    console.error("❌ Error al obtener ubicaciones:", error.message);
  } else {
    console.log(`\n📍 Encontradas ${data.length} ubicaciones en Supabase:`);
    data.forEach((loc, index) => {
      console.log(`${index + 1}. [${loc.consent_status}] ${loc.name} - ${loc.specialty} (ID: ${loc.id})`);
    });
  }
  process.exit(0);
}

listLocations();
