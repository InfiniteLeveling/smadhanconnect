import { supabase, isConfiguredSupabase } from './supabase';
import { MOCK_PROFILES } from '../data/mockDatabase';

let activeProfiles = [...MOCK_PROFILES];
let mockChallenges = [
  {
    id: 'chal-001',
    title: 'High Fluoride Contamination in Rural Handpumps',
    description: 'Over 14 villages in Palamu district are reporting severe fluorosis symptoms among children due to untreated groundwater from community borewells.',
    category_id: 'cat-1',
    category_name: 'Water Supply & Sanitation',
    district_id: 'dist-5',
    district_name: 'Palamu',
    location_details: 'Lesliganj Block, Villages across Ward 4 to 9',
    urgency: 'CRITICAL',
    status: 'PROTOTYPE',
    created_by_name: 'Ramesh Murmu',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    evidence_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=800&q=80',
    upvotes: 42
  },
  {
    id: 'chal-002',
    title: 'Frequent Coal Transport Dust & Respiratory Health Spikes',
    description: 'Uncovered coal truck transit through central Jharia bypass is causing PM10 particulate levels to cross 380 ug/m3, impacting two primary schools directly on the corridor.',
    category_id: 'cat-8',
    category_name: 'Environment & Climate',
    district_id: 'dist-2',
    district_name: 'Dhanbad',
    location_details: 'Jharia Coalfield Arterial Road, Near High School',
    urgency: 'HIGH',
    status: 'SUBMITTED',
    created_by_name: 'Anjali Hansda',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    evidence_url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
    upvotes: 89
  },
  {
    id: 'chal-003',
    title: 'Elephant-Train Collision Corridor Early Warning System',
    description: 'Wild elephant herds regularly cross railway tracks near Goilkera forest stretch leading to fatal collisions and human-wildlife conflict.',
    category_id: 'cat-4',
    category_name: 'Smart Mobility',
    district_id: 'dist-7',
    district_name: 'West Singhbhum',
    location_details: 'Chakradharpur Railway Division, Goilkera Range',
    urgency: 'CRITICAL',
    status: 'OPEN_FOR_SOLUTIONS',
    created_by_name: 'Birsa Forest Range Committee',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    evidence_url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80',
    upvotes: 156
  },
  {
    id: 'chal-004',
    title: 'Cold Storage Gap for Tomato Farmers in Gumla',
    description: 'Smallholder farmers face 40% post-harvest rot during peak monsoon season due to absence of affordable micro-cold storage units.',
    category_id: 'cat-5',
    category_name: 'Agriculture & Rural',
    district_id: 'dist-14',
    district_name: 'Gumla',
    location_details: 'Bishunpur Block Mandi',
    urgency: 'MEDIUM',
    status: 'PROTOTYPE',
    created_by_name: 'Sombari Oraon',
    created_at: new Date(Date.now() - 3600000 * 120).toISOString(),
    evidence_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    upvotes: 67
  }
];

let mockSolutions = [
  {
    id: 'sol-001',
    challenge_id: 'chal-001',
    title: 'Solar-Powered Nano-Adsorption Activated Alumina Filtration Unit',
    description: 'Deploying decentralized community filtration kiosks using locally regenerable activated alumina beads and automated backwashing powered by 200W solar panels.',
    approach: 'Modular community filtration columns with telemetry monitoring of total dissolved solids (TDS) and residual fluoride ions.',
    expected_impact: 'Provides 2,500 liters/day of safe drinking water (<0.5 mg/L Fluoride) for 320 families.',
    estimated_cost: 185000,
    proposer_id: 'user-student',
    proposer_name: 'Pooja Kumari (BIT Mesra Team)',
    proposer_role: 'STUDENT',
    status: 'ACCEPTED',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

let mockProjects = [
  {
    id: 'proj-001',
    solution_id: 'sol-001',
    challenge_id: 'chal-001',
    challenge_title: 'High Fluoride Contamination in Rural Handpumps',
    district_name: 'Palamu',
    title: 'Palamu Solar Nano-Adsorption Water Filtration Pilot',
    objective: 'Eradicate fluorosis in Lesliganj Block by establishing 2 active prototype filtration kiosks with live IoT telemetry.',
    current_phase: 'PROTOTYPE',
    lead_id: 'user-student',
    lead_name: 'Pooja Kumari',
    lead_org: 'BIT Mesra Innovation Lab',
    mentor_name: 'Dr. Arvind Verma (IIT ISM Dhanbad)',
    funding_pledged: 185000,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

let mockTasks = [
  {
    id: 'task-001',
    project_id: 'proj-001',
    title: 'Geochemical Water Sample Lab Assay',
    description: 'Collect baseline fluoride & heavy metal titration assays from 8 community borewells in Lesliganj.',
    status: 'DONE',
    priority: 'HIGH',
    assignee_name: 'Pooja Kumari',
    due_date: '2026-09-10'
  },
  {
    id: 'task-002',
    project_id: 'proj-001',
    title: 'Activated Alumina Column Bed Fabrication',
    description: 'Fabricate 50L/hr modular column casing using food-grade PVC and regenerable alumina beads.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignee_name: 'Rohan Sharma',
    due_date: '2026-09-18'
  },
  {
    id: 'task-003',
    project_id: 'proj-001',
    title: 'IoT Fluoride Ion Sensor Calibration',
    description: 'Calibrate optical ion-selective electrode sensors with ESP32 microcontrollers for cellular telemetry.',
    status: 'TODO',
    priority: 'MEDIUM',
    assignee_name: 'Pooja Kumari',
    due_date: '2026-09-25'
  },
  {
    id: 'task-004',
    project_id: 'proj-001',
    title: 'Village Gram Panchayat Pilot Site Clearance',
    description: 'Procure formal village permission for 200W solar panel pole mounting near community well #3.',
    status: 'REVIEW',
    priority: 'MEDIUM',
    assignee_name: 'Dr. Arvind Verma',
    due_date: '2026-09-15'
  }
];

let mockSponsorships = [
  {
    id: 'spon-001',
    project_id: 'proj-001',
    sponsor_name: 'Tata Steel CSR Foundation',
    sponsor_rep: 'Vikram Singhania',
    amount: 150000,
    status: 'DISBURSED',
    pledged_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

let mockConversations = [
  {
    id: 'conv-001',
    title: 'Palamu Filtration Project Team',
    subtitle: 'Pooja, Dr. Arvind, Vikram (Tata Steel)',
    project_id: 'proj-001',
    updated_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unread_count: 2
  },
  {
    id: 'conv-002',
    title: 'Urban Development Nodal Desk',
    subtitle: 'Sanjay Tirkey IAS',
    project_id: null,
    updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    unread_count: 0
  },
  {
    id: 'conv-003',
    title: 'BIT Mesra Innovation Faculty Mentor',
    subtitle: 'Dr. Arvind Verma',
    project_id: 'proj-001',
    updated_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    unread_count: 0
  }
];

let mockMessages = [
  {
    id: 'msg-001',
    conversation_id: 'conv-001',
    sender_id: 'user-university',
    sender_name: 'Dr. Arvind Verma',
    sender_role: 'UNIVERSITY',
    content: 'Pooja, please make sure the activated alumina mesh size is 28-48 mesh for optimal contact time.',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'msg-002',
    conversation_id: 'conv-001',
    sender_id: 'user-student',
    sender_name: 'Pooja Kumari',
    sender_role: 'STUDENT',
    content: 'Yes sir! We ran the breakthrough curve in the lab today and achieved <0.2 mg/L residual fluoride at 45 L/hr flow.',
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString()
  },
  {
    id: 'msg-003',
    conversation_id: 'conv-001',
    sender_id: 'user-industry',
    sender_name: 'Vikram Singhania (Tata Steel)',
    sender_role: 'INDUSTRY',
    content: 'Excellent progress team. Our CSR audit committee has approved the ₹1.5L grant release for kiosk casing fabrication.',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  }
];

let mockNotifications = [
  {
    id: 'notif-001',
    title: 'Problem Report Verified',
    content: 'Your report "High Fluoride Contamination in Rural Handpumps" was officially verified by Sanjay Tirkey IAS.',
    link: '/challenges/chal-001',
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'notif-002',
    title: 'CSR Grant Pledged',
    content: 'Tata Steel CSR pledged ₹1,50,000 to the Palamu Solar Nano-Adsorption project.',
    link: '/projects/proj-001',
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'notif-003',
    title: 'Solution Bid Accepted',
    content: 'Your engineering proposal was officially accepted into the 5-Phase Project Workspace.',
    link: '/projects/proj-001',
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export const submitChallenge = async (challengeData, userProfile) => {
  if (!isConfiguredSupabase()) {
    const newChallenge = {
      id: `chal-${Date.now()}`,
      title: challengeData.title,
      description: challengeData.description,
      category_id: challengeData.categoryId || 'cat-1',
      category_name: challengeData.categoryName || 'Water Supply & Sanitation',
      district_id: challengeData.districtId || 'dist-1',
      district_name: challengeData.districtName || 'Ranchi',
      location_details: challengeData.location || 'Local area',
      urgency: 'MEDIUM',
      status: 'SUBMITTED',
      created_by_name: userProfile?.full_name || 'Citizen Reporter',
      created_by: userProfile?.id,
      created_at: new Date().toISOString(),
      evidence_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=800&q=80',
      upvotes: 1
    };
    mockChallenges.unshift(newChallenge);
    return newChallenge;
  }

  const { data, error } = await supabase
    .from('challenges')
    .insert([{
      title: challengeData.title,
      description: challengeData.description,
      category_id: challengeData.categoryId,
      district_id: challengeData.districtId,
      location_details: challengeData.location,
      created_by: userProfile?.id,
      status: 'SUBMITTED'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getPendingChallenges = async () => {
  if (!isConfiguredSupabase()) {
    return mockChallenges.filter(c => c.status === 'SUBMITTED');
  }

  const { data, error } = await supabase
    .from('challenges')
    .select(`
      *,
      districts(name),
      categories(name),
      profiles!created_by(full_name)
    `)
    .eq('status', 'SUBMITTED')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getAllChallenges = async () => {
  if (!isConfiguredSupabase()) {
    return [...mockChallenges];
  }

  const { data, error } = await supabase
    .from('challenges')
    .select(`
      *,
      districts(name),
      categories(name),
      profiles!created_by(full_name)
    `)
    .neq('status', 'DRAFT')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getChallengeById = async (id) => {
  if (!isConfiguredSupabase()) {
    const item = mockChallenges.find(c => c.id === id);
    if (!item) throw new Error('Challenge not found');
    return item;
  }

  const { data, error } = await supabase
    .from('challenges')
    .select(`
      *,
      districts(name),
      categories(name),
      profiles!created_by(full_name, avatar_url, role)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const verifyChallenge = async (challengeId, urgency, officerId) => {
  if (!isConfiguredSupabase()) {
    mockChallenges = mockChallenges.map(c => {
      if (c.id === challengeId) {
        return {
          ...c,
          urgency,
          status: 'OPEN_FOR_SOLUTIONS',
          verified_by: officerId,
          verified_at: new Date().toISOString()
        };
      }
      return c;
    });
    return mockChallenges.find(c => c.id === challengeId);
  }

  const { data, error } = await supabase
    .from('challenges')
    .update({
      urgency,
      status: 'OPEN_FOR_SOLUTIONS',
      verified_by: officerId,
      verified_at: new Date().toISOString()
    })
    .eq('id', challengeId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const rejectChallenge = async (challengeId, officerId, reason) => {
  if (!isConfiguredSupabase()) {
    mockChallenges = mockChallenges.map(c => {
      if (c.id === challengeId) {
        return {
          ...c,
          status: 'REJECTED',
          rejection_reason: reason,
          verified_by: officerId,
          verified_at: new Date().toISOString()
        };
      }
      return c;
    });
    return mockChallenges.find(c => c.id === challengeId);
  }

  const { data, error } = await supabase
    .from('challenges')
    .update({
      status: 'REJECTED',
      verified_by: officerId,
      verified_at: new Date().toISOString()
    })
    .eq('id', challengeId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const upvoteChallenge = async (challengeId) => {
  if (!isConfiguredSupabase()) {
    mockChallenges = mockChallenges.map(c => {
      if (c.id === challengeId) {
        return { ...c, upvotes: (c.upvotes || 0) + 1 };
      }
      return c;
    });
    return mockChallenges.find(c => c.id === challengeId);
  }

  const { data, error } = await supabase.rpc('increment_upvotes', { row_id: challengeId });
  if (error) {
    const { data: direct } = await supabase
      .from('challenges')
      .update({ upvotes: supabase.raw('upvotes + 1') })
      .eq('id', challengeId);
    return direct;
  }
  return data;
};

export const getSolutionsByChallenge = async (challengeId) => {
  if (!isConfiguredSupabase()) {
    return mockSolutions.filter(s => s.challenge_id === challengeId);
  }

  const { data, error } = await supabase
    .from('solutions')
    .select(`
      *,
      profiles!proposer_id(full_name, avatar_url, role, organization)
    `)
    .eq('challenge_id', challengeId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const submitSolution = async (solutionData, userProfile) => {
  if (!isConfiguredSupabase()) {
    const newSolution = {
      id: `sol-${Date.now()}`,
      challenge_id: solutionData.challengeId,
      title: solutionData.title,
      description: solutionData.description,
      approach: solutionData.approach,
      expected_impact: solutionData.expectedImpact,
      estimated_cost: Number(solutionData.estimatedCost) || 50000,
      proposer_id: userProfile?.id,
      proposer_name: userProfile?.full_name || 'Innovator',
      proposer_role: userProfile?.role || 'STUDENT',
      status: 'SUBMITTED',
      created_at: new Date().toISOString()
    };
    mockSolutions.unshift(newSolution);

    mockChallenges = mockChallenges.map(c => {
      if (c.id === solutionData.challengeId && c.status === 'OPEN_FOR_SOLUTIONS') {
        return { ...c, status: 'SOLUTION_PROPOSED' };
      }
      return c;
    });

    return newSolution;
  }

  const { data, error } = await supabase
    .from('solutions')
    .insert([{
      challenge_id: solutionData.challengeId,
      title: solutionData.title,
      description: solutionData.description,
      approach: solutionData.approach,
      expected_impact: solutionData.expectedImpact,
      estimated_cost: Number(solutionData.estimatedCost) || 0,
      proposer_id: userProfile?.id,
      status: 'SUBMITTED'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const acceptSolution = async (solutionId, challengeId, officerId) => {
  if (!isConfiguredSupabase()) {
    const sol = mockSolutions.find(s => s.id === solutionId);
    if (sol) {
      sol.status = 'ACCEPTED';
    }

    mockChallenges = mockChallenges.map(c => {
      if (c.id === challengeId) {
        return { ...c, status: 'PROTOTYPE', current_phase: 'RESEARCH' };
      }
      return c;
    });

    const newProject = {
      id: `proj-${Date.now()}`,
      solution_id: solutionId,
      challenge_id: challengeId,
      challenge_title: 'High Fluoride Contamination in Rural Handpumps',
      district_name: 'Palamu',
      title: sol ? `Project: ${sol.title}` : 'Civic Engineering Pilot',
      objective: sol ? sol.description : 'Implement accepted civic solution',
      current_phase: 'RESEARCH',
      lead_id: sol ? sol.proposer_id : 'user-student',
      lead_name: sol ? sol.proposer_name : 'Pooja Kumari',
      lead_org: 'BIT Mesra Innovation Lab',
      mentor_name: 'Dr. Arvind Verma (IIT ISM Dhanbad)',
      funding_pledged: sol ? sol.estimated_cost : 185000,
      created_at: new Date().toISOString()
    };
    mockProjects.unshift(newProject);
    return newProject;
  }

  const { data, error } = await supabase
    .from('solutions')
    .update({ status: 'ACCEPTED' })
    .eq('id', solutionId)
    .select()
    .single();

  if (error) throw error;

  await supabase
    .from('challenges')
    .update({ status: 'PROTOTYPE', current_phase: 'RESEARCH' })
    .eq('id', challengeId);

  return data;
};

export const getAllProjects = async () => {
  if (!isConfiguredSupabase()) {
    return [...mockProjects];
  }

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      challenges(title, district_id, districts(name)),
      profiles!lead_id(full_name, role, organization)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getProjectById = async (id) => {
  if (!isConfiguredSupabase()) {
    const proj = mockProjects.find(p => p.id === id) || mockProjects[0];
    return proj;
  }

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      challenges(*),
      profiles!lead_id(full_name, role, organization, avatar_url)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const getProjectTasks = async (projectId) => {
  if (!isConfiguredSupabase()) {
    return mockTasks.filter(t => t.project_id === projectId || !t.project_id);
  }

  const { data, error } = await supabase
    .from('project_tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createTask = async (taskData) => {
  if (!isConfiguredSupabase()) {
    const newTask = {
      id: `task-${Date.now()}`,
      project_id: taskData.projectId || 'proj-001',
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'TODO',
      priority: taskData.priority || 'MEDIUM',
      assignee_name: taskData.assigneeName || 'Team Member',
      due_date: taskData.dueDate || '2026-09-30',
      created_at: new Date().toISOString()
    };
    mockTasks.unshift(newTask);
    return newTask;
  }

  const { data, error } = await supabase
    .from('project_tasks')
    .insert([{
      project_id: taskData.projectId,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || 'TODO',
      priority: taskData.priority || 'MEDIUM',
      due_date: taskData.dueDate
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTaskStatus = async (taskId, newStatus) => {
  if (!isConfiguredSupabase()) {
    mockTasks = mockTasks.map(t => {
      if (t.id === taskId) {
        return { ...t, status: newStatus };
      }
      return t;
    });
    return mockTasks.find(t => t.id === taskId);
  }

  const { data, error } = await supabase
    .from('project_tasks')
    .update({ status: newStatus })
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const advanceProjectPhase = async (projectId, newPhase) => {
  if (!isConfiguredSupabase()) {
    mockProjects = mockProjects.map(p => {
      if (p.id === projectId) {
        return { ...p, current_phase: newPhase };
      }
      return p;
    });
    return mockProjects.find(p => p.id === projectId);
  }

  const { data, error } = await supabase
    .from('projects')
    .update({ current_phase: newPhase })
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getProjectSponsorships = async (projectId) => {
  if (!isConfiguredSupabase()) {
    return mockSponsorships.filter(s => s.project_id === projectId || !s.project_id);
  }

  const { data, error } = await supabase
    .from('sponsorships')
    .select(`
      *,
      profiles!sponsor_id(full_name, organization, role)
    `)
    .eq('project_id', projectId);

  if (error) throw error;
  return data;
};

export const pledgeSponsorship = async (projectId, sponsorProfile, amount) => {
  if (!isConfiguredSupabase()) {
    const newPledge = {
      id: `spon-${Date.now()}`,
      project_id: projectId,
      sponsor_name: sponsorProfile?.organization || sponsorProfile?.full_name || 'Corporate Partner',
      sponsor_rep: sponsorProfile?.full_name || 'CSR Director',
      amount: Number(amount) || 50000,
      status: 'PLEDGED',
      pledged_at: new Date().toISOString()
    };
    mockSponsorships.unshift(newPledge);

    mockProjects = mockProjects.map(p => {
      if (p.id === projectId) {
        return { ...p, funding_pledged: (p.funding_pledged || 0) + Number(amount) };
      }
      return p;
    });

    return newPledge;
  }

  const { data, error } = await supabase
    .from('sponsorships')
    .insert([{
      project_id: projectId,
      sponsor_id: sponsorProfile?.id,
      amount: Number(amount),
      status: 'PLEDGED'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ==========================================
// CONVERSATIONS & REALTIME MESSAGING
// ==========================================

export const getConversations = async (userId) => {
  if (!isConfiguredSupabase()) {
    return [...mockConversations];
  }

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      projects(title)
    `)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getMessages = async (conversationId) => {
  if (!isConfiguredSupabase()) {
    return mockMessages.filter(m => m.conversation_id === conversationId);
  }

  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      profiles!sender_id(full_name, avatar_url, role)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const sendMessage = async (conversationId, senderProfile, content) => {
  if (!isConfiguredSupabase()) {
    const newMsg = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: senderProfile?.id,
      sender_name: senderProfile?.full_name || 'Member',
      sender_role: senderProfile?.role || 'STUDENT',
      content,
      created_at: new Date().toISOString()
    };
    mockMessages.push(newMsg);

    mockConversations = mockConversations.map(c => {
      if (c.id === conversationId) {
        return { ...c, updated_at: new Date().toISOString() };
      }
      return c;
    });

    return newMsg;
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([{
      conversation_id: conversationId,
      sender_id: senderProfile?.id,
      content
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ==========================================
// NOTIFICATIONS
// ==========================================

export const getNotifications = async (userId) => {
  if (!isConfiguredSupabase()) {
    return [...mockNotifications];
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
};

export const markNotificationsAsRead = async (userId) => {
  if (!isConfiguredSupabase()) {
    mockNotifications = mockNotifications.map(n => ({ ...n, is_read: true }));
    return true;
  }

  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('is_read', false);

  if (error) throw error;
  return data;
};

// ==========================================
// LOOKUPS & STORAGE UPLOADS
// ==========================================

export const getDistricts = async () => {
  if (!isConfiguredSupabase()) {
    return [
      { id: 'dist-1', name: 'Ranchi', region: 'South Chotanagpur' },
      { id: 'dist-2', name: 'Dhanbad', region: 'North Chotanagpur' },
      { id: 'dist-3', name: 'East Singhbhum', region: 'Kolhan' },
      { id: 'dist-4', name: 'Bokaro', region: 'North Chotanagpur' },
      { id: 'dist-5', name: 'Palamu', region: 'Palamu' },
      { id: 'dist-6', name: 'Hazaribagh', region: 'North Chotanagpur' },
      { id: 'dist-7', name: 'West Singhbhum', region: 'Kolhan' },
      { id: 'dist-8', name: 'Deoghar', region: 'Santhal Pargana' },
      { id: 'dist-9', name: 'Garhwa', region: 'Palamu' },
      { id: 'dist-10', name: 'Dumka', region: 'Santhal Pargana' },
      { id: 'dist-11', name: 'Giridih', region: 'North Chotanagpur' },
      { id: 'dist-12', name: 'Ramgarh', region: 'North Chotanagpur' },
      { id: 'dist-13', name: 'Chatra', region: 'North Chotanagpur' },
      { id: 'dist-14', name: 'Gumla', region: 'South Chotanagpur' },
      { id: 'dist-15', name: 'Koderma', region: 'North Chotanagpur' },
      { id: 'dist-16', name: 'Jamtara', region: 'Santhal Pargana' },
      { id: 'dist-17', name: 'Sahibganj', region: 'Santhal Pargana' },
      { id: 'dist-18', name: 'Latehar', region: 'Palamu' },
      { id: 'dist-19', name: 'Godda', region: 'Santhal Pargana' },
      { id: 'dist-20', name: 'Simdega', region: 'South Chotanagpur' },
      { id: 'dist-21', name: 'Pakur', region: 'Santhal Pargana' },
      { id: 'dist-22', name: 'Lohardaga', region: 'South Chotanagpur' },
      { id: 'dist-23', name: 'Khunti', region: 'South Chotanagpur' },
      { id: 'dist-24', name: 'Saraikela Kharsawan', region: 'Kolhan' }
    ];
  }

  const { data, error } = await supabase.from('districts').select('*').order('name');
  if (error || !data || data.length === 0) {
    // If table exists but not yet seeded, return fallback
    return [
      { id: 'dist-1', name: 'Ranchi' },
      { id: 'dist-2', name: 'Dhanbad' },
      { id: 'dist-3', name: 'East Singhbhum' },
      { id: 'dist-4', name: 'Bokaro' },
      { id: 'dist-5', name: 'Palamu' },
      { id: 'dist-6', name: 'Hazaribagh' }
    ];
  }
  return data;
};

export const getCategories = async () => {
  if (!isConfiguredSupabase()) {
    return [
      { id: 'cat-1', name: 'Water Supply & Sanitation' },
      { id: 'cat-2', name: 'Healthcare & Wellness' },
      { id: 'cat-3', name: 'Smart Mobility' },
      { id: 'cat-4', name: 'Agriculture & Rural' },
      { id: 'cat-5', name: 'Environment & Climate' },
      { id: 'cat-6', name: 'Education & Skill' },
      { id: 'cat-7', name: 'Women Safety' },
      { id: 'cat-8', name: 'E-Governance' }
    ];
  }

  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error || !data || data.length === 0) {
    return [
      { id: 'cat-1', name: 'Water Supply & Sanitation' },
      { id: 'cat-2', name: 'Healthcare & Wellness' },
      { id: 'cat-3', name: 'Smart Mobility' },
      { id: 'cat-4', name: 'Agriculture & Rural' },
      { id: 'cat-5', name: 'Environment & Climate' }
    ];
  }
  return data;
};

export const uploadEvidenceFile = async (file, bucketName = 'challenge-evidence') => {
  if (!isConfiguredSupabase() || !file) {
    return 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=800&q=80';
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (uploadError) {
    console.warn("Storage upload notice:", uploadError.message);
    return URL.createObjectURL(file);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrl;
};

// ==========================================
// USER & PROFILE MANAGEMENT (ADMIN & ONBOARDING)
// ==========================================

export const getAllProfiles = async () => {
  if (!isConfiguredSupabase()) {
    return [...activeProfiles];
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return [...activeProfiles];
  }

  return data;
};

export const getUserProfile = async (userId) => {
  if (!userId) return null;

  if (!isConfiguredSupabase()) {
    return activeProfiles.find(p => p.id === userId || p.email === userId) || null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return activeProfiles.find(p => p.id === userId || p.email === userId) || null;
  }

  return data;
};

export const updateUserProfileRole = async (userId, newRole) => {
  if (!userId || !newRole) return { success: false, error: 'Missing parameters' };

  if (!isConfiguredSupabase()) {
    activeProfiles = activeProfiles.map(p => 
      (p.id === userId || p.email === userId) ? { ...p, role: newRole } : p
    );
    return { success: true, role: newRole };
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user role:', error);
    // fallback in memory
    activeProfiles = activeProfiles.map(p => 
      (p.id === userId || p.email === userId) ? { ...p, role: newRole } : p
    );
    return { success: false, error: error.message };
  }

  return { success: true, data };
};

export const updateProfileVerification = async (userId, isVerified) => {
  if (!userId) return { success: false };

  if (!isConfiguredSupabase()) {
    activeProfiles = activeProfiles.map(p => 
      (p.id === userId || p.email === userId) ? { ...p, verification_status: isVerified } : p
    );
    return { success: true, verification_status: isVerified };
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ verification_status: isVerified, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating verification status:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
};

export const saveUserProfile = async (profileData) => {
  if (!profileData?.id) return { success: false, error: 'No user ID' };

  if (!isConfiguredSupabase()) {
    const existingIndex = activeProfiles.findIndex(p => p.id === profileData.id || p.email === profileData.email);
    if (existingIndex >= 0) {
      activeProfiles[existingIndex] = { ...activeProfiles[existingIndex], ...profileData };
    } else {
      activeProfiles.push(profileData);
    }
    return { success: true, data: profileData };
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: profileData.id,
      email: profileData.email,
      full_name: profileData.full_name || profileData.email?.split('@')[0] || 'Civic User',
      avatar_url: profileData.avatar_url,
      role: profileData.role || 'CITIZEN',
      organization: profileData.organization || null,
      district: profileData.district || 'Ranchi',
      phone: profileData.phone || null,
      bio: profileData.bio || null,
      verification_status: profileData.email?.toLowerCase() === 'microsoft1gab@gmail.com' ? true : (profileData.verification_status || false),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving user profile:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
};
