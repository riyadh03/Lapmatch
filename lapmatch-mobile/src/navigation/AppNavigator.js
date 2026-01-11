// import { NavigationContainer } from '@react-navigation/native';
// import MainTabs from './MainTabs';

// export default function AppNavigator() {
//   return (
//     <NavigationContainer>
//       <MainTabs />
//     </NavigationContainer>
//   );
// }

import { NavigationContainer } from '@react-navigation/native';
import MainTabs from './MainTabs';
import AdminDashboard from '../screens/admin/AdminDashboard'; 
import ManageLaptops from '../screens/admin/ManageLaptops';
import ManageUsers from '../screens/admin/ManageUsers';


export default function AppNavigator() {
  return (
    <ManageUsers/>
    // </AdminDashboard>
  );
}
