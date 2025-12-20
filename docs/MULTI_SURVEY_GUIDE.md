# Multi-Survey System Guide

## Overview

The survey platform now supports multiple surveys with dynamic question configuration. Admins can create, edit, and manage multiple surveys, each with its own set of questions and settings.

## Key Features

### 1. Survey Management
- **Create Multiple Surveys**: Create unlimited surveys with unique URLs
- **Dynamic Questions**: Add, edit, remove, and reorder questions for each survey
- **Question Types**: Support for various question types:
  - Single Choice
  - Multiple Select
  - Long Text (textarea)
  - Short Text
  - Email
  - Number
  - Salary Range (custom)
- **Survey Status**: Activate/deactivate and publish/unpublish surveys
- **Survey Duplication**: Clone existing surveys to create new ones quickly

### 2. Question Editor
- **Visual Editor**: Drag-and-drop interface for question management
- **Question Configuration**:
  - Edit question text/label
  - Add/remove/edit options for choice questions
  - Set placeholder text for input fields
  - Mark questions as required or optional
  - Reorder questions by dragging
- **Real-time Preview**: Preview survey as you build it

### 3. Dynamic Survey Rendering
- Questions render dynamically based on configuration
- Auto-advance for single-choice questions (configurable)
- Progress tracking
- Response validation
- Multi-step navigation

### 4. Data Segmentation
- All responses are linked to specific surveys via `survey_id`
- Analytics can filter by survey
- Each survey maintains its own response count
- Flexible JSONB storage allows custom question data

## Database Schema

### surveys table
```sql
- id: UUID (primary key)
- slug: TEXT (unique URL identifier)
- title: TEXT
- description: TEXT
- config: JSONB (contains questions, styling, settings)
- is_active: BOOLEAN
- is_published: BOOLEAN
- created_by: UUID (references profiles)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### survey_responses table
```sql
- id: UUID (primary key)
- survey_id: UUID (foreign key to surveys)
- session_id: TEXT
- response_data: JSONB (flexible storage for any survey structure)
- [standard fields for backward compatibility]
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### survey_stats view
Aggregates response counts and last response dates per survey.

## Usage Guide

### Creating a New Survey

1. Navigate to **Admin Panel > Surveys**
2. Click **"Create Survey"**
3. Fill in:
   - Title
   - URL Slug (auto-generated from title)
   - Description
   - Active status
   - Published status
4. Click **"Create Survey"**
5. You'll be redirected to the Question Editor

### Editing Survey Questions

1. From Surveys list, click **"Edit Questions"** on any survey
2. Use the editor to:
   - **Add Question**: Click "Add Question" button
   - **Edit Question**: Click on any question to expand and edit
   - **Reorder**: Drag questions using the grip handle
   - **Delete**: Click the trash icon on any question
   - **Change Type**: Select different question type from dropdown
   - **Add Options**: For choice questions, add/edit/remove options
3. Click **"Save Changes"** when done

### Managing Survey Status

From the Surveys list, use the dropdown menu to:
- **Edit**: Modify survey details
- **Edit Questions**: Configure question structure
- **Activate/Deactivate**: Control if survey accepts responses
- **Publish/Unpublish**: Control if survey appears in public list
- **Duplicate**: Create a copy of the survey
- **Delete**: Remove the survey (irreversible)

### Viewing Survey Analytics

1. From Surveys list, click **"Analytics"** on any survey
2. Or navigate to Analytics and select survey from dropdown
3. View response data filtered by that specific survey

## API Endpoints

### Surveys Management
- `GET /api/admin/surveys` - List all surveys with stats
- `POST /api/admin/surveys` - Create new survey
- `GET /api/admin/surveys/[id]` - Get survey details
- `PATCH /api/admin/surveys/[id]` - Update survey
- `DELETE /api/admin/surveys/[id]` - Delete survey
- `POST /api/admin/surveys/[id]/duplicate` - Duplicate survey

### Public Survey Access
- `GET /api/surveys/active` - Get active surveys for home page
- `GET /api/surveys/[slug]` - Get survey by slug
- `POST /api/survey` - Submit survey response

## Migration Process

If you have existing data from a single-survey system:

1. Run migration scripts in order:
   ```bash
   scripts/01_create_surveys_table.sql
   scripts/02_add_survey_id_to_responses.sql
   scripts/03_create_default_survey.sql
   scripts/04_link_existing_responses.sql
   scripts/05_create_survey_stats_view.sql
   scripts/10_add_response_data_column.sql
   ```

2. The scripts will:
   - Create the surveys table
   - Add survey_id to existing responses
   - Create a default survey
   - Link all existing responses to the default survey
   - Set up statistics views

## Best Practices

### Survey Design
- Keep surveys focused (8-12 questions optimal)
- Use clear, concise question labels
- Provide 3-5 options for choice questions
- Mark essential questions as required
- Use appropriate question types for data you need

### Question Configuration
- Single Choice: Best for mutually exclusive options
- Multiple Select: When users can choose multiple options
- Textarea: For detailed, open-ended responses
- Email: For collecting contact information
- Number: For quantitative data

### Survey Management
- Use descriptive, unique slugs for easy identification
- Keep inactive surveys as "Inactive" rather than deleting
- Duplicate surveys to create variations
- Regularly review analytics to optimize questions

### Performance
- Limit to 20-25 questions max per survey
- Use required validation sparingly
- Enable auto-advance for better UX on choice questions

## Troubleshooting

### Survey not appearing in list
- Check if survey is published (`is_published = true`)
- Verify survey is active (`is_active = true`)

### Responses not saving
- Verify survey_id is being passed correctly
- Check response_data format matches question IDs
- Ensure database connection is active

### Questions not rendering
- Verify survey config JSON is valid
- Check that question types are supported
- Ensure options array exists for choice questions

## Future Enhancements

Planned features:
- Conditional logic (show/hide questions based on answers)
- Question branching
- Survey templates
- A/B testing
- Email notifications
- Response export by survey
- Survey versioning
- Custom themes per survey
