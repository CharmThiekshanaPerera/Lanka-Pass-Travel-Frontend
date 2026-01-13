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
import SupportContact from "./SupportContact";

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
  const handleAreaToggle = (area: string) => {
    const current = formData.operatingAreas || [];
    const updated = current.includes(area)
      ? current.filter((a: string) => a !== area)
      : [...current, area];
    updateFormData("operatingAreas", updated);
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

        {/* Mobile Number with Country Code */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Mobile Number <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <Select
              value={formData.countryCode || "+94"}
              onValueChange={(value) => updateFormData("countryCode", value)}
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
            <Input
              type="tel"
              placeholder="Mobile number"
              value={formData.mobileNumber || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                updateFormData("mobileNumber", value);
              }}
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            We'll send an OTP to verify this number
          </p>
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
      </div>

      {/* Support Contact */}
      <SupportContact />
    </div>
  );
};

export default Step1VendorBasics;
