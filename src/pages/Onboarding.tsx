import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";
import StepIndicator from "@/components/onboarding/StepIndicator";
import Step1VendorBasics from "@/components/onboarding/Step1VendorBasics";
import Step2BusinessDetails from "@/components/onboarding/Step2BusinessDetails";
import Step3ServiceDetails from "@/components/onboarding/Step3ServiceDetails";
// Step4 removed - merged into Step3
import Step5MediaContent from "@/components/onboarding/Step5MediaContent";
import Step6PaymentDetails from "@/components/onboarding/Step6PaymentDetails";
import Step7Agreement from "@/components/onboarding/Step7Agreement";

const steps = [
  { number: 1, title: "About Your Business", shortTitle: "Basics" },
  { number: 2, title: "Business Details", shortTitle: "Details" },
  { number: 3, title: "Services & Pricing", shortTitle: "Services" }, // Updated title
  { number: 4, title: "Photos & Content", shortTitle: "Media" }, // Renumbered
  { number: 5, title: "Getting Paid", shortTitle: "Payment" }, // Renumbered
  { number: 6, title: "Agreement", shortTitle: "Confirm" }, // Renumbered
  // Removed the old step 7 (was step 7, now we have 6 total steps)
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 6) { // Changed from 7 to 6
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = () => {
    toast.success("Progress saved! You can continue later.");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    toast.success("Application submitted successfully! We'll be in touch within 48 hours.");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1VendorBasics formData={formData} updateFormData={updateFormData} />;
      case 2: return <Step2BusinessDetails formData={formData} updateFormData={updateFormData} />;
      case 3: return <Step3ServiceDetails formData={formData} updateFormData={updateFormData} />;
      case 4: return <Step5MediaContent formData={formData} updateFormData={updateFormData} />; // Step5 becomes Step4
      case 5: return <Step6PaymentDetails formData={formData} updateFormData={updateFormData} />; // Step6 becomes Step5
      case 6: return <Step7Agreement formData={formData} updateFormData={updateFormData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />; // Step7 becomes Step6
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-sunset flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">L</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">LankaPass</span>
            </Link>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save & Continue Later
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Step Indicator */}
        <div className="mb-10">
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            completedSteps={completedSteps}
          />
        </div>

        {/* Step Content */}
        <div className="bg-card rounded-2xl shadow-card p-6 md:p-10">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 6 && ( // Changed from 7 to 6
          <div className="flex justify-between mt-8">
            <Button variant="back" size="lg" onClick={handleBack} disabled={currentStep === 1}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button variant="next" size="lg" onClick={handleNext}>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Onboarding;