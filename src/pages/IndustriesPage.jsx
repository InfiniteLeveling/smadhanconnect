import React, { useState } from 'react';
import { 
  Building2, 
  HeartHandshake, 
  IndianRupee, 
  Award, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Leaf
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

const INDUSTRIES = [
  {
    id: 'ind-1',
    company_name: 'Tata Steel CSR Foundation',
    sector: 'Steel, Mining & Heavy Manufacturing',
    location: 'Jamshedpur, East Singhbhum',
    annual_csr_budget: '₹45 Crores',
    focus_pillars: ['Safe Drinking Water & Fluoride Removal', 'Tribal Healthcare & Nutrition', 'Rural Livelihoods'],
    active_sponsorships: 14,
    grants_disbursed: '₹3.8 Cr',
    csr_lead: 'Vikram Singhania (VP CSR)',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ind-2',
    company_name: 'Coal India Limited (CCL / BCCL)',
    sector: 'Energy & Mining PSE',
    location: 'Ranchi / Dhanbad',
    annual_csr_budget: '₹60 Crores',
    focus_pillars: ['Mine Water Recycling & Purification', 'Dust Particulate Suppression', 'Afforestation'],
    active_sponsorships: 19,
    grants_disbursed: '₹5.2 Cr',
    csr_lead: 'Sunil Kumar (Chief General Manager)',
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ind-3',
    company_name: 'SAIL — Bokaro Steel Plant CSR',
    sector: 'Steel & Metallurgy Public Sector',
    location: 'Bokaro Steel City',
    annual_csr_budget: '₹28 Crores',
    focus_pillars: ['Technical Skill Centers & ITIs', 'Rural Hospital Oxygenation', 'Solar Street Lighting'],
    active_sponsorships: 9,
    grants_disbursed: '₹2.1 Cr',
    csr_lead: 'Anita Mahato (Director CSR)',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ind-4',
    company_name: 'Jindal Steel & Power (JSP Foundation)',
    sector: 'Metals & Energy',
    location: 'Patratu, Ramgarh',
    annual_csr_budget: '₹22 Crores',
    focus_pillars: ['Women Micro-Enterprise Self-Help Groups', 'Clean Cooking Fuel & Biogas', 'Water Shed Management'],
    active_sponsorships: 8,
    grants_disbursed: '₹1.6 Cr',
    csr_lead: 'Prashant Mishra (CSR Lead)',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80'
  }
];

export const IndustriesPage = () => {
  const [search, setSearch] = useState('');

  const filtered = INDUSTRIES.filter(ind =>
    ind.company_name.toLowerCase().includes(search.toLowerCase()) ||
    ind.sector.toLowerCase().includes(search.toLowerCase()) ||
    ind.focus_pillars.some(p => p.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            Corporate CSR & Industrial Sponsorship Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight text-white">
            Corporate CSR Partnerships for Civic Transformation
          </h1>

          <p className="text-slate-300 text-base sm:text-lg">
            Major industrial leaders across Jharkhand mobilizing corporate social responsibility grants and technology equipment for student-led civic solutions.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search CSR partners by company name, industrial sector, or focus pillar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Corporate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((ind) => (
          <div 
            key={ind.id} 
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="h-44 w-full relative bg-slate-900 overflow-hidden">
                <img 
                  src={ind.image} 
                  alt={ind.company_name} 
                  className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4 bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full">
                  Annual CSR Pool: {ind.annual_csr_budget}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold font-display text-slate-900">
                    {ind.company_name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{ind.sector} • {ind.location}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Priority CSR Mandates</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ind.focus_pillars.map((p, i) => (
                      <span key={i} className="text-xs bg-emerald-50 text-emerald-800 font-medium px-2.5 py-1 rounded-lg border border-emerald-100">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-900 text-lg">{ind.active_sponsorships}</p>
                    <p className="text-slate-500 text-[11px]">Active Pilots Sponsored</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="font-bold text-emerald-700 text-lg font-display">{ind.grants_disbursed}</p>
                    <p className="text-slate-500 text-[11px]">Civic Grants Disbursed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                CSR Lead: <strong className="text-slate-800">{ind.csr_lead}</strong>
              </span>

              <Link to="/projects/proj-001">
                <Button size="sm" variant="primary" icon={HeartHandshake}>
                  Sponsor a Project
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
