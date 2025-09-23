'use client'

import { useState, useEffect } from 'react'

export default function AuraHeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* Background glow effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-radial from-violet-500/8 via-purple-500/4 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-radial from-emerald-500/6 via-teal-500/3 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-20">
        <div className="md:grid md:grid-cols-2 md:gap-16 md:items-center w-full md:min-h-screen">

          {/* Left Section - Text Content */}
          <div className={`mb-16 md:mb-0 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="space-y-6 md:space-y-10">

              {/* Badge */}
              <div className="inline-flex items-center px-3 md:px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 md:mr-3 animate-pulse"></span>
                <span className="text-slate-300 text-xs md:text-sm font-medium">AI-Powered Skincare Revolution</span>
              </div>

              {/* Headline */}
              <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight">
                End the Guesswork.
                <br />
                Fix the Root Cause.
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Rebuild Your Skin.
                </span>
              </h1>

              {/* Subheadline */}
              <h2 className="text-slate-300 font-medium text-lg sm:text-xl md:text-2xl leading-relaxed">
                The World's First AI-Adaptive, Prescription-Grade Skincare — Built to Evolve With You.
              </h2>

              {/* Supporting Copy */}
              <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
                No more guessing. No more advice that never works. SkinCoach.ai diagnoses your skin and climate reactions, then evolves your formula into a cocktail of nanotech boosters — targeting multiple concerns at once while keeping your routine simple and effective.
              </p>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4">
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

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span className="text-slate-400 font-medium">Prescription-grade</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span className="text-slate-400 font-medium">FDA registered</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Section - Visuals */}
          <div className={`relative transition-all duration-1200 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="relative py-8">

              {/* Main Product Showcase Container - Grouped Image */}
              <div className="relative w-full h-96 md:h-[500px] flex items-center justify-center">

                {/* Serum Bottle with Dropper */}
                <div className="relative z-30 flex flex-col items-center scale-75 md:scale-100">

                  {/* Dropper */}
                  <div className="relative mb-2 flex flex-col items-center">
                    {/* Dropper bulb (rubber squeeze part) - AT TOP */}
                    <div className="w-14 h-18 bg-gradient-to-b from-slate-600 to-slate-800 rounded-full border border-slate-500 relative shadow-lg">
                      {/* Bulb highlight */}
                      <div className="absolute top-2 left-2 w-2 h-6 bg-white/20 rounded-full"></div>
                    </div>

                    {/* Threaded cap/collar - connects bulb to bottle */}
                    <div className="w-24 h-16 bg-gradient-to-b from-slate-700 to-slate-900 border border-slate-600 relative shadow-lg -mt-1">
                      {/* Thread ridges */}
                      <div className="absolute top-2 left-2 right-2 h-0.5 bg-slate-600"></div>
                      <div className="absolute top-5 left-2 right-2 h-0.5 bg-slate-600"></div>
                      <div className="absolute top-8 left-2 right-2 h-0.5 bg-slate-600"></div>
                      <div className="absolute top-11 left-2 right-2 h-0.5 bg-slate-600"></div>
                      <div className="absolute top-14 left-2 right-2 h-0.5 bg-slate-600"></div>
                      {/* Cap highlight */}
                      <div className="absolute top-1 left-1 w-1 h-14 bg-white/10 rounded-full"></div>

                      {/* Nanotech booster text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-white/90 text-xs font-bold">NANOTECH</span>
                        <span className="text-white/90 text-xs font-bold">BOOSTERS</span>
                      </div>
                    </div>

                    {/* Glass pipette tube - goes through cap into bottle */}
                    <div className="w-3 h-32 bg-gradient-to-b from-white/40 to-white/20 backdrop-blur-sm border border-white/50 relative">
                      {/* Serum in pipette */}
                      <div className="absolute bottom-0 w-full h-6 bg-gradient-to-t from-cyan-400/80 to-blue-400/60"></div>
                      {/* Glass highlight */}
                      <div className="absolute top-0 left-0 w-0.5 h-full bg-white/40"></div>

                      {/* Benefits text next to tube */}
                      <div className="absolute left-6 top-0 flex flex-col justify-between h-32 text-xs text-white/90 font-medium">
                        <div>Whitening</div>
                        <div>Lifting</div>
                        <div>Repairing</div>
                        <div>Anti-Acne</div>
                        <div>Hydrating</div>
                      </div>
                    </div>
                  </div>

                  {/* Serum Bottle - unified shape */}
                  <div className="relative flex flex-col items-center">

                    {/* Bottle neck */}
                    <div className="w-16 h-16 bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-t-lg shadow-xl"></div>

                    {/* Bottle body */}
                    <div className="relative w-40 h-60 bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-b-3xl shadow-2xl -mt-1">

                      {/* Top highlight line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

                      {/* Floating serum particles */}
                      <div className="absolute top-4 left-4 w-1 h-1 bg-cyan-300/60 rounded-full animate-pulse"></div>
                      {/* Another floating particle */}
                      <div className="absolute top-8 left-8 w-0.5 h-0.5 bg-emerald-300/60 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>

                      {/* AI-Powered Label */}
                      <div className="absolute top-16 left-2 right-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                        <div className="text-white/90 text-xs font-bold text-center mb-2">AI-POWERED</div>
                        <div className="text-white/70 text-xs text-center leading-relaxed">
                          Adapts to your skin's unique needs and environment
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Floating App Interface */}
                <div className="absolute right-4 top-8 z-20 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 w-40 md:w-48 h-60 md:h-72 rounded-2xl shadow-xl p-3 md:p-4 backdrop-blur-sm scale-75 md:scale-90">

                  {/* App Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-slate-400 text-xs">SkinCoach AI</div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="space-y-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-2">
                      <div className="text-white text-xs font-semibold">Today's Analysis</div>
                      <div className="text-blue-100 text-xs mt-1">Skin clarity +15%</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Hydration</span>
                        <span className="text-emerald-400">92%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1">
                        <div className="bg-gradient-to-r from-emerald-400 to-blue-400 h-1 rounded-full" style={{width: '92%'}}></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Firmness</span>
                        <span className="text-cyan-400">85%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1">
                        <div className="bg-gradient-to-r from-cyan-400 to-blue-400 h-1 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Even tone</span>
                        <span className="text-purple-400">78%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1">
                        <div className="bg-gradient-to-r from-purple-400 to-blue-400 h-1 rounded-full" style={{width: '78%'}}></div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Floating Feature Cards */}
                <div className="absolute left-4 top-8 max-w-xs z-20">

                  {/* AI Analysis Card */}
                  <div className={`bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-400/30 rounded-2xl px-3 py-2 mb-4 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white text-xs font-semibold">AI Analysis</div>
                        <div className="text-blue-200 text-xs">Real-time insights</div>
                      </div>
                    </div>
                  </div>

                  {/* Formula Card */}
                  <div className={`bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-emerald-400/30 rounded-2xl px-3 py-2 mb-4 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white text-xs font-semibold">Custom Formula</div>
                        <div className="text-emerald-200 text-xs">Nano-tech delivery</div>
                      </div>
                    </div>
                  </div>

                  {/* Results Card */}
                  <div className={`bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-400/30 rounded-2xl px-3 py-2 transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white text-xs font-semibold">Track Results</div>
                        <div className="text-purple-200 text-xs">Visible improvements</div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  )
}