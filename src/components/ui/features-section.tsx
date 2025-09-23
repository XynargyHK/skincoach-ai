'use client'

export default function FeaturesSection() {
  const features = [
    {
      title: "AI-Adaptive",
      description: "Learns from your skin root causes, climate, and lifestyle.",
      icon: "🧠",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Prescription-Grade",
      description: "Premium, evidence-based actives from renowned vendors.",
      icon: "⚗️",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      title: "Multi-Active Cocktail",
      description: "One formula solves many concerns at once.",
      icon: "🧪",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Nano-Delivery",
      description: "Penetrates 5× deeper, lasts 6× longer.",
      icon: "🎯",
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "Clean & Safe",
      description: "No alcohol, no colorants, no harsh preservatives.",
      icon: "🌿",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Value & Trust",
      description: "One bottle replaces 5–7. Dermatologist-tested, FDA registered, cruelty-free.",
      icon: "⭐",
      gradient: "from-yellow-500 to-orange-500"
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-slate-900 font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Why Choose SkinCoach.ai
          </h2>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Six pillars of innovation that set us apart from traditional skincare
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-start gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                <span className="text-lg">{feature.icon}</span>
              </div>

              <div className="flex-1">
                <h3 className="text-slate-900 font-bold text-lg mb-2">
                  {feature.title}
                </h3>

                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}