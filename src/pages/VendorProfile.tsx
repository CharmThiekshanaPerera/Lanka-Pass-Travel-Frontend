import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  Languages,
  Calendar,
  Star,
  Edit,
  Camera,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Video,
  Shield,
} from "lucide-react";

// Mock vendor data - in real app this would come from backend/context
const mockVendorData = {
  // Basic Info (Step 1)
  vendorType: "Tours & Experiences",
  businessName: "Ceylon Adventures",
  legalName: "Ceylon Adventures Pvt Ltd",
  contactPerson: "Kasun Perera",
  countryCode: "+94",
  mobileNumber: "771234567",
  email: "info@ceylonadventures.lk",
  operatingAreas: ["Colombo", "Galle", "Kandy", "Ella", "Sigiriya"],
  
  // Business Details (Step 2)
  businessRegNumber: "PV123456",
  taxId: "VAT123456789",
  businessAddress: "123 Temple Road, Colombo 03, Sri Lanka",
  documentsVerified: true,
  
  // Services (Step 3)
  services: [
    {
      serviceName: "Sunset Beach Safari",
      serviceCategory: "Guided Tour",
      shortDescription: "Experience the breathtaking beauty of Sri Lanka's southern coastline with our exclusive sunset beach safari. Watch dolphins play in the golden hour light while enjoying local refreshments.",
      whatsIncluded: "Transport, Guide, Refreshments, Photography",
      whatsNotIncluded: "Personal expenses, Tips",
      durationValue: "4",
      durationUnit: "hours",
      languagesOffered: ["English", "Sinhala", "German"],
      groupSizeMin: "2",
      groupSizeMax: "12",
      operatingHoursFrom: "3",
      operatingHoursFromPeriod: "PM",
      operatingHoursTo: "7",
      operatingHoursToPeriod: "PM",
      operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      locationsCovered: ["Galle", "Matara", "Hambantota"],
      advanceBooking: "24 hours",
      cancellationPolicy: "Free cancellation up to 24 hours before the tour",
    },
    {
      serviceName: "Cultural Heritage Walk",
      serviceCategory: "Guided Tour",
      shortDescription: "Discover the rich cultural heritage of Kandy with our expert local guides. Visit ancient temples, traditional markets, and experience authentic Sri Lankan hospitality.",
      whatsIncluded: "Guide, Temple entries, Traditional lunch",
      whatsNotIncluded: "Transport to starting point",
      durationValue: "6",
      durationUnit: "hours",
      languagesOffered: ["English", "Sinhala", "French"],
      groupSizeMin: "1",
      groupSizeMax: "8",
      operatingHoursFrom: "8",
      operatingHoursFromPeriod: "AM",
      operatingHoursTo: "2",
      operatingHoursToPeriod: "PM",
      operatingDays: ["Mon", "Wed", "Fri", "Sat", "Sun"],
      locationsCovered: ["Kandy"],
      advanceBooking: "48 hours",
      cancellationPolicy: "50% refund for cancellations 48+ hours before",
    },
  ],
  
  // Pricing (Step 4)
  pricing: [
    {
      currency: "USD",
      retailPrice: "89",
      commission: "15",
      netPrice: "75.65",
      dailyCapacity: "24",
    },
    {
      currency: "USD",
      retailPrice: "65",
      commission: "15",
      netPrice: "55.25",
      dailyCapacity: "16",
    },
  ],
  
  // Media (Step 5)
  hasLogo: true,
  hasCoverImage: true,
  galleryCount: 5,
  hasPromoVideo: true,
  marketingPermission: true,
  
  // Payment (Step 6)
  bankName: "Bank of Ceylon",
  accountHolderName: "Ceylon Adventures Pvt Ltd",
  accountNumber: "****4567",
  payoutFrequency: "weekly",
  
  // Stats
  rating: 4.8,
  totalReviews: 127,
  totalBookings: 452,
  memberSince: "January 2024",
  verificationStatus: "verified",
};

const VendorProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const vendor = mockVendorData;

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="glass-navbar sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/vendor-dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="glass-card rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary/20">
                <AvatarImage src="/placeholder.svg" alt={vendor.businessName} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {vendor.businessName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{vendor.businessName}</h1>
                {vendor.verificationStatus === "verified" && (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-3">{vendor.legalName}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  {vendor.vendorType}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {vendor.operatingAreas.slice(0, 3).join(", ")}
                  {vendor.operatingAreas.length > 3 && ` +${vendor.operatingAreas.length - 3} more`}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Member since {vendor.memberSince}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 md:gap-8">
              <div className="text-center">
                <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                  <Star className="w-5 h-5 fill-primary" />
                  {vendor.rating}
                </div>
                <p className="text-xs text-muted-foreground">{vendor.totalReviews} reviews</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{vendor.totalBookings}</div>
                <p className="text-xs text-muted-foreground">Bookings</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{vendor.services.length}</div>
                <p className="text-xs text-muted-foreground">Services</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-card p-1 h-auto flex-wrap">
            <TabsTrigger value="overview" className="gap-2">
              <Building2 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <Globe className="w-4 h-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="media" className="gap-2">
              <ImageIcon className="w-4 h-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Payment
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Person</p>
                      <p className="font-medium">{vendor.contactPerson}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{vendor.countryCode} {vendor.mobileNumber}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{vendor.email}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Business Address</p>
                      <p className="font-medium">{vendor.businessAddress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Operating Areas */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Operating Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {vendor.operatingAreas.map((area) => (
                      <Badge key={area} variant="secondary" className="px-3 py-1.5">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Business Registration */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Business Registration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Registration Number</p>
                    <p className="font-medium">{vendor.businessRegNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tax ID / VAT</p>
                    <p className="font-medium">{vendor.taxId || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Verification Status</p>
                    <div className="flex items-center gap-2">
                      {vendor.documentsVerified ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-green-600">Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                          <span className="font-medium text-yellow-600">Pending</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            {vendor.services.map((service, index) => (
              <Card key={index} className="glass-card border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="mb-2">{service.serviceCategory}</Badge>
                      <CardTitle className="text-xl">{service.serviceName}</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {vendor.pricing[index]?.currency} {vendor.pricing[index]?.retailPrice}
                      </p>
                      <p className="text-sm text-muted-foreground">per person</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <p className="text-muted-foreground">{service.shortDescription}</p>
                  
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-medium">{service.durationValue} {service.durationUnit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Group Size</p>
                        <p className="font-medium">{service.groupSizeMin}-{service.groupSizeMax} people</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Languages className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Languages</p>
                        <p className="font-medium">{service.languagesOffered.join(", ")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Advance Booking</p>
                        <p className="font-medium">{service.advanceBooking}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-green-600">What's Included</h4>
                      <p className="text-sm text-muted-foreground">{service.whatsIncluded}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-red-500">What's Not Included</h4>
                      <p className="text-sm text-muted-foreground">{service.whatsNotIncluded}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Operating Hours: </span>
                      <span className="font-medium">
                        {service.operatingHoursFrom} {service.operatingHoursFromPeriod} - {service.operatingHoursTo} {service.operatingHoursToPeriod}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Operating Days: </span>
                      <span className="font-medium">{service.operatingDays.join(", ")}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground text-sm">Locations: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {service.locationsCovered.map((loc) => (
                        <Badge key={loc} variant="outline" className="text-xs">
                          {loc}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-1">Cancellation Policy</h4>
                    <p className="text-sm text-muted-foreground">{service.cancellationPolicy}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass-card border-0">
                <CardContent className="pt-6 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${vendor.hasLogo ? "bg-green-500/10" : "bg-muted"}`}>
                    <ImageIcon className={`w-8 h-8 ${vendor.hasLogo ? "text-green-500" : "text-muted-foreground"}`} />
                  </div>
                  <h3 className="font-semibold mb-1">Logo</h3>
                  <p className="text-sm text-muted-foreground">
                    {vendor.hasLogo ? "Uploaded" : "Not uploaded"}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-0">
                <CardContent className="pt-6 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${vendor.hasCoverImage ? "bg-green-500/10" : "bg-muted"}`}>
                    <Camera className={`w-8 h-8 ${vendor.hasCoverImage ? "text-green-500" : "text-muted-foreground"}`} />
                  </div>
                  <h3 className="font-semibold mb-1">Cover Image</h3>
                  <p className="text-sm text-muted-foreground">
                    {vendor.hasCoverImage ? "Uploaded" : "Not uploaded"}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-0">
                <CardContent className="pt-6 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${vendor.hasPromoVideo ? "bg-green-500/10" : "bg-muted"}`}>
                    <Video className={`w-8 h-8 ${vendor.hasPromoVideo ? "text-green-500" : "text-muted-foreground"}`} />
                  </div>
                  <h3 className="font-semibold mb-1">Promo Video</h3>
                  <p className="text-sm text-muted-foreground">
                    {vendor.hasPromoVideo ? "Uploaded" : "Not uploaded"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-lg">Gallery Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Array.from({ length: vendor.galleryCount }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-xl bg-muted overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {vendor.galleryCount} of 6 images uploaded
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`w-6 h-6 ${vendor.marketingPermission ? "text-green-500" : "text-muted-foreground"}`} />
                  <div>
                    <p className="font-medium">Marketing Permission</p>
                    <p className="text-sm text-muted-foreground">
                      {vendor.marketingPermission 
                        ? "You have granted permission to use your media for marketing purposes."
                        : "Marketing permission not granted."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Business Registration Certificate", status: "verified" },
                { name: "NIC / Passport", status: "verified" },
                { name: "Tourism License (SLTDA)", status: "pending" },
              ].map((doc) => (
                <Card key={doc.name} className="glass-card border-0">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium mb-1 truncate">{doc.name}</h4>
                        <div className="flex items-center gap-1">
                          {doc.status === "verified" ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-green-600">Verified</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-yellow-600">Pending Review</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Bank Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Bank Name</p>
                    <p className="font-medium">{vendor.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Account Holder</p>
                    <p className="font-medium">{vendor.accountHolderName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                    <p className="font-medium">{vendor.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Payout Frequency</p>
                    <p className="font-medium capitalize">{vendor.payoutFrequency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-lg">Pricing Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendor.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium">{service.serviceName}</p>
                        <p className="text-sm text-muted-foreground">
                          {vendor.pricing[index]?.commission}% platform commission
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {vendor.pricing[index]?.currency} {vendor.pricing[index]?.retailPrice}
                        </p>
                        <p className="text-sm text-green-600">
                          Your payout: {vendor.pricing[index]?.currency} {vendor.pricing[index]?.netPrice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorProfile;
