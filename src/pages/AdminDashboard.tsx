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
import { ScrollArea } from "@/components/ui/scroll-area";

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
  Bell,

  Send,
  Paperclip,
  Maximize2,
  ChevronRight,
  MoreVertical,
  FileDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { AdminChatModal } from "@/components/admin/AdminChatModal";
import { chatService, ChatSummary, UpdateRequest } from "@/services/chatService";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { generateVendorPDF } from "@/utils/generateVendorPDF";

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

  phoneVerified?: boolean;
  documents: {
    businessRegistration: string;
    nicPassport: string;
    tourismLicense: string;
  };
  rejectionReason?: string;
  adminNotes?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  galleryUrls?: string[];
  payoutFrequency?: string;
  payoutCycle?: string;
  payoutDate?: string;
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
  const [adminNotes, setAdminNotes] = useState("");

  // Manager Management State
  const [managers, setManagers] = useState<any[]>([]);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [newManager, setNewManager] = useState({ name: "", email: "", password: "" });
  const [isCreatingManager, setIsCreatingManager] = useState(false);
  const [processingVendorId, setProcessingVendorId] = useState<string | null>(null);
  const [updatingServiceId, setUpdatingServiceId] = useState<string | null>(null);
  const [commissionValues, setCommissionValues] = useState<{ [key: string]: string }>({});

  // Action Dialog State
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: 'reject' | 'terminate' | 'eject'; vendorId: string } | null>(null);
  const [actionReason, setActionReason] = useState("");


  // Chat & Notification State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatVendor, setChatVendor] = useState<VendorSubmission | null>(null);
  const [unreadCount, setUnreadCount] = useState(0); // Total unread chats
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0); // Pending update requests
  const [pendingRequests, setPendingRequests] = useState<UpdateRequest[]>([]); // Individual pending requests
  const [chatSummaries, setChatSummaries] = useState<ChatSummary[]>([]);
  const [isLoadingSummaries, setIsLoadingSummaries] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [targetRequestId, setTargetRequestId] = useState<string | null>(null);

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

  const fetchUnreadCount = async () => {
    try {
      // 1. Fetch unread chat messages
      const chatRes = await chatService.getUnreadCount();
      if (chatRes.success) {
        setUnreadCount(chatRes.unread_count);
      }

      // 2. Fetch pending update requests
      const requestsRes = await chatService.getPendingUpdateRequests();
      if (requestsRes.success) {
        setPendingRequestsCount(requestsRes.count || 0);
        setPendingRequests(requestsRes.requests || []);
      }
    } catch (error) {
      console.error("Failed to fetch admin counts:", error);
    }
  };

  const fetchChatSummaries = async () => {
    setIsLoadingSummaries(true);
    try {
      console.log("Fetching chat summaries...");
      const res = await chatService.getAdminChatSummary();
      console.log("Chat summaries response:", res);
      if (res.success) {
        setChatSummaries(res.summary);
      }
    } catch (error) {
      console.error("Failed to fetch chat summaries:", error);
    } finally {
      setIsLoadingSummaries(false);
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

          phoneVerified: v.phone_verified || false,
          documents: {
            businessRegistration: v.reg_certificate_url,
            nicPassport: v.nic_passport_url,
            tourismLicense: v.tourism_license_url,
          },
          rejectionReason: v.status_reason,
          adminNotes: v.admin_notes || "",
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

  // Combined polling for counts and summaries
  useEffect(() => {
    const handleRefresh = () => {
      fetchUnreadCount();
      if (activeTab === "support") {
        fetchChatSummaries();
      }
    };

    handleRefresh(); // Initial fetch

    const intervalTime = activeTab === "support" ? 10000 : 15000;
    const interval = setInterval(handleRefresh, intervalTime);

    return () => clearInterval(interval);
  }, [user, activeTab]);

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

  const totalActionableCount = unreadCount + pendingRequestsCount + stats.pending;

  const getPendingVendorIds = () => {
    const ids = new Set<string>();
    // Unread chats
    chatSummaries.forEach(s => { if (s.unread_count > 0) ids.add(s.vendor_id); });
    // Pending updates
    pendingRequests.forEach(r => ids.add(r.vendor_id));
    // New registrations
    vendors.filter(v => v.status === "pending").forEach(v => ids.add(v.id));
    return Array.from(ids);
  };

  const handleNextPending = () => {
    const pendingIds = getPendingVendorIds();
    if (pendingIds.length === 0) {
      setIsChatOpen(false);
      toast.success("All pending items reviewed!");
      return;
    }

    // Find current index
    const currentIndex = chatVendor ? pendingIds.indexOf(chatVendor.id) : -1;
    let nextIndex = (currentIndex + 1) % pendingIds.length;

    // If we've looped back to the same one and it's the only one, maybe close or just stay
    if (nextIndex === currentIndex && pendingIds.length === 1) {
      toast.info("This is the only pending item.");
      return;
    }

    const nextVendorId = pendingIds[nextIndex];
    const vendor = vendors.find(v => v.id === nextVendorId);

    if (vendor) {
      setChatVendor(vendor);
    } else {
      // If vendor not in main list, fetch from summary/request info
      const summary = chatSummaries.find(s => s.vendor_id === nextVendorId);
      const request = pendingRequests.find(r => r.vendor_id === nextVendorId);
      setChatVendor({
        id: nextVendorId,
        businessName: summary?.vendor_name || request?.requested_by_name || "Unknown Vendor",
        vendorType: "Vendor",
        email: "",
        contactPerson: "",
        status: "pending",
        submittedAt: ""
      } as any);
    }
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
            id: s.id,
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
            status: s.status // Ensure status is mapped
          })),
          bankBranch: fullVendor.bank_branch || vendor.bankBranch,
          adminNotes: fullVendor.admin_notes || vendor.adminNotes || "",
          pricing: services.map((s: any) => ({
            currency: s.currency,
            retailPrice: s.retail_price,
            netPrice: (s.retail_price * 0.85).toFixed(2),
            commission: s.commission_percent || 0, // Ensure commission is mapped if needed
            dailyCapacity: s.daily_capacity
          })),
        };
        setSelectedVendor(detailedVendor);
        setActiveDetailTab("overview");
        setRejectionReason("");
        setAdminNotes(detailedVendor.adminNotes || "");
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

  const handleStatusChange = async (vendorId: string, status: string, reason?: string, notes?: string) => {
    try {
      setProcessingVendorId(vendorId);
      // Use the provided notes, or fallback to the state if available and matching vendor
      const notesToSend = notes !== undefined ? notes : (selectedVendor?.id === vendorId ? adminNotes : undefined);

      await vendorService.updateVendorStatus(vendorId, status, reason, notesToSend);
      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorId ? { ...v, status: status, rejectionReason: reason, adminNotes: notesToSend || v.adminNotes } : v
        )
      );
      if (selectedVendor && selectedVendor.id === vendorId) {
        setSelectedVendor({ ...selectedVendor, status: status, rejectionReason: reason, adminNotes: notesToSend || selectedVendor.adminNotes });
      }
      toast.success(`Vendor status updated to ${status}`);
      fetchVendors();
    } catch (error: any) {
      toast.error(error.message || "Failed to update vendor status");
    } finally {
      setProcessingVendorId(null);
    }
  };

  const handleServiceStatusChange = async (serviceId: string, status: string) => {
    try {
      await vendorService.updateServiceStatus(serviceId, status);
      toast.success(`Service status updated to ${status}`);

      // Send notification to vendor
      if (selectedVendor) {
        try {
          const service = selectedVendor.services.find((s: any) => s.id === serviceId);
          const serviceName = service?.serviceName || "Service";
          await chatService.sendMessage(selectedVendor.id, `Your service "${serviceName}" status has been updated to: ${status.toUpperCase()}`);
        } catch (msgError) {
          console.error("Failed to send status notification", msgError);
        }

        // Refresh current vendor details
        handleViewDetails(selectedVendor);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update service status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "active":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "freeze":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <Ban className="w-3 h-3 mr-1" />
            Freeze
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative"
                      onClick={() => setActiveTab("support")}
                    >
                      <Bell className="w-5 h-5" />
                      {totalActionableCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs space-y-1">
                      {unreadCount > 0 && <p>• {unreadCount} unread messages</p>}
                      {pendingRequestsCount > 0 && <p>• {pendingRequestsCount} profile update requests</p>}
                      {stats.pending > 0 && <p>• {stats.pending} new registrations</p>}
                      {totalActionableCount === 0 && <p>No new notifications</p>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button variant="outline" size="sm" className="gap-2" onClick={handleLogoutClick}>
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="support" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Notifications
              {totalActionableCount > 0 && (
                <Badge className="ml-1 bg-red-500 hover:bg-red-600 px-1.5 py-0 min-w-[1.25rem] h-5">
                  {totalActionableCount}
                </Badge>
              )}
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewDetails(vendor)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setChatVendor(vendor);
                                  setIsChatOpen(true);
                                }}
                              >
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Message
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedVendor(vendor);
                                  setAdminNotes(vendor.adminNotes || "");
                                  // Open a specific notes dialog - assuming we reuse detail or new one
                                  // For now, let's open details and switch to notes if possible, or build a specific one.
                                  // User asked for "keep a text field open when in same thee dots"
                                  // I'll implement a separate dialog for this below and open it here
                                  setProcessingVendorId("NOTES-" + vendor.id);
                                }}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Admin Notes
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={async () => {
                                  try {
                                    // Fetch full vendor details first
                                    const response = await vendorService.getVendor(vendor.id);
                                    if (response.success) {
                                      const fullVendor = response.vendor;
                                      const services = response.services || [];
                                      const detailedVendor = {
                                        ...vendor,
                                        services: services.map((s: any) => ({
                                          id: s.id,
                                          serviceName: s.service_name,
                                          serviceCategory: s.service_category,
                                          shortDescription: s.short_description,
                                          durationValue: s.duration_value,
                                          durationUnit: s.duration_unit,
                                          groupSizeMin: s.group_size_min,
                                          groupSizeMax: s.group_size_max,
                                          retailPrice: s.retail_price,
                                          currency: s.currency,
                                          imageUrls: s.image_urls || [],
                                          languagesOffered: s.languages_offered || [],
                                          operatingDays: s.operating_days || [],
                                          whatsIncluded: s.whats_included || '',
                                          whatsNotIncluded: s.whats_not_included || '',
                                          cancellationPolicy: s.cancellation_policy || '',
                                          advanceBooking: s.advance_booking || 'N/A',
                                          operatingHoursFrom: s.operating_hours_from,
                                          operatingHoursFromPeriod: s.operating_hours_from_period,
                                          operatingHoursTo: s.operating_hours_to,
                                          operatingHoursToPeriod: s.operating_hours_to_period,
                                          status: s.status
                                        })),
                                        pricing: services.map((s: any) => ({
                                          currency: s.currency,
                                          retailPrice: s.retail_price,
                                          netPrice: (s.retail_price * 0.85).toFixed(2),
                                          commission: s.commission_percent || 0,
                                          dailyCapacity: s.daily_capacity
                                        })),
                                      };
                                      generateVendorPDF(detailedVendor as any);
                                      toast.success('PDF generated successfully!');
                                    }
                                  } catch (error) {
                                    toast.error('Failed to generate PDF');
                                  }
                                }}
                              >
                                <FileDown className="mr-2 h-4 w-4" />
                                Generate Document
                              </DropdownMenuItem>
                              <Separator className="my-1" />
                              {vendor.status !== "approved" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(vendor.id, "approved")}>
                                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                  Approve
                                </DropdownMenuItem>
                              )}
                              {vendor.status !== "freeze" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(vendor.id, "freeze")}>
                                  <Ban className="mr-2 h-4 w-4 text-amber-500" />
                                  Freeze
                                </DropdownMenuItem>
                              )}
                              {vendor.status === "freeze" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(vendor.id, "active")}>
                                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                  Unfreeze (Active)
                                </DropdownMenuItem>
                              )}
                              {vendor.status !== "terminated" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(vendor.id, "terminated")} className="text-red-600">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Terminate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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

          <TabsContent value="support">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notifications Center
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="updates" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="updates" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Updates
                      {pendingRequestsCount > 0 && (
                        <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700 px-1.5 py-0">
                          {pendingRequestsCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="registrations" className="gap-2">
                      <UserPlus className="w-4 h-4" />
                      Registrations
                      {stats.pending > 0 && (
                        <Badge variant="secondary" className="ml-1 bg-yellow-100 text-yellow-700 px-1.5 py-0">
                          {stats.pending}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="chats" className="gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Chats
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-1 px-1.5 py-0">
                          {unreadCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="updates" className="space-y-4">
                    {pendingRequests.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted">
                        <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">No pending profile updates.</p>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {pendingRequests.map((req) => (
                          <div
                            key={req.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 hover:bg-blue-500/10 cursor-pointer transition-all gap-4"
                            onClick={() => {
                              const vendor = vendors.find(v => v.id === req.vendor_id);
                              setChatVendor(vendor || { id: req.vendor_id, businessName: req.requested_by_name, vendorType: "Vendor" } as any);
                              setTargetRequestId(req.id);
                              setIsChatOpen(true);
                            }}
                          >
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                              <Avatar className="w-10 h-10 border-2 border-background flex-shrink-0">
                                <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                                  {req.requested_by_name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground break-words">Update: {req.requested_by_name}</p>
                                <p className="text-sm text-muted-foreground whitespace-normal break-words mt-1">
                                  {req.changed_fields.length} change{req.changed_fields.length !== 1 ? 's' : ''} requested across profile fields.
                                </p>
                                <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-tighter">
                                  ID: {req.id.substring(0, 8)}...
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-1 self-end sm:self-center shrink-0">
                              Review <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="registrations" className="space-y-4">
                    {vendors.filter(v => v.status === "pending").length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted">
                        <UserPlus className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">No pending registrations.</p>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {vendors.filter(v => v.status === "pending").map((vendor) => (
                          <div
                            key={vendor.id}
                            onClick={() => handleViewDetails(vendor)}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 hover:bg-yellow-500/10 cursor-pointer transition-all gap-4"
                          >
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                              <Avatar className="w-10 h-10 border-2 border-background flex-shrink-0">
                                <AvatarFallback className="bg-yellow-100 text-yellow-700 font-medium">
                                  {vendor.businessName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground break-words">{vendor.businessName}</p>
                                <p className="text-sm text-muted-foreground whitespace-normal break-words mt-1">
                                  New registration waiting for approval.
                                </p>
                                <p className="text-[10px] text-muted-foreground/60 mt-1">
                                  Submitted: {vendor.submittedAt}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-1 self-end sm:self-center shrink-0">
                              View Submission <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="chats" className="space-y-4">
                    {isLoadingSummaries ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading conversations...</p>
                      </div>
                    ) : chatSummaries.filter(chat => chat.unread_count > 0).length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed rounded-xl border-muted">
                        <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">No unread messages.</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {chatSummaries.filter(chat => chat.unread_count > 0).map((chat) => (
                          <div
                            key={chat.vendor_id}
                            onClick={() => {
                              const vendor = vendors.find(v => v.id === chat.vendor_id);
                              setChatVendor(vendor || { id: chat.vendor_id, businessName: chat.vendor_name, vendorType: "Vendor" } as any);
                              setIsChatOpen(true);
                            }}
                            className={`
                              group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border
                              ${chat.unread_count > 0 ? "bg-primary/5 hover:bg-primary/10 border-primary/20" : "hover:bg-muted/50 border-transparent"}
                            `}
                          >
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                              <div className="relative flex-shrink-0">
                                <Avatar className="w-12 h-12 border-2 border-background">
                                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                    {chat.vendor_name.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                {chat.unread_count > 0 && (
                                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-background text-[10px] font-bold text-white flex items-center justify-center">
                                      {chat.unread_count}
                                    </span>
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <h4 className="font-bold text-foreground break-words group-hover:text-primary transition-colors">
                                    {chat.vendor_name}
                                  </h4>
                                  <span className="text-[10px] text-muted-foreground shrink-0 uppercase">
                                    {new Date(chat.latest_message.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className={`text-sm whitespace-normal break-words leading-tight ${chat.unread_count > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                  {chat.latest_message.sender === "admin" ? <span className="opacity-60 italic">You: </span> : ""}
                                  {chat.latest_message.message}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-center shrink-0 hidden sm:flex"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
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
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedVendor.status)}
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            generateVendorPDF(selectedVendor as any);
                            toast.success('PDF generated successfully!');
                          }}
                          className="gap-2"
                        >
                          <FileDown className="w-4 h-4" />
                          Generate Document
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
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
                <TabsContent value="overview" className="space-y-4 mt-4 overflow-x-hidden">
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

                  {/* Admin Notes Section */}
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Admin Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Add private notes about this vendor..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="min-h-[100px] bg-background"
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(selectedVendor.id, selectedVendor.status)}
                          disabled={processingVendorId === selectedVendor.id}
                        >
                          {processingVendorId === selectedVendor.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Notes"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

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
                <TabsContent value="services" className="space-y-4 mt-4 overflow-x-hidden">
                  {selectedVendor.services.map((service: any, index) => (
                    <Card key={index} className={service.status === 'freeze' ? 'opacity-75 border-amber-200 bg-amber-50' : ''}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex gap-2 mb-2">
                              <Badge>{service.serviceCategory}</Badge>
                              {getStatusBadge(service.status || 'pending')}
                            </div>
                            <CardTitle className="text-lg">{service.serviceName}</CardTitle>
                          </div>
                          <div className="flex flex-col items-end gap-2">
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
                            <Select
                              value={service.status || "pending"}
                              onValueChange={(val) => handleServiceStatusChange(service.id, val)}
                            >
                              <SelectTrigger className="w-[130px] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="freeze">Freeze</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm">
                        <p className="text-muted-foreground whitespace-pre-wrap break-all">{service.shortDescription}</p>

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">What's Included</p>
                            <p className="text-green-600 whitespace-pre-wrap break-all">{service.whatsIncluded}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">What's Not Included</p>
                            <p className="text-red-500 whitespace-pre-wrap break-all">{service.whatsNotIncluded}</p>
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
                          <p className="whitespace-pre-wrap break-all">{service.cancellationPolicy}</p>
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
                <TabsContent value="documents" className="space-y-4 mt-4 overflow-x-hidden">
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
                <TabsContent value="payment" className="space-y-4 mt-4 overflow-x-hidden">
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
                      <div className="overflow-x-auto">
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
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              {(isAdmin || isManager) && (
                <div className="mt-6 pt-4 border-t space-y-4">


                  {selectedVendor.status === "approved" && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleStatusChange(selectedVendor.id, "pending")}
                        disabled={processingVendorId === selectedVendor.id}
                      >
                        Reset to Pending
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setActionReason("");
                          setPendingAction({ type: 'terminate', vendorId: selectedVendor.id });
                          setReasonDialogOpen(true);
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
                          setActionReason("");
                          setPendingAction({ type: 'eject', vendorId: selectedVendor.id });
                          setReasonDialogOpen(true);
                        }}
                        disabled={processingVendorId === selectedVendor.id}
                        className="gap-2"
                      >
                        <UserMinus className="w-4 h-4" />
                        Eject Vendor
                      </Button>
                      <div className="flex-1" />
                      <Button
                        type="button"
                        onClick={() => handleStatusChange(selectedVendor.id, "active")}
                        disabled={processingVendorId === selectedVendor.id}
                        className="gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Activate Vendor
                      </Button>
                    </div>
                  )}

                  {selectedVendor.status === "pending" && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setActionReason("");
                          setPendingAction({ type: 'reject', vendorId: selectedVendor.id });
                          setReasonDialogOpen(true);
                        }}
                        disabled={processingVendorId === selectedVendor.id}
                        className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject Application
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleStatusChange(selectedVendor.id, "approved")}
                        disabled={processingVendorId === selectedVendor.id}
                        className="gap-2 bg-primary hover:bg-primary/90"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve & Onboard
                      </Button>
                    </>
                  )}


                  {selectedVendor.status === "active" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleStatusChange(selectedVendor.id, "freeze")}
                      disabled={processingVendorId === selectedVendor.id}
                      className="gap-2 text-amber-600 border-amber-200 hover:bg-amber-50"
                    >
                      <Ban className="w-4 h-4" />
                      Freeze Vendor
                    </Button>
                  )}

                  {selectedVendor.status === "freeze" && (
                    <Button
                      type="button"
                      onClick={() => handleStatusChange(selectedVendor.id, "active")}
                      disabled={processingVendorId === selectedVendor.id}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Unfreeze / Activate
                    </Button>
                  )}

                  {(selectedVendor.status === "terminated" || selectedVendor.status === "rejected" || selectedVendor.status === "ejected") && (
                    <Button
                      type="button"
                      onClick={() => handleStatusChange(selectedVendor.id, "pending")}
                      disabled={processingVendorId === selectedVendor.id}
                      className="gap-2"
                    >
                      Move to Pending (Re-evaluate)
                    </Button>
                  )}
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

      {/* Reason Dialog */}
      <Dialog open={reasonDialogOpen} onOpenChange={setReasonDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {pendingAction?.type === 'reject' && 'Reject Vendor'}
              {pendingAction?.type === 'terminate' && 'Terminate Vendor'}
              {pendingAction?.type === 'eject' && 'Eject Vendor'}
            </DialogTitle>
            <DialogDescription>
              {pendingAction?.type === 'reject' && 'Please provide a reason for rejecting this vendor submission.'}
              {pendingAction?.type === 'terminate' && 'Please provide a reason for terminating this vendor.'}
              {pendingAction?.type === 'eject' && 'Please provide a reason for ejecting this vendor. This action is immediate.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter reason..."
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setReasonDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={pendingAction?.type === 'reject' || pendingAction?.type === 'terminate' ? 'destructive' : 'default'}
              className={pendingAction?.type === 'terminate' ? 'bg-orange-600 hover:bg-orange-700 text-white' : ''}
              onClick={() => {
                if (!pendingAction || !pendingAction.vendorId) return;

                if (!actionReason.trim()) {
                  toast.error("Please provide a reason");
                  return;
                }

                if (pendingAction.type === 'reject') {
                  const handleRejectAction = async () => {
                    try {
                      setProcessingVendorId(pendingAction.vendorId);
                      setReasonDialogOpen(false);
                      await vendorService.updateVendorStatus(pendingAction.vendorId, "rejected", actionReason);
                      setVendors((prev) =>
                        prev.map((v) =>
                          v.id === pendingAction.vendorId ? { ...v, status: "rejected", rejectionReason: actionReason } : v
                        )
                      );
                      if (selectedVendor && selectedVendor.id === pendingAction.vendorId) {
                        setSelectedVendor({ ...selectedVendor, status: "rejected", rejectionReason: actionReason });
                      }
                      toast.success("Vendor rejected.");
                      fetchVendors();
                    } catch (error: any) {
                      toast.error(error.message || "Failed to reject vendor");
                    } finally {
                      setProcessingVendorId(null);
                    }
                  }
                  handleRejectAction();
                } else {
                  setReasonDialogOpen(false);
                  handleStatusChange(pendingAction.vendorId, pendingAction.type === 'terminate' ? 'terminated' : 'ejected', actionReason);
                }
              }}
            >
              Confirm {pendingAction?.type === 'reject' ? 'Rejection' : pendingAction?.type === 'terminate' ? 'Termination' : 'Ejection'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AdminChatModal
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          fetchUnreadCount();
          if (activeTab === "support") {
            fetchChatSummaries();
          }
        }}
        vendorId={chatVendor?.id || null}
        businessName={chatVendor?.businessName || "Vendor"}
        vendorType={chatVendor?.vendorType || "Unknown"}
        logoUrl={chatVendor?.logoUrl}
        onAction={fetchUnreadCount}
        onNextPending={getPendingVendorIds().length > 0 ? handleNextPending : undefined}
        hasMorePending={getPendingVendorIds().length > 1}
        targetRequestId={targetRequestId || undefined}
      />
      {/* Admin Notes Dialog */}
      <Dialog
        open={!!processingVendorId && processingVendorId.startsWith("NOTES-")}
        onOpenChange={(open) => {
          if (!open) {
            setProcessingVendorId(null);
            setSelectedVendor(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Notes</DialogTitle>
            <DialogDescription>
              Add or edit notes for {selectedVendor?.businessName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Enter admin notes here..."
              className="min-h-[150px]"
            />
            <Button
              onClick={async () => {
                if (selectedVendor) {
                  const realId = processingVendorId?.replace("NOTES-", "") || selectedVendor.id;
                  await handleStatusChange(realId, selectedVendor.status, selectedVendor.rejectionReason, adminNotes);
                  setProcessingVendorId(null);
                }
              }}
              className="w-full"
            >
              Save Notes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
