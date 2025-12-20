-- Link all existing survey_responses without a survey_id to the default survey
WITH default_survey AS (
    SELECT id FROM surveys WHERE slug = 'product-survey-2025' LIMIT 1
)
UPDATE survey_responses
SET survey_id = (SELECT id FROM default_survey)
WHERE survey_id IS NULL;

-- Verify the update
SELECT 
    COUNT(*) as total_responses,
    COUNT(survey_id) as linked_responses,
    COUNT(*) - COUNT(survey_id) as unlinked_responses
FROM survey_responses;
