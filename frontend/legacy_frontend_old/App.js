import { StatusBar } from "expo-status-bar"
import { NavigationContainer } from "@react-navigation/native"
import { AuthProvider } from "./hooks/useAuth"
import RootNavigator from "./navigation/RootNavigator"

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  )
}
