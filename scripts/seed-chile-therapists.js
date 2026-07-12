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
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Faltan credenciales de Supabase en .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const REAL_THERAPISTS = [
  {
    name: "Carola Juárez - Era de Acuario Spa",
    specialty: "Terapias Alternativas, Tarot y Limpieza Energética",
    address: "Antonio Bellet 193, of 1210, Providencia, Chile",
    rating: 4.88,
    price: "$20.000 - $80.000",
    lat: -33.4243,
    lng: -70.6148,
    avatar: "https://img.encuadrado.com/cover_photos/user_6oWcSXzr0c60n1V1NIifX2/img_FdSlmOOoUbrMMkkV.jpg",
    type: "individual"
  },
  {
    name: "Karen Colibrí - Espacio Colibrí",
    specialty: "Medium, Consteladora Familiar y Terapeuta Transgeneracional",
    address: "Balmaceda 319, Batuco, Lampa, Chile",
    rating: 4.93,
    price: "$30.000 - $40.000",
    lat: -33.2201,
    lng: -70.7915,
    avatar: "https://img.encuadrado.com/cover_photos/user_5PNCpba2auK44IMXqhVv5X/img_LW3r3lGBoxOXVVmt.jpg",
    type: "individual"
  },
  {
    name: "Loreto Aravena - Flortuna",
    specialty: "Tarot Evolutivo, Registros Akáshicos y Reiki Tera Mai",
    address: "Neveria 4631, oficina 501, Las Condes, Chile",
    rating: 4.98,
    price: "$25.000 - $50.000",
    lat: -33.4112,
    lng: -70.5756,
    avatar: "https://img.encuadrado.com/cover_photos/user_6mzBiVQFb17zP97FKtbQgo/img_4RCdMdPe1q6EonA2.jpg",
    type: "individual"
  },
  {
    name: "Loram Aguirre - Loram Acupuntura",
    specialty: "Acupuntura Tradicional y Ventosas",
    address: "Álamos 1870, Santiago, Chile",
    rating: 4.79,
    price: "$25.000 - $65.000",
    lat: -33.4735,
    lng: -70.6612,
    avatar: "https://img.encuadrado.com/cover_photos/user_75awu9XO5s1CfHqb4b8dpr/img_4CCInLCtTG57EYWh.jpg",
    type: "individual"
  },
  {
    name: "Alejandra del Río - Canal Energético",
    specialty: "Breathwork (Trabajo de Respiración) y Canalización",
    address: "Laredo 8357, Las Condes, Chile",
    rating: 4.98,
    price: "$40.000 - $75.000",
    lat: -33.4156,
    lng: -70.5521,
    avatar: "https://img.encuadrado.com/cover_photos/user_3Nz7OrNeEAdQlQNLvftHwH/img_1i9QoItu5UQA6evEI.jpg",
    type: "individual"
  },
  {
    name: "Paula León Ancares - Pakua Medicina China",
    specialty: "Acupuntura, Salud Hormonal y Bienestar Emocional",
    address: "El Trovador 4280, oficina 1010, Las Condes, Chile",
    rating: 4.98,
    price: "$40.000 - $152.000",
    lat: -33.4132,
    lng: -70.5982,
    avatar: "https://img.encuadrado.com/cover_photos/user_1erhCKzQGpw7kNMtn7xE62/img_rxPKuj58M3pliaE1.jpg",
    type: "individual"
  },
  {
    name: "Carla Manterola - Ancestrales Chile",
    specialty: "Canalización Espiritual, Mediumnidad y Tarot",
    address: "Providencia 2330, Providencia, Chile",
    rating: 4.94,
    price: "$30.000 - $65.000",
    lat: -33.4231,
    lng: -70.6094,
    avatar: "https://img.encuadrado.com/cover_photos/user_5QaMUwdXszNRdqngQrA7Er/img_mwNGhzW31bxakA3T.png",
    type: "individual"
  },
  // --- Adiciones específicas solicitadas: Yoga, Biodanza y Masajes ---
  {
    name: "Estudio Hatha Yoga & Vinyasa Providencia",
    specialty: "Profesora de Yoga & Meditación",
    address: "Av. Providencia 1208, Providencia, Chile",
    rating: 4.95,
    price: "$12.000 por clase",
    lat: -33.4251,
    lng: -70.6120,
    avatar: "/images/yoga-beach.jpg",
    type: "group"
  },
  {
    name: "Biodanza y Expresión Corporal Providencia",
    specialty: "Facilitador de Biodanza y Movimiento Somático",
    address: "Parque Bustamante, Providencia, Chile",
    rating: 4.89,
    price: "$8.000 por sesión grupal",
    lat: -33.4412,
    lng: -70.6315,
    avatar: "/images/biodanza.jpg",
    type: "group"
  },
  {
    name: "Andrea Paz - Masoterapia Integral",
    specialty: "Masajista Profesional, Drenaje Linfático y Masaje Somático",
    address: "Av. Italia 850, Providencia / Ñuñoa, Chile",
    rating: 4.92,
    price: "$25.000 - $35.000",
    lat: -33.4485,
    lng: -70.6251,
    avatar: "/images/therapy-session.jpg",
    type: "individual"
  },
  {
    name: "Centro de Sonoterapia y Yoga Kundalini",
    specialty: "Profesor de Kundalini Yoga y Viajes de Sonido",
    address: "Av. Francisco Bilbao 2500, Providencia, Chile",
    rating: 4.97,
    price: "$15.000 por taller",
    lat: -33.4389,
    lng: -70.5991,
    avatar: "/images/acro-yoga.jpg",
    type: "center"
  }
];

async function runSeed() {
  console.log("🌱 Iniciando inserción de terapeutas y profesionales en Chile...");
  let successCount = 0;

  // Limpiar ubicaciones existentes si se desea comenzar limpio
  // console.log("🧹 Limpiando tabla map_locations...");
  // await supabase.from('map_locations').delete().neq('name', '');

  for (const therapist of REAL_THERAPISTS) {
    const { data, error } = await supabase.from('map_locations').insert([
      {
        name: therapist.name,
        specialty: therapist.specialty,
        address: therapist.address,
        rating: therapist.rating,
        price: therapist.price,
        lat: therapist.lat,
        lng: therapist.lng,
        avatar: therapist.avatar,
        type: therapist.type,
        consent_status: 'pending_consent'
      }
    ]);

    if (error) {
      console.error(`❌ Error al insertar ${therapist.name}:`, error.message);
    } else {
      console.log(`✅ Insertado: ${therapist.name}`);
      successCount++;
    }
  }

  console.log(`\n🎉 Se completó la carga de datos. ${successCount} profesionales agregados.`);
  process.exit(0);
}

runSeed();
