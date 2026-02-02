import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, MoreVertical, Star, MapPin, Clock, Users, ChevronLeft, ChevronRight, LayoutGrid, Info, Tag, FileText, Image as ImageIcon } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Active</Badge>;
    case "draft":
      return <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">Draft</Badge>;
    case "paused":
      return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50/50">Paused</Badge>;
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

const ServicesList = ({ services: initialServices }: { services: any[] }) => {
  const [services, setServices] = useState(initialServices || []);

  useEffect(() => {
    setServices(initialServices || []);
  }, [initialServices]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Active</Badge>;
      case "draft":
        return <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">Draft</Badge>;
      case "paused":
        return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50/50">Paused</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">My Services</h3>
          <p className="text-sm text-muted-foreground">Manage your tour packages and experiences</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>Create a new tour or experience for your customers</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceName">Service Name</Label>
                <Input id="serviceName" placeholder="Enter service name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="e.g., Cultural Tours" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (LKR)</Label>
                  <Input id="price" type="number" placeholder="15000" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your service..." rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" placeholder="e.g., 4 hours" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Max Capacity</Label>
                  <Input id="capacity" type="number" placeholder="12" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Publish Immediately</Label>
                  <p className="text-xs text-muted-foreground">Make this service visible to customers</p>
                </div>
                <Switch />
              </div>
              <Button className="w-full mt-2">Create Service</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          // Robust property access handles both camelCase (frontend) and snake_case (backend)
          const name = service.service_name || service.serviceName;
          const category = service.service_category || service.serviceCategory;
          const shortDesc = service.short_description || service.shortDescription;
          const images = service.gallery_images || service.serviceImages || [];
          const price = service.retail_price || service.retailPrice || 0;
          const durationVal = service.duration_value || service.durationValue || 0;
          const durationUn = service.duration_unit || service.durationUnit || "hours";
          const maxCap = service.group_size_max || service.groupSizeMax || 0;
          const currency = service.currency || "LKR";

          return (
            <Card key={service.id} className="overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 group flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <ServiceImageSlideshow
                  images={images.length > 0
                    ? images.slice(0, 3)
                    : [service.image_url || "https://images.unsplash.com/photo-1586613835341-d7379c45d403?w=400"]}
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 border-primary/20 text-primary">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
                      <div className="sticky top-0 bg-background/95 backdrop-blur-md z-30 p-6 border-b flex items-center justify-between">
                        <div>
                          <DialogTitle className="text-2xl font-bold">{name}</DialogTitle>
                          <DialogDescription>Full details and configuration for this service</DialogDescription>
                        </div>
                        <div className="flex gap-2 mr-6">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Trash2 className="h-4 w-4 text-destructive" />
                            Delete
                          </Button>
                          <Button size="sm" className="gap-2 shadow-lg shadow-primary/20">
                            <Edit className="h-4 w-4" />
                            Save Changes
                          </Button>
                        </div>
                      </div>

                      <div className="p-8 space-y-10">
                        {/* Base Info */}
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div className="grid gap-2">
                              <Label className="text-sm font-semibold flex items-center gap-2">
                                <Info className="h-4 w-4 text-primary" />
                                Service Name *
                              </Label>
                              <Input defaultValue={name} placeholder="e.g., Sunset Beach Tour" className="bg-muted/30 border-none focus-visible:ring-1" />
                            </div>

                            <div className="grid gap-2">
                              <Label className="text-sm font-semibold flex items-center gap-2">
                                <Tag className="h-4 w-4 text-primary" />
                                Service Category *
                              </Label>
                              <Input defaultValue={category} placeholder="Select category" className="bg-muted/30 border-none focus-visible:ring-1" />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <Label className="text-sm font-semibold flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              Short Description *
                            </Label>
                            <Textarea
                              defaultValue={shortDesc}
                              placeholder="Briefly describe what makes this service special..."
                              className="h-full min-h-[120px] bg-muted/30 border-none focus-visible:ring-1 resize-none"
                            />
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 bg-muted/20 rounded-2xl border border-border/50">
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Duration</Label>
                            <p className="text-sm font-semibold">{durationVal} {durationUn}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Max Capacity</Label>
                            <p className="text-sm font-semibold">{maxCap} people</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Price</Label>
                            <p className="text-sm font-semibold text-primary">{currency} {price?.toLocaleString()}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Bookings</Label>
                            <p className="text-sm font-semibold">0 Total</p>
                          </div>
                        </div>

                        {/* Service Media */}
                        <div className="space-y-4 pt-4 border-t">
                          <Label className="text-sm font-semibold flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-primary" />
                            Service Gallery (3 Images)
                          </Label>
                          <div className="grid grid-cols-3 gap-4">
                            {images.slice(0, 3).map((url: string, i: number) => (
                              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border group">
                                <img src={url} className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button variant="ghost" size="icon" className="text-white hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                            {images.length < 3 && (
                              <div className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-all cursor-pointer">
                                <Plus className="h-6 w-6 text-primary" />
                                <span className="text-[10px] font-medium text-muted-foreground">Upload Image {images.length + 1}/3</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

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
    </div>
  );
};

export default ServicesList;
