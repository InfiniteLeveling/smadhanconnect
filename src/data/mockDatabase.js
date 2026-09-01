// Fallback offline mock data for SIH presentation when Supabase isn't connected

export const MOCK_PROFILES = [
  {
    id: 'user-citizen',
    full_name: 'Ramesh Murmu',
    email: 'ramesh@example.com',
    role: 'CITIZEN',
    district: 'Ranchi',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh',
  },
  {
    id: 'user-student',
    full_name: 'Pooja Kumari',
    email: 'pooja@student.bitmesra.ac.in',
    role: 'STUDENT',
    organization: 'BIT Mesra',
    district: 'Ranchi',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja',
  },
  {
    id: 'user-university',
    full_name: 'Dr. Arvind Verma',
    email: 'arvind@iitism.ac.in',
    role: 'UNIVERSITY',
    organization: 'IIT ISM Dhanbad',
    district: 'Dhanbad',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arvind',
  },
  {
    id: 'user-industry',
    full_name: 'Vikram Singhania',
    email: 'vikram@tatasteel.com',
    role: 'INDUSTRY',
    organization: 'Tata Steel CSR',
    district: 'East Singhbhum',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
  },
  {
    id: 'user-gov',
    full_name: 'Sanjay Tirkey IAS',
    email: 'sanjay.t@jharkhand.gov.in',
    role: 'GOVERNMENT',
    organization: 'Urban Development',
    district: 'Ranchi',
    verification_status: true,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjay',
  },
  {
    id: 'user-admin',
    full_name: 'Platform Admin',
    email: 'admin@samadhan.jharkhand.gov.in',
    role: 'ADMIN',
    organization: 'JAP-IT',
    verification_status: true,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  }
];
