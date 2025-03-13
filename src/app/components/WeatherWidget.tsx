"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCity } from "../hooks/CityContext";
import Image from "next/image";

const WeatherWidget = () => {
  interface WeatherData {
    name: string;
    weather: { description: string; icon: string }[];
    main: { temp: number; humidity: number };
    wind: { speed: number };
    rain?: { "1h": number }; // Rain data
  }

  const { city } = useCity();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState("imperial"); // Default unit: Fahrenheit
  const [tempInCelsius, setTempInCelsius] = useState<number | null>(null); // Store temp in Celsius for smooth conversion

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

        const geoRes = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
        );
        if (geoRes.data.length === 0) return;

        const { lat, lon } = geoRes.data[0];

        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}` // Always fetch in Celsius
        );
        setWeather(weatherRes.data);
        setTempInCelsius(weatherRes.data.main.temp); // Store the Celsius temperature
      } catch (error) {
        console.error("Failed to fetch weather", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  // Convert the stored Celsius temp to Fahrenheit when switching units
  const getTemperature = () => {
    if (unit === "imperial") {
      return tempInCelsius ? (tempInCelsius * 9) / 5 + 32 : null;
    } else {
      return tempInCelsius;
    }
  };

  return (
    <motion.div
      className="bg-black bg-opacity-80 rounded-xl text-white w-full max-w-md shadow-lg neon-glow border border-cyan-400 p-6 md:p-8 mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Widget Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">
          Weather in {weather?.name || city}
        </h3>
        <select
          className="bg-gray-800 text-cyan-300 p-1 rounded-md"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="imperial">°F</option>
          <option value="metric">°C</option>
        </select>
      </div>

      {/* Weather Info */}
      {loading ? (
        <p>Loading...</p>
      ) : weather ? (
        <div className="flex flex-col space-y-2 justify-center items-center">
          <div className="flex items-center mb-4">
            {/* Weather Icon */}
            <Image
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
              width={48}
              height={48}
              className="mr-2"
            />
            <p className="text-lg">{weather.weather[0].description}</p>
          </div>
          <p>Temperature: {getTemperature()}°</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} mph</p>
          {weather.rain && (
            <p>Rain: {weather.rain["1h"]} mm in the last hour</p>
          )}
        </div>
      ) : (
        <p>No weather data available</p>
      )}
    </motion.div>
  );
};

export default WeatherWidget;
