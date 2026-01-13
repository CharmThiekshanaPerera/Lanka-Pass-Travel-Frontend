import { useState } from "react";
import { Plus, Edit, Trash2, Eye, MoreVertical, Star, MapPin, Clock, Users } from "lucide-react";
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

const ServicesList = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Sigiriya Rock Fortress Day Tour",
      category: "Cultural Tours",
      price: "LKR 15,000",
      duration: "8 hours",
      rating: 4.8,
      reviews: 124,
      bookings: 45,
      status: "active",
      image: "https://images.unsplash.com/photo-1586613835341-d7379c45d403?w=400",
      locations: ["Sigiriya", "Dambulla"],
      capacity: "12 people"
    },
    {
      id: 2,
      name: "Whale Watching Mirissa",
      category: "Wildlife & Nature",
      price: "LKR 8,500",
      duration: "4 hours",
      rating: 4.6,
      reviews: 89,
      bookings: 67,
      status: "active",
      image: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=400",
      locations: ["Mirissa"],
      capacity: "20 people"
    },
    {
      id: 3,
      name: "Colombo City Walking Tour",
      category: "City Tours",
      price: "LKR 5,000",
      duration: "3 hours",
      rating: 4.5,
      reviews: 56,
      bookings: 23,
      status: "active",
      image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400",
      locations: ["Colombo"],
      capacity: "15 people"
    },
    {
      id: 4,
      name: "Ella Adventure Package",
      category: "Adventure",
      price: "LKR 22,000",
      duration: "2 days",
      rating: 4.9,
      reviews: 34,
      bookings: 12,
      status: "draft",
      image: "https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?w=400",
      locations: ["Ella", "Nuwara Eliya"],
      capacity: "8 people"
    },
    {
      id: 5,
      name: "Traditional Cooking Class",
      category: "Culinary",
      price: "LKR 6,500",
      duration: "4 hours",
      rating: 4.7,
      reviews: 78,
      bookings: 34,
      status: "paused",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400",
      locations: ["Kandy"],
      capacity: "10 people"
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "paused":
        return <Badge variant="outline" className="text-amber-600 border-amber-300">Paused</Badge>;
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
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={service.image} 
                alt={service.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                {getStatusBadge(service.status)}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2">
                    <Eye className="h-4 w-4" /> View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Edit className="h-4 w-4" /> Edit Service
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline" className="text-xs">{service.category}</Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{service.rating}</span>
                  <span className="text-muted-foreground">({service.reviews})</span>
                </div>
              </div>
              
              <h4 className="font-semibold text-foreground mb-2 line-clamp-2">{service.name}</h4>
              
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {service.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {service.capacity}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {service.locations.join(", ")}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div>
                  <p className="text-lg font-bold text-primary">{service.price}</p>
                  <p className="text-xs text-muted-foreground">per person</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{service.bookings} bookings</p>
                  <p className="text-xs text-muted-foreground">this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesList;
