import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'PostureCritic' }} />
      <Stack.Screen name="camera" options={{ title: 'Record Posture' }} />
    </Stack>
  );
}
