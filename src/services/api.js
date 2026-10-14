import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
});

export const detectDisease = async (formData) => {
  const response = await api.post('/api/disease/detect', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getDiseaseClasses = async () => {
  const response = await api.get('/api/disease/classes');
  return response.data;
};

export const getSampleLeaves = async () => {
  const response = await api.get('/api/disease/sample-leaves');
  return response.data;
};

export const recommendCrop = async (params) => {
  const response = await api.post('/api/crop/recommend', params);
  return response.data;
};

export const calculateIrrigation = async (params) => {
  const response = await api.post('/api/irrigation/calculate', params);
  return response.data;
};

export const simulateIoTSensor = async (crop = 'Tomato') => {
  const response = await api.get(`/api/irrigation/simulate-sensor?crop=${crop}`);
  return response.data;
};

export const getWeather = async (lat, lon) => {
  const url = lat && lon ? `/api/weather?lat=${lat}&lon=${lon}` : '/api/weather';
  const response = await api.get(url);
  return response.data;
};

export const sendChatMessage = async (message, language = 'en') => {
  const response = await api.post('/api/chat', { message, language });
  return response.data;
};

export const getDashboardSummary = async () => {
  const response = await api.get('/api/dashboard/summary');
  return response.data;
};

export default api;
