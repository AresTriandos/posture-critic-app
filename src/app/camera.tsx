import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, useColorScheme, Alert, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Timer } from '@/components/timer';
import { Button } from '@/components/button';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import {
  checkCameraPermission,
  requestCameraPermission,
  saveVideoRecord,
  generateVideoId,
} from '@/services/camera';

export default function CameraScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const cameraRef = useRef<CameraView>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const granted = await checkCameraPermission();
      if (!granted) {
        const requested = await requestCameraPermission();
        setHasPermission(requested);
      } else {
        setHasPermission(true);
      }
    } catch (error) {
      console.error('Permission check failed:', error);
      Alert.alert('Error', 'Failed to check camera permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    if (!cameraRef.current || !cameraReady) {
      Alert.alert('Camera Not Ready', 'Please wait for the camera to initialize');
      return;
    }

    try {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync();

      if (video?.uri) {
        // Save video record
        const record = {
          id: generateVideoId(),
          uri: video.uri,
          timestamp: Date.now(),
          duration: recordingTime,
        };

        const saved = await saveVideoRecord(record);
        if (saved) {
          Alert.alert('Success', 'Video saved successfully');
          router.push('/history');
        } else {
          Alert.alert('Error', 'Failed to save video');
        }
      }
    } catch (error) {
      console.error('Recording failed:', error);
      Alert.alert('Recording Error', 'Failed to save video. Please try again.');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      try {
        await cameraRef.current.stopRecording();
        setIsRecording(false);
      } catch (error) {
        console.error('Stop recording failed:', error);
      }
    }
  };

  const handleRecordPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Permission denied UI
  if (!isLoading && !hasPermission) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          padding: Spacing.xl,
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              ...Typography.headingSmall,
              color: colors.text,
              marginBottom: Spacing.lg,
              textAlign: 'center',
            }}
          >
            Camera Permission Required
          </Text>
          <Text
            style={{
              ...Typography.bodyMedium,
              color: colors.textSecondary,
              marginBottom: Spacing.xl,
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            PostureCritic needs camera access to analyze your posture.
          </Text>
          <Button
            label="Grant Permission"
            onPress={checkPermissions}
            variant="primary"
            size="lg"
          />
          <Button
            label="Go Back"
            onPress={() => router.back()}
            variant="secondary"
            size="md"
            style={{ marginTop: Spacing.lg }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {hasPermission && (
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="front"
          onCameraReady={() => setCameraReady(true)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: Spacing.xl,
              paddingHorizontal: Spacing.lg,
            }}
          >
            {/* Top: Back button */}
            <TouchableOpacity
              style={{
                width: 44,
                height: 44,
                borderRadius: BorderRadius.full,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'flex-start',
              }}
              onPress={() => router.back()}
            >
              <Text style={{ fontSize: 24 }}>✕</Text>
            </TouchableOpacity>

            {/* Middle: Timer */}
            {isRecording && <Timer isActive={isRecording} onTick={setRecordingTime} />}

            {/* Bottom: Record/Stop button */}
            <View
              style={{
                flexDirection: 'row',
                gap: Spacing.lg,
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: BorderRadius.full,
                  backgroundColor: isRecording ? colors.danger : colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 4,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
                onPress={handleRecordPress}
                disabled={!cameraReady}
              >
                <Text style={{ fontSize: 32 }}>{isRecording ? '⊢' : '●'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
