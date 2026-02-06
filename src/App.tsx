import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import VendorDashboard from "./pages/VendorDashboard";
import VendorLogin from "./pages/VendorLogin";
import VendorProfile from "./pages/VendorProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import VendorRegistrationSuccess from "./pages/VendorRegistrationSuccess";
import NotFound from "./pages/NotFound";
import LoadingScreen from "@/components/LoadingScreen";
import TestConnection from './components/TestConnection';


// Initialize QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// App content wrapped with AuthProvider
const AppContent = () => {
  const { user, loading, refreshUser } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth on app start
  useEffect(() => {
    const initAuth = async () => {
      await refreshUser();
      setIsInitialized(true);
    };
    initAuth();
  }, [refreshUser]);

  // Show loading screen while initializing
  if (!isInitialized || loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {/* Global Background with Glassmorphism */}
      <div
        className="site-background"
        style={{ backgroundImage: `url(${'/assets/site-background.jpg'})` }}
      />

      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/vendor-registration-success" element={<VendorRegistrationSuccess />} />

          {/* Authentication Routes */}
          <Route
            path="/vendor-login"
            element={
              !user ? (
                <VendorLogin />
              ) : (
                <Navigate to={['admin', 'manager'].includes(user.role) ? "/admin" : "/vendor-dashboard"} />
              )
            }
          />
          <Route
            path="/admin/login"
            element={
              !user ? (
                <AdminLogin />
              ) : (
                <Navigate to={['admin', 'manager'].includes(user.role) ? "/admin" : "/vendor-dashboard"} />
              )
            }
          />
          <Route
            path="/admin/register"
            element={
              !user ? <AdminRegister /> : <Navigate to="/admin" />
            }
          />

          {/* Protected Routes - Vendor Access */}
          <Route
            path="/vendor-dashboard"
            element={
              <ProtectedRoute loginPath="/vendor-login">
                <RoleBasedRoute allowedRoles={['vendor', 'admin']}>
                  <VendorDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor-profile"
            element={
              <ProtectedRoute loginPath="/vendor-login">
                <RoleBasedRoute allowedRoles={['vendor', 'admin']}>
                  <VendorProfile />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Admin Only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute loginPath="/admin/login">
                <RoleBasedRoute allowedRoles={['admin', 'manager']}>
                  <AdminDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

// Main App component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;