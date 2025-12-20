# User Role Management Guide

## Overview

The Survey Builder uses Supabase Authentication for user management. All users are authenticated through Supabase Auth, and roles are managed in the `profiles` table.

## Default User Creation

When a new user signs up:
1. **Supabase Auth** creates the user account
2. A database trigger automatically creates a profile entry
3. The user is **always** assigned the `viewer` role by default
4. Users must verify their email before they can log in

## Available Roles

- **viewer**: Read-only access to analytics
- **collaborator**: Can view and manage survey responses
- **admin-demo**: Demo admin with read-only access to all features
- **admin**: Full administrative access

## Upgrading User Roles

### Manual Method (Database)

Admins can upgrade user roles directly in the Supabase dashboard:

1. Navigate to **Table Editor** → **profiles**
2. Find the user by email
3. Update the `role` column to the desired role
4. Save changes

### Programmatic Method

Use the provided SQL function:

```sql
-- Upgrade a user to admin
SELECT public.set_user_role(
  'user-uuid-here'::UUID, 
  'admin'
);
```

**Note:** Only authenticated admin users can execute this function.

## Security

- No hardcoded credentials exist in the codebase
- All authentication goes through Supabase Auth
- Role-based access control is enforced via Row Level Security (RLS)
- New users cannot self-assign admin privileges

## First Admin Setup

To create your first admin user:

1. Create a user account through the signup page
2. Manually update the role in Supabase:
   - Go to **Table Editor** → **profiles**
   - Find your user by email
   - Change `role` from `viewer` to `admin`
3. Log out and log back in to apply changes

## Best Practices

- Regularly audit user roles
- Use `viewer` for most users
- Reserve `admin` for trusted administrators only
- Use `collaborator` for team members who need to manage responses
- `admin-demo` is for demonstration purposes with read-only restrictions
