"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import LogoutButton from "@/components/LogoutButton";
import "./globals.css";

export default function RootLayout({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });
    return () => unsub();
  }, []);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F0F7FF] text-[#1E293B] antialiased">
        <header className="w-full border-b border-blue-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          {/* Keep max-width on header content only if you want the nav centered */}
          <div className="w-full px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">V</span>
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                VERGE
              </span>
            </div>
            
            {loggedIn && (
              <div className="flex items-center space-x-4">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Live Market
                </span>
                <LogoutButton />
              </div>
            )}
          </div>
        </header>

        {/* REMOVED max-w-7xl and mx-auto to allow full-width dashboards */}
        <main className="w-full">
          {children}
        </main>
      </body>
    </html>
  );
}