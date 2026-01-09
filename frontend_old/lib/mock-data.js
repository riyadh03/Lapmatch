// Mock data for laptop recommendations
// Replace with Neo4j queries in production

const LAPTOPS = [
  {
    id: "1",
    name: "MacBook Pro 14",
    brand: "Apple",
    price: 1999,
    cpu: "Apple M3 Pro",
    gpu: "Apple M3 Pro GPU",
    ram: "18GB",
    storage: "512GB SSD",
    screenSize: '14.2"',
    weight: "1.6 kg",
    rating: 4.9,
    matchScore: 95,
    category: ["development", "design", "content"],
  },
  {
    id: "2",
    name: "Dell XPS 15",
    brand: "Dell",
    price: 1799,
    cpu: "Intel Core i7-13700H",
    gpu: "NVIDIA RTX 4060",
    ram: "16GB",
    storage: "512GB SSD",
    screenSize: '15.6"',
    weight: "1.86 kg",
    rating: 4.7,
    matchScore: 90,
    category: ["development", "office", "content"],
  },
  {
    id: "3",
    name: "ASUS ROG Zephyrus G14",
    brand: "ASUS",
    price: 1599,
    cpu: "AMD Ryzen 9 7940HS",
    gpu: "NVIDIA RTX 4060",
    ram: "16GB",
    storage: "1TB SSD",
    screenSize: '14"',
    weight: "1.72 kg",
    rating: 4.8,
    matchScore: 92,
    category: ["gaming", "development"],
  },
  {
    id: "4",
    name: "Lenovo ThinkPad X1 Carbon",
    brand: "Lenovo",
    price: 1649,
    cpu: "Intel Core i7-1365U",
    gpu: "Intel Iris Xe",
    ram: "16GB",
    storage: "512GB SSD",
    screenSize: '14"',
    weight: "1.12 kg",
    rating: 4.6,
    matchScore: 88,
    category: ["office", "student"],
  },
  {
    id: "5",
    name: "HP Spectre x360",
    brand: "HP",
    price: 1399,
    cpu: "Intel Core i7-1355U",
    gpu: "Intel Iris Xe",
    ram: "16GB",
    storage: "512GB SSD",
    screenSize: '13.5"',
    weight: "1.36 kg",
    rating: 4.5,
    matchScore: 85,
    category: ["office", "student", "design"],
  },
  {
    id: "6",
    name: "Razer Blade 15",
    brand: "Razer",
    price: 2499,
    cpu: "Intel Core i9-13950HX",
    gpu: "NVIDIA RTX 4070",
    ram: "32GB",
    storage: "1TB SSD",
    screenSize: '15.6"',
    weight: "2.01 kg",
    rating: 4.7,
    matchScore: 94,
    category: ["gaming", "content"],
  },
  {
    id: "7",
    name: "Acer Swift 3",
    brand: "Acer",
    price: 699,
    cpu: "AMD Ryzen 5 5500U",
    gpu: "AMD Radeon Graphics",
    ram: "8GB",
    storage: "512GB SSD",
    screenSize: '14"',
    weight: "1.2 kg",
    rating: 4.3,
    matchScore: 78,
    category: ["student", "office"],
  },
  {
    id: "8",
    name: "MSI Creator Z16",
    brand: "MSI",
    price: 2299,
    cpu: "Intel Core i9-12900H",
    gpu: "NVIDIA RTX 3060",
    ram: "32GB",
    storage: "1TB SSD",
    screenSize: '16"',
    weight: "2.2 kg",
    rating: 4.6,
    matchScore: 91,
    category: ["design", "content", "development"],
  },
]

export function getMockRecommendations(usage, budget) {
  // Simulate Neo4j query filtering
  // MATCH (l:Laptop) WHERE l.price <= $budget AND $usage IN l.category RETURN l ORDER BY l.matchScore DESC

  let filtered = LAPTOPS.filter((l) => l.price <= budget * 1.2)

  if (usage && usage !== "expert") {
    filtered = filtered.filter((l) => l.category.includes(usage))
  }

  // Sort by match score
  filtered.sort((a, b) => b.matchScore - a.matchScore)

  // Return top 5
  return filtered.slice(0, 5)
}

export function getMockLaptops() {
  return LAPTOPS
}
