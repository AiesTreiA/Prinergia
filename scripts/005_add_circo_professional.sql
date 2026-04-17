-- Add Circo Wellness professional with the new image

-- Insert user for Circo professional
INSERT INTO users (id, email, name, avatar_url) 
VALUES ('550e8400-e29b-41d4-a716-446655440006', 'circo.wellness@gmail.com', 'Circo Wellness', '/images/circo-wellness.jpg')
ON CONFLICT (email) DO NOTHING;

-- Insert professional
INSERT INTO professionals (id, user_id, name, specialty, bio, experience_years, price_per_session, phone, languages) 
VALUES 
  ('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 'Circo Wellness', 'Espacio de Bienestar Holístico', 'Espacio dedicado al bienestar integral en el corazón del barrio Circo. Ofrecemos terapias, yoga, meditación y actividades corporales en un ambiente tranquilo y acogedor junto al canal.', 7, 55000, '+54 11 4567 8901', ARRAY['Español', 'Inglés'])
ON CONFLICT (id) DO NOTHING;

-- Insert location in Circo area
INSERT INTO professional_locations (professional_id, name, address, city, latitude, longitude, is_primary, location_type) 
VALUES 
  ('660e8400-e29b-41d4-a716-446655440006', 'Centro Circo Wellness', 'Parque Centenario, Barrio Circo, Buenos Aires, Argentina', 'Buenos Aires', -34.60682, -58.44209, true, 'center')
ON CONFLICT (id) DO NOTHING;

-- Insert specialties for Circo professional
INSERT INTO professional_specialties (professional_id, specialty_name) 
VALUES 
  ('660e8400-e29b-41d4-a716-446655440006', 'Yoga Holístico'),
  ('660e8400-e29b-41d4-a716-446655440006', 'Meditación'),
  ('660e8400-e29b-41d4-a716-446655440006', 'Terapia Energética'),
  ('660e8400-e29b-41d4-a716-446655440006', 'Expresión Corporal'),
  ('660e8400-e29b-41d4-a716-446655440006', 'Bienestar Integral')
ON CONFLICT (id) DO NOTHING;

-- Insert service modalities for Circo professional
INSERT INTO service_modalities (professional_id, modality) 
VALUES 
  ('660e8400-e29b-41d4-a716-446655440006', 'presencial'),
  ('660e8400-e29b-41d4-a716-446655440006', 'grupos'),
  ('660e8400-e29b-41d4-a716-446655440006', 'online')
ON CONFLICT (id) DO NOTHING;

-- Verify the new professional was added
SELECT 'Circo Wellness professional added successfully' as status;

SELECT 
  p.name as professional_name,
  p.specialty,
  pl.name as location_name,
  pl.address,
  pl.city,
  p.price_per_session as price
FROM professionals p
LEFT JOIN professional_locations pl ON p.id = pl.professional_id
WHERE p.id = '660e8400-e29b-41d4-a716-446655440006';
