'use client'

export default function Footer() {
  return (
    <footer className="bg-deep-teal text-white py-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Links */}
        <div className="flex justify-center items-center gap-8 mb-8 text-lg">
          <a href="#" className="text-white hover:text-light-aqua transition-colors">About</a>
          <span className="text-light-aqua">•</span>
          <a href="#" className="text-white hover:text-light-aqua transition-colors">Blog</a>
          <span className="text-light-aqua">•</span>
          <a href="#" className="text-white hover:text-light-aqua transition-colors">Privacy</a>
          <span className="text-light-aqua">•</span>
          <a href="#" className="text-white hover:text-light-aqua transition-colors">Terms</a>
          <span className="text-light-aqua">•</span>
          <a href="#" className="text-white hover:text-light-aqua transition-colors">Contact</a>
        </div>
        
        {/* Newsletter Signup */}
        <div className="mb-8">
          <p className="text-light-aqua mb-4 italic">Get AI skincare tips & booster updates</p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-l-lg text-deep-teal focus:outline-none"
              suppressHydrationWarning
            />
            <button className="px-6 py-3 bg-light-aqua text-deep-teal font-bold rounded-r-lg hover:bg-light-aqua/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-light-aqua">
          © 2025 SkinCoach.ai — <em>Not skincare. Skin Intelligence.</em>
        </div>
      </div>
    </footer>
  )
}