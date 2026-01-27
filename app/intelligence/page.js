"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const WINDOW_SIZE = 12; // last 60 minutes (12 × 5 min)

export default function IntelligencePage() {
  const router = useRouter();

  const [authLoading, setAuthLoading] = useState(true);
  const [snapshots, setSnapshots] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  /* 🔐 Auth guard */
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

  /* 🔄 Fetch intelligence snapshots */
  const fetchIntelligence = async () => {
    const q = query(
      collection(db, "grid_intelligence"),
      orderBy("timestamp", "desc"), // IMPORTANT
      limit(WINDOW_SIZE)
    );

    const snap = await getDocs(q);
    const data = snap.docs.map((d) => d.data()).reverse();

    setSnapshots(data);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    fetchIntelligence();
    const interval = setInterval(fetchIntelligence, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, []);

  if (authLoading) return <p>Checking authentication...</p>;
  if (!snapshots.length) return <p>Loading grid intelligence...</p>;

  const latest = snapshots[snapshots.length - 1];

  /* 🔍 LIVE VALUES */
  const riskLevel = latest?.risk_level || "UNKNOWN";
  const gridRiskIndex = latest?.grid_risk_index ?? 0;
  const congestionProb = latest?.congestion_probability ?? 0;
  const loadSheddingRisk = latest?.load_shedding_risk ?? 0;
  const recommendation = latest?.recommendation || "—";

  const riskColor =
    riskLevel === "HIGH"
      ? "bg-red-100 text-red-700"
      : riskLevel === "MEDIUM"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  /* 📈 SYSTEM RISK SERIES (TIME-BASED) */
  const riskSeries = snapshots.map((s) => ({
    time: new Date(s.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    risk: s.grid_risk_index ?? 0,
  }));

  /* 🌐 NODE-LEVEL RISK SERIES */
  const nodeRiskSeries = snapshots.map((s) => ({
    time: new Date(s.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    DVC: s.node_risk?.DVC ?? 0,
    BSEB: s.node_risk?.BSEB ?? 0,
    WBSEB: s.node_risk?.WBSEB ?? 0,
    SIKKIM: s.node_risk?.SIKKIM ?? 0,
  }));

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Grid Intelligence Dashboard</h1>
          {lastUpdated && (
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live • Polled {lastUpdated.toLocaleTimeString()}
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

      {/* STATUS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Region</p>
          <p className="font-semibold">DVC (Eastern Grid)</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Risk Level</p>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${riskColor}`}>
            {riskLevel}
          </span>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Grid Risk Index</p>
          <p className="font-semibold">{gridRiskIndex.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Congestion Probability</p>
          <p className="font-semibold">{(congestionProb * 100).toFixed(1)}%</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Load Shedding Risk</p>
          <p className="font-semibold">{(loadSheddingRisk * 100).toFixed(1)}%</p>
        </div>
      </div>

      {/* SYSTEM-LEVEL RISK GRAPH */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">
          System-Level Grid Risk (5-Minute Resolution)
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={riskSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="risk"
              stroke="#000000"
              strokeWidth={2}
              dot={(props) =>
                props.index === riskSeries.length - 1 ? (
                  <g>
                    <circle cx={props.cx} cy={props.cy} r={7} fill="red" opacity={0.25} />
                    <circle cx={props.cx} cy={props.cy} r={3} fill="red" />
                  </g>
                ) : null
              }
            />
          </LineChart>
        </ResponsiveContainer>

        <p className="text-xs text-gray-500 mt-2">
          Red dot indicates latest grid intelligence snapshot
        </p>
      </div>

      {/* NODE-LEVEL RISK GRAPH */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">
          Node-Level Risk Breakdown
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={nodeRiskSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />

            <Line dataKey="DVC" stroke="#000000" strokeWidth={2} />
            <Line dataKey="BSEB" stroke="#2563eb" />
            <Line dataKey="WBSEB" stroke="#dc2626" />
            {/* <Line dataKey="SIKKIM" stroke="#16a34a" /> */}
          </LineChart>
        </ResponsiveContainer>

        <p className="text-xs text-gray-500 mt-2">
          Regional contribution to overall grid stress
        </p>
      </div>

      {/* RECOMMENDATION */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold">System Recommendation</h2>
        <p className="text-sm text-gray-700 mt-1">{recommendation}</p>
        <p className="text-xs text-gray-500 mt-2">
          Advisory only — no automated dispatch actions.
        </p>
      </div>
    </div>
  );
}
