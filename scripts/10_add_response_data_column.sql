-- Add response_data JSONB column to survey_responses for flexible data storage
-- This allows surveys with custom questions to store their responses

ALTER TABLE survey_responses 
ADD COLUMN IF NOT EXISTS response_data JSONB DEFAULT '{}'::jsonb;

-- Create index for better query performance on JSONB data
CREATE INDEX IF NOT EXISTS idx_survey_responses_response_data 
ON survey_responses USING gin(response_data);

-- Add comment
COMMENT ON COLUMN survey_responses.response_data IS 
'Flexible JSONB storage for dynamic survey responses. Allows any survey configuration to store its data.';

-- Verify the change
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'survey_responses' 
  AND column_name = 'response_data';
