
-- Add images array to cars
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS images TEXT[] NOT NULL DEFAULT '{}';

-- Create public bucket for car images
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public can view car images" ON storage.objects;
CREATE POLICY "Public can view car images"
ON storage.objects FOR SELECT
USING (bucket_id = 'car-images');

DROP POLICY IF EXISTS "Admins can upload car images" ON storage.objects;
CREATE POLICY "Admins can upload car images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'car-images' AND has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update car images" ON storage.objects;
CREATE POLICY "Admins can update car images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'car-images' AND has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete car images" ON storage.objects;
CREATE POLICY "Admins can delete car images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'car-images' AND has_role(auth.uid(), 'admin'::app_role));
