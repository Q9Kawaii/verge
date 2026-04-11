"use client";

import { useRouter } from "next/navigation";

export default function ForecastDeepDive() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-12 px-6">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
            Probabilistic <span className="text-violet-600 font-light italic">Forecast</span>
          </h1>
          <p className="text-sm text-gray-400 font-medium">Real-time situational awareness dashboard</p>
        </div>
        <button 
          onClick={() => router.back()} 
          className="px-8 py-3 bg-violet-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-violet-100 hover:bg-violet-700 transition-all active:scale-95"
        >
          Return to Hub
        </button>
      </div>

      {/* Visualization Canvas */}
      <div className="bg-white rounded-[48px] border border-blue-50 p-12 shadow-sm min-h-[500px] flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#8b5cf6 1px, transparent 1px)', size: '20px 20px' }}></div>
        
        <div className="w-24 h-24 bg-violet-50 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-12 h-12 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        </div>
        
        <div className="text-center space-y-3 z-10">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Advanced Analytics Layer</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto font-medium">
              Integrating weather-driven ramp predictions and uncertainty bands for decision support across the Eastern Regional Grid.
            </p>
        </div>

        {/* Technical Params */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl pt-10 z-10">
            <div className="text-center p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Input Window</p>
              <p className="text-xl font-bold text-blue-900 font-mono">60 MINS</p>
            </div>
            <div className="text-center p-6 bg-violet-50 rounded-3xl border border-violet-100">
              <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1">Forecast Horizon</p>
              <p className="text-xl font-bold text-violet-900 font-mono">30 MINS</p>
            </div>
            <div className="text-center p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Resolution</p>
              <p className="text-xl font-bold text-blue-900 font-mono">5 MINS</p>
            </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-2xl flex items-center justify-center gap-3">
        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest italic">
          Decision Support System • Non-Intrusive Market Integration
        </p>
      </div>
    </div>
  );
}