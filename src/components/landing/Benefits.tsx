import {
  TrendingUp,
  CreditCard,
  Headphones,
  BarChart3,
  Shield,
  Globe2,
  CheckCircle2
} from "lucide-react";

const benefits = [
  {
    icon: Globe2,
    title: "Global Exposure",
    description: "Reach international travelers actively searching for experiences in Sri Lanka.",
    features: ["Multi-language support", "SEO optimized listings", "Social media promotion"],
  },
  {
    icon: TrendingUp,
    title: "Increase Revenue",
    description: "Our platform drives qualified leads and bookings directly to your business.",
    features: ["Real-time bookings", "Dynamic pricing tools", "Upsell opportunities"],
  },
  {
    icon: BarChart3,
    title: "Insights Dashboard",
    description: "Track performance, manage bookings, and understand customer behavior.",
    features: ["Booking analytics", "Revenue reports", "Customer insights"],
  },
  {
    icon: CreditCard,
    title: "Secure Payouts",
    description: "Receive timely payments through our trusted and transparent payout system.",
    features: ["Weekly payouts", "Multiple currencies", "Transaction history"],
  },
  {
    icon: Shield,
    title: "Verified Platform",
    description: "Build trust with travelers through our verification and review system.",
    features: ["Verified badge", "Review management", "Trust building"],
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Our partner success team is always ready to help you succeed.",
    features: ["24/7 support", "Account manager", "Training resources"],
  },
];

const Benefits = () => {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-primary via-ocean to-secondary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary font-bold text-sm uppercase tracking-widest blur-[0.5px]">
            Why Partner With Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Everything You Need to Grow
          </h2>
          <p className="text-muted-foreground text-lg">
            LankaPass isn't just a listing platform — it's your partner in success.
            We provide the tools, visibility, and support you need to thrive.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group glass-card p-6 hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 border-white/30 hover:border-primary/30"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all border border-white/40 shadow-soft">
                <benefit.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {benefit.description}
              </p>

              {/* Features List */}
              <ul className="space-y-2">
                {benefit.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
