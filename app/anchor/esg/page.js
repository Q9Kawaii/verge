"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Ensure this is imported

export default function ESGReporting() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [impactData, setImpactData] = useState({ retired: 0, offset: 0 });
  const [retiredRecs, setRetiredRecs] = useState([]);

  useEffect(() => {
    const fetchESGStats = async () => {
      const q = query(collection(db, "recs"), where("status", "==", "retired"));
      const snap = await getDocs(q);
      
      const docs = snap.docs.map(doc => doc.data());
      const totalRetired = docs.reduce((acc, curr) => acc + (curr.energyMWh || 0), 0);
      const totalOffset = totalRetired * 0.8; 

      setRetiredRecs(docs);
      setImpactData({ retired: totalRetired, offset: totalOffset });
      setLoading(false);
    };

    fetchESGStats();
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();

    // 1. Branding Header
    doc.setFontSize(22);
    doc.setTextColor(109, 40, 217); // VERGE Violet
    doc.text("VERGE ESG Audit Report", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
    doc.text("Standard: GHG Protocol Scope 2 Alignment", 14, 33);

    // 2. Summary Details
    doc.setDrawColor(230);
    doc.line(14, 38, 196, 38);
    
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Sustainability Summary", 14, 48);
    
    doc.setFontSize(11);
    doc.text(`Total Renewable Energy Retired: ${impactData.retired.toLocaleString()} MWh`, 14, 58);
    doc.text(`Net Carbon Offset: ${impactData.offset.toLocaleString()} Tons CO2e`, 14, 65);

    // 3. Prepare Table Data
    const tableRows = retiredRecs.map((rec, index) => [
      index + 1,
      rec.generator || "N/A",
      `${rec.energyMWh} MWh`,
      "Retired",
      rec.retiredAt ? new Date(rec.retiredAt).toLocaleDateString() : "Verified"
    ]);

    // 4. FIX: Use autoTable through the imported function explicitly
    // This is the robust way to call it in Next.js Turbopack
    autoTable(doc, {
      startY: 75,
      head: [['#', 'Generator Source', 'Energy Volume', 'Status', 'Date']],
      body: tableRows,
      headStyles: { fillColor: [109, 40, 217] }, 
      alternateRowStyles: { fillColor: [245, 247, 255] },
      margin: { top: 75 }
    });

    // 5. Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("This is a digitally verified report from the VERGE platform ledger.", 14, doc.internal.pageSize.height - 10);

    doc.save(`VERGE_ESG_Report_${new Date().getTime()}.pdf`);
  };

  // ... rest of your component (loading checks and return statement)
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F7FF]">
      <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 italic uppercase">ESG <span className="text-emerald-600 underline">Compliance</span></h1>
          <p className="text-sm text-gray-500 font-medium">Verified Scope 2 Emission Reductions</p>
        </div>
        <button onClick={() => router.back()} className="px-6 py-2 bg-white border border-gray-200 rounded-full font-bold text-sm hover:bg-gray-50 transition-all">← Back</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-blue-50 shadow-sm space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl">📊</div>
          <h2 className="text-2xl font-bold text-gray-900">Carbon Impact Report</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Download your verified carbon accounting ledger. This document is suitable for regulatory audits and annual sustainability disclosures.
          </p>
          <button 
            onClick={exportToPDF}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
          >
            Export PDF Audit Report
          </button>
        </div>

        <div className="bg-violet-900 p-8 rounded-[40px] text-white space-y-6 relative overflow-hidden shadow-xl shadow-violet-200">
          <h3 className="text-violet-300 font-bold uppercase tracking-widest text-xs">Sustainability Milestone</h3>
          <p className="text-3xl font-light leading-snug italic relative z-10">
            "Verified offsets derived from long-term VPPA settlements."
          </p>
          <div className="pt-6 border-t border-violet-800 flex justify-between relative z-10">
            <div>
              <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">Total Energy Retired</p>
              <p className="text-2xl font-black">{impactData.retired.toLocaleString()} MWh</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">Net CO₂ Offset</p>
              <p className="text-2xl font-black">{impactData.offset.toLocaleString()} t</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}