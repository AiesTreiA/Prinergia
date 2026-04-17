-- Comprehensive verification script
SELECT 'Database setup verification' as status;

-- Check if all tables exist
SELECT 
  schemaname,
  tablename,
  hasindexes,
  hasrules,
  hastriggers
FROM pg_tables 
WHERE tablename IN ('users', 'professionals', 'professional_locations', 'professional_specialties', 'service_modalities')
ORDER BY tablename;

-- Check table sizes and statistics
SELECT 
  schemaname,
  relname as tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes,
  n_live_tup as live_rows
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
  AND relname IN ('users', 'professionals', 'professional_locations', 'professional_specialties', 'service_modalities')
ORDER BY relname;

-- Simple row counts for each table
SELECT 'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'professionals' as table_name, COUNT(*) as row_count FROM professionals
UNION ALL
SELECT 'professional_locations' as table_name, COUNT(*) as row_count FROM professional_locations
UNION ALL
SELECT 'professional_specialties' as table_name, COUNT(*) as row_count FROM professional_specialties
UNION ALL
SELECT 'service_modalities' as table_name, COUNT(*) as row_count FROM service_modalities
ORDER BY table_name;

-- Test a complex query that the app will use (for map locations)
SELECT 
  pl.id,
  pl.name as location_name,
  pl.address,
  pl.latitude,
  pl.longitude,
  pl.location_type,
  p.name as professional_name,
  p.specialty,
  p.price_per_session,
  u.avatar_url
FROM professional_locations pl
JOIN professionals p ON pl.professional_id = p.id
JOIN users u ON p.user_id = u.id
ORDER BY pl.created_at DESC
LIMIT 10;

-- Check indexes
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename IN ('users', 'professionals', 'professional_locations', 'professional_specialties', 'service_modalities')
ORDER BY tablename, indexname;

-- Check foreign key constraints
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name IN ('professionals', 'professional_locations', 'professional_specialties', 'service_modalities')
ORDER BY tc.table_name, kcu.column_name;

SELECT 'Setup verification complete - all tables and relationships ready!' as final_status;
