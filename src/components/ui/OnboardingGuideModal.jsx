import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  PlusCircle, 
  Rocket, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X,
  Shield,
  Layers,
  MapPin,
  TrendingUp
} from 'lucide-react';

const ONBOARDING_STEPS = [
  {
    step: 1,
    title: 'Welcome to Samadhan.Connect',
    subtitle: 'Govt. of Jharkhand Civic Innovation Ecosystem',
    description: 'A unified platform connecting citizens, government, academia, and industry to solve real-world challenges across all 24 districts.',
    icon: Sparkles,
    badge: 'Civic Innovation',
    gradient: 'from-emerald-600 to-teal-700',
    highlight: 'Bridging public grievances with verified technical solutions and CSR backing.'
  },
  {
    step: 2,
    title: 'Explore Challenges',
    subtitle: '24 District Problem Marketplace',
    description: 'Discover verified problems in water sanitation, healthcare, smart mobility, agriculture, and climate. Filter by urgency or district.',
    icon: Compass,
    badge: 'Step 1 of Workflow',
    gradient: 'from-brand-600 to-emerald-600',
    highlight: 'Students and innovators can propose technical prototypes directly on open challenges.'
  },
  {
    step: 3,
    title: 'Report a Civic Problem',
    subtitle: 'AI-Powered Citizen Wizard',
    description: 'Submit civic issues in 3 simple steps. Our instant AI engine categorizes urgency and suggests remediation technologies with draft auto-saving.',
    icon: PlusCircle,
    badge: 'Step 2 of Workflow',
    gradient: 'from-teal-600 to-emerald-700',
    highlight: 'Never lose your progress with automatic local draft saving.'
  },
  {
    step: 4,
    title: 'Track Your Work in 5 Phases',
    subtitle: 'Interactive Project Workspace',
    description: 'Track active projects from Research & Design to Field Testing and IoT Deployment with interactive Kanban boards and live sensor telemetry.',
    icon: Rocket,
    badge: 'Step 3 of Workflow',
    gradient: 'from-emerald-700 to-teal-800',
    highlight: 'Real-time telemetry feeds for water quality and air particulate metrics.'
  },
  {
    step: 5,
    title: "You're Ready to Explore!",
    subtitle: 'Transparent & Collaborative Governance',
    description: 'Select your persona from the top bar or use the navigation links to start browsing challenges, submitting reports, or tracking projects.',
    icon: CheckCircle2,
    badge: 'All Set',
    gradient: 'from-green-600 to-emerald-600',
    highlight: 'You can reopen this tour anytime by clicking "Need Help?" in the top bar.'
  }
];

export const OnboardingGuideModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const stepData = ONBOARDING_STEPS[currentStep];
  const Icon = stepData.icon;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem('samadhan_onboarding_seen', 'true');
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    localStorage.setItem('samadhan_onboarding_seen', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-2xl shadow-emerald-950/20 p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-emerald-500 to-teal-500" />

        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close Tour"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator Pill */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200/60">
            Step {stepData.step} of 5 • {stepData.badge}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            First-Time User Tour
          </span>
        </div>

        {/* Graphic Icon & Title */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stepData.gradient} p-3.5 flex items-center justify-center text-white shadow-lg shadow-brand-600/20 shrink-0`}>
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold font-display text-slate-900 leading-tight">
                {stepData.title}
              </h3>
              <p className="text-xs font-semibold text-brand-700 mt-0.5">
                {stepData.subtitle}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {stepData.description}
          </p>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-xs text-emerald-900 font-medium leading-relaxed">
            💡 {stepData.highlight}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 my-6">
          {ONBOARDING_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-6 bg-brand-600 shadow-xs'
                  : idx < currentStep
                  ? 'w-2 bg-brand-300'
                  : 'w-2 bg-slate-200'
              }`}
              title={`Go to step ${s.step}`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2.5">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-600 shadow-md shadow-brand-600/25 hover:shadow-lg hover:shadow-brand-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{isLastStep ? 'Start Exploring' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
