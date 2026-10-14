import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sprout, 
  Scan, 
  Droplets, 
  Wheat, 
  CloudSun, 
  MessageSquareText, 
  LayoutDashboard, 
  Menu, 
  X,
  Globe
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t('nav.home'), icon: Sprout },
    { id: 'disease', label: t('nav.disease'), icon: Scan },
    { id: 'irrigation', label: t('nav.irrigation'), icon: Droplets },
    { id: 'crop', label: t('nav.cropRec'), icon: Wheat },
    { id: 'weather', label: t('nav.weather'), icon: CloudSun },
    { id: 'chatbot', label: t('nav.chatbot'), icon: MessageSquareText },
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="w-10 h-10 rounded-xl bg-agri-600 flex items-center justify-center text-white shadow-md shadow-agri-600/30 mr-3">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                AgriSmart <span className="text-agri-600 font-extrabold">AI</span>
                <span className="text-xs bg-agri-100 text-agri-800 font-semibold px-2 py-0.5 rounded-full border border-agri-200 ml-1">
                  🌱 v1.0
                </span>
              </span>
              <p className="text-[11px] text-slate-500 hidden sm:block leading-none mt-0.5">
                {t('appTagline')}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-agri-50 text-agri-700 font-semibold border border-agri-200/80 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-agri-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Language Selector & Mobile Hamburger */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1 hidden sm:inline" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'en'
                    ? 'bg-white text-agri-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'te'
                    ? 'bg-white text-agri-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                తెలుగు
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'hi'
                    ? 'bg-white text-agri-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-3 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-agri-50 text-agri-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-agri-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
