"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { getMockRecommendations } from "@/lib/mock-data"

export default function ExpertForm({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    cpuBrand: "",
    gpuBrand: "",
    minRam: [8],
    minStorage: [256],
    screenSize: "",
    maxWeight: [2.5],
    budget: [1500],
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call - Replace with Neo4j query
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get mock recommendations
    const recommendations = getMockRecommendations("expert", formData.budget[0])
    onSubmit(recommendations)

    setLoading(false)
  }

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-[calc(100vh-73px)] p-4 bg-background">
      <div className="container mx-auto max-w-2xl">
        <Button variant="ghost" onClick={onBack} className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Expert Specifications</CardTitle>
            <CardDescription>Define your exact requirements for precise recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground">CPU Brand</Label>
                  <Select value={formData.cpuBrand} onValueChange={(v) => updateField("cpuBrand", v)}>
                    <SelectTrigger className="bg-secondary border-input text-foreground">
                      <SelectValue placeholder="Select CPU" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="intel">Intel</SelectItem>
                      <SelectItem value="amd">AMD</SelectItem>
                      <SelectItem value="apple">Apple Silicon</SelectItem>
                      <SelectItem value="any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">GPU Brand</Label>
                  <Select value={formData.gpuBrand} onValueChange={(v) => updateField("gpuBrand", v)}>
                    <SelectTrigger className="bg-secondary border-input text-foreground">
                      <SelectValue placeholder="Select GPU" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="nvidia">NVIDIA</SelectItem>
                      <SelectItem value="amd">AMD</SelectItem>
                      <SelectItem value="intel">Intel Integrated</SelectItem>
                      <SelectItem value="apple">Apple Integrated</SelectItem>
                      <SelectItem value="any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Minimum RAM</Label>
                  <span className="text-primary font-bold">{formData.minRam[0]} GB</span>
                </div>
                <Slider
                  value={formData.minRam}
                  onValueChange={(v) => updateField("minRam", v)}
                  min={4}
                  max={64}
                  step={4}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Minimum Storage</Label>
                  <span className="text-primary font-bold">{formData.minStorage[0]} GB</span>
                </div>
                <Slider
                  value={formData.minStorage}
                  onValueChange={(v) => updateField("minStorage", v)}
                  min={128}
                  max={2048}
                  step={128}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Screen Size</Label>
                <Select value={formData.screenSize} onValueChange={(v) => updateField("screenSize", v)}>
                  <SelectTrigger className="bg-secondary border-input text-foreground">
                    <SelectValue placeholder="Select screen size" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="13">13 inches</SelectItem>
                    <SelectItem value="14">14 inches</SelectItem>
                    <SelectItem value="15">15.6 inches</SelectItem>
                    <SelectItem value="16">16 inches</SelectItem>
                    <SelectItem value="17">17 inches</SelectItem>
                    <SelectItem value="any">Any size</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Maximum Weight</Label>
                  <span className="text-primary font-bold">{formData.maxWeight[0]} kg</span>
                </div>
                <Slider
                  value={formData.maxWeight}
                  onValueChange={(v) => updateField("maxWeight", v)}
                  min={1}
                  max={4}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Budget</Label>
                  <span className="text-primary font-bold">${formData.budget[0].toLocaleString()}</span>
                </div>
                <Slider
                  value={formData.budget}
                  onValueChange={(v) => updateField("budget", v)}
                  min={300}
                  max={5000}
                  step={100}
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Finding laptops..." : "Get Recommendations"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
