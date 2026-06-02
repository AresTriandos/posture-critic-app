import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const modes = [
    {
      id: 'gym',
      title: '🏋️ Gym Mode',
      subtitle: 'Analyze exercise form',
      description: 'Record your workout and get real-time posture feedback',
      color: '#FF6B6B',
    },
    {
      id: 'office',
      title: '💼 Office Mode',
      subtitle: 'Monitor posture',
      description: 'Real-time posture tracking and ergonomic alerts',
      color: '#4ECDC4',
      disabled: true,
      comingSoon: true,
    },
    {
      id: 'correction',
      title: '🧘 Correction',
      subtitle: 'Corrective exercises',
      description: 'AI-recommended exercises based on your posture issues',
      color: '#95E1D3',
      disabled: true,
      comingSoon: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PostureCritic</Text>
          <Text style={styles.subtitle}>
            AI-Powered Posture Analysis
          </Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionBox}>
          <Text style={styles.description}>
            Perfect your posture in the gym, office, or anywhere. Get real-time feedback on your form and alignment.
          </Text>
        </View>

        {/* Mode Cards */}
        <View style={styles.modesContainer}>
          {modes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              onPress={() => {
                if (!mode.disabled) {
                  router.push(`/${mode.id}`);
                }
              }}
              disabled={mode.disabled}
              style={[
                styles.modeCard,
                {
                  backgroundColor: mode.color,
                  opacity: mode.disabled ? 0.5 : 1,
                },
              ]}
            >
              <View style={styles.modeContent}>
                <Text style={styles.modeTitle}>{mode.title}</Text>
                <Text style={styles.modeDescription}>
                  {mode.description}
                </Text>
                {mode.comingSoon && (
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>Coming Soon</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresSectionTitle}>v1 Features</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>✅ Real-time pose detection</Text>
            <Text style={styles.featureItem}>✅ Posture angle analysis</Text>
            <Text style={styles.featureItem}>✅ AI-powered feedback (Gemini)</Text>
            <Text style={styles.featureItem}>✅ Form scoring (0-100)</Text>
            <Text style={styles.featureItem}>✅ Session history</Text>
            <Text style={styles.featureItem}>✅ Improvement tracking</Text>
          </View>
        </View>

        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>v0.1.0 - Early Access</Text>
          <Text style={styles.versionSubtext}>
            Gym Mode in beta. Office & Correction modes coming in v2.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  descriptionBox: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  modesContainer: {
    marginBottom: 32,
    gap: 16,
  },
  modeCard: {
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
  },
  modeContent: {
    gap: 8,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modeDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    opacity: 0.9,
  },
  comingSoonBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  versionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  versionSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
});
