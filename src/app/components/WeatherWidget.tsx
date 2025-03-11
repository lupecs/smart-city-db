import axios from "axios";
import React, { useEffect, useState } from "react";

const WeatherWidget = () => {
  interface WeatherData {
    name: string;
    weather: { description: string; icon: string }[];
    main: { temp: number };
    city: string;
  }

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [city, setCity] = useState(
    localStorage.getItem("lastCity") || "Los Angeles"
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  const fetchWeather = async (selectedCity: string) => {
    try {
      setLoading(true);
      setError("");

      const geoRes = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${selectedCity}&limit=1&appid=${apiKey}`
      );
      if (geoRes.data.length === 0) {
        setError("City not found");
        return;
      }

      const { lat, lon } = geoRes.data[0];
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      setWeather(weatherRes.data);
      localStorage.setItem("lastCity", selectedCity);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Failed to fetch weather data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeather(city);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim() !== "") {
      setCity(search);
      fetchWeather(search);
      setSearch("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 to-indigo-800 p-6 rounded-lg text-white shadow-lg w-80">
      <form onSubmit={handleSearch} className="mb-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search city..."
          className="w-full p-2 text-black rounded-md"
        />
        <button
          type="submit"
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 p-2 rounded-md"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center">Loading weather...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      {weather && !loading && !error && (
        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold">{weather.name}</h3>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
            className="mx-auto"
          />
          <p>{weather.weather[0].description}</p>
          <p className="text-2xl font-bold">
            {Math.round(weather.main.temp)}°C
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
