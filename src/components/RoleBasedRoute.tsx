import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export const RoleBasedRoute = ({
  children,
  allowedRoles,
  redirectTo = "/"
}: RoleBasedRouteProps) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    // Show error toast if user is trying to access unauthorized route
    // We can't use useEffect here directly because we are returning Navigate immediately
    // Ideally we would wrap this or use a side effect before return, but React renders Navigate immediately.
    // However, Navigate is a component.
    // A better approach is to not return Navigate immediately, or accept that the toast might need to be fired in a useEffect before redirect, 
    // but that complicates render logic (render empty -> toast -> redirect).
    // Let's just render the Navigate, and rely on the new page to show errors? 
    // No, the user wants clarity *why* they were redirected.
    // Let's use a subtle trick: fire toast then redirect.
    // Actually, calling toast() is a side effect, fine to do in render phase? No, bad practice.
    // Let's use useEffect.
    return <AccessDeniedRedirect redirectTo={redirectTo} />;
  }

  return <>{children}</>;
};

const AccessDeniedRedirect = ({ redirectTo }: { redirectTo: string }) => {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      variant: "destructive",
      title: "Access Denied",
      description: "You do not have permission to view this page.",
    });
  }, [toast]);

  return <Navigate to={redirectTo} replace />;
};