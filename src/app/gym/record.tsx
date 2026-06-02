import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  CameraType,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { usePoseDetection } from '../../hooks/usePoseDetection';

const EXERCISES: Record<string, string> = {
  squat: 'Squat',
  deadlift: 'Deadlift',
  bench: 'Bench Press',
  row: 'Row',
  other: 'Other',
};

export default function GymRecordScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const exercise = (params.exercise as string) || 'other';
  const exerciseName = EXERCISES[exercise] || 'Exercise';

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const cameraRef = useRef<CameraView>(null);

  const poseDetection = usePoseDetection(true);

  // Request camera permission
  React.useEffect(() => {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
    }
  }, [cameraPermission?.granted, requestCameraPermission]);

  if (!cameraPermission?.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            PostureCritic needs access to your camera to analyze your posture
          </Text>
          <TouchableOpacity
            onPress={requestCameraPermission}
            style={styles.permissionButton}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleStartRecording = async () => {
    if (!cameraRef.current) return;

    try {
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      const interval = setInterval(() => {
        setRecordingTime((t) => {
          if (t >= 30) {
            clearInterval(interval);
            handleStopRecording();
            return 30;
          }
          return t + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    if (!cameraRef.current) return;

    try {
      setIsRecording(false);
      
      // Note: Real video recording requires native modules (expo-av or react-native-vision-camera)
      // For MVP testing, we'll generate a mock video file
      
      try {
        // Create a minimal MP4 file for testing Lambda
        const videoDir = `${FileSystem.cacheDirectory}PostureCritic/`;
        await FileSystem.makeDirectoryAsync(videoDir, { intermediates: true });
        
        const videoUri = `${videoDir}test_${Date.now()}.mp4`;
        
        // Create a minimal valid MP4 file (for testing purposes)
        // In production, this would be actual video from the camera
        const minimalMp4 = 'AAAA';
        await FileSystem.writeAsStringAsync(videoUri, minimalMp4, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        console.log('Mock video saved:', videoUri);
        
        router.push({
          pathname: '/gym/results',
          params: {
            exercise: exerciseName,
            video: videoUri,
            recordingTime: recordingTime.toString(),
          },
        });
      } catch (fileError) {
        console.error('File system error:', fileError);
        // Fallback: pass video as file:// URI
        router.push({
          pathname: '/gym/results',
          params: {
            exercise: exerciseName,
            video: `file://${FileSystem.documentDirectory}test_video.mp4`,
            recordingTime: recordingTime.toString(),
          },
        });
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to process recording');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{exerciseName}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Camera Preview */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="front"
          mode="video"
        >
          {/* Recording Indicator */}
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingTime}>{recordingTime}s</Text>
            </View>
          )}

          {/* Pose Overlay Guidance */}
          <View style={styles.poseGuidance}>
            <Text style={styles.guidanceText}>
              {isRecording
                ? 'Recording... Keep full body in frame'
                : 'Position yourself in the frame'}
            </Text>
          </View>
        </CameraView>
      </View>

      {/* Instructions */}
      <ScrollView style={styles.instructionsContainer}>
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>Recording Tips:</Text>
          <Text style={styles.instructionItem}>📱 Keep your full body in frame</Text>
          <Text style={styles.instructionItem}>💡 Good lighting helps accuracy</Text>
          <Text style={styles.instructionItem}>⏱️ Record for 10-30 seconds</Text>
          <Text style={styles.instructionItem}>🎯 Perform the exercise normally</Text>
        </View>
      </ScrollView>

      {/* Recording Controls */}
      <View style={styles.controls}>
        {!isRecording ? (
          <TouchableOpacity
            onPress={handleStartRecording}
            style={styles.recordButton}
          >
            <Text style={styles.recordButtonText}>● START RECORDING</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleStopRecording}
            style={[styles.recordButton, styles.recordButtonActive]}
          >
            <Text style={styles.recordButtonText}>■ STOP RECORDING</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 50,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    gap: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  recordingTime: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  poseGuidance: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  guidanceText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: '#CCC',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  instructionsBox: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  instructionItem: {
    fontSize: 13,
    color: '#CCC',
    marginBottom: 6,
    lineHeight: 18,
  },
  controls: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  recordButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: '#CC0000',
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
