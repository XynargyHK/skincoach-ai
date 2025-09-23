'use client'

export default function TrustBadgesSection() {
  const badges = [
    {
      icon: "🏆",
      title: "Prescription-Grade Formulations",
      description: "Clinical-strength actives from top suppliers"
    },
    {
      icon: "✅",
      title: "FDA Registered",
      description: "Manufactured under FDA Standard"
    },
    {
      icon: "👩‍⚕️",
      title: "Dermatologist-Tested",
      description: "Clinically validated for safety and efficacy"
    },
    {
      icon: "🐰",
      title: "Cruelty-Free & Vegan",
      description: "Never tested on animals, plant-based ingredients"
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-slate-900 font-bold text-3xl md:text-4xl mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-slate-600 text-lg">
            Science-backed skincare you can count on
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div key={index} className="group text-center p-6 bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {badge.icon}
              </div>
              <h3 className="text-slate-900 font-semibold text-sm mb-2 leading-tight">
                {badge.title}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}