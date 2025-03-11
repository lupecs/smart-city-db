/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import WeatherWidget from "./components/WeatherWidget";

const Dashboard = () => {
  const [selectedCity, setSelectedCity] = useState("New York");

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-5 space-y-4">
        <h2 className="text-xl font-bold text-cyan-400">
          Smart City Dashboard
        </h2>
        <nav className="space-y-2">
          <button className="w-full text-left p-2 bg-gray-700 rounded hover:bg-cyan-500">
            Weather
          </button>
          <button className="w-full text-left p-2 bg-gray-700 rounded hover:bg-cyan-500">
            Air Quality
          </button>
          <button className="w-full text-left p-6 bg-gray-700 rounded hover:bg-cyan-500">
            Traffic
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-4"
        >
          {selectedCity} Overview
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WeatherWidget city={selectedCity} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
