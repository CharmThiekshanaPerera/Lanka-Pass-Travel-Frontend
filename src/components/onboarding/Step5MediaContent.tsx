import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Image, Video, X, FileImage } from "lucide-react";
import SupportContact from "./SupportContact";

interface Step5Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const Step5MediaContent = ({ formData, updateFormData }: Step5Props) => {
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
          Show off what you do best. Upload photos, write a short description, and highlight what makes your experience special.
        </p>
      </div>

      {/* Cover Image */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Cover Image <span className="text-destructive">*</span>
        </Label>
        <p className="text-xs text-muted-foreground">
          This will be the main image travelers see. Recommended: 1200x800px or larger.
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
          Gallery Images
        </Label>
        <p className="text-xs text-muted-foreground">
          Add 3-6 additional photos to showcase your experience. Show different angles and highlights.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Existing Images */}
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
                Add photos
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

      {/* Promo Video */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Short Promo Video
        </Label>
        <p className="text-xs text-muted-foreground">
          Optional: Add a short video (30-60 seconds) to give travelers a preview of your experience.
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
