'use client'

export default function FeaturesSection() {
  const features = [
    {
      title: "Smarter Adaptive Care",
      subtitle: "",
      description: "AI analyses your profile, climate and concerns to craft a formula that truly fits you. Your AI Skin Coach learns your skin's rhythm and guiding your journey to transformation.",
      icon: "💡",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Clean & Natural",
      subtitle: "",
      description: "Free from harsh preservatives, alcohol, synthetic colorants, and artificial fragrances — powered by plant-based actives gentle enough for all skin types.",
      icon: "🌿",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Better Value, Simpler Routine",
      subtitle: "",
      description: "Each 2 ml booster delivers the power of a full-size serum. Mix a few together and get multi-serum results in one — saving time, cost, and clutter.",
      icon: "💰",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Better & Faster Results",
      subtitle: "",
      description: "NanoTech delivers ingredients 5× deeper into skin for up to 10× better results, Clinically proven to ensure faster correction and longer-lasting glow.",
      icon: "⚡",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      title: "Trusted Quality",
      subtitle: "",
      description: "Developed to meet FDA standards, backed by evidence based clinical studies from renowned vendors, ensuring purity, safety, and performance.",
      icon: "🤝",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      title: "Complete Care, Head to Toe",
      subtitle: "",
      description: "From cleanser to serum, face to scalp — SkinCoach.ai connects your entire beauty routine into one intelligent ecosystem that grows with you.",
      icon: "🌍",
      gradient: "from-teal-500 to-blue-500"
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-slate-900 font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            💎 Why Choose SkinCoach.ai
          </h2>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-4">
            Because your skin deserves real results — not guesswork.
          </p>
          <p className="text-slate-700 text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
            SkinCoach.ai is the world's first AI-powered personal skincare system that learns your skin, builds your routine, and guides you step-by-step to visible results — faster than ever.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="group relative bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>

                <div className="flex-1">
                  <h3 className="text-slate-900 font-bold text-lg mb-1">
                    {feature.title}
                  </h3>
                  {feature.subtitle && (
                    <p className="text-slate-700 font-semibold text-sm mb-2">
                      {feature.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}