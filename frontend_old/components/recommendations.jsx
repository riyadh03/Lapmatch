"use client"

import { ArrowLeft, Star, Cpu, HardDrive, Monitor, Weight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Recommendations({ laptops, onSelect, onBack }) {
  return (
    <div className="min-h-[calc(100vh-73px)] p-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <Button variant="ghost" onClick={onBack} className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Recommended Laptops</h1>
          <p className="text-muted-foreground">Based on your preferences, here are the best matches</p>
        </div>

        <div className="grid gap-4">
          {laptops.map((laptop, index) => (
            <Card
              key={laptop.id}
              className="bg-card border-border cursor-pointer hover:border-primary transition-all group"
              onClick={() => onSelect(laptop)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 h-32 bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={
                        laptop.image ||
                        `/placeholder.svg?height=128&width=192&query=${encodeURIComponent(laptop.name + " laptop")}`
                      }
                      alt={laptop.name}
                      className="object-contain h-full w-full"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">{laptop.brand}</span>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {laptop.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-medium text-foreground">{laptop.rating}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Cpu className="h-4 w-4" />
                        <span>{laptop.cpu}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <HardDrive className="h-4 w-4" />
                        <span>{laptop.ram} RAM</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Monitor className="h-4 w-4" />
                        <span>{laptop.screenSize}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Weight className="h-4 w-4" />
                        <span>{laptop.weight}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${laptop.price.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">Match score: {laptop.matchScore}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
