'use client'

export default function HeroSection() {
  return (
    <section className="skincoach-section bg-white min-h-screen flex items-center">
      <div className="w-full grid lg:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <div className="text-center lg:text-left">
          <h1 className="skincoach-h1 mb-8">
            What if your skincare could think?
          </h1>
          
          <div className="text-2xl text-center mb-8 text-gray-700 leading-relaxed">
            You've tried 7-step routines, trendy serums, endless creams… and yet your skin still struggles. 
            Breakouts, blackheads, scars, sensitivity, undereye bags, dryness, fine lines — the damage never ends.
          </div>
          
          <div className="skincoach-body text-center mb-8">
            🧠 <em>SkinCoach.ai is your personal AI dermatologist.</em><br />
            It learns your skin, evolves your formulas, and simplifies your routine to just what works.
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button className="skincoach-btn-primary">
              Take Your Free AI Skin Diagnosis
            </button>
            <button className="skincoach-btn-secondary">
              See How It Works
            </button>
          </div>
          
          <p className="text-sm text-coral font-medium text-center">
            *First 500 Onboarding Sets Only*
          </p>
        </div>

        {/* Split Screen Visual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Before/After Skin Photo */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center">
            <div className="w-40 h-40 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full mb-4 flex items-center justify-center">
              <span className="text-4xl">📸</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Before & After</h3>
            <p className="text-sm text-gray-600 text-center">See real skin transformation results</p>
          </div>
          
          {/* AI Chat + Product Mockup */}
          <div className="bg-gradient-to-br from-deep-teal to-light-aqua rounded-2xl p-8 flex flex-col items-center justify-center text-white">
            <div className="w-40 h-40 bg-white/20 rounded-xl mb-4 flex flex-col items-center justify-center">
              <span className="text-3xl mb-2">🤖</span>
              <div className="text-xs bg-white/30 px-3 py-1 rounded-full">AI Analyzing...</div>
            </div>
            <h3 className="font-semibold mb-2">AI Chat + Products</h3>
            <p className="text-sm text-center opacity-90">Personalized recommendations</p>
          </div>
        </div>
      </div>
    </section>
  )
}