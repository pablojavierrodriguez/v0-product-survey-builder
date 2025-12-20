-- Ensure all new users are created with viewer role only
-- Remove hardcoded admin email assignments

-- Drop existing trigger function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create new trigger function that ALWAYS assigns viewer role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'viewer'  -- Always create new users as viewers
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add comment explaining role management
COMMENT ON FUNCTION public.handle_new_user() IS 
'Automatically creates a profile for new users with viewer role. Admins must manually upgrade user roles in the profiles table.';

-- Create helper function for admins to upgrade user roles
CREATE OR REPLACE FUNCTION public.set_user_role(user_id UUID, new_role TEXT)
RETURNS void AS $$
BEGIN
  -- Only admins can execute this function
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can change user roles';
  END IF;

  -- Validate role
  IF new_role NOT IN ('viewer', 'admin-demo', 'collaborator', 'admin') THEN
    RAISE EXCEPTION 'Invalid role. Must be viewer, admin-demo, collaborator, or admin';
  END IF;

  -- Update the role
  UPDATE public.profiles 
  SET role = new_role 
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.set_user_role(UUID, TEXT) IS 
'Allows admins to change user roles. Must be called by an authenticated admin user.';
