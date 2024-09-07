import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './index.css'

const WeatherPage = () => {
  const { cityName } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = '047c27b6b500dcf7cad54a376235b55c';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error('Weather data not available');
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchWeather();
  }, [cityName]);

  if (loading) return <p className="message">Loading weather data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="weather-page">
      <h1>Weather for <span>{cityName}</span></h1>
      {weatherData && (
        <div className="weather-info">
          <p>Temperature: {weatherData.main.temp}°K</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
