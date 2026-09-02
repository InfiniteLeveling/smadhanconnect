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

-- 3. SEED SAMPLE CIVIC CHALLENGES
DO $$
DECLARE
  v_palamu_id UUID;
  v_dhanbad_id UUID;
  v_water_cat UUID;
  v_env_cat UUID;
  v_chal_id UUID;
  v_sol_id UUID;
  v_proj_id UUID;
BEGIN
  SELECT id INTO v_palamu_id FROM districts WHERE name = 'Palamu' LIMIT 1;
  SELECT id INTO v_dhanbad_id FROM districts WHERE name = 'Dhanbad' LIMIT 1;
  SELECT id INTO v_water_cat FROM categories WHERE name = 'Water Supply & Sanitation' LIMIT 1;
  SELECT id INTO v_env_cat FROM categories WHERE name = 'Environment & Climate' LIMIT 1;

  IF v_palamu_id IS NOT NULL AND v_water_cat IS NOT NULL THEN
    INSERT INTO challenges (id, title, description, category_id, district_id, location_details, urgency, status, upvotes)
    VALUES (
      'a0000000-0000-0000-0000-000000000001',
      'High Fluoride Contamination in Rural Handpumps',
      'Over 14 villages in Palamu district are reporting severe fluorosis symptoms among children due to untreated groundwater from community borewells.',
      v_water_cat,
      v_palamu_id,
      'Lesliganj Block, Villages across Ward 4 to 9',
      'CRITICAL',
      'PROTOTYPE',
      42
    )
    ON CONFLICT (id) DO NOTHING;

    -- Seed Solution
    INSERT INTO solutions (id, challenge_id, title, description, approach, expected_impact, estimated_cost, status)
    VALUES (
      'b0000000-0000-0000-0000-000000000001',
      'a0000000-0000-0000-0000-000000000001',
      'Solar-Powered Nano-Adsorption Activated Alumina Filtration Unit',
      'Deploying decentralized community filtration kiosks using locally regenerable activated alumina beads and automated backwashing powered by 200W solar panels.',
      'Modular community filtration columns with telemetry monitoring of total dissolved solids (TDS) and residual fluoride ions.',
      'Provides 2,500 liters/day of safe drinking water (<0.5 mg/L Fluoride) for 320 families.',
      185000,
      'ACCEPTED'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Seed Project
    INSERT INTO projects (id, solution_id, challenge_id, title, objective, current_phase)
    VALUES (
      'c0000000-0000-0000-0000-000000000001',
      'b0000000-0000-0000-0000-000000000001',
      'a0000000-0000-0000-0000-000000000001',
      'Palamu Solar Nano-Adsorption Water Filtration Pilot',
      'Eradicate fluorosis in Lesliganj Block by establishing 2 active prototype filtration kiosks with live IoT telemetry.',
      'PROTOTYPE'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Seed Project Tasks
    INSERT INTO project_tasks (id, project_id, title, description, status, priority, due_date)
    VALUES
      ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Geochemical Water Sample Lab Titration', 'Collect baseline fluoride assays from 8 community borewells.', 'DONE', 'HIGH', NOW() + INTERVAL '5 days'),
      ('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Activated Alumina Column Bed Fabrication', 'Fabricate 50L/hr modular column casing.', 'IN_PROGRESS', 'HIGH', NOW() + INTERVAL '12 days'),
      ('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'IoT Fluoride Ion Sensor Calibration', 'Calibrate optical ion sensors with ESP32 microcontroller.', 'TODO', 'MEDIUM', NOW() + INTERVAL '20 days')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  IF v_dhanbad_id IS NOT NULL AND v_env_cat IS NOT NULL THEN
    INSERT INTO challenges (id, title, description, category_id, district_id, location_details, urgency, status, upvotes)
    VALUES (
      'a0000000-0000-0000-0000-000000000002',
      'Frequent Coal Transport Dust & Respiratory Health Spikes',
      'Uncovered coal truck transit through central Jharia bypass is causing PM10 particulate levels to cross 380 ug/m3, impacting primary schools.',
      v_env_cat,
      v_dhanbad_id,
      'Jharia Coalfield Arterial Road, Near High School',
      'HIGH',
      'SUBMITTED',
      89
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

