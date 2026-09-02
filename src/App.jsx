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

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { useLocation } from 'react-router-dom';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Role Simulator Quick-Switch Toolbar (Hidden on dedicated login/register page) */}
      {!isAuthPage && <RoleSwitcherBar />}

      {/* Main Global Navigation Bar (Hidden on dedicated login/register page) */}
      {!isAuthPage && <Navbar />}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
