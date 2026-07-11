import { View, Text, ScrollView, useColorScheme, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Button } from '@/components/button';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

const FEATURES = [
  {
    icon: 'body' as const,
    title: 'Real-time Analysis',
    description: 'AI analyzes your posture as you move',
  },
  {
    icon: 'checkmark-circle' as const,
    title: 'Form Correction',
    description: 'Get instant feedback on body alignment',
  },
  {
    icon: 'bar-chart' as const,
    title: 'Progress Tracking',
    description: 'Monitor improvements over time',
  },
  {
    icon: 'shield-checkmark' as const,
    title: 'Private Training',
    description: 'Your photos stay secure locally',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.xl,
          paddingBottom: Spacing['3xl'],
        }}
      >
        {/* Hero Section */}
        <View
          style={{
            marginBottom: Spacing['3xl'],
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: BorderRadius.xl,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: Spacing.xl,
            }}
          >
            <Ionicons name="body" size={40} color="#FFFFFF" />
          </View>

          <Text
            style={{
              ...Typography.displaySmall,
              color: colors.text,
              marginBottom: Spacing.md,
              textAlign: 'center',
            }}
          >
            PostureCritic
          </Text>

          <Text
            style={{
              ...Typography.bodyLarge,
              color: colors.textSecondary,
              textAlign: 'center',
              marginBottom: Spacing.xl,
              lineHeight: 24,
            }}
          >
            AI-powered posture and form analyzer for perfect alignment
          </Text>
        </View>

        {/* CTA Button */}
        <Button
          label="📷 Take a photo of your posture"
          onPress={() => router.push('/camera')}
          variant="primary"
          size="lg"
          style={{
            marginBottom: Spacing['2xl'],
          }}
        />

        {/* Features */}
        <View
          style={{
            gap: Spacing.md,
            marginBottom: Spacing.xl,
          }}
        >
          <Text
            style={{
              ...Typography.headingSmall,
              color: colors.text,
              marginBottom: Spacing.md,
            }}
          >
            Why PostureCritic?
          </Text>

          {FEATURES.map((feature, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: Spacing.lg,
                backgroundColor: colors.surface,
                padding: Spacing.lg,
                borderRadius: BorderRadius.md,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: BorderRadius.md,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Ionicons name={feature.icon} size={24} color="#FFFFFF" />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    ...Typography.labelLarge,
                    color: colors.text,
                    marginBottom: Spacing.xs,
                  }}
                >
                  {feature.title}
                </Text>
                <Text
                  style={{
                    ...Typography.bodySmall,
                    color: colors.textSecondary,
                    lineHeight: 18,
                  }}
                >
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Secondary CTA */}
        <Button
          label="View History"
          onPress={() => router.push('/history')}
          variant="secondary"
          size="md"
          icon={<Ionicons name="time" size={18} color={colors.primary} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
