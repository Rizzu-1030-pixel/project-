import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getWeather } from '../services/api';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  CloudRain, 
  AlertTriangle, 
  Sun, 
  Calendar, 
  MapPin, 
  RefreshCw,
  Info
} from 'lucide-react';
import { AlertBanner } from '../components/AlertBanner';

export const WeatherAdvisory = () => {
  const { t } = useLanguage();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeather = () => {
    setLoading(true);
    getWeather()
      .then((data) => {
        setWeatherData(data);
        setError(null);
      })
      .catch((err) => {
        setError('Failed to fetch real-time weather information.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadWeather();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
          <CloudSun className="w-3.5 h-3.5 text-sky-600" /> Open-Meteo Precision Forecast
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('weather.title')}
        </h1>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto">
          {t('weather.subtitle')}
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-3">
          <RefreshCw className="w-8 h-8 text-agri-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Connecting to Meteorological Satellites...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {weatherData && (
        <div className="space-y-6 animate-fadeIn">
          {/* Active Agricultural Warnings Banner */}
          <AlertBanner alerts={weatherData.alerts} />

          {/* Current Weather Card */}
          <div className="bg-gradient-to-br from-sky-500 to-blue-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 text-sky-100 text-sm font-semibold">
                  <MapPin className="w-4 h-4" />
                  {weatherData.location}
                </div>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-5xl sm:text-6xl font-black">
                    {Math.round(weatherData.current.temperature)}°C
                  </span>
                  <span className="text-lg font-bold text-sky-100">
                    {weatherData.current.weather_desc}
                  </span>
                </div>
                <p className="text-xs text-sky-100 mt-2 max-w-lg leading-relaxed">
                  {weatherData.agricultural_summary}
                </p>
              </div>

              {/* Live Metric Badges */}
              <div className="grid grid-cols-3 sm:grid-cols-1 gap-2.5 w-full sm:w-auto bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <div className="flex items-center gap-2 text-xs">
                  <Droplets className="w-4 h-4 text-sky-200" />
                  <div>
                    <span className="text-sky-200 block text-[10px]">{t('weather.humidity')}</span>
                    <span className="font-bold">{weatherData.current.humidity}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Wind className="w-4 h-4 text-sky-200" />
                  <div>
                    <span className="text-sky-200 block text-[10px]">{t('weather.wind')}</span>
                    <span className="font-bold">{weatherData.current.wind_speed} km/h</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <CloudRain className="w-4 h-4 text-sky-200" />
                  <div>
                    <span className="text-sky-200 block text-[10px]">{t('weather.precip')}</span>
                    <span className="font-bold">{weatherData.current.precipitation} mm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-agri-600" />
              {t('weather.forecastTitle')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {weatherData.forecast.map((day, idx) => (
                <div
                  key={idx}
                  className={`bg-white p-4 rounded-2xl border shadow-sm flex flex-col justify-between space-y-3 transition-all hover:shadow-md ${
                    idx === 0 ? 'border-agri-500 ring-2 ring-agri-500/20' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-900">{day.day_name}</span>
                      <span className="text-[11px] text-slate-400">{day.date}</span>
                    </div>

                    <div className="flex items-center justify-between my-2">
                      <span className="text-xs font-semibold text-slate-700">{day.weather_desc}</span>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 text-sm">{Math.round(day.temp_max)}°</span>
                        <span className="text-slate-400 text-xs ml-1">/ {Math.round(day.temp_min)}°</span>
                      </div>
                    </div>

                    {day.precipitation_sum > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg w-fit mt-1">
                        <CloudRain className="w-3.5 h-3.5" />
                        <span>{day.precipitation_sum} mm rain expected</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      {t('weather.advisory')}
                    </span>
                    <p className="text-xs text-slate-700 leading-snug">
                      {day.farming_advisory}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
