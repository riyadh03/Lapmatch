"use client"

// Authentication Hook & Context
// This manages user authentication state throughout the app
// FIREBASE INTEGRATION: Replace mock logic with Firebase Auth methods

import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/authService"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState(null) // 'expert' | 'non-expert' | 'admin'

  useEffect(() => {
    // FIREBASE INTEGRATION: Use onAuthStateChanged listener here
    // firebase.auth().onAuthStateChanged((user) => { ... })
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      // FIREBASE INTEGRATION: Check if user is already signed in
      const savedUser = await authService.getCurrentUser()
      setUser(savedUser)
    } catch (error) {
      console.error("Auth state check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    // FIREBASE INTEGRATION: Use signInWithEmailAndPassword
    // const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const result = await authService.login(email, password)
    setUser(result.user)
    return result
  }

  const signup = async (email, password, name) => {
    // FIREBASE INTEGRATION: Use createUserWithEmailAndPassword
    // Also update user profile with displayName
    const result = await authService.signup(email, password, name)
    setUser(result.user)
    return result
  }

  const logout = async () => {
    // FIREBASE INTEGRATION: Use signOut
    // await firebase.auth().signOut();
    await authService.logout()
    setUser(null)
    setUserType(null)
  }

  const selectUserType = (type) => {
    setUserType(type)
    // FIREBASE INTEGRATION: Optionally store user type in Firestore
    // await firestore.collection('users').doc(user.uid).update({ userType: type });
  }

  const value = {
    user,
    userType,
    loading,
    login,
    signup,
    logout,
    selectUserType,
    isAdmin: user?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
