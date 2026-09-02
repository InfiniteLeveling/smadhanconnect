import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SmoothScrollProvider } from './context/SmoothScrollProvider';
import { RoleSelectionModal } from './components/auth/RoleSelectionModal';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { ScrollToTopButton } from './components/ui/ScrollToTopButton';
import { RoleGuard } from './components/layout/RoleGuard';
import { HomePage } from './pages/HomePage';
import { ReportProblemPage } from './pages/ReportProblemPage';
import { GovernmentDashboard } from './pages/dashboards/GovernmentDashboard';
import { AdminDashboardPage } from './pages/dashboards/AdminDashboardPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ChallengeDetailPage } from './pages/ChallengeDetailPage';
import { ProjectWorkspacePage } from './pages/ProjectWorkspacePage';
import { MessagingPage } from './pages/MessagingPage';
import { UniversitiesPage } from './pages/UniversitiesPage';
import { IndustriesPage } from './pages/IndustriesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SmoothScrollProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans relative">
            
            {/* Top Scroll Reading Progress Indicator */}
            <ScrollProgress />

            {/* Main Global Navigation Bar */}
            <Navbar />

            {/* Global First-Time Role Selection Onboarding Modal */}
            <RoleSelectionModal />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
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
                <Route 
                  path="/admin" 
                  element={
                    <RoleGuard allowedRoles={['ADMIN']}>
                      <AdminDashboardPage />
                    </RoleGuard>
                  } 
                />
              </Routes>
            </main>

            {/* Floating Scroll To Top Interactive Button */}
            <ScrollToTopButton />

            {/* Global Civic Tech Footer */}
            <Footer />
          </div>
        </SmoothScrollProvider>
      </AuthProvider>
    </Router>
  );
}




