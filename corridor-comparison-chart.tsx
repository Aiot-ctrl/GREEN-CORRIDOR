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

interface CorridorComparisonChartProps {
  isLoading: boolean
  data?: {
    name: string
    id: string
    trafficFlow: number
    energySavings: number
    emissionsReduction: number
    efficiency: number
  }[]
  selectedCorridors: string[]
}

export function CorridorComparisonChart({ isLoading, data, selectedCorridors }: CorridorComparisonChartProps) {
  if (isLoading || !data) {
    return <Skeleton className="h-[400px] w-full" />
  }

  // Filter data based on selected corridors
  const filteredData = selectedCorridors.includes("all")
    ? data
    : data.filter((item) => selectedCorridors.includes(item.id))

  return (
    <ChartContainer className="h-[400px]">
      <Chart className="h-full">
        <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} tickMargin={12} />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} fontSize={12} tickMargin={12} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="border-none bg-background/80 backdrop-blur-sm"
              valueFormatter={(value, name) => {
                if (name === "trafficFlow") return `${value} vehicles/hour`
                if (name === "energySavings") return `${value} kWh`
                if (name === "emissionsReduction") return `${value} kg CO₂`
                return `${value}%`
              }}
            />
          }
        />
        <BarChart data={filteredData}>
          <Bar dataKey="efficiency" name="Efficiency" fill="hsl(var(--primary))" radius={4} />
          <Bar dataKey="trafficFlow" name="Traffic Flow" fill="hsl(var(--primary)/0.7)" radius={4} />
          <Bar dataKey="energySavings" name="Energy Savings" fill="hsl(var(--primary)/0.5)" radius={4} />
          <Bar dataKey="emissionsReduction" name="Emissions Reduction" fill="hsl(var(--primary)/0.3)" radius={4} />
        </BarChart>
      </Chart>
    </ChartContainer>
  )
}

