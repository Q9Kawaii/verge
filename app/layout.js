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
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="w-full border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <span className="font-semibold">VERGE</span>
            {loggedIn && <LogoutButton />}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
