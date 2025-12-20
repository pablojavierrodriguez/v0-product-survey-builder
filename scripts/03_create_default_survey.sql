-- Create default survey for existing responses
INSERT INTO surveys (
    slug,
    title,
    description,
    config,
    is_active,
    is_published
)
VALUES (
    'product-survey-2025',
    'Product Survey 2025',
    'Our comprehensive product management survey for 2025',
    '{
        "questions": [
            {"id": "role", "type": "single_choice", "question": "What is your current role?", "required": true},
            {"id": "seniority", "type": "single_choice", "question": "What is your seniority level?", "required": true},
            {"id": "company_type", "type": "single_choice", "question": "What type of company do you work for?", "required": true},
            {"id": "company_size", "type": "single_choice", "question": "What is your company size?", "required": true},
            {"id": "industry", "type": "single_choice", "question": "What industry do you work in?", "required": true},
            {"id": "product_type", "type": "single_choice", "question": "What type of product do you work on?", "required": true},
            {"id": "customer_segment", "type": "single_choice", "question": "What is your customer segment?", "required": true},
            {"id": "main_challenge", "type": "text", "question": "What is your main product-related challenge?", "required": true},
            {"id": "daily_tools", "type": "multiple_choice", "question": "What tools do you use daily?", "required": true},
            {"id": "learning_methods", "type": "multiple_choice", "question": "How do you learn about product?", "required": true},
            {"id": "salary", "type": "number_range", "question": "What is your salary range?", "required": false},
            {"id": "email", "type": "email", "question": "Email for follow-up (optional)", "required": false}
        ]
    }',
    true,
    true
)
ON CONFLICT (slug) DO NOTHING;
