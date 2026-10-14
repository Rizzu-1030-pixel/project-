import React from 'react';
import { Sprout, ShieldAlert, Heart, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 mt-16 pt-10 pb-8 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-agri-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                AgriSmart <span className="text-agri-600">AI</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md leading-relaxed">
              Empowering smallholder and marginal farmers with accessible, localized, and science-backed AI solutions for plant health diagnostics, water conservation, and soil fertility optimization.
            </p>
            <div className="flex items-center gap-2 text-xs text-agri-700 bg-agri-50 px-3 py-1.5 rounded-lg border border-agri-200 w-fit">
              <span className="w-2 h-2 rounded-full bg-agri-500 animate-pulse"></span>
              Aligned with ICAR & FAO Agronomic Protocols
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider">Core Capabilities</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="hover:text-agri-700 cursor-pointer">PlantVillage Leaf Vision</li>
              <li className="hover:text-agri-700 cursor-pointer">FAO-56 Irrigation Engine</li>
              <li className="hover:text-agri-700 cursor-pointer">22-Crop NPK Recommendation</li>
              <li className="hover:text-agri-700 cursor-pointer">Open-Meteo Weather Alerts</li>
            </ul>
          </div>

          {/* Agricultural Advisory Disclaimer */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-700">
              <ShieldAlert className="w-4 h-4" /> Agronomic Safety
            </h4>
            <p className="text-xs text-slate-500 leading-normal">
              AgriSmart AI recommendations are assistive guidelines based on algorithmic inferences. Farmers are advised to consult their nearest Krishi Vigyan Kendra (KVK) or State Agricultural Department before purchasing or spraying synthetic chemical pesticides.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
          <p>© 2026 AgriSmart AI. Developed for Smart Agriculture Hackathon.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Farmers Across India & Beyond
          </p>
        </div>
      </div>
    </footer>
  );
};
