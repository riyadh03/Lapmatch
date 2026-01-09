"use client"

import { useState } from "react"
import { Laptop, Users, LayoutDashboard, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import AdminOverview from "./admin-overview"
import LaptopManagement from "./laptop-management"
import UserManagement from "./user-management"

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "laptops", label: "Laptops", icon: Laptop },
    { id: "users", label: "Users", icon: Users },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />
      case "laptops":
        return <LaptopManagement />
      case "users":
        return <UserManagement />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen border-r border-border bg-card">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <Laptop className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Admin Panel</span>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>

            <div className="mt-8 pt-8 border-t border-border">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={onLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{renderContent()}</main>
      </div>
    </div>
  )
}
