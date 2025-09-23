'use client'

export default function SolutionSection() {
  return (
    <section className="skincoach-section bg-white">
      <div className="text-center">
        <h2 className="skincoach-h2 mb-12 text-center">
          SkinCoach.ai is your final right decision.
        </h2>
        
        <div className="skincoach-body mb-16 max-w-3xl mx-auto">
          <ul className="space-y-4">
            <li className="flex items-center justify-center gap-3">
              <span className="text-light-aqua text-xl">•</span>
              No more trial and error.
            </li>
            <li className="flex items-center justify-center gap-3">
              <span className="text-light-aqua text-xl">•</span>
              No more guessing.
            </li>
            <li className="flex items-center justify-center gap-3">
              <span className="text-light-aqua text-xl">•</span>
              No more wasted money.
            </li>
            <li className="flex items-center justify-center gap-3">
              <span className="text-light-aqua text-xl">•</span>
              No more damage that could have been prevented.
            </li>
          </ul>
        </div>
        
        <h3 className="skincoach-h3 mb-12 text-center">
          Our 3-Step Solution
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-gradient-to-b from-teal-50 to-white rounded-2xl">
            <div className="w-20 h-20 mx-auto mb-6 bg-deep-teal rounded-full flex items-center justify-center text-white text-2xl font-bold">
              1
            </div>
            <h4 className="font-bold text-deep-teal mb-4">Detect the Root Cause</h4>
            <p className="skincoach-body text-sm">
              AI finds what's really driving acne, dryness, wrinkles, or sensitivity.
            </p>
          </div>
          
          <div className="text-center p-8 bg-gradient-to-b from-light-aqua/20 to-white rounded-2xl">
            <div className="w-20 h-20 mx-auto mb-6 bg-light-aqua rounded-full flex items-center justify-center text-deep-teal text-2xl font-bold">
              2
            </div>
            <h4 className="font-bold text-deep-teal mb-4">Fit Your Starter Routine</h4>
            <p className="skincoach-body text-sm">
              Personalized AM/PM set with 50ml foundations + 2ml boosters.
            </p>
          </div>
          
          <div className="text-center p-8 bg-gradient-to-b from-coral/20 to-white rounded-2xl">
            <div className="w-20 h-20 mx-auto mb-6 bg-coral rounded-full flex items-center justify-center text-white text-2xl font-bold">
              3
            </div>
            <h4 className="font-bold text-deep-teal mb-4">Evolve & Optimize</h4>
            <p className="skincoach-body text-sm">
              Routine adapts with your skin, climate, and lifestyle.
            </p>
          </div>
        </div>
        
        <button className="skincoach-btn-primary">
          Embark on Your Journey of Skin Intelligence →
        </button>
      </div>
    </section>
  )
}