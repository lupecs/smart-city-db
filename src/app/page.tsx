"use client";
import AirQualityWidget from "./components/AirQuality";
import WeatherWidget from "./components/WeatherWidget";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 md:p-8">
      <main className="w-full flex justify-evenly">
        <WeatherWidget />
        <AirQualityWidget />
      </main>
    </div>
  );
};

export default Dashboard;
