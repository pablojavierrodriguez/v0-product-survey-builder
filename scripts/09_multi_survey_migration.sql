-- MULTI-SURVEY SYSTEM MIGRATION
-- This script transforms the app into a multi-survey platform

-- Step 1: Create surveys table
CREATE TABLE IF NOT EXISTS public.surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier
    title TEXT NOT NULL,
    description TEXT,
    
    -- Survey configuration stored as JSONB for flexibility
    config JSONB NOT NULL DEFAULT '{
        "questions": [],
        "styling": {},
        "settings": {}
    }'::jsonb,
    
    -- Status management
    is_active BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false,
    
    -- Metadata
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT title_not_empty CHECK (length(trim(title)) > 0)
);

-- Step 2: Add survey_id to survey_responses table
ALTER TABLE public.survey_responses 
ADD COLUMN IF NOT EXISTS survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE;

-- Step 3: Create default "Product Survey" from existing schema
INSERT INTO public.surveys (slug, title, description, config, is_active, is_published)
VALUES (
    'product-survey-2025',
    'Product Professionals Survey 2025',
    'Annual survey for product managers, designers, and engineers',
    '{
        "questions": [
            {"id": "role", "type": "single_choice", "required": true, "options": ["Product Manager", "Product Owner", "Product Designer / UX/UI Designer (UXer)", "Product Engineer / Software Engineer (Developer)", "Data Analyst / Product Analyst", "Product Marketing Manager", "Engineering Manager / Tech Lead", "Design Manager / Design Lead", "QA Engineer / Test Engineer", "DevOps Engineer / Platform Engineer", "Technical Writer / Documentation", "Customer Success Manager", "Sales Engineer / Solutions Engineer", "Other"]},
            {"id": "seniority", "type": "single_choice", "required": true, "options": ["Junior (0-2 years)", "Mid-level (2-5 years)", "Senior (5-8 years)", "Staff/Principal (8+ years)", "Manager/Lead", "Director/VP", "C-level/Founder"]},
            {"id": "company_type", "type": "single_choice", "required": true, "options": ["Startup (1-50 employees)", "Scale-up (51-200 employees)", "Mid-size company (201-1000 employees)", "Large enterprise (1000+ employees)", "Freelance/Independent", "Agency/Consultancy", "Other"]},
            {"id": "company_size", "type": "single_choice", "required": true, "options": ["Early-stage Startup (Pre-seed/Seed)", "Growth-stage Startup (Series A-C)", "Scale-up (Series D+)", "SME (Small/Medium Enterprise)", "Large Corporate (1000+ employees)", "Enterprise (10,000+ employees)", "Consultancy/Agency", "Freelance/Independent"]},
            {"id": "industry", "type": "single_choice", "required": true, "options": ["Technology/Software", "Financial Services/Fintech", "Healthcare/Medtech", "E-commerce/Retail", "Education/Edtech", "Media/Entertainment", "Manufacturing/Industrial", "Consulting/Professional Services", "Government/Public Sector", "Non-profit/NGO", "Other"]},
            {"id": "product_type", "type": "single_choice", "required": true, "options": ["SaaS (B2B)", "SaaS (B2C)", "Mobile App", "Web Application", "E-commerce Platform", "API/Developer Tools", "Hardware + Software", "Services/Consulting", "Internal Tools", "Other"]},
            {"id": "customer_segment", "type": "single_choice", "required": true, "options": ["B2B Product", "B2C Product", "B2B2C Product", "Internal Product", "Mixed (B2B + B2C)"]},
            {"id": "main_challenge", "type": "textarea", "required": true},
            {"id": "daily_tools", "type": "multi_select", "required": true, "options": ["Jira", "Figma", "Notion", "Miro", "Trello", "Asana", "Monday.com", "ClickUp", "Linear", "Slack", "Microsoft Teams", "Zoom", "Google Workspace", "Microsoft 365", "Confluence", "GitHub", "GitLab", "Bitbucket", "Sketch", "Adobe XD", "InVision", "Framer", "Webflow", "Airtable", "Coda", "Obsidian", "Roam Research", "Mural", "FigJam", "Whimsical", "Lucidchart", "Draw.io", "Canva", "Loom", "Other"]},
            {"id": "learning_methods", "type": "multi_select", "required": true, "options": ["Books", "Podcasts", "Courses", "Community", "Mentors", "Other"]},
            {"id": "salary", "type": "salary_range", "required": false},
            {"id": "email", "type": "email", "required": false}
        ],
        "styling": {
            "primaryColor": "#3B82F6",
            "theme": "gradient"
        },
        "settings": {
            "allowMultipleResponses": false,
            "showProgressBar": true,
            "autoAdvance": true
        }
    }'::jsonb,
    true,
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Step 4: Link existing responses to the default survey
UPDATE public.survey_responses
SET survey_id = (SELECT id FROM public.surveys WHERE slug = 'product-survey-2025' LIMIT 1)
WHERE survey_id IS NULL;

-- Step 5: Make survey_id required after migration
-- (We'll do this after confirming all responses are linked)
-- ALTER TABLE public.survey_responses ALTER COLUMN survey_id SET NOT NULL;

-- Step 6: Enable RLS on surveys table
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies for surveys table
-- Public can view published surveys
CREATE POLICY "surveys_public_select" ON public.surveys
    FOR SELECT USING (is_published = true);

-- Authenticated users can view all surveys
CREATE POLICY "surveys_auth_select" ON public.surveys
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins can manage surveys (using service role)
CREATE POLICY "surveys_admin_all" ON public.surveys
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Step 8: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_surveys_slug ON public.surveys(slug);
CREATE INDEX IF NOT EXISTS idx_surveys_active ON public.surveys(is_active, is_published);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON public.survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON public.surveys(created_at DESC);

-- Step 9: Create updated_at trigger for surveys
CREATE OR REPLACE FUNCTION update_surveys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS surveys_updated_at_trigger ON public.surveys;
CREATE TRIGGER surveys_updated_at_trigger
    BEFORE UPDATE ON public.surveys
    FOR EACH ROW
    EXECUTE FUNCTION update_surveys_updated_at();

-- Step 10: Create view for survey statistics
CREATE OR REPLACE VIEW survey_stats AS
SELECT 
    s.id,
    s.slug,
    s.title,
    s.is_active,
    s.is_published,
    COUNT(sr.id) as response_count,
    MAX(sr.created_at) as last_response_at,
    s.created_at,
    s.updated_at
FROM public.surveys s
LEFT JOIN public.survey_responses sr ON sr.survey_id = s.id
GROUP BY s.id, s.slug, s.title, s.is_active, s.is_published, s.created_at, s.updated_at;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ MULTI-SURVEY MIGRATION SUCCESSFUL!';
    RAISE NOTICE '📊 Created surveys table with flexible JSONB config';
    RAISE NOTICE '🔗 Linked survey_responses to surveys table';
    RAISE NOTICE '📝 Created default "Product Survey 2025" with existing config';
    RAISE NOTICE '🔒 Enabled RLS with appropriate policies';
    RAISE NOTICE '📈 Created survey_stats view for analytics';
    RAISE NOTICE '🚀 System is now ready for multi-survey management!';
END $$;
