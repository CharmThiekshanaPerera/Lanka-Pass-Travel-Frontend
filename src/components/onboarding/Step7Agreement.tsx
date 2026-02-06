import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileCheck, Shield, AlertCircle, MailCheck, RefreshCw } from "lucide-react";
import SupportContact from "./SupportContact";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { vendorService } from "@/services/vendorService";
import { useAuth } from "@/contexts/AuthContext";

interface Step7Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Step7Agreement = ({ formData, updateFormData, onSubmit, isSubmitting }: Step7Props) => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationError, setVerificationError] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const allChecked =
    formData.acceptTerms &&
    formData.acceptCommission &&
    formData.acceptCancellation &&
    formData.grantRights &&
    formData.confirmAccuracy;

  // Handle resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmitClick = () => {
    if (!allChecked) return;

    setShowVerificationModal(true);
    setVerificationError("");
    setVerificationSuccess("");

    // Send verification email automatically when modal opens
    if (!isVerificationSent) {
      sendVerificationEmail();
    }
  };

  const sendVerificationEmail = () => {
    if (!formData.email) {
      setVerificationError("Please check your email address first");
      return;
    }

    console.log("Sending verification email to:", formData.email);
    setIsVerificationSent(true);
    setResendCooldown(900); // 15 minutes cooldown (900 seconds)

    // In a real app, you would make an API call here:
    // await sendVerificationEmail(formData.email);

    setVerificationSuccess(`Verification code sent to ${formData.email}. Code expires in 15 minutes.`);
  };

  const handleResendVerification = () => {
    if (resendCooldown > 0) return;

    setVerificationError("");
    setVerificationSuccess("");
    sendVerificationEmail();
  };

  const handleVerifyAndSubmit = async () => {
    if (verificationCode.length !== 6) {
      setVerificationError("Verification code must be 6 digits");
      return;
    }

    setIsVerifying(true);
    setVerificationError("");

    try {
      // For demo purposes, assume code is valid if it's 6 digits and the last digit is not 0
      const isValid = verificationCode.length === 6 && verificationCode.charAt(5) !== '0';

      if (isValid) {
        setVerificationSuccess("Email verified successfully! Submitting your application...");

        // Submit vendor registration to backend
        const result = await vendorService.registerVendor(formData);

        if (result.success) {
          // Force update auth context to recognize the new session
          await refreshUser();

          setVerificationSuccess("Application submitted successfully! Redirecting...");

          // Navigate to success page
          setTimeout(() => {
            setShowVerificationModal(false);
            navigate('/vendor-registration-success', {
              state: {
                vendorId: result.vendor_id,
                businessName: formData.businessName,
                email: formData.email
              }
            });
          }, 2000);
        } else {
          setVerificationError(result.message || "Registration failed. Please try again.");
          setIsVerifying(false);
        }
      } else {
        setVerificationError("Invalid verification code. Please try again.");
        setIsVerifying(false);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      setVerificationError(`Submission failed: ${error.message}`);
      setIsVerifying(false);
    }
  };

  const closeModal = () => {
    setShowVerificationModal(false);
    setVerificationCode("");
    setVerificationError("");
    setVerificationSuccess("");
    setIsVerificationSent(false);
    setIsVerifying(false);
  };

  // Format time for countdown display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="space-y-8 animate-fade-in">
        {/* Section Header */}
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Final Review & Agreement
          </h2>
          <p className="text-muted-foreground">
            Almost there! Review the terms, accept the agreement, and submit to activate your account.
          </p>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border space-y-5">
          <div className="flex items-center gap-3">
            <FileCheck className="w-6 h-6 text-secondary" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              Terms & Conditions
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms || false}
                onCheckedChange={(checked) => updateFormData("acceptTerms", checked)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="acceptTerms" className="text-sm font-medium cursor-pointer">
                  I accept the Vendor Terms & Conditions <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  <a href="#" className="text-secondary hover:underline">Read full terms</a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <Checkbox
                id="acceptCommission"
                checked={formData.acceptCommission || false}
                onCheckedChange={(checked) => updateFormData("acceptCommission", checked)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="acceptCommission" className="text-sm font-medium cursor-pointer">
                  I accept the Commission Structure <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Platform commission as discussed during onboarding
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <Checkbox
                id="acceptCancellation"
                checked={formData.acceptCancellation || false}
                onCheckedChange={(checked) => updateFormData("acceptCancellation", checked)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="acceptCancellation" className="text-sm font-medium cursor-pointer">
                  I accept the Cancellation & Refund Policy <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  <a href="#" className="text-secondary hover:underline">View policy details</a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <Checkbox
                id="grantRights"
                checked={formData.grantRights || false}
                onCheckedChange={(checked) => updateFormData("grantRights", checked)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="grantRights" className="text-sm font-medium cursor-pointer">
                  I grant LankaPass rights to: <span className="text-destructive">*</span>
                </Label>
                <ul className="text-xs text-muted-foreground mt-1 list-disc list-inside">
                  <li>List my services on the platform</li>
                  <li>Use my images/audio for marketing purposes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Final Confirmation */}
        <div className="bg-sunset-light rounded-2xl p-6 border border-primary/20 space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              Final Confirmation
            </h3>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="confirmAccuracy"
              checked={formData.confirmAccuracy || false}
              onCheckedChange={(checked) => updateFormData("confirmAccuracy", checked)}
              className="mt-0.5"
            />
            <div>
              <Label htmlFor="confirmAccuracy" className="text-sm font-medium cursor-pointer">
                I confirm that all details provided are accurate and complete <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                By submitting, you agree to a digital signature with timestamp and IP logging.
              </p>
            </div>
          </div>
        </div>

        {/* Incomplete Warning */}
        {!allChecked && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-xl border border-destructive/20">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-sm text-destructive">
              Please accept all required agreements to submit your application.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          variant="hero"
          size="xl"
          type="button"
          onClick={handleSubmitClick}
          disabled={!allChecked || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit Application & Activate Account"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By clicking submit, a verification code will be sent to your email to activate your account.
          Code expires in 15 minutes.
        </p>

        {/* Support Contact */}
        <SupportContact />
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <MailCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Verify Your Email
                </h3>
                <p className="text-sm text-muted-foreground">
                  Account activation required
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm mb-2">
                  A 6-digit verification code has been sent to:
                </p>
                <p className="font-medium text-primary">{formData.email}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Check your inbox (and spam folder)
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Enter Verification Code <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setVerificationCode(value);
                      setVerificationError("");
                    }}
                    className="text-center text-xl font-mono tracking-widest h-12 flex-1"
                    disabled={isVerifying}
                  />
                  <Button
                    onClick={handleResendVerification}
                    disabled={resendCooldown > 0}
                    variant="outline"
                    type="button"
                    className="h-12 min-w-[100px]"
                  >
                    {resendCooldown > 0 ? formatTime(resendCooldown) : "Resend"}
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="text-destructive font-medium">
                    • Code expires in {formatTime(resendCooldown)}
                  </p>
                  <p>• After verification, your account will be activated immediately</p>
                </div>
              </div>

              {/* Error Message */}
              {verificationError && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                  {verificationError}
                </div>
              )}

              {/* Success Message */}
              {verificationSuccess && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                  {verificationSuccess}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={closeModal}
                  className="flex-1"
                  disabled={isVerifying}
                >
                  Cancel
                </Button>
                <Button
                  variant="hero"
                  type="button"
                  onClick={handleVerifyAndSubmit}
                  disabled={verificationCode.length !== 6 || isVerifying}
                  className="flex-1"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Registering Account...
                    </>
                  ) : (
                    "Verify & Activate Account"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Step7Agreement;