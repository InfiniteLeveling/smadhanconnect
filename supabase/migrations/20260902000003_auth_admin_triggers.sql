-- =========================================================================
-- SAMADHAN CONNECT - AUTH TRIGGERS & SUPER ADMIN ASSIGNMENT
-- =========================================================================

-- 1. FUNCTION: Handle new user signup from Supabase Auth (Google, GitHub, etc.)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role user_role := 'CITIZEN';
  is_super_admin BOOLEAN := FALSE;
  user_full_name TEXT;
  user_avatar TEXT;
BEGIN
  -- Check if user is the designated Super Admin
  IF LOWER(NEW.email) = 'microsoft1gab@gmail.com' THEN
    assigned_role := 'ADMIN';
    is_super_admin := TRUE;
  END IF;

  -- Extract full name from raw_user_meta_data (Google/GitHub provide name/full_name)
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Extract avatar URL from raw_user_meta_data
  user_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id
  );

  -- Insert profile or update if already exists
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    role,
    verification_status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    user_avatar,
    assigned_role,
    is_super_admin,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = CASE 
      WHEN LOWER(EXCLUDED.email) = 'microsoft1gab@gmail.com' THEN 'ADMIN'::user_role 
      ELSE profiles.role 
    END,
    verification_status = CASE 
      WHEN LOWER(EXCLUDED.email) = 'microsoft1gab@gmail.com' THEN TRUE 
      ELSE profiles.verification_status 
    END,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. TRIGGER: Auto-trigger profile sync on auth.users INSERT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. UPDATE RLS POLICIES FOR ADMIN USER MANAGEMENT
-- Allow Admins to update any profile's role or verification status
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" 
  ON profiles FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
