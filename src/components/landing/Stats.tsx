import { useEffect, useState, useRef } from "react";
import { Users, MapPin, Star, DollarSign } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 50000,
    suffix: "+",
    label: "Monthly Visitors",
    description: "Travelers discovering experiences",
  },
  {
    icon: MapPin,
    value: 500,
    suffix: "+",
    label: "Active Vendors",
    description: "Partners across Sri Lanka",
  },
  {
    icon: Star,
    value: 98,
    suffix: "%",
    label: "Satisfaction Rate",
    description: "Happy customers & vendors",
  },
  {
    icon: DollarSign,
    value: 2,
    suffix: "M+",
    label: "Payouts Processed",
    description: "Secure transactions yearly",
  },
];

const AnimatedCounter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = target / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <div ref={ref} className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

const Stats = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary to-sunset relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-card blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-card blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-card blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
          <rect fill="url(#grid)" width="100%" height="100%" className="text-primary-foreground" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-card/10 backdrop-blur-sm border border-white/10 hover:bg-card/20 transition-colors group"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-card/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="text-primary-foreground font-semibold mt-2">{stat.label}</p>
              <p className="text-primary-foreground/60 text-sm mt-1">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
