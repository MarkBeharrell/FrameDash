const nextConfig = {
  env: {
    NEXT_PUBLIC_OPENWEATHER_API: process.env.NEXT_PUBLIC_OPENWEATHER_API,
    NEXT_PUBLIC_CITY: process.env.NEXT_PUBLIC_CITY,
    NEXT_PUBLIC_NUM_CORES: process.env.NEXT_PUBLIC_NUM_CORES,
    NEXT_PUBLIC_REFRESH: process.env.NEXT_PUBLIC_REFRESH
  }
};

export default nextConfig;
