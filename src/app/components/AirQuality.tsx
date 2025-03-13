import { useEffect, useState } from "react";
import { useCity } from "../hooks/CityContext";
import { motion } from "framer-motion";
import axios from "axios";

const AirQualityWidget = () => {
  interface AirQualityData {
    name: string;
    aqi: number;
    components: {
      pm2_5: number;
      pm10: number;
      co: number;
      no2: number;
      o3: number;
      so2: number;
    };
  }

  const { city } = useCity();
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(false);

  const getQuality = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  useEffect(() => {
    const fetchAirQuality = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

        const geoRes = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
        );
        if (geoRes.data.length === 0) return;

        const { lat, lon } = geoRes.data[0];

        const airQualityRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        setAirQuality(airQualityRes.data.list[0]);
      } catch (error) {
        console.error("Failed to fetch air quality", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAirQuality();
  }, [city]);

  return (
    <motion.div
      className="bg-black bg-opacity-80 rounded-xl text-white w-full max-w-md shadow-lg neon-glow border border-cyan-400 p-6 md:p-8 mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4">
        Air Quality in {airQuality.name || city}
      </h2>
      {loading && <p>Loading...</p>}
      {airQuality && (
        <>
          <p className="text-lg">
            Air Quality Index:{" "}
            <span className="font-semibold text-cyan-400">
              {airQuality.aqi} ({getQuality(airQuality.aqi)})
            </span>
          </p>
          <p className="text-lg">
            PM2.5:{" "}
            <span className="font-semibold">
              {airQuality.components.pm2_5} μg/m³
            </span>
          </p>
          <p className="text-lg">
            PM10:{" "}
            <span className="font-semibold">
              {airQuality.components.pm10} μg/m³
            </span>
          </p>
          <p className="text-lg">
            CO:{" "}
            <span className="font-semibold">
              {airQuality.components.co} μg/m³
            </span>
          </p>
          <p className="text-lg">
            NO2:{" "}
            <span className="font-semibold">
              {airQuality.components.no2} μg/m³
            </span>
          </p>
          <p className="text-lg">
            O3:{" "}
            <span className="font-semibold">
              {airQuality.components.o3} μg/m³
            </span>
          </p>
          <p className="text-lg">
            SO2:{" "}
            <span className="font-semibold">
              {airQuality.components.so2} μg/m³
            </span>
          </p>
        </>
      )}
    </motion.div>
  );
};

export default AirQualityWidget;
