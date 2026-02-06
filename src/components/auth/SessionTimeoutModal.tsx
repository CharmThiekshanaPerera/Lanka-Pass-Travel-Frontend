import React, { useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/supabaseService';
import { useAuth } from '@/contexts/AuthContext';

export const SessionTimeoutModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const handleSessionExpired = () => {
            // Avoid showing multiple times or if already on login page
            if (!isOpen && !window.location.pathname.includes('/onboarding')) {
                setIsOpen(true);
            }
        };

        window.addEventListener('auth:session-expired', handleSessionExpired);
        return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
    }, [isOpen]);

    const handleLogin = () => {
        setIsOpen(false);
        logout();
        navigate('/onboarding');
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className="max-w-[400px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-amber-900">Session Timed Out</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                        Your login session has expired for security reasons. Please login again to continue your work.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={handleLogin}
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                        Login Again
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
