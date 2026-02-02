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
  ChevronRight,
  Package
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

// TODO: Fetch real booking data from API
const generateMockData = (): DayBooking[] => {
  return [];
};

const mockBookingsForDate: any[] = [];

interface CalendarViewProps {
  compact?: boolean;
  services?: any[];
}

const CalendarView = ({ compact = false, services = [] }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [bookingData] = useState<DayBooking[]>(generateMockData());
  const [showAddSlotDialog, setShowAddSlotDialog] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState("09:00");
  const [newSlotCapacity, setNewSlotCapacity] = useState("10");

  const selectedDayData = bookingData.find(d => isSameDay(d.date, selectedDate));

  const selectedService = services.find(s => (s.id || s.service_id) === selectedServiceId);
  const serviceName = selectedService ? (selectedService.service_name || selectedService.serviceName) : null;

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
        {services.length > 0 && (
          <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
            <SelectTrigger className="w-full h-9 text-xs">
              <SelectValue placeholder="Select a Service First" />
            </SelectTrigger>
            <SelectContent>
              {services.map((s) => (
                <SelectItem key={s.id || s.service_id} value={s.id || s.service_id}>
                  {s.service_name || s.serviceName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {!selectedServiceId ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed rounded-xl bg-muted/20">
            <Package className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-[10px] text-center text-muted-foreground font-medium">Please select a service above<br />to view availability</p>
          </div>
        ) : (
          <>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-lg border pointer-events-auto"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
            />
            <div className="flex items-center gap-4 text-[10px]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary/20" />
                <span className="text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                <span className="text-muted-foreground">Partial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/20" />
                <span className="text-muted-foreground">Full</span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-6 bg-card rounded-2xl border border-border/50 shadow-sm">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">
            {serviceName ? `Availability for ${serviceName}` : "Service Availability"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {serviceName ? "Manage slots and blackout dates for your selected service" : "Please select a service to manage its calendar"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {services.length > 0 && (
            <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
              <SelectTrigger className="w-full sm:w-[260px] bg-background border-primary/20 ring-primary/5 h-11">
                <SelectValue placeholder="Select a Service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id || s.service_id} value={s.id || s.service_id}>
                    {s.service_name || s.serviceName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {selectedServiceId && (
            <>
              <Dialog open={showAddSlotDialog} onOpenChange={setShowAddSlotDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="shadow-sm border-primary/20 h-11" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Time Slot
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Slot for {serviceName}</DialogTitle>
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
              <Button variant="outline" className="shadow-sm border-primary/20 h-11" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Set Blackout
              </Button>
            </>
          )}
        </div>
      </div>

      {!selectedServiceId ? (
        <Card className="border-none shadow-none bg-muted/10 border-2 border-dashed flex flex-col items-center justify-center py-20">
          <div className="bg-primary/5 p-6 rounded-full mb-6">
            <Package className="h-12 w-12 text-primary opacity-40" />
          </div>
          <h4 className="text-xl font-bold text-foreground mb-2">No Service Selected</h4>
          <p className="text-muted-foreground max-w-sm text-center">
            To manage availability, blackout dates, and view bookings, please choose a service from the dropdown above.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-1 shadow-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Select Date</CardTitle>
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
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Legend</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-primary/20" />
                      <span className="font-medium">Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                      <span className="font-medium">Filling Up</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-destructive/20" />
                      <span className="font-medium">Fully Booked</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-muted line-through" />
                      <span className="font-medium">Blackout</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Slots */}
            <Card className="lg:col-span-1 shadow-sm border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Time Slots</CardTitle>
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
                    {(selectedDayData?.slots || []).map((slot) => (
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
            <Card className="lg:col-span-1 shadow-sm border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Bookings</CardTitle>
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
                  {mockBookingsForDate.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      No bookings for this date
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Settings */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Quick Settings</CardTitle>
              <CardDescription>Configure default availability settings for {serviceName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                  <div>
                    <p className="font-medium text-sm">Accept Same-Day Bookings</p>
                    <p className="text-xs text-muted-foreground">Allow guests to book today</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                  <div>
                    <p className="font-medium text-sm">Auto-Confirm Bookings</p>
                    <p className="text-xs text-muted-foreground">Skip manual approval</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                  <div>
                    <p className="font-medium text-sm">Buffer Time</p>
                    <p className="text-xs text-muted-foreground">Minutes between slots</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-24 bg-background h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="60">60 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                  <div>
                    <p className="font-medium text-sm">Advance Booking</p>
                    <p className="text-xs text-muted-foreground">How far ahead in days</p>
                  </div>
                  <Select defaultValue="90">
                    <SelectTrigger className="w-24 bg-background h-9">
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
        </>
      )}
    </div>
  );
};

export default CalendarView;
