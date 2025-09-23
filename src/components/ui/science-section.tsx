'use client'

export default function ScienceSection() {
  return (
    <section className="skincoach-section bg-white">
      <div className="text-center">
        <h2 className="skincoach-h2 mb-16 text-center">
          Science That Protects Your Skin
        </h2>
        
        <div className="max-w-4xl mx-auto space-y-8 mb-16">
          <div className="flex items-start gap-6 text-left p-6 bg-gradient-to-r from-deep-teal/5 to-light-aqua/5 rounded-xl">
            <div className="w-3 h-3 bg-coral rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h3 className="font-bold text-deep-teal text-xl mb-2">Big Data Selection</h3>
              <p className="skincoach-body">Ingredients chosen from millions of data points.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-6 text-left p-6 bg-gradient-to-r from-deep-teal/5 to-light-aqua/5 rounded-xl">
            <div className="w-3 h-3 bg-coral rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h3 className="font-bold text-deep-teal text-xl mb-2">Clinically Proven</h3>
              <p className="skincoach-body">Every booster validated with in-vivo & in-vitro studies.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-6 text-left p-6 bg-gradient-to-r from-deep-teal/5 to-light-aqua/5 rounded-xl">
            <div className="w-3 h-3 bg-coral rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h3 className="font-bold text-deep-teal text-xl mb-2">Nano Encapsulation</h3>
              <p className="skincoach-body">Delivers actives into the right skin layer.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-6 text-left p-6 bg-gradient-to-r from-deep-teal/5 to-light-aqua/5 rounded-xl">
            <div className="w-3 h-3 bg-coral rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h3 className="font-bold text-deep-teal text-xl mb-2">Smart Release</h3>
              <p className="skincoach-body">Dispersion based on your skin's pH & temperature.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-6 text-left p-6 bg-gradient-to-r from-deep-teal/5 to-light-aqua/5 rounded-xl">
            <div className="w-3 h-3 bg-coral rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h3 className="font-bold text-deep-teal text-xl mb-2">Prescription-Grade Quality</h3>
              <p className="skincoach-body">Every formula designed with clinical rigor.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-6 text-left p-6 bg-gradient-to-r from-deep-teal/5 to-light-aqua/5 rounded-xl">
            <div className="w-3 h-3 bg-coral rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h3 className="font-bold text-deep-teal text-xl mb-2">FDA Registered</h3>
              <p className="skincoach-body">Safe, tested, traceable.</p>
            </div>
          </div>
        </div>
        
        <button className="skincoach-btn-primary">
          Try the Onboarding Set Today — First 500 Only
        </button>
      </div>
    </section>
  )
}