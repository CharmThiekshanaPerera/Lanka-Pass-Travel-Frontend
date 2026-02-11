import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Owner, Jungle Retreat Ella",
    avatar: "SM",
    rating: 5,
    text: "LankaPass transformed our boutique hotel business. We've seen a 300% increase in bookings since joining. The platform is incredibly easy to use.",
    location: "Ella, Sri Lanka",
  },
  {
    name: "Ashan Fernando",
    role: "Safari Tours Guide",
    avatar: "AF",
    rating: 5,
    text: "As a solo tour operator, getting visibility was always a challenge. LankaPass connected me with travelers from around the world. Highly recommended!",
    location: "Yala, Sri Lanka",
  },
  {
    name: "Emma Thompson",
    role: "Cooking Class Host",
    avatar: "ET",
    rating: 5,
    text: "The support team is fantastic. They helped me set up my cooking experience page perfectly. Now I host guests from 20+ countries every month.",
    location: "Galle, Sri Lanka",
  },
  {
    name: "Rajitha Perera",
    role: "Tuk-Tuk Tours",
    avatar: "RP",
    rating: 5,
    text: "What I love most is the secure payment system. I focus on giving great tours, and LankaPass handles everything else seamlessly.",
    location: "Colombo, Sri Lanka",
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src='/assets/testimonial-bg.jpg'
          alt="Sri Lanka experience"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/85 to-foreground/70" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Section Info */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Success Stories
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mt-2 mb-6">
              Trusted by 500+ Vendors Across Sri Lanka
            </h2>
            <p className="text-primary-foreground/70 text-lg leading-relaxed mb-8">
              From boutique hotels in the hill country to surf instructors on the southern coast,
              our vendor community is thriving. Here's what they say about partnering with LankaPass.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-4 rounded-xl bg-card/10 backdrop-blur-sm border border-white/10">
                <div className="font-display text-3xl font-bold text-primary">4.9</div>
                <div className="flex justify-center mt-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
                <div className="text-primary-foreground/60 text-xs">Avg Rating</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card/10 backdrop-blur-sm border border-white/10">
                <div className="font-display text-3xl font-bold text-secondary">98%</div>
                <div className="text-primary-foreground/60 text-xs mt-2">Satisfaction</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card/10 backdrop-blur-sm border border-white/10">
                <div className="font-display text-3xl font-bold text-accent">24hr</div>
                <div className="text-primary-foreground/60 text-xs mt-2">Avg Response</div>
              </div>
            </div>
          </div>

          {/* Right - Testimonial Card */}
          <div className="relative">
            <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-elevated relative overflow-hidden">
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10" />

              {/* Content */}
              <div
                className={`transition-all duration-300 ${isAnimating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
                  }`}
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-foreground text-lg md:text-xl leading-relaxed mb-6">
                  "{testimonials[activeIndex].text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary via-ocean to-secondary flex items-center justify-center border border-white/20 shadow-lg">
                    <span className="text-primary-foreground font-semibold text-lg">
                      {testimonials[activeIndex].avatar}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonials[activeIndex].name}</p>
                    <p className="text-muted-foreground text-sm">{testimonials[activeIndex].role}</p>
                    <p className="text-primary text-sm">{testimonials[activeIndex].location}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsAnimating(true);
                        setTimeout(() => {
                          setActiveIndex(index);
                          setIsAnimating(false);
                        }, 300);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${activeIndex === index ? "w-6 bg-primary" : "bg-muted hover:bg-muted-foreground/50"
                        }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
