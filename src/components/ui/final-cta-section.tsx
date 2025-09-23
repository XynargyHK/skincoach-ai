'use client'

export default function FinalCTASection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-emerald-900/20"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        {/* Urgency Quote */}
        <div className="mb-8">
          <div className="inline-block bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-3xl px-8 py-4 mb-6">
            <p className="text-red-200 text-lg md:text-xl font-medium italic">
              "Your next skin damage might be irreversible."
            </p>
          </div>
        </div>

        {/* Main Headline */}
        <h2 className="text-white font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
          Don't Let Breakouts Become
          <span className="block bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Permanent Scars
          </span>
        </h2>

        {/* Supporting Text */}
        <p className="text-slate-300 text-xl md:text-2xl leading-relaxed mb-12 max-w-3xl mx-auto">
          Every day you wait is another day your skin isn't healing. Every breakout could be the one that leaves a lasting mark.
        </p>

        {/* Call to Action Points */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-white font-bold text-xl mb-3">Don't Wait. Don't Overthink.</h3>
            <p className="text-slate-300 leading-relaxed">
              The science is proven. The reviews speak for themselves. Your skin needs action, not more research.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-white font-bold text-xl mb-3">Our Solution Is The Right Decision.</h3>
            <p className="text-slate-300 leading-relaxed">
              Personalized. Prescription-grade. Proven results. This isn't another skincare experiment—it's your solution.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="space-y-6">
          <a href="/quiz" className="group relative overflow-hidden bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white font-bold text-xl md:text-2xl px-16 py-6 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/25 hover:-translate-y-2 border border-white/10 inline-block">
            <span className="relative z-10 flex items-center justify-center gap-4">
              YES, I WANT MY AI SKIN COACH
              <svg className="w-7 h-7 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </a>

          <p className="text-slate-400 text-sm">
            🔒 30-day guarantee • Cancel anytime • Start improving today
          </p>
        </div>
      </div>
    </section>
  )
}