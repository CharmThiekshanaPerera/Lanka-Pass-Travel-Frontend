import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How long does the onboarding process take?",
    answer: "The initial application takes about 15-20 minutes to complete. Our team reviews submissions within 48 hours, and most vendors are approved within 3 business days.",
  },
  {
    question: "What documents do I need to register?",
    answer: "You'll need your business registration certificate, NIC or passport of the owner, and optionally your tourism license. For accommodations, a recent property photo is also required.",
  },
  {
    question: "What are the commission rates?",
    answer: "Our commission rates are competitive and transparent, typically ranging from 10-15% depending on your service category. There are no hidden fees or upfront costs.",
  },
  {
    question: "When and how do I receive payments?",
    answer: "Payouts are processed on a weekly or bi-weekly basis (your choice) directly to your bank account. We support all major Sri Lankan banks with secure, transparent transactions.",
  },
  {
    question: "Can I manage multiple services or locations?",
    answer: "Absolutely! Your vendor dashboard allows you to list multiple services, manage different locations, and set unique pricing and availability for each offering.",
  },
  {
    question: "What support is available for vendors?",
    answer: "We provide 24/7 email support, a dedicated WhatsApp line for urgent issues, and a comprehensive help center. Premium vendors also get access to a dedicated account manager.",
  },
];

const FAQ = () => {
  return (
    <section className="py-20 md:py-28 glass-section relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Header */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Everything you need to know about becoming a LankaPass vendor. 
              Can't find the answer you're looking for? Our team is here to help.
            </p>

            {/* Contact Card */}
            <div className="glass-card-strong p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Still have questions?</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Our partner success team is just a message away.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="default" size="sm">
                      Contact Support
                    </Button>
                    <Button variant="outline" size="sm">
                      WhatsApp Us
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Accordion */}
          <div>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="glass-card px-6 border-none data-[state=open]:shadow-elevated transition-shadow"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5 pl-8">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
