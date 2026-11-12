import { ArrowRight, Sparkles, Navigation, MessageSquareWarning } from "lucide-react";

export default function FinalCTA({ onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="sr-final-cta-section" aria-labelledby="final-cta-heading">
      <div className="sr-final-cta-container">
        <div className="sr-final-cta-card">
          {/* Subtle Ambient Decorative Glows */}
          <div className="cta-ambient-glow" aria-hidden="true" />

          <div className="cta-badge-pill">
            <Sparkles size={13} color="#FFD6A5" />
            <span>ACCESSIBLE TO EVERY COMMUTER</span>
          </div>

          <h2 id="final-cta-heading" className="cta-headline">
            Make your next journey a{" "}
            <span className="cta-highlight">more informed one.</span>
          </h2>

          <p className="cta-subtext">
            Explore routes, understand available safety information, and contribute observations to a safer community across Delhi NCR—no account required.
          </p>

          <div className="cta-buttons-cluster">
            <button
              type="button"
              onClick={() => onNavigate("planner")}
              className="cta-btn-primary"
            >
              <Navigation size={15} />
              <span>Plan Your Journey</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => onNavigate("reports")}
              className="cta-btn-secondary"
            >
              <MessageSquareWarning size={15} />
              <span>Report a Safety Concern</span>
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              className="cta-btn-tertiary"
            >
              <span>Back to Top</span>
            </button>
          </div>

          <p className="cta-fineprint">
            Free public-interest initiative • No account or contact details required • Open civic technology
          </p>
        </div>
      </div>
    </section>
  );
}
