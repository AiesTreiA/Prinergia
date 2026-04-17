-- Enable UUID extension first
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Insert demo user if not exists
INSERT INTO users (email, name, avatar_url) VALUES 
  ('demo@prinergia.com', 'Usuario Demo', '/images/therapy-session.jpg')
ON CONFLICT (email) DO NOTHING;

-- Verify table creation
SELECT 'users table created successfully' as status;
SELECT COUNT(*) as user_count FROM users;
