'use client'

export default function HowItWorksSection() {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-white font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            💧 How It Works
          </h2>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
            Diagnosed by AI. Formulated with intelligence. Coached for life.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mb-16">
          {/* Step 1 */}
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="11" cy="11" r="3" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <div className="text-cyan-400 font-bold text-3xl mb-4">Step 1: Diagnose</div>
                <p className="text-slate-300 text-base leading-relaxed mb-4">
                  We gather information about your profile, lifestyle, and concerns, then create your personal care blueprint.
                </p>
                <p className="text-slate-400 text-base italic">
                  It's like your personal beauty lab — from head to toe.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v18M12 3c-3 0-5 2-5 5 0 4 5 8 5 8s5-4 5-8c0-3-2-5-5-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8" cy="10" r="1.5" fill="currentColor"/>
                  <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
                  <circle cx="12" cy="14" r="1.5" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <div className="text-emerald-400 font-bold text-3xl mb-4">Step 2: Formulate</div>
                <p className="text-slate-300 text-base leading-relaxed mb-4">
                  Powered by NanoTech functional boosters, our AI Modular Skincare System creates your personalized formula — working synergistically to correct all skin concerns and rebuild radiant, healthy skin.
                </p>
                <p className="text-slate-400 text-base italic">
                  AI formulates. You customize. Your skin evolves.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                  <path d="M6.5 10.5L10.5 12M13.5 12L17.5 10.5M10.5 13.5L6.5 17.5M13.5 13.5L17.5 17.5" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <div className="text-purple-400 font-bold text-3xl mb-4">Step 3: Coach</div>
                <p className="text-slate-300 text-base leading-relaxed mb-4">
                  Your AI Skin Coach guides your daily care journey — from how to apply to when to refresh your products.
                </p>
                <p className="text-slate-300 text-base leading-relaxed mb-4">
                  It tracks your progress, learns your skin's rhythm, and adjusts your plan as your needs evolve.
                </p>
                <p className="text-slate-400 text-base italic">
                  Because your skin deserves a coach, not just a cream.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <a href="/quiz" className="group relative overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/25 hover:-translate-y-1 border border-white/10 inline-block">
            <span className="relative z-10 flex items-center justify-center gap-3">
              Take the Free Skin Quiz
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </a>
        </div>
      </div>
    </section>
  )
}