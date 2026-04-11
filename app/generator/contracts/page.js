"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GeneratorContracts() {
  const router = useRouter();

  const contracts = [
    {
      id: "VPPA-7721-ABC",
      anchor: "ABC Cement Ltd",
      capacity: "3,000 MWh",
      strikePrice: "₹4.50/kWh",
      marketPrice: "₹4.10/kWh",
      duration: "10 Years",
      status: "Active",
      settlement: "Receiving",
      nextAudit: "Oct 24, 2025"
    },
    {
      id: "VPPA-9902-XYZ",
      anchor: "XYZ Steel Corp",
      capacity: "6,000 MWh",
      strikePrice: "₹4.25/kWh",
      marketPrice: "₹4.60/kWh",
      duration: "15 Years",
      status: "Active",
      settlement: "Paying",
      nextAudit: "Nov 12, 2025"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">VPPA Contract Ledger</h1>
          <p className="text-gray-500 text-sm font-medium">Manage long-term virtual power purchase agreements and CfD settlements.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-violet-200 text-violet-600 rounded-xl text-sm font-bold hover:bg-violet-50 transition-all">
            Download Report
          </button>
          <button 
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Contracted Capacity</p>
          <p className="text-2xl font-bold text-gray-900">9,000 MWh</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Average Strike Price</p>
          <p className="text-2xl font-bold text-violet-600">₹4.37/kWh</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contract Health</p>
          <p className="text-2xl font-bold text-emerald-500">100% Verified</p>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-[32px] border border-blue-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Contract ID</th>
                <th className="px-8 py-5">Anchor Buyer</th>
                <th className="px-8 py-5">Capacity</th>
                <th className="px-8 py-5">Strike Price</th>
                <th className="px-8 py-5">Settlement</th>
                <th className="px-8 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {contracts.map((contract) => (
                <tr key={contract.id} className="group hover:bg-violet-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <span className="font-mono text-xs text-gray-400 font-bold">{contract.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-900">{contract.anchor}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{contract.duration} Tenure</p>
                  </td>
                  <td className="px-8 py-6 text-gray-600 font-medium">{contract.capacity}</td>
                  <td className="px-8 py-6">
                    <span className="text-violet-600 font-bold">{contract.strikePrice}</span>
                    <p className="text-[10px] text-gray-400">Fixed Rate</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      contract.settlement === 'Receiving' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {contract.settlement}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button className="text-xs font-bold text-violet-600 border border-violet-100 px-4 py-2 rounded-lg hover:bg-violet-600 hover:text-white transition-all">
                      View Terms
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational Tooltip for Generator */}
      <div className="bg-violet-50 border border-violet-100 p-6 rounded-[24px] flex gap-4">
        <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="text-violet-900 font-bold text-sm mb-1">Understanding CfD Settlements</h4>
          <p className="text-violet-700 text-xs leading-relaxed max-w-3xl">
            In a Virtual PPA, physical energy is sold to the grid. The financial settlement happens between you and the Anchor. 
            If the <strong>Market Price</strong> is below the <strong>Strike Price</strong>, the Anchor pays you the difference. 
            If it's above, you pay the Anchor. This ensures revenue stability for your renewable project regardless of market volatility.
          </p>
        </div>
      </div>
    </div>
  );
}