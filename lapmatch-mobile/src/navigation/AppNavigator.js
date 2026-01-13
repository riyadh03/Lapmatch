import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import MainTabs from './MainTabs';

export default function AppNavigator() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#12122C',
    },
  };

  return (
    <NavigationContainer theme={theme}>
      <MainTabs />
    </NavigationContainer>
  );
}
