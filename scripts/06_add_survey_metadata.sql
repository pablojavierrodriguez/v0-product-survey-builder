-- Add additional metadata columns to surveys table for better tracking
ALTER TABLE surveys
ADD COLUMN IF NOT EXISTS author_email TEXT,
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_surveys_author ON surveys(author_email);
CREATE INDEX IF NOT EXISTS idx_surveys_tags ON surveys USING GIN(tags);

-- Add comments
COMMENT ON COLUMN surveys.author_email IS 'Email of the user who created the survey';
COMMENT ON COLUMN surveys.version IS 'Version number for survey configuration tracking';
COMMENT ON COLUMN surveys.tags IS 'Tags for categorizing surveys';
COMMENT ON COLUMN surveys.metadata IS 'Additional metadata for surveys (custom fields, settings, etc)';
