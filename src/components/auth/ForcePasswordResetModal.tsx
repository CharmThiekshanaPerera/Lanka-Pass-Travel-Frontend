import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { ShieldAlert, KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";

export const ForcePasswordResetModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const checkResetRequired = () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            // Rely on the backend flag which already filters by role
            if (user.requires_password_reset) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        }
    };

    useEffect(() => {
        checkResetRequired();

        // Periodically check or listen for storage events to be safe
        const interval = setInterval(checkResetRequired, 2000);
        window.addEventListener('storage', checkResetRequired);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', checkResetRequired);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        console.info("Force password reset submit", {
            hasCurrentPassword: currentPassword.length > 0,
        });
        setIsSubmitting(true);
        try {
            await authService.changePassword(password, currentPassword);
            toast.success("Password changed successfully! You can now access your dashboard.");
            setIsOpen(false);

            // Force reload or update auth state to be safe
            window.dispatchEvent(new Event('storage'));
        } catch (err: any) {
            console.error("Password change failed:", err);
            setError(err.message || "Failed to change password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-[425px] border-amber-200 bg-amber-50/50 backdrop-blur-md">
                <DialogHeader>
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <ShieldAlert className="w-6 h-6 text-amber-600" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-center text-amber-900">
                        Secure Your Account
                    </DialogTitle>
                    <DialogDescription className="text-center text-amber-800">
                        Your account was recently approved with a temporary password. For your security, please set a new permanent password before proceeding.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current (Temporary) Password</Label>
                        <div className="relative">
                            <Input
                                id="current-password"
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Paste the password from your email"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="pr-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                                disabled={isSubmitting}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-700"
                            >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Permanent Password</Label>
                        <div className="relative">
                            <Input
                                id="new-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Min 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pr-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                                disabled={isSubmitting}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-700"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                            id="confirm-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Repeat your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-md flex items-center gap-2">
                            <ShieldAlert size={14} />
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold h-12 gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Updating Security...
                            </>
                        ) : (
                            <>
                                <KeyRound size={18} />
                                Set New Password
                            </>
                        )}
                    </Button>
                </form>

                <p className="text-xs text-center text-amber-600">
                    This security measure helps protect your account data.
                </p>
            </DialogContent>
        </Dialog>
    );
};
