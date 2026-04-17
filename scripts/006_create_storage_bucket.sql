-- Create the storage bucket for professional documents
BEGIN;

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('professional-documents', 'professional-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Set storage policy to allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'professional-documents'
  );

CREATE POLICY "Allow public read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'professional-documents');

COMMIT;
