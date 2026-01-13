import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary to-sunset relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-card/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-card/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-card/5 blur-2xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-card/5 blur-2xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Sparkle Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-card/20 animate-pulse"
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
          <div className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-primary-foreground/90 text-sm font-medium">
              Join 500+ successful vendors
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Tourism Business?
          </h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl mb-10 leading-relaxed">
            Take the first step towards reaching thousands of travelers. 
            Our onboarding process takes just 15 minutes, and our team is here to help you every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/onboarding">
              <Button 
                size="xl" 
                className="w-full sm:w-auto bg-card text-foreground hover:bg-card/90 font-semibold group shadow-elevated"
              >
                Start Onboarding Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#faq">
              <Button 
                size="xl" 
                variant="heroOutline"
                className="w-full sm:w-auto"
              >
                Have Questions?
              </Button>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <span className="flex items-center gap-2 text-primary-foreground/80">
              <CheckCircle className="w-5 h-5 text-accent" />
              No upfront fees
            </span>
            <span className="flex items-center gap-2 text-primary-foreground/80">
              <CheckCircle className="w-5 h-5 text-accent" />
              Quick approval (48hrs)
            </span>
            <span className="flex items-center gap-2 text-primary-foreground/80">
              <CheckCircle className="w-5 h-5 text-accent" />
              Dedicated support
            </span>
            <span className="flex items-center gap-2 text-primary-foreground/80">
              <CheckCircle className="w-5 h-5 text-accent" />
              Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
