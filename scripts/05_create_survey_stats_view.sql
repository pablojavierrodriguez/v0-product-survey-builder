-- Create a view for survey statistics
CREATE OR REPLACE VIEW survey_stats AS
SELECT 
    s.id,
    s.slug,
    s.title,
    s.description,
    s.is_active,
    s.is_published,
    s.created_at,
    s.updated_at,
    COUNT(sr.id) as response_count,
    MAX(sr.created_at) as last_response_at,
    MIN(sr.created_at) as first_response_at
FROM surveys s
LEFT JOIN survey_responses sr ON sr.survey_id = s.id
GROUP BY s.id, s.slug, s.title, s.description, s.is_active, s.is_published, s.created_at, s.updated_at
ORDER BY s.created_at DESC;

-- Add comment
COMMENT ON VIEW survey_stats IS 'Aggregated statistics for each survey including response counts and dates';
