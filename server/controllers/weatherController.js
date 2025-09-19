const { weatherApi } = require('../config/weather'); // This will now work

const getWeatherByCity = async (req, res, next) => {
  const { city } = req.query;

  if (!city) {
    res.status(400);
    return next(new Error('A city name is required.'));
  }

  try {
    const response = await weatherApi.get('/weather', { params: { q: city } });
    res.json(response.data);
  } catch (error) {
    const statusCode = error.response ? error.response.status : 500;
    const message = error.response?.data?.message || 'Failed to fetch weather data.';
    res.status(statusCode);
    next(new Error(message));
  }
};

module.exports = { getWeatherByCity };