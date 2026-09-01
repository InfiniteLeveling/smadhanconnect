import React, { useState, useEffect } from 'react';
import { getAllChallenges, upvoteChallenge } from '../services/dataService';
import { ChallengeCard } from '../components/challenges/ChallengeCard';
import { Button } from '../components/ui/Button';
import { 
  Compass, 
  Search, 
  Filter, 
  MapPin, 
  Layers, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const JHARKHAND_DISTRICTS = [
  'All Districts',
  'Ranchi',
  'Dhanbad',
  'East Singhbhum',
  'Bokaro',
  'Palamu',
  'Hazaribagh',
  'West Singhbhum',
  'Deoghar',
  'Garhwa',
  'Dumka',
  'Giridih',
  'Ramgarh',
  'Chatra',
  'Gumla',
  'Koderma',
  'Jamtara',
  'Sahibganj',
  'Latehar',
  'Godda',
  'Simdega',
  'Pakur',
  'Lohardaga',
  'Khunti',
  'Saraikela Kharsawan'
];

const CATEGORIES = [
  'All Categories',
  'Water Supply & Sanitation',
  'Healthcare & Wellness',
  'Smart Mobility',
  'Agriculture & Rural',
  'Environment & Climate',
  'Education & Skill',
  'Women Safety',
  'E-Governance'
];

export const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const data = await getAllChallenges();
      setChallenges(data);
    } catch (err) {
      console.error('Failed to load challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const handleUpvote = async (id) => {
    try {
      await upvoteChallenge(id);
      await loadChallenges();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter Logic
  const filteredChallenges = challenges.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.district_name && c.district_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDistrict = 
      selectedDistrict === 'All Districts' || c.district_name === selectedDistrict;

    const matchesCategory = 
      selectedCategory === 'All Categories' || c.category_name === selectedCategory;

    const matchesStatus = 
      selectedStatus === 'ALL' ||
      (selectedStatus === 'OPEN' && (c.status === 'OPEN_FOR_SOLUTIONS' || c.status === 'VERIFIED')) ||
      (selectedStatus === 'IN_PROGRESS' && (c.status === 'PROTOTYPE' || c.status === 'FIELD_TESTING' || c.status === 'SOLUTION_PROPOSED')) ||
      (selectedStatus === 'RESOLVED' && c.status === 'RESOLVED');

    const matchesUrgency =
      selectedUrgency === 'ALL' || c.urgency === selectedUrgency;

    return matchesSearch && matchesDistrict && matchesCategory && matchesStatus && matchesUrgency;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-brand-400" />
            Jharkhand Civic Innovation Marketplace
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display leading-tight">
            Discover Verified Real-World Challenges & Build Solutions
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Connect directly with verified civic problems from 24 districts across Jharkhand. Submit your research, build prototypes, and receive government and CSR backing.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/report-problem">
              <Button variant="primary" icon={PlusCircle}>
                Report a New Problem
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search challenges by title, keywords, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all text-sm"
          />
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
          {/* District Filter */}
          <div>
            <label className="block text-slate-500 mb-1.5 font-bold uppercase tracking-wider">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-slate-500 mb-1.5 font-bold uppercase tracking-wider">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <label className="block text-slate-500 mb-1.5 font-bold uppercase tracking-wider">Urgency</label>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="ALL">All Urgencies</option>
              <option value="CRITICAL">Critical Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedDistrict('All Districts');
                setSelectedCategory('All Categories');
                setSelectedStatus('ALL');
                setSelectedUrgency('ALL');
                setSearchQuery('');
              }}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>

        {/* Status Lifecycle Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {[
            { id: 'ALL', label: 'All Challenges' },
            { id: 'OPEN', label: 'Open for Solutions (Bids Open)' },
            { id: 'IN_PROGRESS', label: 'In Prototype & Testing' },
            { id: 'RESOLVED', label: 'Successfully Resolved' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedStatus === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">
            Showing <span className="text-slate-900 font-bold">{filteredChallenges.length}</span> civic challenges
          </p>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-3"></div>
            Loading marketplace challenges...
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4">
            <Layers className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">No matching challenges found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Try adjusting your district, category, or search filters to find active civic problems.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                onUpvote={handleUpvote} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
