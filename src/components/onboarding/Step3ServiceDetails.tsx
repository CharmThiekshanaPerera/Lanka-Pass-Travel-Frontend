import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Calendar } from "lucide-react";
import SupportContact from "./SupportContact";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface Step3Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const serviceCategories = [
  "Entry Ticket",
  "Guided Tour",
  "Transport",
  "Activity",
  "Combo Package",
  "Merchant",
  "Other",
];

const languages = [
  "English",
  "Sinhala",
  "Tamil",
  "Hindi",
  "German",
  "French",
  "Chinese",
  "Japanese",
  "Korean",
  "Russian",
  "Other",
];

const districts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Mullaitivu",
  "Vavuniya",
  "Trincomalee",
  "Batticaloa",
  "Ampara",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

const advanceBookingOptions = ["No advance booking", "24 hours", "48 hours", "72 hours", "Other"];

const currencies = [
  { code: "LKR", name: "Sri Lankan Rupee" },
  { code: "USD", name: "US Dollar" },
  { code: "GBP", name: "British Pound" },
  { code: "EUR", name: "Euro" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "INR", name: "Indian Rupee" },
  { code: "MVR", name: "Maldivian Rufiyaa" },
  { code: "THB", name: "Thai Baht" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "AED", name: "UAE Dirham" },
  { code: "QAR", name: "Qatari Riyal" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "JPY", name: "Japanese Yen" },
];

const emptyService = {
  serviceName: "",
  serviceCategory: "",
  serviceCategoryOther: "",
  shortDescription: "",
  whatsIncluded: "",
  whatsNotIncluded: "",
  durationValue: "",
  durationUnit: "hours",
  languagesOffered: [] as string[],
  languagesOther: "",
  groupSizeMin: "",
  groupSizeMax: "",
  dailyCapacity: "",
  operatingHoursFrom: "",
  operatingHoursFromPeriod: "AM",
  operatingHoursTo: "",
  operatingHoursToPeriod: "PM",
  operatingDays: [] as string[],
  locationsCovered: [] as string[],
  advanceBooking: "",
  advanceBookingOther: "",
  notSuitableFor: "",
  importantInfo: "",
  cancellationPolicy: "",
  accessibilityInfo: "",
  // Pricing fields
  currency: "LKR",
  retailPrice: "",
  // Blackout dates
  blackoutDates: [] as Date[],
  blackoutWeekends: false,
  blackoutHolidays: false,
  // Discount fields
  discountType: "percentage",
  discountValue: "",
  promotions: "",
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Step3ServiceDetails = ({ formData, updateFormData }: Step3Props) => {
  const services = formData.services || [{ ...emptyService }];

  const updateService = (index: number, field: string, value: any) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-fill disabled fields for Merchant category
    if (field === "serviceCategory" && value === "Merchant") {
      updated[index] = {
        ...updated[index],
        durationValue: 1,
        durationUnit: "hours",
        groupSizeMin: 1,
        groupSizeMax: 1,
        dailyCapacity: 1
      };
    }

    updateFormData("services", updated);
  };

  const addService = () => {
    updateFormData("services", [...services, { ...emptyService }]);
  };

  const removeService = (index: number) => {
    if (services.length > 1) {
      const updated = services.filter((_: any, i: number) => i !== index);
      updateFormData("services", updated);
    }
  };

  const toggleArrayItem = (index: number, field: string, item: string) => {
    const current = services[index][field] || [];
    const updated = current.includes(item)
      ? current.filter((i: string) => i !== item)
      : [...current, item];
    updateService(index, field, updated);
  };

  const handleBlackoutDateToggle = (index: number, date: Date) => {
    const currentDates = services[index].blackoutDates || [];
    const isSelected = currentDates.some((d: Date) =>
      d.toDateString() === date.toDateString()
    );

    const updated = isSelected
      ? currentDates.filter((d: Date) => d.toDateString() !== date.toDateString())
      : [...currentDates, date];

    updateService(index, "blackoutDates", updated);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Your Services
        </h2>
        <p className="text-muted-foreground">
          What do you offer? Explain your services, pricing, availability, and anything important travelers should know.
        </p>
      </div>

      {/* Services List */}
      {services.map((service: any, index: number) => (
        <div
          key={index}
          className="bg-card rounded-2xl p-6 shadow-soft border border-border space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Service {index + 1}
            </h3>
            {services.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeService(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            )}
          </div>

          {/* Service Name */}
          <div className="space-y-2">
            <Label htmlFor={`serviceName-${index}`} className="text-sm font-medium">
              Service Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`serviceName-${index}`}
              placeholder="e.g., Sunset Beach Tour"
              value={service.serviceName}
              onChange={(e) => updateService(index, "serviceName", e.target.value)}
            />
          </div>

          {/* Service Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Service Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={service.serviceCategory}
              onValueChange={(value) => updateService(index, "serviceCategory", value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {serviceCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {service.serviceCategory === "Other" && (
              <Input
                placeholder="Please specify category"
                value={service.serviceCategoryOther}
                onChange={(e) => updateService(index, "serviceCategoryOther", e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Short Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Describe what makes your experience special (min 100 characters)"
              value={service.shortDescription}
              onChange={(e) => updateService(index, "shortDescription", e.target.value)}
              rows={3}
            />
            <p className={`text-xs ${(service.shortDescription?.length || 0) < 100 ? "text-destructive" : "text-muted-foreground"}`}>
              {service.shortDescription?.length || 0} / 100 minimum characters
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* What's Included */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">What's Included</Label>
              <Textarea
                placeholder="List what's included in this service"
                value={service.whatsIncluded}
                onChange={(e) => updateService(index, "whatsIncluded", e.target.value)}
                rows={3}
              />
            </div>

            {/* What's Not Included */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">What's Not Included</Label>
              <Textarea
                placeholder="List what's not included"
                value={service.whatsNotIncluded}
                onChange={(e) => updateService(index, "whatsNotIncluded", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Duration</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="e.g., 2"
                value={service.durationValue}
                onChange={(e) => updateService(index, "durationValue", e.target.value)}
                className="w-24"
                disabled={service.serviceCategory === "Merchant"}
              />
              <Select
                value={service.durationUnit}
                onValueChange={(value) => updateService(index, "durationUnit", value)}
              >
                <SelectTrigger className="w-32 h-12" disabled={service.serviceCategory === "Merchant"}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hours">Hour(s)</SelectItem>
                  <SelectItem value="days">Day(s)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Languages Offered */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Languages Offered</Label>
            <p className="text-xs text-muted-foreground">
              Select all languages you can offer this service in
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleArrayItem(index, "languagesOffered", lang)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${(service.languagesOffered || []).includes(lang)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                    } ${service.serviceCategory === "Merchant" ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={service.serviceCategory === "Merchant"}
                >
                  {lang}
                </button>
              ))}
            </div>
            {(service.languagesOffered || []).includes("Other") && (
              <Input
                placeholder="Please list other languages"
                value={service.languagesOther}
                onChange={(e) => updateService(index, "languagesOther", e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          {/* Group Size */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Group Size</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={service.groupSizeMin}
                onChange={(e) => updateService(index, "groupSizeMin", e.target.value)}
                className="w-24"
                disabled={service.serviceCategory === "Merchant"}
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="number"
                placeholder="Max"
                value={service.groupSizeMax}
                onChange={(e) => updateService(index, "groupSizeMax", e.target.value)}
                className="w-24"
                disabled={service.serviceCategory === "Merchant"}
              />
              <span className="text-muted-foreground">people</span>
            </div>
          </div>

          {/* Daily Capacity */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Daily Capacity / Slots <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              placeholder="Maximum bookings per day"
              value={service.dailyCapacity}
              onChange={(e) => updateService(index, "dailyCapacity", e.target.value)}
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of bookings you can accommodate per day
            </p>
          </div>

          {/* Operating Days */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Operating Days</Label>
            <p className="text-xs text-muted-foreground">
              Select all days when this service is available
            </p>
            <div className="grid grid-cols-7 gap-2 max-w-md">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleArrayItem(index, "operatingDays", day)}
                  className={`w-full h-12 rounded-lg text-sm font-medium transition-all ${(service.operatingDays || []).includes(day)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* BLACKOUT DATES SECTION */}
          <div className="pt-4 border-t border-border">
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">Blackout Dates</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Select dates or periods when your service is unavailable
            </p>

            <div className="space-y-4">
              {/* Quick Options */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`holidays-${index}`}
                    checked={service.blackoutHolidays || false}
                    onCheckedChange={(checked) => updateService(index, "blackoutHolidays", checked)}
                  />
                  <Label htmlFor={`holidays-${index}`} className="text-sm cursor-pointer">
                    Block Public Holidays
                  </Label>
                </div>
              </div>

              {/* Calendar Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select Specific Dates</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-12"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {service.blackoutDates?.length > 0
                        ? `${service.blackoutDates.length} date(s) selected`
                        : "Select dates"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="multiple"
                      selected={service.blackoutDates || []}
                      onSelect={(dates) => updateService(index, "blackoutDates", dates || [])}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                {/* Selected Dates List */}
                {service.blackoutDates?.length > 0 && (
                  <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm font-medium mb-2">Selected dates:</p>
                    <div className="flex flex-wrap gap-2">
                      {service.blackoutDates.map((date: Date, idx: number) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-background rounded-md text-sm"
                        >
                          <span>{format(date, "MMM d, yyyy")}</span>
                          <button
                            type="button"
                            onClick={() => handleBlackoutDateToggle(index, date)}
                            className="text-muted-foreground hover:text-destructive ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Operating Hours</Label>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                type="number"
                placeholder="9"
                value={service.operatingHoursFrom}
                onChange={(e) => updateService(index, "operatingHoursFrom", e.target.value)}
                className="w-20 h-12"
                min="1"
                max="12"
              />
              <Select
                value={service.operatingHoursFromPeriod}
                onValueChange={(value) => updateService(index, "operatingHoursFromPeriod", value)}
              >
                <SelectTrigger className="w-20 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">to</span>
              <Input
                type="number"
                placeholder="5"
                value={service.operatingHoursTo}
                onChange={(e) => updateService(index, "operatingHoursTo", e.target.value)}
                className="w-20 h-12"
                min="1"
                max="12"
              />
              <Select
                value={service.operatingHoursToPeriod}
                onValueChange={(value) => updateService(index, "operatingHoursToPeriod", value)}
              >
                <SelectTrigger className="w-20 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Locations Covered */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Locations / Districts Covered</Label>
            <p className="text-xs text-muted-foreground">
              Select all districts where this service is available
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
              {districts.map((district) => (
                <button
                  key={district}
                  type="button"
                  onClick={() => toggleArrayItem(index, "locationsCovered", district)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${(service.locationsCovered || []).includes(district)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                >
                  {district}
                </button>
              ))}
            </div>
          </div>

          {/* Advance Booking */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Advance Booking Required</Label>
            <Select
              value={service.advanceBooking}
              onValueChange={(value) => updateService(index, "advanceBooking", value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select requirement" />
              </SelectTrigger>
              <SelectContent>
                {advanceBookingOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {service.advanceBooking === "Other" && (
              <Input
                placeholder="Specify advance booking time"
                value={service.advanceBookingOther}
                onChange={(e) => updateService(index, "advanceBookingOther", e.target.value)}
                className="mt-2 h-12"
              />
            )}
          </div>

          {/* PRICING OR DISCOUNT SECTION */}
          <div className="pt-4 border-t border-border">
            {service.serviceCategory === "Merchant" ? (
              <>
                <h4 className="font-display text-lg font-semibold text-foreground mb-4">Discount Details</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Discount Type</Label>
                    <Select
                      value={service.discountType || "percentage"}
                      onValueChange={(val) => updateService(index, "discountType", val)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage Off (%)</SelectItem>
                        <SelectItem value="amount">Fixed Amount Off</SelectItem>
                        <SelectItem value="promotions">Promotions (e.g., BOGO)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {service.discountType !== "promotions" ? (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        {service.discountType === "percentage" ? "Percentage Off (%)" : "Amount Off"}
                      </Label>
                      <Input
                        type="number"
                        placeholder={service.discountType === "percentage" ? "e.g., 5" : "e.g., 500"}
                        value={service.discountValue}
                        onChange={(e) => updateService(index, "discountValue", e.target.value)}
                        className="h-12"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Promotion Description</Label>
                      <Input
                        placeholder="e.g., Buy 1 get 1 Free"
                        value={service.promotions}
                        onChange={(e) => updateService(index, "promotions", e.target.value)}
                        className="h-12"
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h4 className="font-display text-lg font-semibold text-foreground mb-4">Pricing</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Currency Selection - Clean Dropdown */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Currency <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={service.currency || "LKR"}
                      onValueChange={(value) => updateService(index, "currency", value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{curr.code}</span>
                              <span className="text-muted-foreground">-</span>
                              <span>{curr.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Retail Price */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Retail Price <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <span className="font-medium">
                          {currencies.find(c => c.code === service.currency)?.code || "LKR"}
                        </span>
                      </div>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={service.retailPrice}
                        onChange={(e) => updateService(index, "retailPrice", e.target.value)}
                        className="pl-14 h-12"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Price that will be shown to travelers
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Additional Info Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Not Suitable For</Label>
              <Textarea
                placeholder="e.g., Not suitable for people with mobility issues"
                value={service.notSuitableFor}
                onChange={(e) => updateService(index, "notSuitableFor", e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Important Info</Label>
              <Textarea
                placeholder="Any important information travelers should know"
                value={service.importantInfo}
                onChange={(e) => updateService(index, "importantInfo", e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Cancellation Policy</Label>
            <Textarea
              placeholder="Describe your cancellation and refund policy"
              value={service.cancellationPolicy}
              onChange={(e) => updateService(index, "cancellationPolicy", e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

        </div>
      ))}

      {/* Add Service Button */}
      <Button
        variant="outline"
        onClick={addService}
        className="w-full h-12 border-dashed border-2"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Service
      </Button>

      {/* Support Contact */}
      <SupportContact />
    </div>
  );
};

export default Step3ServiceDetails;