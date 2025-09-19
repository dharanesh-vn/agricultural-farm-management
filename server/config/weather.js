const axios = require('axios'); // This will now be found
const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: { appid: process.env.OPENWEATHER_API_KEY, units: 'metric' },
});
const checkWeatherAPIConnection = async () => {
  if (!process.env.OPENWEATHER_API_KEY) {
    console.warn('⚠️  Weather API key not configured.');
    return;
  }
  try {
    await weatherApi.get('/weather?q=London');
    console.log('✅ Weather API connection successful.');
  } catch (error) {
    console.error('❌ Weather API connection failed. Check API key.');
  }
};
module.exports = { weatherApi, checkWeatherAPIConnection };