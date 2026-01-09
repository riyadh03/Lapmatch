"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Briefcase, Gamepad2, GraduationCap, Video, Code, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { getMockRecommendations } from "@/lib/mock-data"

const USAGE_OPTIONS = [
  { id: "office", label: "Office Work", icon: Briefcase, description: "Documents, emails, browsing" },
  { id: "gaming", label: "Gaming", icon: Gamepad2, description: "AAA games, high performance" },
  { id: "student", label: "Student", icon: GraduationCap, description: "Research, note-taking, light apps" },
  { id: "content", label: "Content Creation", icon: Video, description: "Video editing, streaming" },
  { id: "development", label: "Development", icon: Code, description: "Coding, VMs, containers" },
  { id: "design", label: "Design", icon: Palette, description: "Graphic design, 3D modeling" },
]

export default function NonExpertForm({ onSubmit, onBack }) {
  const [usage, setUsage] = useState("")
  const [budget, setBudget] = useState([1000])
  const [importance, setImportance] = useState([3])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call - Replace with Neo4j query
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get mock recommendations based on usage and budget
    const recommendations = getMockRecommendations(usage, budget[0])
    onSubmit(recommendations)

    setLoading(false)
  }

  const importanceLabels = ["Low", "Below Avg", "Average", "Above Avg", "High"]

  return (
    <div className="min-h-[calc(100vh-73px)] p-4 bg-background">
      <div className="container mx-auto max-w-2xl">
        <Button variant="ghost" onClick={onBack} className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Recommendations</CardTitle>
            <CardDescription>Answer a few simple questions to get personalized laptop suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label className="text-foreground text-base">What will you primarily use your laptop for?</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {USAGE_OPTIONS.map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setUsage(option.id)}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          usage === option.id
                            ? "border-primary bg-primary/10"
                            : "border-border bg-secondary hover:border-muted-foreground"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 mb-2 ${usage === option.id ? "text-primary" : "text-muted-foreground"}`}
                        />
                        <p
                          className={`font-medium text-sm ${usage === option.id ? "text-foreground" : "text-foreground"}`}
                        >
                          {option.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground text-base">Budget</Label>
                  <span className="text-primary font-bold">${budget[0].toLocaleString()}</span>
                </div>
                <Slider value={budget} onValueChange={setBudget} min={300} max={5000} step={100} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$300</span>
                  <span>$5,000</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground text-base">Performance Importance</Label>
                  <span className="text-primary font-medium">{importanceLabels[importance[0] - 1]}</span>
                </div>
                <Slider value={importance} onValueChange={setImportance} min={1} max={5} step={1} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Battery Life Priority</span>
                  <span>Performance Priority</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!usage || loading}
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
