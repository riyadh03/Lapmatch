"use client"

import { GraduationCap, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UserTypeSelection({ onSelect }) {
  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">How would you like to find your laptop?</h1>
          <p className="text-muted-foreground">Choose the mode that best fits your technical knowledge</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="bg-card border-border cursor-pointer hover:border-primary transition-colors group"
            onClick={() => onSelect("nonExpert")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-foreground">Quick & Easy</CardTitle>
              <CardDescription>Perfect for beginners or anyone who wants simple recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Answer 3 simple questions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Based on your usage and budget
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Get instant recommendations
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className="bg-card border-border cursor-pointer hover:border-primary transition-colors group"
            onClick={() => onSelect("expert")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-foreground">Expert Mode</CardTitle>
              <CardDescription>For tech-savvy users who know exactly what they want</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Specify exact specifications
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  CPU, GPU, RAM, Storage preferences
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Fine-tuned recommendations
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
