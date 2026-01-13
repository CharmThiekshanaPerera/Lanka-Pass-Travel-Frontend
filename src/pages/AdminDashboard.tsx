import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboard,
  Users,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Languages,
  Calendar,
  FileText,
  CreditCard,
  Image as ImageIcon,
  Video,
  Shield,
  AlertCircle,
  Filter,
  Download,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

// Mock vendor submissions data
const mockVendorSubmissions = [
  {
    id: "V001",
    submittedAt: "2024-01-10",
    status: "pending",
    vendorType: "Tours & Experiences",
    businessName: "Ceylon Adventures",
    legalName: "Ceylon Adventures Pvt Ltd",
    contactPerson: "Kasun Perera",
    countryCode: "+94",
    mobileNumber: "771234567",
    email: "info@ceylonadventures.lk",
    operatingAreas: ["Colombo", "Galle", "Kandy", "Ella", "Sigiriya"],
    businessRegNumber: "PV123456",
    taxId: "VAT123456789",
    businessAddress: "123 Temple Road, Colombo 03, Sri Lanka",
    services: [
      {
        serviceName: "Sunset Beach Safari",
        serviceCategory: "Guided Tour",
        shortDescription: "Experience the breathtaking beauty of Sri Lanka's southern coastline with our exclusive sunset beach safari.",
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
    ],
    pricing: [
      {
        currency: "USD",
        retailPrice: "89",
        commission: "15",
        netPrice: "75.65",
        dailyCapacity: "24",
      },
    ],
    hasLogo: true,
    hasCoverImage: true,
    galleryCount: 5,
    hasPromoVideo: true,
    marketingPermission: true,
    bankName: "Bank of Ceylon",
    accountHolderName: "Ceylon Adventures Pvt Ltd",
    accountNumber: "7891234567",
    payoutFrequency: "weekly",
    documents: {
      businessRegistration: "business_reg_cert.pdf",
      nicPassport: "nic_kasun.pdf",
      tourismLicense: "sltda_license.pdf",
    },
  },
  {
    id: "V002",
    submittedAt: "2024-01-12",
    status: "pending",
    vendorType: "Accommodation",
    businessName: "Lotus Villa Resort",
    legalName: "Lotus Hospitality Lanka Ltd",
    contactPerson: "Anjali Fernando",
    countryCode: "+94",
    mobileNumber: "779876543",
    email: "reservations@lotusvilla.lk",
    operatingAreas: ["Negombo", "Colombo"],
    businessRegNumber: "PV789012",
    taxId: "VAT987654321",
    businessAddress: "45 Beach Road, Negombo, Sri Lanka",
    services: [
      {
        serviceName: "Deluxe Ocean View Room",
        serviceCategory: "Accommodation",
        shortDescription: "Spacious rooms with stunning ocean views and modern amenities.",
        whatsIncluded: "Breakfast, WiFi, Pool access",
        whatsNotIncluded: "Airport transfer, Mini bar",
        durationValue: "1",
        durationUnit: "night",
        languagesOffered: ["English", "Sinhala"],
        groupSizeMin: "1",
        groupSizeMax: "3",
        operatingHoursFrom: "2",
        operatingHoursFromPeriod: "PM",
        operatingHoursTo: "12",
        operatingHoursToPeriod: "PM",
        operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        locationsCovered: ["Negombo"],
        advanceBooking: "Same day",
        cancellationPolicy: "Free cancellation up to 48 hours before check-in",
      },
    ],
    pricing: [
      {
        currency: "USD",
        retailPrice: "120",
        commission: "12",
        netPrice: "105.60",
        dailyCapacity: "15",
      },
    ],
    hasLogo: true,
    hasCoverImage: true,
    galleryCount: 8,
    hasPromoVideo: false,
    marketingPermission: true,
    bankName: "Commercial Bank",
    accountHolderName: "Lotus Hospitality Lanka Ltd",
    accountNumber: "4561237890",
    payoutFrequency: "bi-weekly",
    documents: {
      businessRegistration: "lotus_reg.pdf",
      nicPassport: "nic_anjali.pdf",
      tourismLicense: "hotel_license.pdf",
    },
  },
  {
    id: "V003",
    submittedAt: "2024-01-08",
    status: "approved",
    vendorType: "Dining & Food",
    businessName: "Spice Garden Restaurant",
    legalName: "Spice Garden Colombo Pvt Ltd",
    contactPerson: "Rohan Silva",
    countryCode: "+94",
    mobileNumber: "775551234",
    email: "hello@spicegarden.lk",
    operatingAreas: ["Colombo"],
    businessRegNumber: "PV456789",
    taxId: "VAT456789123",
    businessAddress: "78 Galle Face Terrace, Colombo 03",
    services: [
      {
        serviceName: "Traditional Sri Lankan Dinner Experience",
        serviceCategory: "Dining Experience",
        shortDescription: "Authentic multi-course Sri Lankan dinner with live cultural performance.",
        whatsIncluded: "7-course meal, Drinks, Cultural show",
        whatsNotIncluded: "Alcohol, Transport",
        durationValue: "3",
        durationUnit: "hours",
        languagesOffered: ["English", "Sinhala", "Japanese"],
        groupSizeMin: "2",
        groupSizeMax: "20",
        operatingHoursFrom: "6",
        operatingHoursFromPeriod: "PM",
        operatingHoursTo: "10",
        operatingHoursToPeriod: "PM",
        operatingDays: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        locationsCovered: ["Colombo"],
        advanceBooking: "48 hours",
        cancellationPolicy: "Full refund if cancelled 24 hours before",
      },
    ],
    pricing: [
      {
        currency: "USD",
        retailPrice: "45",
        commission: "15",
        netPrice: "38.25",
        dailyCapacity: "40",
      },
    ],
    hasLogo: true,
    hasCoverImage: true,
    galleryCount: 12,
    hasPromoVideo: true,
    marketingPermission: true,
    bankName: "Sampath Bank",
    accountHolderName: "Spice Garden Colombo Pvt Ltd",
    accountNumber: "1234567890",
    payoutFrequency: "weekly",
    documents: {
      businessRegistration: "spice_reg.pdf",
      nicPassport: "nic_rohan.pdf",
      tourismLicense: "food_license.pdf",
    },
  },
  {
    id: "V004",
    submittedAt: "2024-01-05",
    status: "rejected",
    vendorType: "Transport",
    businessName: "Quick Cabs Lanka",
    legalName: "Quick Transport Services",
    contactPerson: "Malik Jayawardena",
    countryCode: "+94",
    mobileNumber: "772223344",
    email: "bookings@quickcabs.lk",
    operatingAreas: ["Colombo", "Galle", "Kandy"],
    businessRegNumber: "PV111222",
    taxId: "",
    businessAddress: "12 Station Road, Colombo 10",
    services: [
      {
        serviceName: "Airport Transfer",
        serviceCategory: "Private Transfer",
        shortDescription: "Comfortable airport pickup and drop-off service.",
        whatsIncluded: "AC vehicle, Driver, Bottled water",
        whatsNotIncluded: "Waiting time charges",
        durationValue: "1",
        durationUnit: "hours",
        languagesOffered: ["English", "Sinhala"],
        groupSizeMin: "1",
        groupSizeMax: "4",
        operatingHoursFrom: "12",
        operatingHoursFromPeriod: "AM",
        operatingHoursTo: "11",
        operatingHoursToPeriod: "PM",
        operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        locationsCovered: ["Colombo", "Negombo"],
        advanceBooking: "6 hours",
        cancellationPolicy: "No refund for same-day cancellations",
      },
    ],
    pricing: [
      {
        currency: "USD",
        retailPrice: "35",
        commission: "10",
        netPrice: "31.50",
        dailyCapacity: "50",
      },
    ],
    hasLogo: false,
    hasCoverImage: true,
    galleryCount: 3,
    hasPromoVideo: false,
    marketingPermission: false,
    bankName: "People's Bank",
    accountHolderName: "Malik Jayawardena",
    accountNumber: "9876543210",
    payoutFrequency: "monthly",
    documents: {
      businessRegistration: "",
      nicPassport: "nic_malik.pdf",
      tourismLicense: "",
    },
    rejectionReason: "Missing business registration certificate and tourism license.",
  },
];

type VendorSubmission = typeof mockVendorSubmissions[0];

const AdminDashboard = () => {
  const [vendors, setVendors] = useState(mockVendorSubmissions);
  const [selectedVendor, setSelectedVendor] = useState<VendorSubmission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rejectionReason, setRejectionReason] = useState("");

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: vendors.length,
    pending: vendors.filter((v) => v.status === "pending").length,
    approved: vendors.filter((v) => v.status === "approved").length,
    rejected: vendors.filter((v) => v.status === "rejected").length,
  };

  const handleViewDetails = (vendor: VendorSubmission) => {
    setSelectedVendor(vendor);
    setActiveDetailTab("overview");
    setRejectionReason("");
    setIsDetailOpen(true);
  };

  const handleApprove = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, status: "approved" } : v))
    );
    setIsDetailOpen(false);
    toast.success("Vendor approved successfully!");
  };

  const handleReject = (vendorId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId ? { ...v, status: "rejected", rejectionReason } : v
      )
    );
    setIsDetailOpen(false);
    toast.success("Vendor rejected.");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="glass-navbar sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">Vendor Verification Portal</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Submissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="glass-card border-0 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendors Table */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Vendor Submissions ({filteredVendors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor ID</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-mono text-sm">{vendor.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {vendor.businessName.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{vendor.businessName}</p>
                          <p className="text-xs text-muted-foreground">{vendor.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{vendor.vendorType}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{vendor.contactPerson}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{vendor.submittedAt}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(vendor)}
                        className="gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedVendor && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {selectedVendor.businessName.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-xl">{selectedVendor.businessName}</DialogTitle>
                      <DialogDescription>
                        {selectedVendor.legalName} • ID: {selectedVendor.id}
                      </DialogDescription>
                    </div>
                  </div>
                  {getStatusBadge(selectedVendor.status)}
                </div>
              </DialogHeader>

              <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab} className="mt-4">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview" className="gap-2">
                    <Building2 className="w-4 h-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="services" className="gap-2">
                    <Globe className="w-4 h-4" />
                    Services
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
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Contact Info */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          Contact Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Contact Person</span>
                          <span className="font-medium">{selectedVendor.contactPerson}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone</span>
                          <span className="font-medium">
                            {selectedVendor.countryCode} {selectedVendor.mobileNumber}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email</span>
                          <span className="font-medium">{selectedVendor.email}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-start">
                          <span className="text-muted-foreground">Address</span>
                          <span className="font-medium text-right max-w-[200px]">
                            {selectedVendor.businessAddress}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Business Info */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          Business Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vendor Type</span>
                          <Badge variant="secondary">{selectedVendor.vendorType}</Badge>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Registration No.</span>
                          <span className="font-medium font-mono">
                            {selectedVendor.businessRegNumber || "Not provided"}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax ID / VAT</span>
                          <span className="font-medium font-mono">
                            {selectedVendor.taxId || "Not provided"}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Submitted</span>
                          <span className="font-medium">{selectedVendor.submittedAt}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Operating Areas */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Operating Areas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedVendor.operatingAreas.map((area) => (
                          <Badge key={area} variant="outline">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Media Summary */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        Media & Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          {selectedVendor.hasLogo ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span>Logo</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedVendor.hasCoverImage ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span>Cover Image</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-primary" />
                          <span>{selectedVendor.galleryCount} Gallery Images</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedVendor.hasPromoVideo ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span>Promo Video</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Services Tab */}
                <TabsContent value="services" className="space-y-4 mt-4">
                  {selectedVendor.services.map((service, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge className="mb-2">{service.serviceCategory}</Badge>
                            <CardTitle className="text-lg">{service.serviceName}</CardTitle>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">
                              {selectedVendor.pricing[index]?.currency}{" "}
                              {selectedVendor.pricing[index]?.retailPrice}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Net: {selectedVendor.pricing[index]?.currency}{" "}
                              {selectedVendor.pricing[index]?.netPrice}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm">
                        <p className="text-muted-foreground">{service.shortDescription}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Duration</p>
                            <p className="font-medium">
                              {service.durationValue} {service.durationUnit}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Group Size</p>
                            <p className="font-medium">
                              {service.groupSizeMin}-{service.groupSizeMax} people
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Advance Booking</p>
                            <p className="font-medium">{service.advanceBooking}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Daily Capacity</p>
                            <p className="font-medium">
                              {selectedVendor.pricing[index]?.dailyCapacity}
                            </p>
                          </div>
                        </div>

                        <Separator />

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">What's Included</p>
                            <p className="text-green-600">{service.whatsIncluded}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">What's Not Included</p>
                            <p className="text-red-500">{service.whatsNotIncluded}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Languages</p>
                          <div className="flex gap-1">
                            {service.languagesOffered.map((lang) => (
                              <Badge key={lang} variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Operating Days</p>
                          <div className="flex gap-1">
                            {service.operatingDays.map((day) => (
                              <Badge key={day} variant="secondary" className="text-xs">
                                {day}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Cancellation Policy</p>
                          <p>{service.cancellationPolicy}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Uploaded Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">Business Registration Certificate</p>
                            <p className="text-xs text-muted-foreground">
                              {selectedVendor.documents.businessRegistration || "Not uploaded"}
                            </p>
                          </div>
                        </div>
                        {selectedVendor.documents.businessRegistration ? (
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        ) : (
                          <Badge variant="destructive">Missing</Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">NIC / Passport</p>
                            <p className="text-xs text-muted-foreground">
                              {selectedVendor.documents.nicPassport || "Not uploaded"}
                            </p>
                          </div>
                        </div>
                        {selectedVendor.documents.nicPassport ? (
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        ) : (
                          <Badge variant="destructive">Missing</Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">Tourism License</p>
                            <p className="text-xs text-muted-foreground">
                              {selectedVendor.documents.tourismLicense || "Not uploaded"}
                            </p>
                          </div>
                        </div>
                        {selectedVendor.documents.tourismLicense ? (
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        ) : (
                          <Badge variant="destructive">Missing</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Payment Tab */}
                <TabsContent value="payment" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        Bank Account Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bank Name</span>
                        <span className="font-medium">{selectedVendor.bankName}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Holder</span>
                        <span className="font-medium">{selectedVendor.accountHolderName}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Number</span>
                        <span className="font-medium font-mono">{selectedVendor.accountNumber}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payout Frequency</span>
                        <Badge variant="secondary" className="capitalize">
                          {selectedVendor.payoutFrequency}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Commission Info */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Commission Structure</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Retail Price</TableHead>
                            <TableHead>Commission</TableHead>
                            <TableHead>Net to Vendor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedVendor.services.map((service, index) => (
                            <TableRow key={index}>
                              <TableCell>{service.serviceName}</TableCell>
                              <TableCell>
                                {selectedVendor.pricing[index]?.currency}{" "}
                                {selectedVendor.pricing[index]?.retailPrice}
                              </TableCell>
                              <TableCell>{selectedVendor.pricing[index]?.commission}%</TableCell>
                              <TableCell className="font-medium text-green-600">
                                {selectedVendor.pricing[index]?.currency}{" "}
                                {selectedVendor.pricing[index]?.netPrice}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              {selectedVendor.status === "pending" && (
                <div className="mt-6 pt-4 border-t space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Rejection Reason (required if rejecting)
                    </label>
                    <Textarea
                      placeholder="Provide a reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedVendor.id)}
                      className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedVendor.id)}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve Vendor
                    </Button>
                  </div>
                </div>
              )}

              {selectedVendor.status === "rejected" && selectedVendor.rejectionReason && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-700">Rejection Reason</p>
                      <p className="text-sm text-red-600">{selectedVendor.rejectionReason}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
