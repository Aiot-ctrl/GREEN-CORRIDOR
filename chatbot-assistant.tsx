"use client"

import { Switch } from "@/components/ui/switch"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Loader2,
  Paperclip,
  Image,
  Mic,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  HelpCircle,
  MessageSquare,
  SettingsIcon,
  History,
  Bookmark,
  Activity,
  BatteryCharging,
  Leaf,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ChatbotAssistantProps {
  onClose: () => void
}

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  isError?: boolean
  feedback?: "positive" | "negative" | null
}

// Expanded predefined responses for various topics
const RESPONSES = {
  greeting: [
    "Hello! I'm your AI assistant for the Green Corridor System. How can I help you today?",
    "Hi there! I'm here to help with any questions about the Green Corridor System.",
    "Welcome! I'm your AI assistant. What would you like to know about our traffic management system?",
  ],
  traffic: [
    "The current traffic flow across all corridors is operating at 87% efficiency. There are minor congestion points at Downtown and University Avenue corridors that the system is actively optimizing.",
    "Traffic is flowing smoothly in most corridors. The Main Street corridor is currently at 92% efficiency, while Downtown is at 78% due to higher volume.",
    "We're seeing optimal traffic flow in 8 out of 10 corridors. The system is currently adjusting signal timing to address congestion in the Downtown area.",
  ],
  energy: [
    "The system has saved approximately 1,245 kWh of energy today by optimizing traffic flow for electric vehicles. This represents a 15% improvement over traditional traffic management systems.",
    "Today's energy savings are at 1,320 kWh, with EV battery conservation accounting for 65% of these savings. This translates to approximately 924 kg of CO₂ emissions avoided.",
    "Our current energy efficiency metrics show a 17% improvement over last month. Electric vehicles are experiencing an average of 15.3% extended range due to optimized traffic flow.",
  ],
  signals: [
    "All traffic signals are currently operational. Two signals in the Downtown corridor are in warning status due to higher than normal traffic volume, but the AI is adapting signal timing to compensate.",
    "We have 98.2% uptime across all traffic signals. There's scheduled maintenance for signal S-006 at Downtown Blvd & Elm St on March 18, 2025.",
    "The traffic signal network is functioning at optimal capacity. The system is currently prioritizing green waves for corridors with higher EV and AV presence.",
  ],
  help: [
    "I can help you with information about traffic flow, energy savings, system status, and provide insights on how to interpret the dashboard data. Just ask me what you'd like to know!",
    "I'm here to assist with any questions about the Green Corridor System. I can provide real-time traffic data, explain system features, or help troubleshoot issues.",
    "You can ask me about traffic conditions, energy savings, system health, or any specific corridor performance. I can also generate reports and provide recommendations for optimization.",
  ],
  report: [
    "I can generate a detailed PDF report of system performance. Would you like a daily, weekly, or monthly report? You can also specify which metrics to include.",
    "Reports are available in several formats: daily summaries, weekly executive overviews, or detailed monthly analyses. What type of report would you prefer?",
    "I can prepare a comprehensive report including traffic flow, energy savings, and system health metrics. Would you like to focus on a specific time period or corridor?",
  ],
  corridors: [
    "We're currently monitoring 12 active corridors. The University Avenue corridor is showing the highest efficiency at 96%, while Downtown is at 78% due to higher traffic volume.",
    "All corridors are functioning within optimal parameters. Main Street and Industrial Zone corridors have seen a 12% improvement in flow efficiency over the past week.",
    "The Green Corridor System is actively managing traffic across all major arterial roads. The most efficient corridor currently is University Avenue with a 96% efficiency rating.",
  ],
  vehicles: [
    "Current vehicle distribution shows 30% electric vehicles, 20% autonomous vehicles, and 50% traditional vehicles across all corridors. EV adoption has increased by 15% since last quarter.",
    "We're tracking approximately 12,500 vehicles per hour across all corridors. The proportion of EVs and AVs continues to increase, with a 23% combined growth rate year-over-year.",
    "Vehicle type analysis shows that electric vehicles experience 15.3% better energy efficiency in our green corridors compared to traditional routes.",
  ],
  emissions: [
    "The Green Corridor System has reduced carbon emissions by approximately 8.2 tons this month by optimizing traffic flow and reducing idle time.",
    "Our emissions reduction metrics show a 20% decrease in CO₂ output compared to traditional traffic management systems. This is equivalent to planting about 410 trees.",
    "By reducing stop-and-go traffic patterns, we've decreased vehicle emissions by 22% across all corridors. The Downtown corridor alone accounts for 2.3 tons of CO₂ reduction.",
  ],
  ai: [
    "Our AI system uses machine learning to continuously improve traffic prediction accuracy. Current prediction models are operating at 94.7% accuracy.",
    "The AI prediction engine analyzes historical traffic patterns, weather data, and event schedules to optimize signal timing proactively rather than reactively.",
    "Our AI system is constantly learning from traffic patterns. It can now predict congestion points up to 30 minutes in advance with 92% accuracy.",
  ],
  maintenance: [
    "There are 3 scheduled maintenance activities in the coming week. The most critical is for Downtown Corridor Signal S-006 on March 18, 2025, at 02:00 AM.",
    "System maintenance is performed during low-traffic hours to minimize disruption. The next scheduled maintenance is for the AI Model Calibration on March 20, 2025.",
    "Preventive maintenance is scheduled for several components this week. All maintenance activities are tracked in the System Health dashboard.",
  ],
  charging: [
    "We currently have 28 EV charging stations across the city, with 85% availability. The busiest stations are in the Downtown and University corridors.",
    "Our charging network supports all major EV connector types, including CCS, CHAdeMO, and Tesla. Most stations offer Level 2 and DC Fast Charging options.",
    "The average charging time at our stations is 35 minutes, with most users charging to 80% capacity. We're planning to add 12 more stations by the end of the quarter.",
  ],
  weather: [
    "Current weather conditions are being factored into our traffic optimization algorithms. Rain is expected in the Downtown area, which typically increases congestion by 15-20%.",
    "Weather forecasts are integrated into our predictive models. We're expecting clear conditions for the next 48 hours, which should maintain optimal traffic flow.",
    "Severe weather alerts are automatically incorporated into our system. There's a storm warning for tomorrow evening, and we're already adjusting signal timing plans accordingly.",
  ],
  events: [
    "There's a major event at the Convention Center tonight that will impact Downtown traffic. We've implemented special signal timing to accommodate the increased volume.",
    "The weekend festival in the City Park area will affect several corridors. Our system has prepared alternative routes and adjusted signal timing to minimize congestion.",
    "The upcoming marathon will close several streets on Sunday morning. We've updated our traffic management plan and will be monitoring all affected corridors in real-time.",
  ],
  construction: [
    "There are currently 3 active construction zones affecting our corridors. The most significant impact is on Main Street, where we've implemented temporary signal timing.",
    "The bridge maintenance on River Road will continue for another 2 weeks. We've rerouted traffic through alternative corridors and adjusted signal timing accordingly.",
    "Construction on the new light rail line is affecting 4 intersections in the Downtown corridor. Our system is dynamically adjusting signal timing to minimize delays.",
  ],
  public_transport: [
    "Public transportation is fully integrated into our Green Corridor System. Buses are given priority at 24 key intersections to improve schedule adherence.",
    "The average bus delay has been reduced by 42% since implementing our transit signal priority system. This has increased ridership by an estimated 12%.",
    "We're monitoring 85 public transit vehicles in real-time, with an average on-time performance of 92%. The system automatically adjusts signal timing to prioritize buses that are behind schedule.",
  ],
  pedestrians: [
    "Pedestrian safety is a key priority in our system. We've implemented adaptive pedestrian crossing times at 35 high-traffic intersections.",
    "Pedestrian detection sensors at major intersections have reduced wait times by 28% while maintaining safety standards. The system automatically extends crossing times during peak pedestrian hours.",
    "Our pedestrian safety metrics show a 45% reduction in near-miss incidents since implementing the smart crossing system. We're expanding this technology to 15 additional intersections this year.",
  ],
  cyclists: [
    "Bicycle detection is active at 42 intersections, providing priority signaling for cyclists. This has increased bicycle traffic by 18% in designated green corridors.",
    "Our bicycle-friendly corridors have dedicated signal timing that creates 'green waves' for cyclists traveling at 12-15 mph, reducing stops by 65%.",
    "The bicycle detection system uses both in-pavement sensors and camera detection to ensure all cyclists are recognized. The system has a 96% detection accuracy rate.",
  ],
  fallback: [
    "I'm not sure I understand. Could you please rephrase your question about the Green Corridor System?",
    "I don't have specific information about that. Could you ask something related to traffic flow, energy savings, or system performance?",
    "I'm still learning about that topic. Could you ask about traffic conditions, corridor performance, or system metrics instead?",
  ],
}

// Function to get a random response from a category
const getRandomResponse = (category: keyof typeof RESPONSES) => {
  const responses = RESPONSES[category] || RESPONSES.fallback
  return responses[Math.floor(Math.random() * responses.length)]
}

// Function to determine the most relevant category based on user input
const determineCategory = (input: string): keyof typeof RESPONSES => {
  const lowercaseInput = input.toLowerCase()

  // Define keywords for each category
  const categoryKeywords: Record<keyof typeof RESPONSES, string[]> = {
    greeting: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"],
    traffic: ["traffic", "congestion", "flow", "volume", "cars", "road", "street", "highway", "jam"],
    energy: ["energy", "power", "battery", "electricity", "consumption", "usage", "saving", "efficiency"],
    signals: ["signal", "light", "intersection", "stoplight", "traffic light", "timing"],
    help: ["help", "assist", "support", "guide", "how to", "how do i", "what can you do"],
    report: ["report", "generate", "pdf", "document", "summary", "analysis", "export"],
    corridors: ["corridor", "road", "street", "avenue", "boulevard", "highway", "route", "path"],
    vehicles: ["vehicle", "car", "ev", "av", "electric", "autonomous", "traditional", "truck", "bus"],
    emissions: ["emission", "carbon", "co2", "pollution", "environmental", "green", "eco", "climate"],
    ai: ["ai", "artificial intelligence", "machine learning", "predict", "algorithm", "model"],
    maintenance: ["maintenance", "repair", "schedule", "upkeep", "service", "fix", "issue"],
    charging: ["charging", "charger", "station", "plug", "battery", "recharge", "power up"],
    weather: ["weather", "rain", "snow", "storm", "temperature", "forecast", "climate", "conditions"],
    events: ["event", "concert", "game", "festival", "parade", "marathon", "conference", "convention"],
    construction: ["construction", "roadwork", "work zone", "building", "repair", "maintenance", "detour"],
    public_transport: ["bus", "transit", "public transport", "subway", "metro", "train", "tram", "light rail"],
    pedestrians: ["pedestrian", "walker", "walking", "crosswalk", "crossing", "sidewalk", "footpath"],
    cyclists: ["cyclist", "bicycle", "bike", "biking", "cycling", "bike lane", "cycle path"],
    fallback: [],
  }

  // Check each category for keyword matches
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => lowercaseInput.includes(keyword))) {
      return category as keyof typeof RESPONSES
    }
  }

  // If no matches, check if it's a question
  if (
    lowercaseInput.includes("?") ||
    lowercaseInput.includes("what") ||
    lowercaseInput.includes("how") ||
    lowercaseInput.includes("why") ||
    lowercaseInput.includes("when") ||
    lowercaseInput.includes("where") ||
    lowercaseInput.includes("who") ||
    lowercaseInput.includes("can you")
  ) {
    return "help"
  }

  return "fallback"
}

export function ChatbotAssistant({ onClose }: ChatbotAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: getRandomResponse("greeting"),
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [suggestions, setSuggestions] = useState<string[]>([
    "How's the traffic flow today?",
    "Show me EV charging stations nearby",
    "What's the energy savings so far?",
    "Generate a weekly report",
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (!isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isMinimized])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setIsThinking(true)

    // Generate new suggestions based on context
    generateSuggestions(input)

    // Determine the most relevant category for the response
    const responseCategory = determineCategory(userMessage.content)

    // Simulate AI response with typing effect
    setTimeout(() => {
      setIsThinking(false)

      const responseText = getRandomResponse(responseCategory)

      // Simulate typing effect
      let i = 0
      const typingInterval = setInterval(() => {
        const partialResponse = responseText.substring(0, i)

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: partialResponse,
          timestamp: new Date(),
        }

        setMessages((prev) => {
          // Replace the last message if it's from the assistant and has the same ID
          if (
            prev.length > 0 &&
            prev[prev.length - 1].role === "assistant" &&
            prev[prev.length - 1].id === assistantMessage.id
          ) {
            return [...prev.slice(0, -1), assistantMessage]
          }
          // Otherwise add a new message
          return [...prev, assistantMessage]
        })

        i += Math.floor(Math.random() * 5) + 3 // Random typing speed

        if (i >= responseText.length) {
          clearInterval(typingInterval)
          setIsLoading(false)
        }
      }, 50)
    }, 1500)
  }

  const generateSuggestions = (currentInput: string) => {
    // Generate contextual suggestions based on the current conversation
    const category = determineCategory(currentInput)

    switch (category) {
      case "traffic":
        setSuggestions([
          "How does traffic compare to last week?",
          "Which corridor has the most congestion?",
          "What's the peak traffic time today?",
          "Show me real-time traffic flow",
        ])
        break
      case "energy":
        setSuggestions([
          "How much CO₂ was reduced?",
          "Compare energy savings by corridor",
          "What's the EV battery efficiency gain?",
          "Show energy usage trends",
        ])
        break
      case "report":
        setSuggestions([
          "Generate a daily performance report",
          "Create an environmental impact report",
          "Show me the executive summary",
          "Schedule weekly reports",
        ])
        break
      case "charging":
        setSuggestions([
          "Where is the nearest charging station?",
          "Show available fast chargers",
          "What's the average charging time?",
          "Plan a route with charging stops",
        ])
        break
      case "events":
        setSuggestions([
          "How will today's events affect traffic?",
          "Show me event-related detours",
          "When is the next major event?",
          "Optimize my route around events",
        ])
        break
      default:
        // Default suggestions
        setSuggestions([
          "Tell me about system health",
          "How are the traffic signals performing?",
          "Show me EV charging stations nearby",
          "What's the vehicle distribution today?",
        ])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    // Small delay to show the suggestion was selected
    setTimeout(() => {
      handleSendMessage()
    }, 300)
  }

  const handleFeedback = (messageId: string, feedback: "positive" | "negative") => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)))

    // Show feedback confirmation
    if (feedback === "positive") {
      const thankYouMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Thank you for your positive feedback! I'm glad that was helpful.",
        timestamp: new Date(),
      }
      setTimeout(() => {
        setMessages((prev) => [...prev, thankYouMessage])
      }, 500)
    } else {
      const improvementMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I appreciate your feedback. I'll work on improving my responses to better assist you in the future.",
        timestamp: new Date(),
      }
      setTimeout(() => {
        setMessages((prev) => [...prev, improvementMessage])
      }, 500)
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          className="rounded-full h-16 w-16 shadow-lg relative bg-gradient-to-r from-primary to-secondary hover:opacity-90 animate-pulse-glow"
          onClick={() => setIsMinimized(false)}
        >
          <Bot className="h-8 w-8 text-white" />
          <Badge className="absolute -top-1 -right-1 h-6 w-6 p-0 rounded-full bg-accent border-2 border-background flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">3</span>
          </Badge>
        </Button>
      </div>
    )
  }

  return (
    <div
      className={`fixed z-50 rounded-lg border bg-background/95 backdrop-blur-md shadow-xl flex flex-col transition-all duration-300 ${
        isExpanded ? "inset-4 md:inset-10" : "bottom-4 right-4 w-96 md:w-[450px]"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-full p-1.5">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-medium">Green Corridor AI Assistant</h3>
          <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20 text-xs">
            <Sparkles className="h-3 w-3 mr-1" /> Smart
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(true)}
                  className="hover:bg-primary/10"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Minimize</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleExpand} className="hover:bg-primary/10">
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isExpanded ? "Minimize" : "Expand"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-primary/10">
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Close</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="px-4 pt-2 bg-transparent justify-start border-b rounded-none gap-2">
          <TabsTrigger
            value="chat"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <MessageSquare className="h-4 w-4 mr-1" /> Chat
          </TabsTrigger>
          <TabsTrigger
            value="help"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <HelpCircle className="h-4 w-4 mr-1" /> Help
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <History className="h-4 w-4 mr-1" /> History
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <SettingsIcon className="h-4 w-4 mr-1" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
          <ScrollArea className="flex-1 p-4 h-[350px]">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-3",
                      message.role === "user"
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                        : message.isError
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted/80 shadow-sm",
                    )}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                      {message.role === "assistant" && !message.isError && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full hover:bg-success/20"
                            onClick={() => handleFeedback(message.id, "positive")}
                          >
                            <ThumbsUp
                              className={cn(
                                "h-3 w-3",
                                message.feedback === "positive" ? "text-success fill-success" : "text-muted-foreground",
                              )}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full hover:bg-destructive/20"
                            onClick={() => handleFeedback(message.id, "negative")}
                          >
                            <ThumbsDown
                              className={cn(
                                "h-3 w-3",
                                message.feedback === "negative"
                                  ? "text-destructive fill-destructive"
                                  : "text-muted-foreground",
                              )}
                            />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start animate-fade-in">
                  <div className="max-w-[80%] rounded-lg px-4 py-3 bg-muted/80 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Suggestions */}
          {!isLoading && suggestions.length > 0 && (
            <div className="px-4 py-2 border-t border-border/50">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-primary/5 hover:bg-primary/10 border-primary/20 transition-all"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about traffic, charging stations, energy savings..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border-primary/20 focus-visible:ring-primary/30 rounded-full pl-4"
                ref={inputRef}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-full"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Attach file</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
                        <Image className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Attach image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
                        <Mic className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Voice input</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <p className="text-xs text-muted-foreground">Powered by Green Corridor AI</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="help" className="flex-1 p-4 overflow-auto">
          <div className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="font-medium text-lg mb-2 text-primary">How can I help you?</h3>
              <p className="text-sm mb-4">Here are some things you can ask me about:</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-primary/10 hover:border-primary/30 transition-all">
                  <h4 className="font-medium text-sm flex items-center gap-1">
                    <Activity className="h-4 w-4 text-primary" /> Traffic Information
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">Current conditions, congestion, flow rates</p>
                </div>

                <div className="bg-white p-3 rounded-lg shadow-sm border border-primary/10 hover:border-primary/30 transition-all">
                  <h4 className="font-medium text-sm flex items-center gap-1">
                    <BatteryCharging className="h-4 w-4 text-primary" /> EV Charging
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">Station locations, availability, charging times</p>
                </div>

                <div className="bg-white p-3 rounded-lg shadow-sm border border-primary/10 hover:border-primary/30 transition-all">
                  <h4 className="font-medium text-sm flex items-center gap-1">
                    <Leaf className="h-4 w-4 text-primary" /> Environmental Impact
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">Emissions reduction, energy savings</p>
                </div>

                <div className="bg-white p-3 rounded-lg shadow-sm border border-primary/10 hover:border-primary/30 transition-all">
                  <h4 className="font-medium text-sm flex items-center gap-1">
                    <FileText className="h-4 w-4 text-primary" /> Reports
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">Generate and schedule system reports</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Example questions:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• "What's the current traffic flow in the Downtown corridor?"</li>
                  <li>• "Where is the nearest available EV charging station?"</li>
                  <li>• "How much energy has the system saved today?"</li>
                  <li>• "Generate a weekly performance report"</li>
                  <li>• "What events might affect traffic tomorrow?"</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setInput("Show me the traffic map")
                  setActiveTab("chat")
                  setTimeout(() => handleSendMessage(), 300)
                }}
              >
                <HelpCircle className="mr-2 h-4 w-4 text-primary" />
                <span>How to use the traffic map</span>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setInput("How do I find EV charging stations?")
                  setActiveTab("chat")
                  setTimeout(() => handleSendMessage(), 300)
                }}
              >
                <HelpCircle className="mr-2 h-4 w-4 text-primary" />
                <span>Finding charging stations</span>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setInput("Explain the dashboard metrics")
                  setActiveTab("chat")
                  setTimeout(() => handleSendMessage(), 300)
                }}
              >
                <HelpCircle className="mr-2 h-4 w-4 text-primary" />
                <span>Understanding metrics</span>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setInput("How to generate reports")
                  setActiveTab("chat")
                  setTimeout(() => handleSendMessage(), 300)
                }}
              >
                <HelpCircle className="mr-2 h-4 w-4 text-primary" />
                <span>Creating reports</span>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1 p-4 overflow-auto">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Recent Conversations</h3>

            <div className="space-y-2">
              {[
                {
                  title: "Traffic flow analysis",
                  date: "Today, 2:30 PM",
                  preview: "Discussed Downtown corridor congestion patterns",
                },
                {
                  title: "EV charging stations",
                  date: "Yesterday, 10:15 AM",
                  preview: "Located nearest available charging stations",
                },
                {
                  title: "Weekly performance report",
                  date: "Mar 15, 2025",
                  preview: "Generated system efficiency report",
                },
                {
                  title: "Energy savings calculation",
                  date: "Mar 12, 2025",
                  preview: "Analyzed energy conservation metrics",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:bg-primary/5 cursor-pointer transition-all"
                  onClick={() => setActiveTab("chat")}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.preview}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" size="sm" className="text-primary">
                <Bookmark className="mr-2 h-4 w-4" />
                Saved Conversations
              </Button>

              <Button variant="outline" size="sm">
                View All History
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="flex-1 p-4 overflow-auto">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Assistant Settings</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Response Detail Level</h4>
                  <p className="text-xs text-muted-foreground">Adjust how detailed the responses are</p>
                </div>
                <Select defaultValue="balanced">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Suggestions</h4>
                  <p className="text-xs text-muted-foreground">Show contextual suggestions</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Voice Input</h4>
                  <p className="text-xs text-muted-foreground">Enable voice commands</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Notification Sounds</h4>
                  <p className="text-xs text-muted-foreground">Play sounds for new messages</p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Data Privacy</h4>
                  <p className="text-xs text-muted-foreground">Manage how your data is used</p>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Clear Conversation</h4>
                  <p className="text-xs text-muted-foreground">Delete current conversation history</p>
                </div>
                <Button variant="outline" size="sm" className="text-destructive">
                  Clear
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Save Settings
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

