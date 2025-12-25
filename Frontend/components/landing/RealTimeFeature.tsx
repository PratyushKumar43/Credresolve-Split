'use client'

export default function RealTimeFeature() {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-32 flex flex-col md:flex-row items-center gap-16">
      <div className="w-full md:w-1/2 relative">
        {/* Yellow Background Box */}
        <div className="absolute -top-4 -left-4 w-full h-full bg-[#ccf32f] rounded-[2rem] transform -rotate-2"></div>
        {/* Dark Chart Card */}
        <div className="relative bg-neutral-950 rounded-[2rem] p-6 text-white shadow-xl h-64 overflow-hidden flex flex-col justify-end">
          <span className="absolute top-4 right-6 text-xs text-neutral-400 font-mono">
            Rs 1,245 <br /> <span className="text-green-400">+Rs 320</span>
          </span>
          {/* CSS Chart */}
          <svg viewBox="0 0 300 100" className="w-full h-full opacity-90 overflow-visible">
            <defs>
              <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="0.2"></stop>
                <stop offset="100%" stopColor="#4ade80" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <path d="M0,80 L20,70 L40,85 L60,60 L80,65 L100,40 L120,55 L140,30 L160,45 L180,20 L200,35 L220,15 L240,25 L300,5" fill="none" stroke="#e5e5e5" strokeWidth="1"></path>
            <path d="M0,80 L20,70 L40,85 L60,60 L80,65 L100,40 L120,55 L140,30 L160,45 L180,20 L200,35 L220,15 L240,25 L300,5 V100 H0 Z" fill="url(#gradient)"></path>
          </svg>
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6">Track Expenses Instantly</h2>
        <p className="text-lg text-neutral-500 leading-relaxed">
          Add expenses on the go and see balances update in real time. No waiting, no delays. Everyone in your group sees the latest balances instantly.
        </p>
      </div>
    </section>
  )
}


