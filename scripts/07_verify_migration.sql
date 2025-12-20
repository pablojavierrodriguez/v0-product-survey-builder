-- Verification queries to check migration status

-- Check surveys table
SELECT 
    'Surveys Table' as check_name,
    COUNT(*) as count,
    json_agg(json_build_object(
        'slug', slug,
        'title', title,
        'is_active', is_active,
        'is_published', is_published
    )) as details
FROM surveys;

-- Check survey_responses linkage
SELECT 
    'Response Linkage' as check_name,
    COUNT(*) as total_responses,
    COUNT(survey_id) as linked_responses,
    COUNT(*) - COUNT(survey_id) as unlinked_responses,
    ROUND(100.0 * COUNT(survey_id) / NULLIF(COUNT(*), 0), 2) as linkage_percentage
FROM survey_responses;

-- Check responses per survey
SELECT 
    COALESCE(s.title, 'Unlinked') as survey_title,
    COUNT(sr.id) as response_count,
    MIN(sr.created_at) as first_response,
    MAX(sr.created_at) as last_response
FROM survey_responses sr
LEFT JOIN surveys s ON sr.survey_id = s.id
GROUP BY s.title
ORDER BY response_count DESC;

-- Check survey_stats view
SELECT * FROM survey_stats;
