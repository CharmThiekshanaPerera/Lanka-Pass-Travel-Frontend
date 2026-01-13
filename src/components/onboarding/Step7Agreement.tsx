import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileCheck, Shield, AlertCircle } from "lucide-react";
import SupportContact from "./SupportContact";

interface Step7Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Step7Agreement = ({ formData, updateFormData, onSubmit, isSubmitting }: Step7Props) => {
  const allChecked = 
    formData.acceptTerms && 
    formData.acceptCommission && 
    formData.acceptCancellation && 
    formData.grantRights &&
    formData.confirmAccuracy;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Final Review & Agreement
        </h2>
        <p className="text-muted-foreground">
          Almost there! Review the terms, accept the agreement, and you're ready to go live.
        </p>
      </div>

      {/* Agreement Period */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border space-y-6">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-6 h-6 text-primary" />
          <h3 className="font-display text-lg font-semibold text-foreground">
            Agreement Period
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Agreement Start Date <span className="text-destructive">*</span>
            </Label>
            <Input
              type="date"
              value={formData.agreementStartDate || ""}
              onChange={(e) => updateFormData("agreementStartDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Agreement End Date <span className="text-destructive">*</span>
            </Label>
            <Input
              type="date"
              value={formData.agreementEndDate || ""}
              onChange={(e) => updateFormData("agreementEndDate", e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
          <div>
            <Label className="text-sm font-medium">Auto-Renew Agreement</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Automatically renew your agreement when it expires
            </p>
          </div>
          <Switch
            checked={formData.autoRenew || false}
            onCheckedChange={(checked) => updateFormData("autoRenew", checked)}
          />
        </div>
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
        onClick={onSubmit}
        disabled={!allChecked || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By submitting, you agree to our Terms of Service and Privacy Policy. 
        Your application will be reviewed within 48 hours.
      </p>

      {/* Support Contact */}
      <SupportContact />
    </div>
  );
};

export default Step7Agreement;
