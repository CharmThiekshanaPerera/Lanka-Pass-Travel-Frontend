import { Mail, Phone } from "lucide-react";

const SupportContact = () => {
  return (
    <div className="bg-ocean-light rounded-xl p-4 border border-secondary/20">
      <p className="text-sm font-medium text-foreground mb-2">Need help?</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="mailto:partners@lankapass.lk"
          className="flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 transition-colors"
        >
          <Mail className="w-4 h-4" />
          partners@lankapass.lk
        </a>
        <a
          href="https://wa.me/94771234567"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 transition-colors"
        >
          <Phone className="w-4 h-4" />
          WhatsApp: +94 77 123 4567
        </a>
      </div>
    </div>
  );
};

export default SupportContact;
