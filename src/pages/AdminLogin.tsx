import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                toast({
                    title: "Login Successful",
                    description: "Welcome to the Admin Panel",
                });

                // The user role check is handled in AuthContext/App, but we can double check here
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user.role === 'admin') {
                        navigate("/admin");
                    } else {
                        toast({
                            variant: "destructive",
                            title: "Access Denied",
                            description: "This portal is for administrators only.",
                        });
                        // Optional: Logout if they are not an admin but tried to login here
                    }
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: result.error || "Invalid email or password",
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Login Error",
                description: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative bg-slate-50/50">
            {/* Back to Home */}
            <Link
                to="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors glass-navbar px-4 py-2 rounded-full"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
            </Link>

            <div className="w-full max-w-md animate-fade-in">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                            <Shield className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            CeylonX
                        </h1>
                        <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">Admin Control Center</p>
                    </div>
                </div>

                {/* Login Card */}
                <Card className="glass-card border-0 shadow-2xl">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl font-bold">Admin Sign In</CardTitle>
                        <CardDescription>
                            Enter your credentials to access the management panel
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-4">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Admin Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@ceylonx.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-12"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your admin password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-12 pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold"
                                variant="hero"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Authenticating...
                                    </div>
                                ) : (
                                    "Access Panel"
                                )}
                            </Button>
                        </form>

                        {/* Registration Link (Only if needed, usually admins are created by other admins) */}
                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Need an admin account?{" "}
                            <Link
                                to="/admin/register"
                                className="text-primary font-semibold hover:underline"
                            >
                                Request Access
                            </Link>
                        </p>
                    </CardContent>
                </Card>

                {/* Footer Text */}
                <p className="text-center text-xs text-muted-foreground mt-6">
                    Access restricted to authorized personnel only.
                    <br /> All activities are logged and monitored.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
