-- Add company details to profiles table
ALTER TABLE profiles
ADD COLUMN headquarters_address TEXT,
ADD COLUMN pickup_address TEXT,
ADD COLUMN siret TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN website TEXT;

-- Add comment to columns
COMMENT ON COLUMN profiles.headquarters_address IS 'Adresse du siège social';
COMMENT ON COLUMN profiles.pickup_address IS 'Adresse de récupération des cartons';
COMMENT ON COLUMN profiles.siret IS 'Numéro SIRET de l''entreprise';
