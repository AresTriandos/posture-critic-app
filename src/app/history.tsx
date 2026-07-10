import { useEffect, useState } from 'react';
import { View, Text, ScrollView, useColorScheme, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/button';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { getPhotoRecords, deletePhotoRecord, PhotoRecord } from '@/services/camera';

export default function HistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reload photos when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadPhotos();
    }, [])
  );

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const records = await getPhotoRecords();
      setPhotos(records);
    } catch (error) {
      console.error('Failed to load photos:', error);
      Alert.alert('Error', 'Failed to load photo history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const deleted = await deletePhotoRecord(id);
          if (deleted) {
            setPhotos((prev) => prev.filter((p) => p.id !== id));
          }
        },
      },
    ]);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: Spacing.xl,
          }}
        >
          <Text
            style={{
              ...Typography.headingLarge,
              color: colors.text,
            }}
          >
            History
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={{ alignItems: 'center', paddingVertical: Spacing['2xl'] }}>
            <Text style={{ ...Typography.bodyMedium, color: colors.textSecondary }}>
              Loading...
            </Text>
          </View>
        ) : photos.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: Spacing['3xl'] }}>
            <Ionicons
              name="camera-outline"
              size={64}
              color={colors.textTertiary}
              style={{ marginBottom: Spacing.lg }}
            />
            <Text
              style={{
                ...Typography.headingSmall,
                color: colors.textSecondary,
                marginBottom: Spacing.md,
                textAlign: 'center',
              }}
            >
              No photos yet
            </Text>
            <Text
              style={{
                ...Typography.bodyMedium,
                color: colors.textTertiary,
                textAlign: 'center',
                marginBottom: Spacing.xl,
              }}
            >
              Take your first posture photo to get started
            </Text>
            <Button
              label="Take Photo"
              onPress={() => router.push('/camera')}
              variant="primary"
              size="lg"
              icon={<Ionicons name="camera" size={20} color="#FFFFFF" />}
            />
          </View>
        ) : (
          <View style={{ gap: Spacing.md }}>
            <Text
              style={{
                ...Typography.bodyMedium,
                color: colors.textSecondary,
                marginBottom: Spacing.md,
              }}
            >
              {photos.length} photo{photos.length !== 1 ? 's' : ''}
            </Text>

            {photos.map((photo) => (
              <View
                key={photo.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: BorderRadius.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: Spacing.lg,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: Spacing.lg,
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: BorderRadius.md,
                    backgroundColor: colors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Ionicons name="camera" size={28} color="#FFFFFF" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      ...Typography.labelLarge,
                      color: colors.text,
                      marginBottom: Spacing.xs,
                    }}
                  >
                    {formatDate(photo.timestamp)}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleDelete(photo.id)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: BorderRadius.md,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="trash" size={20} color={colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Add React import for useFocusEffect
import React from 'react';
