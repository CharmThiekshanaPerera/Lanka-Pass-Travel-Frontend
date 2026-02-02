import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Send,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/lankapass", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/lankapass", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com/lankapass", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com/lankapass", label: "YouTube" },
  { icon: Linkedin, href: "https://linkedin.com/company/lankapass", label: "LinkedIn" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground/95 backdrop-blur-xl text-primary-foreground relative overflow-hidden">
      {/* Wave Decoration */}
      <div className="absolute top-0 left-0 right-0 z-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full rotate-180">
          <path
            d="M0 30L60 25C120 20 240 10 360 15C480 20 600 40 720 45C840 50 960 40 1080 35C1200 30 1320 30 1380 30L1440 30V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0V30Z"
            className="fill-background"
          />
        </svg>
      </div>

      {/* Newsletter Section */}
      <div className="pt-24 pb-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary via-ocean to-secondary rounded-[2.5rem] p-8 md:p-12 -mt-32 relative z-20 shadow-elevated border border-white/10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                  Stay Updated
                </h3>
                <p className="text-primary-foreground/80">
                  Get the latest news, tips, and vendor success stories delivered to your inbox.
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-card/20 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-white"
                />
                <Button className="bg-card text-foreground hover:bg-card/90 px-6">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg">
                <span className="text-white font-display font-bold text-xl">L</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight">LankaPass</span>
            </Link>
            <p className="text-primary-foreground/70 leading-relaxed mb-6">
              Connecting travelers with authentic Sri Lankan experiences.
              Your gateway to unforgettable adventures.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#how-it-works" className="text-primary-foreground/70 hover:text-primary-foreground hover:translate-x-1 transition-all inline-flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  How It Works
                </a>
              </li>
              <li>
                <a href="#vendor-types" className="text-primary-foreground/70 hover:text-primary-foreground hover:translate-x-1 transition-all inline-flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Vendor Types
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-primary-foreground/70 hover:text-primary-foreground hover:translate-x-1 transition-all inline-flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Benefits
                </a>
              </li>
              <li>
                <Link to="/onboarding" className="text-primary-foreground/70 hover:text-primary-foreground hover:translate-x-1 transition-all inline-flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link to="/vendor-dashboard" className="text-primary-foreground/70 hover:text-primary-foreground hover:translate-x-1 transition-all inline-flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Vendor Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Partner Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-primary-foreground/70 group">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>partners@lankapass.lk</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70 group">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+94 77 123 4567</span>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/70 group">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>42 Galle Face Terrace,<br />Colombo 03, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/50 text-sm">
              © {new Date().getFullYear()} LankaPass. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-primary-foreground/50">
              <a href="#" className="hover:text-primary-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
