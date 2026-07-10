import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import {
  checkCameraPermission,
  requestCameraPermission,
  savePhotoRecord,
  generatePhotoId,
} from '@/services/camera';

export default function CameraScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const cameraRef = useRef<CameraView>(null);
  const [isCapturing, setIsCapturing] = useState(false);
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

  const capturePhoto = async () => {
    if (!cameraRef.current || !cameraReady || isCapturing) {
      Alert.alert('Camera Not Ready', 'Please wait for the camera to initialize');
      return;
    }

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });

      if (photo?.uri) {
        const record = {
          id: generatePhotoId(),
          uri: photo.uri,
          timestamp: Date.now(),
        };

        const saved = await savePhotoRecord(record);
        if (saved) {
          Alert.alert('Success', 'Photo saved successfully');
          router.push('/history');
        } else {
          Alert.alert('Error', 'Failed to save photo');
        }
      }
    } catch (error) {
      console.error('Capture failed:', error);
      Alert.alert('Capture Error', 'Failed to save photo. Please try again.');
    } finally {
      setIsCapturing(false);
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

            {/* Bottom: Capture button */}
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
                  backgroundColor: isCapturing ? colors.danger : colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 4,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
                onPress={capturePhoto}
                disabled={!cameraReady || isCapturing}
              >
                <Text style={{ fontSize: 32 }}>●</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}
