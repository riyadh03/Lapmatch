// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';

// import AppStack from './AppStack';
// import LogoutScreen from '../screens/LogoutScreen';
// import FavorisScreen from '../screens/FavorisScreen';


// const Tab = createBottomTabNavigator();

// export default function MainTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarIcon: ({ color, size }) => {
//           const iconName =
//             route.name === 'HomeTab' ? 'home' : 'log-out';

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarStyle: { backgroundColor: '#12122C', borderTopWidth: 0, elevation: 0, shadowOpacity: 0,},
//         tabBarActiveTintColor: '#1E88E5',
//         tabBarInactiveTintColor: '#aaa',
//       })}
//     >
//       <Tab.Screen
//         name="HomeTab"
//         component={AppStack}
//         options={{ title: 'Home' }}
//       />
//        <Tab.Screen
//         name="Favoris"
//         component={FavorisScreen}
//         options={{ title: 'Favoris' }}
//       />
//       <Tab.Screen
//         name="Logout"
//         component={LogoutScreen}
//       />
     
//     </Tab.Navigator>
//   );
// }

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import AppStack from './AppStack';
import LogoutScreen from '../screens/LogoutScreen';
import FavorisScreen from '../screens/FavorisScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') iconName = 'home';
          else if (route.name === 'Favoris') iconName = 'star';
          else if (route.name === 'Logout') iconName = 'log-out';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E88E5',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#12122C',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      })}
    >
      {/* <Tab.Screen
        name="HomeTab"
        component={AppStack}
        options={({ route }) => {
          // 🔹 cacher le TabBar si la route active dans AppStack est Login ou Signup
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
          return {
            title: 'Home',
            tabBarStyle: routeName === 'Login' || routeName === 'Signup'
              ? { display: 'none' }
              : {
                  backgroundColor: '#12122C',
                  borderTopWidth: 0,
                  elevation: 0,
                  shadowOpacity: 0,
                },
          };
        }}
      /> */}

<Tab.Screen
  name="HomeTab"
  component={AppStack}
  options={({ route }) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
    return {
      title: 'Home',
      tabBarStyle: routeName === 'Login' || routeName === 'Signup'
        ? { display: 'none' }
        : {
            backgroundColor: '#12122C',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
    };
  }}
  listeners={({ navigation }) => ({
    tabPress: (e) => {
      e.preventDefault(); // empêche le comportement par défaut
      navigation.navigate('HomeTab', { screen: 'Home' }); // 🔹 forcer la navigation sur Home
    },
  })}
/>


      <Tab.Screen
        name="Favoris"
        component={FavorisScreen}
        options={{ title: 'Favoris' }}
      />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
      />
    </Tab.Navigator>
  );
}
