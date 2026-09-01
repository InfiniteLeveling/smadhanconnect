import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPendingChallenges, verifyChallenge, rejectChallenge } from '../../services/dataService';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Clock, 
  FileText, 
  Filter,
  Eye,
  Building2,
  TrendingUp
} from 'lucide-react';

export const GovernmentDashboard = () => {
  const { profile } = useAuth();
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedUrgency, setSelectedUrgency] = useState('HIGH');
  const [processing, setProcessing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const loadPending = async () => {
    setLoading(true);
    try {
      const data = await getPendingChallenges();
      setPendingItems(data);
    } catch (err) {
      console.error('Failed to load pending queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleVerify = async (challengeId) => {
    setProcessing(true);
    try {
      await verifyChallenge(challengeId, selectedUrgency, profile?.id);
      setFeedbackMessage({ type: 'success', text: `Problem officially verified with urgency grade: ${selectedUrgency}` });
      setSelectedItem(null);
      await loadPending();
    } catch (err) {
      console.error(err);
      setFeedbackMessage({ type: 'error', text: 'Verification failed. Please try again.' });
    } finally {
      setProcessing(false);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const handleReject = async (challengeId) => {
    setProcessing(true);
    try {
      await rejectChallenge(challengeId, profile?.id, 'Does not meet civic mandate criteria');
      setFeedbackMessage({ type: 'info', text: 'Problem marked as rejected with official audit record.' });
      setSelectedItem(null);
      await loadPending();
    } catch (err) {
      console.error(err);
      setFeedbackMessage({ type: 'error', text: 'Rejection failed.' });
    } finally {
      setProcessing(false);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Officer Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Building2 className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-brand-500/20 text-brand-300 border border-brand-500/40 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              Official Triage & Verification Command Center
            </span>
            <span className="text-slate-400 text-xs">Jurisdiction: State of Jharkhand</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            Welcome, Officer {profile?.full_name || 'Nodal Authority'}
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Review unverified civic reports submitted by grassroots citizens across 24 districts. Verify authentic challenges, assign priority urgencies, and open them for engineering solutions.
          </p>
        </div>

        {/* Quick KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-slate-200">
          <div>
            <p className="text-xs text-slate-400 font-medium">Pending Triage Queue</p>
            <p className="text-2xl font-bold text-amber-400">{pendingItems.length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Verified Active Challenges</p>
            <p className="text-2xl font-bold text-emerald-400">128</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Critical Priority Issues</p>
            <p className="text-2xl font-bold text-red-400">14</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Avg Triage Speed</p>
            <p className="text-2xl font-bold text-brand-400">2.4 hrs</p>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {feedbackMessage && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between border ${
          feedbackMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
            : feedbackMessage.type === 'error'
            ? 'bg-red-50 text-red-900 border-red-200'
            : 'bg-slate-100 text-slate-900 border-slate-300'
        }`}>
          <span>{feedbackMessage.text}</span>
          <Button size="sm" variant="ghost" onClick={() => setFeedbackMessage(null)}>Dismiss</Button>
        </div>
      )}

      {/* Main Triage Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-display">Unverified Citizen Reports</h2>
            <span className="bg-slate-200 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {pendingItems.length}
            </span>
          </div>
          <Button size="sm" variant="outline" onClick={loadPending}>
            Refresh Queue
          </Button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-3"></div>
            Loading pending queue from database...
          </div>
        ) : pendingItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">All Triage Queues Cleared!</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              There are no unverified citizen submissions pending review at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-brand-400/80 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {item.category_name || 'Civic Issue'}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span className="truncate font-medium text-slate-700">
                      {item.district_name ? `${item.district_name} District` : 'Jharkhand'}
                    </span>
                    <span className="opacity-40">•</span>
                    <span className="truncate">{item.location_details}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(item.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                    <span>By: {item.created_by_name || 'Citizen'}</span>
                  </div>

                  <Button 
                    className="w-full mt-2" 
                    variant="outline" 
                    size="sm"
                    icon={Eye}
                    onClick={() => {
                      setSelectedItem(item);
                      setSelectedUrgency(item.urgency || 'HIGH');
                    }}
                  >
                    Inspect & Triage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verification & Triage Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Triage Review Ref: #{selectedItem.id}
                </span>
                <h2 className="text-2xl font-bold font-display text-slate-900 mt-1">
                  {selectedItem.title}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedItem(null)} 
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Evidence Image Preview if available */}
            {selectedItem.evidence_url && (
              <div className="rounded-xl overflow-hidden border border-slate-200 max-h-64">
                <img 
                  src={selectedItem.evidence_url} 
                  alt="Citizen uploaded ground evidence" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Detailed Description</p>
                <p className="text-slate-800 mt-1 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedItem.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Location</p>
                  <p className="font-medium text-slate-800 mt-0.5">{selectedItem.district_name || 'Ranchi'} ({selectedItem.location_details})</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Category</p>
                  <p className="font-medium text-slate-800 mt-0.5">{selectedItem.category_name || 'Water Supply & Sanitation'}</p>
                </div>
              </div>

              {/* Priority Urgency Picker */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Assign Official Urgency Grade
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedUrgency(lvl)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold uppercase border transition-all ${
                        selectedUrgency === lvl 
                          ? lvl === 'CRITICAL' ? 'bg-red-600 text-white border-red-600'
                          : lvl === 'HIGH' ? 'bg-amber-600 text-white border-amber-600'
                          : lvl === 'MEDIUM' ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-800 text-white border-slate-800'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="danger"
                size="sm"
                icon={XCircle}
                isLoading={processing}
                onClick={() => handleReject(selectedItem.id)}
              >
                Reject Report
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  icon={CheckCircle}
                  isLoading={processing}
                  onClick={() => handleVerify(selectedItem.id)}
                >
                  Verify & Open for Bids
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
