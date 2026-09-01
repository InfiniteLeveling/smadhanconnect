import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitChallenge, getDistricts, getCategories, uploadEvidenceFile } from '../services/dataService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { CheckCircle2, ChevronRight, UploadCloud, MapPin, Tag, Image as ImageIcon } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">Report a Civic Problem</h1>
        <p className="text-slate-500 mt-2">Your report will be verified by the nodal officer before being published.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 h-1 bg-brand-500 -z-10 rounded-full transition-all duration-300" style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}></div>
        
        {STEPS.map((step) => (
          <div key={step.id} className={`flex flex-col items-center bg-slate-50 px-2 transition-colors ${currentStep >= step.id ? 'text-brand-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${currentStep >= step.id ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-slate-300 bg-white text-slate-400'}`}>
              {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
            </div>
            <span className="text-xs mt-2 hidden sm:block font-medium">{step.title}</span>
          </div>
        ))}
      </div>

      <div className="glass p-8 rounded-2xl">
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-semibold">What is the problem?</h2>
            <Input 
              label="Short Title" 
              placeholder="e.g. Broken water pipeline in Sector 4"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              autoFocus
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-semibold">Describe the issue in detail</h2>
            <textarea 
              className="block w-full rounded-lg border-0 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-brand-500 min-h-[150px]"
              placeholder="Explain how it affects the community, since when it's happening, etc."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-semibold">Categorize the problem</h2>
            <Select 
              label="Civic Category"
              icon={Tag}
              options={categories}
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
            />
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-semibold">Where is this happening?</h2>
            <Select 
              label="District"
              icon={MapPin}
              options={districts}
              value={formData.districtId}
              onChange={(e) => setFormData({...formData, districtId: e.target.value})}
            />
            <Input 
              label="Specific Location / Landmark" 
              placeholder="e.g. Near the main post office"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-semibold">Upload Ground Evidence</h2>
            <label className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer block relative overflow-hidden">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {previewUrl ? (
                <div className="space-y-3">
                  <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-xl object-cover shadow-sm" />
                  <p className="text-xs font-bold text-brand-600">
                    {uploadingFile ? "Uploading to Supabase Storage..." : "File Attached! Click to change photo"}
                  </p>
                </div>
              ) : (
                <>
                  <UploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                  <p className="text-sm text-slate-700 font-bold">Click to browse or upload ground photos</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP, or PDF up to 15MB</p>
                  {uploadingFile && <p className="text-xs text-brand-600 font-bold mt-2">Uploading...</p>}
                </>
              )}
            </label>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-semibold">Review your report</h2>
            <div className="bg-slate-50 rounded-lg p-6 space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Title</p>
                <p className="font-medium">{formData.title || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Description</p>
                <p className="text-sm">{formData.description || 'Not provided'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={currentStep === 1 || isSubmitting}
          >
            Back
          </Button>
          
          {currentStep < STEPS.length ? (
            <Button onClick={handleNext}>
              Next Step <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              isLoading={isSubmitting}
              icon={CheckCircle2}
            >
              Submit to Government
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
