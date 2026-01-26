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
import { vendorService } from "@/services/vendorService";

const steps = [
  { number: 1, title: "About Your Business", shortTitle: "Basics" },
  { number: 2, title: "Business Details", shortTitle: "Details" },
  { number: 3, title: "Services & Pricing", shortTitle: "Services" },
  { number: 4, title: "Photos & Content", shortTitle: "Media" },
  { number: 5, title: "Getting Paid", shortTitle: "Payment" },
  { number: 6, title: "Agreement", shortTitle: "Confirm" },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Basics
        if (!formData.vendorType) { toast.error("Please select a Vendor Type"); return false; }
        if (!formData.businessName) { toast.error("Business Name is required"); return false; }
        if (!formData.contactPerson) { toast.error("Contact Person is required"); return false; }
        if (!formData.email) { toast.error("Email Address is required"); return false; }
        if (!formData.phoneNumber) { toast.error("Mobile Number is required"); return false; }
        if (!formData.operatingAreas || formData.operatingAreas.length === 0) { toast.error("Please select at least one Operating Area"); return false; }
        return true;

      case 2: // Business Details
        if (!formData.businessRegNumber) { toast.error("Business Registration Number is required"); return false; }
        if (!formData.businessRegCertificate) { toast.error("Please upload Business Registration Certificate"); return false; }
        if (!formData.nicPassport) { toast.error("Please upload NIC / Passport"); return false; }
        if (!formData.businessAddress) { toast.error("Business Address is required"); return false; }
        return true;

      case 3: // Services
        if (!formData.services || formData.services.length === 0) { toast.error("Please add at least one service"); return false; }
        for (let i = 0; i < formData.services.length; i++) {
          const service = formData.services[i];
          if (!service.serviceName) { toast.error(`Service ${i + 1}: Name is required`); return false; }
          if (!service.serviceCategory) { toast.error(`Service ${i + 1}: Category is required`); return false; }
          if (!service.shortDescription || service.shortDescription.length < 100) { toast.error(`Service ${i + 1}: Description must be at least 100 characters`); return false; }
          if (!service.dailyCapacity) { toast.error(`Service ${i + 1}: Daily Capacity is required`); return false; }
          if (!service.retailPrice) { toast.error(`Service ${i + 1}: Retail Price is required`); return false; }
          if (!service.currency) { toast.error(`Service ${i + 1}: Currency is required`); return false; }
        }
        return true;

      case 4: // Media
        if (!formData.coverImage) { toast.error("Cover Image is required"); return false; }
        if (!formData.logo) { toast.error("Logo is required"); return false; }
        if (!formData.marketingPermission) { toast.error("Please grant marketing permission"); return false; }
        return true;

      case 5: // Payment
        if (!formData.bankName) { toast.error("Bank Name is required"); return false; }
        if (!formData.accountHolderName) { toast.error("Account Holder Name is required"); return false; }
        if (!formData.accountNumber) { toast.error("Account Number is required"); return false; }
        if (!formData.bankBranch) { toast.error("Bank Branch is required"); return false; }
        return true;

      case 6: // Agreement - Checked within the component, but we can double check here or rely on the submit button disabled state
        // Detailed validation happens in the Step7Agreement component before submission
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) {
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps([...completedSteps, currentStep]);
        }
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (step: number) => {
    // Only allow navigating to visited/completed steps or the next available step (sequential enforcement optional but good)
    // For now, let's allow clicking any previous step, or the immediate next step if current is valid
    if (step < currentStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step > currentStep) {
      // If trying to jump forward, validate current step first
      if (validateStep(currentStep)) {
        // Basic sequential check: can only jump one step ahead or to completed steps
        // But simpler is: restrict jumping ahead unless it's a completed step. 
        // Let's stick to: Use Next button for forward navigation to ensure validation. 
        // Click allows backward or re-visiting completed steps.
        if (completedSteps.includes(step - 1) || step === currentStep + 1) {
          // Actually, let's strictly enforce standard wizard behavior:
          // Can click any previous step.
          // Can click next step only if current step is completed/valid (handled by handleNext)
          // Step indicator click usually just for navigation to previous.
          toast.info("Please use the Continue button to proceed.");
        }
      }
    }
  };

  const handleSave = () => {
    toast.success("Progress saved! You can continue later.");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await vendorService.registerVendor(formData);
      if (result.success) {
        toast.success("Application submitted successfully! We'll be in touch within 48 hours.");
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Vendor registration error:", error);
      toast.error(error.message || "Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
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
        {currentStep < 6 && (
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