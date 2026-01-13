import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Facebook, Instagram, Twitter, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-navbar">
      {/* Top Bar with Social */}
      <div className="hidden md:block bg-foreground/95 text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-primary-foreground/70">
            <span>📞 +94 77 123 4567</span>
            <span>✉️ partners@lankapass.lk</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://facebook.com/lankapass" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://instagram.com/lankapass" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://twitter.com/lankapass" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-sunset flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-primary-foreground font-display font-bold text-xl">L</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">LankaPass</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors font-medium relative group">
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
            </a>
            <a href="#vendor-types" className="text-muted-foreground hover:text-foreground transition-colors font-medium relative group">
              Vendor Types
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
            </a>
            <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors font-medium relative group">
              Benefits
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors font-medium relative group">
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
            </a>
            <Link to="/vendor-dashboard">
              <Button variant="outline" size="sm">
                Vendor Login
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button variant="hero" size="lg">
                Become a Vendor
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <a
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#vendor-types"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Vendor Types
              </a>
              <a
                href="#benefits"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Benefits
              </a>
              <a
                href="#faq"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
              <Link to="/vendor-dashboard" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="lg" className="w-full">
                  Vendor Login
                </Button>
              </Link>
              <Link to="/onboarding" onClick={() => setIsMenuOpen(false)}>
                <Button variant="hero" size="lg" className="w-full">
                  Become a Vendor
                </Button>
              </Link>

              {/* Mobile Social Links */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-border">
                <a href="https://facebook.com/lankapass" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://instagram.com/lankapass" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://twitter.com/lankapass" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
