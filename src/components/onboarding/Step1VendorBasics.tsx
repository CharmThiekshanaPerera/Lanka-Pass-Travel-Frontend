import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SupportContact from "./SupportContact";
import { useState, useEffect } from "react";
import { CheckCircle2, RefreshCw } from "lucide-react";

interface Step1Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const vendorTypes = [
  "Accommodation",
  "Tours & Experiences",
  "Food & Dining",
  "Transportation",
  "Photography",
  "Wellness & Spa",
  "Adventure Sports",
  "Cultural Experience",
  "Merchant",
  "Other",
];

const operatingAreas = [
  "Colombo",
  "Galle",
  "Kandy",
  "Negombo",
  "Ella",
  "Sigiriya",
  "Trincomalee",
  "Jaffna",
  "Mirissa",
  "Hikkaduwa",
  "Nuwara Eliya",
  "Bentota",
  "Arugam Bay",
  "Dambulla",
  "Polonnaruwa",
  "Other",
];

const countryCodes = [
  { code: "+94", country: "🇱🇰 Sri Lanka" },
  { code: "+1", country: "🇺🇸 USA" },
  { code: "+44", country: "🇬🇧 UK" },
  { code: "+91", country: "🇮🇳 India" },
  { code: "+61", country: "🇦🇺 Australia" },
  { code: "+49", country: "🇩🇪 Germany" },
  { code: "+33", country: "🇫🇷 France" },
  { code: "+971", country: "🇦🇪 UAE" },
];

const Step1VendorBasics = ({ formData, updateFormData }: Step1Props) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationError, setVerificationError] = useState("");

  const handleAreaToggle = (area: string) => {
    const current = formData.operatingAreas || [];
    const updated = current.includes(area)
      ? current.filter((a: string) => a !== area)
      : [...current, area];
    updateFormData("operatingAreas", updated);
  };

  // Handle resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Check if mobile number is valid for verification
  const isMobileNumberValid = () => {
    const mobileNumber = formData.mobileNumber || "";
    const countryCode = formData.countryCode || "+94";
    
    // Basic validation: at least 9 digits for most countries, adjust as needed
    const minLength = countryCode === "+1" ? 10 : 9;
    return mobileNumber.length >= minLength;
  };

  const handleSendVerification = () => {
    if (!isMobileNumberValid()) {
      setVerificationError("Please enter a valid mobile number");
      return;
    }

    setVerificationError("");
    setIsVerifying(true);
    setResendCooldown(30); // 30 seconds cooldown
    
    // Simulate API call to send OTP
    console.log("Sending OTP to:", formData.countryCode + formData.mobileNumber);
    
    // In a real app, you would make an API call here:
    // await sendOtp(formData.countryCode + formData.mobileNumber);
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0) return;
    
    setVerificationError("");
    setResendCooldown(30);
    
    // Simulate API call to resend OTP
    console.log("Resending OTP to:", formData.countryCode + formData.mobileNumber);
    
    // In a real app, you would make an API call here:
    // await resendOtp(formData.countryCode + formData.mobileNumber);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      setVerificationError("OTP must be 6 digits");
      return;
    }

    setVerificationError("");
    
    // Simulate API call to verify OTP
    console.log("Verifying OTP:", otp);
    
    // In a real app, you would make an API call here:
    // const isValid = await verifyOtp(formData.countryCode + formData.mobileNumber, otp);
    
    // For demo purposes, assume OTP is valid if it's 6 digits and the last digit is not 0
    const isValid = otp.length === 6 && otp.charAt(5) !== '0';
    
    if (isValid) {
      updateFormData("mobileVerified", true);
      setIsVerifying(false);
      setOtp("");
    } else {
      setVerificationError("Invalid OTP. Please try again.");
    }
  };

  const handleCancelVerification = () => {
    setIsVerifying(false);
    setOtp("");
    setVerificationError("");
    updateFormData("mobileVerified", false);
  };

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    updateFormData("mobileNumber", value);
    
    // Reset verification if mobile number changes
    if (formData.mobileVerified) {
      updateFormData("mobileVerified", false);
    }
    if (isVerifying) {
      setIsVerifying(false);
      setOtp("");
    }
    setVerificationError("");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          About Your Business
        </h2>
        <p className="text-muted-foreground">
          Let's get to know you! Tell us who you are, where you're located, and how we can reach you.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Vendor Type */}
        <div className="space-y-2">
          <Label htmlFor="vendorType" className="text-sm font-medium">
            Vendor Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.vendorType || ""}
            onValueChange={(value) => updateFormData("vendorType", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select your vendor type" />
            </SelectTrigger>
            <SelectContent>
              {vendorTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.vendorType === "Other" && (
            <Input
              placeholder="Please specify your vendor type"
              value={formData.vendorTypeOther || ""}
              onChange={(e) => updateFormData("vendorTypeOther", e.target.value)}
              className="mt-2"
            />
          )}
        </div>

        {/* Business / Display Name */}
        <div className="space-y-2">
          <Label htmlFor="businessName" className="text-sm font-medium">
            Business / Display Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="businessName"
            placeholder="The name travelers will see"
            value={formData.businessName || ""}
            onChange={(e) => updateFormData("businessName", e.target.value)}
          />
        </div>

        {/* Legal Entity Name */}
        <div className="space-y-2">
          <Label htmlFor="legalName" className="text-sm font-medium">
            Legal Entity Name
          </Label>
          <Input
            id="legalName"
            placeholder="If different from display name"
            value={formData.legalName || ""}
            onChange={(e) => updateFormData("legalName", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Leave blank if same as business name
          </p>
        </div>

        {/* Primary Contact Person */}
        <div className="space-y-2">
          <Label htmlFor="contactPerson" className="text-sm font-medium">
            Primary Contact Person <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contactPerson"
            placeholder="Full name of the contact person"
            value={formData.contactPerson || ""}
            onChange={(e) => updateFormData("contactPerson", e.target.value)}
          />
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email || ""}
            onChange={(e) => updateFormData("email", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            We'll send a verification link to confirm
          </p>
        </div>

        {/* City / Operating Areas */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            City / Operating Areas <span className="text-destructive">*</span>
          </Label>
          <p className="text-xs text-muted-foreground">
            Select all cities where you offer services
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {operatingAreas.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => handleAreaToggle(area)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  (formData.operatingAreas || []).includes(area)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
          {(formData.operatingAreas || []).includes("Other") && (
            <Textarea
              placeholder="Please list other cities or areas"
              value={formData.operatingAreasOther || ""}
              onChange={(e) => updateFormData("operatingAreasOther", e.target.value)}
              className="mt-2"
              rows={2}
            />
          )}
        </div>

        {/* Mobile Number with Country Code */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Mobile Number <span className="text-destructive">*</span>
            </Label>
            {formData.mobileVerified && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Select
              value={formData.countryCode || "+94"}
              onValueChange={(value) => {
                updateFormData("countryCode", value);
                // Reset verification if country code changes
                if (formData.mobileVerified) {
                  updateFormData("mobileVerified", false);
                }
                if (isVerifying) {
                  setIsVerifying(false);
                  setOtp("");
                }
              }}
            >
              <SelectTrigger className="w-[160px] h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((item) => (
                  <SelectItem key={item.code} value={item.code}>
                    {item.country} {item.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1 flex gap-2">
              <Input
                type="tel"
                placeholder="Mobile number"
                value={formData.mobileNumber || ""}
                onChange={handleMobileNumberChange}
                className="flex-1"
                disabled={isVerifying || formData.mobileVerified}
              />
              {!formData.mobileVerified && (
                <Button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={!isMobileNumberValid() || isVerifying}
                  variant={isVerifying ? "outline" : "default"}
                  className="whitespace-nowrap"
                >
                  {isVerifying ? "Verifying..." : "Verify"}
                </Button>
              )}
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            {isVerifying 
              ? "Enter the OTP sent to your mobile number" 
              : formData.mobileVerified
                ? "Your mobile number has been verified successfully"
                : "We'll send an OTP to verify this number"}
          </p>

          {/* OTP Verification Section */}
          {isVerifying && (
            <div className="space-y-3 p-4 border rounded-lg bg-muted/20 animate-slide-down">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Enter OTP <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setOtp(value);
                      setVerificationError("");
                    }}
                    className="text-center text-lg font-mono tracking-widest"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6}
                  >
                    Verify OTP
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelVerification}
                    className="h-8"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0}
                    className="h-8 gap-1"
                  >
                    {resendCooldown > 0 ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Resend in {resendCooldown}s
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3 h-3" />
                        Resend OTP
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Enter the 6-digit code sent to {formData.countryCode} {formData.mobileNumber}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {verificationError && (
            <div className="text-sm text-destructive animate-fade-in">
              {verificationError}
            </div>
          )}
        </div>
      </div>

      {/* Support Contact */}
      <SupportContact />
    </div>
  );
};

export default Step1VendorBasics;