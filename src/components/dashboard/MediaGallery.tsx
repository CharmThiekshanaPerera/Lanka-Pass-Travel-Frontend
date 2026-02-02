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

interface MediaItem {
    id: string;
    url: string;
    type: "image" | "video";
    name: string;
    size?: string;
    uploadedAt?: string;
}

interface MediaGalleryProps {
    vendorId?: string;
}

const MediaGallery = ({ vendorId }: MediaGalleryProps) => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
    const [activeTab, setActiveTab] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                setIsLoading(true);
                const response = await vendorService.getVendorProfile();
                if (response.success && response.vendor) {
                    const v = response.vendor;
                    const items: MediaItem[] = [];

                    if (v.logo_url) {
                        items.push({
                            id: 'logo',
                            url: v.logo_url,
                            type: 'image',
                            name: 'Business Logo',
                            uploadedAt: new Date(v.created_at).toLocaleDateString()
                        });
                    }
                    if (v.cover_image_url) {
                        items.push({
                            id: 'cover',
                            url: v.cover_image_url,
                            type: 'image',
                            name: 'Cover Image',
                            uploadedAt: new Date(v.created_at).toLocaleDateString()
                        });
                    }
                    if (v.gallery_images && Array.isArray(v.gallery_images)) {
                        v.gallery_images.forEach((url: string, index: number) => {
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

        fetchMedia();
    }, [vendorId]);

    // Filter media by type
    const filteredMedia = mediaItems.filter(item => {
        if (activeTab === "images") return item.type === "image";
        if (activeTab === "videos") return item.type === "video";
        return true;
    });

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        // TODO: Implement actual file upload to backend/storage
        Array.from(files).forEach(file => {
            const newItem: MediaItem = {
                id: Math.random().toString(36).substr(2, 9),
                url: URL.createObjectURL(file),
                type: file.type.startsWith("image/") ? "image" : "video",
                name: file.name,
                size: (file.size / 1024).toFixed(2) + " KB",
                uploadedAt: new Date().toLocaleDateString()
            };
            setMediaItems(prev => [...prev, newItem]);
        });
    };

    const handleDelete = (id: string) => {
        setMediaItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">Media Gallery</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your photos and videos
                    </p>
                </div>
                <div className="flex gap-2">
                    <Input
                        type="file"
                        id="media-upload"
                        className="hidden"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileUpload}
                    />
                    <Label htmlFor="media-upload">
                        <Button className="gap-2 cursor-pointer" asChild>
                            <span>
                                <Upload className="h-4 w-4" />
                                Upload Media
                            </span>
                        </Button>
                    </Label>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <ImageIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {mediaItems.filter(i => i.type === "image").length}
                            </p>
                            <p className="text-xs text-muted-foreground">Images</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <Video className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {mediaItems.filter(i => i.type === "video").length}
                            </p>
                            <p className="text-xs text-muted-foreground">Videos</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10">
                            <Upload className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{mediaItems.length}</p>
                            <p className="text-xs text-muted-foreground">Total Files</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All Media</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    {filteredMedia.length === 0 ? (
                        <Card className="p-12">
                            <div className="text-center">
                                <Upload className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Media Files</h3>
                                <p className="text-muted-foreground mb-6">
                                    Upload images and videos to showcase your services
                                </p>
                                <Label htmlFor="media-upload">
                                    <Button className="gap-2 cursor-pointer" asChild>
                                        <span>
                                            <Plus className="h-4 w-4" />
                                            Upload Your First File
                                        </span>
                                    </Button>
                                </Label>
                            </div>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredMedia.map((item) => (
                                <Card key={item.id} className="overflow-hidden group relative">
                                    <div className="aspect-square relative bg-muted">
                                        {item.type === "image" ? (
                                            <img
                                                src={item.url}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Video className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        )}

                                        {/* Overlay with actions */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-8 w-8"
                                                onClick={() => setSelectedImage(item)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-8 w-8"
                                                asChild
                                            >
                                                <a href={item.url} download={item.name}>
                                                    <Download className="h-4 w-4" />
                                                </a>
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="h-8 w-8"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Badge */}
                                        <Badge className="absolute top-2 left-2 text-xs">
                                            {item.type === "image" ? <ImageIcon className="h-3 w-3 mr-1" /> : <Video className="h-3 w-3 mr-1" />}
                                            {item.type}
                                        </Badge>
                                    </div>

                                    <CardContent className="p-3">
                                        <p className="text-sm font-medium truncate">{item.name}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-xs text-muted-foreground">{item.size}</p>
                                            <p className="text-xs text-muted-foreground">{item.uploadedAt}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Preview Dialog */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{selectedImage?.name}</DialogTitle>
                        <DialogDescription>
                            {selectedImage?.type === "image" ? "Image" : "Video"} • {selectedImage?.size} • Uploaded {selectedImage?.uploadedAt}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        {selectedImage?.type === "image" ? (
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.name}
                                className="w-full h-auto rounded-lg"
                            />
                        ) : (
                            <video
                                src={selectedImage?.url}
                                controls
                                className="w-full h-auto rounded-lg"
                            />
                        )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setSelectedImage(null)}>
                            Close
                        </Button>
                        <Button asChild>
                            <a href={selectedImage?.url} download={selectedImage?.name}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </a>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MediaGallery;
