DROP POLICY IF EXISTS "Public can view car images" ON storage.objects;
CREATE POLICY "Public can read car image objects"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'car-images' AND (storage.foldername(name))[1] IS NOT NULL);