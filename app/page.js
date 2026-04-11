import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F0F7FF] text-[#1E293B]">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center space-y-8 overflow-hidden">
        {/* Subtle Violet Accent Background Element */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-200/40 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Virtual Energy & <span className="text-violet-600">Renewable Green Exchange</span>
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
            Democratizing renewable energy for MSMEs through integrated VPPA marketplaces 
            and advanced risk management[cite: 1960, 2789].
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/login"
              className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg shadow-lg shadow-violet-200 transition-all transform hover:-translate-y-1"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-blue-100">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">The VERGE Ecosystem</h2>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 to-blue-200 -z-10" />

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 p-4 bg-blue-50/50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl border-2 border-blue-200">1</div>
              <h3 className="font-bold text-lg">Generator</h3>
              <p className="text-sm text-gray-600">Produces 100% green energy and issues RECs[cite: 2026, 2996].</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 p-4 bg-violet-50 text-violet-900 rounded-xl ring-2 ring-violet-200">
              <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center font-bold text-xl border-2 border-violet-200">2</div>
              <h3 className="font-bold text-lg">Anchor Buyer</h3>
              <p className="text-sm text-gray-700 font-medium">Retires RECs for ESG compliance & lists excess energy[cite: 2803, 3035].</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 p-4 bg-blue-50/50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl border-2 border-blue-200">3</div>
              <h3 className="font-bold text-lg">MSMEs</h3>
              <p className="text-sm text-gray-600">Procures affordable brown energy with zero infrastructure cost[cite: 2802, 3071].</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-blue-50 hover:border-violet-200 transition-colors">
          <h4 className="font-bold text-violet-600 mb-2">VPPA Engine</h4>
          <p className="text-xs text-gray-500">Automated smart contracts for flexible green procurement[cite: 2078].</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-blue-50 hover:border-violet-200 transition-colors">
          <h4 className="font-bold text-violet-600 mb-2">Risk Hedging</h4>
          <p className="text-xs text-gray-500">Derivatives toolkit to mitigate electricity price volatility[cite: 2087].</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-blue-50 hover:border-violet-200 transition-colors">
          <h4 className="font-bold text-violet-600 mb-2">Grid Intelligence</h4>
          <p className="text-xs text-gray-500">AI-powered situational awareness for load forecasting[cite: 2790, 3132].</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-blue-50 hover:border-violet-200 transition-colors">
          <h4 className="font-bold text-violet-600 mb-2">ESG Reporting</h4>
          <p className="text-xs text-gray-500">Automated carbon accounting for global sustainability norms[cite: 2130, 2871].</p>
        </div>
      </section>
    </div>
  );
}