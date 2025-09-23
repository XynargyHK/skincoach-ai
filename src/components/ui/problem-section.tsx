'use client'

export default function ProblemSection() {
  return (
    <section className="skincoach-section bg-gray-50">
      <div className="text-center">
        <h2 className="skincoach-h2 mb-12 text-center">
          Overwhelmed and confused by busy routines and conflicting advice that never works?
        </h2>
        
        <div className="skincoach-body mb-8 max-w-4xl mx-auto">
          Your skin changes with <strong>seasons, hormones, stress, and age.</strong><br />
          Wrong routines, wrong timing, wrong ingredients = damage, not healing.
        </div>
        
        <div className="skincoach-body mb-12 text-deep-teal font-medium">
          👉 Targeting symptoms without fixing the root cause (like barrier damage) only makes things worse.
        </div>
        
        <div className="skincoach-blockquote mb-12 max-w-4xl mx-auto">
          "Your next skin damage might be irreversible."
        </div>
        
        <button className="skincoach-btn-coral">
          Yes, Save My Skin Now →
        </button>
      </div>
    </section>
  )
}