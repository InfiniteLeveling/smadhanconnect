import React, { useState } from 'react';
import { 
  GraduationCap, 
  MapPin, 
  BookOpen, 
  Award, 
  Users, 
  ExternalLink, 
  Search, 
  Sparkles,
  Rocket
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

const UNIVERSITIES = [
  {
    id: 'univ-1',
    name: 'BIT Mesra (Birla Institute of Technology)',
    location: 'Ranchi, Jharkhand',
    district: 'Ranchi',
    type: 'Deemed University & Institute of Eminence',
    established: 1955,
    focus_areas: ['Water Treatment & Nano-Filtration', 'Space Tech & Robotics', 'Bio-Remediation'],
    active_projects: 8,
    faculty_mentors: 24,
    students_engaged: 310,
    coordinator: 'Dr. Sudip Das',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'univ-2',
    name: 'IIT (ISM) Dhanbad',
    location: 'Dhanbad, Jharkhand',
    district: 'Dhanbad',
    type: 'Institute of National Importance',
    established: 1926,
    focus_areas: ['Mine Safety & Seismology', 'Clean Coal & Clean Energy', 'Environmental Geotechnics'],
    active_projects: 12,
    faculty_mentors: 38,
    students_engaged: 480,
    coordinator: 'Dr. Arvind Verma',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'univ-3',
    name: 'NIT Jamshedpur',
    location: 'Jamshedpur, Jharkhand',
    district: 'East Singhbhum',
    type: 'National Institute of Technology',
    established: 1960,
    focus_areas: ['IoT & Embedded Telemetry', 'Heavy Industrial Automation', 'Smart Grid Systems'],
    active_projects: 6,
    faculty_mentors: 18,
    students_engaged: 220,
    coordinator: 'Dr. M. K. Paswan',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'univ-4',
    name: 'Birsa Agricultural University (BAU)',
    location: 'Kanke, Ranchi',
    district: 'Ranchi',
    type: 'State Agricultural University',
    established: 1981,
    focus_areas: ['Drought Resistant Millet Cultivars', 'Cold Storage Micro-Units', 'Tribal Agritech'],
    active_projects: 7,
    faculty_mentors: 15,
    students_engaged: 190,
    coordinator: 'Dr. Rameshwar Singh',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
  }
];

export const UniversitiesPage = () => {
  const [search, setSearch] = useState('');

  const filtered = UNIVERSITIES.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.district.toLowerCase().includes(search.toLowerCase()) ||
    u.focus_areas.some(f => f.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-brand-400" />
            Academic Innovation & Mentorship Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
            Jharkhand University R&D & Engineering Labs
          </h1>
          <p className="text-slate-300 text-base sm:text-lg">
            Connect with leading higher education institutions, premier faculty coordinators, and student innovation teams solving state-wide civic challenges.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search universities by institution name, district, or research specializations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Universities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((univ) => (
          <div 
            key={univ.id} 
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="h-48 w-full relative bg-slate-900 overflow-hidden">
                <img 
                  src={univ.image} 
                  alt={univ.name} 
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                  Est. {univ.established}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-700 font-bold uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{univ.location}</span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-900">
                    {univ.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{univ.type}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Research Specializations</p>
                  <div className="flex flex-wrap gap-1.5">
                    {univ.focus_areas.map((f, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-lg">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-900 text-base">{univ.active_projects}</p>
                    <p className="text-slate-500 text-[10px]">Active Pilots</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-900 text-base">{univ.faculty_mentors}</p>
                    <p className="text-slate-500 text-[10px]">Mentors</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-900 text-base">{univ.students_engaged}</p>
                    <p className="text-slate-500 text-[10px]">Students</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Coordinator: <strong className="text-slate-800">{univ.coordinator}</strong>
              </span>

              <Link to="/challenges">
                <Button size="sm" variant="outline" icon={Rocket}>
                  Explore Challenges
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
