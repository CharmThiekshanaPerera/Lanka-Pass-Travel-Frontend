import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Globe, Shield, Wallet, ChevronLeft, ChevronRight, Play } from "lucide-react";

const slides = [
  {
    image: '/assets/hero-slide-1.jpg',
    title: "Partner with Lanka Travel Pass",
    subtitle: "Join LankaPass and connect with thousands of travelers seeking authentic experiences.",
  },
  {
    image: '/assets/hero-slide-2.jpg',
    title: "Showcase Your Paradise",
    subtitle: "From pristine beaches to luxury resorts, let travelers discover your unique offerings.",
  },
  {
    image: '/assets/hero-slide-3.jpg',
    title: "Grow Your Tourism Business",
    subtitle: "Streamline bookings, reach global audiences, and enjoy secure payouts.",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevSlide(currentSlide);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    if (index !== currentSlide) {
      setPrevSlide(currentSlide);
      setCurrentSlide(index);
    }
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Background Slideshow Layer - Stacking logic for perfect smoothness */}
      {slides.map((slide, index) => {
        const isCurrent = currentSlide === index;
        const isPrevious = prevSlide === index;

        return (
          <div
            key={`bg-${index}`}
            style={{
              willChange: "opacity",
              transitionDuration: "7000ms",
              transitionTimingFunction: "ease-in-out",
            }}
            className={`absolute inset-0 transition-opacity ${isCurrent ? "opacity-100 z-20 visible" :
              isPrevious ? "opacity-100 z-10 visible" :
                "opacity-0 z-0 invisible"
              }`}
          >
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover brightness-[0.6]"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/20 to-background" />
          </div>
        );
      })}

      {/* Simplified Decorative Elements */}
      <div className="absolute inset-0 z-25 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-ocean/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-sunset/5 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-30">
        <div className="max-w-4xl mx-auto text-center relative h-[420px] md:h-[500px]">
          {/* Hero Content Layer - Stacked cross-fade with hardware acceleration */}
          {slides.map((slide, index) => {
            const isCurrent = currentSlide === index;
            const isPrevious = prevSlide === index;

            return (
              <div
                key={`content-${index}`}
                style={{
                  willChange: "opacity, transform",
                  transitionDuration: "7000ms",
                  transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
                }}
                className={`absolute inset-0 flex flex-col items-center transition-all ${isCurrent
                  ? "opacity-100 translate-y-0 scale-100 z-20 visible"
                  : isPrevious
                    ? "opacity-0 -translate-y-4 scale-105 z-10 visible pointer-events-none"
                    : "opacity-0 translate-y-4 scale-95 z-0 invisible pointer-events-none"
                  }`}
              >
                {/* Enhanced Visibility Badge */}
                <div className="inline-flex items-center gap-2 mb-8">
                  <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 flex items-center gap-3 shadow-lg">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                    </span>
                    <span className="text-white text-sm font-bold tracking-wider uppercase">
                      Accepting Vendor Applications
                    </span>
                  </div>
                </div>

                {/* Unified Primary Headline */}
                <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1] drop-shadow-2xl">
                  {slide.title}
                </h1>

                {/* High-Visibility Subheadline */}
                <p className="text-xl md:text-2xl text-white font-medium mb-12 leading-relaxed max-w-2xl mx-auto drop-shadow-lg">
                  {slide.subtitle}
                </p>

                {/* CTA Block */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/onboarding" className="w-full sm:w-auto">
                    <button
                      className="w-full group relative px-10 py-5 rounded-2xl bg-primary text-white font-bold text-lg transition-all hover:shadow-glow hover:scale-[1.02] active:scale-95 shadow-xl"
                    >
                      Start Your Global Journey
                    </button>
                  </Link>

                  <a href="#how-it-works" className="w-full sm:w-auto">
                    <button className="w-full group px-8 py-5 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/40 text-white font-bold text-lg hover:bg-white/30 transition-all flex items-center justify-center gap-3 shadow-xl">
                      <Play className="w-5 h-5 fill-white" />
                      See the Platform
                    </button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* High-Contrast Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-4 md:gap-8 relative z-40">
          <div className="flex items-center gap-3 text-foreground font-bold bg-white/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-primary/20 shadow-xl hover:bg-white/90 hover:border-primary/40 transition-all cursor-default group">
            <Globe className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">Global Reach</span>
          </div>
          <div className="flex items-center gap-3 text-foreground font-bold bg-white/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-primary/20 shadow-xl hover:bg-white/90 hover:border-primary/40 transition-all cursor-default group">
            <Shield className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">Secured Payouts</span>
          </div>
          <div className="flex items-center gap-3 text-foreground font-bold bg-white/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-primary/20 shadow-xl hover:bg-white/90 hover:border-primary/40 transition-all cursor-default group">
            <Users className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">Verified Network</span>
          </div>
        </div>
      </div>

      {/* Simplified Slide Indicators */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 rounded-full ${currentSlide === index
              ? "h-16 w-1.5 bg-secondary"
              : "h-3 w-1.5 bg-white/40 hover:bg-white/60"
              }`}
          />
        ))}
      </div>

      {/* Clean Bottom Transition */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
