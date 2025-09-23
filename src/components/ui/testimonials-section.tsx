'use client'

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Margaret",
      age: 47,
      location: "Los Angeles",
      quote: "After menopause, my skin became so dry and dull. The Concierge plan brought back the glow I thought I'd lost forever.",
      initial: "M"
    },
    {
      name: "James",
      age: 24,
      location: "New York",
      quote: "Finally found something that cleared my stubborn acne without breaking the bank. The Pro plan is perfect!",
      initial: "J"
    },
    {
      name: "Sarah",
      age: 32,
      location: "London",
      quote: "As a busy mom, I needed something simple but effective. The AI coaching helps me stay consistent.",
      initial: "S"
    },
    {
      name: "Jennifer",
      age: 49,
      location: "Miami",
      quote: "I was skeptical about AI skincare at my age, but the results speak for themselves. My skin looks 10 years younger.",
      initial: "J"
    },
    {
      name: "Rachel",
      age: 27,
      location: "Toronto",
      quote: "The personalized approach actually works. My combination skin has never looked better.",
      initial: "R"
    },
    {
      name: "Michael",
      age: 56,
      location: "Sydney",
      quote: "After years of neglecting my skin, the personalized approach helped me address decades of damage.",
      initial: "M"
    },
    {
      name: "Susan",
      age: 41,
      location: "Singapore",
      quote: "The AI coaching understood my skin better than any dermatologist I've seen. Truly revolutionary.",
      initial: "S"
    },
    {
      name: "Anna",
      age: 35,
      location: "Berlin",
      quote: "Working in my 30s is stressful, but my skin routine isn't anymore. The AI adapts as my life changes.",
      initial: "A"
    },
    {
      name: "Diana",
      age: 48,
      location: "Chicago",
      quote: "The Concierge service feels like having a personal dermatologist. The investment in my skin was worth it.",
      initial: "D"
    },
    {
      name: "Helen",
      age: 51,
      location: "San Francisco",
      quote: "I wish I'd found this years ago. Finally, skincare that understands aging skin and hormonal changes.",
      initial: "H"
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-slate-900 font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Real People. Real Results.
          </h2>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Thousands of people have transformed their skin with SkinCoach.ai. Here's what they have to say.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-6 hover:bg-white/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              {/* User Info */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {testimonial.initial}
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-slate-900 text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-slate-500">{testimonial.age}, {testimonial.location}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-xs text-slate-500 font-medium">5.0</span>
              </div>

              {/* Quote */}
              <p className="text-sm text-slate-700 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* Verified Badge */}
              <div className="mt-4 flex items-center text-xs text-slate-500">
                <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified Customer
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-600 text-lg mb-6">
            Join thousands of others who have found their perfect skincare routine
          </p>
          <button className="group relative overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/25 hover:-translate-y-1 border border-white/10">
            <span className="relative z-10 flex items-center justify-center gap-3">
              Start Your Skin Journey
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