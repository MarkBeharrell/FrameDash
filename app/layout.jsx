import "@/styles/globals.css";
import "weather-icons/css/weather-icons.min.css";
// import "weather-icons/css/weather-icons-wind.min.css";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FrameDash",
  description: "Minimal weather and metrics dashboard for the wall!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className="bg-black text-white min-h-screen">
        <div className="min-h-screen flex flex-col">
          <main className="grid grid-cols-1 md:grid-cols-6 gap-6 p-6 text-white bg-black min-h-screen">
            {children}
          </main>
          <footer className="text-center p-4 text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} Mark Beharrell
          </footer>
        </div>
      </body>
    </html>
  );
}
