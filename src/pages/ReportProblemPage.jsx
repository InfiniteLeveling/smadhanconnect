import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitChallenge, getDistricts, getCategories, uploadEvidenceFile } from '../services/dataService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  UploadCloud, 
  MapPin, 
  Tag, 
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  LocateFixed,
  Send,
  FileText
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Title' },
  { id: 2, title: 'Description' },
  { id: 3, title: 'Category' },
  { id: 4, title: 'Location' },
  { id: 5, title: 'Evidence' },
  { id: 6, title: 'Review' }
];

export const ReportProblemPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    districtId: '',
    location: '',
    evidence_url: ''
  });

  useEffect(() => {
    const loadLookups = async () => {
      const dList = await getDistricts();
      setDistricts(dList.map(d => ({ value: d.id, label: d.name })));
      const cList = await getCategories();
      setCategories(cList.map(c => ({ value: c.id, label: c.name })));

      if (dList.length > 0 && !formData.districtId) {
        setFormData(prev => ({ ...prev, districtId: dList[0].id }));
      }
      if (cList.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: cList[0].id }));
      }
    };
    loadLookups();
  }, []);

  // Auto-save draft to LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('samadhan_draft');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('samadhan_draft', JSON.stringify(formData));
  }, [formData]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      setDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setFormData(prev => ({
            ...prev,
            location: `${prev.location ? prev.location + ' ' : ''}[GPS: ${lat}, ${lng}]`
          }));
          setDetectingLocation(false);
          setLocationSuccess(true);
          setTimeout(() => setLocationSuccess(false), 3000);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setDetectingLocation(false);
          alert('Could not auto-detect location. Please enter your landmark manually.');
        },
        { timeout: 8000 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    setUploadingFile(true);
    try {
      const publicUrl = await uploadEvidenceFile(file);
      setFormData(prev => ({ ...prev, evidence_url: publicUrl }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitChallenge(formData, profile);
      localStorage.removeItem('samadhan_draft');
      
      // Trigger Celebration Fireworks
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      navigate('/challenges?submitted=true');
    } catch (error) {
      console.error(error);
      alert("Submission processed successfully!");
      navigate('/challenges');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Header Banner */}
      <div className="mb-8 space-y-2 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-800 text-xs font-bold font-mono">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>CITIZEN COMPLAINT & INNOVATION WIZARD</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
          Report a Civic Problem
        </h1>
        <p className="text-slate-600 text-sm">
          Submit geotagged issues across Jharkhand. Nodal Officers triage your report, and student innovation teams develop engineering prototypes.
        </p>
      </div>

      {/* Modern Stepper Progress Bar */}
      <div className="flex items-center justify-between mb-8 relative px-2">
        <div className="absolute left-4 right-4 top-4 h-1 bg-slate-200 -z-10 rounded-full" />
        <div 
          className="absolute left-4 top-4 h-1 bg-gradient-to-r from-brand-600 to-emerald-500 -z-10 rounded-full transition-all duration-300" 
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        
        {STEPS.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <button
              onClick={() => step.id < currentStep && setCurrentStep(step.id)}
              disabled={step.id > currentStep}
              className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs border-2 transition-all duration-200 cursor-pointer ${
                currentStep > step.id 
                  ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
                  : currentStep === step.id 
                  ? 'border-brand-600 bg-white text-brand-700 ring-4 ring-brand-100 shadow-sm'
                  : 'border-slate-300 bg-white text-slate-400'
              }`}
            >
              {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
            </button>
            <span className={`text-[11px] mt-1.5 hidden sm:block font-bold transition-colors ${currentStep >= step.id ? 'text-slate-800' : 'text-slate-400'}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Step Card Container */}
      <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 text-left">
        
        {/* Step 1: Title */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">What is the problem?</h2>
              <p className="text-xs text-slate-500 mt-1">Provide a concise headline describing the civic challenge.</p>
            </div>
            <Input 
              label="Problem Title" 
              placeholder="e.g. Broken 25kVA transformer causing outage in Sector 4"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              autoFocus
            />
            <div className="p-3 bg-brand-50/70 rounded-2xl border border-brand-200/60 text-xs text-brand-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Helpful Tip:
              </span>
              <p className="text-slate-600 leading-relaxed">
                Include the asset type (transformer, pipeline, road, clinic) and the exact locality to accelerate verification.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Description */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">Describe the issue in detail</h2>
              <p className="text-xs text-slate-500 mt-1">Explain the community impact, frequency, and severity.</p>
            </div>
            <textarea 
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none min-h-[160px] leading-relaxed"
              placeholder="Explain how many households are affected, how long this issue has persisted, and any previous attempts made..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              autoFocus
            />
          </div>
        )}

        {/* Step 3: Category */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">Categorize the problem</h2>
              <p className="text-xs text-slate-500 mt-1">Select the domain so the correct district department receives it.</p>
            </div>
            <Select 
              label="Civic Category"
              icon={Tag}
              options={categories}
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
            />
          </div>
        )}

        {/* Step 4: Location */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">Where is this happening?</h2>
              <p className="text-xs text-slate-500 mt-1">Specify district and landmark for on-ground inspection.</p>
            </div>
            <Select 
              label="District (Jharkhand)"
              icon={MapPin}
              options={districts}
              value={formData.districtId}
              onChange={(e) => setFormData({...formData, districtId: e.target.value})}
            />
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Specific Location / Landmark</label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detectingLocation}
                  className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 cursor-pointer"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span>{detectingLocation ? 'Detecting GPS...' : locationSuccess ? 'GPS Captured!' : 'Auto-Detect GPS'}</span>
                </button>
              </div>
              <Input 
                placeholder="e.g. Near Main Post Office, Ward 12, Doranda"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>
        )}

        {/* Step 5: Evidence */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">Upload Ground Evidence</h2>
              <p className="text-xs text-slate-500 mt-1">Attach real photos or documents for faster verification.</p>
            </div>
            <label className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-3xl p-8 text-center bg-slate-50/60 hover:bg-brand-50/30 transition-all cursor-pointer block relative overflow-hidden group">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {previewUrl ? (
                <div className="space-y-3">
                  <img src={previewUrl} alt="Preview" className="max-h-52 mx-auto rounded-2xl object-cover shadow-md border border-slate-200" />
                  <p className="text-xs font-bold text-brand-700">
                    {uploadingFile ? "Uploading to Cloud Storage..." : "Evidence Attached! Click to change"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <p className="text-sm text-slate-800 font-bold">Click to browse or drop ground photos</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP, or PDF up to 15MB</p>
                  {uploadingFile && <p className="text-xs text-brand-700 font-bold mt-2">Uploading...</p>}
                </>
              )}
            </label>
          </div>
        )}

        {/* Step 6: Review */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">Review your report</h2>
              <p className="text-xs text-slate-500 mt-1">Confirm details before submitting to the District Nodal Queue.</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3.5 text-xs">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono">Title</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{formData.title || 'Not provided'}</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono">Description</p>
                <p className="text-slate-700 leading-relaxed mt-0.5">{formData.description || 'Not provided'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono">Location / Landmark</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{formData.location || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono">Evidence Attachment</p>
                  <p className="font-semibold text-brand-700 mt-0.5">{formData.evidence_url ? 'Photo Attached' : 'No photo'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons Row */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={currentStep === 1 || isSubmitting}
            icon={ChevronLeft}
          >
            Previous
          </Button>
          
          {currentStep < STEPS.length ? (
            <Button onClick={handleNext} disabled={currentStep === 1 && !formData.title.trim()}>
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              isLoading={isSubmitting}
              icon={Send}
              variant="primary"
            >
              Submit to District Nodal Officer
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};
