"use client"; // ✅ Make it a Client Component

import { useEffect, useState } from "react";
import { useCity } from "../hooks/CityContext"; // Import the useCity hook
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { city, setCity } = useCity(); // Get the city from the context
  const [search, setSearch] = useState(""); // State for the search input
  const { data: session } = useSession(); // ✅ Now works because it's a Client Component

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
              const geoRes = await fetch(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
              );
              const data = await geoRes.json();
              if (data.length > 0) {
                setCity(data[0].name);
              }
            } catch (error) {
              console.error("Error fetching location:", error);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
          }
        );
      }
    };

    getLocation();
  }, [setCity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim() !== "") {
      setCity(search);
      setSearch("");
    }
  };

  const handleSelectCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
  };

  return (
    <header className="bg-black text-neon-green p-4 flex justify-between items-center border-b border-neon-blue shadow-lg">
      <div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search city..."
            className="bg-gray-900 text-neon-green p-2 rounded-md shadow-md"
          />
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 transition p-2 rounded-md shadow-md neon-button"
          >
            Search
          </button>
        </form>

        <select
          className="bg-gray-900 text-neon-green p-2 rounded-md shadow-md mt-4"
          value={city}
          onChange={handleSelectCity}
        >
          <option>Choose City</option>
          <option value="New York">New York</option>
          <option value="Tokyo">Tokyo</option>
          <option value="Los Angeles">Los Angeles</option>
        </select>
      </div>
      <div>
        {session ? (
          <button onClick={() => signOut()} className="text-neon-blue">
            Sign Out
          </button>
        ) : (
          <button onClick={() => signIn("google")} className="text-neon-green">
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
