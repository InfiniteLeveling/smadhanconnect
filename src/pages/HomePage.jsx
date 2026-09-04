import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CHALLENGES_DATA = [
  {
    id: 'jal-shakti-iot',
    category: 'Clean Water',
    ministry: 'Ministry of Jal Shakti',
    badgeClass: 'text-blue-300',
    daysLeft: '14 Days Left',
    statusPulse: true,
    trl: 'TRL 4 to 7',
    teams: '18 Teams Pledged',
    title: 'Smart IoT Water Quality Monitoring for Rural Aquifers',
    description: 'Design continuous multi-parameter telemetry for arsenic, fluoride, and salinity variations in sub-surface water reservoirs across 12 high-stress blocks.',
    tags: ['IoT Sensors', 'Clean Water', 'Hardware'],
    grant: '₹25,00,000',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAfRYwziFOA3enVINOHIm-8PLtOKO0byDhytzHvqQc8Vp_G0tXqvj6LR7m5-zFG7nkk2C5rKhLgFuxtuOZkJ9AZatiUq5u8AqV2OZqm_XN6LT4j-QkPuArysWZsHQuVz6GPCSf2TOG0hDHqHf0KIvWqQNo5z1Ec9QH5WccmDwnM5hYcpouQ-DyQZAOMILKyTcvMEFwmGrnbmpfCqM6iO2aCnBwO2H7VcRwakLOe7Hk3x_DQJ3O4wsE'
  },
  {
    id: 'solar-cold-storage',
    category: 'Renewable Energy',
    ministry: 'MNRE / Dept of Ag Jharkhand',
    badgeClass: 'text-amber-300',
    daysLeft: '21 Days Left',
    statusPulse: true,
    trl: 'TRL 5 to 8',
    teams: '12 Teams Pledged',
    title: 'Decentralized Solar Cold Storage for Tribal Farmers',
    description: 'Engineering a zero-freon micro-chiller preserving perishable horticulture yields for smallholders without 24x7 electrical grid access.',
    tags: ['Solar Tech', 'Rural AgTech', 'Microgrid'],
    grant: '₹40,00,000',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKgXpzdIfs06raYMwe71coxZyB5CHjGUQkTSedhKPHBBKjHOq9th673jUGYr7TIKyQMPNtLLsTZ0I85TA9qCFlXgYP31OG_iT0I9waD3Znjku8o_9j8SC17nLuC4dTMab06HVtFB-i2c-X28UTKlJ_8kbhd8RqEkHW04ciVf-n5WntOOA8tvMY6xjX2Pqu5YamcCyKBZR_LRdXJbQ0jmQjoyZoKaFpPcsHdh_smna5KQUqnercOBq7'
  },
  {
    id: 'ai-drain-drone',
    category: 'Urban Sanitation',
    ministry: 'MoHUA / Swachh Bharat',
    badgeClass: 'text-slate-200',
    daysLeft: 'Review Phase',
    statusPulse: false,
    trl: 'TRL 3 to 6',
    teams: '24 Teams Pledged',
    title: 'AI Drone-Assisted Plastic Waste Mapping in Urban Canals',
    description: 'Computer-vision aerial edge models deployed on low-cost drones to detect plastic choke-points before monsoonal urban flood hazards occur.',
    tags: ['Computer Vision', 'Sanitation', 'Drone Edge'],
    grant: '₹15,00,000',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB009hFsBfyG9KQAg1vz1x8_p9FQcigxugR6-UgZVPmF-vaPxe-I-bjlbGLRR-ck1nDGayNmMvH_zdlO5whjJte5tZ93UyP5QelJSgZOIc00qPLcrsTeaSTf_9jJyE1juXECymFD09OAJLJlN0ZEVsCkftItsz4mH5pVi9AO6T93KNfqHHg31j6FmKIc43o36pVDMdKYIKNTRpUgE2wDKwT9mm2H0tTN83F8AtP_hShOvG8BqscQAuz'
  }
];

const AI_KNOWLEDGE_BASE = {
  'clean water': {
    query: 'What are the clean water grant eligibility rules for colleges?',
    answer: 'Under Jal Shakti & DST guidelines, recognized engineering colleges with a designated faculty mentor can apply for up to ₹25 Lakhs. TRL 4+ prototype or lab bench model required for Stage 1 release.'
  },
  'report contamination': {
    query: 'How do I escalate an unresolved water contamination ticket?',
    answer: 'Citizen grievance #SAM-8942 triggers automatic escalation to the Superintending Engineer if field inspection is not logged within 72 hours under State Public Service Guarantee rules.'
  },
  'college eligibility': {
    query: 'Can non-IIT engineering colleges apply for MNRE seed grants?',
    answer: 'Yes! Any AICTE/UGC accredited institute with an active Institution Innovation Council (IIC) is 100% eligible. Multi-college student teams are actively encouraged.'
  },
  'track ticket': {
    query: 'Check status of Ticket #SAM-2026-8942',
    answer: 'Ticket #SAM-8942: Active In-Progress. NDMC Water Works & IIT Delhi testing prototype telemetry. Expected completion: 48 hours.'
  }
};

export const HomePage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('All');
  const [aiQuery, setAiQuery] = useState('');
  const [aiTerminalHistory, setAiTerminalHistory] = useState([
    {
      query: 'Grant eligibility for student teams without registered firm?',
      answer: 'Recognized university incubators can act as fiscal sponsor. Grants up to ₹25L disburse directly via DSIR / Nodal Academic Partner escrow accounts.'
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const categories = ['All', 'Clean Water', 'Renewable Energy', 'Smart Agriculture', 'Urban Sanitation'];

  const filteredChallenges = activeCategory === 'All'
    ? CHALLENGES_DATA
    : CHALLENGES_DATA.filter(c => c.category === activeCategory);

  const handleAiSubmit = (e) => {
    if (e) e.preventDefault();
    if (!aiQuery.trim()) return;

    const trimmed = aiQuery.trim().toLowerCase();
    setIsAiTyping(true);

    // Check knowledge base
    let matchedAnswer = 'Dispatched to Samadhan AI Core. Query logged with district nodal cell for official response within 24 hours.';
    for (const [key, item] of Object.entries(AI_KNOWLEDGE_BASE)) {
      if (trimmed.includes(key) || key.includes(trimmed)) {
        matchedAnswer = item.answer;
        break;
      }
    }

    setTimeout(() => {
      setAiTerminalHistory(prev => [
        ...prev,
        { query: aiQuery, answer: matchedAnswer }
      ]);
      setAiQuery('');
      setIsAiTyping(false);
    }, 450);
  };

  const handlePromptChipClick = (promptKey) => {
    const item = AI_KNOWLEDGE_BASE[promptKey];
    if (item) {
      setAiQuery(item.query);
      setIsAiTyping(true);
      setTimeout(() => {
        setAiTerminalHistory(prev => [
          ...prev,
          { query: item.query, answer: item.answer }
        ]);
        setAiQuery('');
        setIsAiTyping(false);
      }, 350);
    }
  };

  return (
    <div className="w-full bg-[#0B0F19] text-slate-100 min-h-screen relative overflow-hidden font-sans">
      
      {/* ===================================================================== */}
      {/* ATMOSPHERIC RADIAL AMBIENT LIGHTS                                     */}
      {/* ===================================================================== */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[64rem] h-[36rem] bg-gradient-to-b from-emerald-500/15 via-emerald-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[48rem] -right-32 w-[38rem] h-[38rem] bg-blue-600/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[80rem] -left-32 w-[34rem] h-[34rem] bg-purple-600/10 blur-3xl pointer-events-none -z-10" />

      {/* ===================================================================== */}
      {/* 1. TOP ANNOUNCEMENT PILL                                              */}
      {/* ===================================================================== */}
      <div className="w-full pt-6 pb-3 px-4 sm:px-6 lg:px-8 flex justify-center">
        <Link
          to="/challenges"
          className="group inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-950/50 hover:border-emerald-400/60 transition-all duration-300 -translate-y-0.5"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🇮🇳</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <span className="text-slate-200 text-xs sm:text-sm font-medium">
            <strong className="text-emerald-300 font-bold font-display">National Innovation Challenge 2026 Live</strong>
            <span className="hidden md:inline text-slate-400"> — ₹50 Lakhs in Seed Grants for University & Civic Prototypes</span>
          </span>
          <span className="material-symbols-outlined text-emerald-400 text-[18px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </Link>
      </div>

      {/* ===================================================================== */}
      {/* 2. KINETIC HERO SECTION                                               */}
      {/* ===================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center flex flex-col items-center">
        
        {/* Nodal Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 mb-5">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">verified</span>
          <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold font-mono">
            Nodal Governance & High-Tech R&D Mesh
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white max-w-4xl tracking-tight leading-[1.08] mb-6">
          Where National Challenges Meet{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
            Groundbreaking Innovators
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          Directly connecting Government Ministries, University R&D Labs, CSR Industry Funds, and Student Innovators to co-solve India’s most urgent civic bottlenecks with measurable proof.
        </p>

        {/* Dual Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10">
          <Link
            to="/challenges"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:-translate-y-0.5 active:scale-[0.97] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">bolt</span>
            <span>Solve Challenges</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
          <Link
            to="/report-problem"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 font-semibold shadow-sm hover:shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-rose-400 text-[20px]">emergency</span>
            <span>Report an Issue</span>
          </Link>
        </div>

        {/* Social Proof Avatar Cluster */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0F172A]/80 border border-slate-800/80 px-5 py-3 rounded-full shadow-lg backdrop-blur-md">
          <div className="flex -space-x-3 overflow-hidden">
            <img
              className="inline-block h-9 w-9 rounded-full ring-2 ring-slate-800 object-cover"
              alt="Indian university engineer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA76dJnkLCWNs9GPDfpJVqOrf2dhHmZ0bfMQC4KVe1Om0TQnaST6Ane0-tDd9OTYh824ve5yWjCKNd56XpSG-6XNr3ba6JOEAMOZPm3XdERZlqeNXHvBw0DU8VPjWwx3yrHyP3h-w7fa2gFWw6oVAeuJmonkyRFBSWyRdHv4Hksu9reNG5m0YCuoTY0QwkNXqXqJChgqyFFZ8Sq54rGMZzXNaQDYLgaCX-H7apGFEF-M3ran7CD4kAR"
            />
            <img
              className="inline-block h-9 w-9 rounded-full ring-2 ring-slate-800 object-cover"
              alt="Indian male researcher"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtOV8MFHQ0W-J9OGSlfOnPA9ySm6AHGN3zjknSOxlav8oEegmjYDd_8brPV9lPRYyjD814ecpgwyuw_bVFU0ZK2FGLcJwodbHqttmUYyt4Rp4tLdObAm8suvyXL_9mqok2OvC_GS9vB5mDW7nXMkpba1TXfRUMR0vj6vhZXB4akKCnlqbdxnvfOX9XlCOCP1qcH5Ykv_g6Ax6aIKPpLaEL9ncL_Hgqoy8Y2gw3lApbcnwhlWOSnErV"
            />
            <img
              className="inline-block h-9 w-9 rounded-full ring-2 ring-slate-800 object-cover"
              alt="Senior state nodal officer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUL_-ecPm0rfOxoGwDb6RLbxYFbCqDe2txHhpypY4UUmIwqJ_u7R34kgG8lbdFgdUguokxTFIiXVFia2IevYsgYsuzMu745nyvmZoleG8luLAjwH6b2nxDXjpaRBo0r6EHFeju-djdWzzJ7GLGk95B4vPEzrov64wQo13XHEYkaC8pHZGTX4gLqS1Why2hKjb2_sPdu0oqHy8Ir1qXLbmacPtZzGcM7w0ep3cnbmFGwfbhjZgKod4b"
            />
            <img
              className="inline-block h-9 w-9 rounded-full ring-2 ring-slate-800 object-cover"
              alt="Civic tech software innovator"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUwvbfKmGYkcHz96ZOmTWrW1DWCGBgJCJDJi-ggg2IEiOdDVj9tbGWjM-696mcsW6iDAwKcIqphIAPAoszkO02iY6pQ52xkgpnlphs3p2rygfJCZmxaCuUrDy_2tQr5JmXg4v9KbEUJWRtNnzmuyggjfk9auCaap4vmpJI0EZBebk6zZ2YzRbOOTbfJ_7k5_lCZULoJdjsv9cn5SVyhOqeRytf5Fevw3w7sV8suIE_cH6CpUYWYgUd"
            />
          </div>
          <div className="flex items-center gap-2 text-left">
            <div className="flex text-amber-400 text-sm">
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="material-symbols-outlined text-[18px]">star_half</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm font-medium">
              Joined by <strong className="text-white font-bold">3,400+ innovators</strong> across <strong className="text-white font-bold">140+ colleges</strong> & 24 districts
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. LIVE ACTIVITY TICKER (MARQUEE)                                     */}
      {/* ===================================================================== */}
      <div className="w-full bg-[#0A0E17] border-y border-slate-800/80 text-slate-300 py-3 overflow-hidden shadow-inner flex items-center">
        <div className="shrink-0 flex items-center gap-2 px-4 bg-[#0A0E17] z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">
            LIVE TELEMETRY
          </span>
        </div>
        <div className="relative w-full overflow-hidden flex whitespace-nowrap">
          <div className="flex items-center gap-8 animate-marquee text-xs sm:text-sm font-mono text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <span className="text-amber-400">⚡</span> Ministry of Jal Shakti posted <strong className="text-white">"Smart IoT Water Quality Monitoring"</strong> (<span className="text-emerald-400 font-mono">₹25L Grant</span>)
            </span>
            <span className="text-slate-700">•</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-indigo-400">🎓</span> IIT Madras team submitted prototype for <strong className="text-white">"AI Crop Disease Detection"</strong>
            </span>
            <span className="text-slate-700">•</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-blue-400">🏛️</span> Ranchi Municipal Corp verified Problem <strong className="text-emerald-400 font-mono">#SAM-8942</strong>
            </span>
            <span className="text-slate-700">•</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-emerald-400">✅</span> 1,240 Verified Civic Problems Solved
            </span>
            <span className="text-slate-700">•</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-yellow-400">💰</span> <span className="text-emerald-400 font-mono">₹18.5 Cr</span> Grants Committed via CSR Channels
            </span>
            <span className="text-slate-700">•</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-pink-400">🛰️</span> ISRO Bhuvan Spatial Sync active across 24 Districts
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. 4-STAT METRIC IMPACT BAR                                           */}
      {/* ===================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1 */}
          <div className="group relative p-6 rounded-2xl bg-[#0F172A]/80 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-[#152238] shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-emerald-400 text-3xl">task_alt</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
                88% Solved
              </span>
            </div>
            <div className="font-display text-3xl font-bold text-white mb-1">1,240+</div>
            <p className="text-slate-200 font-semibold text-sm">Civic Problems Solved</p>
            <p className="text-xs text-slate-400 mt-1">Direct ground resolution across 24 regional districts</p>
            <div className="w-full bg-slate-800/90 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative p-6 rounded-2xl bg-[#0F172A]/80 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-[#152238] shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-blue-400 text-3xl">payments</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 font-mono text-xs">
                ₹12.4 Cr Disbursed
              </span>
            </div>
            <div className="font-display text-3xl font-bold text-emerald-400 font-mono mb-1">₹18.5 Cr</div>
            <p className="text-slate-200 font-semibold text-sm">Total Grants Committed</p>
            <p className="text-xs text-slate-400 mt-1">Funded via verified corporate CSR & Nodal innovation corpus</p>
            <div className="w-full bg-slate-800/90 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '67%' }} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative p-6 rounded-2xl bg-[#0F172A]/80 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-[#152238] shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-indigo-400 text-3xl">science</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 font-mono text-xs">
                TRL 4 to 8
              </span>
            </div>
            <div className="font-display text-3xl font-bold text-white mb-1">340+</div>
            <p className="text-slate-200 font-semibold text-sm">University Labs Engaged</p>
            <p className="text-xs text-slate-400 mt-1">Active faculty PI nodes from premier IITs, NITs & State Unis</p>
            <div className="w-full bg-slate-800/90 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '82%' }} />
            </div>
          </div>

          {/* Card 4 */}
          <div className="group relative p-6 rounded-2xl bg-[#0F172A]/80 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-[#152238] shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-amber-400 text-3xl">thumb_up</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 font-mono text-xs">
                Field Audited
              </span>
            </div>
            <div className="font-display text-3xl font-bold text-white mb-1">96.4%</div>
            <p className="text-slate-200 font-semibold text-sm">Citizen Satisfaction</p>
            <p className="text-xs text-slate-400 mt-1">Independently audited post-deployment verification rate</p>
            <div className="w-full bg-slate-800/90 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: '96%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. 4-PILLAR ECOSYSTEM BENTO GRID                                      */}
      {/* ===================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono uppercase tracking-wider mb-2 font-semibold">
              Coordinated Civic Engine
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-white font-bold">
              The 4-Pillar Innovation Quad
            </h2>
          </div>
          <p className="text-slate-300 text-sm sm:text-base max-w-md mt-2 md:mt-0 font-normal">
            Breaking traditional governance silos through a synchronized multi-stakeholder protocol.
          </p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Box 1 (Large 7-Col): Government RFPs & Nodal Challenges */}
          <div className="lg:col-span-7 bg-[#0F172A]/80 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-[#152238] rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group backdrop-blur-sm">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-950/80 border border-blue-500/30 text-blue-400 flex items-center justify-center text-3xl shadow-sm">
                  🏛️
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 font-mono text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  48 Active National Challenges
                </div>
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
                Pillar 01 • Institutional Demand
              </span>
              <h3 className="font-display text-2xl font-bold text-white mt-1 mb-3">
                Government RFPs & Nodal Challenges
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Ministries and municipal bodies publish time-critical civic challenges with committed grants, pre-approved testbeds, and direct fast-track procurement pathways under GFR Rule 194.
              </p>

              {/* Sample Nodal Countdown Card */}
              <div className="bg-[#080D1A] border border-slate-800/80 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>PRIORITY PROCUREMENT POOL</span>
                  <span className="text-rose-400 flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[14px]">timer</span> CLOSING IN 4 DAYS
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-sm font-bold text-white">Ranchi Municipal: Smart Greywater Recycling RFP</p>
                    <p className="text-xs text-slate-400 font-mono">Escrow Corpus: <span className="text-emerald-400 font-mono">₹35,00,000</span> • Pilot Target: Ward 14-22</p>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300 font-mono text-xs bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl shadow-inner">
                    <span className="font-bold text-white">04</span>d : <span className="font-bold text-white">18</span>h : <span className="font-bold text-white">42</span>m
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
              <Link
                to="/challenges"
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 hover:gap-3 transition-all font-semibold"
              >
                <span>Explore Ministry RFPs</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <span className="font-mono text-xs text-slate-500">GFR 194 Compliant</span>
            </div>
          </div>

          {/* Box 2 (5-Col): University & Student Innovation */}
          <div className="lg:col-span-5 bg-[#0F172A]/80 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-[#152238] rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group backdrop-blur-sm">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-3xl shadow-sm">
                  🎓
                </div>
                <span className="px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-semibold">
                  340+ Academic Labs
                </span>
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                Pillar 02 • R&D Capability
              </span>
              <h3 className="font-display text-xl font-bold text-white mt-1 mb-3">
                University & Student Labs
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Student and faculty research teams transform raw concepts into field-deployable hardware and software with institutional IP protection and mentor backing.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-3 text-xs text-slate-200 bg-[#080D1A] border border-slate-800/80 p-3 rounded-xl">
                  <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified_user</span>
                  <span>Fast-track Indian Patent (IPO) Civic filing waivers</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200 bg-[#080D1A] border border-slate-800/80 p-3 rounded-xl">
                  <span className="material-symbols-outlined text-emerald-400 text-[18px]">memory</span>
                  <span>Direct access to 48 District Hardware Maker-Pods</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800/80">
              <Link
                to="/universities"
                className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 hover:gap-3 transition-all font-semibold"
              >
                <span>View Participating Campuses</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Box 3 (5-Col): Industry & CSR Grants */}
          <div className="lg:col-span-5 bg-[#0F172A]/80 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-[#152238] rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group backdrop-blur-sm">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-500/30 text-purple-400 flex items-center justify-center text-3xl shadow-sm">
                  🏭
                </div>
                <span className="px-3 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 font-mono text-xs font-semibold">
                  Section 135 Compliant
                </span>
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                Pillar 03 • Commercial Scale
              </span>
              <h3 className="font-display text-xl font-bold text-white mt-1 mb-3">
                Industry & CSR Co-Pilots
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Enterprise partners allocate mandatory corporate CSR allocations directly into milestone-based civic tech deployments with real-time auditability.
              </p>
              <div className="p-4 rounded-2xl bg-[#080D1A] border border-slate-800/80 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">Total CSR Pool 2025-26</span>
                  <span className="font-mono text-xs text-emerald-400 font-bold">78% Committed</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full" style={{ width: '78%' }} />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
                  <span>Pledged: <span className="text-emerald-400 font-mono">₹24.0 Cr</span></span>
                  <span>Available: <span className="text-emerald-400 font-mono">₹5.5 Cr</span></span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800/80">
              <Link
                to="/industries"
                className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 hover:gap-3 transition-all font-semibold"
              >
                <span>Pledge CSR Support</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Box 4 (7-Col): Citizen Voice & Geotagging */}
          <div className="lg:col-span-7 bg-[#0F172A]/80 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-[#152238] rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group backdrop-blur-sm" id="quick-report">
            <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl shadow-sm">
                  👨‍🌾
                </div>
                <span className="px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-semibold">
                  60-Second Lodging
                </span>
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Pillar 04 • Grassroots Ground Truth
              </span>
              <h3 className="font-display text-2xl font-bold text-white mt-1 mb-3">
                Citizen Voice & Geotagged Reports
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Citizens pinpoint real infrastructure failures with camera proofs and GPS. AI auto-categorizes problems and assigns tickets directly to the nodal engineer in charge.
              </p>

              {/* 3-Step Wizard Preview Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="bg-[#080D1A] border border-slate-800/80 p-3 rounded-xl flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-mono text-xs flex items-center justify-center font-bold">1</span>
                  <span className="text-xs font-medium text-slate-200">Photo & Voice Input</span>
                </div>
                <div className="bg-[#080D1A] border border-slate-800/80 p-3 rounded-xl flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-mono text-xs flex items-center justify-center font-bold">2</span>
                  <span className="text-xs font-medium text-slate-200">Auto GPS Telemetry</span>
                </div>
                <div className="bg-[#080D1A] border border-slate-800/80 p-3 rounded-xl flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-mono text-xs flex items-center justify-center font-bold">3</span>
                  <span className="text-xs font-medium text-slate-200">Nodal SLA Dispatch</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
              <Link
                to="/report-problem"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all font-semibold text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
                <span>Submit a Civic Issue</span>
              </Link>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">lock_clock</span>
                <span>Median Resolution: <strong className="text-emerald-400 font-mono">72 Hours</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. FEATURED HIGH-IMPACT RFPs                                          */}
      {/* ===================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="challenges">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono uppercase tracking-wider mb-2 font-semibold">
              Open Request for Proposals
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-white font-bold">
              Featured High-Impact RFPs
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 mt-4 md:mt-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl font-semibold text-xs whitespace-nowrap transition-all shadow-sm ${
                  activeCategory === cat
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80'
                }`}
              >
                {cat === 'All' ? 'All Challenges (48)' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Array */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredChallenges.map(challenge => (
            <div
              key={challenge.id}
              className="bg-[#0F172A] border border-slate-800 hover:border-emerald-500/50 hover:bg-[#152238] rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Thumbnail */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  alt={challenge.title}
                  src={challenge.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/40" />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full bg-[#0F172A]/90 border border-slate-700 backdrop-blur-md font-mono text-xs font-semibold shadow-sm ${challenge.badgeClass}`}>
                    {challenge.ministry}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold shadow-sm flex items-center gap-1 ${
                    challenge.statusPulse
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-amber-500 text-slate-950'
                  }`}>
                    {challenge.statusPulse && (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                    )}
                    {challenge.daysLeft}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
                    <span>{challenge.trl}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">{challenge.teams}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-3 line-clamp-2">
                    {challenge.title}
                  </h3>
                  <p className="text-slate-300 text-sm mb-5 line-clamp-3 leading-relaxed">
                    {challenge.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {challenge.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/50 font-mono text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Grant & CTA */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
                      Grand Grant
                    </span>
                    <span className="font-display text-lg font-bold text-emerald-400 font-mono">
                      {challenge.grant}
                    </span>
                  </div>
                  <Link
                    to="/challenges"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs transition-colors shadow-sm font-semibold"
                  >
                    <span>Submit Solution</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 7. SAMADHAN AI COPILOT TEASER & INTERACTIVE TERMINAL                   */}
      {/* ===================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-[#080D1A] via-[#0F172A] to-[#052317] border border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs uppercase tracking-wider mb-4 backdrop-blur-md">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">smart_toy</span>
                Official 25-Domain Civic Assistant
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-white font-bold mb-4">
                Instant Guidance for Innovators, Officials & Citizens
              </h2>
              <p className="text-slate-300 text-base mb-6 leading-relaxed">
                Trained on 45,000+ state government resolutions, GFR procurement mandates, CSR Section 135 statutes, and district geotag datasets.
              </p>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Try asking:</span>
                <button
                  type="button"
                  onClick={() => handlePromptChipClick('clean water')}
                  className="px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs transition-colors cursor-pointer"
                >
                  "Clean Water Grants"
                </button>
                <button
                  type="button"
                  onClick={() => handlePromptChipClick('report contamination')}
                  className="px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs transition-colors cursor-pointer"
                >
                  "Report Contamination"
                </button>
                <button
                  type="button"
                  onClick={() => handlePromptChipClick('college eligibility')}
                  className="px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs transition-colors cursor-pointer"
                >
                  "College Eligibility"
                </button>
                <button
                  type="button"
                  onClick={() => handlePromptChipClick('track ticket')}
                  className="px-3 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-mono transition-colors cursor-pointer"
                >
                  "Track #SAM-8942"
                </button>
              </div>
            </div>

            {/* AI Interactive Terminal Window */}
            <div className="w-full lg:w-[28rem] bg-[#070B14] rounded-2xl p-5 border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-display text-xs font-bold text-white uppercase tracking-wider">
                    Samadhan AI CoPilot v2.4
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Gov.jh.in Gateway</span>
              </div>

              {/* Scrollable Conversation Terminal */}
              <div className="bg-[#050810] border border-slate-800/60 rounded-xl p-4 mb-4 text-xs font-mono text-slate-300 space-y-3 max-h-56 overflow-y-auto">
                {aiTerminalHistory.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-emerald-400 font-mono">&gt; Query: "{item.query}"</p>
                    <p className="text-slate-200 leading-relaxed">&gt; Answer: {item.answer}</p>
                  </div>
                ))}
                {isAiTyping && (
                  <p className="text-emerald-400/80 animate-pulse font-mono">&gt; Processing query via GovAI model...</p>
                )}
              </div>

              {/* Form Input */}
              <form onSubmit={handleAiSubmit} className="flex gap-2">
                <input
                  id="ai-input"
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask eligibility, track tickets, or RFP criteria..."
                  className="flex-1 bg-[#090E1A] border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)] cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 8. CITIZEN QUICK ACTION CTA BANNER                                    */}
      {/* ===================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#042f2e] to-[#022c22] border border-emerald-600/30 text-white p-8 sm:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute -right-16 -bottom-16 text-emerald-400/5 pointer-events-none select-none">
            <span className="material-symbols-outlined text-[320px]">verified</span>
          </div>
          <div className="max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-emerald-300 text-xs font-mono uppercase tracking-wider mb-3 font-semibold">
              <span className="material-symbols-outlined text-[16px]">campaign</span>
              Grassroots Resolution Service
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-white font-bold leading-tight mb-3">
              Spot a civic problem in your ward or village?
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed font-normal">
              Get it resolved with verified government accountability in 60 seconds. Every report is immutably timestamped and linked to district executive SLAs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10 w-full md:w-auto shrink-0">
            <Link
              to="/report-problem"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:scale-[0.97] transition-all"
            >
              <span className="material-symbols-outlined text-rose-500 text-[20px]">photo_camera</span>
              <span>Report with GPS & Photos</span>
            </Link>
            <Link
              to="/challenges"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-emerald-500/40 text-emerald-200 hover:text-white text-sm font-semibold transition-all"
            >
              <span className="material-symbols-outlined text-[20px] text-emerald-400">dashboard</span>
              <span>View Open Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 9. FLOATING SAMADHAN AI COPILOT BUTTON                                */}
      {/* ===================================================================== */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('ai-input');
            if (el) {
              el.focus();
              window.scrollTo({
                top: el.getBoundingClientRect().top + window.scrollY - 200,
                behavior: 'smooth'
              });
            }
          }}
          className="group relative flex items-center gap-3 px-5 py-3 rounded-full bg-[#0F172A] text-white shadow-2xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-300 border border-slate-700 cursor-pointer"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">smart_toy</span>
          <span className="text-xs font-bold tracking-wide font-display">Ask Samadhan AI</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] hidden sm:inline border border-emerald-800">
            24/7 Nodal
          </span>
        </button>
      </div>

    </div>
  );
};
