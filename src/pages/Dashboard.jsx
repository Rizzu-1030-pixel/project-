import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getDashboardSummary } from '../services/api';
import { 
  LayoutDashboard, 
  Scan, 
  ShieldCheck, 
  ShieldAlert, 
  Droplets, 
  Wheat, 
  TrendingUp, 
  RefreshCw,
  Clock,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { AlertBanner } from '../components/AlertBanner';

export const Dashboard = () => {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then((res) => setData(res))
      .catch((err) => console.log('Dashboard error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agri-100 text-agri-800 text-xs font-semibold mb-1">
            <LayoutDashboard className="w-3.5 h-3.5 text-agri-600" /> Unified Operations Center
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('dashboard.title')}
          </h1>
          <p className="text-slate-500 text-sm">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {data?.current_weather && (
          <div className="bg-white p-3 px-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-semibold">Live Field Temp</span>
              <span className="text-lg font-black text-slate-900">{Math.round(data.current_weather.temperature)}°C</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-3">
          <RefreshCw className="w-8 h-8 text-agri-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading Farm Records & Sensor History...</p>
        </div>
      )}

      {data && (
        <div className="space-y-6 animate-fadeIn">
          {/* Active Alerts */}
          <AlertBanner alerts={data.active_alerts} />

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-agri-50 text-agri-700 flex items-center justify-center mb-3">
                <Scan className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-500">{t('dashboard.totalScans')}</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                {data.total_scans}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-500">{t('dashboard.healthyLeaves')}</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-0.5">
                {data.healthy_scans}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-3">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-500">{t('dashboard.diseasesFound')}</span>
              <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-0.5">
                {data.diseased_scans}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-500">{t('dashboard.waterSaved')}</span>
              <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-0.5">
                ~18,400 <span className="text-sm font-semibold text-slate-500">Liters</span>
              </div>
            </div>
          </div>

          {/* Charts & Trends */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-agri-600" />
                  {t('dashboard.soilTrend')}
                </h3>
                <p className="text-xs text-slate-400">Monthly progression of root zone moisture and available nitrogen</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span> Moisture (%)
                </div>
                <div className="flex items-center gap-1.5 text-agri-600">
                  <span className="w-3 h-3 rounded-full bg-agri-500"></span> Nitrogen (kg/ha)
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.soil_health_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorNitrogen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorMoisture)" />
                  <Area type="monotone" dataKey="nitrogen" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorNitrogen)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Scans Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-agri-600" />
              {t('dashboard.recentActivity')}
            </h3>

            {data.recent_scans.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Crop</th>
                      <th className="py-3 px-4">Diagnosis</th>
                      <th className="py-3 px-4">Confidence</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.recent_scans.map((scan, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-bold text-slate-900">{scan.crop}</td>
                        <td className="py-3 px-4 text-slate-700">{scan.disease}</td>
                        <td className="py-3 px-4 font-semibold text-agri-700">{Math.round(scan.confidence * 100)}%</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            scan.is_healthy 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {scan.is_healthy ? 'Healthy' : scan.urgency}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{scan.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No disease scans recorded yet. Upload a leaf to get started!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
