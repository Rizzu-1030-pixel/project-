import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { DiseaseDetection } from './pages/DiseaseDetection';
import { SmartIrrigation } from './pages/SmartIrrigation';
import { CropRecommendation } from './pages/CropRecommendation';
import { WeatherAdvisory } from './pages/WeatherAdvisory';
import { FarmerChatbot } from './pages/FarmerChatbot';
import { Dashboard } from './pages/Dashboard';

export function AppContent() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'disease':
        return <DiseaseDetection />;
      case 'irrigation':
        return <SmartIrrigation />;
      case 'crop':
        return <CropRecommendation />;
      case 'weather':
        return <WeatherAdvisory />;
      case 'chatbot':
        return <FarmerChatbot />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
