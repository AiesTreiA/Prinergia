-- Ensure UUID extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create professionals table
CREATE TABLE IF NOT EXISTS professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  bio TEXT,
  experience_years INTEGER,
  price_per_session INTEGER, -- in Chilean pesos
  session_duration INTEGER DEFAULT 50, -- in minutes
  phone TEXT,
  languages TEXT[] DEFAULT ARRAY['Español'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create professional locations table
CREATE TABLE IF NOT EXISTS professional_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- office/center name
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Santiago',
  postal_code TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  location_type TEXT CHECK (location_type IN ('individual', 'group', 'center')) DEFAULT 'individual',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create specialties table
CREATE TABLE IF NOT EXISTS professional_specialties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  specialty_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service modalities table
CREATE TABLE IF NOT EXISTS service_modalities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  modality TEXT CHECK (modality IN ('presencial', 'online', 'domicilio', 'grupos')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_professionals_user_id ON professionals (user_id);
CREATE INDEX IF NOT EXISTS idx_professional_locations_professional_id ON professional_locations (professional_id);
CREATE INDEX IF NOT EXISTS idx_professional_locations_coordinates ON professional_locations (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_professional_specialties_professional_id ON professional_specialties (professional_id);
CREATE INDEX IF NOT EXISTS idx_service_modalities_professional_id ON service_modalities (professional_id);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on professionals
DROP TRIGGER IF EXISTS update_professionals_updated_at ON professionals;
CREATE TRIGGER update_professionals_updated_at 
    BEFORE UPDATE ON professionals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify tables creation
SELECT 'All professional tables created successfully' as status;
SELECT 
  schemaname,
  tablename 
FROM pg_tables 
WHERE tablename IN ('professionals', 'professional_locations', 'professional_specialties', 'service_modalities')
ORDER BY tablename;
