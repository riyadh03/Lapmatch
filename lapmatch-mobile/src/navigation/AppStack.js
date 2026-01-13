import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import SimpleSearchScreen from '../screens/SimpleSearchScreen';
import AdvancedSearchScreen from '../screens/AdvancedSearchScreen';
import ResultsScreen from '../screens/ResultsScreen';
import PcDetailsScreen from '../screens/PcDetailsScreen';
import PcComparisonScreen from '../screens/PcComparison';
import SearchByNameScreen from '../screens/SearchByNameScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import ManageLaptops from '../screens/admin/ManageLaptops';
import ManageUsers from '../screens/admin/ManageUsers';
const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Login"
    screenOptions={{
    headerStyle: { backgroundColor: '#12122C' }, // couleur du header
    headerTintColor: '#fff', // couleur des textes et flèches
    headerTitleStyle: { fontWeight: 'bold', fontSize: 18 }, // style du titre
  }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SimpleSearch" component={SimpleSearchScreen} />
      <Stack.Screen name="AdvancedSearch" component={AdvancedSearchScreen} />
      <Stack.Screen name="SearchByName" component={SearchByNameScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="PcDetails" component={PcDetailsScreen} />
      <Stack.Screen name="PcComparison" component={PcComparisonScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="ManageLaptops" component={ManageLaptops} options={{ headerShown: false }} />
      <Stack.Screen name="ManageUsers" component={ManageUsers} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
