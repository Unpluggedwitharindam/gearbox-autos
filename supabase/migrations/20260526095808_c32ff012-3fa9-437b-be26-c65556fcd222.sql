DROP POLICY IF EXISTS "Public can read car image objects" ON storage.objects;
CREATE POLICY "Authenticated can list car images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'car-images');