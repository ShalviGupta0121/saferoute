import "./landing.css";
import HeroSection from "./HeroSection";
import PurposeSection from "./PurposeSection";
import HowItWorks from "./HowItWorks";
import FeaturesSection from "./FeaturesSection";
import PreviewsSection from "./PreviewsSection";
import TrustAndPrivacy from "./TrustAndPrivacy";
import FinalCTA from "./FinalCTA";

export default function Landing({ onNavigate, onPrefillRoute }) {
  return (
    <div className="sr-landing-master-root">
      {/* 1. Hero Section (Split layout with editorial headline + Delhi map simulation) */}
      <HeroSection onNavigate={onNavigate} onPrefillRoute={onPrefillRoute} />

      {/* 2. Purpose & Civic Mission (Concise, empathetic, non-fearmongering) */}
      <PurposeSection />

      {/* 3. How SafeRoute Works (3-step visual sequence with connecting motif) */}
      <HowItWorks onNavigate={onNavigate} />

      {/* 4. Core Features Overview (5 distinct capability cards linking to destinations) */}
      <FeaturesSection onNavigate={onNavigate} />

      {/* 5. Previews of Community & Safety Insights Destinations */}
      <PreviewsSection onNavigate={onNavigate} />

      {/* 6. Trust & Privacy Summary (Supported by real database RLS & code) */}
      <TrustAndPrivacy />

      {/* 7. Final Call to Action ("Make your next journey a more informed one") */}
      <FinalCTA onNavigate={onNavigate} />
    </div>
  );
}
