import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Facebook, Instagram, Twitter, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 flex justify-center ${scrolled ? "top-2 md:top-4" : "top-4 md:top-8"
        }`}
    >
      <div
        className={`w-full max-w-7xl transition-all duration-500 ease-in-out glass-navbar rounded-2xl md:rounded-full border border-white/20 shadow-elevated ${scrolled ? "px-6 py-2" : "px-8 py-3"
          } ${isMenuOpen ? "rounded-2xl" : ""}`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all">
              <span className="text-white font-display font-bold text-xl">L</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight">LankaPass</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-all font-medium relative group py-2">
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#vendor-types" className="text-muted-foreground hover:text-primary transition-all font-medium relative group py-2">
              Vendor Types
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#benefits" className="text-muted-foreground hover:text-primary transition-all font-medium relative group py-2">
              Benefits
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-primary transition-all font-medium relative group py-2">
              FAQ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </a>

            <div className="h-6 w-px bg-border/50 mx-2" />

            <Link to="/vendor-login">
              <Button variant="ghost" size="sm" className="font-semibold text-muted-foreground hover:text-primary">
                Login
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 rounded-full shadow-glow transform transition hover:scale-105 active:scale-95">
                Join Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-full transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 mt-2 border-t border-border/50 animate-fade-in space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <a
                href="#how-it-works"
                className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 text-muted-foreground font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#vendor-types"
                className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 text-muted-foreground font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Vendor Types
              </a>
              <a
                href="#benefits"
                className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 text-muted-foreground font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Benefits
              </a>
              <a
                href="#faq"
                className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 text-muted-foreground font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
              <Link to="/vendor-login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="lg" className="w-full rounded-xl">
                  Vendor Login
                </Button>
              </Link>
              <Link to="/onboarding" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg">
                  Become a Vendor
                </Button>
              </Link>
            </div>

            {/* Mobile Social Links */}
            <div className="flex items-center justify-center gap-6 pt-4">
              <a href="https://facebook.com/lankapass" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/lankapass" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/lankapass" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
