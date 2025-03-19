"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Bar,
  BarChart,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface CorridorPerformanceChartProps {
  isLoading: boolean
  data?: {
    name: string
    efficiency: number
    target: number
  }[]
}

export function CorridorPerformanceChart({ isLoading, data }: CorridorPerformanceChartProps) {
  if (isLoading || !data) {
    return <Skeleton className="h-[300px] w-full" />
  }

  // Calculate average efficiency
  const averageEfficiency = data.reduce((sum, item) => sum + item.efficiency, 0) / data.length

  // Find best and worst performing corridors
  const bestCorridor = data.reduce((max, item) => (item.efficiency > max.efficiency ? item : max), data[0])
  const worstCorridor = data.reduce((min, item) => (item.efficiency < min.efficiency ? item : min), data[0])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card className="rounded-md border p-3 bg-gradient-to-br from-background to-muted/30">
          <div className="text-sm font-medium text-muted-foreground">Average Efficiency</div>
          <div className="text-2xl font-bold">{Math.round(averageEfficiency)}%</div>
          <div className="text-xs text-muted-foreground">across all corridors</div>
        </Card>
        <Card className="rounded-md border p-3 bg-gradient-to-br from-background to-muted/30">
          <div className="text-sm font-medium text-muted-foreground">Best Performing</div>
          <div className="text-2xl font-bold">{bestCorridor.name}</div>
          <div className="text-xs text-muted-foreground">{bestCorridor.efficiency}% efficiency</div>
        </Card>
        <Card className="rounded-md border p-3 bg-gradient-to-br from-background to-muted/30">
          <div className="text-sm font-medium text-muted-foreground">Needs Improvement</div>
          <div className="text-2xl font-bold">{worstCorridor.name}</div>
          <div className="text-xs text-muted-foreground">{worstCorridor.efficiency}% efficiency</div>
        </Card>
      </div>

      <ChartContainer className="h-[300px]">
        <Chart className="h-full">
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} tickMargin={12} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
            fontSize={12}
            tickMargin={12}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="border-none bg-background/80 backdrop-blur-sm"
                valueFormatter={(value) => `${value}%`}
              />
            }
          />
          <BarChart data={data}>
            <Bar dataKey="efficiency" fill="hsl(var(--primary))" radius={4} />
            <Bar dataKey="target" fill="hsl(var(--muted-foreground)/0.3)" radius={4} />
          </BarChart>
        </Chart>
      </ChartContainer>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <div>
            <span className="inline-block w-3 h-3 bg-primary mr-1"></span>
            Current Efficiency
          </div>
          <div>
            <span className="inline-block w-3 h-3 bg-muted-foreground/30 mr-1"></span>
            Target Efficiency
          </div>
        </div>

        <Card className="rounded-md border p-3 bg-gradient-to-br from-background to-muted/30">
          <h4 className="text-sm font-medium mb-2">Corridor Status</h4>
          <div className="space-y-2">
            {data.map((corridor) => (
              <div key={corridor.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      corridor.efficiency >= 90
                        ? "bg-green-500"
                        : corridor.efficiency >= 75
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm">{corridor.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{corridor.efficiency}%</span>
                  <Badge
                    variant="outline"
                    className={
                      corridor.efficiency >= corridor.target
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    }
                  >
                    {corridor.efficiency >= corridor.target ? "On Target" : "Below Target"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

