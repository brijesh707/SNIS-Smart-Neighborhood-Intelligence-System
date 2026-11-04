/*
# Create survey_responses table (single-tenant, no auth)

1. New Tables
- `survey_responses`
  - `id` (uuid, primary key)
  - `neighbourhood_id` (text, not null) - which neighbourhood was rated
  - `neighbourhood_name` (text, not null) - denormalized name for display
  - `safety_rating` (int, 1-5) - user's safety rating
  - `amenities_rating` (int, 1-5) - user's amenities rating
  - `transport_rating` (int, 1-5) - user's transport rating
  - `overall_rating` (int, 1-5) - user's overall rating
  - `would_live` (boolean) - would the user live here
  - `comment` (text, optional) - free text comment
  - `created_at` (timestamptz, default now)

2. Security
- Enable RLS on `survey_responses`.
- Allow anon + authenticated CRUD because this is a public survey (no sign-in).
*/

CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  neighbourhood_id text NOT NULL,
  neighbourhood_name text NOT NULL,
  safety_rating int NOT NULL CHECK (safety_rating >= 1 AND safety_rating <= 5),
  amenities_rating int NOT NULL CHECK (amenities_rating >= 1 AND amenities_rating <= 5),
  transport_rating int NOT NULL CHECK (transport_rating >= 1 AND transport_rating <= 5),
  overall_rating int NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  would_live boolean NOT NULL DEFAULT false,
  comment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_survey" ON survey_responses;
CREATE POLICY "anon_select_survey" ON survey_responses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_survey" ON survey_responses;
CREATE POLICY "anon_insert_survey" ON survey_responses FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_survey" ON survey_responses;
CREATE POLICY "anon_update_survey" ON survey_responses FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_survey" ON survey_responses;
CREATE POLICY "anon_delete_survey" ON survey_responses FOR DELETE
  TO anon, authenticated USING (true);
