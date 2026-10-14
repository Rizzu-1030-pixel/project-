import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { recommendCrop } from '../services/api';
import { 
  Wheat, 
  Sparkles, 
  TrendingUp, 
  FlaskConical, 
  SunMedium, 
  CloudRain, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  Lightbulb
} from 'lucide-react';

export const CropRecommendation = () => {
  const { t } = useLanguage();

  const [n, setN] = useState(80);
  const [p, setP] = useState(48);
  const [k, setK] = useState(40);
  const [ph, setPh] = useState(6.5);
  const [temp, setTemp] = useState(25.0);
  const [humidity, setHumidity] = useState(80.0);
  const [rainfall, setRainfall] = useState(200.0);
  const [location, setLocation] = useState('Telangana, India');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const applyPreset = (presetType) => {
    if (presetType === 'telangana') {
      setN(75); setP(45); setK(25);
      setPh(6.4); setTemp(27.5); setHumidity(65.0); setRainfall(85.0);
      setLocation('Telangana (Red Loam Soil)');
    } else if (presetType === 'black_cotton') {
      setN(115); setP(46); setK(22);
      setPh(7.0); setTemp(24.5); setHumidity(78.0); setRainfall(90.0);
      setLocation('Deccan Black Cotton Soil');
    } else if (presetType === 'coastal_paddy') {
      setN(82); setP(48); setK(42);
      setPh(6.5); setTemp(24.0); setHumidity(82.0); setRainfall(220.0);
      setLocation('Coastal Alluvial Delta');
    }
  };

  const handleRecommend = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await recommendCrop({
        n: parseFloat(n),
        p: parseFloat(p),
        k: parseFloat(k),
        temperature: parseFloat(temp),
        humidity: parseFloat(humidity),
        ph: parseFloat(ph),
        rainfall: parseFloat(rainfall),
        location
      });
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate crop recommendation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
          <Wheat className="w-3.5 h-3.5 text-amber-600" /> Multi-Variate Agronomic Matching
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('crop.title')}
        </h1>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto">
          {t('crop.subtitle')}
        </p>
      </div>

      {/* Quick Regional Presets */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          Quick Regional Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset('telangana')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors"
          >
            {t('crop.presetTelangana')}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('black_cotton')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 transition-colors"
          >
            {t('crop.presetBlack')}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('coastal_paddy')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            Coastal Rice Delta
          </button>
        </div>
      </div>

      {/* Form & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Input Column */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <form onSubmit={handleRecommend} className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-agri-600" /> Soil Nutrient Profile (NPK & pH)
              </h3>
            </div>

            {/* N, P, K Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('crop.nLabel')}
                </label>
                <input
                  type="number"
                  min="0"
                  max="150"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('crop.pLabel')}
                </label>
                <input
                  type="number"
                  min="0"
                  max="150"
                  value={p}
                  onChange={(e) => setP(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('crop.kLabel')}
                </label>
                <input
                  type="number"
                  min="0"
                  max="250"
                  value={k}
                  onChange={(e) => setK(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>
            </div>

            {/* pH Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">{t('crop.phLabel')}</label>
                <span className="text-xs font-bold text-agri-800 bg-agri-100 px-2 py-0.5 rounded">
                  pH {ph} ({ph < 6.0 ? 'Acidic' : ph > 7.5 ? 'Alkaline' : 'Neutral/Optimal'})
                </span>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.0"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-agri-600"
              />
            </div>

            <div className="border-b border-slate-100 pt-2 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <SunMedium className="w-4 h-4 text-amber-500" /> Climate & Weather Parameters
              </h3>
            </div>

            {/* Temp, Humidity, Rainfall Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('crop.tempLabel')}
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('crop.humidityLabel')}
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('crop.rainfallLabel')}
                </label>
                <input
                  type="number"
                  min="10"
                  max="400"
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-agri-600 hover:bg-agri-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Soil & Climate...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {t('crop.recommendBtn')}
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Results Output Column */}
        <div className="lg:col-span-6">
          {result ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 animate-fadeIn">
              {/* Primary Top Recommendation Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-agri-700 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider uppercase text-emerald-100">
                    {t('crop.recommendedCrop')}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/25">
                    {Math.round(result.confidence * 100)}% Confidence Match
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black mt-1">
                  {result.recommended_crop}
                </h2>
                <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
                  {result.explanation}
                </p>
              </div>

              {/* Suitability Breakdown */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {t('crop.suitability')}
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'Nitrogen (N) Fit', val: result.soil_suitability.nitrogen_fit },
                    { label: 'Phosphorus (P) Fit', val: result.soil_suitability.phosphorus_fit },
                    { label: 'Potassium (K) Fit', val: result.soil_suitability.potassium_fit },
                    { label: 'Soil pH Fit', val: result.soil_suitability.ph_fit },
                    { label: 'Temperature Fit', val: result.climate_suitability.temperature_fit },
                    { label: 'Rainfall Fit', val: result.climate_suitability.rainfall_fit },
                  ].map((metric, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between font-medium text-slate-700 mb-0.5">
                        <span>{metric.label}</span>
                        <span className="font-bold text-agri-700">{metric.val}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-agri-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${metric.val}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ideal Growing Parameters */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-800 space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-amber-900 text-[11px]">
                  Optimal Agronomic Target Profile
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <p><strong>Ideal NPK:</strong> {result.ideal_growing_conditions.optimal_N} / {result.ideal_growing_conditions.optimal_P} / {result.ideal_growing_conditions.optimal_K}</p>
                  <p><strong>Ideal Temp:</strong> {result.ideal_growing_conditions.optimal_temp}</p>
                  <p><strong>Ideal Rainfall:</strong> {result.ideal_growing_conditions.optimal_rainfall}</p>
                  <p><strong>Optimal pH:</strong> {result.ideal_growing_conditions.optimal_ph}</p>
                </div>
                {result.ideal_growing_conditions.agronomic_advice && (
                  <p className="pt-2 border-t border-amber-200 text-amber-950 font-medium">
                    💡 <strong>Agronomic Tip:</strong> {result.ideal_growing_conditions.agronomic_advice}
                  </p>
                )}
              </div>

              {/* Alternative Crops */}
              {result.alternatives && result.alternatives.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    {t('crop.alternatives')}
                  </h4>
                  <div className="space-y-2">
                    {result.alternatives.map((alt, i) => (
                      <div key={i} className="p-3 rounded-lg border border-slate-200 bg-white flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{alt.name}</span>
                          <p className="text-[11px] text-slate-500 mt-0.5">{alt.brief_reason}</p>
                        </div>
                        <span className="font-bold text-agri-700 bg-agri-50 px-2 py-1 rounded border border-agri-200">
                          {Math.round(alt.confidence * 100)}% Match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                <Wheat className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-700">Find the Most Suitable Crop</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Enter your soil test values or select a regional preset on the left to receive AI-powered crop recommendations and growth suitability analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
