import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Image, Video, X, FileImage, Plus, Trash2 } from "lucide-react";
import SupportContact from "./SupportContact";
import { Button } from "@/components/ui/button";

interface Step5Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const Step5MediaContent = ({ formData, updateFormData }: Step5Props) => {
  const services = formData.services || [];
  
  const handleFileChange = (field: string, files: FileList | null) => {
    if (!files) return;
    
    if (field === "galleryImages") {
      const currentFiles = formData.galleryImages || [];
      const newFiles = Array.from(files);
      updateFormData(field, [...currentFiles, ...newFiles]);
    } else {
      updateFormData(field, files[0]);
    }
  };

  const handleServiceImageChange = (serviceIndex: number, files: FileList | null) => {
    if (!files) return;
    
    const updatedServices = [...services];
    const currentImages = updatedServices[serviceIndex]?.serviceImages || [];
    const newImages = Array.from(files);
    updatedServices[serviceIndex] = {
      ...updatedServices[serviceIndex],
      serviceImages: [...currentImages, ...newImages].slice(0, 3) // Max 3 per service
    };
    updateFormData("services", updatedServices);
  };

  const removeServiceImage = (serviceIndex: number, imageIndex: number) => {
    const updatedServices = [...services];
    const currentImages = updatedServices[serviceIndex]?.serviceImages || [];
    const updatedImages = currentImages.filter((_: File, i: number) => i !== imageIndex);
    updatedServices[serviceIndex] = {
      ...updatedServices[serviceIndex],
      serviceImages: updatedImages
    };
    updateFormData("services", updatedServices);
  };

  const removeGalleryImage = (index: number) => {
    const current = formData.galleryImages || [];
    const updated = current.filter((_: File, i: number) => i !== index);
    updateFormData("galleryImages", updated);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Photos & Descriptions
        </h2>
        <p className="text-muted-foreground">
          Show off what you do best. Upload photos for each service, general gallery images, and highlight what makes your experience special.
        </p>
      </div>

      {/* Service-Specific Images */}
      {services.map((service: any, index: number) => (
        <div key={index} className="bg-card rounded-2xl p-6 shadow-soft border border-border space-y-6">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {service.serviceName || `Service ${index + 1}`} - Images
          </h3>
          <p className="text-sm text-muted-foreground">
            Upload up to 3 images specific to this service. These will appear on the service detail page.
          </p>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Existing Service Images */}
              {(service.serviceImages || []).map((file: File, imgIndex: number) => (
                <div key={imgIndex} className="relative aspect-video rounded-xl overflow-hidden bg-muted group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`${service.serviceName || 'Service'} image ${imgIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeServiceImage(index, imgIndex)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Upload Button for Service Images */}
              {(service.serviceImages?.length || 0) < 3 && (
                <label className="aspect-video border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-muted/30 transition-all flex flex-col items-center justify-center">
                  <Image className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground text-center px-2">
                    Add service image
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {(service.serviceImages?.length || 0)} of 3
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleServiceImageChange(index, e.target.files)}
                  />
                </label>
              )}
            </div>
            
            {service.serviceImages?.length === 0 && (
              <p className="text-xs text-muted-foreground italic">
                No images added for this service yet. Add at least 1 image for better engagement.
              </p>
            )}
          </div>
        </div>
      ))}

      {/* General Business Images Section */}
      <div className="space-y-6">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            General Business Images
          </h3>
          <p className="text-sm text-muted-foreground">
            These images will appear on your overall business/profile page.
          </p>
        </div>

        {/* Cover Image */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Cover Image <span className="text-destructive">*</span>
          </Label>
          <p className="text-xs text-muted-foreground">
            This will be the main image travelers see on your business page. Recommended: 1200x800px or larger.
          </p>
          
          {formData.coverImage ? (
            <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden bg-muted">
              <img
                src={URL.createObjectURL(formData.coverImage)}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => updateFormData("coverImage", null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full max-w-md aspect-video border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-muted/30 transition-all">
              <Image className="w-12 h-12 text-muted-foreground mb-3" />
              <span className="text-sm font-medium text-muted-foreground">
                Click to upload cover image
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                JPG, PNG, WEBP (max 10MB)
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange("coverImage", e.target.files)}
              />
            </label>
          )}
        </div>

        {/* Gallery Images */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Business Gallery Images
          </Label>
          <p className="text-xs text-muted-foreground">
            Add 3-6 additional photos to showcase your business, location, or general atmosphere.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Existing Gallery Images */}
            {(formData.galleryImages || []).map((file: File, index: number) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-muted group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Upload Button */}
            {(formData.galleryImages || []).length < 6 && (
              <label className="aspect-square border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-muted/30 transition-all flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground text-center px-2">
                  Add gallery photo
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange("galleryImages", e.target.files)}
                />
              </label>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {(formData.galleryImages || []).length} of 6 images uploaded
          </p>
        </div>

        {/* Logo / Branding */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Logo / Branding <span className="text-destructive">*</span>
          </Label>
          <p className="text-xs text-muted-foreground">
            Upload your business logo for brand consistency.
          </p>

          {formData.logo ? (
            <div className="flex items-center gap-4 p-4 bg-sunset-light rounded-xl border border-primary/20">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-card">
                <img
                  src={URL.createObjectURL(formData.logo)}
                  alt="Logo preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{formData.logo.name}</p>
              </div>
              <button
                type="button"
                onClick={() => updateFormData("logo", null)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-4 p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-muted/30 transition-all">
              <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
                <FileImage className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground block">
                  Upload your logo
                </span>
                <span className="text-xs text-muted-foreground">
                  PNG, SVG, JPG (max 5MB)
                </span>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange("logo", e.target.files)}
              />
            </label>
          )}
        </div>
      </div>

      {/* Optional: Promo Video */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Short Promo Video (Optional)
        </Label>
        <p className="text-xs text-muted-foreground">
          Add a short video (30-60 seconds) to give travelers a preview of your business or experience.
        </p>

        {formData.promoVideo ? (
          <div className="flex items-center gap-3 p-4 bg-palm-light rounded-xl border border-accent/20">
            <Video className="w-6 h-6 text-accent" />
            <div className="flex-1">
              <p className="font-medium text-sm">{formData.promoVideo.name}</p>
              <p className="text-xs text-muted-foreground">
                {(formData.promoVideo.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateFormData("promoVideo", null)}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-muted/30 transition-all">
            <Video className="w-10 h-10 text-muted-foreground mb-2" />
            <span className="text-sm font-medium text-muted-foreground">
              Click to upload video
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              MP4, MOV (max 100MB)
            </span>
            <input
              type="file"
              className="hidden"
              accept="video/*"
              onChange={(e) => handleFileChange("promoVideo", e.target.files)}
            />
          </label>
        )}
      </div>

      {/* Marketing Permission */}
      <div className="bg-muted rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="marketingPermission"
            checked={formData.marketingPermission || false}
            onCheckedChange={(checked) => updateFormData("marketingPermission", checked)}
            className="mt-1"
          />
          <div>
            <Label htmlFor="marketingPermission" className="text-sm font-medium cursor-pointer">
              Grant marketing permission <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              I grant LankaPass permission to use my uploaded images, logos, and videos for marketing purposes on the platform and promotional materials.
            </p>
          </div>
        </div>
      </div>

      {/* Support Contact */}
      <SupportContact />
    </div>
  );
};

export default Step5MediaContent;