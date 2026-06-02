import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen 
          name="gym" 
          options={{
            presentation: 'modal',
            animationEnabled: true,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
