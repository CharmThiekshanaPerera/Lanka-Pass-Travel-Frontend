import { TrendingUp, TrendingDown, DollarSign, Calendar, Package, Users, Star, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const DashboardStats = ({ stats, serviceCount }: { stats: any, serviceCount: number }) => {
  const displayStats = [
    {
      title: "Total Earnings",
      value: stats ? `LKR ${stats.total_earnings.toLocaleString()}` : "LKR 0",
      change: "+0%",
      trend: "up",
      icon: DollarSign,
      color: "bg-primary/10 text-primary"
    },
    {
      title: "Total Bookings",
      value: stats ? stats.total_bookings.toString() : "0",
      change: "+0%",
      trend: "up",
      icon: Calendar,
      color: "bg-secondary/10 text-secondary"
    },
    {
      title: "Active Services",
      value: serviceCount.toString(),
      change: "+0",
      trend: "up",
      icon: Package,
      color: "bg-accent/10 text-accent"
    },
    {
      title: "Pending Bookings",
      value: stats ? stats.pending_bookings.toString() : "0",
      change: "0",
      trend: "up",
      icon: Eye,
      color: "bg-muted-foreground/10 text-muted-foreground"
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
