-- ==========================================
-- SAMADHAN CONNECT - MASTER DATABASE SCHEMA
-- ==========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOM TYPES (ENUMS)
CREATE TYPE user_role AS ENUM ('CITIZEN', 'STUDENT', 'UNIVERSITY', 'INDUSTRY', 'GOVERNMENT', 'ADMIN');
CREATE TYPE challenge_status AS ENUM ('DRAFT', 'SUBMITTED', 'VERIFIED', 'OPEN_FOR_SOLUTIONS', 'SOLUTION_PROPOSED', 'PROTOTYPE', 'FIELD_TESTING', 'RESOLVED', 'REJECTED');
CREATE TYPE urgency_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE solution_status AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED');
CREATE TYPE project_phase AS ENUM ('RESEARCH', 'PROTOTYPE', 'TESTING', 'IMPLEMENTATION', 'COMPLETED');
CREATE TYPE task_status AS ENUM ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE');

-- 3. AUTOMATIC TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. TABLES

-- PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'CITIZEN',
  organization TEXT,
  district TEXT,
  phone TEXT,
  bio TEXT,
  verification_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DISTRICTS (Lookup Table)
CREATE TABLE districts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  region TEXT
);

-- CATEGORIES (Lookup Table)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT
);

-- CHALLENGES (The core civic problems)
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  district_id UUID REFERENCES districts(id),
  location_details TEXT,
  urgency urgency_level DEFAULT 'MEDIUM',
  status challenge_status DEFAULT 'DRAFT',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  current_phase project_phase,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHALLENGE EVIDENCE (Files/Photos)
CREATE TABLE challenge_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SOLUTIONS
CREATE TABLE solutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  approach TEXT NOT NULL,
  expected_impact TEXT,
  estimated_cost DECIMAL(12,2),
  proposer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status solution_status DEFAULT 'SUBMITTED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECTS
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solution_id UUID REFERENCES solutions(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id),
  title TEXT NOT NULL,
  objective TEXT NOT NULL,
  current_phase project_phase DEFAULT 'RESEARCH',
  lead_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECT MEMBERS
CREATE TABLE project_members (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT, -- e.g., 'Lead', 'Mentor', 'Developer'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

-- PROJECT TASKS (Kanban)
CREATE TABLE project_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'TODO',
  priority urgency_level DEFAULT 'MEDIUM',
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SPONSORSHIPS (CSR)
CREATE TABLE sponsorships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  sponsor_id UUID REFERENCES profiles(id),
  amount DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'PLEDGED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONVERSATIONS
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONVERSATION MEMBERS
CREATE TABLE conversation_members (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, user_id)
);

-- MESSAGES
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TELEMETRY (IoT Extensibility)
CREATE TABLE telemetry_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  device_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE telemetry_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID REFERENCES telemetry_devices(id) ON DELETE CASCADE,
  metric TEXT NOT NULL,
  value DECIMAL(10,4) NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. APPLY TRIGGERS
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_solutions_updated_at BEFORE UPDATE ON solutions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON project_tasks FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 6. INDEXES
CREATE INDEX idx_challenges_district ON challenges(district_id);
CREATE INDEX idx_challenges_category ON challenges(category_id);
CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_solutions_challenge ON solutions(challenge_id);
CREATE INDEX idx_tasks_project ON project_tasks(project_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_telemetry_device_time ON telemetry_readings(device_id, recorded_at DESC);

-- 7. ATOMIC UPVOTE RPC FUNCTION
CREATE OR REPLACE FUNCTION increment_upvotes(row_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE challenges
  SET upvotes = COALESCE(upvotes, 0) + 1
  WHERE id = row_id
  RETURNING upvotes INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. AUTOMATIC AUTH USER PROFILE SYNC TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'CITIZEN'::user_role),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id)
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

