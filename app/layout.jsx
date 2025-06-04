import "@/styles/globals.css";
import React from "react";

export const metadata = {
  title: "FrameDash",
  description: "Minimal weather and metrics dashboard for the wall!"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <div className="flex min-h-screen flex-col">
          <main className="grid min-h-screen auto-rows-fr grid-cols-1 gap-6 bg-black p-6 text-white md:grid-cols-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

