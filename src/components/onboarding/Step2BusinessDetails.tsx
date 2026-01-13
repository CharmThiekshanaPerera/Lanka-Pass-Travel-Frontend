import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, X } from "lucide-react";
import SupportContact from "./SupportContact";

interface Step2Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const FileUploadBox = ({
  label,
  hint,
  required,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  value?: File | null;
  onChange: (file: File | null) => void;
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      
      {value ? (
        <div className="flex items-center gap-3 p-3 bg-palm-light rounded-xl border border-accent/20">
          <FileText className="w-5 h-5 text-accent" />
          <span className="flex-1 text-sm font-medium truncate">{value.name}</span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-muted/30 transition-all">
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">
            Click to upload or drag and drop
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            PDF, JPG, PNG (max 10MB)
          </span>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              onChange(file);
            }}
          />
        </label>
      )}
    </div>
  );
};

const Step2BusinessDetails = ({ formData, updateFormData }: Step2Props) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Business Details
        </h2>
        <p className="text-muted-foreground">
          Just the necessary info. Share your registration, licenses, and other required details so we can work together smoothly.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Business Registration Number */}
        <div className="space-y-2">
          <Label htmlFor="regNumber" className="text-sm font-medium">
            Business Registration Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="regNumber"
            placeholder="e.g., PV12345"
            value={formData.businessRegNumber || ""}
            onChange={(e) => updateFormData("businessRegNumber", e.target.value)}
          />
        </div>

        {/* Business Registration Certificate Upload */}
        <FileUploadBox
          label="Business Registration Certificate"
          hint="Upload a copy of your official registration document"
          required
          value={formData.businessRegCertificate}
          onChange={(file) => updateFormData("businessRegCertificate", file)}
        />

        {/* NIC / Passport Upload */}
        <FileUploadBox
          label="NIC / Passport of Owner or Authorized Signatory"
          hint="For identity verification purposes"
          required
          value={formData.nicPassport}
          onChange={(file) => updateFormData("nicPassport", file)}
        />

        {/* Tourism License Upload */}
        <FileUploadBox
          label="Tourism License (SLTDA or relevant authority)"
          hint="If applicable to your business type"
          value={formData.tourismLicense}
          onChange={(file) => updateFormData("tourismLicense", file)}
        />

        {/* Tax ID / VAT */}
        <div className="space-y-2">
          <Label htmlFor="taxId" className="text-sm font-medium">
            Tax ID / VAT Number
          </Label>
          <Input
            id="taxId"
            placeholder="Optional – can be added later"
            value={formData.taxId || ""}
            onChange={(e) => updateFormData("taxId", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            You can provide this later if not available now
          </p>
        </div>

        {/* Business Address */}
        <div className="space-y-2">
          <Label htmlFor="businessAddress" className="text-sm font-medium">
            Business Address <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="businessAddress"
            placeholder="Full address including street, city, and postal code"
            value={formData.businessAddress || ""}
            onChange={(e) => updateFormData("businessAddress", e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Support Contact */}
      <SupportContact />
    </div>
  );
};

export default Step2BusinessDetails;
