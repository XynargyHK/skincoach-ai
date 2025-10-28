import Header from "@/components/ui/header";
import AuraHeroSection from "@/components/ui/aura-hero-section";
import HowItWorksSection from "@/components/ui/how-it-works-section";
import FeaturesSection from "@/components/ui/features-section";
import TestimonialsSection from "@/components/ui/testimonials-section";
import PricingSection from "@/components/ui/pricing-section";
import TrustBadgesSection from "@/components/ui/trust-badges-section";
import FAQSection from "@/components/ui/faq-section";
import FinalCTASection from "@/components/ui/final-cta-section";
import Footer from "@/components/ui/footer";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://skincoach.ai/#organization",
        "name": "SkinCoach.ai",
        "url": "https://skincoach.ai",
        "logo": {
          "@type": "ImageObject",
          "url": "https://skincoach.ai/logo.png",
          "width": 300,
          "height": 100
        },
        "description": "AI-powered personalized skincare with prescription-grade formulas",
        "sameAs": [
          "https://twitter.com/skincoach_ai",
          "https://instagram.com/skincoach.ai",
          "https://facebook.com/skincoach.ai"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://skincoach.ai/#website",
        "url": "https://skincoach.ai",
        "name": "SkinCoach.ai",
        "description": "Revolutionary AI skincare that adapts to your skin, climate, and lifestyle",
        "publisher": {
          "@id": "https://skincoach.ai/#organization"
        }
      },
      {
        "@type": "Product",
        "name": "SkinCoach.ai Essential Plan",
        "description": "Personalized AI skincare for Gen Z & young adults",
        "brand": {
          "@type": "Brand",
          "name": "SkinCoach.ai"
        },
        "offers": {
          "@type": "Offer",
          "price": "39",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2025-12-31"
        }
      },
      {
        "@type": "Product",
        "name": "SkinCoach.ai Pro Plan",
        "description": "Complete AM/PM smart routine for busy adults",
        "brand": {
          "@type": "Brand",
          "name": "SkinCoach.ai"
        },
        "offers": {
          "@type": "Offer",
          "price": "69",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2025-12-31"
        }
      },
      {
        "@type": "Product",
        "name": "SkinCoach.ai Concierge Plan",
        "description": "Premium skincare with VIP support for 40+ users",
        "brand": {
          "@type": "Brand",
          "name": "SkinCoach.ai"
        },
        "offers": {
          "@type": "Offer",
          "price": "99",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2025-12-31"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <>
        <Header />
        <main>
          <AuraHeroSection />
          <section id="how-it-works">
            <HowItWorksSection />
          </section>
          <section id="features">
            <FeaturesSection />
          </section>
          <section id="testimonials">
            <TestimonialsSection />
          </section>
          <section id="pricing">
            <PricingSection />
          </section>
          <TrustBadgesSection />
          <section id="faq">
            <FAQSection />
          </section>
          <FinalCTASection />
          <Footer />
        </main>
      </>
    </>
  );
}
