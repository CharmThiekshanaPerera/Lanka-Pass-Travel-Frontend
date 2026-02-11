import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Loader2,
  MessageCircle,
  Image as ImageIcon,
  KeyRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ServicesList from "@/components/dashboard/ServicesList";
import BookingsTable from "@/components/dashboard/BookingsTable";
import EarningsOverview from "@/components/dashboard/EarningsOverview";
import CalendarView from "@/components/dashboard/CalendarView";
import ProfileForm from "@/components/dashboard/ProfileForm";
import MediaGallery from "@/components/dashboard/MediaGallery";
import SupportChatTab from "@/components/dashboard/SupportChat";
import { vendorService } from "@/services/vendorService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { chatService } from "@/services/chatService";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChangePasswordModal } from "@/components/auth/ChangePasswordModal";

const VendorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [vendorInfo, setVendorInfo] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [fullVendorData, setFullVendorData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate("/vendor-login");
      setShowLogoutConfirm(false);
      setIsLoggingOut(false);
    }, 2500);
  };

  const refreshData = async () => {
    try {
      const [profileRes, statsRes] = await Promise.all([
        vendorService.getVendorProfile(),
        vendorService.getVendorStats()
      ]);

      if (profileRes.success) {
        const v = profileRes.vendor;
        setFullVendorData(v);
        setVendorInfo({
          name: v.contact_person,
          businessName: v.business_name,
          email: v.email,
          avatar: "",
          status: v.status,
          memberSince: new Date(v.created_at).toLocaleString('default', { month: 'long', year: 'numeric' })
        });
        setServices(profileRes.services || []);
      }

      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (error) {
      console.error("Failed to refresh dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await chatService.getVendorUnreadCount();
      if (res.success) {
        setUnreadCount(res.unread_count);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  useEffect(() => {
    refreshData();
    fetchUnreadCount();

    // Poll for unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: User },
    { id: "services", label: "My Services", icon: Package },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "support", label: "Support", icon: MessageCircle },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!vendorInfo) {
    return <div>Error loading dashboard. Please log in again.</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-card border-r transform transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">L</span>
              </div>
              <div>
                <h1 className="font-semibold text-foreground">LankaPass</h1>
                <p className="text-xs text-muted-foreground">Vendor Portal</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                ${activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
              `}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center gap-3 px-4 py-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={vendorInfo.avatar} />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {vendorInfo.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{vendorInfo.name}</p>
              <p className="text-xs text-muted-foreground truncate">{vendorInfo.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {navItems.find(item => item.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {vendorInfo.name.split(' ')[0]}!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative"
                      onClick={() => setActiveTab("support")}
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{unreadCount > 0 ? `${unreadCount} unread messages` : "No unread messages"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowChangePassword(true)}>
                    <KeyRound className="h-4 w-4 mr-2" />
                    Change Password
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive font-medium" onClick={handleLogoutClick}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <DashboardStats stats={stats} serviceCount={services.length} />
            </div>
          )}

          {activeTab === "services" && <ServicesList services={services} onRefresh={refreshData} />}
          {activeTab === "media" && <MediaGallery vendorId={fullVendorData?.id} />}
          {activeTab === "support" && <SupportChatTab vendorId={fullVendorData?.id} />}
          {activeTab === "profile" && fullVendorData && (
            <div className="max-w-4xl mx-auto">
              <ProfileForm
                initialData={fullVendorData}
                onUpdate={() => {
                  toast.success("Profile updated successfully");
                  refreshData();
                }}
              />
            </div>
          )}
        </main>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={showChangePassword}
        onOpenChange={setShowChangePassword}
      />

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access your dashboard.
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
    </div>
  );
};

export default VendorDashboard;
