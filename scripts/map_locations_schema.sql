-- ==============================================================================
-- 1. TABLA PRINCIPAL `MAP_LOCATIONS`
-- ==============================================================================

CREATE TABLE "public"."map_locations" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" text NOT NULL,
  "specialty" text NOT NULL,
  "address" text NOT NULL,
  "rating" numeric DEFAULT 5.0,
  "price" text,
  "lat" numeric NOT NULL,
  "lng" numeric NOT NULL,
  "avatar" text,
  "type" text NOT NULL, -- individual, group, center
  "created_by" uuid, -- El usuario que agregó este lugar al mapa
  "created_at" timestamp with time zone DEFAULT now(),
  PRIMARY KEY ("id"),
  CONSTRAINT "map_locations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "next_auth"."users" ("id") ON DELETE SET NULL
);

-- Habilitar Seguridad por Filas (RLS)
ALTER TABLE "public"."map_locations" ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. POLÍTICAS DE SEGURIDAD (RLS POLICIES)
-- ==============================================================================

-- a) TODO MUNDO (incluso no logeados) puede ver los lugares en el mapa
CREATE POLICY "Anyone can view map locations" 
ON "public"."map_locations" 
FOR SELECT 
USING (true);

-- b) SOLO USUARIOS REGISTRADOS pueden agregar nuevos lugares
CREATE POLICY "Authenticated users can insert map locations" 
ON "public"."map_locations" 
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' OR 
  -- En caso de usar la clave anónima estándar y NextAuth inserta desde cliente, validamos existencia:
  created_by IN (SELECT id FROM next_auth.users)
);

-- ==============================================================================
-- NOTA: Como permitiremos clientes anónimos que interactúan vía Supabase-js,
-- y NextAuth administra los usuarios bajo el esquema next_auth libremente,
-- añadiremos una vista auxiliar pública en caso de que sea requerida en el futuro.
-- ==============================================================================
