"use client"

import { useState } from "react"
import LoginForm from "@/components/login-form"
import SignupForm from "@/components/signup-form"
import UserTypeSelection from "@/components/user-type-selection"
import NonExpertForm from "@/components/non-expert-form"
import ExpertForm from "@/components/expert-form"
import Recommendations from "@/components/recommendations"
import LaptopDetail from "@/components/laptop-detail"
import AdminDashboard from "@/components/admin/admin-dashboard"
import Header from "@/components/header"

export default function Home() {
  const [currentView, setCurrentView] = useState("login")
  const [user, setUser] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [selectedLaptop, setSelectedLaptop] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
    if (userData.role === "admin") {
      setCurrentView("admin")
    } else {
      setCurrentView("userType")
    }
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView("login")
    setRecommendations([])
    setSelectedLaptop(null)
  }

  const handleUserTypeSelect = (type) => {
    if (type === "expert") {
      setCurrentView("expertForm")
    } else {
      setCurrentView("nonExpertForm")
    }
  }

  const handleRecommendations = (laptops) => {
    setRecommendations(laptops)
    setCurrentView("recommendations")
  }

  const handleSelectLaptop = (laptop) => {
    setSelectedLaptop(laptop)
    setCurrentView("laptopDetail")
  }

  const handleBack = () => {
    if (currentView === "laptopDetail") {
      setCurrentView("recommendations")
    } else if (currentView === "recommendations") {
      setCurrentView("userType")
    } else if (currentView === "expertForm" || currentView === "nonExpertForm") {
      setCurrentView("userType")
    } else if (currentView === "userType") {
      handleLogout()
    }
  }

  const renderView = () => {
    switch (currentView) {
      case "login":
        return <LoginForm onLogin={handleLogin} onSwitchToSignup={() => setCurrentView("signup")} />
      case "signup":
        return <SignupForm onSignup={handleLogin} onSwitchToLogin={() => setCurrentView("login")} />
      case "userType":
        return <UserTypeSelection onSelect={handleUserTypeSelect} />
      case "nonExpertForm":
        return <NonExpertForm onSubmit={handleRecommendations} onBack={handleBack} />
      case "expertForm":
        return <ExpertForm onSubmit={handleRecommendations} onBack={handleBack} />
      case "recommendations":
        return <Recommendations laptops={recommendations} onSelect={handleSelectLaptop} onBack={handleBack} />
      case "laptopDetail":
        return <LaptopDetail laptop={selectedLaptop} onBack={handleBack} />
      case "admin":
        return <AdminDashboard onLogout={handleLogout} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {user && currentView !== "login" && currentView !== "signup" && (
        <Header user={user} onLogout={handleLogout} currentView={currentView} />
      )}
      <main>{renderView()}</main>
    </div>
  )
}
