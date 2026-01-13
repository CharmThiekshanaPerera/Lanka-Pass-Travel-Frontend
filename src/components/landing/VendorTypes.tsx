import { 
  Building2, 
  MapPin, 
  Utensils, 
  Car, 
  Camera, 
  Sparkles, 
  Mountain, 
  Palmtree,
  ShoppingBag
} from "lucide-react";

const vendorTypes = [
  {
    icon: Building2,
    title: "Accommodation",
    description: "Hotels, resorts, guesthouses, and boutique stays",
    gradient: "from-primary/10 to-sunset-light",
  },
  {
    icon: MapPin,
    title: "Tours & Experiences",
    description: "Guided tours, day trips, and unique local experiences",
    gradient: "from-secondary/10 to-ocean-light",
  },
  {
    icon: Utensils,
    title: "Food & Dining",
    description: "Restaurants, cafes, cooking classes, and food tours",
    gradient: "from-accent/10 to-palm-light",
  },
  {
    icon: Car,
    title: "Transportation",
    description: "Car rentals, transfers, tuk-tuks, and private drivers",
    gradient: "from-primary/10 to-sunset-light",
  },
  {
    icon: Camera,
    title: "Photography",
    description: "Professional photography and videography services",
    gradient: "from-secondary/10 to-ocean-light",
  },
  {
    icon: Sparkles,
    title: "Wellness & Spa",
    description: "Ayurveda treatments, yoga retreats, and spa services",
    gradient: "from-accent/10 to-palm-light",
  },
  {
    icon: Mountain,
    title: "Adventure Sports",
    description: "Surfing, diving, hiking, and extreme activities",
    gradient: "from-primary/10 to-sunset-light",
  },
  {
    icon: Palmtree,
    title: "Cultural Experiences",
    description: "Traditional arts, crafts, ceremonies, and heritage tours",
    gradient: "from-secondary/10 to-ocean-light",
  },
  {
    icon: ShoppingBag,
    title: "Merchant",
    description: "Retail shops, souvenirs, and local product vendors",
    gradient: "from-accent/10 to-palm-light",
  },
];

const VendorTypes = () => {
  return (
    <section id="vendor-types" className="py-20 md:py-28 glass-section relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Who Can Join
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Vendors We Support
          </h2>
          <p className="text-muted-foreground text-lg">
            Whether you offer accommodations, tours, dining, or unique experiences — 
            there's a place for you on LankaPass.
          </p>
        </div>

        {/* Vendor Types Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendorTypes.map((type, index) => (
            <div
              key={index}
              className={`group glass-card bg-gradient-to-br ${type.gradient} p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-white/30 hover:border-primary/30`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                  <type.icon className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                    {type.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Note */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Don't see your category? Select "Other" during onboarding and tell us about your service.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VendorTypes;
