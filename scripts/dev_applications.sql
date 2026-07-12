CREATE TABLE IF NOT EXISTS dev_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  github_url TEXT,
  portfolio_url TEXT,
  experience TEXT,
  motivation TEXT,
  skills TEXT[],
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dev_applications_email ON dev_applications (email);
CREATE INDEX IF NOT EXISTS idx_dev_applications_status ON dev_applications (status);
