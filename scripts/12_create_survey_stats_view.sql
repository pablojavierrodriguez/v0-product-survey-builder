-- Create a materialized view for survey statistics (optional, for performance)
-- This script creates the survey_stats view that was referenced in the code

-- Drop view if exists
DROP VIEW IF EXISTS public.survey_stats CASCADE;

-- Create view that joins surveys with response counts
CREATE OR REPLACE VIEW public.survey_stats AS
SELECT 
  s.id,
  s.slug,
  s.title,
  s.description,
  s.config,
  s.is_active,
  s.is_published,
  s.created_at,
  s.updated_at,
  COUNT(DISTINCT sr.id) as response_count,
  COUNT(DISTINCT sr.id) FILTER (WHERE sr.created_at >= NOW() - INTERVAL '7 days') as responses_last_7_days,
  COUNT(DISTINCT sr.id) FILTER (WHERE sr.created_at >= NOW() - INTERVAL '30 days') as responses_last_30_days
FROM surveys s
LEFT JOIN survey_responses sr ON sr.survey_id = s.id
GROUP BY s.id, s.slug, s.title, s.description, s.config, s.is_active, s.is_published, s.created_at, s.updated_at;

-- Grant access to authenticated users
GRANT SELECT ON public.survey_stats TO authenticated;
GRANT SELECT ON public.survey_stats TO anon;

-- Add comment
COMMENT ON VIEW public.survey_stats IS 'View providing survey statistics including response counts';
