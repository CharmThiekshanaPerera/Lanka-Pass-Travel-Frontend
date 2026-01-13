import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  Users, 
  Plus, 
  X, 
  Check, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface TimeSlot {
  id: string;
  time: string;
  capacity: number;
  booked: number;
  status: "available" | "full" | "blocked";
}

interface DayBooking {
  date: Date;
  slots: TimeSlot[];
  isBlackout: boolean;
}

// Mock data for bookings
const generateMockData = (): DayBooking[] => {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(addDays(today, 60));
  const days = eachDayOfInterval({ start, end });

  return days.map((date, index) => ({
    date,
    isBlackout: index % 15 === 0,
    slots: [
      { id: `${index}-1`, time: "08:00 AM", capacity: 10, booked: Math.floor(Math.random() * 10), status: "available" as const },
      { id: `${index}-2`, time: "10:00 AM", capacity: 8, booked: Math.floor(Math.random() * 8), status: "available" as const },
      { id: `${index}-3`, time: "02:00 PM", capacity: 12, booked: Math.floor(Math.random() * 12), status: "available" as const },
      { id: `${index}-4`, time: "04:00 PM", capacity: 6, booked: 6, status: "full" as const },
    ],
  }));
};

const mockBookingsForDate = [
  { id: 1, guestName: "John Smith", time: "08:00 AM", guests: 4, service: "Sigiriya Day Tour" },
  { id: 2, guestName: "Emma Wilson", time: "10:00 AM", guests: 2, service: "Sigiriya Day Tour" },
  { id: 3, guestName: "Michael Chen", time: "02:00 PM", guests: 6, service: "Sigiriya Day Tour" },
];

interface CalendarViewProps {
  compact?: boolean;
}

const CalendarView = ({ compact = false }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookingData] = useState<DayBooking[]>(generateMockData());
  const [showAddSlotDialog, setShowAddSlotDialog] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState("09:00");
  const [newSlotCapacity, setNewSlotCapacity] = useState("10");

  const selectedDayData = bookingData.find(d => isSameDay(d.date, selectedDate));
  
  const getDayStatus = (date: Date) => {
    const dayData = bookingData.find(d => isSameDay(d.date, date));
    if (!dayData) return null;
    if (dayData.isBlackout) return "blackout";
    const totalBooked = dayData.slots.reduce((sum, s) => sum + s.booked, 0);
    const totalCapacity = dayData.slots.reduce((sum, s) => sum + s.capacity, 0);
    if (totalBooked >= totalCapacity) return "full";
    if (totalBooked > totalCapacity * 0.5) return "partial";
    return "available";
  };

  const getSlotStatusColor = (slot: TimeSlot) => {
    if (slot.status === "blocked") return "bg-muted text-muted-foreground";
    if (slot.booked >= slot.capacity) return "bg-destructive/10 text-destructive border-destructive/20";
    if (slot.booked > slot.capacity * 0.7) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    return "bg-primary/10 text-primary border-primary/20";
  };

  const modifiers = {
    blackout: bookingData.filter(d => d.isBlackout).map(d => d.date),
    full: bookingData.filter(d => {
      const totalBooked = d.slots.reduce((sum, s) => sum + s.booked, 0);
      const totalCapacity = d.slots.reduce((sum, s) => sum + s.capacity, 0);
      return !d.isBlackout && totalBooked >= totalCapacity;
    }).map(d => d.date),
    partial: bookingData.filter(d => {
      const totalBooked = d.slots.reduce((sum, s) => sum + s.booked, 0);
      const totalCapacity = d.slots.reduce((sum, s) => sum + s.capacity, 0);
      return !d.isBlackout && totalBooked > totalCapacity * 0.5 && totalBooked < totalCapacity;
    }).map(d => d.date),
  };

  const modifiersStyles = {
    blackout: { 
      backgroundColor: 'hsl(var(--muted))', 
      color: 'hsl(var(--muted-foreground))',
      textDecoration: 'line-through',
      opacity: 0.5
    },
    full: { 
      backgroundColor: 'hsl(var(--destructive) / 0.15)', 
      color: 'hsl(var(--destructive))',
      fontWeight: 600
    },
    partial: { 
      backgroundColor: 'hsl(45 93% 47% / 0.15)', 
      color: 'hsl(45 93% 35%)',
      fontWeight: 600
    },
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="rounded-lg border pointer-events-auto"
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
        />
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-primary/20" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-500/20" />
            <span className="text-muted-foreground">Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/20" />
            <span className="text-muted-foreground">Full</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Availability Calendar</h3>
          <p className="text-sm text-muted-foreground">Manage your booking slots and blackout dates</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddSlotDialog} onOpenChange={setShowAddSlotDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Time Slot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Time Slot</DialogTitle>
                <DialogDescription>
                  Create a new availability slot for {format(selectedDate, "MMMM d, yyyy")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Start Time</Label>
                  <Input 
                    id="time" 
                    type="time" 
                    value={newSlotTime}
                    onChange={(e) => setNewSlotTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input 
                    id="capacity" 
                    type="number" 
                    min="1"
                    value={newSlotCapacity}
                    onChange={(e) => setNewSlotCapacity(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddSlotDialog(false)}>Cancel</Button>
                <Button onClick={() => setShowAddSlotDialog(false)}>Add Slot</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Set Blackout Dates
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-lg pointer-events-auto"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
            />
            <div className="mt-4 pt-4 border-t space-y-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">Legend</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary/20" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                  <span>Filling Up</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/20" />
                  <span>Fully Booked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-muted line-through" />
                  <span>Blackout</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Time Slots</CardTitle>
                <CardDescription>{format(selectedDate, "EEEE, MMMM d")}</CardDescription>
              </div>
              {selectedDayData?.isBlackout && (
                <Badge variant="secondary" className="text-xs">Blackout Day</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedDayData?.isBlackout ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Blackout Date</p>
                <p className="text-sm">No bookings available on this day</p>
                <Button variant="outline" size="sm" className="mt-4">
                  Remove Blackout
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayData?.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className={cn(
                      "p-3 rounded-lg border transition-colors",
                      getSlotStatusColor(slot)
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{slot.time}</span>
                      </div>
                      <Badge 
                        variant={slot.booked >= slot.capacity ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {slot.booked >= slot.capacity ? "Full" : `${slot.capacity - slot.booked} left`}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-3.5 w-3.5" />
                        <span>{slot.booked} / {slot.capacity} guests</span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="h-1.5 bg-background rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all",
                            slot.booked >= slot.capacity ? "bg-destructive" :
                            slot.booked > slot.capacity * 0.7 ? "bg-amber-500" : "bg-primary"
                          )}
                          style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Slot
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bookings for Selected Date */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Bookings</CardTitle>
                <CardDescription>{mockBookingsForDate.length} confirmed bookings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockBookingsForDate.map((booking) => (
                <div
                  key={booking.id}
                  className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-medium text-sm">{booking.guestName}</p>
                      <p className="text-xs text-muted-foreground">{booking.service}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      Confirmed
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{booking.guests} guests</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Settings */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quick Settings</CardTitle>
          <CardDescription>Configure default availability settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium text-sm">Accept Same-Day Bookings</p>
                <p className="text-xs text-muted-foreground">Allow guests to book today</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium text-sm">Auto-Confirm Bookings</p>
                <p className="text-xs text-muted-foreground">Skip manual approval</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium text-sm">Buffer Time</p>
                <p className="text-xs text-muted-foreground">30 min between slots</p>
              </div>
              <Select defaultValue="30">
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium text-sm">Advance Booking</p>
                <p className="text-xs text-muted-foreground">How far ahead</p>
              </div>
              <Select defaultValue="90">
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
