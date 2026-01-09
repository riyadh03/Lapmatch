"use client"

import { ArrowLeft, Star, ExternalLink, Cpu, HardDrive, Monitor, Weight, Battery, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LaptopDetail({ laptop, onBack }) {
  if (!laptop) return null

  const specs = [
    { icon: Cpu, label: "Processor", value: laptop.cpu },
    { icon: Cpu, label: "Graphics", value: laptop.gpu },
    { icon: HardDrive, label: "Memory", value: laptop.ram },
    { icon: HardDrive, label: "Storage", value: laptop.storage },
    { icon: Monitor, label: "Display", value: `${laptop.screenSize} ${laptop.resolution || ""}` },
    { icon: Weight, label: "Weight", value: laptop.weight },
    { icon: Battery, label: "Battery", value: laptop.battery || "Up to 10 hours" },
    { icon: Wifi, label: "Connectivity", value: laptop.connectivity || "Wi-Fi 6, Bluetooth 5.0" },
  ]

  return (
    <div className="min-h-[calc(100vh-73px)] p-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <Button variant="ghost" onClick={onBack} className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to recommendations
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-secondary rounded-lg p-8 flex items-center justify-center mb-4">
              <img
                src={
                  laptop.image ||
                  `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(laptop.name + " laptop")}`
                }
                alt={laptop.name}
                className="object-contain max-h-64"
              />
            </div>
          </div>

          <div>
            <span className="text-sm text-muted-foreground uppercase tracking-wide">{laptop.brand}</span>
            <h1 className="text-3xl font-bold text-foreground mt-1 mb-4">{laptop.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                <span className="font-medium text-foreground">{laptop.rating}</span>
                <span className="text-muted-foreground">({laptop.reviews || 128} reviews)</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <span className="text-primary font-medium">{laptop.matchScore}% match</span>
            </div>

            <p className="text-muted-foreground mb-6">
              {laptop.description ||
                "A powerful and versatile laptop designed to handle your everyday tasks with ease. Perfect for work, entertainment, and everything in between."}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-bold text-foreground">${laptop.price.toLocaleString()}</span>
            </div>

            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => window.open(laptop.buyUrl || "#", "_blank")}
            >
              Buy Now
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="mt-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {specs.map((spec, index) => {
                const Icon = spec.icon
                return (
                  <div key={index} className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{spec.label}</p>
                      <p className="font-medium text-foreground">{spec.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
