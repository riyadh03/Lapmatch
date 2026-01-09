"use client"

import { useState } from "react"
import { Laptop, Mail, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Mock users for testing
const MOCK_USERS = [
  { email: "user@test.com", password: "password123", role: "user" },
  { email: "admin@test.com", password: "admin123", role: "admin" },
]

export default function LoginForm({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock authentication - Replace with Firebase Auth
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (user) {
      onLogin({ email: user.email, role: user.role })
    } else {
      setError("Invalid email or password")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Laptop className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">LaptopFinder</h1>
          <p className="text-muted-foreground mt-2">Get personalized laptop recommendations</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-secondary border-input text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-secondary border-input text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <button onClick={onSwitchToSignup} className="text-primary hover:underline font-medium">
                Sign up
              </button>
            </div>
            <div className="text-xs text-muted-foreground bg-secondary p-3 rounded-lg w-full">
              <p className="font-medium mb-1">Test Credentials:</p>
              <p>User: user@test.com / password123</p>
              <p>Admin: admin@test.com / admin123</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
