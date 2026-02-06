import { useState } from "react";
import { TrendingUp, Download, Calendar, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EarningsOverviewProps {
  compact?: boolean;
}

const EarningsOverview = ({ compact = false }: EarningsOverviewProps) => {
  const [period, setPeriod] = useState("month");

  // TODO: Fetch real earnings data from API
  const earningsSummary = {
    totalEarnings: "LKR 0",
    pendingPayout: "LKR 0",
    nextPayoutDate: "-",
    monthlyGrowth: "+0%",
    avgBookingValue: "LKR 0",
    commission: "15%"
  };

  const monthlyData: any[] = [];

  const recentTransactions: any[] = [];

  const topServices: any[] = [];

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-primary/10">
            <p className="text-sm text-muted-foreground mb-1">This Month</p>
            <p className="text-xl font-bold text-primary">{earningsSummary.totalEarnings}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600">{earningsSummary.monthlyGrowth}</span>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-xl font-bold">{earningsSummary.pendingPayout}</p>
            <p className="text-xs text-muted-foreground mt-1">Next: {earningsSummary.nextPayoutDate}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Top Earning Services</p>
          {topServices.slice(0, 3).map((service, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="truncate">{service.name}</span>
                <span className="font-medium">{service.percentage}%</span>
              </div>
              <Progress value={service.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Earnings Overview</h3>
          <p className="text-sm text-muted-foreground">Track your revenue and payouts</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold mt-1">{earningsSummary.totalEarnings}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">{earningsSummary.monthlyGrowth}</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Payout</p>
              <p className="text-2xl font-bold mt-1">{earningsSummary.pendingPayout}</p>
              <p className="text-xs text-muted-foreground mt-2">Next: {earningsSummary.nextPayoutDate}</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-100">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Booking Value</p>
              <p className="text-2xl font-bold mt-1">{earningsSummary.avgBookingValue}</p>
              <p className="text-xs text-muted-foreground mt-2">Per transaction</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/10">
              <CreditCard className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Commission Rate</p>
              <p className="text-2xl font-bold mt-1">{earningsSummary.commission}</p>
              <p className="text-xs text-muted-foreground mt-2">Platform fee</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <TrendingUp className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Earnings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Earnings</CardTitle>
            <CardDescription>Last 6 months performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.paidOut ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span className="text-sm font-medium">{item.month}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{item.bookings} bookings</span>
                    <span className="font-medium">LKR {item.earnings.toLocaleString()}</span>
                    {item.paidOut ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 text-xs">Paid</Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 text-xs">Pending</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Earning Services */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Earning Services</CardTitle>
            <CardDescription>Revenue breakdown by service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium truncate max-w-[200px]">{service.name}</span>
                    <span className="text-muted-foreground">LKR {service.earnings.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={service.percentage} className="h-2 flex-1" />
                    <span className="text-sm font-medium w-10 text-right">{service.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                    <TableCell className="text-muted-foreground">{txn.date}</TableCell>
                    <TableCell>{txn.description}</TableCell>
                    <TableCell className={`text-right font-medium ${txn.type === "credit" ? "text-green-600" :
                      txn.type === "payout" ? "text-blue-600" : "text-destructive"
                      }`}>
                      {txn.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsOverview;
