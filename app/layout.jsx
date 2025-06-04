/* global localStorage */

"use client";

import "@/styles/globals.css";
import React, { useEffect, useState } from "react";

// const metadata = {
//   title: "FrameDash",
//   description: "Minimal weather and metrics dashboard for the wall!"
// };

export default function RootLayout({ children }) {
  const [isDark, setIsDark] = useState(true);

  // Load preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") setIsDark(false);
  }, []);

  // Store theme preference
  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <html lang="en">
      <body
        className={`flex min-h-screen flex-col ${isDark ? "dark" : ""} dark:bg-black dark:text-white`}
      >
        <main className="grid min-h-screen auto-rows-fr grid-cols-1 gap-6 p-6 md:grid-cols-6">
          <button
            onClick={() => setIsDark(!isDark)}
            className="absolute right-[25px] top-[25px] px-2 py-1 text-lg"
          >
            <i
              className={`wi ${isDark ? "wi-day-sunny" : "wi-night-clear"}`}
            ></i>
          </button>
          {children}
        </main>
      </body>
    </html>
  );
}

