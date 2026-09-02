import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  PhoneCall, 
  Sparkles, 
  Bot, 
  Compass, 
  GraduationCap, 
  TrendingUp, 
  ArrowUpRight, 
  Heart,
  HelpCircle,
  FileText,
  AlertTriangle
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 relative overflow-hidden mt-auto">
      {/* Decorative Subtle Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-7xl h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1: Brand & Overview (Col span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" onClick={scrollToTop} className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 via-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                SC
              </div>
              <div>
                <span className="text-xl font-extrabold font-display text-white tracking-tight flex items-center gap-1.5">
                  Samadhan<span className="text-emerald-400">.Connect</span>
                </span>
                <span className="block text-[10px] font-mono text-emerald-300/80 font-semibold tracking-wider uppercase">
                  Govt. of Jharkhand Civic Ecosystem
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An AI-assisted multi-stakeholder platform connecting citizens, student innovators, university faculty, CSR industry partners, and district nodal officers to solve civic challenges across all 24 districts of Jharkhand.
            </p>

            {/* Official Certification Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Dept. of IT & e-Governance Initiative</span>
            </div>
          </div>

          {/* Column 2: Platform Navigation (Col span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-brand-400" />
              Ecosystem Hubs
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/challenges" onClick={scrollToTop} className="hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                  <span>Explore 24-District Challenges</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link to="/report-problem" onClick={scrollToTop} className="hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                  <span>Report a Public Grievance</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link to="/projects" onClick={scrollToTop} className="hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                  <span>5-Phase Project Workspace</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link to="/universities" onClick={scrollToTop} className="hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                  <span>University Innovation Labs</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link to="/industries" onClick={scrollToTop} className="hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                  <span>Industry & CSR Grants Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link to="/analytics" onClick={scrollToTop} className="hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                  <span>Civic Analytics & District Telemetry</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Samadhan AI & Intelligence (Col span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              Samadhan AI
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official assistant powered by Google Gemini 2.5 Pro with 25 strict public service domains.
            </p>
            <Link
              to="/messages"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-800 to-emerald-800 hover:from-brand-700 hover:to-emerald-700 text-white border border-emerald-500/30 transition-all shadow-xs group"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span>Launch AI Chatbot</span>
            </Link>
          </div>

          {/* Column 4: Emergency Helplines & Support (Col span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              Citizen Emergency Lines
            </h4>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Police & Emergency</span>
                <span className="font-bold font-mono text-emerald-400 text-sm">Dial 112</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">State Citizen Helpline</span>
                <span className="font-bold font-mono text-emerald-400 text-sm">Dial 181</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Cybercrime Helpline</span>
                <span className="font-bold font-mono text-emerald-400 text-sm">Dial 1930</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Electricity Outage (JBVNL)</span>
                <span className="font-bold font-mono text-emerald-400 text-sm">Dial 1912</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {currentYear} Samadhan.Connect. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Govt. of Jharkhand Civic Innovation Framework</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-emerald-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-emerald-400 transition-colors cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-emerald-400 transition-colors cursor-pointer">RTI Transparency</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
