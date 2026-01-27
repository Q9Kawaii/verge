"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

export default function IntelligencePage() {
  const router = useRouter();

  const [authLoading, setAuthLoading] = useState(true);
  const [forecast, setForecast] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [cursor, setCursor] = useState(12);

  const WINDOW_SIZE = 12; // 1 hour window (12 × 5 min)

  // 🔐 Auth guard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/login");
        return;
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, [router]);

  // 🔄 Fetch forecast
  const fetchForecast = async () => {
    const snap = await getDoc(doc(db, "forecast_results", "latest"));
    if (snap.exists()) {
      setForecast(snap.data());
      setLastUpdated(new Date());
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchForecast();
  }, []);

  // 🔁 Auto refresh data (every 10s – demo mode)
  useEffect(() => {
    const interval = setInterval(fetchForecast, 10000);
    return () => clearInterval(interval);
  }, []);

  // ▶ Sliding window animation
  useEffect(() => {
    if (!forecast) return;

    const slide = setInterval(() => {
      setCursor((c) =>
        c < forecast.series.length ? c + 1 : WINDOW_SIZE
      );
    }, 3000);

    return () => clearInterval(slide);
  }, [forecast]);

  if (authLoading) return <p>Checking authentication...</p>;
  if (!forecast) return <p>Loading forecast data...</p>;

  const forecastSeries =
    forecast.series?.slice(
      Math.max(0, cursor - WINDOW_SIZE),
      cursor
    ) || [];

  // ⚠ Dynamic risk computation
  const computeRisk = (series) => {
    if (series.length < 2) return "Low";

    const diffs = series
      .slice(1)
      .map((p, i) => Math.abs(p.load - series[i].load));

    const avgDiff =
      diffs.reduce((a, b) => a + b, 0) / diffs.length;

    if (avgDiff > 25) return "High";
    if (avgDiff > 10) return "Medium";
    return "Low";
  };

  const riskLevel = computeRisk(forecastSeries);

  const riskColor =
    riskLevel === "High"
      ? "bg-red-100 text-red-700"
      : riskLevel === "Medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Grid Intelligence Dashboard</h1>

          {lastUpdated && (
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live • Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Back
        </button>
      </div>

      <p className="text-sm text-gray-600">
        5-minute ahead probabilistic load forecasting derived from real DVC data.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Region</p>
          <p className="text-lg font-semibold">{forecast.region}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Risk Level</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${riskColor}`}
          >
            {riskLevel}
          </span>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Congestion Alert</p>
          <p className="text-lg font-semibold">
            {riskLevel === "High" ? "⚠️ Possible" : "No"}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Forecast Horizon</p>
          <p className="text-xl font-semibold">
            {forecastSeries.length * 5} min
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-lg font-semibold mb-1">
                Probabilistic Load Forecast (MW)
                </h2>

                <p className="text-xs text-gray-500 mb-3">
                Black line = predicted load • Shaded area = uncertainty band
                </p>
            </div>
            <div className="text-black">
                live
            </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={forecastSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="high"
              stroke="none"
              fill="#fde68a"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="low"
              stroke="none"
              fill="#ffffff"
              fillOpacity={1}
            />

            <Line
              type="monotone"
              dataKey="load"
              stroke="#000000"
              strokeWidth={2}
              dot={(props) =>
                props.index === forecastSeries.length - 1 ? (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill="red"
                  />
                ) : null
              }
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Explanation */}
      <div className="bg-white p-6 rounded-lg shadow space-y-2">
        <h2 className="text-lg font-semibold">Why this matters</h2>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Simulates live ingestion of 5-minute grid data</li>
          <li>Shows uncertainty instead of single-point forecasts</li>
          <li>Risk reacts dynamically to volatility</li>
          <li>Aligned with real ADMS decision workflows</li>
        </ul>
      </div>
    </div>
  );
}
