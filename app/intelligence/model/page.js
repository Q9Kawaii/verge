"use client";

import { useRouter } from "next/navigation";

export default function ModelArchitecture() {
  const router = useRouter();

  const layers = [
    { 
      title: "Data Ingestion", 
      desc: "Integrates simulated SCADA-like streams, weather APIs (IMD), and Eastern Regional Load Dispatch Centre (ERLDC) archives." 
    },
    { 
      title: "Spatio-Temporal Model", 
      desc: "Combines Graph Neural Networks (GNN) for spatial dependencies between nodes (DVC, WBSEB, etc.) and LSTM for temporal sequences." 
    },
    { 
      title: "Uncertainty Layer", 
      desc: "Implemented via Gaussian negative log-likelihood loss, generating 95% confidence bands to quantify grid volatility." 
    },
    { 
      title: "Inference Layer", 
      desc: "A low-latency pipeline delivering probabilistic forecasts every 5 minutes as a non-intrusive decision support tool." 
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-12">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center border-b border-blue-100 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1E293B]">CrySTLFusion Architecture</h1>
          <p className="text-gray-500 mt-2 italic font-medium">Modular AI framework for uncertainty-aware grid forecasting</p>
        </div>
        <button 
          onClick={() => router.back()} 
          className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full font-bold text-sm shadow-sm hover:bg-gray-50 transition-all"
        >
          ← Back
        </button>
      </div>

      {/* Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {layers.map((layer, idx) => (
          <div key={idx} className="p-8 bg-white rounded-[32px] border border-blue-50 shadow-sm hover:border-violet-200 transition-all group">
            <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center font-bold text-2xl mb-6 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
              0{idx + 1}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{layer.title}</h3>
            <p className="text-gray-500 leading-relaxed font-medium">{layer.desc}</p>
          </div>
        ))}
      </div>

      {/* Validation Note */}
      <div className="bg-violet-900 rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl shadow-violet-200">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <h3 className="text-violet-300 font-bold uppercase tracking-widest text-xs">Technical Performance</h3>
            <p className="text-2xl font-light leading-snug italic">
              "CrySTLFusion achieves a 1.1% MAPE, significantly outperforming traditional ARIMA and LSTM baselines in capturing regional grid stress."
            </p>
          </div>
          <div className="hidden md:block w-px h-24 bg-violet-700"></div>
          <div className="text-center">
            <p className="text-4xl font-black">1.1%</p>
            <p className="text-[10px] font-bold text-violet-400 uppercase">Mean Absolute Error</p>
          </div>
        </div>
      </div>
    </div>
  );
}