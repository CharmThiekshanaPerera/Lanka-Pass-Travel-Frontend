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
import { CheckCircle2, RefreshCw, Phone } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { authService } from "@/services/authService";
import { toast } from "sonner";

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
    const phoneNumber = formData.phoneNumber || "";
    try {
      const parsed = parsePhoneNumber(phoneNumber);
      return parsed && parsed.isValid();
    } catch {
      return false;
    }
  };

  const handleSendVerification = async () => {
    if (!isMobileNumberValid()) {
      setVerificationError("Please enter a valid mobile number");
      return;
    }

    setVerificationError("");
    setIsVerifying(true);
    setResendCooldown(30); // 30 seconds cooldown

    try {
      const response = await authService.sendOtp(formData.phoneNumber);
      if (response.success) {
        toast.success("OTP sent successfully");
      } else {
        setVerificationError(response.message || "Failed to send OTP");
        setIsVerifying(false);
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      setVerificationError(error.response?.data?.detail || "Something went wrong while sending OTP");
      setIsVerifying(false);
    }
  };

  const handleResendOtp = () => {
    handleSendVerification();
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setVerificationError("OTP must be 6 digits");
      return;
    }

    setVerificationError("");

    try {
      const response = await authService.verifyOtp(formData.phoneNumber, otp);
      if (response.success) {
        toast.success("Mobile number verified!");
        updateFormData("phoneVerified", true);
        setIsVerifying(false);
        setOtp("");
      } else {
        setVerificationError(response.message || "Invalid OTP");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      setVerificationError(error.response?.data?.detail || "Invalid or expired OTP");
    }
  };


  const handleCancelVerification = () => {
    setIsVerifying(false);
    setOtp("");
    setVerificationError("");
    updateFormData("phoneVerified", false);
  };

  const handlePhoneNumberChange = (value: string | undefined) => {
    updateFormData("phoneNumber", value || "");

    // Reset verification if phone number changes
    if (formData.phoneVerified) {
      updateFormData("phoneVerified", false);
    }
    if (isVerifying) {
      setIsVerifying(false);
      setOtp("");
    }
    setVerificationError("");
  };

  // Custom styles for PhoneInput component
  const phoneInputStyles = {
    '--PhoneInput-color--focus': 'hsl(var(--primary))',
    '--PhoneInputCountrySelectArrow-color': 'hsl(var(--muted-foreground))',
    '--PhoneInputCountrySelectArrow-color--focus': 'hsl(var(--primary))',
    '--PhoneInputCountryFlag-borderColor': 'transparent',
    '--PhoneInputCountryFlag-borderColor--focus': 'hsl(var(--primary))',
    '--PhoneInputCountryFlag-height': '24px',
    '--PhoneInputCountryFlag-width': '36px',
  } as React.CSSProperties;

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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${(formData.operatingAreas || []).includes(area)
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
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">
                Mobile Number <span className="text-destructive">*</span>
              </Label>
            </div>
            {formData.phoneVerified && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2 items-stretch">
              <div className="flex-1">
                <div className={`
        relative border rounded-lg transition-all duration-200
        ${isVerifying || formData.phoneVerified ? "opacity-70 cursor-not-allowed" : ""}
        ${verificationError ? "border-destructive" : "border-border"}
        focus-within:border-primary focus-within:ring-1 focus-within:ring-primary
        h-12
      `}>
                  <PhoneInput
                    international
                    defaultCountry="LK"
                    value={formData.phoneNumber || ""}
                    onChange={handlePhoneNumberChange}
                    disabled={isVerifying || formData.phoneVerified}
                    className={`
            PhoneInput
            w-full h-full px-3 bg-background rounded-lg
            ${isVerifying || formData.phoneVerified ? "cursor-not-allowed" : ""}
          `}
                    style={phoneInputStyles}
                  />
                </div>
              </div>
              {!formData.phoneVerified && (
                <Button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={!isMobileNumberValid() || isVerifying}
                  variant={isVerifying ? "outline" : "default"}
                  className="w-full sm:w-auto whitespace-nowrap min-w-[100px] h-12"
                >
                  {isVerifying ? "Sending..." : "Send OTP"}
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              {isVerifying
                ? "Enter the OTP sent to your mobile number"
                : formData.phoneVerified
                  ? "Your mobile number has been verified successfully"
                  : "We'll send an OTP to verify this number"}
            </p>
          </div>

          {/* OTP Verification Section */}
          {isVerifying && (
            <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 animate-slide-down">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Enter Verification Code <span className="text-destructive">*</span>
                  </Label>
                  <div className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      {formData.phoneNumber}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setOtp(value);
                        setVerificationError("");
                      }}
                      className="text-center text-xl font-mono tracking-widest h-12"
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otp.length !== 6}
                      className="h-12 w-full sm:w-auto min-w-[120px]"
                    >
                      Verify OTP
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelVerification}
                      className="h-9"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0}
                      className="h-9 gap-2"
                    >
                      {resendCooldown > 0 ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span className="font-mono">Resend in {resendCooldown}s</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3" />
                          Resend OTP
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>- The code will expire in 10 minutes</p>
                  <p>- Didn't receive the code? Check your spam folder or request a new code</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {verificationError && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg animate-fade-in">
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
