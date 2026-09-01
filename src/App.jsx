import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleSwitcherBar } from './components/ui/RoleSwitcherBar';
import { Navbar } from './components/layout/Navbar';
import { RoleGuard } from './components/layout/RoleGuard';
import { ReportProblemPage } from './pages/ReportProblemPage';
import { GovernmentDashboard } from './pages/dashboards/GovernmentDashboard';
import { ChallengesPage } from './pages/ChallengesPage';
import { ChallengeDetailPage } from './pages/ChallengeDetailPage';
import { ProjectWorkspacePage } from './pages/ProjectWorkspacePage';
import { MessagingPage } from './pages/MessagingPage';
import { UniversitiesPage } from './pages/UniversitiesPage';
import { IndustriesPage } from './pages/IndustriesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

// Temporary home menu for Phase testing
const Home = () => {
  const { profile } = useAuth();
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-slate-900">Welcome to Samadhan Connect</h1>
        <p className="text-slate-600">Civic Innovation & Problem-Solving Ecosystem for Jharkhand</p>
      </div>

      {profile ? (
        <div className="p-5 bg-brand-50/80 border border-brand-200/80 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-brand-700 font-bold uppercase tracking-wider">Active Evaluator Persona</p>
            <p className="text-lg font-bold text-slate-900">{profile.full_name}</p>
            <p className="text-xs text-slate-500">{profile.organization || 'Citizen Member'} • {profile.district || 'Jharkhand'}</p>
          </div>
          <span className="font-mono bg-brand-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm">
            {profile.role}
          </span>
        </div>
      ) : (
        <p className="text-slate-500">Please select a role from the top simulator bar.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        <a 
          href="/report-problem" 
          className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-brand-500 hover:shadow-md transition-all group"
        >
          <h3 className="font-bold text-slate-900 group-hover:text-brand-600">1. Citizen Wizard &rarr;</h3>
          <p className="text-xs text-slate-500 mt-1">Submit civic challenges with draft auto-saving.</p>
        </a>

        <a 
          href="/dashboard/government" 
          className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-brand-500 hover:shadow-md transition-all group"
        >
          <h3 className="font-bold text-slate-900 group-hover:text-brand-600">2. Nodal Triage Queue &rarr;</h3>
          <p className="text-xs text-slate-500 mt-1">Verify citizen reports and assign urgency grades.</p>
        </a>

        <a 
          href="/challenges" 
          className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-brand-500 hover:shadow-md transition-all group"
        >
          <h3 className="font-bold text-slate-900 group-hover:text-brand-600">3. Challenge Marketplace &rarr;</h3>
          <p className="text-xs text-slate-500 mt-1">Discover 24 districts & propose solutions.</p>
        </a>

        <a 
          href="/projects/proj-001" 
          className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-brand-500 hover:shadow-md transition-all group"
        >
          <h3 className="font-bold text-slate-900 group-hover:text-brand-600">4. 5-Phase Project Workspace &rarr;</h3>
          <p className="text-xs text-slate-500 mt-1">Interactive Kanban & IoT telemetry feed.</p>
        </a>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
          {/* Top Role Simulator Quick-Switch Toolbar */}
          <RoleSwitcherBar />

          {/* Main Global Navigation Bar */}
          <Navbar />

          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
              <Route path="/projects/:id" element={<ProjectWorkspacePage />} />
              <Route path="/projects" element={<ProjectWorkspacePage />} />
              <Route path="/universities" element={<UniversitiesPage />} />
              <Route path="/industries" element={<IndustriesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/messages" element={<MessagingPage />} />
              <Route path="/report-problem" element={<ReportProblemPage />} />
              <Route 
                path="/dashboard/government" 
                element={
                  <RoleGuard allowedRoles={['GOVERNMENT', 'ADMIN']}>
                    <GovernmentDashboard />
                  </RoleGuard>
                } 
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}
