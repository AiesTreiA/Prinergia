-- Insert sample users (only if they don't exist)
INSERT INTO users (id, email, name, avatar_url) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'javier.mujica@biodanza.cl', 'Javier Mujica', '/images/biodanza.jpg'),
  ('550e8400-e29b-41d4-a716-446655440002', 'dharma@yoga.cl', 'Dharma Yoga Centro', '/images/sound-therapy.jpg'),
  ('550e8400-e29b-41d4-a716-446655440003', 'domo@lareina.cl', 'Domo La Reina', '/images/acro-yoga.jpg'),
  ('550e8400-e29b-41d4-a716-446655440004', 'casa@allegra.cl', 'Casa Allegra', '/images/yoga-beach.jpg'),
  ('550e8400-e29b-41d4-a716-446655440005', 'ale.ortiz@coaching.cl', 'Alejandra Ortiz', '/images/ale_avatar.jpg')
ON CONFLICT (email) DO NOTHING;

-- Insert professionals
INSERT INTO professionals (id, user_id, name, specialty, bio, experience_years, price_per_session, phone, languages) VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Javier Mujica', 'Facilitador de Biodanza', 'Facilitador certificado de Biodanza con más de 8 años de experiencia. Especializado en grupos de adultos y procesos de autoconocimiento.', 8, 35000, '+56 9 8765 4321', ARRAY['Español']),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Dharma Yoga', 'Centro de Yoga Iyengar', 'Centro especializado en Yoga Iyengar con instructores certificados. Ofrecemos clases para todos los niveles en un ambiente tranquilo y acogedor.', 12, 60000, '+56 2 2234 5678', ARRAY['Español', 'Inglés']),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Domo La Reina', 'Biodanza y Arcilla', 'Espacio dedicado a la Biodanza y terapias con arcilla. Facilitamos procesos de sanación y autoconocimiento a través del movimiento y la creatividad.', 10, 75000, '+56 9 7654 3210', ARRAY['Español']),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Estudio Casa Allegra', 'Clases de Yoga y Pilates', 'Estudio boutique especializado en Yoga y Pilates. Clases personalizadas y grupales en un ambiente íntimo y profesional.', 6, 45000, '+56 2 2345 6789', ARRAY['Español', 'Inglés']),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Alejandra Ortiz', 'Coach de Vida', 'Coach certificada especializada en desarrollo personal y profesional. Acompaño procesos de cambio y crecimiento personal.', 5, 50000, '+56 9 5432 1098', ARRAY['Español', 'Inglés'])
ON CONFLICT (id) DO NOTHING;

-- Insert locations
INSERT INTO professional_locations (professional_id, name, address, city, latitude, longitude, is_primary, location_type) VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', 'Espacio Biodanza La Reina', 'Alcalde Fernando Castillo Velasco 7379, La Reina, Santiago, Chile', 'Santiago', -33.451265937139524, -70.55162381831155, true, 'group'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Centro Dharma Yoga', 'Diego de Almagro 3223, Ñuñoa, Santiago, Chile', 'Santiago', -33.43506812024132, -70.58510818762582, true, 'center'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Domo La Reina', 'Av. Alcalde Fernando Castillo Velasco 10550, La Reina, Santiago, Chile', 'Santiago', -33.452793140607056, -70.52408616063985, true, 'center'),
  ('660e8400-e29b-41d4-a716-446655440004', 'Estudio Casa Allegra', 'Suecia 1650, Dpto 103, Providencia, Santiago, Chile', 'Santiago', -33.43536788716499, -70.60249843180485, true, 'center'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Consulta Alejandra Ortiz', 'Costa de Montemar, Concon, V Región, Chile', 'Concón', -32.934123590154584, -71.54719752304305, true, 'individual')
ON CONFLICT (id) DO NOTHING;

-- Insert specialties
INSERT INTO professional_specialties (professional_id, specialty_name) VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', 'Biodanza'),
  ('660e8400-e29b-41d4-a716-446655440001', 'Expresión Corporal'),
  ('660e8400-e29b-41d4-a716-446655440001', 'Autoestima'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Yoga Iyengar'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Hatha Yoga'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Meditación'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Biodanza'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Terapia con Arcilla'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Grupos'),
  ('660e8400-e29b-41d4-a716-446655440004', 'Yoga'),
  ('660e8400-e29b-41d4-a716-446655440004', 'Pilates'),
  ('660e8400-e29b-41d4-a716-446655440004', 'Principiantes'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Coaching de Vida'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Desarrollo Personal'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Liderazgo')
ON CONFLICT (id) DO NOTHING;

-- Insert service modalities
INSERT INTO service_modalities (professional_id, modality) VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', 'presencial'),
  ('660e8400-e29b-41d4-a716-446655440001', 'grupos'),
  ('660e8400-e29b-41d4-a716-446655440002', 'presencial'),
  ('660e8400-e29b-41d4-a716-446655440002', 'grupos'),
  ('660e8400-e29b-41d4-a716-446655440003', 'presencial'),
  ('660e8400-e29b-41d4-a716-446655440003', 'grupos'),
  ('660e8400-e29b-41d4-a716-446655440004', 'presencial'),
  ('660e8400-e29b-41d4-a716-446655440004', 'grupos'),
  ('660e8400-e29b-41d4-a716-446655440005', 'presencial'),
  ('660e8400-e29b-41d4-a716-446655440005', 'online')
ON CONFLICT (id) DO NOTHING;

-- Verify data insertion
SELECT 'Sample data inserted successfully' as status;

SELECT 
  'users' as table_name, 
  COUNT(*) as record_count 
FROM users
UNION ALL
SELECT 
  'professionals' as table_name, 
  COUNT(*) as record_count 
FROM professionals
UNION ALL
SELECT 
  'professional_locations' as table_name, 
  COUNT(*) as record_count 
FROM professional_locations
UNION ALL
SELECT 
  'professional_specialties' as table_name, 
  COUNT(*) as record_count 
FROM professional_specialties
UNION ALL
SELECT 
  'service_modalities' as table_name, 
  COUNT(*) as record_count 
FROM service_modalities
ORDER BY table_name;

-- Test query to verify relationships work
SELECT 
  p.name as professional_name,
  p.specialty,
  pl.name as location_name,
  pl.address,
  pl.city,
  COUNT(ps.specialty_name) as specialty_count
FROM professionals p
LEFT JOIN professional_locations pl ON p.id = pl.professional_id
LEFT JOIN professional_specialties ps ON p.id = ps.professional_id
GROUP BY p.id, p.name, p.specialty, pl.name, pl.address, pl.city
ORDER BY p.name;
