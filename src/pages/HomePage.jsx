import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CivicNetworkCanvas } from '../components/home/CivicNetworkCanvas';
import { JharkhandHeroGraphic } from '../components/home/JharkhandHeroGraphic';
import { FeatureCards } from '../components/home/FeatureCards';
import { ImpactSection } from '../components/home/ImpactSection';
import { ScrollReveal } from '../components/ui/ScrollReveal';

import { 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Shield, 
  CheckCircle2, 
  Cpu, 
  Activity,
  Layers,
  Building,
  Search,
  Bot,
  Users,
  GraduationCap,
  Building2,
  ShieldCheck,
  Zap,
  Award,
  ChevronRight
} from 'lucide-react';

const SUGGESTED_SEARCHES = [
  { label: '🌾 Crop Subsidies', query: 'agriculture subsidies' },
  { label: '⚡ Power Outages', query: 'electricity outage' },
  { label: '🚰 Water Contamination', query: 'water supply' },
  { label: '📋 Potholes & Roads', query: 'road maintenance' },
  { label: '🆔 Aadhaar/Certificate', query: 'certificate' },
  { label: '🎓 Student Innovation', query: 'student grants' }
];

const ROLES_OVERVIEW = [
  {
    role: 'Citizens & Communities',
    icon: Users,
    desc: 'Report civic issues with photos and GPS, track real-time resolution, and rate completed projects.',
    color: 'from-emerald-500 to-teal-600',
    tag: 'Civic Reporting',
    link: '/report-problem'
  },
  {
    role: 'Students & Innovators',
    icon: GraduationCap,
    desc: 'Solve real community challenges, form multidisciplinary teams, and win CSR grants and hackathon prizes.',
    color: 'from-teal-600 to-brand-600',
    tag: 'Prototype Lab',
    link: '/challenges'
  },
  {
    role: 'Universities & Mentors',
    icon: Building,
    desc: 'Lead academic research innovation cells, mentor student teams, and publish verified intellectual property.',
    color: 'from-purple-600 to-indigo-600',
    tag: 'Academic R&D',
    link: '/universities'
  },
  {
    role: 'Industry & CSR Sponsors',
    icon: Building2,
    desc: 'Direct corporate CSR funds towards verified civic prototypes with transparent milestone impact tracking.',
    color: 'from-blue-600 to-cyan-600',
    tag: 'CSR Grants',
    link: '/industries'
  },
  {
    role: 'District Nodal Officers',
    icon: ShieldCheck,
    desc: 'Triage local complaints, audit ground implementation feasibility, and formally sign off on completed projects.',
    color: 'from-amber-600 to-orange-600',
    tag: 'Governance',
    link: '/dashboard/government'
  }
];

export const HomePage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/challenges?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/challenges');
    }
  };

  const handleSuggestedClick = (query) => {
    navigate(`/challenges?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative min-h-screen bg-slate-50/70 text-slate-900 overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 3D CANVAS BACKGROUND (Subtle, optimized WebGL/Canvas)                     */}
      {/* ========================================================================= */}
      <CivicNetworkCanvas className="h-[750px] lg:h-[840px] -z-0" />

      {/* Decorative Top Emerald Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-100/40 via-emerald-50/20 to-transparent pointer-events-none -z-10" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20 space-y-16 sm:space-y-24">
        
        {/* ===================================================================== */}
        {/* 1. HERO SECTION (Headline + Interactive Search + Direct Login)        */}
        {/* ===================================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start min-h-[540px]">
          
          {/* Left Column: Hero Text, Search Bar, CTAs & Small Login Window */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Official Initiative Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-brand-200/80 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
              <span className="text-xs font-bold text-slate-700 tracking-wide">
                Government of Jharkhand <span className="text-slate-300 mx-1">|</span> Civic Innovation Ecosystem
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-slate-900 leading-[1.12]">
                Solve Real Civic Challenges with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 via-emerald-600 to-teal-600">
                  Samadhan Connect
                </span>
              </h1>
              <p className="text-base sm:text-lg font-semibold font-display text-emerald-800/90 tracking-tight pt-1">
                Connecting Citizens, Innovators, Universities & Government across 24 Districts
              </p>
            </div>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Crowdsource localized community problems, collaborate on engineering prototypes, secure industry CSR funding, and track on-ground verification with <b>Samadhan AI (Google Gemini 2.5 Pro)</b> assistance.
            </p>

            {/* INTERACTIVE CIVIC PROBLEM SEARCH BAR */}
            <div className="bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-200/50 max-w-xl">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search civic problems, schemes, electricity, water..."
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-transparent border-none rounded-xl focus:outline-none focus:ring-0 text-slate-800 placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Suggested Search Pills */}
              <div className="flex items-center gap-1.5 pt-2 px-1 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 font-mono">
                  Popular:
                </span>
                {SUGGESTED_SEARCHES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestedClick(item.query)}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-800 border border-slate-200/70 hover:border-brand-300 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link to="/report-problem">
                <button className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-700 via-emerald-600 to-teal-600 shadow-md shadow-brand-600/25 hover:shadow-lg hover:shadow-brand-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer">
                  <span>+ Report a Local Problem</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </Link>

              <Link to="/messages">
                <button className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-2xs hover:bg-white hover:border-brand-400 hover:text-brand-700 hover:shadow-xs active:scale-[0.98] transition-all duration-200 cursor-pointer">
                  <Bot className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>Ask Samadhan AI</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </button>
              </Link>
            </div>

            {/* Micro Live Stats Bar */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>24 Districts Covered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>Google Gemini 2.5 Pro NLP Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>5-Phase Project Workspace</span>
              </div>
            </div>


          </div>

          {/* Right Column: Stylized Jharkhand Civic Holographic Visual */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <JharkhandHeroGraphic />
          </div>

        </section>

        {/* ===================================================================== */}
        {/* 2. SAMADHAN AI CIVIC SPOTLIGHT BANNER                                */}
        {/* ===================================================================== */}
        <ScrollReveal direction="up" delay={50}>
          <section className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold font-mono">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>OFFICIAL 25-DOMAIN CIVIC ASSISTANT</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                  Have questions about public schemes, electricity, agriculture, or citizen complaints?
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Ask <b>Samadhan AI</b>—the official assistant of Samadhan.Connect powered by Google Gemini 2.5 Pro. Get structured guidance, eligible subsidies, and grievance steps across all 25 supported civic domains.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {['🌾 Agriculture', '⚡ Electricity & Power', '🏛️ Govt Schemes', '📋 Citizen Complaints', '🆔 Aadhaar/Certificates', '🏥 Healthcare'].map((domain, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                      {domain}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end items-start lg:items-end">
                <Link to="/messages">
                  <button className="px-6 py-3 bg-gradient-to-r from-brand-500 to-emerald-400 hover:from-brand-400 hover:to-emerald-300 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer">
                    <Bot className="w-4 h-4" />
                    <span>Start Chat with Samadhan AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <span className="text-[11px] text-slate-400">Zero wait time • 24/7 Assistance</span>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ===================================================================== */}
        {/* 3. 5-STAKEHOLDER ROLE OVERVIEW CARDS                                  */}
        {/* ===================================================================== */}
        <ScrollReveal direction="up" delay={100}>
          <section className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/70 text-brand-800 text-xs font-bold uppercase tracking-wider font-mono">
                <Users className="w-3.5 h-3.5 text-brand-600" />
                Tailored for Every Stakeholder
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                One Unified Ecosystem, 5 Collaborative Roles
              </h2>
              <p className="text-sm text-slate-500">
                Select your persona upon first login to access personalized workspaces, tools, and telemetry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {ROLES_OVERVIEW.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 font-mono">
                          {item.tag}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-brand-700 transition-colors">
                        {item.role}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={item.link}
                        className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        <span>Explore Portal</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </ScrollReveal>

        {/* ===================================================================== */}
        {/* 4. CORE WORKFLOW CARDS SECTION                                        */}
        {/* ===================================================================== */}
        <ScrollReveal direction="up" delay={150}>
          <section className="pt-2">
            <FeatureCards />
          </section>
        </ScrollReveal>

        {/* ===================================================================== */}
        {/* 5. IMPACT & BENEFITS + ECOSYSTEM BANNER                               */}
        {/* ===================================================================== */}
        <ScrollReveal direction="up" delay={200}>
          <section className="pt-2">
            <ImpactSection />
          </section>
        </ScrollReveal>

      </div>
    </div>
  );
};

