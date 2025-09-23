'use client'

export default function PricingSection() {
  const plans = [
    {
      name: "Essential",
      price: "$39",
      period: "/mo",
      description: "For Gen Z & young adults.",
      features: [
        "Cleanser + Personalized Serum",
        "2 boosters",
        "AI Dermatologist Coaching",
        "Monthly formula adjustments"
      ],
      tagline: "Clear skin, simple steps.",
      buttonText: "Choose Essential",
      gradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-200",
      buttonStyle: "secondary"
    },
    {
      name: "Pro",
      price: "$69",
      period: "/mo",
      description: "For busy adults (25–40).",
      features: [
        "Cleanser + Day Serum + Night Cream",
        "4 boosters",
        "AI Dermatologist Coaching",
        "Priority support"
      ],
      tagline: "Your complete AM/PM smart routine.",
      buttonText: "Choose Pro",
      gradient: "from-emerald-500/20 to-teal-500/20",
      borderColor: "border-emerald-300",
      buttonStyle: "secondary"
    },
    {
      name: "Concierge",
      price: "$99",
      period: "/mo",
      description: "For premium users (40+).",
      features: [
        "Cleanser + Day Serum + Day Cream + Night Cream",
        "10 advanced boosters",
        "AI Dermatologist Coaching",
        "Concierge VIP Support"
      ],
      tagline: "Closest thing to a dermatologist on call.",
      buttonText: "Choose Concierge",
      gradient: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-300",
      buttonStyle: "primary",
      popular: true
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-slate-900 font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Choose Your Skin Journey
          </h2>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Every plan includes personalized AI-powered skincare that evolves with your needs
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-gradient-to-br ${plan.gradient} border-2 ${plan.borderColor} rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${plan.popular ? 'ring-2 ring-emerald-300 shadow-lg' : ''}`}>
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-slate-900 font-bold text-2xl mb-3">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-slate-900 font-bold text-4xl">{plan.price}</span>
                  <span className="text-slate-600 text-lg ml-1">{plan.period}</span>
                </div>
                <p className="text-slate-600 text-sm">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Tagline */}
              <div className="text-slate-900 font-medium mb-8 text-center bg-white/50 rounded-2xl p-4">
                👉 {plan.tagline}
              </div>

              {/* CTA Button */}
              <button className={`w-full font-semibold text-lg px-6 py-4 rounded-2xl transition-all duration-300 ${
                plan.buttonStyle === 'primary'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-1'
                  : 'border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
              }`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-3xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <svg className="w-8 h-8 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-slate-900 font-bold text-xl">30-Day Guarantee</h3>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed">
              <span className="font-semibold">Refine or refund</span> — your skin is always safe. Not seeing results? We'll adjust your formula or give you a full refund.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <button className="group relative overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white font-semibold text-xl px-12 py-5 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/25 hover:-translate-y-1 border border-white/10">
            <span className="relative z-10 flex items-center justify-center gap-3">
              Yes, I Want My AI Skin Coach
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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