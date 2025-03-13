"use client";
import React from "react";
import "./globals.css"; // Import global styles (if applicable)
import { CityProvider } from "./hooks/CityContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden">
        <SessionProvider>
          <CityProvider>
            <Header />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 p-8 ml-64 mt-4">
                {" "}
                {children}
              </main>
            </div>
          </CityProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
