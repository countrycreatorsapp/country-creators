-- Supabase Storage Bucket Setup
-- 1. Create a public bucket for flags
INSERT INTO storage.buckets (id, name, public) VALUES ('flags', 'flags', true);

-- 2. Allow any authenticated or anonymous user to view the flags
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'flags' );

-- 3. Allow anonymous students to upload their flag
CREATE POLICY "Anon Insert" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'flags' );

-- 4. Allow anonymous students to update their flag
CREATE POLICY "Anon Update" 
ON storage.objects FOR UPDATE 
WITH CHECK ( bucket_id = 'flags' );
