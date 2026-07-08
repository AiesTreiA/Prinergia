# Red Raíz — Ecosistema Digital de Linajes & Saberes

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/prinergia-2685s-projects/v0-prinergia-platform-design)

Red Raíz (también conocido en su desarrollo como Prinergia) es una plataforma web soberana diseñada para tejer, mapear y conectar de manera horizontal a facilitadores de terapias holísticas, ceremonias ancestrales y medicinas de la tierra. 

Este repositorio contiene la interfaz viva, el mapa de geolocalización consentida y el portal de gobernanza descentralizada del proyecto.

---

## 🌟 Visión & Manifiesto

Red Raíz trasciende a las corporaciones monopolísticas del software tradicional (Meta, Google, AWS) a través de un modelo de co-propiedad y transparencia digital:

*   **Gobernanza Horizontal:** El código y la plataforma pertenecen al común. Las reglas de convivencia y mapeo se definen democráticamente por los nodos activos.
*   **Custodia Consentida:** Los facilitadores son dueños absolutos de su información. El derecho al olvido y la edición está garantizado por diseño.
*   **Sostenibilidad Colectiva:** Los aportes de membresías solidarias se administran de manera directa para cubrir los costos de servidores, hosting y campañas de difusión comunitaria.

---

## 🛠️ Arquitectura de Confianza (Didáctica Técnica)

El software ha sido diseñado con tecnologías modernas estructuradas para garantizar el control de datos y la privacidad del territorio:

### 🏠 El Motor: Next.js & React (App Router)
*   **Didáctica:** Next.js pre-construye las páginas en el servidor en lugar de delegar el trabajo al navegador del celular.
*   **Confianza:** El sitio carga de forma ultra-rápida, ahorrando batería y datos móviles en zonas rurales o de naturaleza. No inyecta scripts espías de rastreo comercial.

### 🔑 La Llave: NextAuth.js
*   **Didáctica:** Gestiona sesiones seguras de usuario conectando con proveedores de confianza (OAuth de Google) o mediante enlaces mágicos enviados por correo.
*   **Confianza:** **Red Raíz nunca almacena ni conoce tu contraseña.** Si nuestra base de datos sufriera un incidente de seguridad, tus accesos personales siguen estando 100% seguros ya que no gestionamos credenciales.

### 🛡️ El Cofre: Supabase (PostgreSQL) con Row-Level Security (RLS)
*   **Didáctica:** Las políticas RLS actúan como un candado físico o control biométrico en cada celda del archivo.
*   **Confianza:** La base de datos verifica físicamente en cada consulta que solo el creador autorizado del perfil tenga permiso para modificar sus datos. Es imposible alterar información ajena, incluso si existe un error de programación en la capa visual.

### 🗺️ El Mapeo: Leaflet & Mapbox (Privacidad del Territorio)
*   **Didáctica:** Visualización de nodos en el territorio utilizando puntos de encuentro aproximados y direcciones públicas consentidas.
*   **Confianza:** **No recopilamos ni rastreamos coordenadas GPS en tiempo real.** Mapeamos las redes de sanidad y contención comunitaria respetando el anonimato de tu hogar.

---

## 📂 Estructura del Proyecto

```bash
├── app/                  # Rutas y páginas de Next.js (App Router)
│   ├── api/              # Rutas de API seguras (Consenso, Consentimiento, Auth)
│   ├── auth/             # Páginas de inicio de sesión personalizadas
│   ├── booking/          # Simulación de reservas P2P
│   ├── dev/              # Portal de Desarrolladores y postulación de equipo
│   ├── map/              # Visualizador del Mapa Vivo de Nodos
│   └── page.tsx          # Página principal y Manifiesto interactivo
├── components/           # Componentes reutilizables de React
│   ├── auth/             # Botones y proveedores de NextAuth
│   ├── map/              # Modales de localización y renderizado de mapas
│   └── ui/               # Componentes atómicos (shadcn/ui customizados)
├── lib/                  # Librerías y configuraciones del sistema
│   ├── auth-config.ts    # Configuración de NextAuth.js
│   ├── supabase.ts       # Cliente y conexión de Supabase
│   └── email.ts          # Plantillas de email SMTP
└── public/               # Recursos de imagen HD (sacred network y sovereign canopy)
```

---

## 🚀 Inicio Rápido (Desarrollo Local)

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/AiesTreiA/Prinergia.git
cd Prinergia
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto. Puedes guiarte del siguiente esquema:

```env
# Next Auth Config
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secreto_hexadecimal

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Google OAuth (Acceso seguro sin contraseñas)
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
GOOGLE_PLACES_API_KEY=tu-google-places-key

# Email SMTP
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=tu-smtp-password
EMAIL_FROM=Red Raíz <hola@tusitio.com>

# Mapbox Token
MAPBOX_ACCESS_TOKEN=tu-mapbox-token
```

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 4. Compilar para producción
```bash
npm run build
```

---

## 🤝 Contribuciones y Desarrollo Soberano

Red Raíz es un proyecto libre. Si deseas sumarte al equipo de desarrollo:
1. Accede a la ruta `/dev` en la aplicación local o web.
2. Completa la postulación de desarrollo.
3. Revisa nuestras discusiones sobre descentralización financiera y consenso distribuido.

*Mantenido colectivamente por la comunidad de Red Raíz.*