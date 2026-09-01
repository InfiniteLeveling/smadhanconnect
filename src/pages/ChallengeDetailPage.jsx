import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getChallengeById, 
  getSolutionsByChallenge, 
  submitSolution, 
  acceptSolution, 
  upvoteChallenge 
} from '../services/dataService';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Input } from '../components/ui/Input';
import confetti from 'canvas-confetti';
import { 
  MapPin, 
  Clock, 
  ThumbsUp, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Send, 
  Building, 
  IndianRupee, 
  Rocket, 
  Lightbulb,
  FileCheck,
  UserCheck
} from 'lucide-react';

export const ChallengeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [challenge, setChallenge] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBidModal, setShowBidModal] = useState(false);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidForm, setBidForm] = useState({
    title: '',
    description: '',
    approach: '',
    expectedImpact: '',
    estimatedCost: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const chal = await getChallengeById(id);
      setChallenge(chal);
      const sols = await getSolutionsByChallenge(id);
      setSolutions(sols);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleUpvote = async () => {
    try {
      await upvoteChallenge(id);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleProposeSolution = async (e) => {
    e.preventDefault();
    setSubmittingBid(true);
    try {
      await submitSolution({
        ...bidForm,
        challengeId: id
      }, profile);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setShowBidModal(false);
      setBidForm({
        title: '',
        description: '',
        approach: '',
        expectedImpact: '',
        estimatedCost: ''
      });
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to submit proposal.');
    } finally {
      setSubmittingBid(false);
    }
  };

  const handleAcceptBid = async (solutionId) => {
    try {
      const project = await acceptSolution(solutionId, id, profile?.id);
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });
      alert('Solution accepted! Project workspace initialized.');
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to accept solution.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-slate-500">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 mx-auto mb-4"></div>
        Loading civic challenge data...
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Challenge Not Found</h2>
        <p className="text-slate-500 mt-2">The requested problem could not be located.</p>
        <Link to="/challenges" className="mt-4 inline-block text-brand-600 font-bold">&larr; Back to Challenges</Link>
      </div>
    );
  }

  const isOfficer = profile?.role === 'GOVERNMENT' || profile?.role === 'ADMIN';
  const canPropose = ['STUDENT', 'UNIVERSITY', 'INDUSTRY', 'CITIZEN'].includes(profile?.role);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <Link 
        to="/challenges" 
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      {/* Main Header & Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Evidence Banner if available */}
        {challenge.evidence_url && (
          <div className="w-full h-72 sm:h-96 relative bg-slate-900 overflow-hidden">
            <img 
              src={challenge.evidence_url} 
              alt={challenge.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={challenge.urgency} />
                <StatusBadge status={challenge.status} />
                <span className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium">
                  {challenge.category_name || 'Civic Infrastructure'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display leading-tight">
                {challenge.title}
              </h1>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {!challenge.evidence_url && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={challenge.urgency} />
                <StatusBadge status={challenge.status} />
                <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-medium">
                  {challenge.category_name}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                {challenge.title}
              </h1>
            </div>
          )}

          {/* Quick Meta Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-100 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-1.5 font-medium text-slate-800">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>{challenge.district_name || 'Ranchi'} District ({challenge.location_details})</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="w-4 h-4" />
                <span>Reported {new Date(challenge.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>

              <button
                onClick={handleUpvote}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-xl border border-brand-200 transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{challenge.upvotes || 0} Upvotes</span>
              </button>
            </div>
          </div>

          {/* Detailed Narrative */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-sans">
              Ground Problem Statement
            </h3>
            <p className="text-slate-800 text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {challenge.description}
            </p>
          </div>

          {/* Nodal Officer Verification Badge */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500 text-white rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Official Government Verification Passed
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Verified by Nodal Department as an authentic high-impact civic need.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-white text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm">
              SEALED
            </span>
          </div>

          {/* Action Bar for Innovators / Students */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-900">
                Are you a Student, University Lab, or Corporate CSR?
              </p>
              <p className="text-xs text-slate-500">
                Propose your engineering or technological solution to receive government implementation support.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={Lightbulb}
              onClick={() => setShowBidModal(true)}
            >
              Propose Solution & Bid
            </Button>
          </div>
        </div>
      </div>

      {/* Proposed Solutions Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Submitted Engineering Proposals ({solutions.length})
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Technical bids submitted by universities and innovation teams.
            </p>
          </div>
        </div>

        {solutions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Lightbulb className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Solutions Proposed Yet</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Be the first research team or student group to submit a solution for this challenge!
            </p>
            <Button variant="outline" size="sm" onClick={() => setShowBidModal(true)}>
              Submit First Proposal
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {solutions.map((sol) => (
              <div 
                key={sol.id} 
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-brand-300 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">Bid #{sol.id}</span>
                      <StatusBadge status={sol.status} />
                    </div>
                    <h3 className="text-xl font-bold font-display text-slate-900 mt-1">
                      {sol.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <IndianRupee className="w-4 h-4" />
                    <span>Est. Cost: ₹{sol.estimated_cost?.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Technical Approach</p>
                    <p className="text-slate-700 mt-1">{sol.approach}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Expected Impact</p>
                    <p className="text-slate-700 mt-1">{sol.expected_impact}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-brand-600" />
                    <span className="font-semibold text-slate-800">{sol.proposer_name}</span>
                    <span className="opacity-40">•</span>
                    <span>Role: {sol.proposer_role}</span>
                  </div>

                  {/* Nodal Officer Acceptance Button */}
                  {isOfficer && sol.status !== 'ACCEPTED' && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CheckCircle}
                      onClick={() => handleAcceptBid(sol.id)}
                    >
                      Accept Solution & Launch Project
                    </Button>
                  )}

                  {sol.status === 'ACCEPTED' && (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-lg">
                      <Rocket className="w-3.5 h-3.5" /> Project Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Propose Solution Modal */}
      {showBidModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Engineering Bid Proposal
                </span>
                <h2 className="text-2xl font-bold font-display text-slate-900 mt-1">
                  Submit Technological Solution
                </h2>
              </div>
              <button 
                onClick={() => setShowBidModal(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleProposeSolution} className="space-y-4">
              <Input
                label="Solution Project Title"
                placeholder="e.g. Decentralized Solar Activated Alumina Filtration Columns"
                value={bidForm.title}
                onChange={(e) => setBidForm({ ...bidForm, title: e.target.value })}
                required
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Executive Summary</label>
                <textarea
                  className="w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-brand-500 text-sm"
                  rows="3"
                  placeholder="Summarize the core innovation and mechanism..."
                  value={bidForm.description}
                  onChange={(e) => setBidForm({ ...bidForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Technical Approach & Architecture</label>
                <textarea
                  className="w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-brand-500 text-sm"
                  rows="3"
                  placeholder="Specify hardware components, sensors, materials, software algorithms..."
                  value={bidForm.approach}
                  onChange={(e) => setBidForm({ ...bidForm, approach: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Expected Civic Impact"
                placeholder="e.g. Serves 300 families with <0.5mg/L safe drinking water"
                value={bidForm.expectedImpact}
                onChange={(e) => setBidForm({ ...bidForm, expectedImpact: e.target.value })}
                required
              />

              <Input
                label="Estimated Implementation Budget (₹ INR)"
                type="number"
                placeholder="e.g. 150000"
                value={bidForm.estimatedCost}
                onChange={(e) => setBidForm({ ...bidForm, estimatedCost: e.target.value })}
                required
              />

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setShowBidModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" icon={Send} isLoading={submittingBid}>
                  Submit Official Bid
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
