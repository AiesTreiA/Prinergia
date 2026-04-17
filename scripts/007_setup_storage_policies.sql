-- Enable storage for professional documents bucket
-- This script sets up the storage bucket and policies for file uploads

-- Storage policies for professional-documents bucket
-- Allow authenticated users to upload their own files
-- Allow public read access for uploaded files

BEGIN;

-- Note: The bucket should be created from the Supabase dashboard
-- Go to: Storage > Create new bucket > professional-documents (Public)

-- Policy: Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'professional-documents' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow public read access to all files
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'professional-documents');

-- Policy: Allow users to delete their own files
CREATE POLICY "Allow users to delete their own files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'professional-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

COMMIT;
