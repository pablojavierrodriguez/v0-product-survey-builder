-- Add survey_id column to survey_responses table
ALTER TABLE survey_responses
ADD COLUMN IF NOT EXISTS survey_id UUID REFERENCES surveys(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);

-- Add comment
COMMENT ON COLUMN survey_responses.survey_id IS 'Links response to a specific survey (NULL for legacy responses)';
