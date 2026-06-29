import { useEffect, useState } from 'react';
import { View, Text, ScrollView, useColorScheme, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/button';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { getVideoRecords, deleteVideoRecord, VideoRecord } from '@/services/camera';

export default function HistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reload videos when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadVideos();
    }, [])
  );

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      const records = await getVideoRecords();
      setVideos(records);
    } catch (error) {
      console.error('Failed to load videos:', error);
      Alert.alert('Error', 'Failed to load video history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Video', 'Are you sure you want to delete this video?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const deleted = await deleteVideoRecord(id);
          if (deleted) {
            setVideos((prev) => prev.filter((v) => v.id !== id));
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

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        ) : videos.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: Spacing['3xl'] }}>
            <Ionicons
              name="videocam-off"
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
              No videos yet
            </Text>
            <Text
              style={{
                ...Typography.bodyMedium,
                color: colors.textTertiary,
                textAlign: 'center',
                marginBottom: Spacing.xl,
              }}
            >
              Record your first workout to get started
            </Text>
            <Button
              label="Record Workout"
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
              {videos.length} video{videos.length !== 1 ? 's' : ''}
            </Text>

            {videos.map((video) => (
              <View
                key={video.id}
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
                  <Ionicons name="videocam" size={28} color="#FFFFFF" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      ...Typography.labelLarge,
                      color: colors.text,
                      marginBottom: Spacing.xs,
                    }}
                  >
                    {formatDate(video.timestamp)}
                  </Text>
                  <Text
                    style={{
                      ...Typography.bodySmall,
                      color: colors.textSecondary,
                    }}
                  >
                    Duration: {formatDuration(video.duration)}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleDelete(video.id)}
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
