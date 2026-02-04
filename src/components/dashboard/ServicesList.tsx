import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, MoreVertical, Star, MapPin, Clock, Users, ChevronLeft, ChevronRight, LayoutGrid, Info, Tag, FileText, Image as ImageIcon, Loader2, Upload, AlertCircle, Calendar, X, Package, Edit2, Lock, CheckCircle2, Ban } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { vendorService } from "@/services/vendorService";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { chatService, UpdateRequest } from "@/services/chatService";

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
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
  "Mullaitivu", "Vavuniya", "Trincomalee", "Batticaloa", "Ampara",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
  "Monaragala", "Ratnapura", "Kegalle",
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

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const serviceSchema = z.object({
  id: z.string().optional(),
  serviceName: z.string().min(2, "Service name is required"),
  serviceCategory: z.string().min(2, "Category is required"),
  serviceCategoryOther: z.string().optional(),
  shortDescription: z.string().min(100, "Description must be at least 100 characters"),
  whatsIncluded: z.string().optional(),
  whatsNotIncluded: z.string().optional(),
  retailPrice: z.coerce.number().min(0, "Price must be positive"),
  currency: z.string().default("LKR"),
  durationValue: z.coerce.number().optional().default(1),
  durationUnit: z.string().default("hours"),
  languagesOffered: z.array(z.string()).optional(),
  languagesOther: z.string().optional(),
  groupSizeMin: z.coerce.number().optional().default(1),
  groupSizeMax: z.coerce.number().optional().default(1),
  dailyCapacity: z.coerce.number().optional().default(1),
  operatingDays: z.array(z.string()).optional(),
  locationsCovered: z.array(z.string()).optional(),
  advanceBooking: z.string().optional(),
  advanceBookingOther: z.string().optional(),
  notSuitableFor: z.string().optional(),
  importantInfo: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  accessibilityInfo: z.string().optional(),
  status: z.string().default("active"),
  operatingHoursFrom: z.string().optional(),
  operatingHoursFromPeriod: z.string().default("AM"),
  operatingHoursTo: z.string().optional(),
  operatingHoursToPeriod: z.string().default("PM"),
  blackoutDates: z.array(z.any()).optional().default([]),
  blackoutHolidays: z.boolean().default(false),
  blackoutWeekends: z.boolean().default(false),
  imageUrls: z.array(z.string()).optional().default([]),
  serviceTimeSlots: z.array(z.object({
    id: z.string().optional(),
    time: z.string(),
    capacity: z.coerce.number().min(1)
  })).optional().default([]),
  discountType: z.string().optional(),
  percentageOff: z.coerce.number().optional(),
  amountOff: z.coerce.number().optional(),
  promotions: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.serviceCategory !== "Merchant") {
    if ((data.durationValue || 0) < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Duration is required",
        path: ["durationValue"],
      });
    }
    if ((data.groupSizeMax || 0) < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum capacity is required",
        path: ["groupSizeMax"],
      });
    }
  }
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">Active</Badge>;
    case "approved":
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/20">Approved</Badge>;
    case "pending":
      return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">Pending Review</Badge>;
    case "freeze":
      return <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20">Frozen</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-500/20">Rejected</Badge>;
    case "draft":
      return <Badge variant="outline" className="bg-slate-500/10 text-slate-700 border-slate-500/20">Draft</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const ServiceImageSlideshow = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <LayoutGrid className="h-8 w-8 text-muted-foreground/50" />
      </div>
    );
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-full group/slider overflow-hidden">
      <img
        src={images[currentIndex]}
        alt={`Service image ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {images.length > 1 && (
        <>
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5 z-10">
            {images.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/50'}`}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/20 text-white opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/40"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/20 text-white opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/40"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

const ServicesList = ({ services: initialServices, onRefresh }: { services: any[], onRefresh?: () => void }) => {
  const [services, setServices] = useState(initialServices || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    setServices(initialServices || []);
  }, [initialServices]);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: "",
      serviceCategory: "",
      serviceCategoryOther: "",
      shortDescription: "",
      whatsIncluded: "",
      whatsNotIncluded: "",
      retailPrice: 0,
      currency: "LKR",
      durationValue: 1,
      durationUnit: "hours",
      languagesOffered: [],
      languagesOther: "",
      groupSizeMin: 1,
      groupSizeMax: 1,
      dailyCapacity: 1,
      operatingDays: [],
      locationsCovered: [],
      advanceBooking: "",
      advanceBookingOther: "",
      notSuitableFor: "",
      importantInfo: "",
      cancellationPolicy: "",
      accessibilityInfo: "",
      status: "active",
      operatingHoursFrom: "",
      operatingHoursFromPeriod: "AM",
      operatingHoursTo: "",
      operatingHoursToPeriod: "PM",
      blackoutDates: [],
      blackoutHolidays: false,
      blackoutWeekends: false,
      imageUrls: [],
      serviceTimeSlots: [],
      discountType: "",
      percentageOff: 0,
      amountOff: 0,
      promotions: "",
    },
  });

  const { fields: slotFields, append: appendSlot, remove: removeSlot } = useFieldArray({
    control: form.control,
    name: "serviceTimeSlots"
  });

  const resetForm = () => {
    form.reset({
      serviceName: "",
      serviceCategory: "",
      serviceCategoryOther: "",
      shortDescription: "",
      whatsIncluded: "",
      whatsNotIncluded: "",
      retailPrice: 0,
      currency: "LKR",
      durationValue: 1,
      durationUnit: "hours",
      languagesOffered: [],
      languagesOther: "",
      groupSizeMin: 1,
      groupSizeMax: 1,
      dailyCapacity: 1,
      operatingDays: [],
      locationsCovered: [],
      advanceBooking: "",
      advanceBookingOther: "",
      notSuitableFor: "",
      importantInfo: "",
      cancellationPolicy: "",
      accessibilityInfo: "",
      status: "active",
      operatingHoursFrom: "",
      operatingHoursFromPeriod: "AM",
      operatingHoursTo: "",
      operatingHoursToPeriod: "PM",
      blackoutDates: [],
      blackoutHolidays: false,
      blackoutWeekends: false,
      imageUrls: [],
      serviceTimeSlots: [],
      discountType: "",
      percentageOff: 0,
      amountOff: 0,
      promotions: "",
    });
    setEditingService(null);
    setSelectedFiles([]);
    setPreviews([]);
  };

  const onAddOpen = () => {
    resetForm();
    setIsAdding(true);
  };

  const onEditOpen = (service: any) => {
    setEditingService(service);
    form.reset({
      serviceName: service.service_name || service.serviceName || "",
      serviceCategory: service.service_category || service.serviceCategory || "",
      serviceCategoryOther: service.service_category_other || service.serviceCategoryOther || "",
      shortDescription: service.short_description || service.shortDescription || "",
      whatsIncluded: service.whats_included || service.whatsIncluded || "",
      whatsNotIncluded: service.whats_not_included || service.whatsNotIncluded || "",
      retailPrice: service.retail_price || service.retailPrice || 0,
      currency: service.currency || "LKR",
      durationValue: service.duration_value || service.durationValue || 1,
      durationUnit: service.duration_unit || service.durationUnit || "hours",
      languagesOffered: service.languages_offered || service.languagesOffered || [],
      languagesOther: service.languages_other || service.languagesOther || "",
      groupSizeMin: service.group_size_min || service.groupSizeMin || 1,
      groupSizeMax: service.group_size_max || service.groupSizeMax || 1,
      dailyCapacity: service.daily_capacity || service.dailyCapacity || 1,
      operatingDays: service.operating_days || service.operatingDays || [],
      locationsCovered: service.locations_covered || service.locationsCovered || [],
      advanceBooking: service.advance_booking || service.advanceBooking || "",
      advanceBookingOther: service.advance_booking_other || service.advanceBookingOther || "",
      notSuitableFor: service.not_suitable_for || service.notSuitableFor || "",
      importantInfo: service.important_info || service.importantInfo || "",
      cancellationPolicy: service.cancellation_policy || service.cancellationPolicy || "",
      accessibilityInfo: service.accessibility_info || service.accessibilityInfo || "",
      status: service.status || "active",
      operatingHoursFrom: service.operating_hours_from || service.operatingHoursFrom || "",
      operatingHoursFromPeriod: service.operating_hours_from_period || service.operatingHoursFromPeriod || "AM",
      operatingHoursTo: service.operating_hours_to || service.operatingHoursTo || "",
      operatingHoursToPeriod: service.operating_hours_to_period || service.operatingHoursToPeriod || "PM",
      blackoutDates: service.blackout_dates || service.blackoutDates || [],
      blackoutHolidays: service.blackout_holidays || service.blackoutHolidays || false,
      blackoutWeekends: service.blackout_weekends || service.blackoutWeekends || false,
      imageUrls: service.image_urls || service.imageUrls || [],
      serviceTimeSlots: service.service_time_slots || service.serviceTimeSlots || [],
      discountType: service.discount_type || service.discountType || "",
      percentageOff: service.percentage_off || service.percentageOff || 0,
      amountOff: service.amount_off || service.amountOff || 0,
      promotions: service.promotions || service.promotions || "",
    });
    setPreviews(service.image_urls || service.imageUrls || []);
    setSelectedFiles([]);
  };

  async function onSubmit(values: ServiceFormValues) {
    setIsSaving(true);
    try {
      let response;
      if (editingService) {
        response = await vendorService.updateService(editingService.id, values);

        // Check if update requires approval
        if (response.pending_approval) {
          toast.success(response.message || "Service update request submitted for approval");
          setEditingService(null);
          if (onRefresh) onRefresh();
          return;
        }

        if (response.success) {
          toast.success("Service updated successfully");
          setEditingService(null);
        }
      } else {
        response = await vendorService.createService(values);

        if (response.pending_approval) {
          toast.success(response.message || "New service request submitted for approval. You will be notified once it is reviewed.");
          setIsAdding(false);
          if (onRefresh) onRefresh();
          return;
        }

        if (response.success) {
          toast.success("Service created successfully");
          setIsAdding(false);
        }
      }

      if (onRefresh) onRefresh();

      // Handle file uploads if any (media updates are direct)
      const serviceId = editingService?.id || response.service?.id;
      if (serviceId && selectedFiles.length > 0) {
        toast.info("Uploading images...");
        for (const file of selectedFiles) {
          try {
            await vendorService.uploadFile(file, "none", "service_image", undefined, serviceId);
          } catch (uploadErr) {
            console.error("Failed to upload image:", uploadErr);
          }
        }
        toast.success("All images uploaded");
        if (onRefresh) onRefresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save service");
    } finally {
      setIsSaving(false);
    }
  }

  const handleStatusChange = async (serviceId: string, status: string) => {
    try {
      setIsSaving(true);
      await vendorService.updateServiceStatus(serviceId, status);
      toast.success(`Service status updated to ${status}`);
      if (onRefresh) onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update service status");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    setIsDeleting(true);
    try {
      const response = await vendorService.deleteService(id);
      if (response.success) {
        toast.success("Service deleted successfully");
        setEditingService(null);
        if (onRefresh) onRefresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete service");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">My Services ({services.length})</h3>
          <p className="text-sm text-muted-foreground">Manage your tour packages and experiences</p>
        </div>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={onAddOpen}>
              <Plus className="h-4 w-4" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>Create a new tour or experience for your customers</DialogDescription>
            </DialogHeader>
            <ServiceForm
              form={form}
              onSubmit={onSubmit}
              isSaving={isSaving}
              editingService={editingService}
              slotFields={slotFields}
              appendSlot={appendSlot}
              removeSlot={removeSlot}
              previews={previews}
              setPreviews={setPreviews}
              setSelectedFiles={setSelectedFiles}
            />
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
        <Card className="border-dashed border-2 py-12">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-muted rounded-full">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">No services found</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                You haven't added any services yet. Start by creating your first tour or experience.
              </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={onAddOpen}>
              <Plus className="h-4 w-4" />
              Add Your First Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const name = service.service_name || service.serviceName;
            const category = service.service_category || service.serviceCategory;
            const shortDesc = service.short_description || service.shortDescription;
            const images = service.gallery_images || service.serviceImages || service.image_urls || [];
            const price = service.retail_price || service.retailPrice || 0;
            const currency = service.currency || "LKR";

            return (
              <Card key={service.id} className="overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  <ServiceImageSlideshow
                    images={images.length > 0
                      ? images.slice(0, 3)
                      : ["https://images.unsplash.com/photo-1586613835341-d7379c45d403?w=400"]}
                  />
                  <div className="absolute top-3 left-3 z-20">
                    {getStatusBadge(service.status || "active")}
                  </div>
                </div>

                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[10px] uppercase tracking-wider font-bold">
                      {category || "General"}
                    </Badge>
                  </div>

                  <h4 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {name}
                  </h4>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                    {shortDesc || "Explore this unique experience in Sri Lanka."}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                    <div className="flex flex-wrap gap-2">
                      <Dialog open={editingService?.id === service.id} onOpenChange={(open) => !open && setEditingService(null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 border-primary/20 text-primary" onClick={() => onEditOpen(service)}>
                            <Eye className="h-4 w-4" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl">
                          <div className="sticky top-0 bg-background/95 backdrop-blur-md z-30 p-6 border-b flex items-center justify-between">
                            <div>
                              <DialogTitle className="text-2xl font-bold">{name}</DialogTitle>
                              <DialogDescription>Full details and configuration for this service</DialogDescription>
                            </div>
                            <div className="flex gap-2 mr-6">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleDelete(service.id)}
                                disabled={isDeleting}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                                Delete
                              </Button>
                              <Button
                                size="sm"
                                className="gap-2 shadow-lg shadow-primary/20"
                                onClick={form.handleSubmit(onSubmit)}
                                disabled={isSaving}
                              >
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit className="h-4 w-4" />}
                                Save Changes
                              </Button>
                            </div>
                          </div>

                          <div className="p-8">
                            <ServiceForm
                              form={form}
                              onSubmit={onSubmit}
                              isSaving={isSaving}
                              editingService={editingService}
                              slotFields={slotFields}
                              appendSlot={appendSlot}
                              removeSlot={removeSlot}
                              previews={previews}
                              setPreviews={setPreviews}
                              setSelectedFiles={setSelectedFiles}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>

                      {service.status === "approved" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white rounded-lg gap-1.5"
                          onClick={() => handleStatusChange(service.id, "active")}
                          disabled={isSaving}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Activate
                        </Button>
                      )}

                      {service.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-amber-600 border-amber-200 hover:bg-amber-50 rounded-lg gap-1.5"
                          onClick={() => handleStatusChange(service.id, "freeze")}
                          disabled={isSaving}
                        >
                          <Ban className="h-3.5 w-3.5" />
                          Freeze
                        </Button>
                      )}

                      {service.status === "freeze" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50 rounded-lg gap-1.5"
                          onClick={() => handleStatusChange(service.id, "active")}
                          disabled={isSaving}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Resume
                        </Button>
                      )}
                    </div>

                    <div className="flex flex-col items-end">
                      <p className="text-lg font-black text-foreground">
                        {currency} {price?.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">per person</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ServiceForm = ({
  form,
  onSubmit,
  isSaving,
  editingService,
  slotFields,
  appendSlot,
  removeSlot,
  previews,
  setPreviews,
  setSelectedFiles
}: {
  form: any,
  onSubmit: any,
  isSaving: boolean,
  editingService: any,
  slotFields: any[],
  appendSlot: any,
  removeSlot: any,
  previews: string[],
  setPreviews: (val: string[] | ((prev: string[]) => string[])) => void,
  setSelectedFiles: (val: File[] | ((prev: File[]) => File[])) => void
}) => {
  // State for pending update requests and field locking
  const [pendingRequests, setPendingRequests] = useState<UpdateRequest[]>([]);
  const [unlockedFields, setUnlockedFields] = useState<Record<string, boolean>>({});

  // Fetch pending requests when editing a service
  useEffect(() => {
    if (editingService?.id) {
      fetchPendingRequests();
    }
  }, [editingService?.id]);

  const fetchPendingRequests = async () => {
    try {
      const response = await chatService.getServiceUpdateRequests(
        editingService?.id,
        'pending'
      );
      setPendingRequests(response.requests || []);
    } catch (error) {
      console.error('Failed to fetch pending requests:', error);
    }
  };

  const getPendingValue = (fieldName: string) => {
    if (!pendingRequests || pendingRequests.length === 0) return null;

    const dbKey = chatService.getDbKey(fieldName);
    for (const request of pendingRequests) {
      if (request.requested_data && dbKey in request.requested_data) {
        return request.requested_data[dbKey];
      }
    }
    return null;
  };

  const hasPendingUpdate = (fieldName: string): boolean => {
    return getPendingValue(fieldName) !== null;
  };

  const toggleFieldLock = (fieldName: string) => {
    setUnlockedFields(prev => {
      const newState = { ...prev, [fieldName]: !prev[fieldName] };

      // If locking the field, revert to initial value
      if (!newState[fieldName] && editingService) {
        const dbKey = chatService.getDbKey(fieldName);
        const initialValue = editingService[dbKey] || editingService[fieldName];
        form.setValue(fieldName, initialValue);
      }

      return newState;
    });
  };

  // EditableLabel component - shows edit/lock icon
  const EditableLabel = ({ label, fieldName }: { label: string; fieldName: string }) => {
    const isLocked = !unlockedFields[fieldName];
    const hasPending = hasPendingUpdate(fieldName);

    return (
      <FormLabel className="flex items-center justify-between group">
        <span className="flex items-center gap-2">
          {label}
          {hasPending && (
            <AlertCircle className="h-3 w-3 text-amber-500" />
          )}
        </span>
        <button
          type="button"
          onClick={() => toggleFieldLock(fieldName)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
        >
          {isLocked ? (
            <Lock className="h-3 w-3 text-muted-foreground" />
          ) : (
            <Edit2 className="h-3 w-3 text-primary" />
          )}
        </button>
      </FormLabel>
    );
  };

  // PendingValueIndicator component - shows pending changes
  const PendingValueIndicator = ({ fieldName }: { fieldName: string }) => {
    const pendingValue = getPendingValue(fieldName);
    if (pendingValue === null || pendingValue === undefined) return null;

    const displayValue = Array.isArray(pendingValue)
      ? pendingValue.join(', ')
      : typeof pendingValue === 'object'
        ? JSON.stringify(pendingValue)
        : String(pendingValue);

    return (
      <div className="mt-1 p-2 bg-amber-50 border border-amber-200 rounded-md">
        <p className="text-xs text-amber-800 font-medium flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Pending Update
        </p>
        <p className="text-xs text-amber-700 mt-0.5 font-mono break-all">
          {displayValue}
        </p>
      </div>
    );
  };

  const watchCategory = form.watch("serviceCategory");
  const watchAdvanceBooking = form.watch("advanceBooking");
  const watchOperatingAreas = form.watch("locationsCovered") || [];
  const watchOperatingDays = form.watch("operatingDays") || [];
  const watchLanguages = form.watch("languagesOffered") || [];
  const watchBlackoutDates = form.watch("blackoutDates") || [];

  const toggleArrayItem = (fieldName: string, item: string) => {
    const current = form.getValues(fieldName) || [];
    const updated = current.includes(item)
      ? current.filter((i: string) => i !== item)
      : [...current, item];
    form.setValue(fieldName, updated);
  };

  const handleBlackoutDateToggle = (date: Date) => {
    const currentDates = form.getValues("blackoutDates") || [];
    const isSelected = currentDates.some((d: any) =>
      new Date(d).toDateString() === date.toDateString()
    );

    const updated = isSelected
      ? currentDates.filter((d: any) => new Date(d).toDateString() !== date.toDateString())
      : [...currentDates, date];

    form.setValue("blackoutDates", updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const currentUrls = form.getValues("imageUrls") || [];
    if (index < currentUrls.length) {
      // It's an existing image
      const updated = currentUrls.filter((_: any, i: number) => i !== index);
      form.setValue("imageUrls", updated);
      setPreviews(updated);
    } else {
      // It's a newly selected file
      const fileIndex = index - currentUrls.length;
      setSelectedFiles((prev) => prev.filter((_, i) => i !== fileIndex));
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="w-full flex h-auto flex-wrap md:grid md:grid-cols-6 mb-6 gap-1 bg-muted/50 p-1">
            <TabsTrigger value="basics" className="flex-1 min-w-[100px]">Basics</TabsTrigger>
            <TabsTrigger value="availability" className="flex-1 min-w-[100px]">Availability</TabsTrigger>
            <TabsTrigger value="slots" className="flex-1 min-w-[100px]">Time Slots</TabsTrigger>
            <TabsTrigger value="pricing" className="flex-1 min-w-[100px]">
              {watchCategory === "Merchant" ? "Discount" : "Pricing"}
            </TabsTrigger>
            <TabsTrigger value="media" className="flex-1 min-w-[100px]">Media</TabsTrigger>
            <TabsTrigger value="policies" className="flex-1 min-w-[100px]">Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serviceName"
                render={({ field }) => (
                  <FormItem>
                    <EditableLabel label="Service Name *" fieldName="serviceName" />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Sunset Beach Tour"
                        disabled={!unlockedFields["serviceName"]}
                        className={!unlockedFields["serviceName"] ? "bg-muted/30 border-transparent" : "border-primary/50"}
                      />
                    </FormControl>
                    <PendingValueIndicator fieldName="serviceName" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceCategory"
                render={({ field }) => (
                  <FormItem>
                    <EditableLabel label="Category *" fieldName="serviceCategory" />
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!unlockedFields["serviceCategory"]}>
                      <FormControl>
                        <SelectTrigger className={!unlockedFields["serviceCategory"] ? "bg-muted/30 border-transparent" : "border-primary/50"}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <PendingValueIndicator fieldName="serviceCategory" />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {watchCategory === "Other" && (
              <FormField
                control={form.control}
                name="serviceCategoryOther"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specify Category</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Please specify" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Describe what makes your experience special (min 100 characters)" rows={4} />
                  </FormControl>
                  <div className="flex justify-between items-center mt-1">
                    <p className={`text-[10px] ${(field.value?.length || 0) < 100 ? "text-destructive" : "text-muted-foreground"}`}>
                      {field.value?.length || 0} / 100 minimum characters
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="whatsIncluded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What's Included</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="List items incl." rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsNotIncluded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What's Not Included</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="List items excl." rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <FormLabel>Languages Offered</FormLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang}
                    type="button"
                    variant={watchLanguages.includes(lang) ? "default" : "outline"}
                    size="sm"
                    className="h-9 justify-start"
                    onClick={() => toggleArrayItem("languagesOffered", lang)}
                  >
                    {lang}
                  </Button>
                ))}
              </div>
              {watchLanguages.includes("Other") && (
                <FormField
                  control={form.control}
                  name="languagesOther"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="List other languages" className="mt-2" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="availability" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="durationValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="4"
                          disabled={watchCategory === "Merchant"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="durationUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger disabled={watchCategory === "Merchant"}>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="dailyCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Capacity / Slots</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="groupSizeMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Group Size</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="1"
                        disabled={watchCategory === "Merchant"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="groupSizeMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Group Size</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="12"
                        disabled={watchCategory === "Merchant"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3">
              <FormLabel>Operating Days</FormLabel>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day) => (
                  <Button
                    key={day}
                    type="button"
                    variant={watchOperatingDays.includes(day) ? "default" : "outline"}
                    size="sm"
                    className="h-10 px-0"
                    onClick={() => toggleArrayItem("operatingDays", day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <FormLabel>Operating Hours From</FormLabel>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="operatingHoursFrom"
                    render={({ field }) => (
                      <FormControl>
                        <Input {...field} type="number" min="1" max="12" className="flex-1" />
                      </FormControl>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="operatingHoursFromPeriod"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <FormLabel>Operating Hours To</FormLabel>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="operatingHoursTo"
                    render={({ field }) => (
                      <FormControl>
                        <Input {...field} type="number" min="1" max="12" className="flex-1" />
                      </FormControl>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="operatingHoursToPeriod"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <FormLabel className="text-base font-bold">Blackout Dates</FormLabel>
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="blackoutHolidays"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">Block Public Holidays</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <FormLabel className="text-sm">Specific Dates</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal h-10">
                      <Calendar className="mr-2 h-4 w-4" />
                      {watchBlackoutDates.length > 0 ? `${watchBlackoutDates.length} date(s) selected` : "Select dates"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="multiple"
                      selected={watchBlackoutDates.map((d: any) => new Date(d))}
                      onSelect={(dates) => form.setValue("blackoutDates", dates || [])}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {watchBlackoutDates.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {watchBlackoutDates.slice(0, 10).map((date: any, idx: number) => (
                      <Badge key={idx} variant="secondary" className="gap-1 pr-1">
                        {format(new Date(date), "MMM d, yyyy")}
                        <button type="button" onClick={() => handleBlackoutDateToggle(new Date(date))}>
                          <X className="h-3 w-3 hover:text-destructive" />
                        </button>
                      </Badge>
                    ))}
                    {watchBlackoutDates.length > 10 && <span className="text-xs text-muted-foreground">+{watchBlackoutDates.length - 10} more</span>}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="slots" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-2">
              <FormLabel className="text-base font-bold">Standard Daily Time Slots</FormLabel>
              <Button type="button" variant="outline" size="sm" onClick={() => appendSlot({ time: "09:00", capacity: form.getValues("groupSizeMax") || 10 })}>
                <Plus className="h-4 w-4 mr-2" /> Add Slot
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Define the default daily time slots for this service. You can adjust capacity per slot.
            </p>

            <div className="space-y-4">
              {slotFields.map((field: any, index: number) => (
                <div key={field.id} className="grid grid-cols-12 gap-3 items-end border p-3 rounded-lg bg-muted/20">
                  <div className="col-span-12 sm:col-span-5">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Start Time</Label>
                    <Input
                      type="time"
                      {...form.register(`serviceTimeSlots.${index}.time`)}
                      className="h-9"
                    />
                  </div>
                  <div className="col-span-10 sm:col-span-5">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Capacity</Label>
                    <Input
                      type="number"
                      {...form.register(`serviceTimeSlots.${index}.capacity`)}
                      className="h-9"
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSlot(index)}
                      className="h-9 w-9 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {slotFields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-xl bg-muted/10">
                  <Clock className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No standard time slots defined yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {watchCategory === "Merchant" ? (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="discountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Type <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select discount type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Percentage">Percentage Off</SelectItem>
                          <SelectItem value="Amount">Flat Amount Off</SelectItem>
                          <SelectItem value="Promotions">Special Promotions / Bundles</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("discountType") === "Percentage" && (
                  <FormField
                    control={form.control}
                    name="percentageOff"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Percentage Off (%)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="e.g., 15" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {form.watch("discountType") === "Amount" && (
                  <FormField
                    control={form.control}
                    name="amountOff"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount Off ({form.watch("currency") || "LKR"})</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="e.g., 500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="promotions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Promotion Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Describe the discount or promotion details" rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || "LKR"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((curr) => (
                            <SelectItem key={curr.code} value={curr.code}>{curr.code} - {curr.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="retailPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Retail Price <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-sm text-muted-foreground font-medium">{form.watch("currency") || "LKR"}</span>
                          <Input {...field} type="number" step="0.01" className="pl-14" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="locationsCovered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Districts Covered</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 border rounded-lg p-4 max-h-48 overflow-y-auto">
                    {districts.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={`dist-${area}`}
                          checked={watchOperatingAreas.includes(area)}
                          onCheckedChange={() => toggleArrayItem("locationsCovered", area)}
                        />
                        <label htmlFor={`dist-${area}`} className="text-xs font-medium cursor-pointer">{area}</label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/20">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Service Status</FormLabel>
                    <FormDescription>
                      Make this service visible to customers.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === "active"}
                      onCheckedChange={(checked) => field.onChange(checked ? "active" : "paused")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="media" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-4">
              <FormLabel className="text-base font-bold">Service Media</FormLabel>
              <p className="text-xs text-muted-foreground">
                Upload up to 3 high-quality images that showcase this experience.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {previews.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border bg-muted group">
                    <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {previews.length < 3 && (
                  <label className="border-2 border-dashed rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all group">
                    <div className="bg-primary/10 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-primary">Upload Image</span>
                    <span className="text-[10px] text-muted-foreground mt-1">PNG, JPG up to 5MB</span>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="advanceBooking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advance Booking Required</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select requirement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {advanceBookingOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchAdvanceBooking === "Other" && (
                <FormField
                  control={form.control}
                  name="advanceBookingOther"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specify Timing</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 5 days" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="cancellationPolicy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cancellation Policy</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Describe refund and cancellation terms" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="notSuitableFor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Not Suitable For</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="List restrictions" rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accessibilityInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accessibility Info</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Disability access info" rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="importantInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Important Info</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="General warnings or tips" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-4 border-t sticky bottom-0 bg-background/95 backdrop-blur-sm z-50 py-4 -mx-6 px-6">
          <Button type="button" variant="ghost" onClick={() => form.reset()} className="mr-auto">Reset</Button>
          <Button type="submit" className="min-w-[150px] shadow-lg shadow-primary/20" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingService ? "Update Service" : "Create Service"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ServicesList;
