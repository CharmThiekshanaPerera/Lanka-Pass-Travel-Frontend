import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, Shield, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AdminRegister = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { toast } = useToast();
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Passwords mismatch",
                description: "Please make sure your passwords match.",
            });
            return;
        }

        setIsLoading(true);

        try {
            const result = await register(name, email, password, 'admin');
            if (result.success) {
                toast({
                    title: "Registration Successful",
                    description: "Admin account created successfully.",
                });
                navigate("/admin");
            } else {
                toast({
                    variant: "destructive",
                    title: "Registration Failed",
                    description: result.error || "Could not create admin account",
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Registration Error",
                description: "An unexpected error occurred.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative bg-slate-50/50">
            <Link
                to="/admin/login"
                className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors glass-navbar px-4 py-2 rounded-full"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
            </Link>

            <div className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                            <Shield className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            CeylonX
                        </h1>
                        <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">Admin Registration</p>
                    </div>
                </div>

                <Card className="glass-card border-0 shadow-2xl">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl font-bold">Create Admin Account</CardTitle>
                        <CardDescription>
                            Register a new administrator for the system
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-12"
                                        required
                                    />
                                </div>
                            </div>

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

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-12 pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-12"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold mt-4"
                                variant="hero"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating Account..." : "Register Administrator"}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Already have an account?{" "}
                            <Link
                                to="/admin/login"
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

export default AdminRegister;
