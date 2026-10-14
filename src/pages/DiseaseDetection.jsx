import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { detectDisease, getSampleLeaves } from '../services/api';
import { 
  Upload, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  ShieldCheck, 
  ShieldAlert, 
  Info, 
  Sparkles, 
  RefreshCw,
  FileText,
  Leaf
} from 'lucide-react';

export const DiseaseDetection = () => {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cropHint, setCropHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [sampleLeaves, setSampleLeaves] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch available demonstrator leaves
    getSampleLeaves()
      .then((data) => setSampleLeaves(data.samples || []))
      .catch((err) => console.log('Sample leaves fetch note:', err));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleSampleSelect = async (sample) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setPreviewUrl(sample.url);

      // Fetch sample image as blob to feed into real detect endpoint
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], sample.filename, { type: 'image/jpeg' });
      setSelectedFile(file);

      const formData = new FormData();
      formData.append('file', file);
      if (cropHint) formData.append('crop_hint', cropHint);

      const diag = await detectDisease(formData);
      setResult(diag);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze leaf image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select or photograph a crop leaf first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (cropHint) formData.append('crop_hint', cropHint);

      const diag = await detectDisease(formData);
      setResult(diag);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agri-100 text-agri-800 text-xs font-semibold">
          <Leaf className="w-3.5 h-3.5 text-agri-600" /> Plant Pathology AI
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('disease.title')}
        </h1>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto">
          {t('disease.subtitle')}
        </p>
      </div>

      {/* Main Grid: Upload & Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                previewUrl 
                  ? 'border-agri-400 bg-agri-50/30' 
                  : 'border-slate-300 hover:border-agri-500 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="space-y-3">
                  <img
                    src={previewUrl}
                    alt="Leaf preview"
                    className="w-48 h-48 object-cover rounded-lg mx-auto shadow-sm border border-slate-200"
                  />
                  <p className="text-xs text-agri-700 font-medium">Click to change photo</p>
                </div>
              ) : (
                <div className="space-y-3 py-4">
                  <div className="w-12 h-12 rounded-full bg-agri-100 text-agri-700 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{t('disease.dragDrop')}</p>
                    <p className="text-xs text-slate-400 mt-0.5">JPG, PNG or WEBP (Max 10MB)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Optional Crop Hint */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Crop Type (Optional Hint)
              </label>
              <select
                value={cropHint}
                onChange={(e) => setCropHint(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500"
              >
                <option value="">Auto-Detect Crop</option>
                <option value="Tomato">Tomato (టొమాటో)</option>
                <option value="Potato">Potato (బంగాళాదుంప)</option>
                <option value="Corn">Corn / Maize (మొక్కజొన్న)</option>
                <option value="Apple">Apple (ఆపిల్)</option>
                <option value="Rice">Rice / Paddy (వరి)</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedFile}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-sm transition-all shadow-md ${
                loading || !selectedFile
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-agri-600 hover:bg-agri-700 hover:shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {t('disease.analyzing')}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {t('disease.uploadBtn')}
                </>
              )}
            </button>
          </form>

          {/* Sample Test Leaves for Rapid Demo */}
          {sampleLeaves.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-600 mb-2">
                {t('disease.samplesTitle')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {sampleLeaves.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSampleSelect(sample)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:border-agri-500 hover:bg-agri-50/50 text-left transition-all"
                  >
                    <img
                      src={sample.url}
                      alt={sample.title}
                      className="w-8 h-8 rounded object-cover border border-slate-200"
                    />
                    <span className="text-[11px] font-medium text-slate-700 leading-tight">
                      {sample.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: Diagnostic Result */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
              {/* Uncertainty Warning Banner if non-leaf or ambiguous */}
              {result.is_uncertain && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{t('disease.uncertaintyWarning')}</p>
                    {result.uncertainty_reason && (
                      <p className="text-xs text-amber-800 mt-1">{result.uncertainty_reason}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Diagnosis Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {result.crop}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        result.is_healthy
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {result.is_healthy ? 'Healthy Foliage' : `${result.urgency} Urgency`}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    {result.disease}
                  </h2>
                </div>

                {/* Confidence Meter */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center min-w-[120px]">
                  <span className="text-xs text-slate-400 font-semibold">{t('disease.confidence')}</span>
                  <div className="text-2xl font-black text-agri-700">
                    {Math.round(result.confidence * 100)}%
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div
                      className="bg-agri-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Healthy Foliage Card */}
              {result.is_healthy ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm">{t('disease.healthyNotice')}</h3>
                    <p className="text-xs text-emerald-700 mt-1">{result.prevention}</p>
                  </div>
                </div>
              ) : (
                /* Pathology Details Tabs/Sections */
                <div className="space-y-4">
                  {/* Symptoms */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-500" />
                      {t('disease.symptoms')}
                    </h3>
                    <p className="text-sm text-slate-800 leading-relaxed">{result.symptoms}</p>
                  </div>

                  {/* Organic & Biological Solutions */}
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      {t('disease.organicTreatment')}
                    </h3>
                    <p className="text-sm text-emerald-900 leading-relaxed font-medium">
                      {result.treatment_organic}
                    </p>
                  </div>

                  {/* Prevention */}
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-1.5 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-blue-600" />
                      {t('disease.prevention')}
                    </h3>
                    <p className="text-sm text-blue-900 leading-relaxed">{result.prevention}</p>
                  </div>

                  {/* Chemical Treatment Notice with Safety Disclaimer */}
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      {t('disease.chemicalTreatment')}
                    </h3>
                    <p className="text-xs text-amber-950 mb-2 leading-relaxed">
                      {result.treatment_chemical}
                    </p>
                    <p className="text-[11px] text-amber-800 font-semibold bg-white/70 p-2 rounded border border-amber-300/60">
                      ⚠️ Always wear masks, protective goggles, and gloves. Maintain the waiting period between chemical spray and crop harvest.
                    </p>
                  </div>
                </div>
              )}

              {/* Alternate Probability Candidates */}
              {result.top_predictions && result.top_predictions.length > 1 && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Alternative Differential Diagnoses
                  </p>
                  <div className="space-y-1.5">
                    {result.top_predictions.slice(1).map((pred, i) => (
                      <div key={i} className="flex justify-between items-center text-xs p-2 rounded bg-slate-50 border border-slate-200">
                        <span className="font-medium text-slate-700">{pred.crop} – {pred.disease}</span>
                        <span className="font-bold text-slate-500">{Math.round(pred.probability * 100)}% Match</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-700">Awaiting Leaf Photograph</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Upload a picture of an affected crop leaf or click on one of the sample demonstrator leaves on the left to view instant diagnostic results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
