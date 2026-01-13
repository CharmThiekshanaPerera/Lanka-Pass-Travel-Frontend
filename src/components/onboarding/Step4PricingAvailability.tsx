import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SupportContact from "./SupportContact";

interface Step4Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const currencies = [
  { code: "LKR", label: "🇱🇰 LKR - Sri Lankan Rupee" },
  { code: "USD", label: "🇺🇸 USD - US Dollar" },
  { code: "GBP", label: "🇬🇧 GBP - British Pound" },
];

const Step4PricingAvailability = ({ formData, updateFormData }: Step4Props) => {
  const services = formData.services || [{}];
  const pricingData = formData.pricing || services.map(() => ({
    currency: "LKR",
    retailPrice: "",
    commission: "15",
    netPrice: "",
    blackoutDates: "",
    blackoutWeekends: false,
    blackoutHolidays: false,
    dailyCapacity: "",
  }));

  const updatePricing = (index: number, field: string, value: any) => {
    const updated = [...pricingData];
    if (!updated[index]) updated[index] = {};
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-calculate net price
    if (field === "retailPrice" || field === "commission") {
      const retail = parseFloat(updated[index].retailPrice) || 0;
      const commission = parseFloat(updated[index].commission) || 0;
      updated[index].netPrice = (retail - (retail * commission / 100)).toFixed(2);
    }
    
    updateFormData("pricing", updated);
  };

  // Merchant-specific fields
  const isMerchant = formData.vendorType === "Merchant";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Pricing & Availability
        </h2>
        <p className="text-muted-foreground">
          Set your prices and limits. Add pricing, availability, blackout dates, and capacity so travelers know what to expect.
        </p>
      </div>

      {/* Pricing for each service */}
      {services.map((service: any, index: number) => (
        <div
          key={index}
          className="bg-card rounded-2xl p-6 shadow-soft border border-border space-y-6"
        >
          <h3 className="font-display text-lg font-semibold text-foreground">
            {service.serviceName || `Service ${index + 1}`}
          </h3>

          {/* Currency Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Currency</Label>
            <Select
              value={pricingData[index]?.currency || "LKR"}
              onValueChange={(value) => updatePricing(index, "currency", value)}
            >
              <SelectTrigger className="h-12 w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!isMerchant ? (
            // Standard pricing for non-merchants
            <>
              <div className="grid md:grid-cols-3 gap-4">
                {/* Retail Price */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Retail Price <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {pricingData[index]?.currency || "LKR"}
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={pricingData[index]?.retailPrice || ""}
                      onChange={(e) => updatePricing(index, "retailPrice", e.target.value)}
                      className="pl-14"
                    />
                  </div>
                </div>

                {/* Commission (Read-only) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Platform Commission</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={`${pricingData[index]?.commission || 15}%`}
                      readOnly
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Set by LankaPass</p>
                </div>

                {/* Net Price (Calculated) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Your Payout</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {pricingData[index]?.currency || "LKR"}
                    </span>
                    <Input
                      type="text"
                      value={pricingData[index]?.netPrice || "0.00"}
                      readOnly
                      className="pl-14 bg-palm-light border-accent/30"
                    />
                  </div>
                </div>
              </div>

              {/* Daily Capacity */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Daily Capacity / Slots</Label>
                <Input
                  type="number"
                  placeholder="Maximum bookings per day"
                  value={pricingData[index]?.dailyCapacity || ""}
                  onChange={(e) => updatePricing(index, "dailyCapacity", e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </>
          ) : (
            // Merchant-specific offer fields
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Name of Offer</Label>
                <Input
                  placeholder="e.g., 10% off on all purchases"
                  value={pricingData[index]?.offerName || ""}
                  onChange={(e) => updatePricing(index, "offerName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Describe the Offer</Label>
                <Textarea
                  placeholder="Explain what the offer includes"
                  value={pricingData[index]?.offerDescription || ""}
                  onChange={(e) => updatePricing(index, "offerDescription", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Offer Period</Label>
                  <Input
                    placeholder="e.g., Jan 1 - Dec 31, 2026"
                    value={pricingData[index]?.offerPeriod || ""}
                    onChange={(e) => updatePricing(index, "offerPeriod", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Available Times</Label>
                  <Input
                    placeholder="e.g., 10 AM - 8 PM"
                    value={pricingData[index]?.offerTimes || ""}
                    onChange={(e) => updatePricing(index, "offerTimes", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Conditions / Limitations</Label>
                <Textarea
                  placeholder="Any conditions or limitations that apply"
                  value={pricingData[index]?.offerConditions || ""}
                  onChange={(e) => updatePricing(index, "offerConditions", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Blackout Dates */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Blackout Dates</Label>
            <p className="text-xs text-muted-foreground">
              Select dates or periods when your service is unavailable
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`weekends-${index}`}
                  checked={pricingData[index]?.blackoutWeekends || false}
                  onCheckedChange={(checked) => updatePricing(index, "blackoutWeekends", checked)}
                />
                <Label htmlFor={`weekends-${index}`} className="text-sm cursor-pointer">
                  Exclude weekends
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`holidays-${index}`}
                  checked={pricingData[index]?.blackoutHolidays || false}
                  onCheckedChange={(checked) => updatePricing(index, "blackoutHolidays", checked)}
                />
                <Label htmlFor={`holidays-${index}`} className="text-sm cursor-pointer">
                  Exclude public holidays
                </Label>
              </div>
            </div>

            <Textarea
              placeholder="Add specific dates (e.g., Dec 25, Jan 1) or date ranges"
              value={pricingData[index]?.blackoutDates || ""}
              onChange={(e) => updatePricing(index, "blackoutDates", e.target.value)}
              rows={2}
            />
          </div>
        </div>
      ))}

      {/* Support Contact */}
      <SupportContact />
    </div>
  );
};

export default Step4PricingAvailability;
