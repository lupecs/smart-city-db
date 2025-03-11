import axios from "axios";
import React, { useEffect, useState } from "react";

const WeatherWidget = () => {
  interface WeatherData {
    name: string;
    weather: { description: string }[];
    main: { temp: number };
    city: string;
  }

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [city, setCity] = useState("Los Angeles");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        console.log("api key:", apiKey);

        const geoRes = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
        );
        if (geoRes.data.length === 0) return;

        const { lat, lon } = geoRes.data[0];

        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        setWeather(weatherRes.data);
      } catch (error) {
        console.error("Failed to fetch weather. Allow location access.", error);
      }
    };

    fetchWeather();
  }, [city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim() !== "") {
      setCity(search);
      setSearch("");
    }
  };

  return (
    <div className="bg-blue-800 p-4 rounded-lg text-white w-80">
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

      {weather ? (
        <div>
          <h3 className="text-xl font-bold">{weather.name}</h3>
          <p>{weather.weather[0].description}</p>
          <p className="text-2xl">{Math.round(weather.main.temp)}°C</p>
        </div>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
};

export default WeatherWidget;
