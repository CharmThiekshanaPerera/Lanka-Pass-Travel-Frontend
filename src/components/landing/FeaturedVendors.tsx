import { Star, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import accommodationImg from "@/assets/vendor-accommodation.jpg";
import toursImg from "@/assets/vendor-tours.jpg";
import diningImg from "@/assets/vendor-dining.jpg";

const featuredVendors = [
  {
    image: accommodationImg,
    category: "Accommodation",
    name: "Jungle Retreat Ella",
    location: "Ella, Sri Lanka",
    rating: 4.9,
    reviews: 128,
    description: "Luxury eco-resort nestled in the heart of the hill country",
    price: "From $85/night",
  },
  {
    image: toursImg,
    category: "Tours & Safari",
    name: "Wild Lanka Expeditions",
    location: "Yala National Park",
    rating: 5.0,
    reviews: 256,
    description: "Expert-guided wildlife safaris with guaranteed sightings",
    price: "From $120/person",
  },
  {
    image: diningImg,
    category: "Culinary Experience",
    name: "Spice Kitchen Galle",
    location: "Galle Fort",
    rating: 4.8,
    reviews: 89,
    description: "Authentic Sri Lankan cooking classes with local chefs",
    price: "From $45/person",
  },
];

const FeaturedVendors = () => {
  return (
    <section className="py-20 md:py-28 bg-sand relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Featured Partners
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              Meet Our Top Vendors
            </h2>
            <p className="text-muted-foreground text-lg mt-2 max-w-xl">
              These exceptional partners represent the quality and authenticity we celebrate on LankaPass.
            </p>
          </div>
          <Link to="/onboarding">
            <Button variant="outline" className="group">
              Join Them Today
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Vendor Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredVendors.map((vendor, index) => (
            <div
              key={index}
              className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm text-foreground text-sm font-medium px-3 py-1 rounded-full">
                  {vendor.category}
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-xl font-bold text-primary-foreground mb-1">
                    {vendor.name}
                  </h3>
                  <div className="flex items-center gap-2 text-primary-foreground/80">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{vendor.location}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(vendor.rating)
                            ? "fill-primary text-primary"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-foreground">{vendor.rating}</span>
                  <span className="text-muted-foreground text-sm">({vendor.reviews} reviews)</span>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {vendor.description}
                </p>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-foreground font-semibold">{vendor.price}</span>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary group/btn">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVendors;
