-- ==========================================
-- SAMADHAN CONNECT - ROW LEVEL SECURITY (RLS)
-- ==========================================

-- 1. ENABLE RLS ON ALL TABLES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_readings ENABLE ROW LEVEL SECURITY;

-- 2. HELPER FUNCTIONS FOR RLS
-- (Optimized to prevent heavy joins on every row read)
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 3. POLICIES: PROFILES
-- Anyone can see public profile details, but only owners can update.
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 4. POLICIES: LOOKUP TABLES (Districts, Categories)
CREATE POLICY "Lookups are universally readable" ON districts FOR SELECT USING (true);
CREATE POLICY "Lookups are universally readable" ON categories FOR SELECT USING (true);

-- 5. POLICIES: CHALLENGES
CREATE POLICY "Public challenges are viewable by everyone" ON challenges FOR SELECT
  USING (status != 'DRAFT' OR created_by = auth.uid());

CREATE POLICY "Authenticated users can create challenges" ON challenges FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Owners can edit drafts, Government/Admin can edit anything" ON challenges FOR UPDATE
  USING (
    (auth.uid() = created_by AND status = 'DRAFT') OR
    current_user_role() IN ('GOVERNMENT', 'ADMIN')
  );

-- 6. POLICIES: CHALLENGE EVIDENCE
CREATE POLICY "Evidence is viewable by everyone" ON challenge_evidence FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload evidence" ON challenge_evidence FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

-- 7. POLICIES: SOLUTIONS
CREATE POLICY "Public solutions are viewable by everyone" ON solutions FOR SELECT USING (status != 'DRAFT' OR proposer_id = auth.uid());
CREATE POLICY "Students and Universities can propose solutions" ON solutions FOR INSERT
  WITH CHECK (
    auth.uid() = proposer_id AND 
    current_user_role() IN ('STUDENT', 'UNIVERSITY', 'INDUSTRY')
  );
CREATE POLICY "Government and Admin can evaluate solutions" ON solutions FOR UPDATE
  USING (
    (auth.uid() = proposer_id AND status = 'SUBMITTED') OR
    current_user_role() IN ('GOVERNMENT', 'ADMIN')
  );

-- 8. POLICIES: PROJECTS & TASKS
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Only Admin or Government can create projects" ON projects FOR INSERT
  WITH CHECK (current_user_role() IN ('GOVERNMENT', 'ADMIN'));
CREATE POLICY "Project members can update project phase" ON projects FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM project_members WHERE project_id = projects.id AND user_id = auth.uid()) OR
    current_user_role() IN ('ADMIN', 'GOVERNMENT')
  );

CREATE POLICY "Tasks are viewable by everyone" ON project_tasks FOR SELECT USING (true);
CREATE POLICY "Project members can manage tasks" ON project_tasks FOR ALL
  USING (
    EXISTS (SELECT 1 FROM project_members WHERE project_id = project_tasks.project_id AND user_id = auth.uid()) OR
    current_user_role() = 'ADMIN'
  );

-- 9. POLICIES: MESSAGES & COLLABORATION
CREATE POLICY "Users can only read messages in their conversations" ON messages FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM conversation_members WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can only send messages to their conversations" ON messages FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM conversation_members WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()) AND
    auth.uid() = sender_id
  );

-- 10. POLICIES: NOTIFICATIONS
CREATE POLICY "Users can only see their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications (mark read)" ON notifications FOR UPDATE USING (auth.uid() = user_id);
