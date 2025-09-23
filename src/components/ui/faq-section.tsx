'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "Are boosters safe to mix?",
      answer: "Yes, our AI calculates compatibility and precise dosages to ensure safe, effective combinations. Each booster is nano-encapsulated for controlled release, preventing interactions while maximizing benefits."
    },
    {
      question: "Do I still need sunscreen?",
      answer: "Yes, always finish your daytime routine with broad-spectrum SPF 30+. Some actives can increase photosensitivity, so sun protection is essential for maintaining your results."
    },
    {
      question: "Is this really personalized?",
      answer: "100%. Your formula is built from your unique skin profile, environment, and lifestyle. As you track progress in the app, our AI continuously refines your formula to evolve with your changing needs."
    },
    {
      question: "Is it pregnancy-safe?",
      answer: "Yes, we offer pregnancy and nursing-safe formulation pathways. Our AI automatically excludes contraindicated ingredients and suggests safe alternatives for expecting and new mothers."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. You can pause, modify, or cancel your subscription anytime through your account dashboard. No long-term commitments or cancellation fees."
    },
    {
      question: "When will I see results?",
      answer: "Most users notice improvements within 2-4 weeks, with significant changes by 8-12 weeks. Results vary based on skin concerns and consistency. Our app tracks your progress to optimize timing."
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-white font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-300 text-lg md:text-xl">
            Everything you need to know about your personalized skincare journey
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300"
            >
              <button
                className="w-full p-6 md:p-8 text-left focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded-3xl"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg md:text-xl font-semibold text-white pr-4 leading-tight">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 md:px-8 pb-6 md:pb-8">
                  <div className="border-t border-white/10 pt-6">
                    <p className="text-slate-300 leading-relaxed md:text-lg">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}