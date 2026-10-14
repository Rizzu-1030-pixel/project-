import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { calculateIrrigation, simulateIoTSensor } from '../services/api';
import { 
  Droplets, 
  Cpu, 
  CloudRain, 
  AlertCircle, 
  CheckCircle, 
  Calendar, 
  Sparkles, 
  Info,
  Waves,
  RefreshCw,
  Clock
} from 'lucide-react';

export const SmartIrrigation = () => {
  const { t } = useLanguage();
  const [cropType, setCropType] = useState('Tomato');
  const [soilMoisture, setSoilMoisture] = useState(28);
  const [temperature, setTemperature] = useState(30.0);
  const [humidity, setHumidity] = useState(60.0);
  const [growthStage, setGrowthStage] = useState('Flowering');
  const [soilType, setSoilType] = useState('Loamy');
  const [fieldSize, setFieldSize] = useState(1.5);
  const [useLiveWeather, setUseLiveWeather] = useState(true);

  const [loading, setLoading] = useState(false);
  const [sensorLoading, setSensorLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [error, setError] = useState(null);

  const handleSimulateSensor = async () => {
    try {
      setSensorLoading(true);
      setError(null);
      const data = await simulateIoTSensor(cropType);
      setSensorData(data);
      setSoilMoisture(data.soil_moisture_pct);
      setTemperature(data.soil_temperature_c + 2.0); // ambient roughly 2C higher
    } catch (err) {
      setError('Could not connect to simulated sensor node.');
    } finally {
      setSensorLoading(false);
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await calculateIrrigation({
        crop_type: cropType,
        soil_moisture: parseFloat(soilMoisture),
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        growth_stage: growthStage,
        soil_type: soilType,
        field_size_acres: parseFloat(fieldSize),
        use_live_weather: useLiveWeather
      });
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to calculate irrigation needs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <Droplets className="w-3.5 h-3.5 text-blue-600" /> FAO-56 Precision Hydro-Model
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('irrigation.title')}
        </h1>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto">
          {t('irrigation.subtitle')}
        </p>
      </div>

      {/* IoT Sensor Simulator Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-2xl border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              IoT Sensor Hardware Integration
              <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                Simulated Node Mode
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              No physical sensors in your field? Test with realistic simulated telemetry.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSimulateSensor}
          disabled={sensorLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all whitespace-nowrap"
        >
          {sensorLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Waves className="w-4 h-4" />}
          {t('irrigation.simulateBtn')}
        </button>
      </div>

      {sensorData && (
        <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-fadeIn">
          <div>
            <span className="text-slate-400">Node ID:</span>
            <p className="font-bold text-slate-800">{sensorData.sensor_id}</p>
          </div>
          <div>
            <span className="text-slate-400">Soil Moisture:</span>
            <p className="font-bold text-blue-700">{sensorData.soil_moisture_pct}%</p>
          </div>
          <div>
            <span className="text-slate-400">Soil Temperature:</span>
            <p className="font-bold text-slate-800">{sensorData.soil_temperature_c}°C</p>
          </div>
          <div>
            <span className="text-slate-400">Node Battery:</span>
            <p className="font-bold text-emerald-600">{sensorData.battery_level_pct}% (Optimal)</p>
          </div>
        </div>
      )}

      {/* Inputs and Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <form onSubmit={handleCalculate} className="space-y-4">
            {/* Crop Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('irrigation.cropLabel')}
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500"
              >
                <option value="Tomato">Tomato (టొమాటో)</option>
                <option value="Rice">Rice / Paddy (వరి)</option>
                <option value="Maize">Maize / Corn (మొక్కజొన్న)</option>
                <option value="Potato">Potato (బంగాళాదుంప)</option>
                <option value="Cotton">Cotton (ప్రత్తి)</option>
                <option value="Banana">Banana (అరటి)</option>
                <option value="Apple">Apple (ఆపిల్)</option>
              </select>
            </div>

            {/* Soil Moisture Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  {t('irrigation.moistureLabel')}
                </label>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  soilMoisture < 25 ? 'bg-red-100 text-red-700' :
                  soilMoisture < 45 ? 'bg-amber-100 text-amber-700' :
                  soilMoisture > 80 ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {soilMoisture}% ({soilMoisture < 25 ? 'Critical Wilting' : soilMoisture < 45 ? 'Low' : soilMoisture > 80 ? 'Waterlogged' : 'Adequate'})
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Growth Stage & Soil Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('irrigation.stageLabel')}
                </label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500"
                >
                  <option value="Initial">Initial / Seedling</option>
                  <option value="Vegetative">Vegetative</option>
                  <option value="Flowering">Flowering / Booting</option>
                  <option value="Yield Formation">Fruit / Grain Formation</option>
                  <option value="Ripening">Ripening / Harvest</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('irrigation.soilLabel')}
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500"
                >
                  <option value="Loamy">Loamy (ఎర్ర / ఒండ్రు నేల)</option>
                  <option value="Clay">Clay (నల్లరేగడి నేల)</option>
                  <option value="Sandy">Sandy (ఇసుక నేల)</option>
                  <option value="Silt">Silt (మట్టి నేల)</option>
                </select>
              </div>
            </div>

            {/* Field Size & Weather Impact Toggle */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('irrigation.fieldSizeLabel')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={fieldSize}
                  onChange={(e) => setFieldSize(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="liveWeather"
                checked={useLiveWeather}
                onChange={(e) => setUseLiveWeather(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="liveWeather" className="text-xs text-slate-700 font-medium cursor-pointer">
                {t('irrigation.useWeatherLabel')}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Droplets className="w-4 h-4" />
                  {t('irrigation.calculateBtn')}
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

        {/* Results Output */}
        <div className="lg:col-span-6">
          {result ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 animate-fadeIn">
              {/* Primary Status Card */}
              <div className={`p-5 rounded-2xl border ${
                result.irrigation_needed 
                  ? 'bg-blue-50/70 border-blue-200' 
                  : 'bg-emerald-50/70 border-emerald-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {result.irrigation_needed ? (
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Droplets className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Recommendation
                      </span>
                      <h3 className="text-lg font-black text-slate-900">
                        {result.irrigation_needed ? t('irrigation.waterNeeded') : t('irrigation.waterNotNeeded')}
                      </h3>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    result.irrigation_needed 
                      ? 'bg-blue-600 text-white border-transparent' 
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {result.status}
                  </span>
                </div>

                {/* Quantitative Volume Metrics */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-black/5">
                  <div className="bg-white/80 p-3 rounded-xl border border-black/5">
                    <span className="text-[11px] text-slate-500 font-semibold">{t('irrigation.waterVolume')}</span>
                    <div className="text-2xl font-black text-blue-700 mt-0.5">
                      {result.water_amount_liters_per_sqm} <span className="text-xs font-medium text-slate-600">L/m²</span>
                    </div>
                  </div>

                  <div className="bg-white/80 p-3 rounded-xl border border-black/5">
                    <span className="text-[11px] text-slate-500 font-semibold">{t('irrigation.totalVolume')}</span>
                    <div className="text-2xl font-black text-slate-900 mt-0.5">
                      {result.total_water_liters.toLocaleString()} <span className="text-xs font-medium text-slate-600">Liters</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather Impact Notice */}
              {result.weather_impact && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <CloudRain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Weather Impact & Forecast Adjustment
                    </h4>
                    <p className="text-xs text-slate-800 mt-1 leading-relaxed">
                      {result.weather_impact}
                    </p>
                  </div>
                </div>
              )}

              {/* 3-Day Projected Schedule */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  3-Day Field Irrigation Schedule
                </h4>
                <div className="space-y-2">
                  {result.irrigation_schedule.map((slot, i) => (
                    <div key={i} className="flex justify-between items-center text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <div>
                        <span className="font-bold text-slate-900 mr-2">{slot.day}:</span>
                        <span className={`font-semibold ${slot.action === 'Irrigate' ? 'text-blue-700' : 'text-slate-600'}`}>
                          {slot.action}
                        </span>
                        {slot.volume_liters_sqm > 0 && (
                          <span className="text-slate-500 ml-1">({slot.volume_liters_sqm} L/m²)</span>
                        )}
                      </div>
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {slot.timing}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Water Saving Tips */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  {t('irrigation.savingTips')}
                </h4>
                <ul className="space-y-1.5 text-xs text-emerald-950">
                  {result.water_saving_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center">
                <Droplets className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-700">Calculate Water Needs</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Adjust the soil moisture and crop parameters on the left or simulate IoT sensor readings to receive an immediate irrigation schedule.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
