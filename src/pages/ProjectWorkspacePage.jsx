import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getProjectById, 
  getProjectTasks, 
  createTask, 
  updateTaskStatus, 
  advanceProjectPhase,
  getProjectSponsorships,
  pledgeSponsorship
} from '../services/dataService';
import { FivePhaseTracker } from '../components/projects/FivePhaseTracker';
import { KanbanBoard } from '../components/projects/KanbanBoard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import confetti from 'canvas-confetti';
import { 
  Rocket, 
  MapPin, 
  Building2, 
  Users, 
  IndianRupee, 
  Activity, 
  Layers, 
  ArrowLeft,
  Sparkles,
  HeartHandshake,
  CheckCircle,
  Wifi,
  Cpu,
  Clock
} from 'lucide-react';

export const ProjectWorkspacePage = () => {
  const { id } = useParams();
  const { profile } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [activeTab, setActiveTab] = useState('KANBAN');
  const [loading, setLoading] = useState(true);
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [pledgeAmount, setPledgeAmount] = useState('50000');

  // Simulated IoT Telemetry Live State
  const [telemetry, setTelemetry] = useState({
    fluorideLevel: 0.42,
    flowRate: 48.5,
    tdsLevel: 142,
    solarVoltage: 24.8,
    lastPing: 'Just now'
  });

  const loadProjectData = async () => {
    setLoading(true);
    try {
      const proj = await getProjectById(id || 'proj-001');
      setProject(proj);
      const t = await getProjectTasks(proj?.id);
      setTasks(t);
      const s = await getProjectSponsorships(proj?.id);
      setSponsorships(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [id]);

  // Telemetry real-time simulator interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry(prev => ({
        fluorideLevel: Number((0.35 + Math.random() * 0.15).toFixed(2)),
        flowRate: Number((45 + Math.random() * 8).toFixed(1)),
        tdsLevel: Math.floor(135 + Math.random() * 15),
        solarVoltage: Number((24.2 + Math.random() * 1.2).toFixed(1)),
        lastPing: new Date().toLocaleTimeString()
      }));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleAdvancePhase = async (newPhase) => {
    try {
      await advanceProjectPhase(project.id, newPhase);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      await loadProjectData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      const updated = await getProjectTasks(project.id);
      setTasks(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      const updated = await getProjectTasks(project.id);
      setTasks(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePledgeCSR = async (e) => {
    e.preventDefault();
    try {
      await pledgeSponsorship(project.id, profile, pledgeAmount);
      confetti({
        particleCount: 100,
        spread: 70
      });
      setShowPledgeModal(false);
      await loadProjectData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-slate-500">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 mx-auto mb-4"></div>
        Loading Project Workspace...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={Rocket}
          title="No Active Project Found"
          description="Interesting civic problems are waiting to be solved. Explore an open challenge in Jharkhand and propose your innovative solution."
          actionText="Explore Challenges"
          actionLink="/challenges"
          secondaryActionText="Report a Problem"
          secondaryActionLink="/report-problem"
        />
      </div>
    );
  }

  const canAdvance = ['STUDENT', 'UNIVERSITY', 'GOVERNMENT', 'ADMIN'].includes(profile?.role);
  const isIndustry = profile?.role === 'INDUSTRY' || profile?.role === 'ADMIN';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link 
          to="/challenges" 
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Challenges
        </Link>

        {isIndustry && (
          <Button 
            variant="primary" 
            size="sm" 
            icon={HeartHandshake}
            onClick={() => setShowPledgeModal(true)}
          >
            Pledge CSR Grant
          </Button>
        )}
      </div>

      {/* Project Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-brand-500/20 text-brand-300 border border-brand-500/40 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-brand-400" />
                Active Civic Project #{project?.id}
              </span>
              <span className="text-slate-400 text-xs font-medium">
                District: {project?.district_name || 'Palamu'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
              {project?.title}
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl">
              {project?.objective}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
            <span className="text-xs text-slate-400 font-medium">CSR Funding Mobilized</span>
            <span className="text-2xl font-bold font-display text-emerald-400">
              ₹{project?.funding_pledged?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Team Meta Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-400" />
            <div>
              <p className="text-slate-400 font-semibold">Lead Investigator</p>
              <p className="font-bold text-white mt-0.5">{project?.lead_name || 'Pooja Kumari'} ({project?.lead_org || 'BIT Mesra'})</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <div>
              <p className="text-slate-400 font-semibold">Faculty Mentor</p>
              <p className="font-bold text-white mt-0.5">{project?.mentor_name || 'Dr. Arvind Verma (IIT ISM)'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-slate-400 font-semibold">Active Milestone Phase</p>
              <p className="font-bold text-amber-400 mt-0.5">{project?.current_phase}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Phase Lifecycle Tracker */}
      <FivePhaseTracker 
        currentPhase={project?.current_phase} 
        onAdvancePhase={handleAdvancePhase}
        canAdvance={canAdvance}
      />

      {/* Workspace Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'KANBAN', label: 'Sprint Kanban Board', icon: Layers },
          { id: 'TELEMETRY', label: 'Live IoT Telemetry Feed', icon: Wifi },
          { id: 'OVERVIEW', label: 'CSR & Sponsorship Grants', icon: HeartHandshake },
          { id: 'TEAM', label: 'Team & Mentorship', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Kanban Sprint Board */}
      {activeTab === 'KANBAN' && (
        <KanbanBoard
          tasks={tasks}
          onUpdateStatus={handleUpdateTaskStatus}
          onCreateTask={handleCreateTask}
          projectId={project?.id}
        />
      )}

      {/* Tab 2: Live IoT Telemetry Simulator */}
      {activeTab === 'TELEMETRY' && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Field Kiosk Telemetry • Live GSM Stream
                </span>
              </div>
              <h3 className="text-xl font-bold font-display">Palamu Unit #1 Ion Monitoring Station</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Last Sensor Packet: {telemetry.lastPing}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase">Residual Fluoride Ion</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">{telemetry.fluorideLevel}</span>
                <span className="text-xs text-slate-400">mg/L (WHO Safe: &lt;1.0)</span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${(telemetry.fluorideLevel / 1.5) * 100}%` }}></div>
              </div>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase">Filtration Flow Rate</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-cyan-400 font-mono">{telemetry.flowRate}</span>
                <span className="text-xs text-slate-400">Liters / Hr</span>
              </div>
              <p className="text-[11px] text-slate-400">Optimal column velocity</p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase">Total Dissolved Solids (TDS)</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-brand-400 font-mono">{telemetry.tdsLevel}</span>
                <span className="text-xs text-slate-400">PPM (Pure)</span>
              </div>
              <p className="text-[11px] text-slate-400">Potable drinking standard</p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <p className="text-xs text-slate-400 font-semibold uppercase">Solar Battery Bus</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-400 font-mono">{telemetry.solarVoltage}</span>
                <span className="text-xs text-slate-400">Volts DC</span>
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Fully Charged
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: CSR Sponsorships */}
      {activeTab === 'OVERVIEW' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold font-display text-slate-900">
                Corporate CSR & Innovation Grants
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Funding pledged by industry partners for trial deployment.
              </p>
            </div>

            <Button 
              variant="primary" 
              size="sm" 
              icon={HeartHandshake}
              onClick={() => setShowPledgeModal(true)}
            >
              Pledge CSR Grant
            </Button>
          </div>

          <div className="space-y-4">
            {sponsorships.map((s) => (
              <div key={s.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-500 text-white rounded-xl">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{s.sponsor_name}</p>
                    <p className="text-xs text-slate-500">Representative: {s.sponsor_rep}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-700 font-display">₹{s.amount?.toLocaleString('en-IN')}</p>
                  <StatusBadge status={s.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Team & Mentorship */}
      {activeTab === 'TEAM' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold font-display text-slate-900">Innovation Team Members</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Pooja Kumari</p>
                  <p className="text-xs text-slate-500">BIT Mesra • Lead Chemical Engineering Researcher</p>
                </div>
                <span className="text-xs font-bold bg-brand-100 text-brand-800 px-2.5 py-1 rounded-md">Project Lead</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Rohan Sharma</p>
                  <p className="text-xs text-slate-500">BIT Mesra • Mechanical Hardware Fabricator</p>
                </div>
                <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md">Member</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold font-display text-slate-900">Faculty Mentorship & Oversight</h3>
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2">
              <p className="font-bold text-emerald-950">Dr. Arvind Verma</p>
              <p className="text-xs text-emerald-700">Professor & Head of Environmental Engineering, IIT ISM Dhanbad</p>
              <p className="text-xs text-slate-600 mt-2">
                "Assisting team with activated alumina regeneration cycles using mild sodium hydroxide washes."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CSR Pledge Modal */}
      {showPledgeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-display text-slate-900">Pledge CSR Sponsorship</h3>
              <button onClick={() => setShowPledgeModal(false)} className="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
            </div>

            <form onSubmit={handlePledgeCSR} className="space-y-4">
              <Input
                label="Pledge Amount (₹ INR)"
                type="number"
                value={pledgeAmount}
                onChange={(e) => setPledgeAmount(e.target.value)}
                required
              />

              <div className="p-4 bg-brand-50 rounded-xl text-xs text-brand-900 space-y-1">
                <p className="font-bold">CSR Tax Benefit Eligible (Section 80G)</p>
                <p>Funds are held in escrow and disbursed upon successful milestone verification by the faculty mentor.</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setShowPledgeModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Confirm Pledge</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
