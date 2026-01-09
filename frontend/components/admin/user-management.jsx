"use client"

import { useState } from "react"
import { Search, Shield, ShieldOff, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const MOCK_USERS = [
  { id: "1", email: "john@example.com", name: "John Doe", role: "user", joined: "2024-01-15" },
  { id: "2", email: "jane@example.com", name: "Jane Smith", role: "user", joined: "2024-01-20" },
  { id: "3", email: "mike@example.com", name: "Mike Johnson", role: "admin", joined: "2024-02-01" },
  { id: "4", email: "sarah@example.com", name: "Sarah Wilson", role: "user", joined: "2024-02-10" },
  { id: "5", email: "david@example.com", name: "David Brown", role: "user", joined: "2024-02-15" },
]

export default function UserManagement() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleRole = (id) => {
    // Neo4j: MATCH (u:User {id: $id}) SET u.role = $newRole
    setUsers(users.map((u) => (u.id === id ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u)))
  }

  const deleteUser = (id) => {
    // Neo4j: MATCH (u:User {id: $id}) DELETE u
    setUsers(users.filter((u) => u.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
      </div>

      <Card className="bg-card border-border mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-input text-foreground"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 text-foreground">{user.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          user.role === "admin"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{user.joined}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRole(user.id)}
                        className="text-muted-foreground hover:text-foreground"
                        title={user.role === "admin" ? "Remove admin" : "Make admin"}
                      >
                        {user.role === "admin" ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
