import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { vendorService } from "@/services/vendorService";

interface FeaturedVendor {
  id: string;
  business_name: string;
  logo_url: string | null;
  cover_image_url: string | null;
  vendor_type: string;
  operating_areas: string[] | null;
}

const FeaturedVendors = () => {
  const [vendors, setVendors] = useState<FeaturedVendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await vendorService.getFeaturedVendors();
        setVendors(data);
      } catch (error) {
        console.error("Failed to load featured vendors", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-sand flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  if (vendors.length === 0) {
    return null; // Don't show section if no public vendors
  }

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
              Exceptions partners verified and trusted by LankaPass.
            </p>
          </div>
          <Link to="/onboarding">
            <Button variant="outline" className="group">
              Join Them Today
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Vendor Grid - Simpler "Logo & Name" Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="group bg-card rounded-2xl p-6 shadow-sm hover:shadow-elevated transition-all duration-300 border border-border/50 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 mb-4 relative rounded-full overflow-hidden border-2 border-primary/10 group-hover:border-primary/30 transition-colors bg-white">
                {vendor.logo_url ? (
                  <img
                    src={vendor.logo_url}
                    alt={vendor.business_name}
                    className="w-full h-full object-cover"
                  />
                ) : vendor.cover_image_url ? (
                  <img
                    src={vendor.cover_image_url}
                    alt={vendor.business_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-2xl font-bold text-primary/40">
                    {vendor.business_name.charAt(0)}
                  </div>
                )}
              </div>

              <h3 className="font-display font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                {vendor.business_name}
              </h3>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  {vendor.vendor_type}
                </span>
              </div>

              {vendor.operating_areas && vendor.operating_areas.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{vendor.operating_areas[0]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVendors;
