-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify the extension is enabled
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';
