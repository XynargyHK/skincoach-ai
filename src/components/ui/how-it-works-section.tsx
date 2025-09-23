'use client'

export default function HowItWorksSection() {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-white font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            How SkinCoach.ai Works
          </h2>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
            Skincare fails when it's off the shelf—built for everyone but you. SkinCoach.ai adapts to your skin, climate, and lifestyle, evolving like a prescription that changes with your needs.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mb-16">
          {/* Step 1 */}
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl mb-3">Diagnose the Root Cause</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Take a quick 3-minute onboarding quiz. Our AI reads your skin concerns, routines, sensitivities, and environment to uncover what's really driving breakouts, redness, dryness, or lines.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl mb-3">Build Your Multi-Active Formula</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Your base serum/cream restores the fundamentals (barrier, hydration, sensitivity, repair). Then we add functional boosters — anti-acne, anti-wrinkle, lifting, hydratiing, brightening and more — into one prescription-grade cocktail, nano-encapsulated for safe, precise results.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl mb-3">Review & Evolve</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  As you use your routine, simply review your results inside the app. Based on your feedback and progress, our AI suggests formula updates and booster adjustments — so your prescription evolves with you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button className="group relative overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/25 hover:-translate-y-1 border border-white/10">
            <span className="relative z-10 flex items-center justify-center gap-3">
              Take the Free Skin Quiz
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>
      </div>
    </section>
  )
}