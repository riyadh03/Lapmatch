"use client"

import { Laptop, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header({ user, onLogout, currentView }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Laptop className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">LaptopFinder</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="text-sm">{user?.email}</span>
            {user?.role === "admin" && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Admin</span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
