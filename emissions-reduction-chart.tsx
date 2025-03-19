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

interface EmissionsReductionChartProps {
  isLoading: boolean
  data?: {
    date: string
    reduction: number
    cumulative: number
  }[]
}

export function EmissionsReductionChart({ isLoading, data }: EmissionsReductionChartProps) {
  if (isLoading || !data) {
    return <Skeleton className="h-[400px] w-full" />
  }

  return (
    <ChartContainer className="h-[400px]">
      <Chart className="h-full">
        <LinearGradient id="emissionsGradient" direction="bottom">
          <LinearGradientStop offset="0%" color="hsl(var(--primary))" opacity={0.3} />
          <LinearGradientStop offset="100%" color="hsl(var(--primary))" opacity={0} />
        </LinearGradient>
        <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} tickMargin={12} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} kg`}
          fontSize={12}
          tickMargin={12}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="border-none bg-background/80 backdrop-blur-sm"
              valueFormatter={(value) => `${value} kg CO₂`}
            />
          }
        />
        <AreaChart
          data={data}
          dataKey="reduction"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="url(#emissionsGradient)"
        >
          <Area dataKey="reduction" stroke="hsl(var(--primary))" fill="url(#emissionsGradient)" />
          <Area dataKey="cumulative" stroke="hsl(var(--primary)/0.5)" fill="none" strokeDasharray="4 4" />
        </AreaChart>
      </Chart>
    </ChartContainer>
  )
}

