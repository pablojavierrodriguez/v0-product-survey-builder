# Database Migration Scripts

This directory contains SQL migration scripts for the survey system. The scripts are designed to be run in order to set up and migrate the database schema.

## Migration Order

Run the scripts in this order:

1. **01_create_surveys_table.sql** - Creates the surveys table with proper indexes and triggers
2. **02_add_survey_id_to_responses.sql** - Adds survey_id foreign key to survey_responses table
3. **03_create_default_survey.sql** - Creates the default "Product Survey 2025" survey
4. **04_link_existing_responses.sql** - Links all existing responses to the default survey
5. **05_create_survey_stats_view.sql** - Creates a view for survey statistics
6. **06_add_survey_metadata.sql** - Adds additional metadata columns to surveys
7. **07_verify_migration.sql** - Verification queries to check migration status

## Running Migrations

### Option 1: Using v0 UI (Recommended)

The scripts can be executed directly from the v0 interface:

1. Navigate to the scripts folder in your v0 workspace
2. Click on each SQL file in order
3. Click "Run Script" button to execute

### Option 2: Using Supabase SQL Editor

1. Open your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each script in order
4. Execute them one by one

### Option 3: Using TypeScript Runner (Advanced)

```bash
# Install dependencies
npm install

# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Run migration script
npx tsx scripts/run-migration.ts
```

## What Each Script Does

### 01_create_surveys_table.sql
- Creates the main surveys table
- Adds indexes for performance
- Sets up automatic updated_at trigger
- Defines the survey configuration structure

### 02_add_survey_id_to_responses.sql
- Adds survey_id column to survey_responses
- Creates foreign key relationship
- Allows NULL for legacy responses

### 03_create_default_survey.sql
- Creates the default survey with all question configurations
- Sets it as active and published
- Uses the slug "product-survey-2025"

### 04_link_existing_responses.sql
- Links all existing survey_responses to the default survey
- Provides verification query to check linkage status

### 05_create_survey_stats_view.sql
- Creates a database view for easy access to survey statistics
- Aggregates response counts and dates per survey
- Used by the admin dashboard

### 06_add_survey_metadata.sql
- Adds author tracking
- Adds version control
- Adds tags for categorization
- Adds flexible metadata column

### 07_verify_migration.sql
- Contains verification queries
- Checks survey creation
- Verifies response linkage
- Shows statistics per survey

## Rollback

If you need to rollback the migration:

```sql
-- Remove survey_id column from survey_responses
ALTER TABLE survey_responses DROP COLUMN IF EXISTS survey_id;

-- Drop survey_stats view
DROP VIEW IF EXISTS survey_stats;

-- Drop surveys table (WARNING: This will delete all survey data)
DROP TABLE IF EXISTS surveys CASCADE;
```

## Troubleshooting

### Issue: "relation surveys does not exist"
**Solution:** Run script 01 first to create the surveys table

### Issue: "column survey_id does not exist"
**Solution:** Run script 02 to add the survey_id column

### Issue: "duplicate key value violates unique constraint"
**Solution:** The default survey already exists. This is safe to ignore.

### Issue: Permission denied errors
**Solution:** Make sure you're using the service role key, not the anon key

## Notes

- All scripts use `IF NOT EXISTS` and `ON CONFLICT DO NOTHING` to be idempotent
- Scripts can be safely run multiple times
- Existing data will not be lost or overwritten
- The migration preserves all existing survey responses
