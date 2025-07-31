-- Add new image columns to site_settings table
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS hero_image TEXT,
ADD COLUMN IF NOT EXISTS about_image TEXT,
ADD COLUMN IF NOT EXISTS contact_image TEXT;