import React from 'react';
import { Stack } from 'expo-router';

export default function GymLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="record" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="results" />
    </Stack>
  );
}
