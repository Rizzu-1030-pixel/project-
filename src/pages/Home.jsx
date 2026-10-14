import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Scan, 
  Droplets, 
  Wheat, 
  CloudSun, 
  MessageSquareText, 
  LayoutDashboard, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Leaf,
  CheckCircle2,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const Home = ({ setActiveTab }) => {
  const { t } = useLanguage();

  const features = [
    {
      id: 'disease',
      title: t('nav.disease'),
      desc: 'Upload or capture a leaf photo. Identify blight, rust, or mold with instant organic remedies and uncertainty warnings.',
      icon: Scan,
      color: 'bg-emerald-500',
      badge: 'PlantVillage Vision'
    },
    {
      id: 'irrigation',
      title: t('nav.irrigation'),
      desc: 'Optimize pump runtimes with FAO-56 evapotranspiration models and live 48h rain forecast integration.',
      icon: Droplets,
      color: 'bg-blue-500',
      badge: 'Water Conservation'
    },
    {
      id: 'crop',
      title: t('nav.cropRec'),
      desc: 'Machine learning recommendations based on NPK soil nutrients, pH, temperature, and local seasonal rainfall.',
      icon: Wheat,
      color: 'bg-amber-500',
      badge: '22 Indian Crops'
    },
    {
      id: 'weather',
      title: t('nav.weather'),
      desc: 'Real-time hyper-local weather with heavy rain, heatwave, and humidity fungal pathogen alerts.',
      icon: CloudSun,
      color: 'bg-sky-500',
      badge: 'Open-Meteo Live'
    },
    {
      id: 'chatbot',
      title: t('nav.chatbot'),
      desc: 'Multilingual conversational AI in English, Telugu, and Hindi providing safe agricultural guidance.',
      icon: MessageSquareText,
      color: 'bg-teal-500',
      badge: 'EN / తెలుగు / हिन्दी'
    },
    {
      id: 'dashboard',
      title: t('nav.dashboard'),
      desc: 'Unified farm analytics tracking disease history, soil parameters, and water conservation metrics.',
      icon: LayoutDashboard,
      color: 'bg-indigo-500',
      badge: 'Farmer Insights'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl agri-gradient text-white p-8 sm:p-14 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            AI-Driven Agronomic Intelligence
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {t('home.heroTitle')}
          </h1>
          
          <p className="text-base sm:text-lg text-emerald-100 font-normal leading-relaxed">
            {t('home.heroSubtitle')}
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => setActiveTab('disease')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-agri-900 font-bold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              <Scan className="w-5 h-5 text-agri-600" />
              {t('home.ctaScan')}
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={() => setActiveTab('irrigation')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold border border-white/20 transition-all text-sm sm:text-base"
            >
              <Droplets className="w-5 h-5 text-emerald-300" />
              {t('home.ctaIrrigation')}
            </button>
            <button
              onClick={() => setActiveTab('crop')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold border border-white/20 transition-all text-sm sm:text-base"
            >
              <Wheat className="w-5 h-5 text-emerald-300" />
              {t('home.ctaCrop')}
            </button>
          </div>
        </div>

        {/* Decorative background leaf illustration */}
        <div className="absolute -right-12 -bottom-16 opacity-10 pointer-events-none hidden md:block">
          <Leaf className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('home.statCrops'), value: '22 Crops', sub: 'Rice, Maize, Cotton, Pulses...', icon: Wheat },
          { label: t('home.statDiseases'), value: '12 Classes', sub: 'Early/Late Blight, Rust, Blast...', icon: ShieldCheck },
          { label: t('home.statLanguages'), value: '3 Languages', sub: 'English, Telugu, Hindi', icon: MessageSquareText },
          { label: t('home.statAccuracy'), value: '98% Fidelity', sub: 'Tested on ICAR/FAO Baselines', icon: TrendingUp },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm card-hover">
              <div className="w-9 h-9 rounded-xl bg-agri-50 text-agri-700 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-xs sm:text-sm font-medium text-slate-700 mt-0.5">{stat.label}</div>
              <div className="text-[11px] text-slate-400 mt-1">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Core Features Grid */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Core Assistant Modules</h2>
          <p className="text-slate-500 text-sm mt-1">Select any module below to begin your analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => setActiveTab(feat.id)}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${feat.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-agri-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-agri-700">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Social Impact & Innovation Note */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 p-6 sm:p-8 rounded-3xl border border-emerald-200/80 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-agri-800 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-agri-600" />
            Social Impact & Sustainable Farming
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Engineered for India's Small & Marginal Farmers
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            By combining localized crop pathology vision models with multi-lingual regional advice, AgriSmart AI eliminates expensive laboratory wait times and prevents catastrophic yield loss. Our smart irrigation logic directly addresses groundwater depletion by calculating exact liter requirements based on soil texture and impending rainfall.
          </p>
        </div>
      </div>
    </div>
  );
};
