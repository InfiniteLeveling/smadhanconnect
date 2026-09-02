-- ==========================================
-- SAMADHAN CONNECT - INITIAL SEED DATA
-- ==========================================

-- 1. SEED 24 DISTRICTS OF JHARKHAND
INSERT INTO districts (id, name, region) VALUES
  (uuid_generate_v4(), 'Ranchi', 'South Chotanagpur'),
  (uuid_generate_v4(), 'Dhanbad', 'North Chotanagpur'),
  (uuid_generate_v4(), 'East Singhbhum', 'Kolhan'),
  (uuid_generate_v4(), 'Bokaro', 'North Chotanagpur'),
  (uuid_generate_v4(), 'Palamu', 'Palamu'),
  (uuid_generate_v4(), 'Hazaribagh', 'North Chotanagpur'),
  (uuid_generate_v4(), 'West Singhbhum', 'Kolhan'),
  (uuid_generate_v4(), 'Deoghar', 'Santhal Pargana'),
  (uuid_generate_v4(), 'Garhwa', 'Palamu'),
  (uuid_generate_v4(), 'Dumka', 'Santhal Pargana'),
  (uuid_generate_v4(), 'Giridih', 'North Chotanagpur'),
  (uuid_generate_v4(), 'Ramgarh', 'North Chotanagpur'),
  (uuid_generate_v4(), 'Chatra', 'North Chotanagpur'),
  (uuid_generate_v4(), 'Gumla', 'South Chotanagpur'),
  (uuid_generate_v4(), 'Koderma', 'North Chotanagpur'),
  (uuid_generate_v4(), 'Jamtara', 'Santhal Pargana'),
  (uuid_generate_v4(), 'Sahibganj', 'Santhal Pargana'),
  (uuid_generate_v4(), 'Latehar', 'Palamu'),
  (uuid_generate_v4(), 'Godda', 'Santhal Pargana'),
  (uuid_generate_v4(), 'Simdega', 'South Chotanagpur'),
  (uuid_generate_v4(), 'Pakur', 'Santhal Pargana'),
  (uuid_generate_v4(), 'Lohardaga', 'South Chotanagpur'),
  (uuid_generate_v4(), 'Khunti', 'South Chotanagpur'),
  (uuid_generate_v4(), 'Saraikela Kharsawan', 'Kolhan')
ON CONFLICT (name) DO NOTHING;

-- 2. SEED CIVIC CATEGORIES
INSERT INTO categories (id, name, description, icon) VALUES
  (uuid_generate_v4(), 'Water Supply & Sanitation', 'Issues related to drinking water, drainage, and waste management.', 'Droplets'),
  (uuid_generate_v4(), 'Healthcare & Wellness', 'Hospital infrastructure, medical supply chains, and rural health.', 'HeartPulse'),
  (uuid_generate_v4(), 'Education & Skill', 'School infrastructure, digital learning, and university innovation.', 'GraduationCap'),
  (uuid_generate_v4(), 'Smart Mobility', 'Traffic, public transport, and road infrastructure.', 'Car'),
  (uuid_generate_v4(), 'Agriculture & Rural', 'Farming technology, irrigation, and rural economy.', 'Tractor'),
  (uuid_generate_v4(), 'Women Safety', 'Surveillance, lighting, and emergency response.', 'ShieldAlert'),
  (uuid_generate_v4(), 'E-Governance', 'Digital portals, grievance redressal, and civic tech.', 'Globe'),
  (uuid_generate_v4(), 'Environment & Climate', 'Pollution tracking, afforestation, and green energy.', 'Leaf')
ON CONFLICT (name) DO NOTHING;
