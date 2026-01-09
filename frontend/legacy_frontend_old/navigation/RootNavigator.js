"use client"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAuth } from "../hooks/useAuth"
import { ActivityIndicator, View } from "react-native"

// Auth Screens
import LoginScreen from "../screens/LoginScreen"
import SignupScreen from "../screens/SignupScreen"

// User Screens
import UserTypeSelectionScreen from "../screens/UserTypeSelectionScreen"
import NonExpertFormScreen from "../screens/NonExpertFormScreen"
import ExpertFormScreen from "../screens/ExpertFormScreen"
import RecommendationsScreen from "../screens/RecommendationsScreen"
import LaptopDetailsScreen from "../screens/LaptopDetailsScreen"

// Admin Screens
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen"
import ManageLaptopsScreen from "../screens/admin/ManageLaptopsScreen"
import AddEditLaptopScreen from "../screens/admin/AddEditLaptopScreen"
import ManageUsersScreen from "../screens/admin/ManageUsersScreen"

const Stack = createNativeStackNavigator()

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  )
}

function UserStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1a1a2e" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen
        name="UserTypeSelection"
        component={UserTypeSelectionScreen}
        options={{ title: "Select User Type" }}
      />
      <Stack.Screen name="NonExpertForm" component={NonExpertFormScreen} options={{ title: "Find Your Laptop" }} />
      <Stack.Screen name="ExpertForm" component={ExpertFormScreen} options={{ title: "Advanced Search" }} />
      <Stack.Screen name="Recommendations" component={RecommendationsScreen} options={{ title: "Recommendations" }} />
      <Stack.Screen name="LaptopDetails" component={LaptopDetailsScreen} options={{ title: "Laptop Details" }} />
    </Stack.Navigator>
  )
}

function AdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#0f0f23" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: "Admin Dashboard" }} />
      <Stack.Screen name="ManageLaptops" component={ManageLaptopsScreen} options={{ title: "Manage Laptops" }} />
      <Stack.Screen
        name="AddEditLaptop"
        component={AddEditLaptopScreen}
        options={({ route }) => ({
          title: route.params?.laptop ? "Edit Laptop" : "Add Laptop",
        })}
      />
      <Stack.Screen name="ManageUsers" component={ManageUsersScreen} options={{ title: "Manage Users" }} />
    </Stack.Navigator>
  )
}

export default function RootNavigator() {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1a1a2e" }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    )
  }

  if (!user) {
    return <AuthStack />
  }

  if (isAdmin) {
    return <AdminStack />
  }

  return <UserStack />
}
