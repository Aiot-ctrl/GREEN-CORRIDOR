"use client"

import { Lightbulb, TrendingUp, AlertTriangle, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface AIInsightsPanelProps {
  isLoading: boolean
  data?: {
    insights: {
      type: "improvement" | "warning" | "prediction"
      title: string
      description: string
      impact: string
      confidence: number
    }[]
  }
}

export function AIInsightsPanel({ isLoading, data }: AIInsightsPanelProps) {
  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "improvement":
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "prediction":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <Lightbulb className="h-5 w-5 text-primary" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "improvement":
        return "bg-green-500/10 border-green-500/20"
      case "warning":
        return "bg-amber-500/10 border-amber-500/20"
      case "prediction":
        return "bg-blue-500/10 border-blue-500/20"
      default:
        return "bg-primary/10 border-primary/20"
    }
  }

  return (
    <div className="space-y-4">
      {data.insights.map((insight, index) => (
        <div key={index} className={`rounded-lg border p-4 ${getInsightColor(insight.type)}`}>
          <div className="flex items-start gap-4">
            <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
            <div className="space-y-1">
              <h3 className="font-medium">{insight.title}</h3>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-medium">Impact: {insight.impact}</span>
                <span className="text-xs">Confidence: {insight.confidence}%</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

