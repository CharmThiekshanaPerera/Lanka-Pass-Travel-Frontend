import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import SupportContact from "./SupportContact";

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
  "Merchant Discount",
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
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Step3ServiceDetails = ({ formData, updateFormData }: Step3Props) => {
  const services = formData.services || [{ ...emptyService }];

  const updateService = (index: number, field: string, value: any) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Your Services
        </h2>
        <p className="text-muted-foreground">
          What do you offer? Explain your services, operating hours, how customers redeem their pass, and anything important they should know.
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
            <Label className="text-sm font-medium">
              Service Name <span className="text-destructive">*</span>
            </Label>
            <Input
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
              />
              <Select
                value={service.durationUnit}
                onValueChange={(value) => updateService(index, "durationUnit", value)}
              >
                <SelectTrigger className="w-32 h-12">
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
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleArrayItem(index, "languagesOffered", lang)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    (service.languagesOffered || []).includes(lang)
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            {(service.languagesOffered || []).includes("Other") && (
              <Input
                placeholder="List other languages"
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
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="number"
                placeholder="Max"
                value={service.groupSizeMax}
                onChange={(e) => updateService(index, "groupSizeMax", e.target.value)}
                className="w-24"
              />
              <span className="text-muted-foreground">people</span>
            </div>
          </div>

          {/* Operating Days */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Operating Days</Label>
            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleArrayItem(index, "operatingDays", day)}
                  className={`w-12 h-10 rounded-lg text-sm font-medium transition-all ${
                    (service.operatingDays || []).includes(day)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {day}
                </button>
              ))}
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
                className="w-20"
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
                className="w-20"
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
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {districts.map((district) => (
                <button
                  key={district}
                  type="button"
                  onClick={() => toggleArrayItem(index, "locationsCovered", district)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    (service.locationsCovered || []).includes(district)
                      ? "bg-accent text-accent-foreground"
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
                className="mt-2"
              />
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
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Important Info</Label>
              <Textarea
                placeholder="Any important information travelers should know"
                value={service.importantInfo}
                onChange={(e) => updateService(index, "importantInfo", e.target.value)}
                rows={2}
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
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Accessibility Info</Label>
            <Textarea
              placeholder="e.g., Stairs required, not wheelchair friendly"
              value={service.accessibilityInfo}
              onChange={(e) => updateService(index, "accessibilityInfo", e.target.value)}
              rows={2}
            />
          </div>
        </div>
      ))}

      {/* Add Service Button */}
      <Button
        variant="outline"
        onClick={addService}
        className="w-full border-dashed border-2"
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
