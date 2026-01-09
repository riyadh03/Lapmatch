"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getMockLaptops } from "@/lib/mock-data"

export default function LaptopManagement() {
  const [laptops, setLaptops] = useState(getMockLaptops())
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingLaptop, setEditingLaptop] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    cpu: "",
    gpu: "",
    ram: "",
    storage: "",
    screenSize: "",
  })

  const filteredLaptops = laptops.filter(
    (laptop) =>
      laptop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      laptop.brand.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      brand: "",
      price: "",
      cpu: "",
      gpu: "",
      ram: "",
      storage: "",
      screenSize: "",
    })
    setEditingLaptop(null)
    setIsAddDialogOpen(true)
  }

  const handleOpenEdit = (laptop) => {
    setFormData({
      name: laptop.name,
      brand: laptop.brand,
      price: laptop.price.toString(),
      cpu: laptop.cpu,
      gpu: laptop.gpu,
      ram: laptop.ram,
      storage: laptop.storage,
      screenSize: laptop.screenSize,
    })
    setEditingLaptop(laptop)
    setIsAddDialogOpen(true)
  }

  const handleSave = () => {
    if (editingLaptop) {
      // Update existing laptop
      // Neo4j: MATCH (l:Laptop {id: $id}) SET l.name = $name, l.brand = $brand, ...
      setLaptops(
        laptops.map((l) =>
          l.id === editingLaptop.id ? { ...l, ...formData, price: Number.parseInt(formData.price) } : l,
        ),
      )
    } else {
      // Add new laptop
      // Neo4j: CREATE (l:Laptop {id: $id, name: $name, brand: $brand, ...})
      const newLaptop = {
        id: Date.now().toString(),
        ...formData,
        price: Number.parseInt(formData.price),
        rating: 4.5,
        matchScore: 85,
      }
      setLaptops([...laptops, newLaptop])
    }
    setIsAddDialogOpen(false)
  }

  const handleDelete = (id) => {
    // Neo4j: MATCH (l:Laptop {id: $id}) DELETE l
    setLaptops(laptops.filter((l) => l.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">Laptop Management</h1>
        <Button onClick={handleOpenAdd} className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Add Laptop
        </Button>
      </div>

      <Card className="bg-card border-border mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search laptops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-input text-foreground"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">All Laptops ({filteredLaptops.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Brand</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">CPU</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">RAM</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLaptops.map((laptop) => (
                  <tr key={laptop.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 text-foreground">{laptop.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{laptop.brand}</td>
                    <td className="py-3 px-4 text-foreground">${laptop.price.toLocaleString()}</td>
                    <td className="py-3 px-4 text-muted-foreground">{laptop.cpu}</td>
                    <td className="py-3 px-4 text-muted-foreground">{laptop.ram}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(laptop)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(laptop.id)}
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editingLaptop ? "Edit Laptop" : "Add New Laptop"}</DialogTitle>
            <DialogDescription>
              {editingLaptop ? "Update the laptop details below" : "Enter the details for the new laptop"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-secondary border-input text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Brand</Label>
                <Input
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="bg-secondary border-input text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Price ($)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-secondary border-input text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">CPU</Label>
                <Input
                  value={formData.cpu}
                  onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
                  className="bg-secondary border-input text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">GPU</Label>
                <Input
                  value={formData.gpu}
                  onChange={(e) => setFormData({ ...formData, gpu: e.target.value })}
                  className="bg-secondary border-input text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">RAM</Label>
                <Input
                  value={formData.ram}
                  onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                  className="bg-secondary border-input text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Storage</Label>
                <Input
                  value={formData.storage}
                  onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  className="bg-secondary border-input text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Screen Size</Label>
                <Input
                  value={formData.screenSize}
                  onChange={(e) => setFormData({ ...formData, screenSize: e.target.value })}
                  className="bg-secondary border-input text-foreground"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary text-primary-foreground">
              {editingLaptop ? "Save Changes" : "Add Laptop"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
