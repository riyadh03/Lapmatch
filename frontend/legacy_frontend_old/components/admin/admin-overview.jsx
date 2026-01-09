"use client"

import { Laptop, Users, TrendingUp, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  { label: "Total Laptops", value: "156", icon: Laptop, change: "+12 this month" },
  { label: "Total Users", value: "2,431", icon: Users, change: "+180 this month" },
  { label: "Recommendations", value: "8,642", icon: TrendingUp, change: "+24% from last month" },
  { label: "Purchases", value: "342", icon: ShoppingCart, change: "+18% from last month" },
]

export default function AdminOverview() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">Dashboard Overview</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New laptop added", item: "MacBook Pro 14", time: "2 hours ago" },
                { action: "User registered", item: "john@example.com", time: "3 hours ago" },
                { action: "Laptop updated", item: "Dell XPS 15", time: "5 hours ago" },
                { action: "Recommendation made", item: "Gaming category", time: "6 hours ago" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.item}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: "Gaming", count: 2341, percentage: 35 },
                { category: "Business", count: 1823, percentage: 28 },
                { category: "Student", count: 1456, percentage: 22 },
                { category: "Content Creation", count: 982, percentage: 15 },
              ].map((cat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{cat.category}</span>
                    <span className="text-sm text-muted-foreground">{cat.count}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
