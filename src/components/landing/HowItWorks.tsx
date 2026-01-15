import { 
  ClipboardCheck, 
  UserCheck, 
  Rocket, 
  BadgeCheck, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Clock, 
  Users, 
  TrendingUp 
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

const STEPS = [
  {
    id: 1,
    icon: ClipboardCheck,
    title: "Complete Your Profile",
    description: "Fill in your business details, upload documents, and tell us about your services in our easy step-by-step form.",
    color: "primary",
    duration: "5-10 minutes",
    highlight: "Easy Setup",
    gradient: "from-blue-500 to-cyan-400",
    features: ["Simple form", "Document upload", "Service details"]
  },
  {
    id: 2,
    icon: UserCheck,
    title: "Submit for Review",
    description: "Our team reviews your application to ensure quality and authenticity. We'll be in touch within 48 hours.",
    color: "secondary",
    duration: "24-48 hours",
    highlight: "Expert Review",
    gradient: "from-purple-500 to-pink-400",
    features: ["Quality check", "Fast response", "Personal support"]
  },
  {
    id: 3,
    icon: BadgeCheck,
    title: "Get Verified",
    description: "Once approved, your profile goes live on LankaPass. Travelers can now discover and book your experiences.",
    color: "accent",
    duration: "Instant Activation",
    highlight: "Live on Platform",
    gradient: "from-emerald-500 to-teal-400",
    features: ["Instant profile", "Market visibility", "Booking ready"]
  },
  {
    id: 4,
    icon: Rocket,
    title: "Start Growing",
    description: "Manage bookings through your dashboard, receive secure payouts, and watch your business flourish.",
    color: "primary",
    duration: "Continuous Growth",
    highlight: "Scale Business",
    gradient: "from-orange-500 to-amber-400",
    features: ["Dashboard access", "Secure payments", "Analytics"]
  },
];

const STATS = [
  { value: "98%", label: "Success Rate", gradient: "from-blue-600 to-cyan-500" },
  { value: "24h", label: "Fast Review", gradient: "from-purple-600 to-pink-500" },
  { value: "4.9★", label: "Partner Rating", gradient: "from-emerald-600 to-teal-500" },
  { icon: Users, label: "5,000+ Partners", color: "text-amber-500" },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="how-it-works" 
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full animate-float-slow blur-xl opacity-70" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full animate-float-slower blur-xl opacity-60" />
        <div className="absolute bottom-40 left-1/4 w-36 h-36 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full animate-float-delayed blur-xl opacity-70" />
        <div className="absolute bottom-20 right-1/3 w-44 h-44 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full animate-float-slowest blur-xl opacity-60" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Animated Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 animate-gradient-x" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-24">
          {/* Subtitle Badge */}
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/50 shadow-sm mb-6 transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}
            aria-label="Process highlight: Simple & Effortless"
          >
            <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-sm tracking-wide">
              SIMPLE & EFFORTLESS
            </span>
            <Sparkles className="w-4 h-4 text-purple-500 animate-pulse delay-300" />
          </div>
          
          {/* Main Heading */}
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}
          >
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
              Start Your Journey in
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 animate-gradient">
              4 Simple Steps
            </span>
          </h1>
          
          {/* Description */}
          <p 
            className={`text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}
          >
            Join <span className="font-bold text-blue-600">5,000+</span> successful partners who've transformed their business with LankaPass
          </p>

          {/* Stats */}
          <div 
            className={`flex flex-wrap justify-center gap-8 md:gap-12 mt-10 transition-all duration-700 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            role="region"
            aria-label="Partnership statistics"
          >
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                {stat.value ? (
                  <>
                    <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                  </>
                ) : (
                  <>
                    <stat.icon className="w-8 h-8 mx-auto text-amber-500 mb-1" />
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Progress Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 animate-progress-line" />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
            {STEPS.map((step, index) => {
              const isActive = activeStep === index;
              const delay = index * 150;
              
              return (
                <article
                  key={step.id}
                  className={`relative transition-all duration-700 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${delay}ms` }}
                  onMouseEnter={() => setActiveStep(index)}
                  onFocus={() => setActiveStep(index)}
                  onMouseLeave={() => setActiveStep(0)}
                  onBlur={() => setActiveStep(0)}
                  tabIndex={0}
                  aria-label={`Step ${index + 1}: ${step.title}`}
                >
                  {/* Step Number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <div className="relative">
                      {/* Glow Effect */}
                      <div 
                        className={`absolute -inset-3 rounded-full blur-md transition-all duration-500 ${
                          isActive 
                            ? `bg-gradient-to-r ${step.gradient} opacity-40` 
                            : 'bg-slate-200 opacity-0 group-hover:opacity-20'
                        }`}
                      />
                      
                      {/* Number Circle */}
                      <div 
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300 ${
                          isActive 
                            ? 'scale-110' 
                            : 'group-hover:scale-105'
                        } bg-gradient-to-br ${step.gradient}`}
                        aria-label={`Step ${index + 1}`}
                      >
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Step Card */}
                  <div className="relative pt-8">
                    {/* Card Glow */}
                    <div 
                      className={`absolute -inset-1 rounded-2xl blur-lg transition-all duration-500 ${
                        isActive 
                          ? `bg-gradient-to-br ${step.gradient} opacity-15` 
                          : 'opacity-0 group-hover:opacity-5 group-hover:bg-gradient-to-br group-hover:from-slate-200 group-hover:to-slate-100'
                      }`}
                    />
                    
                    <div 
                      className={`relative rounded-xl p-6 border transition-all duration-300 overflow-hidden ${
                        isActive 
                          ? 'bg-white border-transparent shadow-lg scale-[1.02]' 
                          : 'bg-white/80 border-slate-100 group-hover:border-slate-200 group-hover:bg-white'
                      }`}
                    >
                      {/* Icon */}
                      <div className="relative mb-5">
                        <div 
                          className={`absolute inset-0 rounded-xl blur-md transition-all duration-500 ${
                            isActive ? `bg-gradient-to-br ${step.gradient} opacity-20` : 'opacity-0'
                          }`}
                        />
                        <div 
                          className={`relative w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isActive ? 'scale-105' : ''
                          } bg-gradient-to-br from-white to-slate-50 shadow-md`}
                        >
                          <div 
                            className={`p-3 rounded-lg ${
                              isActive 
                                ? `bg-gradient-to-br ${step.gradient}` 
                                : 'bg-gradient-to-br from-slate-100 to-slate-200'
                            } transition-all duration-300`}
                          >
                            <step.icon 
                              className={`w-6 h-6 ${
                                isActive ? 'text-white' : 'text-slate-600'
                              }`}
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative space-y-4">
                        {/* Header */}
                        <header>
                          <div 
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-slate-50 to-slate-100 text-xs font-semibold text-slate-600 mb-2"
                            aria-label={`Duration: ${step.duration}`}
                          >
                            <Clock className="w-3 h-3" aria-hidden="true" />
                            {step.duration}
                          </div>
                          <h3 
                            className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                              isActive 
                                ? `bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent` 
                                : 'text-slate-800'
                            }`}
                          >
                            {step.title}
                          </h3>
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {step.description}
                          </p>
                        </header>

                        {/* Features List */}
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Features
                          </div>
                          <ul className="space-y-1.5">
                            {step.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-slate-700">
                                <div 
                                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isActive 
                                      ? `bg-gradient-to-br ${step.gradient} text-white` 
                                      : 'bg-slate-100 text-slate-400'
                                  }`}
                                  aria-hidden="true"
                                >
                                  <Check className="w-2.5 h-2.5" />
                                </div>
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Highlight Badge */}
                        <div 
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                            isActive 
                              ? 'bg-gradient-to-r from-white to-white/90 shadow-sm' 
                              : 'bg-gradient-to-r from-slate-50 to-slate-100'
                          }`}
                          aria-label={`Highlight: ${step.highlight}`}
                        >
                          <div 
                            className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                              isActive 
                                ? `bg-gradient-to-br ${step.gradient}` 
                                : 'bg-slate-400'
                            }`}
                            aria-hidden="true"
                          />
                          <span className={`text-xs font-medium ${
                            isActive ? 'text-slate-800' : 'text-slate-600'
                          }`}>
                            {step.highlight}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Connector Arrow */}
                    {index < STEPS.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 z-10">
                        <div className="relative">
                          <div 
                            className={`absolute inset-0 bg-gradient-to-r ${step.gradient} rounded-full blur-sm transition-all duration-500 ${
                              isActive ? 'opacity-20' : 'opacity-0'
                            }`}
                          />
                          <div 
                            className={`relative p-1.5 rounded-full bg-white shadow-sm border border-slate-100 transition-all duration-300 ${
                              isActive ? 'scale-110' : ''
                            }`}
                            aria-hidden="true"
                          >
                            <ArrowRight 
                              className={`w-4 h-4 transition-colors duration-300 ${
                                isActive 
                                  ? `text-gradient ${step.gradient}` 
                                  : 'text-slate-400'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mobile Connector Arrow */}
                    {index < STEPS.length - 1 && index % 2 === 0 && (
                      <div className="md:hidden absolute -bottom-4 left-1/2 -translate-x-1/2">
                        <div 
                          className="relative p-1.5 rounded-full bg-white shadow-sm border border-slate-100"
                          aria-hidden="true"
                        >
                          <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* CTA Section */}
          <div 
            className={`mt-20 text-center transition-all duration-700 delay-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="max-w-2xl mx-auto">
              <div className="relative inline-block">
                {/* Floating Particles */}
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce" />
                <div className="absolute -top-1 -right-4 w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce delay-200" />
                <div className="absolute -bottom-4 left-6 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-bounce delay-400" />
                
                <button 
                  className="group relative px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden"
                  onClick={() => console.log('Start journey clicked')}
                  aria-label="Start your partnership journey today"
                >
                  {/* Shimmer Effect */}
                  <div 
                    className="absolute inset-0 translate-x-[-100%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[100%] transition-transform duration-700" 
                    aria-hidden="true"
                  />
                  
                  <div className="relative flex items-center justify-center gap-3">
                    <span className="text-base">Start Your Journey Today</span>
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      <TrendingUp className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      <Rocket className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Success Rate Badge */}
                  <div 
                    className="absolute -top-1 -right-1 px-2 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-sm"
                    aria-label="98% success rate"
                  >
                    +98% Success
                  </div>
                </button>
              </div>
              
              <p 
                className="text-slate-500 text-sm mt-6 flex items-center justify-center gap-1.5"
                aria-label="Join over 5,000 successful partners"
              >
                <Users className="w-4 h-4" aria-hidden="true" />
                <span>
                  Join <span className="font-semibold text-slate-700">5,000+</span> successful partners today
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};

export default HowItWorks;