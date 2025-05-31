import "./styles/globals.css";
import "weather-icons/css/weather-icons.min.css";
import "weather-icons/css/weather-icons-wind.min.css";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WeatherTime Dashboard",
  description: "Minimal weather + metrics dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className="bg-black text-white min-h-screen">
        <div className="min-h-screen flex flex-col">
          <header className="p-4 text-center text-2xl font-semibold tracking-wide bg-zinc-950 shadow">
            WeatherTime Dashboard
          </header>
          <main className="flex-grow grid grid-cols-1 md:grid-cols-6 gap-6 p-6">
            {children}
          </main>
          <footer className="text-center p-4 text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} WeatherTime Dashboard
          </footer>
        </div>
      </body>
    </html>
  );
}
