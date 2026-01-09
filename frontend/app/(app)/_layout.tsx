import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="non-expert" />
      <Stack.Screen name="expert" />
      <Stack.Screen name="recommendations" />
      <Stack.Screen name="laptop/[id]" />
    </Stack>
  );
}
