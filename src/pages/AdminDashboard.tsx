import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  UserPlus,
  Trash2,
  Loader2,
  MessageCircle,
  Ban,
  UserMinus,
  Send,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { vendorService } from "@/services/vendorService";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

// Define the shape of our frontend vendor object (mapping from backend)
interface VendorSubmission {
  id: string;
  submittedAt: string;
  status: string;
  vendorType: string;
  businessName: string;
  legalName: string;
  contactPerson: string;
  countryCode: string; // Backend might combine this, we'll parse or default
  mobileNumber: string;
  email: string;
  operatingAreas: string[];
  businessRegNumber: string;
  taxId: string;
  businessAddress: string;
  services: any[];
  pricing: any[]; // Mapped from service pricing
  hasLogo: boolean;
  hasCoverImage: boolean;
  galleryCount: number;
  hasPromoVideo: boolean;
  marketingPermission: boolean;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  bankBranch: string;
  payoutFrequency: string; // Not in current backend, default or map
  payoutCycle?: string;
  payoutDate?: string;
  phoneVerified?: boolean;
  documents: {
    businessRegistration: string;
    nicPassport: string;
    tourismLicense: string;
  };
  rejectionReason?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  galleryUrls?: string[];
}

const AdminDashboard = () => {
  const [vendors, setVendors] = useState<VendorSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<VendorSubmission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rejectionReason, setRejectionReason] = useState("");

  // Manager Management State
  const [managers, setManagers] = useState<any[]>([]);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [newManager, setNewManager] = useState({ name: "", email: "", password: "" });
  const [isCreatingManager, setIsCreatingManager] = useState(false);
  const [processingVendorId, setProcessingVendorId] = useState<string | null>(null);
  const [updatingServiceId, setUpdatingServiceId] = useState<string | null>(null);
  const [commissionValues, setCommissionValues] = useState<{ [key: string]: string }>({});

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatVendor, setChatVendor] = useState<VendorSubmission | null>(null);

  const handleCommissionChange = (serviceId: string, value: string) => {
    setCommissionValues(prev => ({ ...prev, [serviceId]: value }));
  };

  const handleUpdateCommission = async (serviceId: string) => {
    const value = commissionValues[serviceId];
    if (!value || isNaN(Number(value)) || Number(value) < 0 || Number(value) > 100) {
      toast.error("Please enter a valid commission percentage (0-100)");
      return;
    }

    setUpdatingServiceId(serviceId);
    try {
      await api.patch(
        `/api/admin/services/${serviceId}/commission`,
        { commission_percent: Number(value) }
      );
      toast.success("Commission updated successfully");

      // Refresh vendor details to show new calculations
      if (selectedVendor) {
        handleViewDetails(selectedVendor);
      }
    } catch (error: any) {
      console.error("Failed to update commission:", error);
      toast.error(error.response?.data?.detail || "Failed to update commission");
    } finally {
      setUpdatingServiceId(null);
    }
  };

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate("/admin/login");
      setShowLogoutConfirm(false);
      setIsLoggingOut(false);
    }, 2500);
  };

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const response = await vendorService.getVendors();
      if (response.success && response.vendors) {
        const mappedVendors: VendorSubmission[] = response.vendors.map((v: any) => ({
          id: v.id,
          submittedAt: new Date(v.created_at).toISOString().split('T')[0],
          status: v.status || "pending",
          vendorType: v.vendor_type || "",
          businessName: v.business_name || "",
          legalName: v.legal_name || "",
          contactPerson: v.contact_person || "",
          countryCode: "+94",
          mobileNumber: v.phone_number || "",
          email: v.email || "",
          operatingAreas: v.operating_areas || [],
          businessRegNumber: v.business_reg_number || "",
          taxId: v.tax_id || "",
          businessAddress: v.business_address || "",
          services: [],
          pricing: [],
          hasLogo: !!v.logo_url,
          hasCoverImage: !!v.cover_image_url,
          galleryCount: (v.gallery_urls || []).length,
          hasPromoVideo: false,
          marketingPermission: v.marketing_permission || false,
          bankName: v.bank_name || "",
          accountHolderName: v.account_holder_name || "",
          accountNumber: v.account_number || "",
          bankBranch: v.bank_branch || "",
          payoutFrequency: "monthly",
          payoutCycle: v.payout_cycle,
          payoutDate: v.payout_date,
          phoneVerified: v.phone_verified || false,
          documents: {
            businessRegistration: v.reg_certificate_url,
            nicPassport: v.nic_passport_url,
            tourismLicense: v.tourism_license_url,
          },
          rejectionReason: v.status_reason,
          logoUrl: v.logo_url,
          coverImageUrl: v.cover_image_url,
          galleryUrls: v.gallery_urls || [],
        }));
        setVendors(mappedVendors);
      }
    } catch (error: any) {
      console.error("Failed to fetch vendors:", error);
      toast.error(error.message || "Failed to load vendors");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchManagers = async () => {
    if (!isAdmin) return;
    try {
      const response = await vendorService.getManagers();
      if (response.success) {
        setManagers(response.managers);
      }
    } catch (error) {
      console.error("Failed to fetch managers:", error);
    }
  };

  const handleCreateManager = async () => {
    if (!newManager.name || !newManager.email || !newManager.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsCreatingManager(true);
    try {
      await vendorService.createManager(newManager);
      toast.success("Manager created successfully");
      setIsManagerModalOpen(false);
      setNewManager({ name: "", email: "", password: "" });
      fetchManagers();
    } catch (error: any) {
      toast.error(error.message || "Failed to create manager");
    } finally {
      setIsCreatingManager(false);
    }
  };

  const handleDeleteManager = async (id: string) => {
    if (!confirm("Are you sure you want to delete this manager?")) return;
    try {
      await vendorService.deleteManager(id);
      toast.success("Manager deleted successfully");
      fetchManagers();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete manager");
    }
  };

  const handleExport = async () => {
    try {
      toast.promise(vendorService.exportVendors(), {
        loading: 'Generating export...',
        success: 'Export downloaded successfully',
        error: 'Failed to export data'
      });
    } catch (error) {
      toast.error("Failed to start export");
    }
  };

  useEffect(() => {
    fetchVendors();
    if (isAdmin) {
      fetchManagers();
    }
  }, [user]);

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

  const handleViewDetails = async (vendor: VendorSubmission) => {
    try {
      setProcessingVendorId(vendor.id);
      const response = await vendorService.getVendor(vendor.id);
      if (response.success) {
        const fullVendor = response.vendor;
        const services = response.services || [];
        const detailedVendor: VendorSubmission = {
          ...vendor,
          services: services.map((s: any) => ({
            serviceName: s.service_name,
            serviceCategory: s.service_category,
            shortDescription: s.short_description,
            durationValue: s.duration_value,
            durationUnit: s.duration_unit,
            groupSizeMin: s.group_size_min,
            groupSizeMax: s.group_size_max,
            retailPrice: s.retail_price,
            currency: s.currency,
            netPrice: (s.retail_price * 0.85).toFixed(2),
            imageUrls: s.image_urls || [],
            languagesOffered: s.languages_offered || [],
            operatingDays: s.operating_days || [],
            whatsIncluded: s.whats_included || '',
            whatsNotIncluded: s.whats_not_included || '',
            cancellationPolicy: s.cancellation_policy || '',
            advanceBooking: s.advance_booking || 'N/A',
            // Operating hours
            operatingHoursFrom: s.operating_hours_from,
            operatingHoursFromPeriod: s.operating_hours_from_period,
            operatingHoursTo: s.operating_hours_to,
            operatingHoursToPeriod: s.operating_hours_to_period,
            // Blackout dates
            blackoutDates: s.blackout_dates || [],
            blackoutHolidays: s.blackout_holidays || false,
          })),
          bankBranch: fullVendor.bank_branch || vendor.bankBranch,
          pricing: services.map((s: any) => ({
            currency: s.currency,
            retailPrice: s.retail_price,
            netPrice: (s.retail_price * 0.85).toFixed(2),
          })),
        };
        setSelectedVendor(detailedVendor);
        setActiveDetailTab("overview");
        setRejectionReason("");
        setIsDetailOpen(true);
      }
    } catch (error: any) {
      console.error("Failed to fetch vendor details:", error);
      toast.error(error.message || "Failed to load vendor details");
    } finally {
      setProcessingVendorId(null);
    }
  };

  const handleApprove = async (vendorId: string) => {
    try {
      setProcessingVendorId(vendorId);
      await vendorService.updateVendorStatus(vendorId, "approved");
      setVendors((prev) =>
        prev.map((v) => (v.id === vendorId ? { ...v, status: "approved" } : v))
      );
      setIsDetailOpen(false);
      toast.success("Vendor approved successfully!");
      fetchVendors(); // Refresh to ensure sync
    } catch (error: any) {
      toast.error(error.message || "Failed to approve vendor");
    } finally {
      setProcessingVendorId(null);
    }
  };

  const handleReject = async (vendorId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }

    try {
      setProcessingVendorId(vendorId);
      await vendorService.updateVendorStatus(vendorId, "rejected", rejectionReason);
      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorId ? { ...v, status: "rejected", rejectionReason } : v
        )
      );
      setIsDetailOpen(false);
      toast.success("Vendor rejected.");
      fetchVendors();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject vendor");
    } finally {
      setProcessingVendorId(null);
    }
  };

  const handleStatusChange = async (vendorId: string, status: string, reason?: string) => {
    try {
      setProcessingVendorId(vendorId);
      await vendorService.updateVendorStatus(vendorId, status, reason);
      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorId ? { ...v, status: status, rejectionReason: reason } : v
        )
      );
      if (selectedVendor && selectedVendor.id === vendorId) {
        setSelectedVendor({ ...selectedVendor, status: status, rejectionReason: reason });
      }
      toast.success(`Vendor status updated to ${status}`);
      fetchVendors();
    } catch (error: any) {
      toast.error(error.message || "Failed to update vendor status");
    } finally {
      setProcessingVendorId(null);
    }
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
            <Button variant="outline" size="sm" className="gap-2" onClick={handleLogoutClick}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access the admin portal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleLogoutConfirm();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                "Logout"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="managers" className="gap-2">
                <Users className="w-4 h-4" />
                Managers
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview">
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
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
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
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                              onClick={() => {
                                setChatVendor(vendor);
                                setIsChatOpen(true);
                              }}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(vendor)}
                              disabled={processingVendorId === vendor.id}
                              className="gap-2"
                            >
                              {processingVendorId === vendor.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="managers">
              <Card className="glass-card border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    System Managers
                  </CardTitle>
                  <Button onClick={() => setIsManagerModalOpen(true)} className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Add Manager
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {managers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No managers found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        managers.map((manager) => (
                          <TableRow key={manager.id}>
                            <TableCell className="font-medium">{manager.name}</TableCell>
                            <TableCell>{manager.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {manager.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={manager.is_active ? "default" : "secondary"}>
                                {manager.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteManager(manager.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Add Manager Modal */}
      <Dialog open={isManagerModalOpen} onOpenChange={setIsManagerModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Manager</DialogTitle>
            <DialogDescription>
              Create a new manager account. They will have access to view and approve vendors.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Manager Name"
                value={newManager.name}
                onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="manager@example.com"
                value={newManager.email}
                onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={newManager.password}
                onChange={(e) => setNewManager({ ...newManager, password: e.target.value })}
              />
            </div>
            <Button
              type="button"
              className="w-full"
              onClick={handleCreateManager}
              disabled={isCreatingManager}
            >
              {isCreatingManager ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Manager"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                            {service.languagesOffered?.map((lang) => (
                              <Badge key={lang} variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Operating Days</p>
                          <div className="flex gap-1">
                            {service.operatingDays?.map((day) => (
                              <Badge key={day} variant="secondary" className="text-xs">
                                {day}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Operating Hours */}
                        {(service.operatingHoursFrom || service.operatingHoursTo) && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Operating Hours</p>
                            <p className="font-medium">
                              {service.operatingHoursFrom} {service.operatingHoursFromPeriod} - {service.operatingHoursTo} {service.operatingHoursToPeriod}
                            </p>
                          </div>
                        )}

                        {/* Blackout Information */}
                        {(service.blackoutDates?.length > 0 || service.blackoutHolidays) && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Blackout Dates</p>
                            <div className="space-y-1">
                              {service.blackoutHolidays && (
                                <Badge variant="outline" className="text-xs">Excludes Public Holidays</Badge>
                              )}
                              {service.blackoutDates?.length > 0 && (
                                <p className="text-sm">{service.blackoutDates.length} specific date(s) blocked</p>
                              )}
                            </div>
                          </div>
                        )}

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Cancellation Policy</p>
                          <p>{service.cancellationPolicy}</p>
                        </div>
                      </CardContent>

                      {/* Service Images */}
                      {
                        service.imageUrls && service.imageUrls.length > 0 && (
                          <div className="px-6 pb-6">
                            <p className="text-xs text-muted-foreground mb-2">Service Images</p>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                              {service.imageUrls.map((url: string, imgIndex: number) => (
                                <div key={imgIndex} className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border">
                                  <img
                                    src={url}
                                    alt={`Service ${index + 1} Image ${imgIndex + 1}`}
                                    className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                                    onClick={() => window.open(url, '_blank')}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      }
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
                              {selectedVendor.documents.businessRegistration ? "Uploaded" : "Not uploaded"}
                            </p>
                          </div>
                        </div>
                        {selectedVendor.documents.businessRegistration ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(selectedVendor.documents.businessRegistration, '_blank')}
                          >
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
                              {selectedVendor.documents.nicPassport ? "Uploaded" : "Not uploaded"}
                            </p>
                          </div>
                        </div>
                        {selectedVendor.documents.nicPassport ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(selectedVendor.documents.nicPassport, '_blank')}
                          >
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
                              {selectedVendor.documents.tourismLicense ? "Uploaded" : "Not uploaded"}
                            </p>
                          </div>
                        </div>
                        {selectedVendor.documents.tourismLicense ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(selectedVendor.documents.tourismLicense, '_blank')}
                          >
                            View
                          </Button>
                        ) : (
                          <Badge variant="destructive">Missing</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Gallery Section */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        Images & Gallery
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Logo */}
                      {selectedVendor.logoUrl && (
                        <div>
                          <p className="text-sm font-medium mb-2">Business Logo</p>
                          <div className="border rounded-lg p-4 bg-white flex items-center justify-center">
                            <img
                              src={selectedVendor.logoUrl}
                              alt="Business Logo"
                              className="max-h-32 object-contain cursor-pointer hover:opacity-80 transition"
                              onClick={() => window.open(selectedVendor.logoUrl, '_blank')}
                            />
                          </div>
                        </div>
                      )}

                      {/* Cover Image */}
                      {selectedVendor.coverImageUrl && (
                        <div>
                          <p className="text-sm font-medium mb-2">Cover Image</p>
                          <div className="border rounded-lg overflow-hidden">
                            <img
                              src={selectedVendor.coverImageUrl}
                              alt="Cover Image"
                              className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition"
                              onClick={() => window.open(selectedVendor.coverImageUrl, '_blank')}
                            />
                          </div>
                        </div>
                      )}

                      {/* Gallery Images */}
                      {selectedVendor.galleryUrls && selectedVendor.galleryUrls.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Gallery ({selectedVendor.galleryUrls.length} images)</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {selectedVendor.galleryUrls.map((url, index) => (
                              <div key={index} className="border rounded-lg overflow-hidden aspect-square">
                                <img
                                  src={url}
                                  alt={`Gallery ${index + 1}`}
                                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
                                  onClick={() => window.open(url, '_blank')}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {!selectedVendor.logoUrl && !selectedVendor.coverImageUrl && (!selectedVendor.galleryUrls || selectedVendor.galleryUrls.length === 0) && (
                        <div className="text-center py-8 text-muted-foreground">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No images uploaded</p>
                        </div>
                      )}
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
                        <span className="text-muted-foreground">Branch</span>
                        <span className="font-medium">{selectedVendor.bankBranch}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payout Frequency</span>
                        <Badge variant="secondary" className="capitalize">
                          {selectedVendor.payoutFrequency}
                        </Badge>
                      </div>
                      {selectedVendor.payoutCycle && (
                        <>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Preferred Payout Cycle</span>
                            <Badge variant="outline" className="capitalize">
                              {selectedVendor.payoutCycle}
                            </Badge>
                          </div>
                        </>
                      )}
                      {selectedVendor.payoutDate && (
                        <>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Preferred Payout Date</span>
                            <span className="font-medium">{selectedVendor.payoutDate}</span>
                          </div>
                        </>
                      )}
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
                              <TableCell>
                                {isAdmin ? (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      className="w-20 h-8"
                                      placeholder={String(selectedVendor.pricing[index]?.commission || 0)}
                                      value={commissionValues[service.id] !== undefined ? commissionValues[service.id] : (selectedVendor.pricing[index]?.commission || 0)}
                                      onChange={(e) => handleCommissionChange(service.id, e.target.value)}
                                    />
                                    <span className="text-sm text-muted-foreground">%</span>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                      disabled={updatingServiceId === service.id}
                                      onClick={() => handleUpdateCommission(service.id)}
                                    >
                                      {updatingServiceId === service.id ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : (
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                      )}
                                    </Button>
                                  </div>
                                ) : (
                                  <span>{selectedVendor.pricing[index]?.commission || 0}%</span>
                                )}
                              </TableCell>
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
              {(isAdmin || isManager) && (
                <div className="mt-6 pt-4 border-t space-y-4">
                  {(selectedVendor.status === "pending" || selectedVendor.status === "rejected") && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Status Reason (required if rejecting/terminating)
                      </label>
                      <Textarea
                        placeholder="Provide a reason for this action..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={2}
                      />
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 justify-end">
                    {selectedVendor.status === "pending" && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleReject(selectedVendor.id)}
                          disabled={processingVendorId === selectedVendor.id}
                          className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          {processingVendorId === selectedVendor.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          Reject
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleApprove(selectedVendor.id)}
                          disabled={processingVendorId === selectedVendor.id}
                          className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                          {processingVendorId === selectedVendor.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          Approve Vendor
                        </Button>
                      </>
                    )}

                    {selectedVendor.status === "approved" && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            if (!rejectionReason.trim()) {
                              toast.error("Please provide a reason for termination");
                              return;
                            }
                            handleStatusChange(selectedVendor.id, "terminated", rejectionReason);
                          }}
                          disabled={processingVendorId === selectedVendor.id}
                          className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                          <Ban className="w-4 h-4" />
                          Terminate
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Are you sure you want to eject this vendor? This will remove their access immediately.")) {
                              handleStatusChange(selectedVendor.id, "ejected", "Administrative ejection");
                            }
                          }}
                          disabled={processingVendorId === selectedVendor.id}
                          className="gap-2"
                        >
                          <UserMinus className="w-4 h-4" />
                          Eject Vendor
                        </Button>
                      </>
                    )}

                    {(selectedVendor.status === "terminated" || selectedVendor.status === "rejected" || selectedVendor.status === "ejected") && (
                      <Button
                        type="button"
                        onClick={() => handleApprove(selectedVendor.id)}
                        disabled={processingVendorId === selectedVendor.id}
                        className="gap-2 bg-green-600 hover:bg-green-700"
                      >
                        Re-Approve Vendor
                      </Button>
                    )}
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

      {/* Vendor Chat Modal */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                    {chatVendor?.businessName?.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-lg">Chat with {chatVendor?.businessName}</DialogTitle>
                  <DialogDescription>
                    Direct support channel for this vendor
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col bg-muted/5">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {/* Mock messages for now */}
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg max-w-[80%] text-sm">
                    Hello, we have a question about our latest service submission.
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%] text-sm">
                    Hello! I'm reviewing it now. Could you please clarify the cancellation policy?
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input placeholder="Type a message to the vendor..." className="flex-1" />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default AdminDashboard;
