import { View, Text, ScrollView, useColorScheme, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Button } from '@/components/button';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

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
        {/* Logo + title */}
        <View
          style={{
            marginBottom: Spacing['2xl'],
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../../assets/icon.png')}
            style={{
              width: 96,
              height: 96,
              borderRadius: BorderRadius.xl,
              marginBottom: Spacing.lg,
            }}
          />

          <Text
            style={{
              ...Typography.displaySmall,
              color: colors.text,
              marginBottom: Spacing.xs,
              textAlign: 'center',
            }}
          >
            PostureCritic
          </Text>

          <Text
            style={{
              ...Typography.bodyMedium,
              color: colors.textSecondary,
              textAlign: 'center',
            }}
          >
            AI posture evaluation and coaching
          </Text>
        </View>

        {/* Primary CTA */}
        <Button
          label="📷 Take a photo of your posture"
          onPress={() => router.push('/camera')}
          variant="primary"
          size="lg"
          style={{
            marginBottom: Spacing.md,
          }}
        />

        {/* How it works */}
        <View
          style={{
            flexDirection: 'row',
            gap: Spacing.md,
            backgroundColor: colors.surface,
            padding: Spacing.lg,
            borderRadius: BorderRadius.md,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: Spacing.md,
          }}
        >
          <Ionicons
            name="help-circle-outline"
            size={22}
            color={colors.primary}
            style={{ marginTop: 2 }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                ...Typography.labelLarge,
                color: colors.text,
                marginBottom: Spacing.xs,
              }}
            >
              How it works
            </Text>
            <Text
              style={{
                ...Typography.bodySmall,
                color: colors.textSecondary,
                lineHeight: 18,
              }}
            >
              Take a photo from the side or front of you standing or sitting at your desk to
              get a posture evaluation and recommendations.
            </Text>
          </View>
        </View>

        {/* Progress tracking */}
        <TouchableOpacity
          onPress={() => router.push('/history')}
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            gap: Spacing.md,
            backgroundColor: colors.surface,
            padding: Spacing.lg,
            borderRadius: BorderRadius.md,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons
            name="trending-up-outline"
            size={22}
            color={colors.primary}
            style={{ marginTop: 2 }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                ...Typography.labelLarge,
                color: colors.text,
                marginBottom: Spacing.xs,
              }}
            >
              Progress tracking
            </Text>
            <Text
              style={{
                ...Typography.bodySmall,
                color: colors.textSecondary,
                lineHeight: 18,
              }}
            >
              Review past photos and improvements over time. All photos are stored locally on
              your device.
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
