import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "LaptopFinder - Smart Recommendations",
  description: "Get personalized laptop recommendations based on your needs",
    generator: 'v0.app'
}

export const viewport = {
  themeColor: "#0a0a0a",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
