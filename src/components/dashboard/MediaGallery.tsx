import { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, Video, Trash2, Eye, Download, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { vendorService } from "@/services/vendorService";
import { toast } from "sonner";
import { Loader2, FileText, ExternalLink } from "lucide-react";

interface MediaItem {
    id: string;
    url: string;
    type: "image" | "video";
    name: string;
    size?: string;
    uploadedAt?: string;
    isCover?: boolean;
    isLogo?: boolean;
    isPromo?: boolean;
}

interface MediaGalleryProps {
    vendorId?: string;
}

const IdentityUploadField = ({
    label,
    description,
    helpText,
    fileType,
    vendorId,
    currentUrl,
    onUploadSuccess,
    icon: Icon = ImageIcon,
    buttonText = "Upload"
}: {
    label: string,
    description?: string,
    helpText?: string,
    fileType: string,
    vendorId: string,
    currentUrl?: string,
    onUploadSuccess: (url: string) => void,
    icon?: any,
    buttonText?: string
}) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const response = await vendorService.uploadFile(file, vendorId, fileType);
            if (response.success) {
                toast.success(`${label} updated successfully`);
                onUploadSuccess(response.url);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to upload file");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <Label className="text-sm font-semibold">{label}</Label>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </div>

            <div className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-colors hover:bg-muted/50 ${currentUrl ? 'border-primary/50 bg-primary/5' : 'border-border'}`}>
                {currentUrl ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
                        {fileType === 'promo_video' ? (
                            <video src={currentUrl} className="w-full h-full object-cover" />
                        ) : (
                            <img src={currentUrl} alt={label} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Eye className="w-8 h-8 text-white" />
                        </div>
                    </div>
                ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                )}

                <div className="text-center space-y-2">
                    <Button
                        type="button"
                        variant={currentUrl ? "outline" : "default"}
                        size="sm"
                        className="relative"
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Upload className="w-4 h-4 mr-2" />
                        )}
                        {currentUrl ? "Replace " : "Click to upload "}{buttonText}
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            onChange={handleFileChange}
                            accept={fileType === 'promo_video' ? "video/*" : "image/*"}
                            disabled={isUploading}
                        />
                    </Button>
                    {helpText && <p className="text-[10px] text-muted-foreground">{helpText}</p>}
                </div>
            </div>
        </div>
    );
};

const MediaGallery = ({ vendorId }: MediaGalleryProps) => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
    const [activeTab, setActiveTab] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [identityUrls, setIdentityUrls] = useState({
        logo: "",
        cover: ""
    });

    const fetchMedia = async () => {
        try {
            setIsLoading(true);
            const response = await vendorService.getVendorProfile();
            if (response.success && response.vendor) {
                const v = response.vendor;
                setIdentityUrls({
                    logo: v.logo_url || "",
                    cover: v.cover_image_url || ""
                });
                const items: MediaItem[] = [];

                if (v.logo_url) {
                    items.push({
                        id: 'logo',
                        url: v.logo_url,
                        type: 'image',
                        name: 'Business Logo',
                        isLogo: true,
                        uploadedAt: new Date(v.created_at).toLocaleDateString()
                    });
                }
                if (v.cover_image_url) {
                    items.push({
                        id: 'cover',
                        url: v.cover_image_url,
                        type: 'image',
                        name: 'Cover Image',
                        isCover: true,
                        uploadedAt: new Date(v.created_at).toLocaleDateString()
                    });
                }
                if (v.gallery_urls && Array.isArray(v.gallery_urls)) {
                    v.gallery_urls.forEach((url: string, index: number) => {
                        items.push({
                            id: `gallery-${index}`,
                            url: url,
                            type: 'image',
                            name: `Gallery Image ${index + 1}`,
                            uploadedAt: new Date(v.created_at).toLocaleDateString()
                        });
                    });
                }
                if (v.promo_video_url) {
                    items.push({
                        id: 'promo',
                        url: v.promo_video_url,
                        type: 'video',
                        name: 'Promo Video',
                        isPromo: true,
                        uploadedAt: new Date(v.created_at).toLocaleDateString()
                    });
                }
                setMediaItems(items);
            }
        } catch (error) {
            console.error("Failed to fetch media:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, [vendorId]);

    // Filter media by type
    const filteredMedia = mediaItems.filter(item => {
        if (activeTab === "images") return item.type === "image";
        if (activeTab === "videos") return item.type === "video";
        return true;
    });

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || !vendorId) return;

        const uploadPromises = Array.from(files).map(async (file) => {
            try {
                const res = await vendorService.uploadFile(file, vendorId, 'gallery');
                if (res.success) {
                    toast.success(`${file.name} uploaded successfully`);
                    return true;
                }
                return false;
            } catch (error: any) {
                toast.error(`Failed to upload ${file.name}: ${error.message}`);
                return false;
            }
        });

        await Promise.all(uploadPromises);
        fetchMedia(); // Refresh list
    };

    const handleDelete = async (item: MediaItem) => {
        if (!vendorId) return;

        setIsDeleting(item.id);
        try {
            const res = await vendorService.deleteVendorFile(vendorId, item.url, 'gallery');
            if (res.success) {
                toast.success("Image removed from gallery");
                fetchMedia();
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete image");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-12">
            {/* Header */}
            <div>
                <h3 className="text-2xl font-bold tracking-tight">Photos & Content</h3>
                <p className="text-muted-foreground mt-1">
                    Manage your visual presence and brand identity on the platform.
                </p>
            </div>

            {/* Section 1: General Business Images */}
            <section className="space-y-8">
                <div className="space-y-1">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        General Business Images
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        These images will appear on your overall business/profile page.
                    </p>
                </div>

                <div className="grid gap-8">
                    {/* Cover Image */}
                    <IdentityUploadField
                        label="Cover Image *"
                        description="This will be the main image travelers see on your business page. Recommended: 1200x800px or larger."
                        helpText="JPG, PNG, WEBP (max 10MB)"
                        fileType="cover_image"
                        vendorId={vendorId || ""}
                        currentUrl={identityUrls.cover}
                        onUploadSuccess={() => fetchMedia()}
                        buttonText="cover image"
                    />

                    {/* Business Gallery Images */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-sm font-semibold">Business Gallery Images</Label>
                                <p className="text-xs text-muted-foreground">
                                    Add 3-6 additional photos to showcase your business, location, or general atmosphere.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-[10px] font-medium">
                                <ImageIcon className="w-3 h-3" />
                                {mediaItems.filter(i => !i.isCover && !i.isLogo && !i.isPromo && i.type === 'image').length} of 6 images uploaded
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {mediaItems.filter(i => !i.isCover && !i.isLogo && !i.isPromo && i.type === 'image').map((item) => (
                                <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden border bg-muted">
                                    <img src={item.url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:text-white" onClick={() => setSelectedImage(item)}>
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-white hover:text-destructive"
                                            onClick={() => handleDelete(item)}
                                            disabled={isDeleting === item.id}
                                        >
                                            {isDeleting === item.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {mediaItems.filter(i => !i.isCover && !i.isLogo && !i.isPromo && i.type === 'image').length < 6 && (
                                <div className="relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer group">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <Plus className="w-4 h-4 text-primary" />
                                    </div>
                                    <p className="text-[10px] font-medium text-muted-foreground">Add gallery photo</p>
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                        multiple
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Logo / Branding */}
            <section className="space-y-6 pt-8 border-t">
                <div className="space-y-1">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Logo / Branding *
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        Upload your business logo for brand consistency.
                    </p>
                </div>

                <div className="max-w-md">
                    <IdentityUploadField
                        label=""
                        description=""
                        helpText="PNG, SVG, JPG (max 5MB)"
                        fileType="logo"
                        vendorId={vendorId || ""}
                        currentUrl={identityUrls.logo}
                        onUploadSuccess={() => fetchMedia()}
                        buttonText="your logo"
                    />
                </div>
            </section>

            {/* Section 3: Short Promo Video */}
            <section className="space-y-6 pt-8 border-t">
                <div className="space-y-1">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Video className="w-5 h-5 text-primary" />
                        Short Promo Video (Optional)
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        Add a short video (30-60 seconds) to give travelers a preview of your business or experience.
                    </p>
                </div>

                <IdentityUploadField
                    label=""
                    description=""
                    helpText="MP4, MOV (max 100MB)"
                    fileType="promo_video"
                    vendorId={vendorId || ""}
                    currentUrl={mediaItems.find(i => i.isPromo)?.url}
                    onUploadSuccess={() => fetchMedia()}
                    icon={Video}
                    buttonText="video"
                />
            </section>

            {/* Preview Dialog */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none">
                    <div className="relative aspect-video flex items-center justify-center">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="w-6 h-6" />
                        </Button>

                        {selectedImage?.type === "image" ? (
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.name}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <video
                                src={selectedImage?.url}
                                controls
                                className="w-full h-full object-contain"
                                autoPlay
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MediaGallery;
