const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();

const API_KEY = process.env.OPENWEATHER_API;
const CITY = process.env.CITY || "Burnham-on-Crouch,GB";
const UNITS = "metric";
const PORT = process.env.PORT || 3004;

// Enable CORS
app.use(cors({ origin: "http://10.0.0.1:3001" }));

// Serve Weather Icons from npm
app.use("/icons", express.static(path.join(__dirname, "node_modules/weather-icons")));

// Time endpoint
app.get("/api/time", (req, res) => {
  const now = new Date();
  res.json({
    date: now.toISOString().split("T")[0],
    time: now.toTimeString().split(" ")[0]
  });
});

// OpenWeather to Weather Icons mapping
const iconMap = {
  Clear: "wi-day-sunny",
  Clouds: "wi-day-cloudy",
  Rain: "wi-rain",
  Drizzle: "wi-showers",
  Thunderstorm: "wi-thunderstorm",
  Snow: "wi-snow",
  Mist: "wi-fog",
  Fog: "wi-fog",
  Haze: "wi-day-haze",
  Smoke: "wi-smoke",
  Dust: "wi-dust",
  Sand: "wi-sandstorm",
  Ash: "wi-volcano",
  Squall: "wi-strong-wind",
  Tornado: "wi-tornado"
};

// Helper: Format timestamp to HH:mm
const toLocalTime = ts =>
  new Date(ts * 1000).toTimeString().split(" ")[0].slice(0, 5);

// Main weather endpoint
app.get("/api/weather", async (req, res) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=${UNITS}`;
    const response = await axios.get(url);
    const data = response.data;

    const iconClass = iconMap[data.weather[0].main] || "wi-na";

    // Example 3-hourly forecast for today (mocked, real forecast would use /forecast)
    const forecastToday = [
      { icon: "wi-day-cloudy", temp: 15, time: "13:00" },
      { icon: "wi-day-sunny", temp: 17, time: "15:00" },
      { icon: "wi-day-cloudy", temp: 16, time: "17:00" },
      { icon: "wi-night-clear", temp: 13, time: "21:00" }
    ];

    // Example tomorrow summary
    const forecastTomorrow = {
      icon: "wi-rain",
      temp: 10,
      desc: "Light rain"
    };

    res.json({
      city: data.name,
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      weather: data.weather[0].main,
      icon: iconClass,
      wind: data.wind.speed,
      rain: data.rain?.["1h"] || 0,
      pressure: data.main.pressure,
      aqi: "Good", // Placeholder unless integrating AQI API
      sunrise: toLocalTime(data.sys.sunrise),
      sunset: toLocalTime(data.sys.sunset),
      forecastToday,
      forecastTomorrow
    });
  } catch (e) {
    console.error("❌ Weather fetch failed:", e.message);
    res.status(500).json({ error: "Weather fetch failed", details: e.toString() });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Weather Info API running at http://10.0.0.1:${PORT}`);
});
