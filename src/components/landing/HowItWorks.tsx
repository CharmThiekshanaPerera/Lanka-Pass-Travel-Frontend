import { ClipboardCheck, UserCheck, Rocket, BadgeCheck } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Complete Your Profile",
    description: "Fill in your business details, upload documents, and tell us about your services in our easy step-by-step form.",
    color: "primary",
  },
  {
    icon: UserCheck,
    title: "Submit for Review",
    description: "Our team reviews your application to ensure quality and authenticity. We'll be in touch within 48 hours.",
    color: "secondary",
  },
  {
    icon: BadgeCheck,
    title: "Get Verified",
    description: "Once approved, your profile goes live on LankaPass. Travelers can now discover and book your experiences.",
    color: "accent",
  },
  {
    icon: Rocket,
    title: "Start Growing",
    description: "Manage bookings through your dashboard, receive secure payouts, and watch your business flourish.",
    color: "primary",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 glass-section relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            How Onboarding Works
          </h2>
          <p className="text-muted-foreground text-lg">
            We've made it easy to join our platform. Follow these simple steps and start connecting with travelers in no time.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative glass-card p-6 hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 z-10">
                  {/* Step Number - Floating */}
                  <div className="absolute -top-4 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-sunset flex items-center justify-center font-display font-bold text-primary-foreground shadow-lg group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 ${
                      step.color === "primary"
                        ? "bg-gradient-to-br from-sunset-light to-primary/10 text-primary"
                        : step.color === "secondary"
                        ? "bg-gradient-to-br from-ocean-light to-secondary/10 text-secondary"
                        : "bg-gradient-to-br from-palm-light to-accent/10 text-accent"
                    }`}
                  >
                    <step.icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Hover Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-sunset rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </div>

                {/* Arrow (hidden on last item and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-20 -right-4 w-8 h-8 items-center justify-center z-20">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary animate-pulse" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
