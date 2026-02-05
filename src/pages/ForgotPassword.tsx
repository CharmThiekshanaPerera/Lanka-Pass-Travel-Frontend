import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { authService } from "@/services/authService";
import { toast } from "sonner";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await authService.forgotPassword(email);
            if (result.success) {
                setIsSubmitted(true);
                toast.success("Password reset email sent!");
            }
        } catch (error: any) {
            let message = "Failed to process request. Please check the email address.";
            const detail = error.response?.data?.detail;

            if (typeof detail === 'string') {
                message = detail;
            } else if (Array.isArray(detail)) {
                message = detail[0]?.msg || JSON.stringify(detail);
            } else if (detail && typeof detail === 'object') {
                message = JSON.stringify(detail);
            }

            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative">
                {/* Background */}
                <div
                    className="site-background"
                    style={{ backgroundImage: `url(${'/assets/site-background.jpg'})` }}
                />

                <div className="w-full max-w-md animate-fade-in relative z-10">
                    <Card className="glass-card border-0 shadow-2xl text-center p-6">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                        </div>
                        <CardHeader className="pt-0">
                            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
                            <CardDescription className="text-base mt-2">
                                We've sent a temporary password to <span className="font-semibold text-foreground">{email}</span>.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-sm text-muted-foreground">
                                Please check your inbox and use the temporary password to sign in.
                                You will be prompted to change it immediately for your security.
                            </p>
                            <Button
                                className="w-full h-12"
                                variant="hero"
                                onClick={() => navigate("/vendor-login")}
                            >
                                Back to Login
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
            {/* Background */}
            <div
                className="site-background"
                style={{ backgroundImage: `url(${'/assets/site-background.jpg'})` }}
            />

            {/* Back to Login */}
            <Link
                to="/vendor-login"
                className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors glass-navbar px-4 py-2 rounded-full z-20"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
            </Link>

            <div className="w-full max-w-md animate-fade-in relative z-10">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            LankaPass
                        </h1>
                        <p className="text-muted-foreground mt-1">Vendor Portal</p>
                    </Link>
                </div>

                <Card className="glass-card border-0 shadow-2xl">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
                        <CardDescription>
                            Enter your email and we'll send you a temporary password
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-4">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="vendor@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-12 h-12"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold"
                                variant="hero"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Sending...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground mt-8">
                            Remember your password?{" "}
                            <Link
                                to="/vendor-login"
                                className="text-primary font-semibold hover:underline"
                            >
                                Sign In
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
