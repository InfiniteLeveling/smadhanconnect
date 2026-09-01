import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CivicNetworkCanvas } from '../components/home/CivicNetworkCanvas';
import { JharkhandHeroGraphic } from '../components/home/JharkhandHeroGraphic';
import { FeatureCards } from '../components/home/FeatureCards';
import { ImpactSection } from '../components/home/ImpactSection';
import { 
  ArrowRight, 
  Sparkles, 
  Info, 
  UserCheck, 
  Compass, 
  Shield, 
  CheckCircle2, 
  Cpu, 
  Activity,
  Layers,
  Building
} from 'lucide-react';

export const HomePage = () => {
  const { profile } = useAuth();

  return (
    <div className="relative min-h-screen bg-slate-50/70 text-slate-900 overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 3D CANVAS BACKGROUND (Subtle, professional, optimized WebGL/Canvas)     */}
      {/* ========================================================================= */}
      <CivicNetworkCanvas className="h-[750px] lg:h-[820px] -z-0" />

      {/* Decorative Top Emerald Gradient Ray */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-100/40 via-emerald-50/20 to-transparent pointer-events-none -z-10" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-20 space-y-16 sm:space-y-24">
        
        {/* ===================================================================== */}
        {/* HERO SECTION (2-Column Layout with High Readability & 3D Parallax)    */}
        {/* ===================================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[540px]">
          
          {/* Left Column: Hero Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Official Initiative Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-brand-200/80 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
              <span className="text-xs font-bold text-slate-700 tracking-wide">
                Government of Jharkhand <span className="text-slate-300 mx-1">|</span> Civic Tech Ecosystem
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-slate-900 leading-[1.12]">
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 via-emerald-600 to-teal-600">
                  Samadhan Connect
                </span>
              </h1>
              <p className="text-lg sm:text-xl font-bold font-display text-emerald-800/90 tracking-tight pt-1">
                Civic Innovation & Problem-Solving Ecosystem for Jharkhand
              </p>
            </div>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              A unified platform connecting citizens, government, and innovators to solve real-world challenges with verified transparency and AI-assisted triage.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/report-problem">
                <button className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-700 via-emerald-600 to-teal-600 shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-500/35 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer">
                  <span>Report a Problem</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>

              <Link to="/challenges">
                <button className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-700 bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm hover:bg-white hover:border-brand-400 hover:text-brand-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer">
                  <Compass className="w-4 h-4 text-brand-600 group-hover:rotate-45 transition-transform duration-300" />
                  <span>Explore Challenges</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all duration-300" />
                </button>
              </Link>
            </div>

            {/* Evaluator Persona / Simulator Prompt Box */}
            <div className="pt-2 max-w-xl">
              {profile ? (
                <div className="p-4 sm:p-5 bg-white/90 backdrop-blur-md border border-brand-200/80 rounded-2xl flex items-center justify-between shadow-sm hover:border-brand-300 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={profile.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'}
                      alt={profile.full_name}
                      className="w-10 h-10 rounded-full border border-brand-400/60 bg-brand-50"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-brand-700 font-bold uppercase tracking-wider font-mono">
                          Active Evaluator Persona
                        </p>
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-base font-bold text-slate-900 leading-tight">
                        {profile.full_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {profile.organization || 'Citizen Member'} • {profile.district || 'Jharkhand'}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono bg-brand-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm">
                    {profile.role}
                  </span>
                </div>
              ) : (
                <div className="p-3.5 sm:p-4 bg-brand-50/90 backdrop-blur-md border border-brand-200/80 rounded-2xl flex items-center gap-3 text-slate-700 shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-brand-100/80 border border-brand-300/60 flex items-center justify-center text-brand-700 shrink-0">
                    <Info className="w-4 h-4 animate-bounce" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    Please select a role from the top simulator bar to experience role-based civic workflows.
                  </p>
                </div>
              )}
            </div>

            {/* Micro Live Stats Bar */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>24 Districts Covered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>AI NLP Triage Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>5-Phase Milestone Tracking</span>
              </div>
            </div>

          </div>

          {/* Right Column: Stylized Jharkhand Civic Holographic Visual */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <JharkhandHeroGraphic />
          </div>

        </section>

        {/* ===================================================================== */}
        {/* FOUR WORKFLOW CARDS SECTION                                           */}
        {/* ===================================================================== */}
        <section className="pt-6">
          <FeatureCards />
        </section>

        {/* ===================================================================== */}
        {/* IMPACT & BENEFITS + ECOSYSTEM BANNER                                  */}
        {/* ===================================================================== */}
        <section className="pt-4">
          <ImpactSection />
        </section>

        {/* ===================================================================== */}
        {/* TRUSTED GOVERNMENT FOOTER ACCENT                                     */}
        {/* ===================================================================== */}
        <footer className="pt-10 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-[10px]">
              JH
            </div>
            <span className="font-semibold text-slate-700">
              Samadhan.Connect — Department of Information Technology & e-Governance, Govt. of Jharkhand
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>SIH 2024–2026 Initiative</span>
            <span>•</span>
            <span>Zero-Knowledge Public Audit</span>
          </div>
        </footer>

      </div>
    </div>
  );
};
