import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Globe, Shield, Wallet, ChevronLeft, ChevronRight, Play } from "lucide-react";


const slides = [
  {
    image: '/assets/hero-slide-1.jpg',
    title: "Partner with Sri Lanka's Premier Travel Platform",
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleNextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 500);
  };

  const handlePrevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 500);
  };

  const goToSlide = (index: number) => {
    if (index !== currentSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 500);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Slideshow */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 z-0 transition-all duration-1000 ease-in-out ${
            currentSlide === index
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
        </div>
      ))}

      {/* Animated Particles */}
      <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Slide Navigation Arrows */}
      <button
        onClick={handlePrevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-primary-foreground hover:bg-card/40 transition-all group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </button>
      <button
        onClick={handleNextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-primary-foreground hover:bg-card/40 transition-all group"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in border border-white/10">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-primary-foreground/90 text-sm font-medium">
              Now accepting vendor applications
            </span>
          </div>

          {/* Main Headline - Animated */}
          <h1
            className={`font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight transition-all duration-500 ${
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            {slides[currentSlide].title}
          </h1>

          {/* Subheadline - Animated */}
          <p
            className={`text-xl md:text-2xl text-primary-foreground/80 mb-8 leading-relaxed transition-all duration-500 delay-100 ${
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            {slides[currentSlide].subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/onboarding">
              <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                Start Onboarding
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto group">
                <Play className="w-4 h-4 mr-2" />
                Watch How It Works
              </Button>
            </a>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2 bg-card/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 hover:bg-card/30 transition-colors cursor-default">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-primary-foreground/90 text-sm">Reach More Travelers</span>
            </div>
            <div className="flex items-center gap-2 bg-card/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 hover:bg-card/30 transition-colors cursor-default">
              <Globe className="w-4 h-4 text-secondary" />
              <span className="text-primary-foreground/90 text-sm">Global Visibility</span>
            </div>
            <div className="flex items-center gap-2 bg-card/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 hover:bg-card/30 transition-colors cursor-default">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-primary-foreground/90 text-sm">Verified Platform</span>
            </div>
            <div className="flex items-center gap-2 bg-card/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 hover:bg-card/30 transition-colors cursor-default">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-primary-foreground/90 text-sm">Secure Payouts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              currentSlide === index
                ? "w-10 h-3 bg-primary rounded-full"
                : "w-3 h-3 bg-white/40 rounded-full hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 50L48 45.8C96 41.7 192 33.3 288 29.2C384 25 480 25 576 33.3C672 41.7 768 58.3 864 62.5C960 66.7 1056 58.3 1152 50C1248 41.7 1344 33.3 1392 29.2L1440 25V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
