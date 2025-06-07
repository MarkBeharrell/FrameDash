"use client";

// import InstallPrompt from "@/lib/prompt";
import { WeatherProvider, useWeather } from "@/lib/weatherContext";
import "@/styles/globals.css";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";

// const metadata = {
//   title: "FrameDash",
//   description: "Minimal fullscreen app",
//   appleWebApp: {
//     capable: true,
//     title: "FrameDash",
//     statusBarStyle: "black-translucent"
//   }
// };

function ThemedBody({ children }) {
  const { weather } = useWeather();
  const [autoDark, setAutoDark] = useState(true); // determines if auto mode is active
  const [manualDark, setManualDark] = useState(false); // manual override value

  const isDark = autoDark
    ? (() => {
        if (!weather) return true;
        const now = Math.floor(Date.now() / 1000);
        return now < weather.sunriseRaw || now > weather.sunsetRaw;
      })()
    : manualDark;

  return (
    <body
      className={`flex min-h-screen flex-col ${isDark ? "dark" : ""} dark:bg-black dark:text-white`}
    >
      <ToastContainer />
      {/* <InstallPrompt /> */}
      <main className="relative grid min-h-screen auto-rows-fr grid-cols-1 gap-6 p-6 md:grid-cols-6">
        {/* Toggle Button */}
        <button
          onClick={() => {
            if (autoDark) {
              setAutoDark(false);
              setManualDark(!isDark);
            } else {
              setManualDark(!manualDark);
            }
          }}
          title={autoDark ? "Auto theme (sun-based)" : "Manual theme toggle"}
          className="absolute right-[25px] top-[25px] px-2 py-1 text-lg"
        >
          <i className={`wi ${isDark ? "wi-day-sunny" : "wi-night-clear"}`} />
        </button>

        {/* Reset to auto mode */}
        {!autoDark && (
          <button
            onClick={() => setAutoDark(true)}
            className="absolute right-[65px] top-[34px] rounded-md border px-1 py-0 text-xs text-gray-400"
          >
            AUTO
          </button>
        )}

        {children}
      </main>
    </body>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <WeatherProvider>
        <ThemedBody>{children}</ThemedBody>
      </WeatherProvider>
    </html>
  );
}
