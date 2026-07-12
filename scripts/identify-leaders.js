/**
 * SCRIPT PARA IDENTIFICAR Y REGISTRAR LÍDERES DE CADA DISCIPLINA
 * -----------------------------------------------------------
 * Este script inserta a los principales referentes y escuelas de cada
 * disciplina en la tabla `map_locations` con estado 'pending_consent' y
 * genera sus respectivos enlaces de consentimiento para invitarlos a unirse.
 * 
 * Uso: node scripts/identify-leaders.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. Cargar variables de entorno
let dbUrl = '';

function loadEnv() {
  const possiblePaths = [
    path.resolve(__dirname, '../.env.local'),
    path.resolve(__dirname, '../../backend/.env'),
    path.resolve(__dirname, '../../../backend/.env')
  ];

  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      console.log(`📖 Cargando variables desde: ${envPath}`);
      const envFile = fs.readFileSync(envPath, 'utf8');
      envFile.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const val = match[2].trim().replace(/^"|"$/g, '');
          process.env[key] = val;
          if (key === 'POSTGRES_URL' || key === 'DATABASE_URL') {
            dbUrl = val;
          }
        }
      });
    }
  }

  // Fallback si no se encontró en los archivos pero está en el sistema
  if (!dbUrl) {
    dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  }
}

loadEnv();

if (!dbUrl) {
  // Usar por defecto el pooler configurado para desarrollo
  dbUrl = "postgresql://postgres.jzojtszetzckdeuvuqvv:PfbVq3dBvX4xPCAy@aws-1-us-east-1.pooler.supabase.com:6543/postgres";
  console.log(`⚠️ No se encontró la URL de conexión en los archivos env, usando fallback de desarrollo.`);
} else {
  console.log(`🔌 URL de base de datos detectada.`);
}

// Enlace base para el consentimiento (NextAuth URL)
const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// 2. Definición de Líderes y Escuelas Emblemáticas por Disciplina
const LEADERS = [
  // --- BIODANZA ---
  {
    name: "Escuela Metropolitana de Biodanza",
    specialty: "Formación de Facilitadores y Biodanza Clínica - Linaje Rolando Toro",
    address: "Ñuñoa, Santiago, Chile",
    lat: -33.4523,
    lng: -70.6122,
    type: "center",
    rating: 4.95,
    price: "Aporte Voluntario / Membresía",
    avatar: "/images/bosque.jpg"
  },
  {
    name: "Pedro Labbé Toro - Escuela Biocéntrica",
    specialty: "Biodanza y Educación Biocéntrica en El Domo",
    address: "El Domo, La Reina, Chile",
    lat: -33.4530,
    lng: -70.5240,
    type: "center",
    rating: 4.98,
    price: "Formaciones y Clases Grupales",
    avatar: "/images/ecobelleza_nature_fair.png"
  },
  {
    name: "Alondra Muñoz - Biodanza Lastarria",
    specialty: "Biodanza y Expresión Corporal Somática",
    address: "Monjitas 350, Barrio Lastarria, Santiago, Chile",
    lat: -33.4368,
    lng: -70.6422,
    type: "individual",
    rating: 4.92,
    price: "$8.000 por clase",
    avatar: "/images/abrazo.jpg"
  },

  // --- YOGA ---
  {
    name: "Gustavo Ponce - GP Balance",
    specialty: "Hatha Yoga & Kundalini - Pionero de Yoga en Chile",
    address: "Vitacura, Santiago, Chile",
    lat: -33.3950,
    lng: -70.5720,
    type: "individual",
    rating: 4.99,
    price: "Retiros y Mentorías",
    avatar: "/images/wanderlust_yoga_park.png"
  },
  {
    name: "Ashtanga Yoga Chile",
    specialty: "Ashtanga Vinyasa Yoga Tradicional - Linaje K. Pattabhi Jois",
    address: "Av. Holanda 230, Providencia, Chile",
    lat: -33.4215,
    lng: -70.6010,
    type: "center",
    rating: 4.96,
    price: "$45.000 mensual",
    avatar: "/images/yoga_sound_bath.png"
  },

  // --- ASTROLOGÍA ---
  {
    name: "Pedro Engel",
    specialty: "Astrología Ancestral, Tarot y Sabiduría de la Tierra",
    address: "La Reina, Santiago, Chile",
    lat: -33.4410,
    lng: -70.5350,
    type: "individual",
    rating: 4.97,
    price: "Consultas y Cursos",
    avatar: "/images/ancestral_network.jpg"
  },
  {
    name: "Pablo Flores - Astroterapia",
    specialty: "Astrología Psicológica y Evolutiva",
    address: "Av. Providencia 2130, Providencia, Chile",
    lat: -33.4225,
    lng: -70.6080,
    type: "center",
    rating: 4.94,
    price: "Escuela de Formación Online/Presencial",
    avatar: "/images/mycelium_matrix.jpg"
  },

  // --- TEMAZCAL ---
  {
    name: "Temazcal Raíces de la Tierra (Heriberto Villaseñor)",
    specialty: "Cabaña de Sudar Ceremonial - Fuego Sagrado de la Red Kiva",
    address: "Ñuñoa, Santiago, Chile",
    lat: -33.4667,
    lng: -70.6018,
    type: "group",
    rating: 4.97,
    price: "$15.000 por ceremonia",
    avatar: "/images/kiva_chile_2026.jpg"
  },
  {
    name: "Temazcal del Arrayán",
    specialty: "Cabaña de Sudar y Medicina Ancestral del Fuego",
    address: "Camino El Arrayán, Lo Barnechea, Chile",
    lat: -33.3550,
    lng: -70.4780,
    type: "center",
    rating: 4.88,
    price: "$20.000 por ceremonia",
    avatar: "/images/temazcal.png"
  },

  // --- REIKI ---
  {
    name: "Asociación Chilena de Reiki",
    specialty: "Reiki Usui Tradicional y Sanación Energética",
    address: "Providencia, Santiago, Chile",
    lat: -33.4310,
    lng: -70.6150,
    type: "center",
    rating: 4.91,
    price: "Cursos y Terapias",
    avatar: "/images/network_puzzle.jpg"
  },

  // --- SONOTERAPIA ---
  {
    name: "Gong Bath - Templo de Sonidos",
    specialty: "Sonoterapia, Viajes de Sonido y Baños de Gong",
    address: "Las Condes, Santiago, Chile",
    lat: -33.4420,
    lng: -70.5980,
    type: "center",
    rating: 4.97,
    price: "$18.000 sesión grupal",
    avatar: "/images/yoga_sound_bath.png"
  },
  {
    name: "Centro de Sonoterapia Chile",
    specialty: "Sonoterapia y Cuencos Tibetanos de Sanación",
    address: "Ñuñoa, Santiago, Chile",
    lat: -33.4590,
    lng: -70.6090,
    type: "center",
    rating: 4.90,
    price: "Terapia Individual / Cursos",
    avatar: "/images/sovereign_canopy.png"
  },

  // --- COACHING ---
  {
    name: "Julio Olalla - Newfield Network",
    specialty: "Coaching Ontológico y Aprendizaje Transformacional",
    address: "Las Condes, Santiago, Chile",
    lat: -33.4157,
    lng: -70.6025,
    type: "center",
    rating: 4.98,
    price: "Formación de Coaches",
    avatar: "/images/network_roots.png"
  },
  {
    name: "Rafael Echeverría - Newfield Consulting",
    specialty: "Ontología del Lenguaje y Coaching Ontológico",
    address: "Providencia, Santiago, Chile",
    lat: -33.4280,
    lng: -70.6040,
    type: "center",
    rating: 4.97,
    price: "Formaciones y Programas Senior",
    avatar: "/images/spirit_bison.jpg"
  }
];

// Helper para ejecutar comandos SQL usando psql
function queryDB(sql) {
  try {
    // Escapar comillas dobles y caracteres especiales de shell
    const escapedSql = sql.replace(/"/g, '\\"').replace(/\n/g, ' ');
    const cmd = `psql "${dbUrl}" -t -A -c "${escapedSql}"`;
    const output = execSync(cmd, { encoding: 'utf8' }).trim();
    return output;
  } catch (err) {
    console.error(`❌ Error ejecutando SQL: ${err.message}`);
    return null;
  }
}

async function seedLeaders() {
  console.log("🌱 Iniciando identificación y registro de líderes por disciplina...");
  console.log("-----------------------------------------------------------------");
  
  const results = [];

  for (const leader of LEADERS) {
    // Escapar strings para SQL
    const safeName = leader.name.replace(/'/g, "''");
    const safeSpecialty = leader.specialty.replace(/'/g, "''");
    const safeAddress = leader.address.replace(/'/g, "''");
    const safePrice = leader.price.replace(/'/g, "''");
    const safeAvatar = leader.avatar.replace(/'/g, "''");

    // 1. Verificar si ya existe en la base de datos
    const checkSql = `SELECT id, consent_status FROM public.map_locations WHERE name = '${safeName}';`;
    const checkResult = queryDB(checkSql);
    
    let id = '';
    let consentStatus = 'pending_consent';

    if (checkResult) {
      const parts = checkResult.split('|');
      id = parts[0];
      consentStatus = parts[1] || 'pending_consent';
      console.log(`🔄 Encontrado: "${leader.name}" ya está registrado (ID: ${id}, Estado: ${consentStatus})`);
    } else {
      // 2. Insertar nuevo líder
      const insertSql = `
        INSERT INTO public.map_locations (
          name, specialty, address, rating, price, lat, lng, avatar, type, consent_status
        ) VALUES (
          '${safeName}', '${safeSpecialty}', '${safeAddress}', ${leader.rating}, '${safePrice}', 
          ${leader.lat}, ${leader.lng}, '${safeAvatar}', '${leader.type}', 'pending_consent'
        ) RETURNING id;
      `.trim();
      
      const insertResult = queryDB(insertSql);
      if (insertResult) {
        id = insertResult.trim();
        console.log(`✅ Registrado nuevo líder: "${leader.name}" -> ID: ${id}`);
      } else {
        console.error(`❌ Error al registrar a: "${leader.name}"`);
        continue;
      }
    }

    results.push({
      name: leader.name,
      specialty: leader.specialty,
      id: id,
      consentStatus: consentStatus,
      consentUrl: `${baseUrl}/consent?id=${id}`
    });
  }

  // Imprimir reporte final de enlaces de consentimiento
  console.log("\n=================================================================");
  console.log("📋 REPORTE DE ENLACES DE CONSENTIMIENTO GENERADOS");
  console.log("=================================================================\n");

  results.forEach((res, i) => {
    console.log(`${i + 1}. 🌟 LÍDER: ${res.name}`);
    console.log(`   Discipina/Especialidad: ${res.specialty}`);
    console.log(`   Estado actual: [${res.consentStatus}]`);
    console.log(`   Enlace de consentimiento:`);
    console.log(`   👉 ${res.consentUrl}`);
    console.log("-----------------------------------------------------------------");
  });

  // Escribir el reporte en un archivo markdown en el directorio de artefactos para acceso rápido
  const reportPath = path.resolve(__dirname, '../../../../.gemini/antigravity/brain/0e1e2134-02ea-4872-9bd4-1ca48772e1b9/leaders_consent_report.md');
  let mdContent = `# Enlaces de Consentimiento de Líderes de Disciplina\n\n`;
  mdContent += `Este reporte contiene la lista de líderes y escuelas de bienestar identificados y sus respectivos enlaces de consentimiento para el lanzamiento de la plataforma.\n\n`;
  mdContent += `| # | Líder / Espacio | Disciplina / Especialidad | Estado | Enlace Único de Consentimiento |\n`;
  mdContent += `|---|---|---|---|---|\n`;
  
  results.forEach((res, i) => {
    mdContent += `| ${i+1} | **${res.name}** | ${res.specialty} | \`${res.consentStatus}\` | [Acceder a Consentimiento](${res.consentUrl}) |\n`;
  });
  
  mdContent += `\n\n> [!TIP]\n> Envía estos enlaces directamente a cada líder para que visualicen su espacio pre-mapeado, aprueben su participación y lo compartan con sus comunidades.`;
  
  try {
    fs.writeFileSync(reportPath, mdContent, 'utf8');
    console.log(`\n🎉 Reporte guardado en archivo markdown en: ${reportPath}`);
  } catch (err) {
    console.log(`\n⚠️ No se pudo escribir el reporte markdown en ${reportPath}: ${err.message}`);
  }
}

seedLeaders();
