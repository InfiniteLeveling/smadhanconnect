import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Cpu, 
  Sparkles,
  Send,
  Layers,
  Building2,
  ShieldAlert
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { analyzeCivicProblem } from '../services/aiService';

const DISTRICT_STATS = [
  { name: 'Ranchi', reported: 142, active: 18, resolved: 112, funding: '₹2.4 Cr', rate: 78 },
  { name: 'Dhanbad', reported: 118, active: 14, resolved: 89, funding: '₹1.9 Cr', rate: 75 },
  { name: 'East Singhbhum', reported: 96, active: 12, resolved: 76, funding: '₹1.6 Cr', rate: 79 },
  { name: 'Bokaro', reported: 84, active: 9, resolved: 68, funding: '₹1.2 Cr', rate: 80 },
  { name: 'Palamu', reported: 110, active: 16, resolved: 72, funding: '₹1.5 Cr', rate: 65 },
  { name: 'Hazaribagh', reported: 68, active: 8, resolved: 52, funding: '₹85 L', rate: 76 },
  { name: 'West Singhbhum', reported: 74, active: 11, resolved: 48, funding: '₹92 L', rate: 64 },
  { name: 'Deoghar', reported: 58, active: 6, resolved: 46, funding: '₹68 L', rate: 79 },
  { name: 'Giridih', reported: 62, active: 7, resolved: 44, funding: '₹75 L', rate: 70 },
  { name: 'Dumka', reported: 54, active: 6, resolved: 39, funding: '₹55 L', rate: 72 },
  { name: 'Gumla', reported: 48, active: 5, resolved: 36, funding: '₹48 L', rate: 75 },
  { name: 'Ramgarh', reported: 52, active: 7, resolved: 41, funding: '₹62 L', rate: 78 }
];

export const AnalyticsPage = () => {
  const [testTitle, setTestTitle] = useState('');
  const [testDesc, setTestDesc] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleTestAi = async (e) => {
    e.preventDefault();
    if (!testTitle.trim()) return;
    setAnalyzing(true);
    try {
      const res = await analyzeCivicProblem(testTitle, testDesc);
      setAiResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 space-y-4 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-brand-400" /> State-Wide Performance Matrix
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display">
            Jharkhand Civic Resolution & Impact Analytics
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Real-time telemetry, district resolution speed, CSR funding mobilization, and automated machine intelligence metrics across all 24 administrative districts.
          </p>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <p className="text-xs text-slate-400 font-medium">Total Problems Logged</p>
            <p className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">1,248</p>
            <span className="text-[11px] text-emerald-400 font-bold">+18% this month</span>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <p className="text-xs text-slate-400 font-medium">Active University Pilots</p>
            <p className="text-2xl sm:text-3xl font-bold text-brand-400 font-display mt-1">118</p>
            <span className="text-[11px] text-slate-400">Across 6 Higher Ed Labs</span>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <p className="text-xs text-slate-400 font-medium">CSR Capital Mobilized</p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400 font-display mt-1">₹14.2 Cr</p>
            <span className="text-[11px] text-emerald-400 font-bold">100% Section 80G Compliant</span>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <p className="text-xs text-slate-400 font-medium">Avg Resolution Velocity</p>
            <p className="text-2xl sm:text-3xl font-bold text-amber-400 font-display mt-1">42 Days</p>
            <span className="text-[11px] text-amber-400">Down from 180 days</span>
          </div>
        </div>
      </div>

      {/* AI Classifier Live Test Sandbox */}
      <div className="bg-gradient-to-br from-brand-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-brand-800/50 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <h2 className="text-xl font-bold font-display text-white">
                Live AI Problem Classifier Sandbox
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Powered by Server-Side Edge Functions & NLP heuristics. Test any ground civic scenario.
            </p>
          </div>
          <span className="text-xs font-mono bg-brand-500/20 text-brand-300 px-3 py-1 rounded-full font-bold border border-brand-500/40">
            Edge Function Active
          </span>
        </div>

        <form onSubmit={handleTestAi} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="e.g. Broken handpump with fluoride smells in Latehar"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              className="bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
            <input
              type="text"
              placeholder="e.g. Affecting 200 school students with dental fluorosis symptoms"
              value={testDesc}
              onChange={(e) => setTestDesc(e.target.value)}
              className="bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <Button type="submit" variant="primary" icon={Sparkles} isLoading={analyzing}>
            Analyze Problem with AI
          </Button>
        </form>

        {aiResult && (
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Predicted Category:</span>
                <span className="bg-brand-500/20 text-brand-300 px-2.5 py-0.5 rounded-md text-xs font-bold border border-brand-500/30">
                  {aiResult.recommendedCategory}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Assigned Urgency:</span>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase ${
                  aiResult.urgency === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {aiResult.urgency}
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Confidence: {(aiResult.confidenceScore * 100).toFixed(0)}%
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{aiResult.executiveSummary}</p>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Recommended Engineering Solutions</p>
              <div className="flex flex-wrap gap-2">
                {aiResult.suggestedTech?.map((tech, i) => (
                  <span key={i} className="text-xs bg-slate-900 text-slate-200 px-3 py-1 rounded-lg border border-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 24-District Resolution Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              District Resolution Matrix (Jharkhand)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown across administrative zones.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            24 Districts Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Problems Logged</th>
                <th className="py-3 px-4">Active Pilots</th>
                <th className="py-3 px-4">Resolved</th>
                <th className="py-3 px-4">CSR Mobilized</th>
                <th className="py-3 px-4">Resolution Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {DISTRICT_STATS.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    {d.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{d.reported}</td>
                  <td className="py-3 px-4 text-amber-600 font-bold">{d.active}</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">{d.resolved}</td>
                  <td className="py-3 px-4 font-display font-bold text-slate-800">{d.funding}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-500 h-full rounded-full" style={{ width: `${d.rate}%` }}></div>
                      </div>
                      <span className="font-bold text-slate-700">{d.rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
