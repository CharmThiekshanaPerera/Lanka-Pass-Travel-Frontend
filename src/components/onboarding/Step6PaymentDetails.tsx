import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SupportContact from "./SupportContact";

interface Step6Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const banks = [
  { name: "Bank of Ceylon", logo: "🏦" },
  { name: "People's Bank", logo: "🏦" },
  { name: "Commercial Bank", logo: "🏦" },
  { name: "Hatton National Bank", logo: "🏦" },
  { name: "Sampath Bank", logo: "🏦" },
  { name: "Nations Trust Bank", logo: "🏦" },
  { name: "DFCC Bank", logo: "🏦" },
  { name: "Seylan Bank", logo: "🏦" },
  { name: "National Development Bank", logo: "🏦" },
  { name: "Pan Asia Bank", logo: "🏦" },
  { name: "Union Bank", logo: "🏦" },
  { name: "Amana Bank", logo: "🏦" },
  { name: "HSBC", logo: "🏦" },
  { name: "Standard Chartered", logo: "🏦" },
  { name: "Other", logo: "🏦" },
];

const payoutCycles = [
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

const payoutDates = [
  { value: "1", label: "1st of the month" },
  { value: "15", label: "15th of the month" },
];

const Step6PaymentDetails = ({ formData, updateFormData }: Step6Props) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Getting Paid
        </h2>
        <p className="text-muted-foreground">
          Tell us where to send your money. Add your payment details and payout preferences so payments are quick and hassle-free.
        </p>
      </div>

      {/* Bank Details Card */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border space-y-6">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Bank Account Details
        </h3>

        {/* Bank Name */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Bank Name <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.bankName || ""}
            onValueChange={(value) => updateFormData("bankName", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select your bank" />
            </SelectTrigger>
            <SelectContent>
              {banks.map((bank) => (
                <SelectItem key={bank.name} value={bank.name}>
                  <span className="flex items-center gap-2">
                    {bank.logo} {bank.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.bankName === "Other" && (
            <Input
              placeholder="Enter bank name"
              value={formData.bankNameOther || ""}
              onChange={(e) => updateFormData("bankNameOther", e.target.value)}
              className="mt-2"
            />
          )}
        </div>

        {/* Account Holder Name */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Account Holder Name <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="Name as it appears on your bank account"
            value={formData.accountHolderName || ""}
            onChange={(e) => updateFormData("accountHolderName", e.target.value)}
          />
        </div>

        {/* Account Number */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Account Number <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="Your bank account number"
            value={formData.accountNumber || ""}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              updateFormData("accountNumber", value);
            }}
          />
        </div>

        {/* Branch */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Branch <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="Bank branch name or code"
            value={formData.bankBranch || ""}
            onChange={(e) => updateFormData("bankBranch", e.target.value)}
          />
        </div>
      </div>

      {/* Payout Preferences Card */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border space-y-6">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Payout Preferences
        </h3>

        {/* Payout Cycle */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Preferred Payout Cycle <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.payoutCycle || ""}
            onValueChange={(value) => updateFormData("payoutCycle", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="How often would you like to be paid?" />
            </SelectTrigger>
            <SelectContent>
              {payoutCycles.map((cycle) => (
                <SelectItem key={cycle.value} value={cycle.value}>
                  {cycle.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payout Date (for monthly) */}
        {(formData.payoutCycle === "monthly" || formData.payoutCycle === "quarterly") && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Payout Date <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.payoutDate || ""}
              onValueChange={(value) => updateFormData("payoutDate", value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select payout date" />
              </SelectTrigger>
              <SelectContent>
                {payoutDates.map((date) => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-ocean-light rounded-xl p-4 border border-secondary/20">
          <p className="text-sm text-foreground">
            <strong>How payouts work:</strong> We process payouts according to your preference. 
            You'll receive an email notification before each payout with a summary of your earnings.
          </p>
        </div>
      </div>

      {/* Support Contact */}
      <SupportContact />
    </div>
  );
};

export default Step6PaymentDetails;
