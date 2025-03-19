"use client"

import { useState, useEffect } from "react"
import {
  Activity,
  AlertTriangle,
  Battery,
  Car,
  Download,
  MapPin,
  RefreshCw,
  Zap,
  Calendar,
  Clock,
  TrendingUp,
  FileText,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VehicleDistributionChart } from "@/components/vehicle-distribution-chart"
import { CorridorPerformanceChart } from "@/components/corridor-performance-chart"
import { EnergySavingsChart } from "@/components/energy-savings-chart"
import { SystemHealthDashboard } from "@/components/system-health-dashboard"
import { generateTrafficData, generateSystemHealthData } from "@/lib/generate-data"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Badge } from "@/components/ui/badge"

// Update the dashboard overview to include the traffic flow analysis component
import { TrafficFlowAnalysis } from "@/components/traffic-flow-analysis"

export function DashboardOverview() {
  const [trafficData, setTrafficData] = useState<any>(null)
  const [systemHealthData, setSystemHealthData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("traffic-flow")
  const [refreshing, setRefreshing] = useState(false)

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setIsLoading(true)

    // Simulate API calls with a slight delay
    setTimeout(() => {
      try {
        const traffic = generateTrafficData()
        const health = generateSystemHealthData()

        setTrafficData(traffic)
        setSystemHealthData(health)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "There was a problem loading the dashboard data. Please try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
        setIsLoading(false)
      }
    }, 1200)
  }

  const refreshData = () => {
    setRefreshing(true)

    // Show toast notification
    toast({
      title: "Refreshing data",
      description: "Fetching the latest information from all corridors.",
    })

    setTimeout(() => {
      try {
        setTrafficData(generateTrafficData())
        setSystemHealthData(generateSystemHealthData())
        setRefreshing(false)

        // Success toast
        toast({
          title: "Data refreshed",
          description: "Dashboard has been updated with the latest information.",
        })
      } catch (error) {
        console.error("Error refreshing data:", error)
        toast({
          variant: "destructive",
          title: "Refresh failed",
          description: "There was a problem refreshing the data. Please try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
        setRefreshing(false)
      }
    }, 1500)
  }

  const handleExportReport = () => {
    toast({
      title: "Generating report",
      description: "Your report is being prepared for download.",
    })

    setTimeout(() => {
      toast({
        title: "Report ready",
        description: "Your dashboard report has been downloaded.",
      })
    }, 2000)
  }

  // Loading state
  if (isLoading && !trafficData) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Loading Data
            </Button>
            <Button disabled>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-4">
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring and analytics for the Green Corridor System
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={refreshing}
            className="border-primary/20 hover:bg-primary/10 transition-all"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
          <Button
            onClick={handleExportReport}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card card-hover-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Corridors</CardTitle>
            <div className="rounded-full bg-primary/10 p-2">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12/15</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-success/20 text-success border-success/20 text-xs">+2</Badge>
              <p className="text-xs text-muted-foreground ml-2">since last month</p>
            </div>
            <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
              <div className="bg-gradient-to-r from-primary to-secondary h-1 w-[80%]" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card card-hover-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Traffic Flow Efficiency</CardTitle>
            <div className="rounded-full bg-secondary/10 p-2">
              <Activity className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+27%</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-success/20 text-success border-success/20 text-xs">+4%</Badge>
              <p className="text-xs text-muted-foreground ml-2">from previous period</p>
            </div>
            <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
              <div className="bg-gradient-to-r from-secondary to-primary h-1 w-[87%]" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card card-hover-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Saved</CardTitle>
            <div className="rounded-full bg-accent/10 p-2">
              <Battery className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245 kWh</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-success/20 text-success border-success/20 text-xs">+18%</Badge>
              <p className="text-xs text-muted-foreground ml-2">from previous period</p>
            </div>
            <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
              <div className="bg-gradient-to-r from-accent to-secondary h-1 w-[78%]" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card card-hover-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <div className="rounded-full bg-warning/10 p-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-warning/20 text-warning border-warning/20 text-xs">2 alerts</Badge>
              <p className="text-xs text-muted-foreground ml-2">minor issues active</p>
            </div>
            <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
              <div className="bg-gradient-to-r from-warning to-success h-1 w-[98%]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic-flow" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50 p-1 rounded-lg">
          <TabsTrigger
            value="traffic-flow"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-secondary/80 data-[state=active]:text-white rounded-md transition-all"
          >
            Traffic Flow
          </TabsTrigger>
          <TabsTrigger
            value="vehicles"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-secondary/80 data-[state=active]:text-white rounded-md transition-all"
          >
            Vehicle Distribution
          </TabsTrigger>
          <TabsTrigger
            value="corridors"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-secondary/80 data-[state=active]:text-white rounded-md transition-all"
          >
            Corridor Performance
          </TabsTrigger>
          <TabsTrigger
            value="energy"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-secondary/80 data-[state=active]:text-white rounded-md transition-all"
          >
            Energy Savings
          </TabsTrigger>
          <TabsTrigger
            value="system-health"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-secondary/80 data-[state=active]:text-white rounded-md transition-all"
          >
            System Health
          </TabsTrigger>
        </TabsList>

        {/* Add the TrafficFlowAnalysis component to the TabsContent for traffic-flow */}
        <TabsContent value="traffic-flow" className="space-y-4">
          <TrafficFlowAnalysis isLoading={refreshing} data={trafficData} />
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <Card className="dashboard-card border-2 border-primary/10 shadow-md overflow-visible">
            <CardHeader>
              <CardTitle>Vehicle Distribution</CardTitle>
              <CardDescription>Breakdown of vehicle types and adoption trends</CardDescription>
            </CardHeader>
            <CardContent>
              <VehicleDistributionChart isLoading={refreshing} data={trafficData?.vehicleDistribution} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corridors" className="space-y-4">
          <Card className="dashboard-card border-2 border-primary/10 shadow-md overflow-visible">
            <CardHeader>
              <CardTitle>Corridor Performance</CardTitle>
              <CardDescription>Efficiency metrics for each corridor in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <CorridorPerformanceChart isLoading={refreshing} data={trafficData?.corridorPerformance} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="energy" className="space-y-4">
          <Card className="dashboard-card border-2 border-primary/10 shadow-md overflow-visible">
            <CardHeader>
              <CardTitle>Energy Savings</CardTitle>
              <CardDescription>Energy conservation metrics and environmental impact</CardDescription>
            </CardHeader>
            <CardContent>
              <EnergySavingsChart isLoading={refreshing} data={trafficData?.energySavings} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-health" className="space-y-4">
          <SystemHealthDashboard data={systemHealthData} />
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="dashboard-card border-2 border-primary/10 shadow-md hover:shadow-lg transition-shadow card-hover-effect overflow-visible">
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>AI-generated recommendations and observations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4 bg-primary/5 hover:bg-primary/10 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-gradient-to-r from-primary to-secondary p-2">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Traffic Pattern Optimization</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      AI analysis suggests adjusting signal timing at Downtown corridor between 4-6 PM to improve flow
                      by an estimated 12%.
                    </p>
                    <div className="flex items-center mt-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        High Impact
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">Confidence: 92%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-secondary/5 hover:bg-secondary/10 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-gradient-to-r from-secondary to-accent p-2">
                    <Car className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">EV Charging Station Recommendation</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on EV traffic patterns, adding a charging station near the University corridor would
                      optimize energy usage for 15% of EV users.
                    </p>
                    <div className="flex items-center mt-2">
                      <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                        Medium Impact
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">Confidence: 87%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-accent/5 hover:bg-accent/10 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-gradient-to-r from-accent to-primary p-2">
                    <AlertTriangle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Predictive Maintenance Alert</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Signal S-006 at Downtown Blvd & Elm St shows early signs of performance degradation. Recommended
                      maintenance within 14 days.
                    </p>
                    <div className="flex items-center mt-2">
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        Attention Required
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">Confidence: 94%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <TrendingUp className="mr-2 h-4 w-4 text-primary" />
              View All Insights
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <Card className="dashboard-card border-2 border-primary/10 shadow-md hover:shadow-lg transition-shadow card-hover-effect overflow-visible">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events that may impact traffic patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Downtown Festival</h3>
                    <p className="text-sm text-muted-foreground">March 20-22, 2025</p>
                    <p className="text-sm mt-1">Expected 30% increase in traffic volume</p>
                    <Badge className="mt-2 bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">High Impact</Badge>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Road Construction</h3>
                    <p className="text-sm text-muted-foreground">April 5-15, 2025</p>
                    <p className="text-sm mt-1">Main Street corridor partial closure</p>
                    <Badge className="mt-2 bg-red-500/20 text-red-700 hover:bg-red-500/30">Critical</Badge>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">System Maintenance</h3>
                    <p className="text-sm text-muted-foreground">March 18, 2025</p>
                    <p className="text-sm mt-1">Scheduled 2-hour maintenance window</p>
                    <Badge className="mt-2 bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Low Impact</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Clock className="mr-2 h-4 w-4 text-primary" />
                View Calendar
              </Button>
            </CardFooter>
          </Card>

          <Card className="dashboard-card border-2 border-primary/10 shadow-md hover:shadow-lg transition-shadow card-hover-effect overflow-visible">
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                <Button variant="outline" className="border-primary/20 hover:bg-primary/10 transition-all">
                  <MapPin className="mr-2 h-4 w-4 text-primary" />
                  View Traffic Map
                </Button>
                <Button variant="outline" className="border-primary/20 hover:bg-primary/10 transition-all">
                  <Battery className="mr-2 h-4 w-4 text-primary" />
                  EV Stations
                </Button>
                <Button variant="outline" className="border-primary/20 hover:bg-primary/10 transition-all">
                  <AlertTriangle className="mr-2 h-4 w-4 text-primary" />
                  View Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

