"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  LinearGradient,
  LinearGradientStop,
} from "@/components/ui/chart"

interface EnergySavingsChartProps {
  isLoading: boolean
  data?: {
    date: string
    amount: number
    cumulative: number
  }[]
}

export function EnergySavingsChart({ isLoading, data }: EnergySavingsChartProps) {
  if (isLoading || !data) {
    return <Skeleton className="h-[300px] w-full" />
  }

  // Calculate total energy saved
  const totalEnergySaved = data[data.length - 1]?.cumulative || 0

  // Calculate CO2 equivalent (rough estimate: 0.7 kg CO2 per kWh)
  const co2Reduction = totalEnergySaved * 0.7

  // Calculate equivalent in trees (rough estimate: 20 kg CO2 per tree per year)
  const treesEquivalent = Math.round(co2Reduction / 20)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-md border p-3">
          <div className="text-sm font-medium text-muted-foreground">Total Energy Saved</div>
          <div className="text-2xl font-bold">{totalEnergySaved} kWh</div>
          <div className="text-xs text-muted-foreground">this period</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-sm font-medium text-muted-foreground">CO₂ Reduction</div>
          <div className="text-2xl font-bold">{co2Reduction.toFixed(1)} kg</div>
          <div className="text-xs text-muted-foreground">carbon dioxide equivalent</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-sm font-medium text-muted-foreground">Environmental Impact</div>
          <div className="text-2xl font-bold">{treesEquivalent} trees</div>
          <div className="text-xs text-muted-foreground">annual absorption equivalent</div>
        </div>
      </div>

      <ChartContainer className="h-[300px]">
        <Chart className="h-full">
          <LinearGradient id="energyGradient" direction="bottom">
            <LinearGradientStop offset="0%" color="hsl(var(--primary))" opacity={0.3} />
            <LinearGradientStop offset="100%" color="hsl(var(--primary))" opacity={0} />
          </LinearGradient>
          <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} tickMargin={12} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value} kWh`}
            fontSize={12}
            tickMargin={12}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="border-none bg-background/80 backdrop-blur-sm"
                valueFormatter={(value) => `${value} kWh`}
              />
            }
          />
          <AreaChart
            data={data}
            dataKey="amount"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#energyGradient)"
          >
            <Area dataKey="amount" stroke="hsl(var(--primary))" fill="url(#energyGradient)" />
          </AreaChart>
        </Chart>
      </ChartContainer>

      <div className="rounded-md border p-3">
        <h4 className="text-sm font-medium mb-2">Energy Savings Breakdown</h4>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>EV Battery Conservation</span>
              <span className="font-medium">65%</span>
            </div>
            <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
              <div className="bg-primary h-1.5 w-[65%]" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Reduced Idling Time</span>
              <span className="font-medium">25%</span>
            </div>
            <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
              <div className="bg-primary h-1.5 w-[25%]" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Optimized Acceleration/Deceleration</span>
              <span className="font-medium">10%</span>
            </div>
            <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
              <div className="bg-primary h-1.5 w-[10%]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <div>
          <span className="inline-block w-3 h-3 bg-primary/30 mr-1"></span>
          Daily Energy Savings
        </div>
        <div>
          <span className="inline-block w-3 h-1 border-b border-dashed border-primary mr-1"></span>
          Cumulative Savings
        </div>
      </div>
    </div>
  )
}

