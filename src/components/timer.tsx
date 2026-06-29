import { useEffect, useState } from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface TimerProps {
  isActive: boolean;
  onTick?: (seconds: number) => void;
}

export function Timer({ isActive, onTick }: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          onTick?.(next);
          return next;
        });
      }, 1000);
    } else {
      setSeconds(0);
    }

    return () => clearInterval(interval);
  }, [isActive, onTick]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <View
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.full,
      }}
    >
      <Text
        style={{
          ...Typography.displaySmall,
          color: colors.danger,
          fontVariant: ['tabular-nums'],
        }}
      >
        {timeString}
      </Text>
    </View>
  );
}
