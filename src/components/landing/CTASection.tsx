import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-primary via-ocean to-secondary relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-white/5 blur-2xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-white/5 blur-2xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Sparkle Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-white/20 animate-pulse"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.5}s`,
              width: `${20 + Math.random() * 20}px`,
              height: `${20 + Math.random() * 20}px`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-8 border border-white/20 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-white text-sm font-bold tracking-wide uppercase">
              Join 500+ successful vendors
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-[1.1] drop-shadow-xl">
            Ready to Transform Your Tourism Business?
          </h2>
          <p className="text-white font-medium text-lg md:text-xl mb-12 leading-relaxed opacity-90">
            Take the first step towards reaching thousands of travelers.
            Our onboarding process takes just 15 minutes, and our team is here to help you every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16 px-4">
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button
                size="xl"
                className="w-full bg-white text-primary hover:bg-white/90 font-bold h-16 px-10 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 text-lg"
              >
                Start Onboarding Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#faq" className="w-full sm:w-auto">
              <Button
                size="xl"
                variant="heroOutline"
                className="w-full h-16 px-10 rounded-2xl border-white/40 text-white font-bold hover:bg-white/10 text-lg"
              >
                Have Questions?
              </Button>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {[
              "No upfront fees",
              "Quick approval (48hrs)",
              "Dedicated support",
              "Cancel anytime"
            ].map((text) => (
              <span key={text} className="flex items-center gap-3 text-white font-bold bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <span className="text-sm tracking-wide">{text}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
